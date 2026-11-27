import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "../../lib/cn";

/**
 * The arrival pulse a call to action gets when it comes onto the screen.
 *
 * Septa asked for the button to grow and thicken as it enters view and then return to its own size —
 * the way a word gets emphasized once, when you first read it, rather than permanently. So this is a
 * one-shot gesture on entry, not a loop: `scale` and weight both travel out and back while the
 * section is still arriving, and are home again before anyone starts reading. It replays on the way
 * back up, because "when you enter the screen" is the trigger, not "the first time".
 *
 * Both halves are paint-only, which is the part that matters for the page. `scale` composites and
 * costs nothing. The weight is a `text-shadow` in the label's own colour, not `font-weight`: this
 * site's display face ships as two static files (src/assets/fonts), so there is no bold to animate
 * to and requesting one would synthesise a second typeface mid-gesture and reflow every glyph in the
 * button. A shadow of the same colour laid under the letters is what makes a stroke look heavier, and
 * it moves no text and changes no width. The four offsets are fixed and only the blur grows, so the
 * animation interpolates rather than switching discretely between two different shadow lists.
 *
 * Seven per cent is the whole enlargement and the pulse lasts just over a second, because a button
 * that grows more than that reads as a control changing state — enabled, focused, about to be
 * pressed — which is a lie about a link. Under `prefers-reduced-motion` the wrapper stays in the tree
 * with nothing applied to it: the button is the same size it always was and the label is never
 * thickened.
 */
const AMPLITUDE = 1.07;

/** Four hairlines under the glyphs, in the label's own colour, at the peak of the pulse. */
const THICK = "0 0 0.65px currentColor, 0 0 0.65px currentColor, 0 0 0.65px currentColor, 0 0 0.65px currentColor";
const THIN = "0 0 0px currentColor, 0 0 0px currentColor, 0 0 0px currentColor, 0 0 0px currentColor";

export function CtaArrival({
  children,
  className,
  waiting,
}: {
  children: ReactNode;
  className?: string;
  /** Hold the pulse back while something else is still arriving — the curtain, for instance. */
  waiting?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "-12% 0px -12% 0px" });

  if (reduce) return <span className={cn("inline-block", className)}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      animate={
        inView && !waiting
          ? { scale: [1, AMPLITUDE, 1], textShadow: [THIN, THICK, THIN] }
          : { scale: 1, textShadow: THIN }
      }
      transition={{ duration: 1.05, times: [0, 0.34, 1], ease: ["easeOut", "easeInOut"] }}
      className={cn("inline-block will-change-transform", className)}
    >
      {children}
    </motion.span>
  );
}
