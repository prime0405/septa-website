import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import postgres from "postgres";
import { config, storageLabel } from "./config.ts";

/**
 * Persistence layer.
 *
 * One table per submission stream. Rows are written before any email is attempted: a
 * successful response always means a durable row exists.
 *
 * Two backends run the same statements. SQLite (`node:sqlite`, no native npm
 * dependency) is used for local development; Postgres is used on Vercel, where the
 * filesystem is ephemeral and a submitted row would otherwise disappear between calls.
 *
 * Every statement below uses `$1`-style placeholders. The SQLite driver rewrites them to
 * `?`, which is positional, so a statement's parameter array must list values in
 * ascending placeholder order.
 */

export const streams = ["contact", "requests", "applications", "newsletter"] as const;
export type Stream = (typeof streams)[number];

export interface StoredSubmission {
  stream: Stream;
  id: string;
  /** ISO-8601 timestamp captured at insert time. */
  createdAt: string;
  status: string;
  forwarded: boolean;
  /** Why forwarding did or did not happen — surfaced in the inbox CLI. */
  forwardNote: string | null;
  /** Where the CV lives: a disk path, or a private object-storage URL. */
  cvPath: string | null;
  payload: Record<string, unknown>;
}

interface SubmissionRow {
  id: string;
  payload: string;
  created_at: string;
  status: string;
  forwarded: number | null;
  forward_note: string | null;
  cv_path: string | null;
}

/** Postgres raises these when two cold starts race to create the same table or index. */
const ALREADY_EXISTS = new Set(["42P06", "42P07", "42710"]);

function assertUsableTable(stream: Stream): string {
  if (!streams.includes(stream)) {
    throw new Error(`Unknown submission stream: ${String(stream)}`);
  }
  return stream;
}

function createTableSql(stream: Stream): string {
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

const insertSql = (table: string): string => `
  INSERT INTO ${table} (id, payload, created_at, status, forwarded, forward_note, cv_path)
  VALUES ($1, $2, $3, 'new', 0, NULL, $4)
`;

const updateForwardSql = (table: string): string =>
  `UPDATE ${table} SET forwarded = $1, forward_note = $2 WHERE id = $3`;

const selectSql = (table: string): string => `
  SELECT id, payload, created_at, status, forwarded, forward_note, cv_path
  FROM ${table}
  ORDER BY created_at DESC, id DESC
  LIMIT $1
`;

const countSql = (table: string): string =>
  `SELECT COUNT(*) AS total, COALESCE(SUM(forwarded), 0) AS forwarded FROM ${table}`;

/** The value types both drivers accept without conversion. */
type SqlParam = string | number | null;

/** The only two things a backend has to be able to do. */
interface Driver {
  run(text: string, params: SqlParam[]): Promise<void>;
  rows(text: string, params: SqlParam[]): Promise<SubmissionRow[]>;
  close(): Promise<void>;
}

function toSqliteParams(text: string): string {
  return text.replace(/\$\d+/g, "?");
}

async function createSqliteDriver(): Promise<Driver> {
  mkdirSync(config.dataDir, { recursive: true });
  mkdirSync(config.uploadDir, { recursive: true });

  const { DatabaseSync } = await import("node:sqlite");
  const handle = new DatabaseSync(config.dbPath);
  handle.exec("PRAGMA journal_mode = WAL;");
  handle.exec("PRAGMA busy_timeout = 5000;");
  handle.exec("PRAGMA foreign_keys = ON;");
  for (const stream of streams) handle.exec(createTableSql(stream));

  return {
    run: async (text, params) => {
      handle.prepare(toSqliteParams(text)).run(...params);
    },
    rows: async (text, params) =>
      handle.prepare(toSqliteParams(text)).all(...params) as unknown as SubmissionRow[],
    close: async () => {
      handle.close();
    },
  };
}

async function createPostgresDriver(url: string): Promise<Driver> {
  // One connection per function instance: the pooler, not the local pool, does the sharing.
  // `prepare: false` because Prisma's pooler runs in transaction mode, and a short idle
  // timeout so a socket left dead by a frozen instance is dropped on resume instead of
  // hanging the next request.
  const sql = postgres(url, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    idle_timeout: 5,
    max_lifetime: 60 * 5,
    // `CREATE TABLE IF NOT EXISTS` answers with a NOTICE every time the schema already
    // exists, which is the normal case for a cold function instance.
    onnotice: () => {},
  });

  for (const stream of streams) {
    try {
      await sql.unsafe(createTableSql(stream));
    } catch (error) {
      const code = (error as { code?: string }).code ?? "";
      if (!ALREADY_EXISTS.has(code)) throw error;
    }
  }

  /**
   * A frozen serverless process can silently kill the socket, so the next query fails
   * before any connection answers. Retrying once on a fresh connection avoids a false 500;
   * a write that died mid-flight is instead stored twice under different references.
   */
  const execute = async (text: string, params: SqlParam[]): Promise<SubmissionRow[]> => {
    try {
      return (await sql.unsafe(text, params)) as unknown as SubmissionRow[];
    } catch (error) {
      if (!isStaleConnection(error)) throw error;
      console.error("[store] the pooled connection was stale — retrying once on a new one.");
      return (await sql.unsafe(text, params)) as unknown as SubmissionRow[];
    }
  };

  return {
    run: async (text, params) => {
      await execute(text, params);
    },
    rows: async (text, params) => execute(text, params),
    close: async () => {
      await sql.end({ timeout: 3 });
    },
  };
}

const STALE_CODES = new Set([
  "ETCP",
  "ECONNRESET",
  "EPIPE",
  "57P01",
  "57P02",
  "08P01",
  "08006",
  "08001",
]);

function isStaleConnection(error: unknown): boolean {
  const err = error as { code?: string; errno?: string; message?: string } | null;
  if (!err) return false;
  const code = err.code ?? err.errno ?? "";
  if (STALE_CODES.has(code)) return true;
  return /connection (was )?(closed|terminated|reset)|server closed the connection unexpectedly/.test(
    err.message ?? "",
  );
}

let driverPromise: Promise<Driver> | null = null;

async function connect(): Promise<Driver> {
  if (config.databaseUrl !== null) return createPostgresDriver(config.databaseUrl);
  if (config.runningOnVercel) {
    throw new Error(
      "Vercel functions have no persistent disk: DATABASE_URL (or POSTGRES_URL) must be set for submissions to be stored.",
    );
  }
  return createSqliteDriver();
}

/** Opens the store once per process; a failed attempt is retried by the next caller. */
async function getDriver(): Promise<Driver> {
  if (driverPromise === null) {
    const pending = connect();
    driverPromise = pending;
    pending.catch(() => {
      if (driverPromise === pending) driverPromise = null;
    });
  }
  return driverPromise;
}

export async function initStore(): Promise<void> {
  await getDriver();
}

export async function closeStore(): Promise<void> {
  if (driverPromise === null) return;
  const pending = driverPromise;
  driverPromise = null;
  try {
    await (await pending).close();
  } catch (error) {
    console.error("[store] the database connection could not be closed cleanly:", error);
  }
}

/** Whether a CV can be stored on this deployment at all. */
export function uploadsEnabled(): boolean {
  return config.uploadsTarget !== "none";
}

export function storageDescription(): string {
  return storageLabel();
}

export interface NewSubmission {
  stream: Stream;
  payload: Record<string, unknown>;
  cvPath?: string | null;
}

/** Inserts the row and returns it. Throws if the database rejects the write. */
export async function insertSubmission(input: NewSubmission): Promise<StoredSubmission> {
  const driver = await getDriver();
  const table = assertUsableTable(input.stream);
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  await driver.run(insertSql(table), [id, JSON.stringify(input.payload), createdAt, input.cvPath ?? null]);

  return {
    stream: input.stream,
    id,
    createdAt,
    status: "new",
    forwarded: false,
    forwardNote: null,
    cvPath: input.cvPath ?? null,
    payload: input.payload,
  };
}

export interface ForwardStateUpdate {
  stream: Stream;
  id: string;
  forwarded: boolean;
  note?: string | null;
}

/** Records the outcome of the email step; never used to fake a successful save. */
export async function setForwardState(update: ForwardStateUpdate): Promise<void> {
  const driver = await getDriver();
  const table = assertUsableTable(update.stream);
  await driver.run(updateForwardSql(table), [update.forwarded ? 1 : 0, update.note ?? null, update.id]);
}

function rowToSubmission(stream: Stream, row: SubmissionRow): StoredSubmission {
  let payload: Record<string, unknown> = {};
  try {
    const parsed: unknown = JSON.parse(row.payload);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      payload = parsed as Record<string, unknown>;
    }
  } catch {
    payload = { unparseable: true };
  }
  return {
    stream,
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    forwarded: Number(row.forwarded) === 1,
    forwardNote: row.forward_note,
    cvPath: row.cv_path,
    payload,
  };
}

/**
 * Newest-first submissions, optionally restricted to one stream.
 * Used by `npm run api:inbox` and by the smoke tests.
 */
export async function listInbox(stream?: Stream, limit = 20): Promise<StoredSubmission[]> {
  const driver = await getDriver();
  const capped = Math.max(1, Math.min(500, Math.trunc(limit)));
  const targets: Stream[] = stream ? [stream] : [...streams];
  const collected: StoredSubmission[] = [];

  for (const target of targets) {
    const table = assertUsableTable(target);
    const rows = await driver.rows(selectSql(table), [capped]);
    for (const row of rows) collected.push(rowToSubmission(target, row));
  }

  collected.sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
  return collected.slice(0, capped);
}

export interface StreamCount {
  stream: Stream;
  total: number;
  forwarded: number;
}

export async function countByStream(): Promise<StreamCount[]> {
  const driver = await getDriver();
  const counts: StreamCount[] = [];
  for (const stream of streams) {
    const table = assertUsableTable(stream);
    const rows = await driver.rows(countSql(table), []);
    const row = rows[0] as unknown as { total: number | string; forwarded: number | string } | undefined;
    counts.push({ stream, total: Number(row?.total ?? 0), forwarded: Number(row?.forwarded ?? 0) });
  }
  return counts;
}

/** Fields worth showing in a terminal table, per stream. */
export function summarize(submission: StoredSubmission): string {
  const p = submission.payload;
  const str = (key: string): string => {
    const value = p[key];
    return typeof value === "string" && value.length > 0 ? value : "-";
  };
  if (submission.stream === "contact") {
    return `${str("fullName")} <${str("email")}> · ${str("inquiryType")}`;
  }
  if (submission.stream === "newsletter") {
    return `<${str("email")}> · newsletter`;
  }
  if (submission.stream === "requests") {
    return `${str("fullName")} <${str("email")}> · ${str("service")} · ${str("projectName")}`;
  }
  return `${str("fullName")} <${str("email")}> · ${str("role")}${p.cvFileName ? ` · CV: ${String(p.cvFileName)}` : ""}`;
}
