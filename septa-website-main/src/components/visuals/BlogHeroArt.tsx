import { cn } from "../../lib/cn";

/**
 * The blog's painted plate: a writer's page rather than an orbit.
 *
 * Where the About header draws concentric survey rings, the blog draws the furniture of a
 * manuscript — a horizontal baseline grid, a left margin rule with folio ticks, and a single ghost
 * pilcrow set large in the right margin like a printer's mark. Everything is paint: gradients, one
 * repeating rule, two SVGs and grain. Nothing here animates, so the plate stays still on every
 * route except the homepage hero, and `prefers-reduced-motion` has nothing to collapse.
 *
 * `quiet` strips the pilcrow and the stacked sheets and softens the rules, for the article header
 * where the reader is about to sit with long prose and the plate should recede rather than perform.
 */
export function BlogHeroArt({ quiet = false }: { quiet?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--color-surface) 0%, var(--color-ink) 56%, var(--color-ink-raised) 100%)",
        }}
      />
      {/* the baseline grid of a writer's page, fading out toward the edges so it reads as paper
          texture rather than a table */}
      <div
        className={cn("rule-bg mask-fade absolute inset-0", quiet ? "opacity-25" : "opacity-45")}
      />
      {/* a cool wash top-left and a faint warm one bottom-right, so the plate is not a flat field */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 64% at 8% 4%, color-mix(in oklab, var(--color-brand-teal-lift) 26%, transparent) 0%, transparent 62%), radial-gradient(42% 56% at 92% 96%, color-mix(in oklab, var(--color-amber) 8%, transparent) 0%, transparent 64%)",
        }}
      />
      {/* the left margin rule with folio ticks: the vertical line a manuscript keeps its notes against */}
      <svg
        className={cn("absolute inset-y-0 left-0 h-full w-24 text-brand-teal", quiet && "opacity-60")}
        viewBox="0 0 96 800"
        preserveAspectRatio="none"
        fill="none"
      >
        <line x1="64" y1="0" x2="64" y2="800" stroke="currentColor" strokeOpacity="0.35" />
        {[80, 200, 320, 440, 560, 680].map((y) => (
          <line key={y} x1="56" y1={y} x2="64" y2={y} stroke="currentColor" strokeOpacity="0.4" />
        ))}
        <circle cx="64" cy="200" r="3" fill="var(--color-brand-mint)" fillOpacity="0.5" />
        <circle cx="64" cy="560" r="3" fill="var(--color-brand-mint)" fillOpacity="0.35" />
      </svg>
      {!quiet && (
        <>
          {/* stacked sheets: three printed pages leaning in the right margin */}
          <svg
            className="absolute -top-10 -right-16 size-[420px] text-brand-teal"
            viewBox="0 0 420 420"
            fill="none"
          >
            <g stroke="currentColor">
              <rect x="120" y="60" width="220" height="290" strokeOpacity="0.16" transform="rotate(6 230 205)" />
              <rect x="110" y="70" width="220" height="290" strokeOpacity="0.26" transform="rotate(2 220 215)" />
              <rect x="100" y="80" width="220" height="290" strokeOpacity="0.4" />
            </g>
            <g stroke="currentColor" strokeOpacity="0.3">
              <line x1="124" y1="120" x2="296" y2="120" />
              <line x1="124" y1="150" x2="296" y2="150" />
              <line x1="124" y1="180" x2="252" y2="180" />
              <line x1="124" y1="210" x2="296" y2="210" />
              <line x1="124" y1="240" x2="270" y2="240" />
            </g>
            <circle cx="320" cy="80" r="4" fill="var(--color-brand-mint)" fillOpacity="0.7" />
          </svg>
          {/* the printer's mark: one ghost pilcrow, large, in the right margin */}
          <span className="absolute -right-6 bottom-0 font-display text-[15rem] leading-none text-mint/[0.06] select-none">
            ¶
          </span>
        </>
      )}
      <div className="grain absolute inset-0 opacity-[0.05]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink" />
    </div>
  );
}