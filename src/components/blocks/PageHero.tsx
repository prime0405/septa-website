import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";
import { Eyebrow, MaskRise } from "../ui/primitives";
import type { BgTheme } from "../../lib/bgThemes";

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
  wall,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: Crumb[];
  actions?: ReactNode;
  aside?: ReactNode;
  meta?: ReactNode;
  className?: string;
  /** The wallpaper the header runs behind, for the pages that run several in sequence. */
  wall?: BgTheme;
}) {
  return (
    // `band` puts the same 76% veil under this header as the sections below it carry. Its own
    // decorative layers are positioned children, so they still paint on top of the veil. Nothing
    // here moves any more: the contour plate drifts only inside the homepage hero field.
    <section
      data-wall={wall}
      className={cn("relative overflow-hidden band border-b border-line-soft", className)}
    >
      <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-40 mask-fade" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-[420px] rounded-full bg-mint/[0.07] blur-[90px]"
      />
      {/* The office photograph runs along the foot of every interior page header, fading into the
          body so the band reads as depth rather than a pasted-in picture. */}
      <div
        aria-hidden
        className="plate-fade pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden sm:h-48"
      >
        {/* The photo is a daylight image with genuinely bright windows in it, so the strip under
            the breadcrumb and the action row is a tint rather than a picture: 55% photo behind its
            own 82% white overlay, which sits on top of the band veil and is the stricter of the two. */}
        <img
          src="/img/work/office-wide.webp"
          alt=""
          decoding="async"
          className="absolute inset-[-10%] size-[120%] object-cover object-bottom opacity-[0.55]"
        />
        <div className="absolute inset-0 bg-ink/82" />
      </div>
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
