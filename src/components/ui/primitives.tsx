import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion, motion } from "motion/react";
import { useIntroHeld } from "../../lib/intro";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CircleSlash,
  Info,
  Sparkles,
  Wrench,
} from "lucide-react";
import { showLaunchNotes } from "../../lib/launchNotes";
import { cn } from "../../lib/cn";

/* ------------------------------- layout ------------------------------- */

export function Section({
  children,
  className,
  id,
  tone = "ink",
  bleed = false,
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "ink" | "raised" | "surface" | "none";
  bleed?: boolean;
  as?: "section" | "div";
}) {
  const tones = {
    ink: "bg-ink",
    raised: "bg-ink-raised",
    surface: "bg-surface",
    none: "",
  } as const;
  return (
    <Tag id={id} className={cn("relative scroll-mt-24", tones[tone], className)}>
      {bleed ? children : <div className="wrap">{children}</div>}
    </Tag>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("eyebrow", className)}>{children}</span>;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  action,
  className,
  as: H = "h2",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        <H
          className={cn(
            "text-[clamp(1.75rem,3.6vw,2.7rem)]",
            H === "h1" && "text-[clamp(2.1rem,5.4vw,3.9rem)]",
          )}
        >
          {title}
        </H>
        {lead ? <p className="prose-body mt-4 text-[1.02rem]">{lead}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto h-px w-full max-w-[1220px] bg-gradient-to-r from-transparent via-line to-transparent",
        className,
      )}
    />
  );
}

/* ------------------------------ surfaces ------------------------------ */

export function Card({
  children,
  className,
  interactive,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag className={cn("card", interactive && "card-hover", className)}>{children}</Tag>
  );
}

export function CardLink({
  to,
  children,
  className,
  "aria-label": aria,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <Link to={to} className={cn("card card-hover block", className)} aria-label={aria}>
      {children}
    </Link>
  );
}

export function Pill({
  children,
  tone = "line",
  className,
}: {
  children: ReactNode;
  tone?: "line" | "mint" | "muted" | "amber";
  className?: string;
}) {
  const tones = {
    line: "border-line bg-surface text-muted",
    mint: "border-mint/40 bg-mint/10 text-mint",
    muted: "border-line-soft bg-transparent text-faint",
    amber: "border-amber/40 bg-amber/10 text-amber",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-[0.72rem] font-medium tracking-wide whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Marks content that is illustrative sample material, not a Septa fact. */
export function SampleTag({ label = "Illustrative sample", className }: { label?: string; className?: string }) {
  return (
    <Pill tone="amber" className={cn("font-mono uppercase", className)}>
      <Sparkles className="size-3" aria-hidden />
      {label}
    </Pill>
  );
}

/** Company facts that still need to be supplied. Never renders invented data. */
export function Unconfigured({
  what,
  where = "src/lib/site.ts",
  className,
}: {
  what: string;
  where?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line bg-ink-raised px-2.5 py-1 text-[0.8rem] text-faint",
        className,
      )}
      title={showLaunchNotes ? `Add the real ${what} in ${where}` : `The real ${what} is not supplied yet`}
    >
      <CircleSlash className="size-3.5" aria-hidden />
      <span>
        No {what} yet.
        {showLaunchNotes ? (
          <>
            {" "}
            Set it in <code className="font-mono text-[0.72rem]">{where}</code>
          </>
        ) : null}
      </span>
    </span>
  );
}

/* ------------------------------- callouts ------------------------------ */

export function Callout({
  kind = "info",
  title,
  children,
  className,
}: {
  kind?: "info" | "warn" | "success" | "danger" | "setup";
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const map = {
    info: { icon: Info, cls: "border-line bg-surface text-muted", ic: "text-mint" },
    warn: { icon: AlertTriangle, cls: "border-amber/35 bg-amber/[0.07] text-fg", ic: "text-amber" },
    success: { icon: Check, cls: "border-mint/40 bg-mint/[0.08] text-fg", ic: "text-mint" },
    danger: { icon: AlertTriangle, cls: "border-rose/45 bg-rose/[0.08] text-fg", ic: "text-rose" },
    setup: { icon: Wrench, cls: "border-line bg-ink-raised text-muted", ic: "text-mint" },
  } as const;
  const { icon: Icon, cls, ic } = map[kind];
  return (
    <div
      className={cn("flex gap-3 rounded-card border p-4 text-[0.92rem]", cls, className)}
      role={kind === "danger" ? "alert" : "note"}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", ic)} aria-hidden />
      <div className="min-w-0 space-y-1">
        {title ? <p className="font-medium text-fg">{title}</p> : null}
        <div className="[&_a]:text-mint [&_a:hover]:underline">{children}</div>
      </div>
    </div>
  );
}

/* -------------------------------- reveal ------------------------------- */

export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const held = useIntroHeld();
  const MotionTag = motion[as as "div"];
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      {...(held
        ? {}
        : {
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-60px 0px -60px 0px" },
          })}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/* ------------------------------ list + misc ---------------------------- */

export function MarkerList({
  items,
  columns,
  className,
}: {
  items: (string | { label: string; detail?: string })[];
  columns?: 1 | 2;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid gap-x-8 gap-y-3",
        columns === 2 ? "sm:grid-cols-2" : "grid-cols-1",
        className,
      )}
    >
      {items.map((item, i) => {
        const label = typeof item === "string" ? item : item.label;
        const detail = typeof item === "string" ? null : item.detail;
        return (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-mint/35 bg-mint/10">
              <Check className="size-3 text-mint" aria-hidden />
            </span>
            <span className="text-[0.95rem] text-muted">
              <span className="text-fg">{label}</span>
              {detail ? <span className="block text-[0.88rem]">{detail}</span> : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function ArrowLink({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-mint",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  );
}

export function EmptyState({
  title,
  children,
  icon,
  action,
  heading = "h3",
}: {
  title: string;
  children?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  /** Empty states used as a whole page need a real `h1`; inline ones sit under an existing heading. */
  heading?: "h1" | "h2" | "h3";
}) {
  return (
    <div className="card flex flex-col items-center gap-3 border-dashed px-6 py-12 text-center">
      {icon ? (
        <span className="flex size-11 items-center justify-center rounded-full border border-line bg-surface text-muted">
          {icon}
        </span>
      ) : null}
      {heading === "h1" ? (
        <h1 className="font-display text-2xl">{title}</h1>
      ) : heading === "h2" ? (
        <h2 className="text-lg">{title}</h2>
      ) : (
        <h3 className="text-lg">{title}</h3>
      )}
      {children ? <p className="max-w-md text-[0.92rem] text-muted">{children}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-card", className)} aria-hidden />;
}

export function LoadingBlock({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-10 text-muted" role="status" aria-live="polite">
      <span className="size-4 animate-spin rounded-full border-2 border-line border-t-mint" />
      <span className="text-[0.9rem]">{label}…</span>
    </div>
  );
}
