import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { footerColumns } from "../../lib/nav";
import { paths } from "../../lib/paths";
import { site } from "../../lib/site";
import { Button } from "../ui/Button";
import { Unconfigured } from "../ui/primitives";
import { NewsletterForm } from "../forms/NewsletterForm";
import { Wordmark } from "./Logo";

export function Footer() {
  const { email, phone, addressLines } = site.contact;

  return (
    <footer className="relative mt-auto border-t border-line bg-ink-raised">
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-[0.25] mask-fade" />

      {/* final conversion band */}
      <div className="relative wrap">
        <div className="my-10 flex flex-col gap-5 overflow-hidden rounded-card border border-mint/25 bg-gradient-to-br from-surface via-surface-raised to-ink-raised p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow mb-3">Next step</p>
            <h2 className="text-[clamp(1.35rem,2.6vw,1.9rem)]">
              Tell us what you want to build, automate or fix.
            </h2>
            <p className="mt-2.5 text-[0.92rem] text-muted">
              One short request form. We come back with an approach, a shape of work and an honest
              view of whether we are the right team.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button to={paths.request()} size="lg" magnetic iconEnd={<ArrowRight className="size-4" />}>
              Request a Service
            </Button>
            <Button to={paths.contact()} size="lg" variant="secondary" magnetic>
              Ask a question first
            </Button>
          </div>
        </div>
      </div>

      <div className="wrap relative grid gap-10 pb-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-[0.88rem] leading-relaxed text-muted">
            {site.description}
          </p>
          <ul className="mt-5 space-y-2.5 text-[0.86rem]">
            <li className="flex items-center gap-2.5 text-muted">
              <Mail className="size-4 shrink-0 text-faint" aria-hidden />
              {email ? (
                <a href={`mailto:${email}`} className="hover:text-mint">
                  {email}
                </a>
              ) : (
                <Unconfigured what="company email" />
              )}
            </li>
            <li className="flex items-center gap-2.5 text-muted">
              <Phone className="size-4 shrink-0 text-faint" aria-hidden />
              {phone ? (
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:text-mint">
                  {phone}
                </a>
              ) : (
                <Unconfigured what="phone number" />
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
                <Unconfigured what="office address" />
              )}
            </li>
          </ul>

          {site.social.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {site.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-pill border border-line px-3 py-1.5 text-[0.78rem] text-muted transition-colors hover:border-mint/45 hover:text-mint"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 border-t border-line-soft pt-6">
            <p className="mb-1.5 font-mono text-[0.66rem] tracking-[0.18em] text-faint uppercase">
              Newsletter
            </p>
            <p className="mb-3 text-[0.84rem] leading-relaxed text-muted">
              Occasional notes on what we built and what it taught us. No cadence is promised yet.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {footerColumns.map((col) => (
          <nav key={col.heading} aria-label={`${col.heading} links`}>
            <p className="mb-3.5 font-mono text-[0.66rem] tracking-[0.18em] text-faint uppercase">
              {col.heading}
            </p>
            <ul className="space-y-2">
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
