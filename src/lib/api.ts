import type { ApiStatus, SubmissionResult } from "../shared/schemas";

export class ApiError extends Error {
  fieldErrors: Record<string, string>;
  status?: number;
  kind: "server" | "network" | "rejected";

  constructor(
    message: string,
    fieldErrors: Record<string, string> = {},
    status?: number,
    kind: "server" | "network" | "rejected" = "server",
  ) {
    super(message);
    this.name = "ApiError";
    this.fieldErrors = fieldErrors;
    this.status = status;
    this.kind = kind;
  }
}

/**
 * Where the API lives. Same-origin `/api` is the default and works with the dev
 * proxy; set `VITE_API_BASE_URL` at build time when the API is hosted on another
 * origin, and add this site's origin to the API's `ALLOWED_ORIGINS` or the
 * browser will block every call.
 */
export const apiBase = (() => {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const trimmed = (configured ?? "").trim().replace(/\/+$/, "");
  return trimmed.length > 0 ? trimmed : "/api";
})();

async function post<T>(path: string, body: unknown, json = false): Promise<T> {
  let res: Response;
  try {
    res = await fetch(apiBase + path, {
      method: "POST",
      headers: json ? { "content-type": "application/json" } : undefined,
      body: json ? JSON.stringify(body) : (body as FormData),
    });
  } catch {
    throw new ApiError(
      "We could not reach our servers. Check your connection and try again — your answers are still on this page.",
      {},
      undefined,
      "network",
    );
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const e = (data && data.errors) || {};
    throw new ApiError(
      (data && data.message) || "Something went wrong on our side. Please try again.",
      e,
      res.status,
      res.status === 422 || res.status === 400 ? "rejected" : "server",
    );
  }
  /**
   * A static host with no backend answers POST /api/... with the SPA shell and a
   * 200. That is not a receipt, so it must never reach the "message received"
   * screen — only `ok: true` from the API counts as confirmation.
   */
  if (!data || data.ok !== true) {
    throw new ApiError(
      "We could not confirm that your submission was received, so it has not been recorded. Please try again.",
      {},
      res.status,
      "server",
    );
  }
  return data as T;
}

export const api = {
  status: async (): Promise<ApiStatus | null> => {
    try {
      const res = await fetch(apiBase + "/status", { headers: { accept: "application/json" } });
      if (!res.ok) return null;
      return (await res.json()) as ApiStatus;
    } catch {
      return null;
    }
  },
  contact: (payload: Record<string, unknown>) =>
    post<SubmissionResult>("/contact", payload, true),
  request: (payload: Record<string, unknown>) =>
    post<SubmissionResult>("/request", payload, true),
  careers: (payload: Record<string, unknown>) =>
    post<SubmissionResult>("/careers", payload, true),
  careersWithCv: (payload: Record<string, unknown>, file: File | null) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(payload)) {
      if (v !== undefined && v !== null) fd.append(k, String(v));
    }
    if (file) fd.append("cv", file, file.name);
    return post<SubmissionResult>("/careers", fd);
  },
};

/** Loads once per page, cached for the session. */
let statusPromise: Promise<ApiStatus | null> | null = null;
export function loadApiStatus() {
  if (!statusPromise) statusPromise = api.status();
  return statusPromise;
}
