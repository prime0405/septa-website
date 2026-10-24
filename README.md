# Septa — company website

A complete, multi-route marketing site for Septa with its own submission backend: contact
enquiries, five-step service requests and career applications are validated in the browser,
validated again on the server, written to SQLite and (once SMTP is configured) emailed.

React 19 · TypeScript · Vite · Tailwind v4 · React Router 7 · Motion · Express 5 · `node:sqlite`

---

## Quick start

```bash
npm install
cp .env.example .env      # optional — everything boots with no .env at all
npm run dev
```

`npm run dev` starts both halves through `concurrently`:

| Process | URL | Notes |
| --- | --- | --- |
| web (Vite) | http://localhost:5173 | proxies `/api` to the API |
| api (tsx watch) | http://127.0.0.1:8787 | creates `data/submissions.db` on first boot |

With no SMTP configured the API boots in **record-only** mode: submissions are stored, never
emailed, and every form says so on screen. Nothing is faked as "sent".

Other scripts:

```bash
npm run build       # tsc -b && vite build  ->  dist/
npm run preview     # serve the built frontend
npm run start:api   # API only, no watcher
npm run smoke       # 22 end-to-end API checks (needs a running API)
npm run api:inbox   # read stored submissions from the terminal
npm run lint        # oxlint
```

`npm run api:inbox -- --stream contact --limit 50 --json --full` — flags are combinable;
`--help` lists them.

---

## What is complete

**Pages (15 routes + detail pages).** `/`, `/about`, `/services` + 5 service pages,
`/product-development` + 2 track pages, `/case-studies` + 5 studies, `/blog` + 6 articles,
`/careers`, `/contact`, `/request`, `/privacy`, `/terms`, and a 404 that lists real destinations.
`/case-study` and `/career` redirect to their canonical paths. Every route is a real route with
its own `<title>`, description and breadcrumb — no scroll-jacking.

**Forms.** Contact, the 5-step Request wizard (draft saved to `localStorage`, per-step
validation, review screen, server-confirmed receipt with a reference id) and the Careers
application (optional CV upload). Server re-validates everything with the same Zod schemas the
browser uses.

**Verified on 2026-10-24:** `tsc -b` clean, `vite build` clean, `npm run smoke` **22/22**, all
routes and detail pages rendered, and all three forms submitted successfully from the browser —
including a CV upload written to disk under a sanitised `<uuid>.pdf` name.

**Anti-fabrication.** Anything Septa has not supplied is rendered as a visible
*not configured* chip naming the file to set it in — never invented. Case-study results carry an
`unverified` pill and a "to publish" note; sample articles and studies are tagged as samples;
the careers page shows a genuine "no published openings" state; legal pages declare themselves
templates until a date, entity and jurisdiction exist.

## What still needs configuration

All of this is on-screen and honest until done:

1. **`src/lib/site.ts`** — email, support/careers address, phone, address, hours, stated reply
   window, social links, `VITE_SITE_URL`, legal dates / entity / governing law / retention.
2. **SMTP + `INBOX_EMAIL`** in `.env` — until then nothing is emailed (banner text on every form
   page reflects this live from `GET /api/status`).
3. **Real content** — replace the 5 sample case studies, 6 sample articles and any company facts.
4. **Production storage** — SQLite on a persistent disk (see *Hosting* below).
5. **Legal review** — the privacy notice and terms are structurally complete, not advice.

Demo-only behaviour, clearly labelled: submissions land in `data/submissions.db` and the local
inbox command; there is no admin UI, no CRM sync and no spam heuristic beyond the honeypot,
rate limit and server validation.

---

## API contract

```
GET  /api/status     ->  { ok, backend, storage, emailDelivery, uploadsEnabled, mode }
GET  /api/health     ->  same body (for uptime checks)
POST /api/contact    ->  201 { ok, id, receivedAt, forwarded, note? }
POST /api/request    ->  same
POST /api/careers    ->  same  (JSON, or multipart/form-data with an optional `cv` file part)
```

Failure shapes: `422` + `{ message, errors: {field: message} }` for validation, `422` + a
generic message when the honeypot is filled (**nothing is stored**, no field map is leaked),
`429` + `Retry-After` when rate limited, `413` for oversized bodies, `404` JSON for unknown
`/api/*` paths. `ok: true` is returned **only after the row is written**; email forwarding
happens afterwards and its result is recorded on the row.

Protections: hand-rolled CORS against `ALLOWED_ORIGINS`, per-endpoint/per-IP fixed-window rate
limit, `X-Content-Type-Options: nosniff`, `Cache-Control: no-store`, body size caps, field-count
and field-size caps inside the multipart parser, extension allowlist, and CVs written as
`<uuid>.<ext>` with mode `0600`. **Uploads are never mounted as static files** — there is no
HTTP route that can serve a submitted CV back.

## Environment

Copy `.env.example` to `.env`. Every variable is optional; the file explains what each one does
and what happens when it is missing. Only `VITE_*` variables are ever inlined into browser code
— SMTP and inbox credentials stay server-side and are read from `process.env` in `server/config.ts`.

Minimum to go live:

```env
VITE_SITE_URL=https://sept.example
SMTP_HOST=smtp.provider.example
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=secret
SMTP_FROM="Septa Website <website@sept.example>"
INBOX_EMAIL=enquiries@sept.example
ALLOWED_ORIGINS=https://sept.example
```

`SMTP_URL` (nodemailer connection string) can replace the host/port/from triple. Env values may
only *tighten* the upload limits defined in `src/shared/schemas.ts`, never loosen them.

## Content model

Pages read entirely from data files — no JSX edits needed to publish:

| File | Drives |
| --- | --- |
| `src/data/services.ts` | `/services` and each service page |
| `src/data/products.ts` | `/product-development` and the two track pages |
| `src/data/cases.ts` | `/case-studies` and each study |
| `src/data/posts.ts` | `/blog` and each article |
| `src/data/jobs.ts` | `/careers` openings (`openings: []` = honest empty state) |
| `src/data/content.ts` | mission, values, process, approach, contact copy |
| `src/lib/site.ts` | company facts, legal config, privacy lists |

Adding a case study: append an object to `cases` with a unique `slug`, set `verified: true` on a
result only once a client has signed it off (unverified results render an amber pill and the page
is `noindex`ed). Adding an article: append to `posts` with `status: "sample"` until approved —
sample articles are tagged on screen and `noindex`ed. Careers: put a role in `openings` and the
application form switches from "expression of interest" to applying for that role.

## Styling and brand

Tailwind v4, configured in CSS at `src/index.css` under `@theme`. The accent token is still
called `--color-mint` for historical reasons; it now holds `#6fd4b8`, a brightened version of the
teal sampled from the Septa mark (`#6fafa3`), and the neutral surfaces sit in the same blue-ink
family as the logo. The mark itself is an inline SVG (`src/components/layout/Logo.tsx`) built
from two petal paths, plus `public/favicon.svg`, `public/septa-mark.jpg` (social card) and
`index.html` meta. Fonts are self-hosted through `@fontsource-variable` — no CDN requests.

Motion respects `prefers-reduced-motion`: every animation is gated on `useReducedMotion()`, the
reading progress bar disappears, and smooth scrolling becomes instant.

## Hosting

`npm run build` produces a static `dist/` plus a separate Node process for the API. Two rules
follow from that:

- **Do not deploy the API to a function/serverless platform expecting SQLite to persist.** Each
  invocation gets a fresh, ephemeral filesystem, so submissions silently accumulate in
  throw-away copies of `data/submissions.db`. The frontend can be static-hosted anywhere; the API
  needs a persistent disk.
- **Practical layouts:** one small VM or container (Render, Fly.io, Railway, Hetzner, a VPS)
  running `npm run start:api` behind nginx/Caddy that also serves `dist/` and proxies `/api`;
  or static frontend on Vercel/Netlify with the API on such a host and `ALLOWED_ORIGINS` set to
  the frontend origin.

For serverless-only hosting, replace `server/store.ts` with a Postgres/Turso driver:
`insertSubmission`, `listInbox`, `setForwardState`, `countByStream` and `initStore` are the only
functions the routes use, and the table shape is one `CREATE TABLE` in that file. Uploaded CVs
need object storage instead of `server/upload.ts`'s `saveCv`.

### Deploying the frontend on Vercel

`vercel.json` in the repo root already declares the build (`npm run build` → `dist/`) and the SPA
fallback rewrite `/:path((?!api/).*)` → `/index.html`, so deep links like `/careers` resolve. The
rewrite deliberately excludes `/api`, which is what lets the backend be proxied in later.

1. Push this repo to GitHub and *Import* it in Vercel (or run `npx vercel` in the project — the CLI
   needs `npx vercel login` first, which is interactive and must be run by you).
2. Set the build-time environment variables: `VITE_SITE_URL=https://<your-vercel-or-custom-domain>`
   and, for a frontend-only deploy, `VITE_SHOW_LAUNCH_NOTES=true`. With no backend reachable the
   forms then say *"Demo mode — no backend reachable"* instead of failing quietly, and the
   placeholder-content notes stay visible. Deploy without them and the site still behaves honestly —
   every submit reports that receipt could not be confirmed — it is just less explained.
3. Host the API on any persistent-disk service (Render, Fly.io, Railway, a VPS) running
   `npm run start:api`, then connect it one of two ways:

   | Way | What to set | Trade-off |
   | --- | --- | --- |
   | **Same-origin proxy (preferred)** | Add a Vercel rewrite `{"source": "/api/:path*", "destination": "https://<api-host>/api/:path*"}` above the SPA rule. No `VITE_*` change, no CORS. | Vercel forwards `x-real-ip`/`x-forwarded-for`, so set `TRUST_PROXY=true` on the API or the rate limiter collapses every visitor into one bucket. |
   | **Cross-origin** | `VITE_API_BASE_URL=https://<api-host>/api` and `ALLOWED_ORIGINS=https://<frontend-origin>` | The browser calls the API directly; the backend URL is public and preflighted. |

   Either way keep `NODE_ENV=production` and TLS on the API, and never put `SMTP_*` or
   `INBOX_EMAIL` into a `VITE_*` variable.
4. Re-check on the live URL: `/api/status` should return the JSON status, and `npm run smoke`
   against it (`API_BASE_URL=https://<api-host>`) should be 22/22. Turn `VITE_SHOW_LAUNCH_NOTES`
   off once the company facts in `src/lib/site.ts` are confirmed.

Before going live: set `NODE_ENV=production`, `HOST`/`PORT`, correct `ALLOWED_ORIGINS`, turn on
`TRUST_PROXY` only when a real reverse proxy is in front (the rate limiter keys on client IP),
put the API behind TLS, keep `.env` out of git, and re-run `npm run smoke` against the deployed
URL with `API_BASE_URL`.

## Layout

```
index.html            meta, fonts, favicon
src/
  App.tsx             routes, lazy pages, Suspense, ErrorBoundary
  pages/              15 route components
  components/         layout/ blocks/ forms/ ui/ visuals/
  data/               all editorial content
  lib/                api client, forms, validation, site config, paths, hooks
  shared/schemas.ts   Zod schemas used by browser AND server
  index.css           Tailwind theme tokens + component classes
server/
  index.ts            Express app and route handlers
  config.ts           env parsing, safe defaults, record-only fallback
  store.ts            node:sqlite persistence
  validate.ts         field mapping, honeypot, error shaping
  upload.ts           busboy limits, sanitised CV writes
  notify.ts           optional nodemailer forwarding
  rate-limit.ts       fixed-window per endpoint+IP
scripts/
  smoke.ts            22-case API test
  inbox.ts            read submissions from the terminal
```
