import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useReducedMotion } from "motion/react";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

function tracksPointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia(FINE_POINTER).matches;
}

/**
 * Pointer tracking for the cursor-driven effects on the site, returned as spreadable props.
 *
 * `glow` writes `--gx` / `--gy`, the cursor position inside the element, so a child can
 * paint a highlight around that point.
 *
 * `magnet` writes `--tx` / `--ty`, a few pixels of travel toward the cursor measured from
 * the element's centre, and zeroes them on pointer leave.
 *
 * `tilt` writes `--rx` / `--ry` as well as the glow position, because every element that
 * tilts also carries the wash: the two effects share one handler rather than one rAF each.
 *
 * All modes are inert on touch and under `prefers-reduced-motion`. Writes are coalesced
 * into one frame because `pointermove` fires faster than the screen refreshes. The element
 * itself holds the transform and its transition, which keeps the motion in CSS.
 */
export function usePointerTrack<T extends HTMLElement>(
  mode: "glow" | "magnet" | "tilt" = "glow",
  strength = 8,
) {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(tracksPointer);
  const pending = useRef<{ el: T; vars: string[] } | null>(null);
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

  const write = useCallback((el: T, vars: string[]) => {
    pending.current = { el, vars };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const next = pending.current;
      if (!next) return;
      for (let i = 0; i < next.vars.length; i += 2) {
        next.el.style.setProperty(next.vars[i], next.vars[i + 1]);
      }
    });
  }, []);

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
      if (mode === "tilt") {
        // Clamped because a card can slide out from under a still cursor, which would
        // otherwise hand back an angle far past `strength`.
        const lean = (v: number) => Math.max(-0.5, Math.min(0.5, v));
        const rx = -2 * lean(y / box.height - 0.5) * strength;
        const ry = 2 * lean(x / box.width - 0.5) * strength;
        write(el, [
          "--gx",
          `${Math.round(x)}px`,
          "--gy",
          `${Math.round(y)}px`,
          "--rx",
          `${rx.toFixed(2)}deg`,
          "--ry",
          `${ry.toFixed(2)}deg`,
        ]);
        return;
      }
      const tx = Math.max(-1, Math.min(1, (x - box.width / 2) / (box.width / 2))) * strength;
      const ty = Math.max(-1, Math.min(1, (y - box.height / 2) / (box.height / 2))) * strength;
      write(el, ["--tx", `${tx.toFixed(1)}px`, "--ty", `${ty.toFixed(1)}px`]);
    },
    [reduce, fine, mode, strength, write],
  );

  const onPointerLeave = useCallback(
    (event: ReactPointerEvent<T>) => {
      if (mode === "magnet") {
        event.currentTarget.style.setProperty("--tx", "0px");
        event.currentTarget.style.setProperty("--ty", "0px");
      }
      if (mode === "tilt") {
        event.currentTarget.style.setProperty("--rx", "0deg");
        event.currentTarget.style.setProperty("--ry", "0deg");
      }
    },
    [mode],
  );

  return { onPointerMove, onPointerLeave };
}
