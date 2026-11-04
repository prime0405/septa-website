import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { useReducedMotion } from "motion/react";

const TURNS = 4.2;
/** How far behind the head the trail is drawn, in full turns. */
const TRAIL = 2.1;
const SEGMENTS = 170;

/**
 * The headline's backdrop: a single dot that leaves the centre, orbits while its radius grows,
 * crosses off the edge of the hero, and then winds the same way back in before starting again.
 *
 * The trail is a real spiral, not a rotating arm: radius is proportional to the angle travelled,
 * so each orbit sits outside the last, and the last orbit is defined as the one whose radius
 * reaches the farthest corner of the box. The speed is eased by `sin(progress)` so the reversal at
 * either end reads as a turn rather than a bounce.
 *
 * Contrast is budgeted the same way the site-wide mesh is. Here the budget is spent per region
 * instead of per layer: `maskDimOn` measures the copy block and dims the wash only where the words
 * actually are, which is what lets the line run at full strength through the gutters and the empty
 * corners without any glyph ever sitting on a Tradewind stroke darker than the mesh's worst pixel.
 */
export function HeroSpiral({
  copyRef,
  className,
}: {
  /** The headline block. The spiral dims itself behind this box. */
  copyRef: RefObject<HTMLElement | null>;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    // px gained per radian, so one full turn adds 2π·growth to the radius.
    let growth = 20;
    let reach = 1;
    let theta = 0;
    let dir = 1;
    let last = 0;
    let frame = 0;
    let maskAt = 0;

    const dimOn = () => {
      const target = copyRef.current;
      if (!target) return;
      const box = canvas.getBoundingClientRect();
      const text = target.getBoundingClientRect();
      const rx = Math.max(60, text.width / 2 + 40);
      const ry = Math.max(60, text.height / 2 + 40);
      const cx = text.left + text.width / 2 - box.left;
      const cy = text.top + text.height / 2 - box.top;
      // 10% of the wash inside the copy, full strength outside, with a long soft ramp so the
      // boundary is a vignette rather than a cut.
      const mask = `radial-gradient(${rx.toFixed(0)}px ${ry.toFixed(0)}px at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, rgb(0 0 0 / 0.1) 58%, #000 96%)`;
      canvas.style.maskImage = mask;
      canvas.style.webkitMaskImage = mask;
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Reaching the farthest corner means the dot is guaranteed to leave the hero before it turns.
      reach = Math.hypot(width, height) / 2 + 12;
      growth = reach / (TURNS * Math.PI * 2);
      dimOn();
    };

    const paint = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;

      // Eased angular speed: slowest at the centre and at the edge, quickest in between.
      const progress = Math.min(1, theta / (reach / growth));
      const speed = 1.15 + 1.5 * Math.sin(Math.PI * progress);
      theta += dir * speed * dt;
      if (theta >= reach / growth) {
        theta = reach / growth;
        dir = -1;
      } else if (theta <= 0.05) {
        theta = 0.05;
        dir = 1;
      }

      if (now - maskAt > 400) {
        maskAt = now;
        dimOn();
      }

      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const from = Math.max(0, theta - TRAIL * Math.PI * 2);
      const span = theta - from;
      if (span <= 0) return;

      ctx.lineCap = "round";
      for (let i = 0; i < SEGMENTS; i += 1) {
        const a = from + (span * i) / SEGMENTS;
        const b = from + (span * (i + 1)) / SEGMENTS;
        const fade = i / SEGMENTS;
        ctx.strokeStyle = `rgba(109, 177, 174, ${(0.04 + 0.5 * fade * fade).toFixed(3)})`;
        ctx.lineWidth = 0.5 + 1.5 * fade;
        ctx.beginPath();
        ctx.moveTo(cx + growth * a * Math.cos(a), cy + growth * a * Math.sin(a));
        ctx.lineTo(cx + growth * b * Math.cos(b), cy + growth * b * Math.sin(b));
        ctx.stroke();
      }

      const hx = cx + growth * theta * Math.cos(theta);
      const hy = cy + growth * theta * Math.sin(theta);
      ctx.strokeStyle = "rgba(109, 177, 174, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(hx, hy, 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(109, 177, 174, 0.85)";
      ctx.beginPath();
      ctx.arc(hx, hy, 3.1, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last < 33) return;
      paint(now);
    };

    const start = () => {
      if (frame || document.hidden) return;
      last = 0;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    let ro: ResizeObserver | null = null;
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    start();
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        resize();
        paint(performance.now());
      });
      ro.observe(canvas);
    } else {
      window.addEventListener("resize", resize);
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      ro?.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce, copyRef]);

  if (reduce) return null;

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
