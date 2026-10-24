import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CV_ALLOWED_EXT, CV_MAX_BYTES } from "../src/shared/schemas.ts";

/**
 * Environment parsing for the Septa API.
 *
 * Nothing here is required: the API boots with safe defaults and simply records
 * submissions without emailing them until SMTP details exist.
 */

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Reads `.env` from the project root when present. Optional, never fatal. */
function loadDotEnv(): void {
  const file = resolve(projectRoot, ".env");
  if (!existsSync(file)) return;
  try {
    if (typeof process.loadEnvFile === "function") process.loadEnvFile(file);
  } catch {
    // A malformed .env must not stop the API from booting.
    console.error("[config] .env exists but could not be parsed — continuing with process env only.");
  }
}

loadDotEnv();

function env(name: string): string | undefined {
  const raw = process.env[name];
  if (raw === undefined) return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function intFromEnv(name: string, fallback: number, min: number, max: number): number {
  const raw = env(name);
  if (raw === undefined) return fallback;
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value) || value < min || value > max) {
    console.error(`[config] ${name}="${raw}" ignored — expected an integer between ${min} and ${max}.`);
    return fallback;
  }
  return value;
}

function boolFromEnv(name: string, fallback: boolean): boolean {
  const raw = env(name);
  if (raw === undefined) return fallback;
  const lower = raw.toLowerCase();
  if (["1", "true", "yes", "on"].includes(lower)) return true;
  if (["0", "false", "no", "off"].includes(lower)) return false;
  console.error(`[config] ${name}="${raw}" ignored — expected true/false.`);
  return fallback;
}

function listFromEnv(name: string): string[] {
  const raw = env(name);
  if (raw === undefined) return [];
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

/** Absolute path, resolved against the project root so the cwd never matters. */
function pathFromEnv(name: string, fallback: string): string {
  const raw = env(name);
  if (raw === undefined) return resolve(projectRoot, fallback);
  return resolve(projectRoot, raw);
}

const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

const smtpUrl = env("SMTP_URL") ?? null;
const smtpHost = env("SMTP_HOST") ?? null;
const smtpPortRaw = env("SMTP_PORT");
const smtpFrom = env("SMTP_FROM") ?? null;
const smtpUser = env("SMTP_USER") ?? null;
const smtpPass = env("SMTP_PASS") ?? null;
const inboxEmail = env("INBOX_EMAIL") ?? null;

/** URL form, or the classic host + port + from triple, is what makes SMTP usable. */
const smtpUsable =
  smtpUrl !== null || (smtpHost !== null && smtpPortRaw !== null && smtpFrom !== null);

const smtpPort = smtpPortRaw === undefined ? null : Number.parseInt(smtpPortRaw, 10);

const envCvMaxBytes = env("CV_MAX_BYTES");
/** The shared schema is a hard ceiling: env may only lower the limit, never raise it. */
const cvMaxBytes = (() => {
  const ceiling = CV_MAX_BYTES;
  if (envCvMaxBytes === undefined) return ceiling;
  const requested = Number.parseInt(envCvMaxBytes, 10);
  if (!Number.isFinite(requested) || requested <= 0 || requested > ceiling) {
    console.error(`[config] CV_MAX_BYTES="${envCvMaxBytes}" ignored — the shared schema allows at most ${ceiling}.`);
    return ceiling;
  }
  return requested;
})();

const cvAllowedExtensions = (() => {
  const requested = listFromEnv("CV_ALLOWED_EXT").map((ext) => ext.replace(/^\./, "").toLowerCase());
  if (requested.length === 0) return [...CV_ALLOWED_EXT];
  const intersected = CV_ALLOWED_EXT.filter((ext) => requested.includes(ext)).map((ext) => ext.toLowerCase());
  if (intersected.length === 0) {
    console.error(`[config] CV_ALLOWED_EXT="${env("CV_ALLOWED_EXT") ?? ""}" matches none of the schema list — falling back to it.`);
    return [...CV_ALLOWED_EXT];
  }
  return [...intersected];
})();

/** Path as advertised by /api/status — kept relative to the repo when possible. */
function displayPath(absolute: string): string {
  if (!absolute.startsWith(projectRoot)) return absolute;
  const relative = absolute
    .slice(projectRoot.length)
    .replace(/^[\\/]+/, "")
    .split(/[\\/]+/)
    .join("/");
  return relative.length > 0 ? relative : ".";
}

const dataDir = pathFromEnv("DATA_DIR", "data");
const dbPath = env("DB_PATH") === undefined ? resolve(dataDir, "submissions.db") : pathFromEnv("DB_PATH", "data/submissions.db");
const uploadDir = pathFromEnv("UPLOAD_DIR", "data/uploads");

export interface SmtpSettings {
  url: string | null;
  host: string | null;
  port: number | null;
  secure: boolean | null;
  user: string | null;
  pass: string | null;
  from: string | null;
  replyTo: string | null;
  /** True when the SMTP details needed to send mail are present. */
  usable: boolean;
}

export interface AppConfig {
  env: string;
  host: string;
  port: number;
  trustProxy: boolean | string | number;
  projectRoot: string;
  dataDir: string;
  dbPath: string;
  dbPathDisplay: string;
  uploadDir: string;
  allowedOrigins: string[];
  jsonBodyLimitBytes: number;
  rateLimit: { max: number; windowMs: number; enabled: boolean };
  smtp: SmtpSettings;
  inboxEmail: string | null;
  /** SMTP details + a destination address: the only way mail can actually be sent. */
  emailDeliveryEnabled: boolean;
  notifyTimeoutMs: number;
  cvMaxBytes: number;
  cvAllowedExtensions: string[];
}

const smtpSecureRaw = env("SMTP_SECURE");
const smtpSecure = smtpSecureRaw === undefined ? null : boolFromEnv("SMTP_SECURE", false);

export const config: AppConfig = {
  env: env("NODE_ENV") ?? "development",
  host: env("HOST") ?? "127.0.0.1",
  port: intFromEnv("PORT", 8787, 1, 65535),
  trustProxy: (() => {
    const raw = env("TRUST_PROXY");
    if (raw === undefined) return false;
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
  allowedOrigins: (() => {
    const configured = listFromEnv("ALLOWED_ORIGINS");
    return configured.length > 0 ? configured : DEFAULT_ALLOWED_ORIGINS;
  })(),
  jsonBodyLimitBytes: 120 * 1024,
  rateLimit: {
    max: intFromEnv("RATE_LIMIT_MAX", 8, 1, 10_000),
    windowMs: intFromEnv("RATE_LIMIT_WINDOW_MS", 60_000, 1_000, 24 * 60 * 60 * 1000),
    enabled: boolFromEnv("RATE_LIMIT_ENABLED", true),
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
    usable: smtpUsable,
  },
  inboxEmail,
  emailDeliveryEnabled: smtpUsable && inboxEmail !== null,
  notifyTimeoutMs: intFromEnv("NOTIFY_TIMEOUT_MS", 10_000, 500, 120_000),
  cvMaxBytes,
  cvAllowedExtensions,
};

/** `sqlite:data/submissions.db` — the string surfaced by GET /api/status. */
export const storageLabel = `sqlite:${displayPath(config.dbPath)}`;

export function describeConfig(): string {
  const mail = config.emailDeliveryEnabled
    ? `smtp -> ${config.inboxEmail}`
    : config.smtp.usable
      ? "smtp configured but INBOX_EMAIL missing (record-only)"
      : "no smtp (record-only)";
  return `host=${config.host}:${config.port} db=${config.dbPathDisplay} uploads=${displayPath(config.uploadDir)} mail=${mail} origins=${config.allowedOrigins.join(" ")}`;
}
