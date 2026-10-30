import { Link } from "react-router-dom";
import { ArrowUpRight, Clock } from "lucide-react";
import type { CaseStudy } from "../../data/cases";
import type { Post } from "../../data/posts";
import type { ServiceContent } from "../../data/services";
import { cn, formatDate, readingTime } from "../../lib/cn";
import { paths } from "../../lib/paths";
import { Button } from "../ui/Button";
import { Pill, SampleTag } from "../ui/primitives";
import { ServiceIcon } from "./ServiceIcon";

const postContent = (p: Post) => p.body.map((b) => ("text" in b ? b.text : "")).join(" ");

export function ServiceCard({
  service,
  href,
  index,
  compact,
}: {
  service: Pick<ServiceContent, "name" | "navBlurb" | "icon" | "capabilities">;
  href: string;
  index?: number;
  compact?: boolean;
}) {
  return (
    <Link
      to={href}
      className={cn(
        "card card-hover group relative flex flex-col overflow-hidden p-6",
        compact && "p-5",
      )}
    >
      <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-mint/[0.07] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
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
          {service.capabilities.length} capability groups · {service.capabilities.reduce((n, g) => n + g.items.length, 0)} areas
        </p>
      ) : null}
      <span className="mt-5 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-mint">
        Explore service
        <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}

export function CaseCard({ study, featured }: { study: CaseStudy; featured?: boolean }) {
  return (
    <Link
      to={paths.case(study.slug)}
      className={cn(
        "card card-hover group flex flex-col overflow-hidden",
        featured ? "lg:col-span-2 lg:flex-row lg:items-stretch" : "",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "relative shrink-0 border-line bg-ink-raised",
          featured ? "border-b lg:border-r lg:border-b-0 lg:w-[38%]" : "",
        )}
      >
        <div className={cn("grid-bg absolute inset-0 opacity-60")} />
        <div className="dot-bg absolute inset-0 opacity-40" />
        <div className="relative flex h-full min-h-28 flex-col justify-between p-5">
          <Pill tone="mint" className="self-start">
            {study.category}
          </Pill>
          <p className="font-mono text-[0.7rem] text-faint">{study.clientDescriptor}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className={cn("group-hover:text-mint transition-colors", featured ? "text-[1.4rem]" : "text-[1.12rem]")}>
          {study.title}
        </h3>
        {featured ? (
          <p className="prose-body mt-3 text-[0.92rem]">{study.summary}</p>
        ) : null}
        <dl className="mt-4 space-y-3 text-[0.86rem]">
          <div>
            <dt className="font-mono text-[0.68rem] tracking-wider text-faint uppercase">Problem</dt>
            <dd className="mt-1 text-muted">{featured ? shorten(study.problem) : shorten(study.problem, 130)}</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.68rem] tracking-wider text-faint uppercase">Approach</dt>
            <dd className="mt-1 text-muted">{shorten(study.solutionOverview, featured ? 200 : 130)}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {study.stack.slice(0, featured ? 7 : 4).map((t) => (
            <span key={t} className="rounded-md border border-line bg-surface px-2 py-1 font-mono text-[0.7rem] text-muted">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-mint">
            Read the study
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          <SampleTag label="Sample scenario" />
        </div>
      </div>
    </Link>
  );
}

export function PostCard({ post, variant = "default" }: { post: Post; variant?: "default" | "featured" | "compact" }) {
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
        className="card card-hover group relative grid gap-6 overflow-hidden p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]"
      >
        <div className="flex flex-col">{inner}</div>
        <div aria-hidden className="relative min-h-40 overflow-hidden rounded-card border border-line bg-ink-raised">
          <div className="grid-bg absolute inset-0 opacity-70" />
          <div className="glow-mint absolute inset-0 opacity-60" />
          <div className="absolute inset-x-5 bottom-5 space-y-2">
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
    <Link to={paths.post(post.slug)} className={cn("card card-hover group flex flex-col p-5", variant === "compact" && "p-4")}>
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
