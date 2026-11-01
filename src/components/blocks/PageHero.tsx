import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Eyebrow, MaskRise } from "../ui/primitives";
import { Logo } from "../layout/Logo";
import { paths } from "../../lib/paths";

export type Crumb = { label: string; to?: string };

export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs = [],
  actions,
  aside,
  meta,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: Crumb[];
  actions?: ReactNode;
  aside?: ReactNode;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-line-soft", className)}>
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-40 mask-fade" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-[420px] rounded-full bg-mint/[0.07] blur-[90px]"
      />
      <div className="wrap relative py-14 sm:py-18">
        {crumbs.length ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 font-mono text-[0.72rem] text-faint">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1">
                  {i > 0 ? <ChevronRight className="size-3" aria-hidden /> : null}
                  {c.to ? (
                    <Link to={c.to} className="transition-colors hover:text-mint">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-muted">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className={cn("grid gap-10", aside ? "lg:grid-cols-[1.15fr_1fr] lg:items-center" : "")}>
          <div className={cn(!aside && "max-w-3xl")}>
            {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
            <MaskRise>
              <h1 className="text-[clamp(2.1rem,5.2vw,3.6rem)]">{title}</h1>
            </MaskRise>
            {lead ? <p className="prose-body mt-5 max-w-2xl text-[1.05rem]">{lead}</p> : null}
            {meta ? <div className="mt-5 flex flex-wrap items-center gap-2">{meta}</div> : null}
            {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
          {aside}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({
  title = "Let’s build what’s next, together!",
  lead = "Whether you need an AI-powered product, smarter workflows, or complete product development, Septa is your partner for building the future.",
  primaryLabel = "Start a request",
  secondary,
}: {
  title?: string;
  lead?: string;
  primaryLabel?: string;
  secondary?: { label: string; to: string };
}) {
  return (
    <section className="wrap section">
      <div className="relative overflow-hidden rounded-card border border-line bg-surface px-6 py-10 sm:px-10 sm:py-12">
        <div aria-hidden className="dot-bg pointer-events-none absolute inset-0 opacity-50" />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-mint/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -bottom-10 hidden size-52 text-fg opacity-[0.06] sm:block"
        >
          <Logo className="size-full" />
        </div>
        <div className="relative max-w-2xl">
          <Eyebrow className="mb-4">Start here</Eyebrow>
          <MaskRise>
            <h2 className="text-[clamp(1.6rem,3.4vw,2.4rem)]">{title}</h2>
          </MaskRise>
          <p className="prose-body mt-4">{lead}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button to={paths.request()} size="lg">
              {primaryLabel}
            </Button>
            {secondary ? (
              <Button to={secondary.to} size="lg" variant="secondary">
                {secondary.label}
              </Button>
            ) : (
              <Button to={paths.contact()} size="lg" variant="secondary">
                Contact us
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
