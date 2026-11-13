import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { footerColumns } from "../../lib/nav";
import { paths } from "../../lib/paths";
import { site } from "../../lib/site";
import { ctaBanner } from "../../data/content";
import { Button } from "../ui/Button";
import { MaskRise, Unconfigured } from "../ui/primitives";
import { NewsletterForm } from "../forms/NewsletterForm";
import { Wordmark } from "./Logo";
import { SocialMark } from "./SocialMarks";

export function Footer() {
  const { email, phone, addressLines } = site.contact;
  // Three unconfigured details stacked as three dashed boxes is the loudest thing in the footer, and
  // the footer is not where a missing address should shout. The same message, the same icon and the
  // same tooltip, without the box around each one.
  const quiet = "border-0 bg-transparent px-0 py-0";

  return (
    <footer className="relative mt-auto border-t border-line bg-ink-raised">
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

      {/* Septa, the site map, the networks and the newsletter, in two columns that end at nearly the
          same line. This used to be three full-width tiers stacked on top of each other: the brand
          column ran far longer than the four navigations beside it, so a strip of empty page opened
          up on the right, and the networks and the newsletter sat in a tier of their own under a
          hairline that nothing above them needed. Putting the networks under the brand and the
          newsletter under the links fills both holes with the same content, and the footer loses a
          hairline and about two hundred pixels. */}
      <div className="wrap relative grid gap-x-12 gap-y-11 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)]">
        <div className="min-w-0">
          <Wordmark />
          <p className="mt-4 max-w-sm text-[0.88rem] leading-relaxed text-muted">
            {site.description}
          </p>
          <ul className="mt-5 space-y-2 text-[0.86rem]">
            <li className="flex items-center gap-2.5 text-muted">
              <Mail className="size-4 shrink-0 text-faint" aria-hidden />
              {email ? (
                <a href={`mailto:${email}`} className="hover:text-mint">
                  {email}
                </a>
              ) : (
                <Unconfigured what="company email" className={quiet} />
              )}
            </li>
            <li className="flex items-center gap-2.5 text-muted">
              <Phone className="size-4 shrink-0 text-faint" aria-hidden />
              {phone ? (
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:text-mint">
                  {phone}
                </a>
              ) : (
                <Unconfigured what="phone number" className={quiet} />
              )}
            </li>
            <li className="flex items-start gap-2.5 text-muted">
              <MapPin className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
              {addressLines?.length ? (
                <address className="not-italic">
                  {addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              ) : (
                <Unconfigured what="office address" className={quiet} />
              )}
            </li>
          </ul>

          {site.social.length > 0 ? (
            <div className="mt-9">
              <p className="eyebrow mb-3.5 text-faint">Follow Septa</p>
              {/* One cell per network: the mark says which platform without spelling its name out,
                  and the handles under it are the links. Septa has two accounts on three of the four
                  networks, so the handles stack rather than sit in a row — a row would either
                  truncate a handle or put two identical marks next to each other with nothing to
                  tell them apart. Two cells across is as wide as this column ever gets. */}
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {site.social.map((group) => (
                  <li
                    key={group.network}
                    className="group flex items-center gap-2.5 rounded-card border border-line bg-ink/70 px-3 py-2.5 transition-colors hover:border-mint/40 hover:bg-ink"
                  >
                    <span
                      aria-hidden
                      className="grid size-8 shrink-0 place-items-center rounded-pill border border-line bg-surface-raised text-muted transition-colors group-hover:border-mint/45 group-hover:bg-ink group-hover:text-mint"
                    >
                      <SocialMark network={group.network} className="size-4" />
                    </span>
                    <ul className="min-w-0 space-y-0.5">
                      {group.accounts.map((account) => (
                        <li key={account.href}>
                          <a
                            href={account.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label={`${group.name}: ${account.label}`}
                            className="inline-flex min-h-8 items-center text-[0.8rem] text-muted underline-offset-4 transition-colors hover:text-mint hover:underline"
                          >
                            {account.label}
                          </a>
                        </li>
                      ))}
                    </ul>
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

          <div className="mt-10 border-t border-line-soft pt-8">
            <p className="eyebrow mb-2 text-faint">Newsletter</p>
            <p className="mb-3 max-w-md text-[0.84rem] leading-relaxed text-muted">
              Occasional notes on what we built and what it taught us. No cadence is promised yet.
            </p>
            <div className="max-w-md">
              <NewsletterForm />
            </div>
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
