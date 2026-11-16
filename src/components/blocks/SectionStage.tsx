import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { settle } from "../../lib/scroll-curve";

/*
 * The hero's shrink, given to the rest of the homepage.
 *
 * The hero tightens while it is scrolled past and re-inflates coming back, and the reason it reads
 * well is that its size is a pure function of the scrollbar: there is no timer to fall behind, so a
 * flick in either direction lands on the exact frame the position implies. A section cannot be
 * pinned the way the hero can — eight pinned stages in a row is a page you fight rather than read —
 * so this does the same thing without the pin: the section's content is at full size while it holds
 * the screen and recedes as it arrives and as it leaves.
 *
 * The curve is a plateau, not a peak, and that is the whole of the difference between this version
 * and the one it replaces. A half-sine is at its maximum for a single instant, so a section is
 * technically full-size only at the exact middle of its pass and visibly under-size for all of the
 * reading either side of it — the effect was constant, which is another word for a page that will
 * not sit still. A plateau holds 1.0 across the middle two fifths of the pass and only moves at the
 * ends, so the breathing happens while the reader is arriving or moving on, and never while they are
 * reading. The ramps are smoothstep rather than linear because a plateau has two corners, and a
 * corner in a curve you can watch is a hitch.
 *
 * The fade rides the identical curve, so a section is never dimmer than it is small; the two fall
 * together and full size always comes with full strength. The drift is signed by which end of the
 * pass you are on, so a section rises the last few pixels into place as it arrives and leaves the
 * same few pixels ahead of it going out — the motion reads as one continuous settle rather than as
 * two opposite flinches. It is twelve pixels because the band's own padding is ninety-six, and a
 * section's copy can therefore never be pushed onto its neighbour.
 *
 * Only the content moves, never the band underneath it: the section's veil and its hairline border
 * stay put, so the page's structure is still while what is on it breathes. That is the same division
 * the hero makes between its white dissolve and its headline.
 *
 * `last` is the closing band — the footer — and it gets the arrival half of the gesture only. A
 * section that ends the document never leaves, so the departing half of the curve is not just
 * unreachable, it is wrong: measured against `end start` the footer's progress tops out at
 * `h / (h + vh)`, which on a phone is past the plateau, so the page would come to rest with its own
 * footer shrunk and dimmed. Measuring against `end end` instead makes progress exactly 1 at the
 * bottom of the page whatever the two heights are, and halving it before the curve keeps only the
 * rising ramp. The footer therefore grows into place as it covers the last sheet and is at full
 * size and strength by the time three quarters of it is on screen — and stays there.
 */

export function SectionStage({ children, last = false }: { children: ReactNode; last?: boolean }) {
  // The measured box and the transformed box are different elements on purpose. `useScroll` reads
  // the target's bounding rect, and a bounding rect includes an element's own transform — so if the
  // div being scaled were also the div being measured, shrinking the section would move its edges,
  // which changes the progress that decides the shrink. It settles at a fixed point rather than
  // running away, but the curve the reader sees is then not the curve described here. Measuring a
  // plain outer wrapper — whose layout no transform can touch — keeps the curve exact.
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: last ? ["start end", "end end"] : ["start end", "end start"],
  });
  const pass = useTransform(scrollYProgress, (p) => (last ? p * 0.5 : p));
  const scale = useTransform(pass, (p) => (reduce ? 1 : 0.955 + 0.045 * settle(p)));
  const opacity = useTransform(pass, (p) => (reduce ? 1 : 0.82 + 0.18 * settle(p)));
  const drift = useTransform(pass, (p) =>
    reduce ? 0 : (last || p < 0.5 ? 1 : -1) * (1 - settle(p)) * 12,
  );

  return (
    <div ref={ref}>
      <motion.div
        style={{ scale, opacity, y: drift, transformOrigin: "50% 50%" }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
