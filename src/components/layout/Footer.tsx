import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { footerColumns } from "../../lib/nav";
import { paths } from "../../lib/paths";
import { site } from "../../lib/site";
import { showLaunchNotes } from "../../lib/launchNotes";
import { ctaBanner } from "../../data/content";
import { Button } from "../ui/Button";
import { MaskRise } from "../ui/primitives";
import { Wordmark } from "./Logo";
import { SocialMark } from "./SocialMarks";

export function Footer() {
  return (
    <footer className="stack-sheet relative z-20 mt-auto border-t border-line bg-ink-raised">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-[0.25] mask-fade" />

      {/* The one closing ask. This used to live twice — as a band on the homepage and again as the
          "Next step" strip here, both of them saying "tell us what to build" — and Septa asked for
          one. It is the homepage's banner, moved: the footer is where every page ends, so a reader
          who has decided to get in touch has already scrolled here once and will not have to be
          handed a second, differently-worded invitation on the next page. */}
      <div className="wrap relative pt-12 sm:pt-14">
        <div className="relative overflow-hidden rounded-card border border-mint/25 bg-gradient-to-br from-surface via-surface-raised to-ink-raised px-6 py-7 sm:px-9 sm:py-9">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-mint/12 blur-3xl"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="min-w-0 max-w-2xl">
              <p className="eyebrow mb-3 text-faint">Next step</p>
              <h2 className="text-[clamp(1.45rem,3vw,2.35rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-fg">
                <MaskRise>{ctaBanner.headline}</MaskRise>
              </h2>
              <p className="mt-3 max-w-xl text-[0.92rem] leading-relaxed text-muted">
                {ctaBanner.subheadline}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Button
                to={paths.request()}
                size="lg"
                magnetic
                iconEnd={<ArrowRight className="size-4" />}
              >
                {ctaBanner.cta}
              </Button>
              <Button to={paths.contact()} size="lg" variant="secondary" magnetic>
                Ask a question first
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Septa and the site map, in two columns that end at nearly the same line. The tier used to
          carry three things under the wordmark — an email, a phone and an address, each in its own
          dashed "not configured" box, then the four networks with their handle strings spelled out,
          then a newsletter under the links. Septa asked for all of that except the contact itself to
          go: a phone number and an office address are not what a reader of a services site is
          looking for in a footer, and the newsletter is a promise the company has not made yet. The
          address is not replaced by a line of text either; the mark is the link, so the row is three
          glyphs and an envelope rather than a directory. What is left ends at the same height as the
          four navigations beside it, which is the reason this tier no longer needs a hairline of its
          own. */}
      <div className="wrap relative grid gap-x-12 gap-y-11 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)]">
        <div className="min-w-0">
          <Wordmark />
          <p className="mt-4 max-w-sm text-[0.88rem] leading-relaxed text-muted">
            {site.description}
          </p>

          {/* One row of marks: the envelope is the email, and each network glyph is that platform's
              profile. The links are inside the logos, so nothing on this row is a handle typed out in
              full — which is what let the three of them sit on one line instead of a two-column list
              of strings. A mark only becomes an anchor when there is somewhere for it to go: the
              email is still unconfigured in src/lib/site.ts, so its glyph stays a labelled, inert
              chip with the same tooltip the old box carried, rather than a button that looks pressed
              and does nothing. */}
          {site.social.length > 0 || site.contact.email ? (
            <div className="mt-8">
              {/* "Reach", not "Follow": the envelope in this row is a contact route, not a network,
                  and a label that named only the three glyphs would leave it unexplained. */}
              <p className="eyebrow mb-3.5 text-faint">Reach Septa</p>
              <ul className="flex flex-wrap items-center gap-2.5">
                <li>
                  {site.contact.email ? (
                    <a
                      href={`mailto:${site.contact.email}`}
                      aria-label={`Email Septa at ${site.contact.email}`}
                      className="mark-chip"
                    >
                      <Mail className="size-[1.05rem]" aria-hidden />
                    </a>
                  ) : (
                    <span
                      aria-label="The company email address is not configured yet"
                      title={
                        showLaunchNotes
                          ? "Add the real company email in src/lib/site.ts"
                          : "The real company email is not supplied yet"
                      }
                      className="mark-chip mark-chip-inert"
                      role="img"
                    >
                      <Mail className="size-[1.05rem]" aria-hidden />
                    </span>
                  )}
                </li>
                {site.social.map((account) => (
                  <li key={account.network}>
                    <a
                      href={account.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Septa on ${account.name}`}
                      className="mark-chip"
                    >
                      <SocialMark network={account.network} className="size-[1.05rem]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {footerColumns.map((col) => (
              <nav key={col.heading} aria-label={`${col.heading} links`}>
                <p className="mb-3.5 font-mono text-[0.66rem] tracking-[0.18em] text-faint uppercase">
                  {col.heading}
                </p>
                <ul className="space-y-1.5">
                  {col.items.map((i) => (
                    <li key={i.href}>
                      <Link
                        to={i.href}
                        className="inline-flex min-h-7 items-center text-[0.87rem] text-muted transition-colors hover:text-mint"
                      >
                        {i.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      <div className="hairline" />

      <div className="wrap flex flex-col gap-3 py-5 text-[0.78rem] text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {site.year} {site.name}. All rights reserved.
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link to={paths.privacy()} className="inline-flex min-h-7 items-center hover:text-fg">
            Privacy Policy
          </Link>
          <Link to={paths.terms()} className="inline-flex min-h-7 items-center hover:text-fg">
            Terms of Service
          </Link>
          <span className="font-mono">AI · Software · Automation · Observability · Talent</span>
        </p>
      </div>
    </footer>
  );
}
