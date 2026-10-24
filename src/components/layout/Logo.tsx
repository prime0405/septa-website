import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";

/**
 * Septa mark — two rotationally symmetric petals that read as an "S".
 * Vector rendition of the supplied brand artwork (public/septa-mark.jpg),
 * drawn on a transparent tile so it works on the dark surfaces.
 */
const brand = {
  teal: "#6fafa3",
  ink: "#0e1a21",
  sage: "#c6d6ce",
} as const;

/** Apex at top-right, rounded lobe at bottom-left. Rotated 180° for the second petal. */
const PETAL =
  "M79 9C62 14 34 22 22 34c-10 10-6 26 8 26 16 0 36-24 49-51Z";

export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  /** Which surface the mark sits on: "dark" flips the ink petal to sage. */
  tone?: "dark" | "light";
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("size-[26px] shrink-0", className)}
      role="img"
      aria-label="Septa mark"
    >
      <path d={PETAL} fill={brand.teal} />
      <path
        d={PETAL}
        transform="rotate(180 50 50)"
        fill={tone === "dark" ? brand.sage : brand.ink}
      />
    </svg>
  );
}

export function Wordmark({
  className,
  as = "span",
  tone = "dark",
}: {
  className?: string;
  as?: "span" | "div";
  tone?: "dark" | "light";
}) {
  const Tag = as;
  return (
    <Tag className={cn("flex items-center gap-2.5", className)}>
      <Logo tone={tone} />
      <span className="font-display text-[1.18rem] leading-none font-semibold tracking-[-0.01em] text-fg">
        Septa<span className="text-mint">.</span>
      </span>
    </Tag>
  );
}

export function BrandLink({ className, label }: { className?: string; label?: string }) {
  return (
    <Link
      to="/"
      aria-label={label ?? "Septa — home"}
      className={cn(
        "group inline-flex items-center rounded-lg transition-opacity hover:opacity-90",
        className
      )}
    >
      <Wordmark />
    </Link>
  );
}
