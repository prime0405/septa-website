import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { IncomingMessage } from "node:http";
import busboy from "busboy";
import { del, put } from "@vercel/blob";
import { config } from "./config.ts";
import { clampFileName } from "./validate.ts";

/**
 * CV upload handling.
 *
 * Files are streamed through busboy with hard byte and count limits, then stored as
 * `<uuid>.<ext>` — in the uploads directory, or in a private Vercel Blob object when a
 * store is attached. Nothing in this module is ever mounted on an HTTP route: uploaded
 * CVs are never served back to a browser.
 */

export const CV_FIELD = "cv";

export interface UploadedFile {
  /** Original name as typed by the visitor, sanitized for display only. */
  originalName: string;
  mimeType: string;
  buffer: Buffer;
  size: number;
  extension: string;
}

export type MultipartFailure =
  | "malformed"
  | "too-many-files"
  | "too-many-fields"
  | "unexpected-field"
  | "field-too-large"
  | "timeout";

export interface MultipartResult {
  fields: Record<string, string>;
  file: UploadedFile | null;
  /** The `cv` part exceeded the byte ceiling, so it was discarded. */
  fileTooLarge: boolean;
  /** A second file part appeared and was discarded. */
  tooManyFiles: boolean;
  failure: MultipartFailure | null;
}

const EXT_PATTERN = /^[a-z0-9]{1,8}$/;

export function extensionOf(fileName: string): string {
  const base = fileName.split(/[\\/]/).pop() ?? "";
  const dot = base.lastIndexOf(".");
  if (dot <= 0 || dot === base.length - 1) return "";
  return base.slice(dot + 1).toLowerCase().replace(/^\.+/, "");
}

export function isAllowedExtension(extension: string): boolean {
  return (
    EXT_PATTERN.test(extension) &&
    (config.cvAllowedExtensions as readonly string[]).includes(extension)
  );
}

const PARSE_TIMEOUT_MS = 30_000;

/**
 * Reads a `multipart/form-data` request body. Never throws: failures arrive as a
 * `failure` reason (or empty result) so the route can answer with a 422.
 */
export function readMultipart(req: IncomingMessage): Promise<MultipartResult> {
  return new Promise((resolve) => {
    const result: MultipartResult = {
      fields: {},
      file: null,
      fileTooLarge: false,
      tooManyFiles: false,
      failure: null,
    };

    let settled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const finish = (): void => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      resolve(result);
    };

    let bb: ReturnType<typeof busboy>;
    try {
      bb = busboy({
        headers: req.headers,
        preservePath: false,
        limits: {
          fileSize: config.cvMaxBytes,
          files: 1,
          fields: 40,
          fieldSize: 16 * 1024,
          fieldNameSize: 64,
          headerPairs: 200,
        },
      });
    } catch {
      result.failure = "malformed";
      resolve(result);
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
      // Duplicate names: keep the last value, which is what a re-submitted form means.
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

      const chunks: Buffer[] = [];
      let received = 0;
      let truncated = false;

      stream.on("data", (chunk: Buffer) => {
        if (truncated) return;
        received += chunk.length;
        if (received > config.cvMaxBytes) {
          truncated = true;
          result.fileTooLarge = true;
          chunks.length = 0; // drop the buffered bytes; the file is rejected anyway
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
          extension: extensionOf(info.filename || ""),
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

export interface StoredCv {
  /** Disk path or private object URL; stored in the DB, never sent to a client. */
  cvPath: string;
  /** `<uuid>.<ext>` — safe to log. */
  storedName: string;
}

/**
 * Persists the CV under a generated name. The extension comes from the allowlist only,
 * so neither the disk path nor the object key can escape its storage root.
 */
export async function saveCv(file: UploadedFile): Promise<StoredCv> {
  if (config.uploadsTarget === "blob") return saveToBlob(file);
  if (config.uploadsTarget !== "disk") {
    throw new Error("CV uploads are not available on this deployment.");
  }
  await mkdir(config.uploadDir, { recursive: true });
  const storedName = `${randomUUID()}.${file.extension}`;
  const cvPath = join(config.uploadDir, storedName);
  await writeFile(cvPath, file.buffer, { mode: 0o600 });
  return { cvPath, storedName };
}

const CV_PREFIX = "cvs";

/** Private Blob object: readable only with store credentials, never over an HTTP route. */
async function saveToBlob(file: UploadedFile): Promise<StoredCv> {
  const storedName = `${randomUUID()}.${file.extension}`;
  const blob = await put(`${CV_PREFIX}/${storedName}`, file.buffer, {
    access: "private",
    addRandomSuffix: false,
    contentType: file.mimeType || "application/octet-stream",
  });
  return { cvPath: blob.url, storedName };
}

/** Best-effort cleanup when a later step fails, so rejects do not litter storage. */
export async function removeCv(cvPath: string): Promise<void> {
  try {
    if (/^https?:\/\//.test(cvPath)) {
      await del(cvPath);
      return;
    }
    await unlink(cvPath);
  } catch {
    // Orphan report: the object or file stays behind, but the applicant already got a
    // rejection, so nothing sensitive was accepted. The URL is not logged.
    console.error("[upload] a rejected CV could not be deleted from storage; it may be an orphan.");
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function cvSizeMessage(): string {
  return `The CV is too large — the maximum is ${formatBytes(config.cvMaxBytes)}.`;
}

export function cvTypeMessage(): string {
  return `The CV must be one of these file types: ${config.cvAllowedExtensions.join(", ")}.`;
}

/** Shown when this deployment genuinely cannot accept a file. */
export function cvUnavailableMessage(): string {
  return "This deployment cannot store CV files yet, so please send your application without an attachment.";
}
