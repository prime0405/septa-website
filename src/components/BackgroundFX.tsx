import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { bgThemeFor } from "../lib/bgThemes";

/**
 * The site-wide moving backdrop, in two layers that answer to different rules.
 *
 * `bgfx-wash` is colour: a drifting watercolour plate, two soft orbs, a beam that crosses every
 * so often, and a slow grid. It sits behind everything and is masked so that most of it lands in
 * the gutters beside the reading column. `bgfx-mesh` is the canvas of nodes that wander and link
 * to their neighbours; it is the one layer allowed to pass over the text, held at a fixed 7% so
 * the smallest label on the site still clears AA where a node crosses a chip.
 *
 * Everything here is decorative and pointer-transparent. The canvas is the only part that costs
 * CPU, so it caps its node count by area, holds at ~30fps, stops when the tab is hidden, and
 * never starts under `prefers-reduced-motion`.
 */
export function BackgroundFX() {
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const theme = bgThemeFor(pathname);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);

  // Scroll-linked depth: each sheet drifts at its own rate as the page moves.
  useEffect(() => {
    if (reduce) return;
    const host = depthRef.current;
    if (!host) return;
    let frame = 0;
    const write = () => {
      frame = 0;
      const y = window.scrollY;
      host.style.setProperty("--bgfx-slow", `${(-y * 0.035).toFixed(1)}px`);
      host.style.setProperty("--bgfx-fast", `${(-y * 0.09).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    const LINK = 150;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let frame = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(18, Math.min(64, Math.round((width * height) / 21000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        r: 0.9 + Math.random() * 1.6,
      }));
    };

    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -24) n.x = width + 24;
        else if (n.x > width + 24) n.x = -24;
        if (n.y < -24) n.y = height + 24;
        else if (n.y > height + 24) n.y = -24;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          // Tradewind at full opacity, thinned by the line width rather than by alpha: the mesh's
          // darkness is budgeted once, at the layer, and overlapping strokes must not spend it twice.
          const w = 1 - Math.sqrt(d2) / LINK;
          ctx.strokeStyle = "#6db1ae";
          ctx.lineWidth = 0.4 + w * 0.9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = "#6db1ae";
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last < 33) return;
      last = now;
      paint();
    };

    const start = () => {
      if (frame || document.hidden) return;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    let ro: ResizeObserver | null = null;
    const onVisibility = () => (document.hidden ? stop() : start());
    const redraw = () => {
      resize();
      paint();
    };

    resize();
    paint();
    start();
    // Observed rather than a window listener: the box can go from nothing to something without
    // the window ever reporting a resize, and a 1x1 canvas would stay empty for the whole visit.
    // The window listener is the fallback for browsers with no ResizeObserver, and it is removed
    // on cleanup — a phone rotation otherwise keeps firing against an unmounted tree.
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(redraw);
      ro.observe(canvas);
    } else {
      window.addEventListener("resize", redraw);
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      ro?.disconnect();
      window.removeEventListener("resize", redraw);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  return (
    <>
      <div
        ref={depthRef}
        aria-hidden
        data-bg={theme}
        className="bgfx bgfx-wash pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* The per-page gradient sheets. They paint first, so the plate, grid, beam and orbs sit on
            top of them and the whole wash still runs under the same mirror mask. */}
        <div className="bgfx-sheet bgfx-sheet-a" />
        <div className="bgfx-sheet bgfx-sheet-b" />
        <div
          className="absolute inset-[-8%]"
          style={{ transform: "translate3d(0, var(--bgfx-slow, 0), 0)" }}
        >
          <div className="bgfx-plate size-full">
            <img
              src="/img/plate-aurora.jpg"
              alt=""
              decoding="async"
              className="size-full object-cover opacity-[0.55]"
            />
          </div>
        </div>
        <div className="absolute inset-[-4%]" style={{ transform: "translate3d(0, var(--bgfx-fast, 0), 0)" }}>
          <div className="grid-bg bgfx-grid size-full opacity-[0.16]" />
        </div>
        <div className="bgfx-beam absolute inset-y-[-30%] left-0 w-[46%]" />
        <div className="bgfx-orb bgfx-orb-a" />
        <div className="bgfx-orb bgfx-orb-b" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>
      <canvas ref={canvasRef} aria-hidden className="bgfx-mesh" />
    </>
  );
}
