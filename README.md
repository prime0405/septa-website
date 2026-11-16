# Septa — company website

A complete, multi-route marketing site for Septa with its own submission backend: contact
enquiries, five-step service requests and career applications are validated in the browser,
validated again on the server, written to the database and (once SMTP
is configured) emailed. The backend also still serves a newsletter endpoint, but Septa took the
sign-up form out of the footer, so nothing on the site posts to it.
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
npm run build       # tsc -b && vite build -> dist/, then build:api -> api/[...all].js (committed)
npm run build:api   # bundle the API into the Vercel Function entry (run by `build`)
npm run preview     # serve the built frontend
npm run start:api   # API only, no watcher
npm run smoke       # 26 end-to-end API checks (needs a running API)
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

**Pages (16 routes + detail pages).** `/`, `/about`, `/services` + 5 service pages,
`/product-development` + 2 track pages, `/case-studies` + 5 studies, `/blog` + 6 articles,
`/careers`, `/faq`, `/contact`, `/request`, `/privacy`, `/terms`, and a 404 that lists real
destinations. `/case-study` and `/career` redirect to their canonical paths. Every route is a real
route with its own `<title>`, description and breadcrumb — no scroll-jacking. `/faq` is generated
from the same service and track data as the pages it links to, so it cannot drift from them.

**Forms.** Contact, the 5-step Request wizard (draft saved to `localStorage`, per-step
validation, review screen, server-confirmed receipt with a reference id) and the Careers application
(optional CV upload). Server re-validates everything with the
same Zod schemas the browser uses. `/api/newsletter` is still implemented, tested and reachable, but
has no form in the interface since Septa cut the footer sign-up.

**Verified on 2026-10-24:** `tsc -b` clean, `vite build` clean, `npm run smoke` **22/22 against
the local API on SQLite**, **22/22 against the deployed Vercel function on Postgres**, all routes
and detail pages rendered, and all three forms submitted successfully from the browser — including
a CV upload written to disk locally and as a private Blob object on the deployment. One further
contact enquiry was sent through the live site in a browser and read back from Postgres by the
reference it returned.

**Re-verified on 2026-10-30 after the brand update:** `npm run build` clean, `npm run lint` 7
warnings / 0 errors, `npm run smoke` **26/26 against the local API** (the four new cases cover the
newsletter endpoint, including that a honeypot submission stores nothing). In the browser at a
531 px viewport, all 20 route and detail paths rendered with zero console errors or warnings, no
page-level horizontal overflow, every internal link resolving to a real route, the `/request`
service preselection working from `?service=`, the mobile drawer opening with focus moved into the
panel and body scroll locked, and a newsletter sign-up round-tripping to a stored row that
`npm run api:inbox -- --stream newsletter` reads back. Full-page desktop screenshots were **not**
captured in this pass — the in-app browser surface was hidden for most of it — so the wide-layout
presentation of the new hero has been checked by code and at narrow widths only.

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
   **Social links are unverified.** The revamp brief supplied profile *names* (`septa_academy`,
   `septasoftware`, …), not URLs, so `site.social` derives `https://<network>/<handle>` from them
   and the code says so in a comment. Click-test all seven before launch; the brief also lists a
   "Community" destination with no address, which is deliberately absent rather than guessed.
2. **SMTP + `INBOX_EMAIL`** — the one remaining backend gap. Submissions are written and
   confirmed, but nothing is emailed, so `npm run api:inbox` (or the database) is currently the
   only way enquiries are seen. Until this is set, each receipt shows an amber
   *"Stored on the server, not emailed yet"* pill, which is the truth rather than a bug. The
   newsletter receipt also states plainly that nothing will be sent until Septa has a newsletter.
3. **Testimonial wording** — the four quotes the document supplies are in place and attributed
   exactly as the document attributes them (`src/data/content.ts`), and the section is built around
   them. What the document does not contain is an individual author or a job title for any of them,
   so the panel credits the organisation — Halogen Group, EHCC Leadership, Preppod Team, Toviri
   Team — and the site does not invent a person to say them. If Septa wants named spokespeople,
   those names have to come from the clients.
4. **Partner logos** — colour artwork for seven of the eight marquee partners is on file and is what
   the row reveals on hover (`public/partners/color/`); the same seven are flattened to grey
   silhouettes for the resting state. Chinat Group has no asset at all, so its entry shows the name in
   type, and EHCC has no asset either, so it is set in type in the testimonial ring and carries no mark
   in the panel. The eight partner names came from the
   brief, and nothing is claimed about the scope of any relationship, so approval is still needed
   before any further artwork or wording goes in.
5. **Real content** — replace the 5 sample case studies, 6 sample articles and any company facts.
6. **Legal review** — the privacy notice and terms are structurally complete, not advice.

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
POST /api/newsletter ->  same  (email + consent only; stored in the `newsletter` stream)
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
| `src/data/content.ts` | mission, values, process, approach, contact copy, the Septa Advantage pillars, service-overview and services-intro lines, partner names, the four testimonials and their client labels |
| `src/lib/site.ts` | company facts, legal config, privacy lists |

**Client-written copy is fenced off from editorial cleanup.** The revamp brief supplied certain
lines verbatim, and they are the client's words rather than the site's house voice: the five service
`heroTitle`s, the two product-track `heroTitle`s, `advantageIntro`, every `advantagePillars` title and
detail, `serviceOverview`, `servicesIntro`, `site.tagline`, `site.description`, the whole home hero
(headline, subline, badge, button labels, the three feature cards) and the closing CtaBand headline.
A copy pass may fix their punctuation but must not rewrite them. Several of them read like generic
agency marketing ("Work smarter, not harder", "Experience growth without limits", "Whether you need
an AI-powered product, smarter workflows, or complete product development…") and are the last lines
on the site that still sound that way; changing them needs Septa's sign-off, not an editor's.

Everything else on the site is written in the house voice: plain sentences, no em-dash asides, no
"X, not Y" constructions, no aphoristic closers, and hyphens only where English actually needs them.
That rule is worth preserving on future edits, because the copy had been drifting back toward
generated-sounding marketing prose.

Adding a case study: append an object to `cases` with a unique `slug`, set `verified: true` on a
result only once a client has signed it off (unverified results render an amber pill and the page
is `noindex`ed). Adding an article: append to `posts` with `status: "sample"` until approved —
sample articles are tagged on screen and `noindex`ed. Careers: put a role in `openings` and the
application form switches from "expression of interest" to applying for that role.

## Styling and brand

Tailwind v4, configured in CSS at `src/index.css` under `@theme`. The palette is the Septa brand
manual's, not a designer's guess at it: pure black `#000000`, Black Pearl `#061820`, Tradewind
`#6DB1AE` and white. The site is **light**: white is the page, Black Pearl is the type, and
Tradewind is the accent. Every surface is a step on that pairing (`--color-ink` `#ffffff`,
`--color-ink-raised` `#eef4f4` for recessed wells and the footer band, `--color-surface`
`#f6faf9`, `--color-surface-raised` `#ffffff` for cards, `--color-line` `#cfe0de`), and the text
tokens are Black Pearl taken up in lightness steps (`--color-fg` `#061820`, `--color-muted`
`#3a5a63`, `--color-faint` `#56707a`).

Tradewind itself is only 2.5:1 on white, so it is never used as text. The accent exists in two
roles: `--color-brand-teal` `#6db1ae` is the unchanged brand value and is reserved for solid fills
that carry Black Pearl on top (primary button, selected tab pill, checked boxes, the logo fin) at
7.4:1; `--color-mint` `#286f6a` is Tradewind taken down the same hue until it clears WCAG AA on
white, and it is what every `text-mint`, `border-mint` and tinted `bg-mint/x` on the site actually
resolves to. `--color-amber` and `--color-rose` are darkened the same way for status text. The
pairings were checked by computing contrast ratios against every surface, not by eye: body text
18.1:1, muted 7.4:1, faint 5.3:1, accent 5.9:1, amber 6.3:1, rose 5.7:1.
Accents are set to survive their own tints, not just white: labels and selected states put accent
text inside a 10% chip of the same hue, which costs about half a ratio point, and the worst such
pair (`text-rose` on `bg-rose/10`) still measures 4.95:1. For the same reason no text token is ever
drawn at reduced alpha. `text-mint/70` on `--color-ink-raised` measures 2.96:1 and `text-faint/60`
on white measures 2.42:1; both appeared in the gutter numbers of the step lists and the code panel,
and both now use the solid token.
No component carries a hard-coded hex. The only literal colour outside `@theme` is the Tradewind
fin in `Logo.tsx`, which is brand-fixed; the SVG visuals use Tailwind `fill-*` / `stroke-*`
utilities or an inline `style`, because `var()` does not resolve inside an SVG presentation
attribute.

**Dark hero.** The homepage hero is the only section that inverts, so its copy was measured against
the charcoal field that is actually painted behind the glyphs rather than against a token pair. Each
run of text was made transparent, its own box re-screenshotted, and the ground taken as the 99th
percentile of the pixels inside the text line boxes — so the mint dot in a label, the nav underline
and a single specular highlight in the animated field all stay out of the number. At 1440x900:
headline white 6.0–10.2:1, the six service labels 9.5–14.5:1 inside their pills, nav links
6.5–13.2:1, the outlined CTA 7.5–10.1:1, and both filled CTAs 10.6:1 (Black Pearl on mint). The one
accent word, `Forward.`, is 4.6:1 typical and 3.3:1 at the worst frame; at 78px/700 it is large
text, where the floor is 3.0, so it passes AA and does not pass AAA-large. The subcopy is white at
88% over the same ground the headline was measured on and is derived at roughly 5.5:1 rather than
measured directly.

**Type.** The brief asks for one family across the whole site, so Open Sans is now both the text
face and the display face: `--font-sans` and `--font-display` both resolve to
`"Open Sans Variable", "Open Sans", ui-sans-serif, system-ui, sans-serif`, self-hosted through
`@fontsource-variable` with no CDN request. Weights in use are 400 / 500 / 600 / 700. Louis George
Café is no longer applied anywhere; its four `@font-face` blocks remain in `src/index.css` and load
nothing unless a token is pointed back at them. Because Open Sans is a wide, low-contrast grotesque
and Louis George Café was a high-contrast serif, the heading scale was re-reviewed rather than left
alone — `h1` and `h2` take weight 700 with tightened tracking (-0.035em and -0.03em) and `h3`
-0.02em, so the hierarchy reads from weight, measure and spacing instead of from the serif's
contrast. The licence note below still applies to the bundled files that remain in the repo.

**Logo.** Rebuilt as vector from the supplied artwork rather than traced from a screenshot: two
fin paths, one Tradewind and one `currentColor`, so a single component recolours itself for any
background. The path data lives in `src/components/layout/brandPaths.ts` and is rendered by
`src/components/layout/Logo.tsx` (`Logo` = mark, `Wordmark` = full lockup). Standalone exports in
`public/` for anyone who wants the file rather than the component: `septa-logo.svg` (white
wordmark, for dark backgrounds), `septa-logo-ink.svg` (Black Pearl wordmark, for light ones),
`septa-mark.svg`, plus `favicon.svg`, `favicon.png` (512²) and `apple-touch-icon.png` (180²).
There is no theme switch: the site ships light. The wordmark picks its own colour from
`currentColor`, so it renders correctly anywhere, and `septa-logo.svg` is kept in `public/` for
dark placements the brand manual still calls for. The original brief asked for a predominantly dark
site and the hero was composed against the supplied dark motion reference; on 2026-10-30 that was
reversed at the owner's request, which is why the hero's glows, grid and dot textures are all
token-derived rather than painted — they were re-tinted by one `@theme` block, not redrawn. The one
element that deliberately stays dark on a white page is the delivery-core disc in
`HeroDiagram.tsx`, which uses `--color-brand-pearl` and `--color-brand-pearl-raised` so it reads as
a Black Pearl disc with white and Tradewind type on it.

The pictures the site shows are in `public/img/work/`: eight day-to-day workplace photographs,
generated as generic scenes (an office desk, a whiteboard, two people talking across a table) rather
than as documentation. They are not Septa staff, Septa premises or Septa client work, and the alt
text says what is in the frame instead of implying that it is. Each is 4:3 or 16:10, WebP-encoded in
a headless browser at 16–95KB (against ~9MB of PNG sources), and mapped to a slot deliberately:
`office-wide` fronts the homepage hero field and the page-header band, the three offering blocks take
`ai-development` / `product-planning` / `talent-conversation` from `landingBlocks`, the five service
pages carry their own in `services.ts`, `delivery-meeting` sits in the About story, `hiring-desk` in
Careers culture, and `delivery-meeting` / `support-monitoring` / `mobile-in-use` / `hiring-desk`
rotate across case-study and post covers by slug in `src/lib/photos.ts`. Replace them with real
photography as soon as it exists.

The six `public/img/plate-*.jpg` files are older generated abstract brand art and are only referenced
by `src/lib/bgThemes.ts`, which the parked `BackgroundFX` reads; nothing on a live page fetches them.
The three photographs Septa supplied for the offering blocks (`public/img/section/`) are likewise no
longer referenced — they were replaced by the set above. Both groups are kept on disk rather than
deleted, so the decision is still reversible.

**Motion.** `src/components/IntroCurtain.tsx` covers the first paint of a session with two Black
Pearl panels and "Welcome to Septa", holds ~1.15s, then parts them over 0.9s. Clicking or pressing
Esc skips it. It locks the page while running and releases `document.body` on its way out, and the
real homepage is underneath it the whole time: the layer is `aria-hidden`, and `Reveal` reads
`useIntroHeld()` from `src/lib/intro.ts` so no `whileInView` observer is consumed by content the
curtain is still covering. It runs once per browser session (`sessionStorage`), never under
`prefers-reduced-motion`, and never when the tab is backgrounded at boot, because a curtain nobody
watched is only a delay. The arming decision is memoised, so React's double render in development
cannot start a second one.
The hero headline staggers in by word. Every section label decodes into place: `Decode`
(`src/components/ui/Decode.tsx`) churns random glyphs, then resolves them left to right ~34ms per
character once the line scrolls into view, once. The real text never leaves the DOM and only
reserves the width, so a screen reader reads the label rather than the noise and the line cannot
jitter inside the flex row it sits in.
Two pointer effects follow the cursor on devices that have one. The lean and the wash are not
limited to the link cards any more: `Card` takes a `tilt` prop (`src/components/ui/primitives.tsx`)
that wires the same handler and the same `PointerGlow` child, so the static content grids lean too —
the homepage service overview, the Services listing grid, About's strengths, vision and mission,
Careers' culture, the service pages' core-service and who-we-serve
tiles, the case-study process and tool grids, and the FAQ service links. Measured with the pointer
parked inside a card and the cursor dot taken out of the shot, the copy over the lit wash floors at
6.24:1 on the homepage grid, 6.00:1 on a case-study tile and 5.51:1 on an About strength — AA for
small text is 4.5:1. Cards under `a.card` carry a 7%
Tradewind radial wash that tracks the pointer (`src/components/ui/PointerGlow.tsx`) and lean up to
7° to face it (`usePointerTrack("tilt")` in `src/lib/pointerGlow.tsx` writes `--rx`/`--ry`; the
`.tilt` rule in `src/index.css` composes them with the pre-existing 3px hover lift and restates
`transform` inside `:hover` so it does not lose the cascade to `.card-hover:hover`). The angle is
clamped, because a card can slide out from under a still cursor and a raw ratio would then read a
pointer 900px outside the box. Twenty call-to-action buttons drift up to 8px toward the
pointer instead (`Button`'s `magnetic` prop: the hero pair, every section and page-header action, the
CTA banners, the footer's two links and the not-found trio — deliberately not the form submits, which
must not move while someone is typing into the field above them, and not the nav sheet). The drift is a
`translate`, and so is the 1px press, which is why `Button`'s transition list names `translate` rather
than `transform`: Tailwind v4 compiles `translate-x-[…]` to the standalone property, so easing
`transform` there eases nothing and the button snaps frame to frame against a still cursor. All of these
write through one rAF-coalesced handler and require `(hover: hover) and (pointer: fine)`. On top of that, `CursorHalo` (`src/components/ui/CursorHalo.tsx`)
draws a 24px ring that lags the pointer and a 6px dot that sits exactly on it, and both grow 1.9×
over anything clickable; the loop stops itself once it has caught up so a still pointer costs
nothing, and while it runs it adds `cursor-none` to `<html>` so the arrow is gone and the halo is
the only pointer on screen. It is applied to the whole document rather than to the interactive
elements, because `cursor` inherits and a parent's `cursor: pointer` would otherwise win over a
child. The class is added only when the loop is eligible, so a touch device or a
`prefers-reduced-motion` visitor keeps the system cursor. The wash is capped at 7% because a
brighter tint on a white card
pulls `text-mint` under AA; with it spliced into the stack nothing either harness measured came below
4.76:1, which clears AA for small text.
Behind all of it the page is still — everywhere except the homepage hero. Septa asked for a white
ground with no moving backdrop, so `Layout` mounts no wallpaper layer on any route: `BackgroundFX`
(`src/components/BackgroundFX.tsx`), `WallMotion` and `useActiveWall` are unreferenced modules that
Vite never puts in the bundle, and no plate, film, grid, beam, orb or mesh byte is fetched anywhere.
The one background that moves is the homepage hero field, which paints its own opaque gradient and
carries its own grid, aurora orbs, spiral canvas and floating labels inside `.hero-field`
(`src/pages/Home.tsx`, `src/index.css`). The two slow plate drifts that page headers and artwork
cards carry (`.plate-drift`) are keyed to that section alone — outside it the stylesheet resolves the
animation to `none`, so no backdrop anywhere else moves. Verified at 1440×900: zero `.bgfx` and zero
`.bgfx-mesh` nodes on the homepage and on every inner route, `body` computes to `rgb(255, 255, 255)`
everywhere below the hero, and no route requests a video.
The photographs are the exception Septa asked for afterwards, and they are pictures rather than
backdrops. They are also not containers: Septa's complaint was that every one of them sat "in a box",
so `PhotoFigure` draws a sheet rather than a framed print. `.photo-sheet` (`src/index.css`) carries
`margin-inline` of exactly the negative of `.wrap`'s own padding-inline below 1024px, which puts the
picture flush against both edges of the phone screen; from 1024px the margin is dropped and only the
side named by `edge` is released, by one gutter (`-3.5rem`, the `lg:gap-14` the two-column blocks use),
so the sheet leaves its column and stops at the page margin instead of running under nothing. `edge`
also decides which corner is cut — `polygon(4rem 0, 100% 0, 100% 100%, 0 100%)` when the picture leaves
to the right, the mirror of it when it leaves to the left — so the edge that faces the words is a
diagonal and the edge that faces the page margin is square. A cut corner is the only ornament here, and
it is there to end the picture on a decision instead of on a border; the plane inside is set 8% outside
the clip on every side, so no page colour can appear along the diagonal however far the picture leans.
`PhotoFigure` (`src/components/blocks/PhotoFigure.tsx`) is six layers that never share a
transform: a clipped `.photo-cut` that is never scaled, so no layout can move; a `.photo-plane` set
8% outside the frame on every side, which carries the scroll curve, the parallax, the pointer lean and
the lift; the `img` itself, which breathes (`.photo-breathe`, a 34s scale from 1.04 to 1.10 with a
small diagonal drift) so an image nobody is scrolling or hovering is still not a frozen one; a
`.photo-sheen` stripe — one low-alpha gradient 2.6 times the frame's width — that crosses the glass
every twelve seconds and spends the rest of the cycle off the clip; a radial bloom that follows the
cursor (`mix-blend-plus-lighter`, 38% × 46% of the frame, white at 0.3 alpha); and a `.photo-vignette`
that deepens the corners over the same half second the cursor is on the frame, which is what makes the
bloom read as a reflection rather than as a white blob. The scroll curve is the plateau described
below, shared with the sections through `settle` (`src/lib/scroll-curve.ts`) so a section and the
photograph inside it breathe on one schedule: the plane widens from 1.05 at the edges of its pass to
1.17 while it holds the middle of the screen and drifts 18px the other way on the same value. Colour
rides the same curve — `saturate` 0.86 → 1 and `brightness` 0.97 → 1 — so a photograph arriving from
below comes up into its own colour instead of sliding in already finished. Under the pointer the plane
leans up to 3.4° and lifts 16px out of its frame on one spring (`stiffness` 150, `damping` 22), which
arrives with a little weight instead of snapping to the mouse, and it is gated on `hover: hover`. Case
and post covers keep their own, simpler answer to the pointer (`.photo-cover`, 5.5%, disarmed where
there is no hover to leave).

**The sections stack.** Septa asked for the opposite of a cross-fade: "when I scroll, it should seem
like the new page is sliding up and covering up the old page". The first attempt lagged each band
±6vh on its scroll progress, which reads as parallax, not as covering — Septa rejected it, and the
lag is gone. `StackSheet` (`src/components/blocks/StackSheet.tsx`) now gives every homepage band after
the hero two things: a `z-index` from its `order` in the sequence, and `position: sticky` with
`top: calc(100svh - var(--sheet-h))`. That pins the sheet's **bottom** edge to the bottom of the
viewport, so a band scrolls normally until you have read all of it and only then holds still while
the next one rides up over it. `--sheet-h` is the sheet's own `offsetHeight`, written by a
`ResizeObserver` in a layout effect, because the pin has to be arithmetic on a height CSS cannot
otherwise name. Sticky adds no page height, so the document is exactly as long as it was.

Three details make it hold together. The containing block is `<main>`, not a per-sheet wrapper — a
wrapper the height of its own sheet gives sticky zero travel. `100svh` rather than `dvh` or `vh` pins
with the last line above the fold even with mobile chrome showing; when the chrome retracts, the strip
it uncovers is already filled by the arriving sheet, so it is never a gap. And the hero is the floor
under the whole stack: `position: sticky; top: 0; z-index: 1`, with a plain spacer sibling carrying the
runway the hero's own scroll progress is measured on (the old `100svh + 58vh` track is gone, because a
measured element must not be the one being transformed). `.stack-sheet` adds one shadow along the
leading edge — `0 -1.25rem 2.25rem -1.5rem` at 30% of the ink — because two opaque bands meeting
without a seam read as one band, not as one passing over the other. The footer carries `z-20` so it
covers the last sheet in turn.

`.band::before` used to paint the section's tone at 0.76, which let the wallpaper show through; a
translucent sheet laid over a moving page is not a sheet, it is a veil, so the plate is opaque and the
tone it carries is the only thing between one band and the next. That is a contrast change and it was
re-read: the three tones are `#ffffff`, `#eef4f4` and `#f6faf9`, the body text is `rgb(6, 24, 32)`, and
the darkest of the three pairings is body text on `#eef4f4` at 15.4:1 — the plate going solid only ever
removes a lighter layer from underneath, so it cannot make a pairing worse.

Verified by driving a real headless Chrome down the page and asking `document.elementFromPoint` who
owns each slice of the viewport. At 1440×748 every sheet pins at exactly `vh − h` (sheet 0: `top: 55px`,
height 693), the ownership column shows the incoming sheet taking the lower viewport while the pinned
one holds the top, all sheets release together as the footer arrives, and the hero measures `[0, 748]`
at every stop. Repeated at 390×844 (viewport 692): sheets taller than the phone — the advantage band is
1872px — carry a negative pin and scroll normally until their bottom reaches 692, then hold; the
capture mid-handover shows the pinned band's last card at the top and the next band's white plate
arriving underneath it. No console errors at either width.

`CtaArrival` (`src/components/blocks/CtaArrival.tsx`) is the third ask in the same sentence — CTAs that
enlarge and bolden as they enter the screen and then return. It wraps each hero and offering button and
each service-overview CTA, and on `useInView` (without `once`, so it replays when the band comes back)
runs one keyframe set: `scale` 1 → 1.07 → 1 and `textShadow` 0 → 0.65px → 0, over 1.05s with the peak at
34% so the arrival is a swell rather than a bounce. The bolden is a shadow and not a `font-weight`,
because the display face ships as two static TTFs and animating weight would swap the file mid-pulse;
both keyframes carry four identical shadow layers so the property interpolates instead of snapping. It
is held (`waiting`) while the welcome curtain is still up, so the pulse is spent on a page the visitor
can actually see, and under reduced motion the component renders a plain span. Verified at 1440×900 by
sampling the computed style through the pass: `matrix(1 …)` → 1.027 → 1.051 → 1.066 → **1.069** → 1.064
→ 1.053 → 1.037 → 1.021 → `none`, with the shadow blur tracking it at 0 → 0.26 → 0.47 → 0.62 → **0.65**
→ 0.60 → 0.49 → 0.34 → 0.18 → 0px.

`SectionStage` (`src/components/blocks/SectionStage.tsx`) wraps the content of all six sections
after the hero — the three offerings, the advantage, the service overview and the
testimonial — and the footer, and scales it 0.955 → 1.00, fades it 0.82 → 1.00 and drifts it ±12px on
the same curve.
The curve is a plateau, not a peak, and that is the whole of the difference between this and the
half-sine it replaces: a sine is at its maximum for one instant, so a section was technically full size
only at the exact middle of its pass and visibly under size for all of the reading either side of it.
`settle` holds 1.0 from 38% to 62% of the pass and only moves at the ends, with smoothstep ramps
because a plateau has two corners and a corner in a curve you can watch is a hitch. The drift is signed
by which end of the pass you are on, so a section rises into place as it arrives and leaves the same
few pixels ahead of it going out. Two things keep it clean: the band underneath is not scaled, only
what sits on it, so the page's structure stays put while its contents breathe; and the element being
measured for scroll progress is a plain wrapper, not the transformed one, because a bounding rect
includes its own transform and scaling the measured box would feed the curve back into itself. The
partner marquee is deliberately outside a stage: it runs edge to edge and scaling it would pull both
ends in off the screen. Verified in the browser at 1440×900: one stage swept through its pass measures
0.955 / 0.955 / 0.955 / 0.955 / 0.9677 / 0.9971 / 0.9976 / 1.0000 / 0.9985 against the formula, with
the translate and the opacity matching to three decimals; the plane at rest measures 1.17,
`saturate(1) brightness(1)`, a `none` bloom and overcovers its frame on all four sides (-121 / -80 /
-104 / -88px) so no page colour can appear at an edge; with the cursor in it the same plane measures
`m11` 1.1954, `m43` 16, perspective terms `m13` 0.028 and `m23` 0.028 and a bloom centred at 31.5%
36.6%; sampled as pixels, the point under the cursor lifts +17 luma, the far corner drops -5, and a
point outside both does not move. With `--force-prefers-reduced-motion` the stages compute to `none` at
opacity 1, the plane holds a constant 1.1 with `m43` 0 and `saturate(1) brightness(1)`, hovering it
changes nothing, and `document.getAnimations()` reports zero running.

**The footer arrives, but never leaves.** It was the one band on the homepage with no stage on it, so
it came up flat while everything above it settled into place. Wrapping it in the same stage would have
been wrong, though, and the reason is arithmetic rather than taste: measured against `end start` the
travel is `h + vh`, so an element that ends the document tops out at `h / (h + vh)` — 0.485 on a
1440×900 desktop, which is inside the plateau, but 0.689 on a 390×844 phone, which is past it. The page
would have come to rest with its own footer shrunk and dimmed, permanently, on exactly the viewport
where the footer is tallest. `last` measures against `end end` instead: the travel is `h`, progress is
exactly 1 at the bottom of the page whatever the two heights are, and halving it before `settle` keeps
only the rising ramp. The footer therefore grows into place as it covers the last sheet and is at full
size and strength from 76% of its pass onward. Its plate, top hairline and grid stay outside the stage,
which is the same division every other section makes. Verified in the browser at 1440×900, at 390×844
and on `/about`: scale climbs 0.955 → 0.9562 → 0.9622 → 0.9714 → 0.9817 → 0.9912 → 0.9979 → 1 and
holds, opacity 0.82 → 1 on the same samples, translate +12px → 0, and at the bottom of the page the
transform computes to `none` at opacity 1. All twenty footer links hit-test to themselves at the scroll
position that centres each one, `scrollWidth` equals `innerWidth` at both sizes, and the console is
clean. The legal row carries `pb-20 xl:pb-5` because below `xl` the wrap runs to the viewport edge and
the last line would otherwise rest under the back-to-top button; above it the centred wrap clears it.

The paragraphs on the wash, the mesh and their masks are the record of that layer while it ran. They
are kept because most of the contrast figures quoted through the rest of this section were measured
against it, and because bringing it back is a mount in `Layout` rather than a rewrite.

The line art is two canvases, not one, and only the one under the eye is lit: see the handover below.
The canvas runs one of five subjects, chosen by what the page — or, on a long page, the section under
the visitor's eye — is about (`src/lib/bgThemes.ts`): a wireframe globe ringed by breathing pulses and
orbited by motes, a depth-layered node network carrying packets along its links, an isometric cube
lattice with a light front sweeping across it, a bundle of routed lanes joined by risers, and a stack
of sheared strata. Every subject also answers to the scroll, because a fixed canvas that ignores the
page reads as a screensaver: the network shears by node depth, the globe turns, the cube grid slides
on a two-row period so its wrap cannot be seen, the lanes shift phase, and the strata rise through a
stack whose attributes are keyed to the slot rather than to the plate.

Changing that subject mid-scroll is the one place the wallpaper can look broken, so the handover is a
dissolve rather than a swap. `WallMotion` keeps two mounted scenes and moves the new subject onto the
dark one; CSS crosses the pair over 1.1s (`.bgfx-mesh[data-on]`), so the line art is at full strength
on one side or the other for every frame of the change — the earlier version faded the single canvas to
zero and back, which read as the wallpaper being switched off, and mounting a fresh canvas per subject
put three of them on screen during a fast scroll. The two are a ceiling, not a convenience: same-colour
layers composite to `a + b(1 - a)`, which peaks at the single-layer 0.28, so a fade costs no contrast
and a third canvas would be both an unknown and a GPU bill. `useActiveWall` therefore makes the answer
sticky twice — a section keeps the centre line until the eye is 28px past its edge, so stopping on the
boundary and nudging back cannot make two neighbours trade the answer at the rate the wheel fires, and
a second handover waits 1200ms, a beat longer than the dissolve, before it is allowed to start. The
wash colours (`@property`-registered, 1.1s) and the plate fade run the same length, so a section
change is one move instead of three layers arriving at three different times. The plate is the layer
that needed the most care, because a plate is a large image and `decoding="async"` can leave it in
flight a second after it mounts: `PlateStack` holds the outgoing slot in state alongside the incoming
one — the swap happens during the render that adopts the new source, so no commit has the slot half
empty — and only starts the fade once the incoming element has decoded, writing `data-lit` to that
element rather than to a flag keyed on the source, so a plate that comes back later fades up again
instead of arriving already lit. The outgoing plate is retired 150ms after the fade begins. Measured
with a page-side frame clock: the pair runs 0.28/0.00 → 0.27/0.01 →
0.22/0.06 → 0.16/0.12 → 0.11/0.17 → 0.06/0.22 → 0.01/0.27 → 0.00/0.28, the pair sums to 0.28 at every
sample so no frame has both layers dark, coverage never exceeds 0.28, and ±6px of jitter on a boundary
produces zero flips. Across a route change the sampler saw exactly one wash handover, the outgoing
plate held at 0.55 until the incoming reached 0.52, and there was no frame in which the slot held no
element or no visible element.

The layer split exists because
of contrast, not layering. Measured against a `source-over`
composite of everything that can coincide, a full-strength wash under the text column puts the
smallest label tokens under AA.

The answer was two masks that are mirror images of one another, both keyed to the same
`50% ± 600px / ± 760px` geometry. `.bgfx-wash` kept the wash at full strength outside the reading
column and 30% of it inside. `.band::before` — a `z-index: -1` pseudo-element rather than a background
class, which is still how every section tone is painted — held the veil at 76% white across the column
and opened it to 30% in the gutters, and `main` is `relative z-10`, so the veil landed above the wash
and below the copy. What the pairing bought was amplitude exactly where nothing writes: the gutter
composite moves from about `#fafafa` to `#accfcf`, while every pixel behind type is arithmetically the
value that was already audited. It held because `.wrap` is 1220px wide with 2rem of padding, so the
last glyph sits 578px from centre and the veil only starts ramping at 600px, and because cards, chips
and panels are opaque fills. The stop positions were wrapped in `max(0px, …)` / `min(100%, …)`: on a
viewport narrow enough to make `50% - 760px` negative, a bare negative stop resolves inconsistently
and can drop the ramp across the middle of the screen, where the text is. With no wash behind it there
is nothing for the gutters to open onto, so that horizontal mask is gone from `.band::before` and the
veil is a flat 76% across the whole band; the pseudo-element stays, because it is still the thing that
paints the tone.
Both heroes carry the same veil (`band` on `PageHero` and on the homepage hero, which is why those
two sections set it explicitly instead of going through `Section tone`): their copy used to sit on
the raw wash, and the pair that failed because of it was the active nav link, `text-mint` at 14.4px
over a header that is still transparent at the top of a page. Against a composite of the plate at
its darkest, an orb and beam at their peaks and a mesh node on the glyph it measured 4.38:1; under
the same worst case the veil takes it to 4.85:1.

Loudness was a second, separate answer from *which* wall is lit, and `BackgroundFX` was the only place
that knew both, so it published them on `html[data-hero-wall]`: `--bgfx-k` is 0.4 by default and 1 while
the homepage hero is the lit section. The moving layers are grouped so that a single
`opacity: var(--bgfx-k)` reaches the plate, the grid, the beam and both orbs at once — they animate
their own opacity in their own keyframes, so a per-element rule would have meant rewriting every stop —
and the mesh multiplies its own 0.28 budget by the same number. The var now only waits for a restored
layer; the flag is still live, because it also picks the scrollbar gutter colour — the classic Windows
gutter paints the root background, so a dark hero with a white gutter reads as a page that stops short
of the screen edge. With `BackgroundFX` parked, `Home` writes it from an `IntersectionObserver` on the
hero field, so the gutter is dark for exactly as long as the hero straddles the middle of the viewport
and white from the first band after it.

The mesh is the one layer allowed to cross type, so it is budgeted once at the layer rather than per
stroke — and the shape of that budget is what lets the art be bold. The ceiling is the *opaque
colour*, not the coverage: the canvas never draws anything darker than `#6db1ae` at full alpha, so two
crossing lines, a six-pixel stroke and a filled facet all leave the same worst pixel behind a glyph,
and `opacity: 0.28` behind a mask that retains 0.62 of it across the column holds that pixel at 17%
Tradewind however much of the viewport the art ends up painting. Presence therefore has to come from
weight, size and structure, and from ink *darker* than the ground — the page is light, so a pale
highlight, however large, simply disappears. That is why the glow sprite is a Tradewind halo rather
than a white one, and why an alpha below about 0.4 is not a faint stroke on this ground but no stroke
at all. The dark grounds are the one place where brighter ink is a risk instead of a free lunch,
because there the copy is white and any halo lifts the ground toward it. Both are measured with the
wallpaper running: on the homepage Pearl band the brightest pixel under the heading is
`rgb(23, 49, 56)` — 17% Tradewind over Black Pearl, which is precisely the ceiling the layer is
budgeted to — and the white display line on it holds at 13.7:1. The marquee's text fallbacks cannot be
isolated by the same probe, because the track paints every label twice and the clip lands on its own
twin; composited against that measured ground they come to 9.0:1.
`--color-faint` was darkened from `#56707a` to `#4d6772` in the same pass, because it carries the
10.5–11.5px mono labels and the mesh crossing an `ink-raised` chip pulled it to 4.29:1.

Every figure in this section is measured rather than argued, and the measurement is split in two,
because a run of copy is only a test of the wallpaper if the wallpaper is what sits behind it.
**Copy on the wallpaper:** for each run of real body text the harness hides that element, screenshots
the exact box it occupied and takes the worst background pixel against the element's own computed
colour, two passes across the animation's cycle at every stop down the document, at 1440×900 and
390×844. An element is skipped when it or any ancestor paints a ground of its own — a colour *or* an
image. That second half matters: the `card` class paints its white-to-`surface` gradient through the
`background` shorthand, so its computed `background-color` reads `rgba(0, 0, 0, 0)` and every line
inside a card used to be sampled as though it were standing on the mesh, which is how the advantage
reel's detail paragraph reported 1.47:1 against the card's own border. **Copy on a painted ground** is
measured instead by compositing the computed backgrounds of the element and its ancestors, stop by
stop, and comparing the pair arithmetically — no pixels, so a reel that cycles cannot move the answer
between the pick and the clip. That check runs over seven routes at both widths and returns 5.59:1 as
the worst pair on every one of them (`text-faint` on a card's `surface` end), with nothing below AA.
The curtain on the way into the homepage is part of the first ground, so the harness waits for the
panels to leave before it shoots — a clip taken while they still cover the viewport reports Black
Pearl as the background and the headline as 1.00:1. Fixed chrome is put out of the shot at every stop
for the same reason: the scroll-to-top button is a 44px Pearl circle with a `text-muted` arrow, it
mounts on scroll, and at 390 the content column reaches the corner it sits in, so any clip that
grazed it photographed that arrow as the ground. With the layers as they now stand, the worst pair on
the wallpaper is 5.22:1 on the homepage and 5.24 on About at 1440×900, and 6.06 on Services; at
390×844, where the gutters have disappeared and the whole viewport takes the column value, the same
three pages floor at 4.76, 5.20 and 5.22. The floors are the 11.52px client caption under a node on
the testimonial ring, the hero lead, and the eyebrow and label mono lines; each clears AA for small
text by at least 0.26, body copy did not go below 5.31 and no display line came under 14.9. They sit
differently from the figures this section carried until now because the sweep replaced a one-frame probe
— walking the page meets the darkest moment of the wash *and* surfaces labels a single static frame never
looked at — and because the painted grounds have now been taken out of it, which removes the darkest
samples of all: copy that was never standing on the mesh. Re-shooting the three boxes that first phone
pass reported at 1.05 and 2.4, at their true position and with the button out of the way, puts 13.54:1
behind the heading and 6.11 and 6.20 behind the two paragraphs. Over the film hero the same harness,
switched to take the *brightest* pixel because the type is white, gives the figures quoted with that
section below: 9.18 on the title, 7.56 on the lead and 8.78 on the 11.2px eyebrow.
Periods matter as much as colour here: at 76s the plate pans about one pixel a second and reads as a
static tint, so the wash layers run at 22–34s with the travel doubled, the globe turns roughly once a
minute, a pulse breathes out and back every 9s and a packet crosses a link in two to five seconds.
The canvas caps its counts by viewport area (22–68 nodes, around 200 cubes, four to six lanes),
buckets links and cubes into four weight bands so a field costs four stroke calls rather than a
thousand, holds near 30fps, resizes off a `ResizeObserver`
rather than the window (a detached surface can report 0×0 and later become a real viewport without
firing a resize, and a 1×1 canvas stays empty for the rest of the visit), stops on
`visibilitychange`, and never starts under `prefers-reduced-motion` — where the DOM confirms no canvas
element exists at all rather than an idle one.
The artwork panels are photographs now, not abstract plates: `src/lib/photos.ts` maps a case-study or
post slug to one of four workplace scenes, and the larger placements name their file directly (see
the imagery note above). They are generic scenes, not documentation, and the alt text says so.
Because a photograph has bright pixels in it, `PageHero`'s band sits at 55% image opacity behind an
82% white veil, the homepage hero field holds `office-wide` at 13% under a Pearl wash, and no small
text is left on top of an artwork panel: the case-study category and client descriptor moved into the
card's text column, and the featured post's sample labels sit on a solid caption bar.
One page used to swap its plate for a film: Septa supplied `public/video/ai-product-development.mp4`
and `PageHero` ran it behind the AI Product Development header while the service data carried a
`heroVideo`. That wiring is out — a moving film behind an inner page is precisely the background
animation Septa asked to have removed, and its Pearl field is precisely the non-white ground — so the
AI header now renders the same white band as every other interior page. `heroVideo`, `FilmBackdrop`,
`.film-veil`, the `.on-dark` type rules and the `film` pill tone are deleted, and the clip stays in
`public/video/` as supplied material that nothing requests. What was learned from the clip is worth
keeping: it is not a watercolour. Sampled as ASCII luminance maps its mean never leaves 0.048–0.114,
but individual cells reach 234–255 and the bright clusters drift straight through the middle of the
frame, so a flat scrim either erases the film or lets a particle pass behind an 11px label and break
AA. The veil that stood there was therefore the section-band mask again — 82% across the reading
column, 34% in the gutters, with a wider ramp (1100px rather than 760px, because a bright field makes
a narrow edge read as a box) — and a pure-white particle under it left `rgb(55, 73, 79)`, against
which the swept harness gave title 9.18, lead 7.56 and 8.78 for the 11.2px eyebrow (the worst pixel,
i.e. the brightest, since that type was white). The breadcrumb, the chip labels and the aside copy
were outside that set because each sat on its own tinted ground rather than on the raw veil.
Three traps in the probe are worth naming, because each produces a confident wrong number. It hides one
element at a time and samples the box it vacated, so it can only be pointed at whole text runs:
widening it to every inner `span` returns a meaningless 1.16 for the animated eyebrow, because hiding
one character of a decoding label leaves its neighbours' white glyphs inside the sampled box. And the
clip is resolved in document coordinates while `getBoundingClientRect` is viewport-relative, so a
swept run that forgets to add `scrollY` samples the top of the page for every position and reports
the whole site as 1.00:1. The third is the one that cost a wrong fix: the probe decides a run sits on
the raw ground by walking its ancestors for a `backgroundColor`, but `.card` paints its opaque gradient
through `background:`, which lands in `background-image` and leaves the colour transparent — so card
copy was measured as though the wallpaper reached it. That is what the 4.24:1 on the About vision and
mission labels turned out to be: `text-mint` against the card's own `dot-bg` pattern, at 14% mint over
the gradient, with the wallpaper nowhere in the box. The number is real and AA is AA, so the labels now
take `--color-mint-bright`, the darker step of the pair `.eyebrow` already uses for the same reason, and
the same step went to the clause labels on the legal pages and the process numbers on a use case. Those
two labels measure 5.40 at 1440×900 and 5.42 at 390×844.
That ground also settled a colour rule that still applies wherever a Pearl field appears, which is now
only the homepage hero: the deepest Tradewind measured over a particle that has passed through the full
veil lands at 3.44, fine for a rule and not for a label, so on a dark field all type is Pearl White and
the brand accent stays in the graphics (the eyebrow rule, the chip tint, the primary button, the aside
border). Film playback was driven by an `IntersectionObserver` rather than the `autoplay` attribute, so
a header that had been scrolled past stopped decoding, and `prefers-reduced-motion` never attached the
observer at all. What is *not* verified anywhere in this file is a continuous loop run in a real
window: the browser used for these checks keeps its tab hidden, and Chrome suspends media in a hidden
document after ~70ms regardless of who asked for it. Every interior page keeps its white band — the AI
page's hero measures `::before` opacity 1 with the plate at 0.55 and no `<video>` in the DOM; the band
plate went solid when the homepage sections started stacking, and `getComputedStyle` on a `.band` at
1440×900 now resolves it to `rgb(255, 255, 255)` on `surface`, `rgb(238, 244, 244)` on `raised` and
`rgb(246, 250, 249)` on the third tone, with no alpha on any of them.
`AutoRollList` (`src/components/ui/AutoRollList.tsx`, timing in `src/lib/useRollCycle.ts`) advances
itself through a list, one item at a time, and stops dead under the pointer. The clock is the
progress fill's own `animationend` rather than a parallel `setTimeout`, so pausing the animation
pauses the list and the two cannot drift apart; `data-roll-paused="true"` drives
`animation-play-state`, and is also set when the block leaves the screen or takes focus. A spring
rail slides to the active row and the emphasis is carried by tone (`bg-mint/[0.06]` plus accent
text) rather than opacity, because dimming the inactive rows to 60% had put their body copy at
2.4:1. Used on the homepage capability lists and, with `autoRoll`, on the delivery process strip.
Under reduced motion the fill is not rendered at all: a 0.001ms animation would fire `animationend`
continuously, and the list degrades to a plain static list.
The homepage service overview runs the same clock over its cards, which is what Septa asked for when
they said the hover should be "automatic — you don't have to hover above it for it to be activated",
and then that "the press 3d animations should also be automated".
`ServiceGrid` (`src/components/blocks/ServiceGrid.tsx`) holds one index at a time and lights that card
with the treatment the pointer used to give it: a mint border, the glow, 3px of lift, and now a press
in 3D. The lift goes through `--lift` and the press through its own `--press-rx` / `--press-ry` /
`--press-z`, all summed in one `transform`, because the pointer tilt writes `--rx` / `--ry` and the two
have to compose instead of fight. They must be *separate* variables: a CSS animation outranks an inline
style in the cascade, so an automated press written to the same property the cursor writes would
simply overwrite it. `@property` registrations (`<angle>` and `<length>`) are what let the keyframes
interpolate at all. `card-press` runs over one interval — out to −26px at 22%, back through −12px and
−20px, home at 100% — and `:hover` cancels it, so a cursor arriving mid-press takes the card over.
`useRollCycle` is the reason the grid lives in its own file: the hook belongs to the block, not to the
page.

The line is on the button, not the card. Septa: "the lines shouldn't show on those buttons, it should
be on the mini buttons, like the 'work with us' button (it should go around it)". The rail that used to
run across the top of each card is deleted; `.cta-ring` is now an arc travelling around the lit card's
pill CTA, and it is the clock — one lap is one interval and its `animationend` is what advances the
walk, so the arc is an honest statement of how long is left on this card. It is a `conic-gradient`
rotated by an `@property`-registered `--cta-sweep`, masked to a 2px border with two mask layers
(`content-box` and border-box, `mask-composite: exclude`) inside a `border-radius: 9999px` box, so it
follows the pill exactly at any label length with no JS measurement. It sits at `inset: -1px` so the
band straddles the button's own hairline rather than drawing a second ring inside it, and the arc is a
comet — a long faint tail rising to a hard deep-teal head — because that is what makes the direction of
travel legible on a shape this small. The resting `.cta-line` border is a 42% mint mix and the lit one
only 48%: the first pass held the lit border at 72% and the arc had nothing to stand out against, so
the base was dropped until the moving line is the brightest thing on the button.
The cycle freezes on hover, on focus and when the block is off screen, and under reduced motion it
freezes permanently and draws no ring at all, leaving every card in its resting state.

Verified by driving a real headless Chrome and sampling on the wall clock: the light walked
AI Product Development → Talent Solutions → Workflow Automation → Observability & Monitoring →
Digital Transformation → back to the first, twice, with seven `cta-sweep` `animationend` events and the
lit card's `--press-z` reaching −25px between them. Scrolled away from the grid, the same probe reads
`animation-play-state: paused`, `--cta-sweep: 0deg` and no advancement over 192 seconds — the off-screen
freeze is real, not just declared. The section header came down at the same time: Septa said it was too
large, so `SectionHero` gained a `size="md"` step (`clamp(1.5rem,2.9vw,2.15rem)`, leading 1.16) and the
service overview uses it, measuring 34.4px against the 49.6px it had.
The homepage hero also has depth: `useScroll` on the hero section drives three layers at different
rates as it leaves the viewport (grid 70px, aurora 130px, copy −26px, the last one against the
first two). Section headings rise out of a mask (`MaskRise` in `src/components/ui/primitives.tsx`
wraps the title in `overflow-hidden` and slides it up from 110%; the 0.16em padding plus equal
negative margin is what keeps descenders from being clipped without changing the layout by a pixel),
and the homepage technology strip scrolls as a marquee: two identical groups inside one
`translate3d(-50%, 0, 0)` loop, so the seam is invisible, and the copy is `aria-hidden` so assistive
tech reads the list once. It pauses on hover and, under `prefers-reduced-motion`, the animation is
dropped, the duplicate is removed and the strip becomes a plain horizontal scroller instead of
hiding content behind a mask.
The partner row is the same machine, now on a light band like every other section, and now much
shorter: Septa asked for the section to be reduced, and it was taking a screen of its own. It runs
`py-12 sm:py-14` instead of the 56–112px `.section` rhythm, its heading is `clamp(1.5rem,3vw,2.1rem)`
against the two-thirds of the other section titles, and there are seven pixels of air between the two
instead of forty. A logo strip is a footnote to the page, not a chapter. It also sits outside
`SectionStage` — the strip runs edge to edge, so scaling it would pull both ends off the screen — but
inside `StackSheet` like every other band. Each mark sits in
a fixed `.partner-slot` holding two absolutely placed images: the supplied artwork flattened to a
grey silhouette, and the colour artwork Septa provided for the same client under
`public/partners/color/` (each file was scanned for `script`, event attributes and external
references before it was copied in). Both live in the same box, so revealing the colour version
cannot reflow the row, and the fade is a plain opacity pair — `.partner-slot:hover` swaps which one
is up. The silhouette is `filter: brightness(0)` at 45% rather than the old inverted white because
the ground is now light; the colour layer is the only place the real brand schemes appear, and only
one at a time. The marquee already stops while the pointer is anywhere on it, so the mark being
looked at is a still one. `gap` and `padding-right` on the group are deliberately the same
number — the loop shifts by exactly one group, so any difference between the two appears as a jump
at the seam. Chinat Group has no asset, so its name is rendered as text in the same slot. The logos
are `alt=""` and the duplicate group is `aria-hidden`; the eight names are exposed once in a
visually-hidden list instead. The colour files are the artwork exactly as supplied, and two of them
are full resolution for a box that renders at 176x56, so the layer is `loading="lazy"` and is
`display: none` under `@media (hover: none)` — a touch device has no hover, so it never pays the
708KB for a state it can never see, and the row costs 79KB there instead. Measured on the light
ground with the wallpaper running: the lowest live text reading anywhere on the homepage is 5.29:1,
and a silhouette at 45% of full black is well over the 3:1 a graphic needs.
The client testimonial section is a selector rather than a list — `TestimonialOrbit`
(`src/components/visuals/TestimonialOrbit.tsx`). The four clients sit on a dashed orbit that crawls
(`.orbit-path`, 26s), the centre of the ring holds the mark of whoever is selected, and the quote panel
to the right is one card holding all four quotes in the same grid cell.

The dot is the clock, which is the change Septa asked for: "the dot that moves round in a circle should
also switch the current testimonial being viewed (when it gets to each logo, the testimonial should
change to that company or individual's testimonial)". It used to run its own 22s CSS lap as scenery
while the quote changed only on click, so the two things in the ring were telling different stories.
`.orbit-runner` and its keyframes are deleted; the angle is now a `useMotionValue` advanced one frame
at a time in `useAnimationFrame`, and the selected client is *derived* from it. The nodes sit at 315°,
45°, 225° and 135° clockwise from twelve, so the order the dot reaches them is `[1, 3, 2, 0]` and one
24s lap gives each client six seconds. The angle is kept inside one turn — rotation is periodic, so
wrapping is visually free and keeps the shortest-arc arithmetic honest after any number of laps. A
click, an arrow key or a step button does not stop the dot, it steers it: the quote changes immediately
and the dot travels the shorter arc to that node at 0.4°/ms, so the ring never shows one client
selected while the dot stands somewhere else. The per-frame delta is clamped to 64ms so a backgrounded
tab handing back seconds cannot jump half a lap. Hover, keyboard focus, scrolling the ring off screen
and reduced motion all freeze the lap through `useAutoPause` — the pause half of `useRollCycle`,
extracted so the grid and the ring share one set of conditions while keeping their own clocks. Below
`lg` there is no dot, so the angle simply stands at whichever client is selected.

The letters are gone too: "replace the letters in the testimonial circle animation with the logos of
the company (all except EHCC should be present in the partners folder)". Three of the four clients have
supplied artwork and show it, in the node and in the centre disc; EHCC has none and is set in type
rather than given an invented mark. `.orbit-mark` is a `brightness(0)` silhouette at 40% until its node
is the active one, the same treatment the partner strip uses and for the same reason — four coloured
logos in a ring is four competing focal points. Every mark is given a **definite** box with
`object-contain`, not `w-auto` with a max: `preppod.svg` ships a `viewBox` and no `width`/`height`, so
inside the centre disc's shrink-to-fit absolute span it measured 0×0 and the disc rendered empty. With
a `h-10 w-[4.6rem]` box all three resolve to 74×40 and centre identically. The same missing dimensions
had emptied the panel's credit chip, which used `max-h-6 w-auto` and measured 0×0 for Preppod while the
other two rendered; rather than patch a third box, the asset itself now carries `width="971"
height="268"` (both the mono and the colour copy), so every `w-auto` use of it resolves — the chip
measures 87×24 inside a 115×44 plate.

The lit plate takes the ground its lockup was drawn for. The supplied artwork is not one consistent
set: Preppod's wordmark is `#fff`, Halogen's mark is `#FFCC2A` gold, and Toviri's whole lockup is a
single `#1E3A8A` blue. On a white plate the first two lose the half of themselves that carries the
name — and the active state was the one state they disappeared in, because `brightness(0)` had been
turning the white lettering black for the inactive nodes all along. On a Pearl plate Toviri's blue
falls to roughly 1.9:1. No single ground serves all three, so `knockout` on the testimonial record
says which ground the file needs and the plate cross-fades with the mark: Pearl for Halogen and
Preppod, the light `surface-raised` for Toviri and for EHCC's typed fallback. The credit chip follows
the same rule. Re-measured with the fix: Halogen 24×24, Preppod 87×24 and Toviri 69×24 in the chip, the
full lockup visible in the disc, the node and the chip for all four selections, and no console errors
through a full lap.

There are no photographs in the source material and no individual authors, so the rest of the selection
system is built out of type: the client's name under its node, the work label and the supplied mark in
the panel, and a link to that client's case study. Selecting by hand is a click, never a hover — a
pointer crossing the ring on its way to the nav must not rewrite the quote out from under the reader,
and the measured hover state changes only the border and text colours. The four panels share one cell
so the section is as tall as the longest quote and changing selection cannot resize the page underneath
(measured 446px at 1440, 368px at 768, 550px at 390, identical for all four). Which panel is showing is a
cross-dissolve on the children (`.tpanel[data-on]`, staggered 70ms and 140ms), and the inactive three are
`inert` and `aria-hidden` rather than unmounted, so the panel is never empty and never tabbable twice.
It is a `tablist`: one `role="tab"` per client with a roving `tabIndex`, arrows and Home/End move
selection and focus together, the active ring is a shared-element `layoutId` slide, and below `lg` the
same DOM becomes a snap strip with the panel underneath it and 44px step controls. Measured at all
three widths: click, keyboard, prev/next and wrap all change the quote, hover never does,
`document.scrollWidth` equals the viewport, and every run of copy in the section clears AA against the
ground actually behind it. The dot-to-quote coupling was verified by sampling the runner's computed
rotation against `aria-selected` and the visible `tabpanel` across three full laps in a real headless
Chrome: Halogen holds 315°→45°, EHCC 45°→135°, Toviri 135°→225°, Preppod 225°→315°, then it wraps, with
the centre disc and the node silhouettes following every switch and no console errors.
The section straddles the two harnesses above: the client caption on the ring stands on the mesh and is
measured with it, at 5.36:1 on the homepage and 5.24 on About at 1440×900 and 4.76 and 5.20 at
390×844, while the panel paints its own card and is measured with the composited check — 7.07:1 for the
quote, 17.22 for the client name, 5.71 for the `01 / 04` readout, the same on both pages. With reduced
motion on, which drops the orbit animations and lists all four clients at once, the ring caption floors
at 5.13 on the homepage and 5.21 on About and the panel rows do not move.
All of it is gated on `useReducedMotion()`, the reading progress bar disappears, and
smooth scrolling becomes instant.

The homepage runs in the order Septa set out in the revamp brief, and most of its headlines are a
centred band header (`SectionHero` in `src/components/ui/primitives.tsx`: eyebrow, one-size-up
`MaskRise` title, lead, actions underneath) with that section's content below it, rather than the
older left-aligned heading with a button beside it. The three offering blocks are the exception:
each is a two-column split with the words on one side and Septa's artwork for that offering on the
other, and the picture changes side on every block so the three read as one argument rather than
three copies of a layout. The files are named after the section they belong to and are held in
`landingBlocks` (`src/data/content.ts`) as `image` and `alt`. They arrived as 3.07MB of PNGs —
4000px-wide artwork for a box that renders at 548×411 — so all three were re-encoded to 221KB of
WebP at their display size, and the talent plate lost a 23px white stripe down its left edge. Each
sits in one 4:3 frame with `object-cover`, which is what makes two square files and one wide file
line up with each other; the wide AI plate is the one exception, anchored to the right edge so the
crop falls on the empty haze at its left instead of on the cloud and AI tiles at its right. The sequence is hero, Company information,
Who we serve, Services, AI product development, Traditional product development, The Septa
Advantage, Our approach, Why Septa, Case studies, Talent solutions, Latest writing, Our partners,
Testimonial, and then the footer's one closing banner. Three of the brief's headlines are deliberately not on the site:
Success Metrics (KPIs), Competitor & Inspiration References and Timeline describe the redesign
project, not the business, and publishing them would put Septa's internal brief and its competitor
list on the public page. The two lists the brief does contribute and the site did not have, the four
target audiences and the three primary markets, are in `src/data/content.ts` as `audiences` and
`markets` and are printed in Septa's own wording. Because the sections were re-sequenced, the band
tones (`ink`, `raised`, `surface`) were re-walked so no two neighbours match; that alternation is
the only thing separating one hero from the next on a long page.

**The ask is said once, in the footer.** Septa noticed that the homepage's "Let's Build What's Next,
Together!" banner and the footer's "Next step" band were the same invitation in two places, and asked
for one. The banner's copy (`ctaBanner`, `src/data/content.ts`) is now rendered by `Footer` at the top
of the footer, so it closes every page rather than sitting mid-page on a few of them, and every
page-level closing panel was removed with it: `CtaSection` (homepage, About, the five service pages,
the case studies) and `CtaBand` (Blog, BlogPost) are both gone from the tree. The copy those panels
used is kept unrendered in `about.cta` and in each service's `cta.headline` / `cta.copy`, since those
lines are Septa's own wording from the brief and not the site's to delete. Nothing functional went
with the panels: the service pages and the case studies still carry their pre-filled "Request a
Service" button in the page header — which is where `cta.label` and `cta.to` are still read — and the
links the two bands offered as their second button (About Septa, Read more writing) are in the header
navigation, the footer navigation and, on a post, the related-articles block directly above.
The footer is now three tiers — the banner, then everything else in one two-column block, then the
legal strip. Septa's second complaint about that block was that it ran too long with empty page beside
it, and the cause was structural: the brand column carried the description and the contact details on
top of nothing else while three navigation lists stood beside it, so the row was as tall as the brand
column and as wide as four equal tracks. The networks moved under the brand, which fills the hole with
the content that was already there.
Septa then cut the block down further, and the four removals are worth recording because two of them
took something with them. The newsletter is gone from the interface: `NewsletterForm` is deleted and
`src/components/forms/` no longer has it. The server side was deliberately left in place — `/api/newsletter`,
its schema, its store stream and its smoke tests all still exist — because the endpoint is not the part
Septa objected to, and re-adding a form to a live endpoint is a component, not a migration. The phone
number and the address lines are gone from the footer entirely; they remain in `site.contact` because
the Contact page still renders them and still shows the `Unconfigured` chip for each.
What is left of the contact row is marks, not words. Each network is one `.mark-chip` — a 2.5rem circle
whose `<a>` carries the profile URL, so the logo *is* the link — and the email is the same shape with a
`mailto:` href, which is why the typed handle list, the two Septa Academy accounts and the three dashed
"not configured" boxes went with it. `site.social` is now a flat `SocialAccount[]` rather than the
`SocialGroup[]` it was, because the grouping existed only to hang two handles under one mark; with the
handles gone there is nothing to group. That is also the reason Facebook left the site: Septa's only
Facebook page is the Academy's, and an Academy mark would have been an Academy link wearing a different
icon. The array is typed as `"x" | "linkedin" | "instagram"` and `SocialMarks` has no `facebook` path,
so adding the network back is a type change, a path and a URL, in that order.
`.mark-chip` is `rgb(6 24 32 / 6%)` on the `#eef4f4` plate, which puts the mark itself at roughly 15:1;
the hover swaps to solid mint, and the focus ring is the same rule the rest of the site uses. When the
email is unconfigured the chip cannot be a link, so it is an inert `role="img"` span with a dashed
border, no fill and an `aria-label` that says so — a dead envelope that looks live is exactly the kind
of control the brief forbids. Verified at 1440×900 and 390×844: four chips (mail, X, LinkedIn,
Instagram), zero `<form>` elements in the footer, zero phone or address nodes, and the closing headline
appearing once per page.

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
   entry is generated by `npm run build:api`, which bundles `server/vercel-handler.ts` into
   `api/[...all].js` — and that file **is committed**, because a Git-triggered build looks for
   functions in the cloned source before your build command runs: leave it ignored and the deploy
   succeeds with no `/api` routes at all (every call 404s). The build always rewrites it from the
   TypeScript source, so the copy in git can never be what actually runs. `api/package.json` is
   committed too: the root package is `"type": "module"`, and without it the runtime loads the
   CommonJS bundle as ESM and crashes on the first request.
   Do not run `vercel build` in this working copy: it executes `npm ci`, which on Windows fails
   halfway when a running editor holds a native binary and leaves `node_modules` gutted.
4. **Verify**: `curl https://<domain>/api/status` must report `"storage": "postgres:…"`, then
   `API_BASE_URL=https://<domain> ALLOW_LIVE_SUBMISSIONS=true npx vercel env run -- npm run smoke`
   must be 26/26, then read back what it wrote with `npx vercel env run -- npm run api:inbox`. If a
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
api/[...all].js       generated Function entry, committed so git builds find it
public/               brand exports (septa-logo.svg, -ink, mark) + favicons + og-default.png
src/
  App.tsx             routes, lazy pages, Suspense, ErrorBoundary
  pages/              16 route components
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
  smoke.ts            26-case API test (refuses to write on a live target unless allowed)
  inbox.ts            read submissions from the terminal
```
