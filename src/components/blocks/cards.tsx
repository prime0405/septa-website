import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";
import type { UseCase } from "../../data/useCases";
import type { Post } from "../../data/posts";
import type { ServiceContent } from "../../data/services";
import { cn, formatDate, readingTime } from "../../lib/cn";
import { plateFor } from "../../lib/plates";
import { usePointerTrack } from "../../lib/pointerGlow";
import { paths } from "../../lib/paths";
import { Button } from "../ui/Button";
import { PointerGlow } from "../ui/PointerGlow";
import { Pill } from "../ui/primitives";
import { ServiceIcon } from "./ServiceIcon";

const postContent = (p: Post) => p.body.map((b) => ("text" in b ? b.text : "")).join(" ");

export function ServiceCard({
  service,
  href,
  index,
  compact,
  ctaLabel = "Explore",
}: {
  service: Pick<ServiceContent, "name" | "navBlurb" | "icon" | "coreServices">;
  href: string;
  index?: number;
  compact?: boolean;
  ctaLabel?: string;
}) {
  const track = usePointerTrack<HTMLAnchorElement>("tilt", 7);
  return (
    <Link
      to={href}
      onPointerMove={track.onPointerMove}
      onPointerLeave={track.onPointerLeave}
      className={cn(
        "card card-hover tilt group relative isolate flex flex-col overflow-hidden p-6",
        compact && "p-5",
      )}
    >
      <PointerGlow />
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-xl border border-mint/25 bg-mint/[0.07] text-mint transition-colors group-hover:border-mint/50">
          <ServiceIcon icon={service.icon} className="size-5.5" />
        </span>
        {index !== undefined ? (
          <span className="font-mono text-[0.72rem] text-faint">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
      </div>
      <h3 className="mt-5 text-[1.15rem]">{service.name}</h3>
      <p className="mt-2 flex-1 text-[0.9rem] leading-relaxed text-muted">{service.navBlurb}</p>
      {!compact ? (
        <p className="mt-4 font-mono text-[0.72rem] text-faint">
          {service.coreServices.length} core services
        </p>
      ) : null}
      <span className="mt-5 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-mint">
        {ctaLabel}
        <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}

export function CaseCard({ study, featured }: { study: UseCase; featured?: boolean }) {
  const track = usePointerTrack<HTMLAnchorElement>("tilt", 7);
  return (
    <Link
      to={paths.case(study.slug)}
      onPointerMove={track.onPointerMove}
      onPointerLeave={track.onPointerLeave}
      className={cn(
        "card card-hover tilt group relative isolate flex flex-col overflow-hidden",
        featured ? "lg:col-span-2 lg:flex-row lg:items-stretch" : "",
      )}
    >
      <PointerGlow radius={320} />
      {/* Art only: the plate has real ink in it, so nothing this small is allowed to sit on top. */}
      <div
        aria-hidden
        className={cn(
          "relative shrink-0 overflow-hidden border-line bg-ink-raised",
          featured ? "border-b lg:border-r lg:border-b-0 lg:w-[38%]" : "min-h-24",
        )}
      >
        <img
          src={plateFor(study.slug)}
          alt=""
          loading="lazy"
          decoding="async"
          className="plate-drift absolute inset-[-8%] size-[116%] object-cover"
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="dot-bg absolute inset-0 opacity-25" />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Pill tone="mint">{study.kind}</Pill>
          <span className="font-mono text-[0.7rem] text-faint">{study.client}</span>
        </div>
        <h3 className={cn("group-hover:text-mint transition-colors", featured ? "text-[1.4rem]" : "text-[1.12rem]")}>
          {study.title}
        </h3>
        <dl className="mt-4 space-y-3 text-[0.86rem]">
          <div>
            <dt className="font-mono text-[0.68rem] tracking-wider text-faint uppercase">Overview</dt>
            <dd className="mt-1 text-muted">{featured ? shorten(study.overview) : shorten(study.overview, 130)}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.68rem] tracking-wider text-faint uppercase">The Challenge</dt>
            <dd className="mt-1 text-muted">{shorten(study.challenge, 130)}</dd>
          </div>
        </dl>
        <div className="mt-auto flex items-center gap-1.5 pt-5 text-[0.85rem] font-medium text-mint">
          View Case Study
          <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
}

export function PostCard({ post, variant = "default" }: { post: Post; variant?: "default" | "featured" | "compact" }) {
  const track = usePointerTrack<HTMLAnchorElement>("tilt", 7);
  const inner = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="mint">{post.category}</Pill>
        <span className="inline-flex items-center gap-1 font-mono text-[0.72rem] text-faint">
          <Clock className="size-3" aria-hidden />
          {readingTime(postContent(post))} min read
        </span>
      </div>
      <h3
        className={cn(
          "group-hover:text-mint mt-3 transition-colors",
          variant === "featured" ? "text-[1.5rem]" : variant === "compact" ? "text-[1rem]" : "text-[1.12rem]",
        )}
      >
        {post.title}
      </h3>
      {variant !== "compact" ? (
        <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted">{post.excerpt}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {post.tags.slice(0, 3).map((t) => (
          <span key={t} className="rounded-pill border border-line px-2.5 py-0.5 text-[0.72rem] text-faint">
            #{t}
          </span>
        ))}
      </div>
      <p className="mt-4 flex items-center justify-between gap-3 text-[0.78rem] text-faint">
        <span>{post.author}</span>
        <span>{formatDate(post.date)}</span>
      </p>
    </>
  );

  if (variant === "featured") {
    return (
      <Link
        to={paths.post(post.slug)}
        onPointerMove={track.onPointerMove}
        onPointerLeave={track.onPointerLeave}
        className="card card-hover tilt group relative isolate grid gap-6 overflow-hidden p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]"
      >
        <PointerGlow radius={340} />
        <div className="flex flex-col">{inner}</div>
        <div aria-hidden className="relative min-h-40 overflow-hidden rounded-card border border-line bg-ink-raised">
          <img
            src={plateFor(post.slug)}
            alt=""
            loading="lazy"
            decoding="async"
            className="plate-drift-slow absolute inset-[-8%] size-[116%] object-cover"
          />
          <div className="absolute inset-0 bg-ink/60" />
          <div className="grid-bg absolute inset-0 opacity-70" />
          <div className="glow-mint absolute inset-0 opacity-60" />
          {/* The caption sits on a solid bar, not on the wash: the plates carry real ink, and a
              0.62rem label cannot afford to guess which part of the image it landed on. */}
          <div className="absolute inset-x-4 bottom-4 space-y-1.5 rounded-card bg-ink px-3 py-2.5">
            {["reading time", "sample editorial content", "placeholder author"].map((l, i) => (
              <div key={l} className="flex items-center gap-2">
                <span className={cn("h-1.5 rounded-full bg-mint/30", i === 0 ? "w-24" : i === 1 ? "w-36" : "w-16")} />
                <span className="font-mono text-[0.62rem] text-faint">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={paths.post(post.slug)}
      onPointerMove={track.onPointerMove}
      onPointerLeave={track.onPointerLeave}
      className={cn(
        "card card-hover tilt group relative isolate flex flex-col overflow-hidden p-5",
        variant === "compact" && "p-4",
      )}
    >
      <PointerGlow />
      {inner}
    </Link>
  );
}

export function CapabilityRow({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <li key={i} className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[0.74rem] text-muted">
          {i}
        </li>
      ))}
    </ul>
  );
}

export function RequestInline({ label = "Describe a project like this" }: { label?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-card border border-mint/25 bg-mint/[0.05] px-4 py-3.5">
      <p className="flex-1 text-[0.88rem] text-muted">
        This flow is a good fit for something you are trying to do? Send it through the request form.
      </p>
      <Button to={paths.request()} size="sm" variant="outline-mint">
        {label}
      </Button>
    </div>
  );
}

function shorten(s: string, max = 180) {
  if (s.length <= max) return s;
  return s.slice(0, max).replace(/\s+\S*$/, "") + "…";
}
