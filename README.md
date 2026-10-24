# Septa — company website

A complete, multi-route marketing site for Septa with its own submission backend: contact
enquiries, five-step service requests and career applications are validated in the browser,
validated again on the server, written to the database and (once SMTP is configured) emailed.
It is live on Vercel as one project: static frontend plus the API as a Node serverless function
on Postgres, with CV uploads stored as private Vercel Blob objects.

React 19 · TypeScript · Vite · Tailwind v4 · React Router 7 · Motion · Express 5 ·
`node:sqlite` (local) / Postgres (deployed) · Vercel Blob

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
npm run build       # tsc -b && vite build -> dist/, then build:api -> api/[...all].js
npm run build:api   # bundle the API into the Vercel Function entry (run by `build`)
npm run preview     # serve the built frontend
npm run start:api   # API only, no watcher
npm run smoke       # 22 end-to-end API checks (needs a running API)
npm run api:inbox   # read stored submissions from the terminal
npm run lint        # oxlint
```

`npm run api:inbox` and `npm run smoke` read the same store the API writes to. Against the
deployed database, run them inside the project's environment:

```bash
npx vercel env run -- npm run api:inbox
API_BASE_URL=https://<deployment-domain> ALLOW_LIVE_SUBMISSIONS=true \
  npx vercel env run -- npm run smoke
```

Without `ALLOW_LIVE_SUBMISSIONS=true` the smoke suite skips the cases that would write real
rows into the production store — only a target on `localhost` is allowed to write by default.

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

**Verified on 2026-10-24:** `tsc -b` clean, `vite build` clean, `npm run smoke` **22/22 against
the local API on SQLite**, **22/22 against the deployed Vercel function on Postgres**, all routes
and detail pages rendered, and all three forms submitted successfully from the browser — including
a CV upload written to disk locally and as a private Blob object on the deployment. One further
contact enquiry was sent through the live site in a browser and read back from Postgres by the
reference it returned.

**Anti-fabrication.** Anything Septa has not supplied is rendered as a visible
*not configured* chip naming the file to set it in — never invented. Case-study results carry an
`unverified` pill and a "to publish" note; sample articles and studies are tagged as samples in
their own copy (`Sample scenario · …`), so they stay labelled even when the developer notes are
off; the careers page shows a genuine "no published openings" state; legal pages declare
themselves templates until a date, entity and jurisdiction exist.

## What still needs configuration

1. **`src/lib/site.ts`** — email, support/careers address, phone, address, hours, stated reply
   window, social links, `VITE_SITE_URL`, legal dates / entity / governing law / retention. Until
   the addresses exist, an applicant who is told "we will reply by email" has no email to reply
   to, so the forms only promise storage and a reference.
2. **SMTP + `INBOX_EMAIL`** — the one remaining backend gap. Submissions are written and
   confirmed, but nothing is emailed, so `npm run api:inbox` (or the database) is currently the
   only way enquiries are seen. Until this is set, each receipt shows an amber
   *"Stored on the server, not emailed yet"* pill, which is the truth rather than a bug.
3. **Real content** — replace the 5 sample case studies, 6 sample articles and any company facts.
4. **Legal review** — the privacy notice and terms are structurally complete, not advice.

Done since this section was written: the backend is hosted (Vercel Function), submissions persist
in Postgres, and CV uploads are stored privately — see *Hosting*.

There is no admin UI, no CRM sync and no spam heuristic beyond the honeypot, rate limit and
server validation.

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
happens afterwards and its result is recorded on the row. A CV that is refused by the API's own
size limit gets a field message — a body larger than the platform's ~4.5 MB request cap never
reaches the code, which is why `CV_MAX_BYTES` is set below that ceiling. If the deployed database
is unreachable, `/api/*` answers `503` and the form reports failure instead of inventing a
receipt.

Protections: hand-rolled CORS against `ALLOWED_ORIGINS`, per-endpoint/per-IP fixed-window rate
limit, `X-Content-Type-Options: nosniff`, `Cache-Control: no-store`, body size caps, field-count
and field-size caps inside the multipart parser, extension allowlist, and CVs stored as
`<uuid>.<ext>` (mode `0600` on disk, `access: "private"` in Blob). **Uploads are never mounted as
static files** — there is no HTTP route that can serve a submitted CV back, and an anonymous GET
of a stored CV returns 403.

## Environment

Copy `.env.example` to `.env`. Every variable is optional; the file explains what each one does
and what happens when it is missing. Only `VITE_*` variables are ever inlined into browser code
— SMTP and inbox credentials stay server-side and are read from `process.env` in `server/config.ts`.

Minimum to go live:

```env
VITE_SITE_URL=https://sept.example
TRUST_PROXY=true
SMTP_HOST=smtp.provider.example
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=secret
SMTP_FROM="Septa Website <website@sept.example>"
INBOX_EMAIL=enquiries@sept.example
```

`POSTGRES_URL` (or `DATABASE_URL`) and `BLOB_STORE_ID` decide where submissions and CVs go; on
Vercel the Prisma Postgres and Blob integrations supply both, so they are not set by hand.
`ALLOWED_ORIGINS` is only needed when the browser calls the API on a different origin than the
site. `SMTP_URL` (nodemailer connection string) can replace the host/port/from triple. Env values
may only *tighten* the upload limits defined in `src/shared/schemas.ts`, never loosen them.

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

The site is deployed as **one Vercel project**: the static frontend from `dist/`, and the same
Express app running as a catch-all Node Function for every `/api/*` path. Storage is Postgres for
submissions and private Vercel Blob objects for CVs. Locally, nothing changes: the API runs as a
process and falls back to SQLite + `data/uploads` when no database is configured.

```
browser  ->  Vercel  ->  /api/*     -> api/[...all].js  -> Express app -> Postgres  (rows)
                                        (built by `npm run build:api`)              -> Vercel Blob (CVs)
                   ->  everything else -> dist/index.html (SPA rewrite)
```

`server/store.ts` issues identical SQL on both backends (one driver uses `node:sqlite`, the other
`postgres`), so `data/submissions.db` on a laptop and the deployed database hold the same columns.
`server/upload.ts` writes to Blob or disk the same way. A connection string is what picks the
driver — there is no separate build for each environment.

Four things about this layout are worth knowing before changing it:

- **A Vercel Function has no usable disk.** With `VERCEL` set and no connection string the API
  refuses to boot rather than write submissions into an ephemeral filesystem, so a misconfigured
  deploy fails loudly instead of losing enquiries.
- **The pooled endpoint is used on purpose.** `server/config.ts` rewrites a direct Prisma Postgres
  host to `pooled.db.prisma.io`, because every cold function invocation otherwise opens its own
  connection and a free plan caps at ten.
- **One database serves every environment.** Development, preview and production deployments share
  the same Postgres store, so preview traffic and smoke runs land in the production table. Filter
  by `created_at`, or delete rows you do not want, before launch.
- **The rate limiter is per warm instance**, not global — see `.env.example`.

### Deploying to Vercel

`vercel.json` declares the build (`npm run build` → `dist/`) and the SPA fallback rewrite
`/:path((?!api/).*)` → `/index.html`, which deliberately excludes `/api` so those paths reach the
Function instead of returning HTML.

1. **Connect the stores** once: add the Prisma Postgres and Blob integrations to the project. They
   inject `POSTGRES_URL`/`DATABASE_URL` and `BLOB_STORE_ID`, plus an OIDC token inside a Function
   that authorises writes to that store — so there is no Blob token to keep in your settings.
2. **Set the remaining variables**: `npx vercel env add VITE_SITE_URL production` and
   `npx vercel env add TRUST_PROXY production` with `true` — without it every visitor appears to
   come from Vercel's proxy and shares one rate-limit bucket. Add `SMTP_*` and `INBOX_EMAIL` the
   same way when they exist. Never prefix those with `VITE_`: that inlines them into the browser
   bundle.
3. **Deploy**: `npx vercel deploy --prod --yes`, or push to `main` now that the repository is
   connected (`npx vercel git connect`; check the session with `npx vercel whoami`). The Function
   entry is generated during the build — `npm run build:api` bundles `server/vercel-handler.ts` into
   `api/[...all].js` — so it is not committed. `api/package.json` **is** committed, because the root
   package is `"type": "module"` and the runtime would otherwise load that CommonJS bundle as ESM.
   Do not run `vercel build` in this working copy: it executes `npm ci`, which on Windows fails
   halfway when a running editor holds a native binary and leaves `node_modules` gutted.
4. **Verify**: `curl https://<domain>/api/status` must report `"storage": "postgres:…"`, then
   `API_BASE_URL=https://<domain> ALLOW_LIVE_SUBMISSIONS=true npx vercel env run -- npm run smoke`
   must be 22/22, then read back what it wrote with `npx vercel env run -- npm run api:inbox`. If a
   Function fails, `npx vercel logs --deployment <url>` shows the crash — and retry once before
   believing it, because a cold start plus a first database connection is the slowest request the
   site makes.
5. `VITE_SHOW_LAUNCH_NOTES` is intentionally **not** set in production: those notes name internal
   files and the storage endpoint. They are always on in `npm run dev`, and a preview build can be
   given them with `npx vercel env add VITE_SHOW_LAUNCH_NOTES preview`.

On any other host the same app runs as `npm run start:api` behind nginx/Caddy serving `dist/` and
proxying `/api` (Render, Fly.io, Railway, a VPS). Leave the connection string unset there and it
uses SQLite on the persistent disk; set `ALLOWED_ORIGINS` when the frontend is on another origin,
keep `.env` out of git, and re-run `npm run smoke` against the deployed URL.

## Layout

```
index.html            meta, fonts, favicon
vercel.json           build, output dir, SPA rewrite that leaves /api alone
api/                  generated Function entry (only package.json is committed)
src/
  App.tsx             routes, lazy pages, Suspense, ErrorBoundary
  pages/              15 route components
  components/         layout/ blocks/ forms/ ui/ visuals/
  data/               all editorial content
  lib/                api client, forms, validation, site config, paths, hooks
  shared/schemas.ts   Zod schemas used by browser AND server
  index.css           Tailwind theme tokens + component classes
server/
  app.ts              Express app: middleware, routes, security headers
  index.ts            local boot — open the store, then listen
  vercel-handler.ts   Function entry the build bundles into api/[...all].js
  config.ts           env parsing, driver choice, safe defaults, record-only fallback
  store.ts            one SQL, two drivers: node:sqlite locally, postgres deployed
  validate.ts         field mapping, honeypot, error shaping
  upload.ts           busboy limits, sanitised CV writes to disk or private Blob
  notify.ts           optional nodemailer forwarding
  rate-limit.ts       fixed-window per endpoint+IP
scripts/
  smoke.ts            22-case API test (refuses to write on a live target unless allowed)
  inbox.ts            read submissions from the terminal
```
