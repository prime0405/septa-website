import { useReducedMotion } from "motion/react";

/**
 * The Tradewind highlight that follows the cursor across a card.
 *
 * The opacity is deliberately low. Every accent colour in a card sits close to WCAG AA on
 * white to begin with (`mint` 5.07:1, `faint` 5.3:1, `amber` 4.90:1), so the wash has to be
 * pale enough to leave all of them above 4.5:1 at the point directly under the cursor. At
 * this strength the worst case in a card is 4.66:1. It matches the `bg-mint/[0.07]` tint the
 * service icons already use, which is why it still reads as brand colour rather than dirt.
 *
 * It sits at `z-index: -10` inside a card that also has `isolate`, which paints it above the
 * card's own background and below its text.
 *
 * Pair it with `usePointerTrack("glow")` on the card element; without that handler the
 * highlight parks in the middle of the card instead of following the cursor.
 */
export function PointerGlow({ radius = 240 }: { radius?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{
        background: `radial-gradient(${radius}px circle at var(--gx, 50%) var(--gy, 45%), color-mix(in oklab, var(--color-brand-teal) 7%, transparent), transparent 72%)`,
      }}
    />
  );
}
