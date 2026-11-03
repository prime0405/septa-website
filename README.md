# Septa — company website

A complete, multi-route marketing site for Septa with its own submission backend: contact
enquiries, five-step service requests, career applications and footer newsletter sign-ups are
validated in the browser, validated again on the server, written to the database and (once SMTP
is configured) emailed.
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
validation, review screen, server-confirmed receipt with a reference id), the Careers application
(optional CV upload) and the footer Newsletter sign-up. Server re-validates everything with the
same Zod schemas the browser uses.

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
3. **Testimonials** — the brief names the section but supplies no quotes. The home page renders an
   explicitly empty placeholder that tells the reader where to add approved quotes
   (`src/data/content.ts`). Do not fill it with invented praise.
4. **Partner logos** — the eight partner names came from the brief and render as text. No logo
   files were supplied and nothing is claimed about the scope of any relationship, so approval is
   needed before any artwork or wording goes in.
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
| `src/data/content.ts` | mission, values, process, approach, contact copy, the Septa Advantage pillars, service-overview and services-intro lines, partner names, testimonials (empty until approved) |
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

**Type.** The manual specifies Louis George Café as the primary face and Open Sans as the
secondary. Both are self-hosted — Louis George Café from `src/assets/fonts/` via four
`@font-face` blocks (light / regular / bold / italic), Open Sans and JetBrains Mono through
`@fontsource-variable`. No CDN font requests. `--font-display` is Louis George Café with an Open
Sans fallback; headings use it, body copy uses Open Sans.
The bundled licence states the font is free for personal and business use including web graphics,
but it is not an OFL-style licence and does not name webfont embedding explicitly — worth
confirming with the designer before this faces a large paid audience.

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

The six `public/img/plate-*.jpg` files are generated abstract brand art, not stock photography and
not documentation: there is no client, product or team imagery for this site yet. Four are mapped
from a case or post slug by `src/lib/plates.ts`; `plate-hero.jpg` fronts the page heroes and
`plate-aurora.jpg` is the page-wide wash. They are encoded
from their PNG sources by `scripts/encode-plates.ps1`, which resizes, flattens onto white and writes
JPEG at a fixed quality (28–87KB each). Replace them with real photography as soon as it exists.

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
Two pointer effects follow the cursor on devices that have one. Cards under `a.card` carry a 7%
Tradewind radial wash that tracks the pointer (`src/components/ui/PointerGlow.tsx`) and lean up to
7° to face it (`usePointerTrack("tilt")` in `src/lib/pointerGlow.tsx` writes `--rx`/`--ry`; the
`.tilt` rule in `src/index.css` composes them with the pre-existing 3px hover lift and restates
`transform` inside `:hover` so it does not lose the cascade to `.card-hover:hover`). The angle is
clamped, because a card can slide out from under a still cursor and a raw ratio would then read a
pointer 900px outside the box. The hero's two CTAs drift up to 8px toward the pointer instead
(`Button`'s `magnetic` prop). All of them write through one rAF-coalesced handler and require
`(hover: hover) and (pointer: fine)`. On top of that, `CursorHalo` (`src/components/ui/CursorHalo.tsx`)
draws a 24px ring that lags the pointer and a 6px dot that sits exactly on it, and both grow 1.9×
over anything clickable; the loop stops itself once it has caught up so a still pointer costs
nothing, and while it runs it adds `cursor-none` to `<html>` so the arrow is gone and the halo is
the only pointer on screen. It is applied to the whole document rather than to the interactive
elements, because `cursor` inherits and a parent's `cursor: pointer` would otherwise win over a
child. The class is added only when the loop is eligible, so a touch device or a
`prefers-reduced-motion` visitor keeps the system cursor. The wash is capped at 7% because a
brighter tint on a white card
pulls `text-mint` under AA; with it spliced into the stack the worst measured pair on the site is
5.0:1.
Behind all of it the page never stands still. `BackgroundFX` (`src/components/BackgroundFX.tsx`)
renders two fixed layers on every route: a colour wash (a panned watercolour plate, a creeping
grid, two drifting orbs and a beam that crosses the viewport every 15s) at `z-0`, and a canvas of
nodes that wander and link to their neighbours in a separate layer at `z-20`, above the section
bands. The split exists because of contrast, not layering. Measured against a `source-over`
composite of everything that can coincide, a full-strength wash under the text column puts the
smallest label tokens under AA.

The answer is two masks that are mirror images of one another, both keyed to the same
`50% ± 600px / ± 760px` geometry. `.bgfx-wash` keeps the wash at full strength outside the reading
column and 30% of it inside. `.band::before` is how every section tone is painted now, a
`z-index: -1` pseudo-element rather than a background class, which lets it hold the veil at 82%
white across the column and open it to 30% in the gutters; `main` is `relative z-10`, so the veil
still lands above the wash and below the copy. What the pairing buys is amplitude exactly where
nothing writes: the gutter composite moves from about `#fafafa` to `#accfcf`, while every pixel
behind type is arithmetically the value that was already audited. It holds because `.wrap` is
1220px wide with 2rem of padding, so the last glyph sits 578px from centre and the veil only starts
ramping at 600px, and because cards, chips and panels are opaque fills. The stop positions are
wrapped in `max(0px, …)` / `min(100%, …)`: on a viewport narrow enough to make `50% - 760px`
negative, a bare negative stop resolves inconsistently and can drop the ramp across the middle of
the screen, where the text is. With the clamps the gutters simply disappear and the page keeps the
column treatment.
Both heroes carry the same veil (`band` on `PageHero` and on the homepage hero, which is why those
two sections set it explicitly instead of going through `Section tone`): their copy used to sit on
the raw wash, and the pair that failed because of it was the active nav link, `text-mint` at 14.4px
over a header that is still transparent at the top of a page. Against a composite of the plate at
its darkest, an orb and beam at their peaks and a mesh node on the glyph it measured 4.38:1; under
the same worst case the veil takes it to 4.85:1.

The mesh is the one layer allowed to cross type, so it is budgeted once at the layer rather than per
stroke: the canvas draws opaque `#6db1ae` lines and dots, which means two crossing lines cannot
darken a pixel more than one does, and `opacity: 0.16` behind a mask that retains 0.44 of it across
the column puts the worst pixel behind a glyph back at the 7% it was before. `--color-faint` was
darkened from `#56707a` to `#4d6772` in the same pass, because it carries the 10.5–11.5px mono
labels and the mesh crossing an `ink-raised` chip pulled it to 4.29:1. After that, a DOM walk over
ten routes that composites each element's own ancestor backgrounds with the worst-case wash leak and
a mesh node landing on the glyph reports no pair under AA.
Periods matter as much as colour here: at 76s the plate pans about one pixel a second and reads as a
static tint, so the layers now run at 22–34s with the travel doubled and the nodes drift at
0.34px/frame at ~30fps. Only the *speed* and the *gutter alpha* changed; every peak value behind the
column is the one the model above was solved against, because motion costs attention and only
darkness costs contrast.
The canvas caps its node count by viewport area, holds near 30fps, resizes off a `ResizeObserver`
rather than the window (a detached surface can report 0×0 and later become a real viewport without
firing a resize, and a 1×1 canvas stays empty for the rest of the visit), stops on
`visibilitychange`, and never starts under `prefers-reduced-motion`.
Abstract art stands in for photography that does not exist yet: `src/lib/plates.ts` maps a slug to
one of five generated plates, used on case-study covers, the featured post panel, the page-hero band
and the homepage hero. They are decorative brand art, not documentation, and say so. Because the
plates contain real ink, `PageHero`'s band and the homepage hero layer sit at 55% image opacity
behind an 82% white veil, and no small text is left on top of an artwork panel: the case-study
category and client descriptor moved into the card's text column, and the featured post's sample
labels sit on a solid caption bar.
One page swaps its plate for a film: Septa supplied `public/video/ai-product-development.mp4`, which
`PageHero` runs behind the AI Product Development header when the service data carries a `heroVideo`.
That clip is not a watercolour. Sampled as ASCII luminance maps, its mean never leaves the range
0.048–0.114, but individual cells reach 234–255 and the bright clusters drift straight through the
middle of the frame, so a flat scrim either erases the film or lets a particle pass behind an 11px
label and break AA. `.film-veil` is therefore the section-band mask again — 82% across the reading
column, 34% in the gutters — with a wider ramp (1100px rather than 760px, because a bright field
makes a narrow edge read as a box). A pure-white particle under the full veil leaves
`rgb(55, 73, 79)`, and against that ground the header's every text pair is measured: title 7.98,
lead 6.63, eyebrow 6.42, breadcrumb 5.07, chip label 6.50, aside 7.48–9.83. What that number also
settles is colour: the deepest Tradewind on the same ground is 3.44, which is fine for a rule and
not for a label, so on the film all type is Pearl White and the brand accent stays in the graphics
(the eyebrow rule, the chip tint, the primary button, the aside border). Playback is driven by an
`IntersectionObserver` rather than the `autoplay` attribute, so a header that has been scrolled past
stops decoding; `prefers-reduced-motion` never attaches the observer and the first frame stays on
screen; the section paints Black Pearl under the clip, so the failure mode is a plain dark header
rather than a broken one. Verified in the built bundle: the element reaches `readyState` 4 at
1280×720, and because there is no `autoplay` attribute the first frame it advances to can only have
come from the observer's `play()`, which resolves without an autoplay rejection. What is *not*
verified is a continuous run: the browser used for these checks keeps its tab hidden, and Chrome
suspends media in a hidden document after ~70ms regardless of who asked for it, so the loop itself
needs a real window. Every interior page keeps its white band — the workflow page's hero still
measures `::before` opacity 0.82 with the plate at 0.55 and no `<video>` in the DOM.
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
All of it is gated on `useReducedMotion()`, the reading progress bar disappears, and
smooth scrolling becomes instant.

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
