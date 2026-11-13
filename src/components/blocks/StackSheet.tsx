import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/*
 * Stacked sections: the next band arrives by sliding up over the one you were reading.
 *
 * The scroll already puts each section under the previous one, but it does it at exactly the speed of
 * the scrollbar, so nothing ever appears to travel over anything — the two edges simply pass. This
 * adds the missing relative motion. Every sheet is displaced along the same straight line across its
 * own pass: `+6vh` when it is still below you, `0` while it holds the screen, `-6vh` as it leaves. So
 * a section arriving is pulled up into the section above it, and the section above is held down into
 * the one arriving, and because the later sheet is painted on top and is opaque, what you watch is the
 * new band cover the old one rather than two bands going past each other.
 *
 * Six per cent of the viewport, in each direction, is the whole budget, and the number is not a
 * taste call. `.section` reserves `clamp(3.5rem, 8vw, 7rem)` of vertical padding — 56px at its tightest
 * — and 6vh of a 900px screen is 54px. Displacement can therefore never exceed the padding that keeps
 * copy off the band edge, which means a sheet can cover the strip of the previous sheet you have
 * already scrolled past, but it cannot reach a line you are still reading. Push the amplitude to
 * 20vh, which is what the trend demos use, and the last sentence of every section gets eaten by the
 * next one on a phone.
 *
 * The band has to be solid for this to read at all: at 76% the veil let the sheet underneath show
 * through as a ghost of the section you had left, which is the opposite of stacking. `src/index.css`
 * paints these bands at full strength now that nothing animates behind them.
 *
 * Two details do most of the work of making it look like physical sheets rather than a repaint: the
 * leading edge casts a shadow down onto the band it is covering (`.stack-sheet`), and the border that
 * every band already carries becomes the visible top edge of the card. Only `transform` is animated.
 *
 * The measured element and the moved element are different divs on purpose, for the same reason
 * `SectionStage` splits them: `useScroll` reads a bounding rect, a bounding rect includes the
 * element's own transform, and if the sheet were measuring itself the displacement would feed its own
 * input — a section would settle at some fixed point away from where the curve says it should be. The
 * outer div carries the stacking order and is never transformed.
 *
 * The hero is deliberately not a sheet. It is already pinned (`position: sticky` in a taller
 * wrapper), which is a stronger version of the same idea, and wrapping a sticky element in a
 * transformed ancestor would make its stuck position drift by the displacement — the headline would
 * slide out from under the nav instead of shrinking.
 *
 * Under `prefers-reduced-motion` the displacement is a constant zero and the stacking order is left
 * exactly as it is: the page becomes the plain sequence of bands it was before, with no overlap and
 * no travel between them.
 */

/** Twice the half-amplitude, in vh: the total distance a sheet travels relative to the scroll. */
const TRAVEL = 12;

export function StackSheet({ order, children }: { order: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, (p) => (reduce ? 0 : `${(p - 0.5) * TRAVEL}vh`));

  return (
    <div ref={ref} className="relative" style={{ zIndex: order }}>
      <motion.div style={{ y }} className="stack-sheet will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
