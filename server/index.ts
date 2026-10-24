import type { ZodType } from "zod";
import express, {
  type Express,
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import {
  careerSchema,
  contactSchema,
  requestSchema,
  type ApiStatus,
  type SubmissionResult,
} from "../src/shared/schemas.ts";
import { config, describeConfig } from "./config.ts";
import { createRateLimiter } from "./rate-limit.ts";
import {
  closeStore,
  initStore,
  insertSubmission,
  setForwardState,
  storageDescription,
  uploadsEnabled,
  type Stream,
  type StoredSubmission,
} from "./store.ts";
import { notifySubmission } from "./notify.ts";
import {
  cvSizeMessage,
  cvTypeMessage,
  isAllowedExtension,
  readMultipart,
  removeCv,
  saveCv,
} from "./upload.ts";
import {
  formFieldsToPayload,
  genericRejectBody,
  honeypotFilled,
  isPlainObject,
  VALIDATION_MESSAGE,
  validationBody,
} from "./validate.ts";

/**
 * Septa API — contact, service-request and career submissions.
 *
 *   GET  /api/status | /api/health                  -> ApiStatus
 *   POST /api/contact | /api/request | /api/careers -> SubmissionResult
 *
 * `ok: true` is returned only for a row that was written to SQLite. Validation
 * problems are 422, honeypot traffic is a generic 422 with nothing stored, and a
 * storage failure is 500. Uploaded CVs are never served over HTTP.
 */

const STORAGE_FAILURE_MESSAGE = "We could not save your submission on our side. Please try again shortly.";

function applySecurityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  next();
}

/** Manual CORS: only origins listed in ALLOWED_ORIGINS may call the API. */
function corsGate(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin;
  if (origin && config.allowedOrigins.includes(origin)) {
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
    res.setHeader("Access-Control-Max-Age", "600");
  }
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
}

function isMultipart(req: Request): boolean {
  return (req.headers["content-type"] ?? "").toLowerCase().includes("multipart/form-data");
}

/**
 * Row first, email second: a submission is only ever reported as accepted after it has
 * been written. The forwarded flag and its note are recorded afterwards.
 */
async function persistAndNotify(
  stream: Stream,
  payload: Record<string, unknown>,
  cvPath: string | null,
): Promise<StoredSubmission> {
  const stored = insertSubmission({ stream, payload, cvPath });

  try {
    const delivery = await notifySubmission(stored);
    try {
      setForwardState({
        stream,
        id: stored.id,
        forwarded: delivery.forwarded,
        note: delivery.note,
      });
      stored.forwarded = delivery.forwarded;
      stored.forwardNote = delivery.note;
    } catch (error) {
      // The row is durable; only the forwarding result could not be written.
      console.error(`[api] could not record the forwarding state for ${stored.id}:`, error);
      stored.forwardNote = "Saved, but the forwarding result could not be written to the database.";
    }
  } catch (error) {
    // notifySubmission never throws, so this is a safety net only.
    console.error(`[api] unexpected notification error for ${stored.id}:`, error);
    stored.forwardNote = "Saved, but the email notification could not be completed.";
  }

  return stored;
}

function toResult(stored: StoredSubmission): SubmissionResult {
  const result: SubmissionResult = {
    ok: true,
    id: stored.id,
    receivedAt: stored.createdAt,
    forwarded: stored.forwarded,
  };
  if (!stored.forwarded && stored.forwardNote) result.note = stored.forwardNote;
  return result;
}

/** Shared tail for every submission that passed validation. */
async function accept(
  stream: Stream,
  payload: Record<string, unknown>,
  cvPath: string | null,
  res: Response,
): Promise<void> {
  try {
    const stored = await persistAndNotify(stream, payload, cvPath);
    res.status(201).json(toResult(stored));
  } catch (error) {
    if (cvPath) await removeCv(cvPath);
    console.error(`[api] storage failure during a ${stream} submission:`, error);
    if (!res.headersSent) res.status(500).json({ message: STORAGE_FAILURE_MESSAGE });
  }
}

/** JSON route: honeypot check, zod check, then persist. */
async function handleJson(schema: ZodType, stream: Stream, req: Request, res: Response): Promise<void> {
  const body: unknown = req.body;

  if (honeypotFilled(body)) {
    // Bot traffic: a plain rejection, no field map, and nothing stored.
    res.status(422).json(genericRejectBody());
    return;
  }

  const parsed = schema.safeParse(isPlainObject(body) ? body : {});
  if (!parsed.success) {
    res.status(422).json(validationBody(parsed.error));
    return;
  }

  await accept(stream, parsed.data as Record<string, unknown>, null, res);
}

/** Multipart careers submission: text fields plus an optional `cv` file part. */
async function handleMultipart(req: Request, res: Response): Promise<void> {
  const parsed = await readMultipart(req);

  if (parsed.failure === "malformed" || parsed.failure === "timeout") {
    res.status(400).json({ message: "We could not read that upload. Please try again." });
    return;
  }
  if (
    parsed.failure === "unexpected-field" ||
    parsed.failure === "too-many-fields" ||
    parsed.failure === "field-too-large"
  ) {
    res.status(400).json({ message: "That upload contained more data than this form accepts." });
    return;
  }
  if (parsed.failure === "too-many-files" || parsed.tooManyFiles) {
    res.status(422).json({
      message: VALIDATION_MESSAGE,
      errors: { cvFileName: "Only one CV file can be sent." },
    });
    return;
  }

  if (honeypotFilled(parsed.fields)) {
    res.status(422).json(genericRejectBody());
    return;
  }

  if (parsed.fileTooLarge) {
    res.status(422).json({ message: VALIDATION_MESSAGE, errors: { cvFileName: cvSizeMessage() } });
    return;
  }

  const file = parsed.file;
  const hasFile = file !== null && file.size > 0;
  if (hasFile && !isAllowedExtension(file.extension)) {
    res.status(422).json({ message: VALIDATION_MESSAGE, errors: { cvFileName: cvTypeMessage() } });
    return;
  }

  const payload = formFieldsToPayload(parsed.fields, careerSchema.shape);
  if (hasFile) {
    payload.cvFileName = file.originalName;
    payload.cvSizeBytes = file.size;
  }

  const checked = careerSchema.safeParse(payload);
  if (!checked.success) {
    // Nothing has been written to disk or to the database at this point.
    res.status(422).json(validationBody(checked.error));
    return;
  }

  let cvPath: string | null = null;
  if (hasFile) {
    try {
      const saved = await saveCv(file);
      cvPath = saved.cvPath;
    } catch (error) {
      console.error("[api] the CV could not be written to disk:", error);
      res.status(500).json({ message: "We could not store the uploaded CV. Please try again." });
      return;
    }
  }

  await accept("applications", checked.data as Record<string, unknown>, cvPath, res);
}

function statusBody(): ApiStatus {
  return {
    ok: true,
    backend: "septa-api",
    storage: storageDescription(),
    emailDelivery: config.emailDeliveryEnabled,
    uploadsEnabled: uploadsEnabled(),
    mode: config.emailDeliveryEnabled ? "live" : "record-only",
  };
}

export function createApp(): Express {
  const app = express();
  app.disable("x-powered-by");
  if (config.trustProxy !== false) app.set("trust proxy", config.trustProxy);

  app.use(applySecurityHeaders);
  app.use(corsGate);
  app.use(express.json({ limit: config.jsonBodyLimitBytes }));

  const limiter = (name: string) =>
    createRateLimiter({ name, max: config.rateLimit.max, windowMs: config.rateLimit.windowMs });

  const handleContact: RequestHandler = (req, res) => handleJson(contactSchema, "contact", req, res);
  const handleRequest: RequestHandler = (req, res) => handleJson(requestSchema, "requests", req, res);

  const handleStatus = (_req: Request, res: Response) => {
    try {
      res.status(200).json(statusBody());
    } catch (error) {
      // Honest degradation: the API is up but its store is not usable.
      console.error("[api] status check failed:", error);
      res.status(500).json({
        ok: false,
        backend: "septa-api",
        storage: "sqlite:unavailable",
        emailDelivery: config.emailDeliveryEnabled,
        uploadsEnabled: false,
        mode: "record-only",
        message: "The API is running but its storage is not reachable.",
      });
    }
  };

  app.get("/api/status", handleStatus);
  app.get("/api/health", handleStatus);

  const handleCareers: RequestHandler = async (req, res) => {
    if (isMultipart(req)) {
      await handleMultipart(req, res);
      return;
    }
    await handleJson(careerSchema, "applications", req, res);
  };

  app.post("/api/contact", limiter("contact"), handleContact);
  app.post("/api/request", limiter("request"), handleRequest);
  app.post("/api/careers", limiter("careers"), handleCareers);

  // Anything else under /api is a JSON 404. Uploads are never mounted as static files.
  app.use("/api", (_req: Request, res: Response) => {
    res.status(404).json({ message: "Unknown API endpoint." });
  });

  // Safety net: an unexpected throw becomes a JSON 500, never an HTML stack trace.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const details = err as { type?: string };
    if (details?.type === "entity.parse.failed") {
      res.status(400).json({ message: "We could not read that request. Please try again." });
      return;
    }
    if (details?.type === "entity.too.large") {
      res.status(413).json({ message: "That submission is too large to be accepted." });
      return;
    }
    console.error("[api] unhandled error:", err);
    if (res.headersSent) return;
    res.status(500).json({ message: STORAGE_FAILURE_MESSAGE });
  });

  return app;
}

const app = createApp();

try {
  initStore();
} catch (error) {
  console.error(`[api] the SQLite store at ${config.dbPath} could not be opened:`, error);
  console.error("[api] fix DATA_DIR / DB_PATH (or its permissions) and start the API again.");
  process.exit(1);
}

const server = app.listen(config.port, config.host, () => {
  console.log(`[api] septa-api listening on http://${config.host}:${config.port}`);
  console.log(`[api] ${describeConfig()}`);
  console.log(
    config.emailDeliveryEnabled
      ? "[api] mode=live — every stored submission is also emailed to the inbox address."
      : "[api] mode=record-only — submissions are stored but never emailed until SMTP is configured.",
  );
});

function shutdown(signal: string): void {
  console.log(`[api] ${signal} received — closing.`);
  server.close(() => {
    try {
      closeStore();
    } catch {
      // Already closed.
    }
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 3000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
