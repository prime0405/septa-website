/**
 * Minimal type surface for the `busboy` multipart parser.
 *
 * busboy@1.6.0 ships no bundled types, and this project keeps exactly one added
 * dependency (`busboy`), so the handful of members we use are declared here.
 */
declare module "busboy" {
  import type { IncomingHttpHeaders } from "node:http";
  import type { Writable } from "node:stream";

  interface BusboyLimits {
    /** Max characters per multipart field name. */
    fieldNameSize?: number | undefined;
    /** Max bytes per multipart field value. */
    fieldSize?: number | undefined;
    /** Max number of non-file fields. */
    fields?: number | undefined;
    /** Max bytes per file part. */
    fileSize?: number | undefined;
    /** Max number of file parts. */
    files?: number | undefined;
    /** Max number of header key/value pairs in the part headers. */
    headerPairs?: number | undefined;
    /** Max bytes per part header value. */
    headerValueSize?: number | undefined;
  }

  interface BusboyOptions {
    headers: IncomingHttpHeaders;
    preservePath?: boolean | undefined;
    highWaterMark?: number | undefined;
    deflateSafe?: boolean | undefined;
    limits?: BusboyLimits | undefined;
  }

  interface BusboyFileInfo {
    filename: string;
    encoding: string;
    mimeType: string;
  }

  /** busboy@1.6 passes the part metadata as this third argument, not as loose args. */
  interface BusboyFieldInfo {
    nameTruncated: boolean;
    valueTruncated: boolean;
    encoding: string;
    mimeType: string;
  }

  interface BusboyFileStream extends Writable {
    on(event: "data", listener: (chunk: Buffer) => void): this;
    on(event: "limit", listener: () => void): this;
    on(event: "error", listener: (error: Error) => void): this;
    on(event: "close" | "end" | "aborted" | "destroy", listener: () => void): this;
  }

  interface Busboy extends Writable {
    on(event: "readable", listener: () => void): this;
    on(
      event: "field",
      listener: (name: string, value: string, info: BusboyFieldInfo) => void,
    ): this;
    on(event: "file", listener: (name: string, stream: BusboyFileStream, info: BusboyFileInfo) => void): this;
    on(event: "finish" | "close", listener: () => void): this;
    on(event: "partsLimit" | "filesLimit" | "fieldsLimit", listener: () => void): this;
    on(event: "error", listener: (error: Error) => void): this;
  }

  export default function busboy(options: BusboyOptions): Busboy;
}
