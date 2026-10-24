import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { config, storageLabel } from "./config.ts";

/**
 * Persistence layer.
 *
 * One table per submission stream, stored with the built-in `node:sqlite` binding
 * so the project needs no native npm dependency. Rows are written before any email
 * is attempted: a successful response always means a durable row exists.
 */

export const streams = ["contact", "requests", "applications"] as const;
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
  /** Sanitized on-disk path of the stored CV, when one was uploaded. */
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

const tableFor = (stream: Stream): string => stream;

let db: DatabaseSync | null = null;
let uploadsReady = false;

function assertUsableTable(stream: Stream): string {
  if (!streams.includes(stream)) {
    throw new Error(`Unknown submission stream: ${String(stream)}`);
  }
  return tableFor(stream);
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

/** Opens (once) the SQLite file, creating the data directory and tables first. */
export function initStore(): DatabaseSync {
  if (db) return db;
  mkdirSync(config.dataDir, { recursive: true });
  mkdirSync(config.uploadDir, { recursive: true });
  uploadsReady = true;

  const handle = new DatabaseSync(config.dbPath);
  handle.exec("PRAGMA journal_mode = WAL;");
  handle.exec("PRAGMA busy_timeout = 5000;");
  handle.exec("PRAGMA foreign_keys = ON;");
  for (const stream of streams) handle.exec(createTableSql(stream));
  db = handle;
  return handle;
}

export function closeStore(): void {
  if (!db) return;
  db.close();
  db = null;
}

/** `true` once the uploads directory exists and is writable enough to mkdir. */
export function uploadsEnabled(): boolean {
  if (!db) initStore();
  return uploadsReady;
}

export function storageDescription(): string {
  return storageLabel;
}

export interface NewSubmission {
  stream: Stream;
  payload: Record<string, unknown>;
  cvPath?: string | null;
}

/** Inserts the row and returns it. Throws if the database rejects the write. */
export function insertSubmission(input: NewSubmission): StoredSubmission {
  const handle = initStore();
  const table = assertUsableTable(input.stream);
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  const statement = handle.prepare(
    `INSERT INTO ${table} (id, payload, created_at, status, forwarded, forward_note, cv_path)
     VALUES (?, ?, ?, 'new', 0, NULL, ?)`,
  );
  statement.run(id, JSON.stringify(input.payload), createdAt, input.cvPath ?? null);

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
export function setForwardState(update: ForwardStateUpdate): void {
  const handle = initStore();
  const table = assertUsableTable(update.stream);
  handle
    .prepare(`UPDATE ${table} SET forwarded = ?, forward_note = ? WHERE id = ?`)
    .run(update.forwarded ? 1 : 0, update.note ?? null, update.id);
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
export function listInbox(stream?: Stream, limit = 20): StoredSubmission[] {
  const handle = initStore();
  const targets: Stream[] = stream ? [stream] : [...streams];
  const collected: StoredSubmission[] = [];

  for (const target of targets) {
    const table = assertUsableTable(target);
    const rows = handle
      .prepare(
        `SELECT id, payload, created_at, status, forwarded, forward_note, cv_path
         FROM ${table}
         ORDER BY created_at DESC, rowid DESC
         LIMIT ?`,
      )
      .all(Math.max(1, Math.min(500, Math.trunc(limit)))) as unknown as SubmissionRow[];
    for (const row of rows) collected.push(rowToSubmission(target, row));
  }

  collected.sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
  return collected.slice(0, Math.max(1, Math.min(500, Math.trunc(limit))));
}

export interface StreamCount {
  stream: Stream;
  total: number;
  forwarded: number;
}

export function countByStream(): StreamCount[] {
  const handle = initStore();
  return [...streams].map((stream) => {
    const table = assertUsableTable(stream);
    const row = handle
      .prepare(`SELECT COUNT(*) AS total, COALESCE(SUM(forwarded), 0) AS forwarded FROM ${table}`)
      .get() as unknown as { total: number; forwarded: number };
    return { stream, total: Number(row.total), forwarded: Number(row.forwarded) };
  });
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
  if (submission.stream === "requests") {
    return `${str("fullName")} <${str("email")}> · ${str("service")} · ${str("projectName")}`;
  }
  return `${str("fullName")} <${str("email")}> · ${str("role")}${p.cvFileName ? ` · CV: ${String(p.cvFileName)}` : ""}`;
}
