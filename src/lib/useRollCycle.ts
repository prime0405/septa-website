import { useCallback, useEffect, useRef, useState } from "react";
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

  // Anything that freezes the fill freezes the roll, because the fill is the clock.
  const frozen = reduce || hovered || focused || !onScreen;

  return {
    reduce,
    active,
    cycle,
    frozen,
    advance,
    ref,
    hoverProps: {
      onPointerEnter: () => setHovered(true),
      onPointerLeave: () => setHovered(false),
      onFocusCapture: () => setFocused(true),
      onBlurCapture: () => setFocused(false),
    },
  };
}
