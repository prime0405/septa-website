import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp } from "./app.ts";
import { initStore } from "./store.ts";

/**
 * Vercel Function entry point.
 *
 * `npm run build:api` bundles this file into `api/[...all].js` (CommonJS, everything
 * inlined except packages), which claims every `/api/*` path. One origin for the site and
 * its backend means the frontend needs no `VITE_API_BASE_URL`.
 *
 * The app is built once per warm instance. There is no disk worth writing to here, so
 * submissions go to Postgres and CV files to Blob, both from variables the integrations
 * inject; without them every route answers honestly instead of pretending.
 */

const app = createApp();

/** Express's app callable with plain Node streams. */
const dispatch = app as unknown as (req: IncomingMessage, res: ServerResponse) => void;

function apiPath(url: string): string {
  const path = url.split("?")[0] ?? "/";
  const query = url.slice(path.length);
  if (path === "/api" || path.startsWith("/api/")) return path + query;
  return `/api${path === "/" ? "" : path}${query}`;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
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
        message: "The API is deployed but its database is not reachable, so nothing was saved.",
      }),
    );
    return;
  }

  req.url = apiPath(req.url ?? "/");
  dispatch(req, res);
}
