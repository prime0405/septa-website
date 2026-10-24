import type { ZodError } from "zod";

/**
 * Validation helpers shared by every route.
 * The browser validates for speed; the server validates for safety.
 */

/** Message the frontend shows when the field map below is unusable. */
export const VALIDATION_MESSAGE = "Please fix the highlighted fields.";
/** Deliberately vague rejection used for honeypot traffic (no field map, no stored row). */
export const GENERIC_REJECT_MESSAGE = "We could not accept this submission. Please try again.";

export type FieldErrors = Record<string, string>;

/** First issue per field name — one message per input is all a form can show. */
export function flattenIssues(error: ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const path = issue.path.map((segment) => String(segment)).join(".");
    const key = path.length > 0 ? path : "_form";
    if (errors[key] === undefined) errors[key] = issue.message;
  }
  return errors;
}

export function validationBody(error: ZodError): { message: string; errors: FieldErrors } {
  return { message: VALIDATION_MESSAGE, errors: flattenIssues(error) };
}

export function genericRejectBody(): { message: string; errors: FieldErrors } {
  return { message: GENERIC_REJECT_MESSAGE, errors: {} };
}

/** Reads `_hp` from any body shape without assuming the body is a plain object. */
export function honeypotFilled(body: unknown): boolean {
  if (!body || typeof body !== "object" || Array.isArray(body)) return false;
  const value = (body as Record<string, unknown>)._hp;
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

export function isPlainObject(body: unknown): body is Record<string, unknown> {
  return typeof body === "object" && body !== null && !Array.isArray(body);
}

type OptionalProbe = { safeParse: (data: unknown) => { success: boolean } };

/** True when the schema tolerates `undefined` for this key. */
function acceptsUndefined(field: OptionalProbe): boolean {
  return field.safeParse(undefined).success;
}

function probe(shape: Record<string, unknown>, key: string): OptionalProbe | undefined {
  const candidate = shape[key];
  if (candidate && typeof (candidate as OptionalProbe).safeParse === "function") {
    return candidate as OptionalProbe;
  }
  return undefined;
}

const TRUTHY = ["true", "1", "yes", "on"];

function coerceScalar(key: string, value: string): unknown {
  if (key === "consent") return TRUTHY.includes(value.trim().toLowerCase());
  if (key === "cvSizeBytes") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : undefined;
  }
  return value;
}

/**
 * Turns multipart text fields into the object shape the zod schemas expect.
 *
 * `shape` is the zod object's `.shape`. Empty strings are dropped only for keys the
 * schema treats as optional, so a blank required field still produces its friendly
 * "X is required." message instead of a generic "expected string, received undefined".
 */
export function formFieldsToPayload(
  fields: Record<string, string>,
  shape: Record<string, unknown>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

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
    if (coerced !== undefined) payload[key] = coerced;
  }

  // An unchecked consent box is a real rejection, not an absent field.
  if (probe(shape, "consent") && payload.consent === undefined) payload.consent = false;

  return payload;
}

/** Strips path characters and control bytes from a browser-supplied file name. */
export function sanitizeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "cv";
  return base.replace(/[^\p{L}\p{N}.\-_ ()]/gu, "").replace(/\s+/g, " ").trim() || "cv";
}

/** Keeps a display file name inside the schema's 200 character limit. */
export function clampFileName(name: string, max = 200): string {
  const cleaned = sanitizeFileName(name);
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1)}…`;
}
