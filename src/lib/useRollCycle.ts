import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FocusEvent } from "react";
import { useReducedMotion } from "motion/react";

/**
 * The timing shared by every self-advancing list.
 *
 * Advancement is driven by the progress fill's own `animationend`, not by a parallel timer, so the
 * bar and the jump can never drift apart: pausing the animation pauses the list. It also only runs
 * while the block is on screen, and returns a frozen, fully legible list under reduced motion.
 */
export function useRollCycle(count: number) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const advance = useCallback(() => {
    setActive((a) => (a + 1) % count);
    setCycle((c) => c + 1);
  }, [count]);

  /* Pointing the reel at a row also bumps the cycle, which remounts the interval fill. A row that was
     reached by pointer or keypress therefore gets its own full interval before the roll moves on,
     instead of being skipped the moment the leftover time runs out. */
  const select = useCallback((index: number) => {
    setActive(index);
    setCycle((c) => c + 1);
  }, []);

  // Anything that freezes the fill freezes the roll, because the fill is the clock.
  const frozen = reduce || hovered || focused || !onScreen;

  /* A tap lands focus on the row as surely as a Tab does, and a phone has no `pointerleave` to take
     it away again, so freezing on any focus would end the walk for the rest of the visit. The browser
     already knows the difference: it only draws a focus ring for a keyboard. */
  const focusIn = (e: FocusEvent<HTMLElement>) => {
    if (e.target instanceof HTMLElement && e.target.matches(":focus-visible")) setFocused(true);
  };

  // A tap fires `pointerenter` on a finger device and nothing ever fires `pointerleave`, so on a
  // phone the first touch would freeze the list for the rest of the visit. "Hover" pause is only
  // wired up where a pointer can actually leave.
  const hoverable = useMemo(() => window.matchMedia("(hover: hover)").matches, []);

  return {
    reduce,
    active,
    cycle,
    frozen,
    advance,
    select,
    hoverable,
    ref,
    hoverProps: {
      onPointerEnter: () => hoverable && setHovered(true),
      onPointerLeave: () => hoverable && setHovered(false),
      onFocusCapture: focusIn,
      onBlurCapture: () => setFocused(false),
    },
  };
}
