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
3. **Testimonial wording** — the four quotes the document supplies are in place and attributed
   exactly as the document attributes them (`src/data/content.ts`), and the section is built around
   them. What the document does not contain is an individual author or a job title for any of them,
   so the panel credits the organisation — Halogen Group, EHCC Leadership, Preppod Team, Toviri
   Team — and the site does not invent a person to say them. If Septa wants named spokespeople,
   those names have to come from the clients.
4. **Partner logos** — four client marks were supplied and are on file in `public/partners`; three of
   them (Halogen, Preppod, Toviri) are used in the testimonial panel and the marquee, and EHCC has no
   artwork so its entry shows the name in type. The eight partner names came from the brief, and
   nothing is claimed about the scope of any relationship, so approval is still needed before any
   further artwork or wording goes in.
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
Behind all of it the page never stands still. `BackgroundFX` (`src/components/BackgroundFX.tsx`)
renders a fixed colour wash on every route — a panned plate, or a generated film where a
theme supplies one, plus a creeping grid, a beam that crosses the viewport every 15s and two drifting
orbs — at `z-0`, and the live line art in a separate layer at `z-20`, above the section bands.
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

The answer is two masks that are mirror images of one another, both keyed to the same
`50% ± 600px / ± 760px` geometry. `.bgfx-wash` keeps the wash at full strength outside the reading
column and 30% of it inside. `.band::before` is how every section tone is painted now, a
`z-index: -1` pseudo-element rather than a background class, which lets it hold the veil at 76%
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
`rgb(55, 73, 79)`, and against that ground the header's type painted directly on the film is
re-measured with the new wallpaper running, over a sweep of the page rather than one static frame:
title 9.18, lead 7.56, the 11.2px eyebrow 8.78 (the worst pixel, i.e. the brightest, since this is
white text). The breadcrumb, the chip labels and the aside copy are outside that set because each
sits on its own tinted ground rather than on the raw veil, so they test the tint and not the scrim.
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
That ground also settles the colour question: the deepest Tradewind on it is 3.44, which is fine
for a rule and not for a label, so on the film all type is Pearl White and the brand accent stays in
the graphics
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
measures `::before` opacity 0.76 with the plate at 0.55 and no `<video>` in the DOM.
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
The partner row is the same machine carrying the seven SVGs Septa supplied, served from this origin
under `public/partners/` (each was scanned for `script`, event attributes and external references
before it was copied in). They are drawn as white silhouettes on a solid Pearl band because three of
the seven are white artwork exported for a dark site, so no single light ground can carry the set:
`filter: brightness(0) invert(1)` flattens every mark to one treatment rather than showing seven
colour schemes side by side. The band is `bg-brand-pearl` and not a veiled `band`, which would let
the page wash back through it. `gap` and `padding-right` on the group are deliberately the same
number — the loop shifts by exactly one group, so any difference between the two appears as a jump
at the seam. Chinat Group has no asset, so its name is rendered as text in the same slot. The logos
are `alt=""` and the duplicate group is `aria-hidden`; the eight names are exposed once in a
visually-hidden list instead. Measured on the Pearl ground: heading 18.1:1, lead 14.1:1, eyebrow
13.5:1, the text fallback 10.4:1, and a silhouette at 70% opacity 9.2:1, where graphics need 3:1.
The client testimonial section is a selector rather than a list — `TestimonialOrbit`
(`src/components/visuals/TestimonialOrbit.tsx`). The four clients sit on a dashed orbit that crawls
(`.orbit-path`, 26s) with a dot running the same circle (`useActiveWall`-independent, 22s), the centre
of the ring holds the initial of whoever is selected, and the quote panel to the right is one card
holding all four quotes in the same grid cell. There are no photographs in the source material and no
individual authors, so the selection system is built out of type: the client's initial in a disc, the
client's name under it, the work label and the supplied mark in the panel, and a link to that client's
case study. Selecting is a click, never a hover — a pointer crossing the ring on its way to the nav
must not rewrite the quote out from under the reader, and the measured hover state changes only the
border and text colours. The four panels share one cell so the section is as tall as the longest quote
and changing selection cannot resize the page underneath (measured 446px at 1440, 368px at 768, 550px
at 390, identical for all four). Which panel is showing is a cross-dissolve on the children
(`.tpanel[data-on]`, staggered 70ms and 140ms), and the inactive three are `inert` and `aria-hidden`
rather than unmounted, so the panel is never empty and never tabbable twice. It is a `tablist`: one
`role="tab"` per client with a roving `tabIndex`, arrows and Home/End move selection and focus
together, the active ring is a shared-element `layoutId` slide, and below `lg` the same DOM becomes a
snap strip with the panel underneath it and 44px step controls. Measured at all three widths: click,
keyboard, prev/next and wrap all change the quote, hover never does, `document.scrollWidth` equals the
viewport, and every run of copy in the section clears AA against the ground actually behind it. The
section straddles the two harnesses above: the client caption on the ring stands on the mesh and is
measured with it, at 5.36:1 on the homepage and 5.24 on About at 1440×900 and 4.76 and 5.20 at
390×844, while the panel paints its own card and is measured with the composited check — 7.07:1 for the
quote, 17.22 for the client name, 5.71 for the `01 / 04` readout, the same on both pages. With reduced
motion on, which drops the orbit animations and lists all four clients at once, the ring caption floors
at 5.13 on the homepage and 5.21 on About and the panel rows do not move.
All of it is gated on `useReducedMotion()`, the reading progress bar disappears, and
smooth scrolling becomes instant.

The homepage runs in the order Septa set out in the revamp brief, and every headline on it is a
centred band header (`SectionHero` in `src/components/ui/primitives.tsx`: eyebrow, one-size-up
`MaskRise` title, lead, actions underneath) with that section's content below it, rather than the
older left-aligned heading with a button beside it. The sequence is hero, Company information,
Who we serve, Services, AI product development, Traditional product development, The Septa
Advantage, Our approach, Why Septa, Case studies, Talent solutions, Latest writing, Our partners,
Testimonial, then the closing CTA. Three of the brief's headlines are deliberately not on the site:
Success Metrics (KPIs), Competitor & Inspiration References and Timeline describe the redesign
project, not the business, and publishing them would put Septa's internal brief and its competitor
list on the public page. The two lists the brief does contribute and the site did not have, the four
target audiences and the three primary markets, are in `src/data/content.ts` as `audiences` and
`markets` and are printed in Septa's own wording. Because the sections were re-sequenced, the band
tones (`ink`, `raised`, `surface`) were re-walked so no two neighbours match; that alternation is
the only thing separating one hero from the next on a long page.

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
