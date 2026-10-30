import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";
import { FIN_LOCKUP, FIN_MARK, FIN_TRADEWIND, LOCKUP_VIEWBOX, MARK_VIEWBOX } from "./brandPaths";

/**
 * The Septa mark. The Tradewind fin is fixed by the brand manual; the second fin
 * inherits `currentColor` so it can be white on dark surfaces and Black Pearl on light ones.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={cn("size-[26px] shrink-0", className)}
      role="img"
      aria-label="Septa mark"
    >
      <path d={FIN_TRADEWIND} fill="#6db1ae" fillRule="evenodd" />
      <path d={FIN_MARK} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/** The full lockup: mark plus the lowercase "septa" wordmark, as supplied. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={LOCKUP_VIEWBOX}
      className={cn("h-[22px] w-auto shrink-0", className)}
      role="img"
      aria-label="Septa"
    >
      <path d={FIN_TRADEWIND} fill="#6db1ae" fillRule="evenodd" />
      <path d={FIN_LOCKUP} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

export function BrandLink({ className, label }: { className?: string; label?: string }) {
  return (
    <Link
      to="/"
      aria-label={label ?? "Septa home"}
      className={cn(
        "group inline-flex items-center rounded-lg text-fg transition-opacity hover:opacity-90",
        className
      )}
    >
      <Wordmark />
    </Link>
  );
}
