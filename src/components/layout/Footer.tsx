import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { footerColumns } from "../../lib/nav";
import { paths } from "../../lib/paths";
import { site } from "../../lib/site";
import { showLaunchNotes } from "../../lib/launchNotes";
import { SectionStage } from "../blocks/SectionStage";
import { Wordmark } from "./Logo";
import { SocialMark } from "./SocialMarks";

export function Footer() {
  return (
    <footer className="relative mt-auto bg-ink-raised">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-[0.25] mask-fade" />

      {/* Wayfinding only. The closing ask lives in `ClosingCta`, the band directly above this one, and
          the company pitch lives in the hero and the about page — repeating either here made the
          footer the tallest band at the bottom of the page. What remains is the mark, the reach row,
          the site map and the legal line, so the footer reads as a directory and ends quickly. The
          band still gets the arrival half of the settle gesture (`last`), while the plate and the grid
          stay put underneath. No top rule: the step from the closing band's surface plate to this
          raised plate is the separator, because a drawn line on a moving edge reads as a seam
          dragging up the screen. */}
      <SectionStage last>
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

            {/* One row of marks: the envelope is the email, and each network glyph is that platform's
                profile. The links are inside the logos, so nothing on this row is a handle typed out in
                full — which is what let the three of them sit on one line instead of a two-column list
                of strings. A mark only becomes an anchor when there is somewhere for it to go: the
                email is still unconfigured in src/lib/site.ts, so its glyph stays a labelled, inert
                chip with the same tooltip the old box carried, rather than a button that looks pressed
                and does nothing. */}
            {site.social.length > 0 || site.contact.email ? (
              <div className="mt-6">
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

        {/* The bottom padding is the back-to-top button's own box. Below xl the wrap runs to the
            viewport edge, so the last line of the legal row would otherwise come to rest underneath
            the floating button; above it the wrap is centred and narrow enough to clear it. */}
        <div className="wrap flex flex-col gap-3 pt-5 pb-20 text-[0.78rem] text-faint sm:flex-row sm:items-center sm:justify-between xl:pb-5">
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
          </p>
        </div>
      </SectionStage>
    </footer>
  );
}