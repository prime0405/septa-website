import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const GROWABLE = "a, button, input, textarea, select, summary, [data-cursor='grow']";

/**
 * A Tradewind ring that trails the pointer and a dot that sits exactly on it, both growing over
 * anything clickable.
 *
 * This is now the only pointer on screen: while it runs, `html.cursor-none` suppresses the system
 * arrow, so the dot is what people aim with. That is only ever applied on a fine-pointer device
 * with motion enabled, and it is removed again when the component unmounts. The loop lerps toward
 * the pointer and stops itself once it has caught up, so a still cursor costs nothing.
 */
export function CursorHalo() {
  const reduce = useReducedMotion();
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || !window.matchMedia(FINE_POINTER).matches) return;
    const ringEl = ring.current;
    const dotEl = dot.current;
    if (!ringEl || !dotEl) return;

    document.documentElement.classList.add("cursor-none");

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let scale = 1;
    let target = 1;
    let frame = 0;
    let shown = false;

    const paint = () => {
      ringEl.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      dotEl.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    };

    const loop = () => {
      x += (tx - x) * 0.17;
      y += (ty - y) * 0.17;
      scale += (target - scale) * 0.15;
      const settled =
        Math.abs(tx - x) < 0.4 && Math.abs(ty - y) < 0.4 && Math.abs(target - scale) < 0.004;
      if (settled) {
        x = tx;
        y = ty;
        scale = target;
        frame = 0;
      } else {
        frame = requestAnimationFrame(loop);
      }
      paint();
    };

    const move = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      const hit = event.target as Element | null;
      target = hit && typeof hit.closest === "function" && hit.closest(GROWABLE) ? 1.9 : 1;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        ringEl.style.opacity = "1";
        dotEl.style.opacity = "1";
      }
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const hide = () => {
      shown = false;
      ringEl.style.opacity = "0";
      dotEl.style.opacity = "0";
      cancelAnimationFrame(frame);
      frame = 0;
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      document.documentElement.classList.remove("cursor-none");
      cancelAnimationFrame(frame);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="cursor-halo pointer-events-none fixed top-0 left-0 z-[80] -ml-3 -mt-3 size-6 rounded-full border border-mint/55 opacity-0 will-change-transform transition-opacity duration-300"
      />
      <div
        ref={dot}
        aria-hidden
        className="cursor-halo pointer-events-none fixed top-0 left-0 z-[80] -ml-[3.5px] -mt-[3.5px] size-[7px] rounded-full bg-mint opacity-0 shadow-[0_0_0_3px_rgba(255,255,255,0.75)] will-change-transform transition-opacity duration-200"
      />
    </>
  );
}
