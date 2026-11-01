import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useReducedMotion } from "motion/react";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

function tracksPointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia(FINE_POINTER).matches;
}

/**
 * Pointer tracking for the two cursor-driven effects on the site, returned as spreadable
 * props.
 *
 * `glow` writes `--gx` / `--gy`, the cursor position inside the element, so a child can
 * paint a highlight around that point.
 *
 * `magnet` writes `--tx` / `--ty`, a few pixels of travel toward the cursor measured from
 * the element's centre, and zeroes them on pointer leave. The element itself gets a
 * transform and a transition, which keeps the motion in CSS instead of an animation loop.
 *
 * Both modes are inert on touch and under `prefers-reduced-motion`. Writes are coalesced
 * into one frame because `pointermove` fires faster than the screen refreshes.
 */
export function usePointerTrack<T extends HTMLElement>(mode: "glow" | "magnet" = "glow", strength = 8) {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(tracksPointer);
  const pending = useRef<{ el: T; vars: [string, string, string, string] } | null>(null);
  const frame = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia(FINE_POINTER);
    const onChange = () => setFine(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(
    () => () => {
      cancelAnimationFrame(frame.current);
    },
    [],
  );

  const write = useCallback(
    (el: T, vars: [string, string, string, string]) => {
      pending.current = { el, vars };
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const next = pending.current;
        if (!next) return;
        for (let i = 0; i < 4; i += 2) {
          next.el.style.setProperty(next.vars[i], next.vars[i + 1]);
        }
      });
    },
    [],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<T>) => {
      if (reduce || !fine) return;
      const el = event.currentTarget;
      const box = el.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      if (mode === "glow") {
        write(el, ["--gx", `${Math.round(x)}px`, "--gy", `${Math.round(y)}px`]);
        return;
      }
      const tx = Math.max(-1, Math.min(1, (x - box.width / 2) / (box.width / 2))) * strength;
      const ty = Math.max(-1, Math.min(1, (y - box.height / 2) / (box.height / 2))) * strength;
      write(el, ["--tx", `${tx.toFixed(1)}px`, "--ty", `${ty.toFixed(1)}px`]);
    },
    [reduce, fine, mode, strength, write],
  );

  const onPointerLeave = useCallback((event: ReactPointerEvent<T>) => {
    if (mode !== "magnet") return;
    const el = event.currentTarget;
    el.style.setProperty("--tx", "0px");
    el.style.setProperty("--ty", "0px");
  }, [mode]);

  return { onPointerMove, onPointerLeave };
}
