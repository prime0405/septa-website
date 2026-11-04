import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import type { BgMotion } from "../../lib/bgThemes";

const TEAL = "#6db1ae";

/**
 * The moving line art that gives each page its own wallpaper.
 *
 * Five subjects, drawn from the four technology references the brand supplied and chosen per page by
 * `bgThemes`: a ring assembly breathing over a wave field, the wandering node network, an isometric
 * cube lattice with a light sweeping across it, a particle stream, and drifting strata.
 *
 * The contrast budget is the one the mesh has always carried and it is not spent twice. Strokes are
 * Tradewind at or below full alpha, the layer runs at 16% (`bgfx-mesh`), and the mask holds it to
 * 0.44 of that across the reading column, so the worst pixel that can ever sit behind a glyph is
 * 7% of Tradewind — the same number the AA measurements were taken against. Compositing an alpha
 * stroke over another can approach that ceiling but never pass it, because the ceiling is the
 * opaque colour itself.
 *
 * Cost is bounded the same way the mesh bounds it: node counts scale with area, the loop holds at
 * roughly 30fps, it stops when the tab is hidden, and it never starts under `prefers-reduced-motion`.
 */
export function WallMotion({ mode }: { mode: BgMotion }) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** The subject the running loop is drawing, which trails `mode` by one fade. */
  const modeRef = useRef<BgMotion>(mode);

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let clock = 0;

    /* Each scene keeps its own moving parts. `build` runs on every resize so a phone rotation or a
       split-screen change re-seeds the field rather than stretching the one built at first paint. */
    let nodes: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    let rings: number[] = [];
    let motes: Array<{ a: number; r: number; s: number }> = [];
    let cubes: Array<{ x: number; y: number; s: number }> = [];
    let flow: Array<{ u: number; v: number; o: number; k: number; w: number }> = [];
    let strata: Array<{ y: number; v: number; o: number; g: number; t: number }> = [];

    const LINK = 150;

    const build = () => {
      const area = width * height;
      nodes = Array.from(
        { length: Math.max(18, Math.min(64, Math.round(area / 21000))) },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.34,
          vy: (Math.random() - 0.5) * 0.34,
          r: 0.9 + Math.random() * 1.6,
        }),
      );
      // Seven rings, evenly staggered across one breath, so the assembly is never empty and never full.
      rings = Array.from({ length: 7 }, (_, i) => i / 7);
      motes = Array.from({ length: 26 }, () => ({
        a: Math.random() * Math.PI * 2,
        r: 0.18 + Math.random() * 0.82,
        s: 0.5 + Math.random() * 1.9,
      }));
      const step = Math.max(74, Math.min(124, width / 13));
      cubes = [];
      for (let y = step * 0.6; y < height + step; y += step * 0.86) {
        for (let x = -step; x < width + step * 2; x += step) {
          const odd = Math.round(y / (step * 0.86)) % 2;
          cubes.push({ x: x + (odd ? step / 2 : 0), y, s: step * 0.42 });
        }
      }
      flow = Array.from({ length: Math.max(46, Math.min(120, Math.round(area / 16000))) }, () => ({
        u: Math.random(),
        v: 0.028 + Math.random() * 0.05,
        o: (Math.random() - 0.5) * 0.34,
        k: 1.4 + Math.random() * 2.6,
        w: 0.4 + Math.random() * 1.5,
      }));
      strata = Array.from({ length: 7 }, (_, i) => ({
        y: height * (0.14 + i * 0.115),
        v: (i % 2 ? -1 : 1) * (9 + i * 4.5),
        o: Math.random() * width,
        g: 40 + i * 26,
        t: 0.25 + (i % 3) * 0.3,
      }));
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    /* Every scene advances on elapsed time rather than on tick count, so a throttled tab slows its
       clock instead of slowing its motion. `K` is the mesh's original 33ms step expressed as a rate,
       which keeps the plexus moving at exactly the speed it was measured at. */
    const K = 1 / 0.033;

    /* ---------------------------------- plexus ---------------------------------- */
    const drawPlexus = (dt: number) => {
      for (const n of nodes) {
        n.x += n.vx * dt * K;
        n.y += n.vy * dt * K;
        if (n.x < -24) n.x = width + 24;
        else if (n.x > width + 24) n.x = -24;
        if (n.y < -24) n.y = height + 24;
        else if (n.y > height + 24) n.y = -24;
      }
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          // Weight carries the distance falloff rather than alpha, so a crossing cannot darken.
          const w = 1 - Math.sqrt(d2) / LINK;
          ctx.strokeStyle = TEAL;
          ctx.lineWidth = 0.4 + w * 0.9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.fillStyle = TEAL;
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    /* ----------------------------------- rings ---------------------------------- */
    const drawRings = () => {
      const cx = width < 900 ? width * 0.5 : width * 0.74;
      const cy = height * 0.44;
      const reach = Math.min(width, height) * 0.46;
      ctx.strokeStyle = TEAL;
      ctx.lineWidth = 1;

      // The laminar ribbon first, so the rings read as sitting in front of it.
      for (let k = 0; k < 4; k += 1) {
        const base = height * (0.3 + k * 0.16);
        const amp = height * (0.05 + k * 0.018);
        ctx.lineWidth = 0.6 + (k === 1 ? 0.9 : 0.2);
        ctx.beginPath();
        for (let x = -20; x <= width + 20; x += 14) {
          const y =
            base +
            Math.sin(x / width * Math.PI * 2 * (1.3 + k * 0.25) + clock * (0.22 + k * 0.05) + k) * amp;
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // One breath per 9s, derived from the clock rather than accumulated per frame, so the cycle runs
      // at the same speed whether the tab is at 30fps or throttled. A ring leaves the centre, opens to
      // `reach` and dissolves before the next arrives, which is what makes the loop seamless.
      for (let i = 0; i < rings.length; i += 1) {
        const p = (clock / 9 + rings[i]) % 1;
        const r = reach * (0.06 + p * 0.94);
        ctx.globalAlpha = Math.sin(Math.PI * p) * 0.85;
        ctx.lineWidth = 0.5 + (1 - p) * 1.3;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, reach * 0.055, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = TEAL;
      ctx.beginPath();
      ctx.arc(cx, cy, 3.2, 0, Math.PI * 2);
      ctx.fill();

      for (const m of motes) {
        const r = reach * m.r;
        const a = m.a + clock * 0.05;
        ctx.globalAlpha = 0.45 + 0.5 * Math.abs(Math.sin(clock * 0.6 + m.a));
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, m.s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    /* ---------------------------------- lattice --------------------------------- */
    const drawLattice = () => {
      // A light front travels across the grid; a cube's edge weight is its distance from that front,
      // which is the animated version of the reference's neon-rimmed cubes.
      const fx = ((clock * 0.09) % 1.4 - 0.2) * width;
      const fy = ((clock * 0.055) % 1.3 - 0.15) * height;
      const band = Math.max(width, height) * 0.3;
      ctx.strokeStyle = TEAL;
      for (const c of cubes) {
        const d = Math.hypot(c.x - fx, c.y - fy);
        const lit = Math.max(0, 1 - d / band);
        ctx.lineWidth = 0.35 + lit * 1.5;
        ctx.globalAlpha = 0.28 + lit * 0.72;
        const s = c.s;
        ctx.beginPath();
        for (let i = 0; i < 6; i += 1) {
          const a = (Math.PI / 3) * i - Math.PI / 6;
          const px = c.x + Math.cos(a) * s;
          const py = c.y + Math.sin(a) * s;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        if (lit > 0.35) {
          // The three inner edges that turn the hexagon into a cube.
          ctx.beginPath();
          for (let i = 0; i < 3; i += 1) {
            const a = (Math.PI * 2 / 3) * i - Math.PI / 2;
            ctx.moveTo(c.x, c.y);
            ctx.lineTo(c.x + Math.cos(a) * s, c.y + Math.sin(a) * s);
          }
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    /* ---------------------------------- stream ---------------------------------- */
    const drawStream = (dt: number) => {
      const mid = height * 0.5;
      ctx.strokeStyle = TEAL;
      ctx.fillStyle = TEAL;
      for (const p of flow) {
        p.u += p.v * 0.35 * dt;
        if (p.u > 1.06) p.u -= 1.12;
        const x = p.u * width;
        const wave = (x / width) * Math.PI * p.k;
        const y = mid + p.o * height * 0.5 + Math.sin(wave + clock * 0.3) * height * 0.11;
        const tail = 16 + p.w * 26;
        const px = x - tail;
        const py =
          mid + p.o * height * 0.5 + Math.sin((px / width) * Math.PI * p.k + clock * 0.3) * height * 0.11;
        ctx.lineWidth = p.w;
        ctx.globalAlpha = 0.3 + p.w * 0.3;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 0.9 + p.w * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    /* ---------------------------------- strata ---------------------------------- */
    const drawStrata = () => {
      ctx.strokeStyle = TEAL;
      for (const s of strata) {
        const shift = (s.o + clock * s.v) % s.g;
        ctx.lineWidth = 0.5 + s.t;
        ctx.globalAlpha = 0.35 + s.t * 0.5;
        ctx.beginPath();
        for (let x = -s.g; x < width + s.g; x += s.g) {
          ctx.moveTo(x + shift, s.y);
          ctx.lineTo(x + shift + s.g * 0.62, s.y);
        }
        ctx.stroke();
        ctx.beginPath();
        for (let x = s.g * 0.62; x < width; x += s.g) {
          ctx.moveTo(x + shift, s.y - 4);
          ctx.lineTo(x + shift, s.y + 4);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const scenes: Record<BgMotion, (dt: number) => void> = {
      rings: drawRings,
      plexus: drawPlexus,
      lattice: drawLattice,
      stream: drawStream,
      strata: drawStrata,
    };

    const paint = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      clock += dt;
      ctx.clearRect(0, 0, width, height);
      // Read through the ref, so a new subject is picked up on the next frame without tearing down
      // the loop or re-seeding the field. `useActiveWall` changes this several times a scroll.
      scenes[modeRef.current](dt);
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
  }, [reduce]);

  /* The subject changes as the visitor moves between sections, and a cut from one field of line art
     to another is the one thing this layer must not do: the strokes are faint, but a whole-field
     change is unmistakable. So the canvas fades out, the scene pointer moves while nothing is visible,
     and the new field fades up into the same clock. */
  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (modeRef.current === mode) return;
    canvas.classList.add("is-swapping");
    const swap = window.setTimeout(() => {
      modeRef.current = mode;
      canvas.classList.remove("is-swapping");
    }, 460);
    return () => {
      window.clearTimeout(swap);
      canvas.classList.remove("is-swapping");
    };
  }, [mode, reduce]);

  if (reduce) return null;

  return <canvas ref={canvasRef} aria-hidden className="bgfx-mesh" />;
}
