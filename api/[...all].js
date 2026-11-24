/* Generated from server/vercel-handler.ts by npm run build:api. Do not edit. Committed so the Vercel git build detects this Function. */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/vercel-handler.ts
var vercel_handler_exports = {};
__export(vercel_handler_exports, {
  default: () => handler
});
module.exports = __toCommonJS(vercel_handler_exports);

// server/app.ts
var import_express = __toESM(require("express"), 1);

// src/shared/schemas.ts
var import_zod = require("zod");
var text = (label, max = 400) => import_zod.z.string().trim().min(2, `${label} is required.`).max(max, `${label} must be shorter than ${max} characters.`);
var optionalText = (max = 1200) => import_zod.z.string().trim().max(max, "Please keep this under " + max + " characters.").optional().transform((v) => v && v.length > 0 ? v : void 0);
var honeypot = import_zod.z.string().optional().transform((v) => v === void 0 || v === "" ? void 0 : "spam").refine((v) => v === void 0, { message: "Spam detected." });
var consent = import_zod.z.boolean().refine((v) => v === true, "You need to accept the privacy notice before sending this.");
var emailField = import_zod.z.string().trim().min(1, "Email address is required.").max(160, "Email address is too long.").refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Enter a valid email address.");
var urlField = import_zod.z.string().trim().optional().transform((v) => v && v.length > 0 ? v : void 0).refine(
  (v) => v === void 0 || /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(v),
  "Enter a full web address starting with http:// or https://"
);
var phoneField = import_zod.z.string().trim().optional().transform((v) => v && v.length > 0 ? v : void 0).refine(
  (v) => v === void 0 || /^[+()\-.\s\d]{6,24}$/.test(v),
  "Enter a valid phone number."
);
var contactServices = [
  "AI product development",
  "Traditional product development",
  "Workflow Automation",
  "Digital Transformation",
  "Observability & Monitoring",
  "Talent Solution"
];
var contactSchema = import_zod.z.object({
  fullName: text("Name", 120),
  phone: phoneField,
  company: optionalText(120),
  email: emailField,
  service: import_zod.z.enum(contactServices, { message: "Choose the service you need from us." }),
  message: import_zod.z.string().trim().min(20, "Please add a little more detail (at least 20 characters).").max(4e3, "Please keep the message under 4,000 characters."),
  consent,
  _hp: honeypot
});
var requestServices = [
  "AI Product Development",
  "Traditional Product Development",
  "Workflow Automation",
  "Digital Transformation",
  "Observability & Monitoring",
  "Talent Solutions",
  "Other"
];
var budgetRanges = [
  "Under $5,000",
  "$5,000 \u2013 $15,000",
  "$15,000 \u2013 $50,000",
  "$50,000+",
  "Not sure yet"
];
var timelines = [
  "As soon as possible",
  "Within 1 month",
  "1 \u2013 3 months",
  "3 \u2013 6 months",
  "Later / exploring"
];
var projectStages = [
  "Just an idea",
  "Researching options",
  "Requirements defined",
  "Design exists",
  "Existing product to improve"
];
var engagementTypes = [
  "Fixed-scope project",
  "Ongoing retainer",
  "Dedicated team",
  "Advisory / audit only",
  "Not sure yet"
];
var contactMethods = ["Email", "Phone call", "Video call", "Whatever works best"];
var requestStep1 = import_zod.z.object({
  service: import_zod.z.enum(requestServices, { message: "Choose the service you need." }),
  relatedService: optionalText(120)
});
var requestStep2 = import_zod.z.object({
  projectName: text("Project or initiative name", 120),
  problem: import_zod.z.string().trim().min(20, "Describe the problem in at least 20 characters.").max(2500, "Please keep this under 2,500 characters."),
  description: import_zod.z.string().trim().min(30, "Describe the project in at least 30 characters.").max(4e3, "Please keep this under 4,000 characters."),
  outcomes: optionalText(2e3),
  technicalRequirements: optionalText(2e3)
});
var requestStep3 = import_zod.z.object({
  organisation: text("Organisation name", 140),
  budget: import_zod.z.enum(budgetRanges).optional(),
  timeline: import_zod.z.enum(timelines).optional(),
  stage: import_zod.z.enum(projectStages).optional(),
  engagement: import_zod.z.enum(engagementTypes).optional()
});
var requestStep4 = import_zod.z.object({
  fullName: text("Full name", 120),
  email: emailField,
  phone: phoneField,
  preferredContact: import_zod.z.enum(contactMethods, { message: "Pick a preferred contact method." }),
  consent,
  _hp: honeypot
});
var requestSchema = import_zod.z.object({
  ...requestStep1.shape,
  ...requestStep2.shape,
  ...requestStep3.shape,
  ...requestStep4.shape
});
var disciplines = [
  // The titles Septa has published as open roles, first, so the Apply buttons on the career page
  // can preselect them. Everything after this is an area of work rather than a live vacancy.
  "Sales Manager",
  "Digital Marketing Specialist",
  "AI / Machine Learning Engineering",
  "Backend Engineering",
  "Frontend Engineering",
  "Full-Stack Engineering",
  "Data Engineering",
  "DevOps / Platform / Observability",
  "Product Design (UI/UX)",
  "Product Management",
  "Quality Assurance",
  "Business Analysis / Consulting",
  "Something else"
];
var CV_MAX_BYTES = 4 * 1024 * 1024;
var CV_ALLOWED_EXT = ["pdf", "doc", "docx", "rtf", "txt"];
var careerSchema = import_zod.z.object({
  fullName: text("Full name", 120),
  email: emailField,
  role: import_zod.z.enum(disciplines, { message: "Choose the area you want to work in." }),
  roleDetail: optionalText(120),
  location: optionalText(120),
  portfolioUrl: urlField,
  linkedinUrl: urlField,
  note: import_zod.z.string().trim().min(20, "Tell us a little about your work (at least 20 characters).").max(3e3, "Please keep your note under 3,000 characters."),
  cvFileName: optionalText(200),
  cvSizeBytes: import_zod.z.number().int().nonnegative().optional(),
  source: import_zod.z.enum(["careers-page", "speculative"]).default("careers-page"),
  consent,
  _hp: honeypot
});
var newsletterSchema = import_zod.z.object({
  email: emailField,
  consent,
  _hp: honeypot
});
var statusSchema = import_zod.z.object({
  ok: import_zod.z.boolean(),
  backend: import_zod.z.literal("septa-api"),
  storage: import_zod.z.string(),
  emailDelivery: import_zod.z.boolean(),
  uploadsEnabled: import_zod.z.boolean(),
  mode: import_zod.z.enum(["live", "record-only"])
});
var submissionResult = import_zod.z.object({
  ok: import_zod.z.boolean(),
  id: import_zod.z.string(),
  receivedAt: import_zod.z.string(),
  /** False when the row is stored but no email integration is configured. */
  forwarded: import_zod.z.boolean(),
  note: import_zod.z.string().optional()
});

// server/config.ts
var import_node_fs = require("node:fs");
var import_node_path = require("node:path");
var projectRoot = process.cwd();
function loadDotEnv() {
  const file = (0, import_node_path.resolve)(projectRoot, ".env");
  if (!(0, import_node_fs.existsSync)(file)) return;
  try {
    if (typeof process.loadEnvFile === "function") process.loadEnvFile(file);
  } catch {
    console.error("[config] .env exists but could not be parsed \u2014 continuing with process env only.");
  }
}
loadDotEnv();
function env(name) {
  const raw = process.env[name];
  if (raw === void 0) return void 0;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
function intFromEnv(name, fallback, min, max) {
  const raw = env(name);
  if (raw === void 0) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < min || value > max) {
    console.error(`[config] ${name}="${raw}" ignored \u2014 expected an integer between ${min} and ${max}.`);
    return fallback;
  }
  return value;
}
function boolFromEnv(name, fallback) {
  const raw = env(name);
  if (raw === void 0) return fallback;
  const lower = raw.toLowerCase();
  if (["1", "true", "yes", "on"].includes(lower)) return true;
  if (["0", "false", "no", "off"].includes(lower)) return false;
  console.error(`[config] ${name}="${raw}" ignored \u2014 expected true/false.`);
  return fallback;
}
function listFromEnv(name) {
  const raw = env(name);
  if (raw === void 0) return [];
  return raw.split(",").map((entry) => entry.trim()).filter((entry) => entry.length > 0);
}
function pathFromEnv(name, fallback) {
  const raw = env(name);
  if (raw === void 0) return (0, import_node_path.resolve)(projectRoot, fallback);
  return (0, import_node_path.resolve)(projectRoot, raw);
}
var DEFAULT_ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];
var smtpUrl = env("SMTP_URL") ?? null;
var smtpHost = env("SMTP_HOST") ?? null;
var smtpPortRaw = env("SMTP_PORT");
var smtpFrom = env("SMTP_FROM") ?? null;
var smtpUser = env("SMTP_USER") ?? null;
var smtpPass = env("SMTP_PASS") ?? null;
var inboxEmail = env("INBOX_EMAIL") ?? null;
var smtpUsable = smtpUrl !== null || smtpHost !== null && smtpPortRaw !== null && smtpFrom !== null;
var smtpPort = smtpPortRaw === void 0 ? null : Number.parseInt(smtpPortRaw, 10);
var envCvMaxBytes = env("CV_MAX_BYTES");
var cvMaxBytes = (() => {
  const ceiling = CV_MAX_BYTES;
  if (envCvMaxBytes === void 0) return ceiling;
  const requested = Number.parseInt(envCvMaxBytes, 10);
  if (!Number.isFinite(requested) || requested <= 0 || requested > ceiling) {
    console.error(`[config] CV_MAX_BYTES="${envCvMaxBytes}" ignored \u2014 the shared schema allows at most ${ceiling}.`);
    return ceiling;
  }
  return requested;
})();
var cvAllowedExtensions = (() => {
  const requested = listFromEnv("CV_ALLOWED_EXT").map((ext) => ext.replace(/^\./, "").toLowerCase());
  if (requested.length === 0) return [...CV_ALLOWED_EXT];
  const intersected = CV_ALLOWED_EXT.filter((ext) => requested.includes(ext)).map((ext) => ext.toLowerCase());
  if (intersected.length === 0) {
    console.error(`[config] CV_ALLOWED_EXT="${env("CV_ALLOWED_EXT") ?? ""}" matches none of the schema list \u2014 falling back to it.`);
    return [...CV_ALLOWED_EXT];
  }
  return [...intersected];
})();
function displayPath(absolute) {
  if (!absolute.startsWith(projectRoot)) return absolute;
  const relative = absolute.slice(projectRoot.length).replace(/^[\\/]+/, "").split(/[\\/]+/).join("/");
  return relative.length > 0 ? relative : ".";
}
var dataDir = pathFromEnv("DATA_DIR", "data");
var dbPath = env("DB_PATH") === void 0 ? (0, import_node_path.resolve)(dataDir, "submissions.db") : pathFromEnv("DB_PATH", "data/submissions.db");
var uploadDir = pathFromEnv("UPLOAD_DIR", "data/uploads");
var issuedDatabaseUrl = env("DATABASE_URL") ?? env("POSTGRES_URL") ?? null;
var databaseUrl = (() => {
  const pinned = env("POSTGRES_POOL_URL");
  if (pinned !== void 0) return pinned;
  if (issuedDatabaseUrl === null) return null;
  return issuedDatabaseUrl.replace("@db.prisma.io:", "@pooled.db.prisma.io:");
})();
var blobStoreId = env("BLOB_STORE_ID") ?? null;
var blobReadWriteToken = env("BLOB_READ_WRITE_TOKEN") ?? null;
var runningOnVercel = env("VERCEL") !== void 0;
var uploadsTarget = (() => {
  if (blobReadWriteToken !== null) return "blob";
  if (blobStoreId === null) return "disk";
  return runningOnVercel ? "blob" : "none";
})();
var smtpSecureRaw = env("SMTP_SECURE");
var smtpSecure = smtpSecureRaw === void 0 ? null : boolFromEnv("SMTP_SECURE", false);
var config = {
  env: env("NODE_ENV") ?? "development",
  host: env("HOST") ?? "127.0.0.1",
  port: intFromEnv("PORT", 8787, 1, 65535),
  trustProxy: (() => {
    const raw = env("TRUST_PROXY");
    if (raw === void 0) return false;
    if (raw === "true" || raw === "1") return true;
    if (raw === "false" || raw === "0") return false;
    const asNumber = Number.parseInt(raw, 10);
    return Number.isNaN(asNumber) ? raw : asNumber;
  })(),
  projectRoot,
  dataDir,
  dbPath,
  dbPathDisplay: displayPath(dbPath),
  uploadDir,
  databaseUrl,
  uploadsTarget,
  blobStoreId,
  runningOnVercel,
  allowedOrigins: (() => {
    const configured = listFromEnv("ALLOWED_ORIGINS");
    return configured.length > 0 ? configured : DEFAULT_ALLOWED_ORIGINS;
  })(),
  jsonBodyLimitBytes: 120 * 1024,
  rateLimit: {
    max: intFromEnv("RATE_LIMIT_MAX", 8, 1, 1e4),
    windowMs: intFromEnv("RATE_LIMIT_WINDOW_MS", 6e4, 1e3, 24 * 60 * 60 * 1e3),
    enabled: boolFromEnv("RATE_LIMIT_ENABLED", true)
  },
  smtp: {
    url: smtpUrl,
    host: smtpHost,
    port: smtpPort === null || Number.isNaN(smtpPort) ? null : smtpPort,
    secure: smtpSecure,
    user: smtpUser,
    pass: smtpPass,
    from: smtpFrom,
    replyTo: env("SMTP_REPLY_TO") ?? null,
    usable: smtpUsable
  },
  inboxEmail,
  emailDeliveryEnabled: smtpUsable && inboxEmail !== null,
  notifyTimeoutMs: intFromEnv("NOTIFY_TIMEOUT_MS", 1e4, 500, 12e4),
  cvMaxBytes,
  cvAllowedExtensions
};
function storageLabel() {
  if (config.databaseUrl === null) return `sqlite:${displayPath(config.dbPath)}`;
  const host = /@([^:/]+)/.exec(config.databaseUrl)?.[1] ?? "postgres";
  return `postgres:${host}`;
}

// server/rate-limit.ts
var RATE_LIMIT_MESSAGE = "Too many submissions from this address. Please wait a minute and try again.";
var buckets = /* @__PURE__ */ new Map();
var lastSweepAt = Date.now();
function sweep(windowMs) {
  const now = Date.now();
  if (now - lastSweepAt < windowMs) return;
  lastSweepAt = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}
function createRateLimiter(options) {
  const max = options.max ?? config.rateLimit.max;
  const windowMs = options.windowMs ?? config.rateLimit.windowMs;
  const enabled = config.rateLimit.enabled;
  return (req, res, next) => {
    res.setHeader("RateLimit-Limit", String(max));
    if (!enabled) {
      res.setHeader("RateLimit-Policy", "disabled");
      next();
      return;
    }
    const key = `${options.name}|${req.ip || "unknown"}`;
    const now = Date.now();
    sweep(windowMs);
    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }
    bucket.count += 1;
    const remaining = Math.max(0, max - bucket.count);
    const resetSeconds = Math.max(0, Math.ceil((bucket.resetAt - now) / 1e3));
    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(resetSeconds));
    if (bucket.count > max) {
      res.setHeader("Retry-After", String(resetSeconds > 0 ? resetSeconds : 1));
      res.status(429).json({ message: RATE_LIMIT_MESSAGE });
      return;
    }
    next();
  };
}

// server/store.ts
var import_node_crypto = require("node:crypto");
var import_node_fs2 = require("node:fs");
var import_postgres = __toESM(require("postgres"), 1);
var streams = ["contact", "requests", "applications", "newsletter"];
var ALREADY_EXISTS = /* @__PURE__ */ new Set(["42P06", "42P07", "42710"]);
function assertUsableTable(stream) {
  if (!streams.includes(stream)) {
    throw new Error(`Unknown submission stream: ${String(stream)}`);
  }
  return stream;
}
function createTableSql(stream) {
  const table = assertUsableTable(stream);
  return `
    CREATE TABLE IF NOT EXISTS ${table} (
      id           TEXT PRIMARY KEY,
      payload      TEXT NOT NULL,
      created_at   TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'new',
      forwarded    INTEGER NOT NULL DEFAULT 0,
      forward_note TEXT,
      cv_path      TEXT
    );
    CREATE INDEX IF NOT EXISTS ${table}_created_at ON ${table} (created_at DESC);
  `;
}
var insertSql = (table) => `
  INSERT INTO ${table} (id, payload, created_at, status, forwarded, forward_note, cv_path)
  VALUES ($1, $2, $3, 'new', 0, NULL, $4)
`;
var updateForwardSql = (table) => `UPDATE ${table} SET forwarded = $1, forward_note = $2 WHERE id = $3`;
function toSqliteParams(text2) {
  return text2.replace(/\$\d+/g, "?");
}
async function createSqliteDriver() {
  (0, import_node_fs2.mkdirSync)(config.dataDir, { recursive: true });
  (0, import_node_fs2.mkdirSync)(config.uploadDir, { recursive: true });
  const { DatabaseSync } = await import("node:sqlite");
  const handle = new DatabaseSync(config.dbPath);
  handle.exec("PRAGMA journal_mode = WAL;");
  handle.exec("PRAGMA busy_timeout = 5000;");
  handle.exec("PRAGMA foreign_keys = ON;");
  for (const stream of streams) handle.exec(createTableSql(stream));
  return {
    run: async (text2, params) => {
      handle.prepare(toSqliteParams(text2)).run(...params);
    },
    rows: async (text2, params) => handle.prepare(toSqliteParams(text2)).all(...params),
    close: async () => {
      handle.close();
    }
  };
}
async function createPostgresDriver(url) {
  const sql = (0, import_postgres.default)(url, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 5,
    max_lifetime: 60 * 5,
    // `CREATE TABLE IF NOT EXISTS` answers with a NOTICE every time the schema already
    // exists, which is the normal case for a cold function instance.
    onnotice: () => {
    }
  });
  for (const stream of streams) {
    try {
      await sql.unsafe(createTableSql(stream));
    } catch (error) {
      const code = error.code ?? "";
      if (!ALREADY_EXISTS.has(code)) throw error;
    }
  }
  const execute = async (text2, params) => {
    try {
      return await sql.unsafe(text2, params);
    } catch (error) {
      if (!isStaleConnection(error)) throw error;
      console.error("[store] the pooled connection was stale \u2014 retrying once on a new one.");
      return await sql.unsafe(text2, params);
    }
  };
  return {
    run: async (text2, params) => {
      await execute(text2, params);
    },
    rows: async (text2, params) => execute(text2, params),
    close: async () => {
      await sql.end({ timeout: 3 });
    }
  };
}
var STALE_CODES = /* @__PURE__ */ new Set([
  "ETCP",
  "ECONNRESET",
  "EPIPE",
  "57P01",
  "57P02",
  "08P01",
  "08006",
  "08001"
]);
function isStaleConnection(error) {
  const err = error;
  if (!err) return false;
  const code = err.code ?? err.errno ?? "";
  if (STALE_CODES.has(code)) return true;
  return /connection (was )?(closed|terminated|reset)|server closed the connection unexpectedly/.test(
    err.message ?? ""
  );
}
var driverPromise = null;
async function connect() {
  if (config.databaseUrl !== null) return createPostgresDriver(config.databaseUrl);
  if (config.runningOnVercel) {
    throw new Error(
      "Vercel functions have no persistent disk: DATABASE_URL (or POSTGRES_URL) must be set for submissions to be stored."
    );
  }
  return createSqliteDriver();
}
async function getDriver() {
  if (driverPromise === null) {
    const pending = connect();
    driverPromise = pending;
    pending.catch(() => {
      if (driverPromise === pending) driverPromise = null;
    });
  }
  return driverPromise;
}
async function initStore() {
  await getDriver();
}
function uploadsEnabled() {
  return config.uploadsTarget !== "none";
}
function storageDescription() {
  return storageLabel();
}
async function insertSubmission(input) {
  const driver = await getDriver();
  const table = assertUsableTable(input.stream);
  const id = (0, import_node_crypto.randomUUID)();
  const createdAt = (/* @__PURE__ */ new Date()).toISOString();
  await driver.run(insertSql(table), [id, JSON.stringify(input.payload), createdAt, input.cvPath ?? null]);
  return {
    stream: input.stream,
    id,
    createdAt,
    status: "new",
    forwarded: false,
    forwardNote: null,
    cvPath: input.cvPath ?? null,
    payload: input.payload
  };
}
async function setForwardState(update) {
  const driver = await getDriver();
  const table = assertUsableTable(update.stream);
  await driver.run(updateForwardSql(table), [update.forwarded ? 1 : 0, update.note ?? null, update.id]);
}

// server/notify.ts
var import_nodemailer = __toESM(require("nodemailer"), 1);

// server/upload.ts
var import_node_crypto2 = require("node:crypto");
var import_promises = require("node:fs/promises");
var import_node_path2 = require("node:path");
var import_busboy = __toESM(require("busboy"), 1);
var import_blob = require("@vercel/blob");

// server/validate.ts
var VALIDATION_MESSAGE = "Please fix the highlighted fields.";
var GENERIC_REJECT_MESSAGE = "We could not accept this submission. Please try again.";
function flattenIssues(error) {
  const errors = {};
  for (const issue of error.issues) {
    const path = issue.path.map((segment) => String(segment)).join(".");
    const key = path.length > 0 ? path : "_form";
    if (errors[key] === void 0) errors[key] = issue.message;
  }
  return errors;
}
function validationBody(error) {
  return { message: VALIDATION_MESSAGE, errors: flattenIssues(error) };
}
function genericRejectBody() {
  return { message: GENERIC_REJECT_MESSAGE, errors: {} };
}
function honeypotFilled(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return false;
  const value = body._hp;
  if (value === void 0 || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}
function isPlainObject(body) {
  return typeof body === "object" && body !== null && !Array.isArray(body);
}
function acceptsUndefined(field) {
  return field.safeParse(void 0).success;
}
function probe(shape, key) {
  const candidate = shape[key];
  if (candidate && typeof candidate.safeParse === "function") {
    return candidate;
  }
  return void 0;
}
var TRUTHY = ["true", "1", "yes", "on"];
function coerceScalar(key, value) {
  if (key === "consent") return TRUTHY.includes(value.trim().toLowerCase());
  if (key === "cvSizeBytes") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : void 0;
  }
  return value;
}
function formFieldsToPayload(fields, shape) {
  const payload = {};
  for (const [key, raw] of Object.entries(fields)) {
    const value = typeof raw === "string" ? raw : String(raw ?? "");
    const field = probe(shape, key);
    if (value.trim().length === 0) {
      const optional = field ? acceptsUndefined(field) : true;
      if (optional) continue;
      payload[key] = key === "consent" ? false : "";
      continue;
    }
    const coerced = coerceScalar(key, value);
    if (coerced !== void 0) payload[key] = coerced;
  }
  if (probe(shape, "consent") && payload.consent === void 0) payload.consent = false;
  return payload;
}
function sanitizeFileName(name) {
  const base = name.split(/[\\/]/).pop() ?? "cv";
  return base.replace(/[^\p{L}\p{N}.\-_ ()]/gu, "").replace(/\s+/g, " ").trim() || "cv";
}
function clampFileName(name, max = 200) {
  const cleaned = sanitizeFileName(name);
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1)}\u2026`;
}

// server/upload.ts
var CV_FIELD = "cv";
var EXT_PATTERN = /^[a-z0-9]{1,8}$/;
function extensionOf(fileName) {
  const base = fileName.split(/[\\/]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  if (dot <= 0 || dot === base.length - 1) return "";
  return base.slice(dot + 1).toLowerCase().replace(/^\.+/, "");
}
function isAllowedExtension(extension) {
  return EXT_PATTERN.test(extension) && config.cvAllowedExtensions.includes(extension);
}
var PARSE_TIMEOUT_MS = 3e4;
function readMultipart(req) {
  return new Promise((resolve2) => {
    const result = {
      fields: {},
      file: null,
      fileTooLarge: false,
      tooManyFiles: false,
      failure: null
    };
    let settled = false;
    let timer = null;
    const finish = () => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      resolve2(result);
    };
    let bb;
    try {
      bb = (0, import_busboy.default)({
        headers: req.headers,
        preservePath: false,
        limits: {
          fileSize: config.cvMaxBytes,
          files: 1,
          fields: 40,
          fieldSize: 16 * 1024,
          fieldNameSize: 64,
          headerPairs: 200
        }
      });
    } catch {
      result.failure = "malformed";
      resolve2(result);
      return;
    }
    timer = setTimeout(() => {
      result.failure = "timeout";
      bb.destroy();
      finish();
    }, PARSE_TIMEOUT_MS);
    timer.unref();
    let sawFile = false;
    bb.on("field", (name, value, info) => {
      if (result.failure) return;
      if (name.length === 0 || name.length > 64 || info.nameTruncated) {
        result.failure = "unexpected-field";
        return;
      }
      if (info.valueTruncated) {
        result.failure = "field-too-large";
        return;
      }
      result.fields[name] = String(value);
    });
    bb.on("file", (name, stream, info) => {
      if (name !== CV_FIELD) {
        result.failure = "unexpected-field";
        stream.destroy();
        return;
      }
      if (sawFile) {
        result.tooManyFiles = true;
        stream.destroy();
        return;
      }
      sawFile = true;
      const chunks = [];
      let received = 0;
      let truncated = false;
      stream.on("data", (chunk) => {
        if (truncated) return;
        received += chunk.length;
        if (received > config.cvMaxBytes) {
          truncated = true;
          result.fileTooLarge = true;
          chunks.length = 0;
          return;
        }
        chunks.push(Buffer.from(chunk));
      });
      stream.on("limit", () => {
        truncated = true;
        result.fileTooLarge = true;
        chunks.length = 0;
      });
      stream.on("close", () => {
        if (truncated || result.failure) return;
        const buffer = Buffer.concat(chunks);
        result.file = {
          originalName: clampFileName(info.filename || "cv"),
          mimeType: info.mimeType || "application/octet-stream",
          buffer,
          size: buffer.length,
          extension: extensionOf(info.filename || "")
        };
      });
    });
    bb.on("filesLimit", () => {
      result.tooManyFiles = true;
    });
    bb.on("fieldsLimit", () => {
      result.failure = "too-many-fields";
    });
    bb.on("partsLimit", () => {
      result.failure = "too-many-files";
    });
    bb.on("error", () => {
      if (!result.failure) result.failure = "malformed";
      finish();
    });
    bb.on("close", finish);
    bb.on("finish", finish);
    req.on("aborted", () => {
      if (!result.failure) result.failure = "malformed";
      finish();
    });
    req.pipe(bb);
  });
}
async function saveCv(file) {
  if (config.uploadsTarget === "blob") return saveToBlob(file);
  if (config.uploadsTarget !== "disk") {
    throw new Error("CV uploads are not available on this deployment.");
  }
  await (0, import_promises.mkdir)(config.uploadDir, { recursive: true });
  const storedName = `${(0, import_node_crypto2.randomUUID)()}.${file.extension}`;
  const cvPath = (0, import_node_path2.join)(config.uploadDir, storedName);
  await (0, import_promises.writeFile)(cvPath, file.buffer, { mode: 384 });
  return { cvPath, storedName };
}
var CV_PREFIX = "cvs";
async function saveToBlob(file) {
  const storedName = `${(0, import_node_crypto2.randomUUID)()}.${file.extension}`;
  const blob = await (0, import_blob.put)(`${CV_PREFIX}/${storedName}`, file.buffer, {
    access: "private",
    addRandomSuffix: false,
    contentType: file.mimeType || "application/octet-stream"
  });
  return { cvPath: blob.url, storedName };
}
async function removeCv(cvPath) {
  try {
    if (/^https?:\/\//.test(cvPath)) {
      await (0, import_blob.del)(cvPath);
      return;
    }
    await (0, import_promises.unlink)(cvPath);
  } catch {
    console.error("[upload] a rejected CV could not be deleted from storage; it may be an orphan.");
  }
}
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function cvSizeMessage() {
  return `The CV is too large \u2014 the maximum is ${formatBytes(config.cvMaxBytes)}.`;
}
function cvTypeMessage() {
  return `The CV must be one of these file types: ${config.cvAllowedExtensions.join(", ")}.`;
}
function cvUnavailableMessage() {
  return "This deployment cannot store CV files yet, so please send your application without an attachment.";
}

// server/notify.ts
var STREAM_LABELS = {
  contact: "Contact enquiry",
  requests: "Service request",
  applications: "Career application",
  newsletter: "Newsletter subscription"
};
var FIELD_LABELS = {
  fullName: "Name",
  email: "Email",
  company: "Company",
  organisation: "Organisation",
  phone: "Phone",
  inquiryType: "Enquiry type",
  service: "Service",
  message: "Message",
  relatedService: "Related service",
  projectName: "Project name",
  problem: "Problem to solve",
  description: "Description",
  outcomes: "Desired outcomes",
  technicalRequirements: "Technical requirements",
  budget: "Budget",
  timeline: "Timeline",
  stage: "Current stage",
  engagement: "Engagement type",
  preferredContact: "Preferred contact",
  role: "Area of interest",
  roleDetail: "Role detail",
  location: "Location",
  portfolioUrl: "Portfolio",
  linkedinUrl: "LinkedIn",
  note: "Note",
  cvFileName: "CV file",
  cvSizeBytes: "CV size",
  source: "Source",
  consent: "Consent given"
};
function labelFor(key) {
  return FIELD_LABELS[key] ?? key;
}
function buildTextBody(submission) {
  const lines = [
    `${STREAM_LABELS[submission.stream] ?? submission.stream} via septa website`,
    "",
    `Reference: ${submission.id}`,
    `Received:   ${submission.createdAt}`,
    ""
  ];
  for (const [key, value] of Object.entries(submission.payload)) {
    if (key === "_hp" || value === void 0 || value === null || value === "") continue;
    const text2 = key === "cvSizeBytes" && typeof value === "number" ? formatBytes(value) : String(value);
    lines.push(`${labelFor(key)}: ${text2}`);
  }
  if (submission.stream === "applications") {
    lines.push("");
    lines.push(
      submission.cvPath ? "CV: stored on the API host (uploads directory). Attachments are not emailed by default." : "CV: none uploaded."
    );
  }
  lines.push("", "Do not reply to this address unless it is your configured inbox.");
  return lines.join("\n");
}
function buildSubject(submission) {
  const who = typeof submission.payload.fullName === "string" && submission.payload.fullName.length > 0 ? submission.payload.fullName : typeof submission.payload.email === "string" ? submission.payload.email : "unknown sender";
  const label = STREAM_LABELS[submission.stream] ?? submission.stream;
  return `[Septa] New ${label.toLowerCase()} \u2014 ${who}`;
}
var cachedTransport = null;
var TIMEOUTS = {
  connectionTimeout: 1e4,
  greetingTimeout: 1e4,
  socketTimeout: 2e4
};
function getTransport() {
  if (!config.smtp.usable) return null;
  if (cachedTransport) return cachedTransport;
  if (config.smtp.url) {
    cachedTransport = import_nodemailer.default.createTransport({ url: config.smtp.url, ...TIMEOUTS });
    return cachedTransport;
  }
  if (!config.smtp.host || !config.smtp.from) return null;
  cachedTransport = import_nodemailer.default.createTransport({
    host: config.smtp.host,
    port: config.smtp.port ?? 587,
    secure: config.smtp.secure ?? config.smtp.port === 465,
    auth: config.smtp.user && config.smtp.pass ? { user: config.smtp.user, pass: config.smtp.pass } : void 0,
    ...TIMEOUTS
  });
  return cachedTransport;
}
function withTimeout(promise, ms, message) {
  return new Promise((resolve2, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    timer.unref();
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve2(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    );
  });
}
function shorten(text2, max = 180) {
  const flat = text2.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}\u2026` : flat;
}
async function notifySubmission(submission) {
  if (!config.emailDeliveryEnabled) {
    return {
      enabled: false,
      forwarded: false,
      note: "Saved to the site inbox. Email forwarding is not configured, so nothing was sent."
    };
  }
  const transport = getTransport();
  if (!transport) {
    return {
      enabled: false,
      forwarded: false,
      note: "Saved to the site inbox, but the SMTP settings are incomplete so no email was sent."
    };
  }
  const from = config.smtp.from ?? config.inboxEmail;
  const to = config.inboxEmail;
  if (!from || !to) {
    return {
      enabled: false,
      forwarded: false,
      note: "Saved to the site inbox. No INBOX_EMAIL is configured, so no email was sent."
    };
  }
  try {
    await withTimeout(
      transport.sendMail({
        from,
        to,
        replyTo: config.smtp.replyTo ?? (typeof submission.payload.email === "string" ? submission.payload.email : void 0),
        subject: buildSubject(submission),
        text: buildTextBody(submission)
      }),
      config.notifyTimeoutMs,
      `SMTP did not respond within ${Math.round(config.notifyTimeoutMs / 1e3)}s`
    );
    return { enabled: true, forwarded: true, note: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[notify] delivery failed for ${submission.stream}/${submission.id}: ${shorten(message)}`);
    return {
      enabled: true,
      forwarded: false,
      note: `Saved to the site inbox, but the email notification failed (${shorten(message)}).`
    };
  }
}

// server/app.ts
var STORAGE_FAILURE_MESSAGE = "We could not save your submission on our side. Please try again shortly.";
function applySecurityHeaders(_req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  next();
}
function corsGate(req, res, next) {
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
function isMultipart(req) {
  return (req.headers["content-type"] ?? "").toLowerCase().includes("multipart/form-data");
}
async function persistAndNotify(stream, payload, cvPath) {
  const stored = await insertSubmission({ stream, payload, cvPath });
  try {
    const delivery = await notifySubmission(stored);
    try {
      await setForwardState({
        stream,
        id: stored.id,
        forwarded: delivery.forwarded,
        note: delivery.note
      });
      stored.forwarded = delivery.forwarded;
      stored.forwardNote = delivery.note;
    } catch (error) {
      console.error(`[api] could not record the forwarding state for ${stored.id}:`, error);
      stored.forwardNote = "Saved, but the forwarding result could not be written to the database.";
    }
  } catch (error) {
    console.error(`[api] unexpected notification error for ${stored.id}:`, error);
    stored.forwardNote = "Saved, but the email notification could not be completed.";
  }
  return stored;
}
function toResult(stored) {
  const result = {
    ok: true,
    id: stored.id,
    receivedAt: stored.createdAt,
    forwarded: stored.forwarded
  };
  if (!stored.forwarded && stored.forwardNote) result.note = stored.forwardNote;
  return result;
}
async function accept(stream, payload, cvPath, res) {
  try {
    const stored = await persistAndNotify(stream, payload, cvPath);
    res.status(201).json(toResult(stored));
  } catch (error) {
    if (cvPath) await removeCv(cvPath);
    console.error(`[api] storage failure during a ${stream} submission:`, error);
    if (!res.headersSent) res.status(500).json({ message: STORAGE_FAILURE_MESSAGE });
  }
}
async function handleJson(schema, stream, req, res) {
  const body = req.body;
  if (honeypotFilled(body)) {
    res.status(422).json(genericRejectBody());
    return;
  }
  const parsed = schema.safeParse(isPlainObject(body) ? body : {});
  if (!parsed.success) {
    res.status(422).json(validationBody(parsed.error));
    return;
  }
  await accept(stream, parsed.data, null, res);
}
async function handleMultipart(req, res) {
  const parsed = await readMultipart(req);
  if (parsed.failure === "malformed" || parsed.failure === "timeout") {
    res.status(400).json({ message: "We could not read that upload. Please try again." });
    return;
  }
  if (parsed.failure === "unexpected-field" || parsed.failure === "too-many-fields" || parsed.failure === "field-too-large") {
    res.status(400).json({ message: "That upload contained more data than this form accepts." });
    return;
  }
  if (parsed.failure === "too-many-files" || parsed.tooManyFiles) {
    res.status(422).json({
      message: VALIDATION_MESSAGE,
      errors: { cvFileName: "Only one CV file can be sent." }
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
  if (hasFile && !uploadsEnabled()) {
    res.status(422).json({ message: VALIDATION_MESSAGE, errors: { cvFileName: cvUnavailableMessage() } });
    return;
  }
  const payload = formFieldsToPayload(parsed.fields, careerSchema.shape);
  if (hasFile) {
    payload.cvFileName = file.originalName;
    payload.cvSizeBytes = file.size;
  }
  const checked = careerSchema.safeParse(payload);
  if (!checked.success) {
    res.status(422).json(validationBody(checked.error));
    return;
  }
  let cvPath = null;
  if (hasFile) {
    try {
      const saved = await saveCv(file);
      cvPath = saved.cvPath;
    } catch (error) {
      console.error("[api] the CV could not be stored:", error);
      res.status(500).json({ message: "We could not store the uploaded CV. Please try again." });
      return;
    }
  }
  await accept("applications", checked.data, cvPath, res);
}
function statusBody() {
  return {
    ok: true,
    backend: "septa-api",
    storage: storageDescription(),
    emailDelivery: config.emailDeliveryEnabled,
    uploadsEnabled: uploadsEnabled(),
    mode: config.emailDeliveryEnabled ? "live" : "record-only"
  };
}
function createApp() {
  const app2 = (0, import_express.default)();
  app2.disable("x-powered-by");
  if (config.trustProxy !== false) app2.set("trust proxy", config.trustProxy);
  app2.use(applySecurityHeaders);
  app2.use(corsGate);
  app2.use(import_express.default.json({ limit: config.jsonBodyLimitBytes }));
  const limiter = (name) => createRateLimiter({ name, max: config.rateLimit.max, windowMs: config.rateLimit.windowMs });
  const handleContact = (req, res) => handleJson(contactSchema, "contact", req, res);
  const handleRequest = (req, res) => handleJson(requestSchema, "requests", req, res);
  const handleNewsletter = (req, res) => handleJson(newsletterSchema, "newsletter", req, res);
  const handleStatus = (_req, res) => {
    try {
      res.status(200).json(statusBody());
    } catch (error) {
      console.error("[api] status check failed:", error);
      res.status(500).json({
        ok: false,
        backend: "septa-api",
        storage: `${storageDescription()}:unavailable`,
        emailDelivery: config.emailDeliveryEnabled,
        uploadsEnabled: false,
        mode: "record-only",
        message: "The API is running but its storage is not reachable."
      });
    }
  };
  app2.get("/api/status", handleStatus);
  app2.get("/api/health", handleStatus);
  const handleCareers = async (req, res) => {
    if (isMultipart(req)) {
      await handleMultipart(req, res);
      return;
    }
    await handleJson(careerSchema, "applications", req, res);
  };
  app2.post("/api/contact", limiter("contact"), handleContact);
  app2.post("/api/request", limiter("request"), handleRequest);
  app2.post("/api/careers", limiter("careers"), handleCareers);
  app2.post("/api/newsletter", limiter("newsletter"), handleNewsletter);
  app2.use("/api", (_req, res) => {
    res.status(404).json({ message: "Unknown API endpoint." });
  });
  app2.use((err, _req, res, _next) => {
    const details = err;
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
  return app2;
}

// server/vercel-handler.ts
var app = createApp();
var dispatch = app;
function apiPath(url) {
  const path = url.split("?")[0] ?? "/";
  const query = url.slice(path.length);
  if (path === "/api" || path.startsWith("/api/")) return path + query;
  return `/api${path === "/" ? "" : path}${query}`;
}
async function handler(req, res) {
  try {
    await initStore();
  } catch (error) {
    console.error("[function] the submission store is unreachable:", error);
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(
      JSON.stringify({
        ok: false,
        backend: "septa-api",
        message: "The API is deployed but its database is not reachable, so nothing was saved."
      })
    );
    return;
  }
  req.url = apiPath(req.url ?? "/");
  dispatch(req, res);
}
