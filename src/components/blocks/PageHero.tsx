import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";
import { Eyebrow } from "../ui/primitives";
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
  art,
  density = "default",
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
  /** A painted plate of the page's own, in place of the shared grid, glow and photo foot. */
  art?: ReactNode;
  /** Tighter vertical rhythm for the services overview header. */
  density?: "default" | "compact";
}) {
  return (
    // `band` puts the same solid plate under this header as the sections below it carry, so the
    // interior pages read as one surface and the footer's sheet can arrive over the last of them.
    // Nothing here moves any more: the contour plate drifts only inside the homepage hero field.
    <section
      data-wall={wall}
      data-static-hero=""
      className={cn("relative overflow-hidden band", className)}
    >
      {art ?? (
        <>
          <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-40 mask-fade" />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 size-[420px] rounded-full bg-mint/[0.07] blur-[90px]"
          />
          {/* The engineering floor runs along the foot of every interior page header, fading into the
              body so the band reads as depth rather than a pasted-in picture. */}
          <div
            aria-hidden
            className="plate-fade pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden sm:h-48"
          >
            {/* The photograph is a night-lit data hall, so it is dark where the daylight office shot it
                replaces was bright. The same 82% white veil over it lands on a mid grey rather than the
                near-white the breadcrumb and the action row are measured against, so the picture is held
                at 34% and the veil stays: the strip reads as a room, not as a smudge. */}
            <img
              src="/img/work/engineering-floor.webp"
              alt=""
              decoding="async"
              className="absolute inset-[-10%] size-[120%] object-cover object-bottom opacity-[0.34]"
            />
            <div className="absolute inset-0 bg-ink/82" />
          </div>
        </>
      )}
      <div className={cn("wrap relative", density === "compact" ? "py-10 sm:py-12" : "py-14 sm:py-18")}>
        {crumbs.length ? (
          <nav aria-label="Breadcrumb" className={cn("mb-6", density === "compact" && "mb-4")}>
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

        <div className={cn("grid gap-10", density === "compact" && "gap-7", aside ? "lg:grid-cols-[1.15fr_1fr] lg:items-center" : "")}>
          <div className={cn(!aside && "max-w-3xl")}>
            {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
            <div>
              <h1 className="text-[clamp(2.1rem,5.2vw,3.6rem)]">{title}</h1>
            </div>
            {lead ? <p className={cn("prose-body mt-5 max-w-2xl text-[1.05rem]", density === "compact" && "mt-4")}>{lead}</p> : null}
            {meta ? <div className="mt-5 flex flex-wrap items-center gap-2">{meta}</div> : null}
            {actions ? <div className={cn("mt-7 flex flex-wrap gap-3", density === "compact" && "mt-5")}>{actions}</div> : null}
          </div>
          {aside}
        </div>
      </div>
    </section>
  );
}
