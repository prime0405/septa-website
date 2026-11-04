import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Eyebrow, MaskRise } from "../ui/primitives";
import { Logo } from "../layout/Logo";
import { paths } from "../../lib/paths";
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
  video,
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
  /** Septa-supplied film that runs behind this header instead of the contour plate. */
  video?: string;
  /** The wallpaper the header runs behind, for the pages that run several in sequence. */
  wall?: BgTheme;
}) {
  const onFilm = Boolean(video);
  return (
    // `band` puts the same masked 82% veil under this header as the sections below it carry, because
    // the breadcrumb and the action row are the smallest type on the page and they otherwise sit
    // directly on the moving wash. Its own decorative layers are positioned children, so they still
    // paint on top of the veil. With a film the same job is done by `.film-veil`, and the surface
    // under it is Black Pearl so that a header whose video never decodes is a plain dark header.
    <section
      data-wall={wall}
      className={cn(
        "relative overflow-hidden",
        onFilm
          ? "on-dark border-b border-brand-teal/25 bg-brand-pearl"
          : "band border-b border-line-soft",
        className,
      )}
    >
      {onFilm ? (
        <FilmBackdrop src={video ?? ""} />
      ) : (
        <>
          <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-40 mask-fade" />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 size-[420px] rounded-full bg-mint/[0.07] blur-[90px]"
          />
          {/* The contour plate runs along the foot of every interior page header, fading into the body
              so the band reads as depth rather than a pasted-in picture. */}
          <div
            aria-hidden
            className="plate-fade pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden sm:h-48"
          >
            {/* plate-hero carries a few genuinely dark strokes, so the band under the breadcrumb and
                the action row is a tint rather than an image: 55% plate behind an 82% white veil. */}
            <img
              src="/img/plate-hero.jpg"
              alt=""
              decoding="async"
              className="plate-drift absolute inset-[-10%] size-[120%] object-cover object-bottom opacity-[0.55]"
            />
            <div className="absolute inset-0 bg-ink/82" />
          </div>
        </>
      )}
      <div className="wrap relative py-14 sm:py-18">
        {crumbs.length ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol
              className={cn(
                "flex flex-wrap items-center gap-1 font-mono text-[0.72rem]",
                onFilm ? "text-brand-white/72" : "text-faint",
              )}
            >
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1">
                  {i > 0 ? <ChevronRight className="size-3" aria-hidden /> : null}
                  {c.to ? (
                    <Link
                      to={c.to}
                      className={cn("transition-colors", onFilm ? "hover:text-brand-white" : "hover:text-mint")}
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span className={onFilm ? "text-brand-white/88" : "text-muted"}>{c.label}</span>
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
              <h1 className={cn("text-[clamp(2.1rem,5.2vw,3.6rem)]", onFilm && "text-brand-white")}>
                {title}
              </h1>
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

/**
 * The film behind a header, and the scrim that makes copy legible over it.
 *
 * Playback is driven by an observer rather than the `autoplay` attribute so a header that has been
 * scrolled past stops decoding, and it never starts under `prefers-reduced-motion` — the first
 * frame stays on screen instead, which is the same picture the video opens on.
 */
function FilmBackdrop({ src }: { src: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) el.play().catch(() => undefined);
      else el.pause();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="film-veil absolute inset-0" />
    </div>
  );
}

export function CtaBand({
  wall,
  title = "Let’s build what’s next, together!",
  lead = "Whether you need an AI-powered product, smarter workflows, or complete product development, Septa is your partner for building the future.",
  primaryLabel = "Start a request",
  secondary,
}: {
  /** The wallpaper the band runs behind. */
  wall?: BgTheme;
  title?: string;
  lead?: string;
  primaryLabel?: string;
  secondary?: { label: string; to: string };
}) {
  return (
    <section data-wall={wall} className="wrap section">
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
