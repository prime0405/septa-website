import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { BgMotion } from "../../lib/bgThemes";

/** The handover, and it has to equal the `transition` on `.bgfx-mesh` in `index.css`. */
const DISSOLVE = 1100;

type Slot = { subject: BgMotion | null; on: boolean; live: boolean };

/**
 * The moving line art that gives each page its own wallpaper.
 *
 * Five subjects, one per kind of page, chosen by `bgThemes`: a rotating wireframe globe ringed by
 * breathing pulses and orbited by motes, a depth-layered node network carrying packets along its
 * links, an isometric cube lattice with a light front sweeping across it, a bundle of routed data
 * lanes joined by risers, and a stack of sheared strata sliding past each other.
 *
 * Two facts set every number in this file. The layer runs at 28% (`bgfx-mesh`) and the mask holds it
 * to 0.62 of that across the reading column, so a canvas pixel can never reach the eye at more than
 * 17% Tradewind — but only if nothing is drawn darker than Tradewind at full alpha, because the
 * ceiling is the opaque colour itself, not the coverage. And the page is light, so ink can only ever
 * be seen by being *darker* than the ground: a pale highlight, however large, simply disappears.
 * Together those mean the art has to be carried by Tradewind at high alpha, and that depth has to be
 * expressed with line weight, size and spacing rather than with alpha dropped to a tenth. An alpha
 * below about 0.4 is not a faint stroke on this ground, it is no stroke at all.
 *
 * Cost is bounded the same way the mesh bounds it: counts scale with area, links and cubes are
 * bucketed into four weight bands so a field is four stroke calls rather than thousands, the loop
 * holds at roughly 30fps, it stops when the tab is hidden, and it never starts under
 * `prefers-reduced-motion`.
 *
 * Two canvases exist, always, and only the one under the eye is lit. A section change moves the
 * subject to the dark slot and lets CSS cross the pair over `DISSOLVE` milliseconds, with the field
 * being left behind still painting until it has landed on nothing, so the line art is at full
 * strength on one side or the other for every frame of the change. The dip-to-zero version of this
 * looked like the wallpaper had been switched off, and mounting a fresh canvas per subject put three
 * of them on screen during a fast scroll — one more than the ceiling arithmetic in `index.css` is
 * willing to account for.
 */
export function WallMotion({ mode }: { mode: BgMotion }) {
  const reduce = useReducedMotion();
  const [slots, setSlots] = useState<Slot[]>(() => [
    { subject: mode, on: true, live: true },
    { subject: null, on: false, live: false },
  ]);
  const top = useRef(0);
  const shown = useRef<BgMotion | null>(mode);
  const stop = useRef(0);

  /* The commit is written against refs rather than against the `slots` in this closure, because the
     state it produces is the state that would re-run the effect: read from a snapshot, the second
     pass of a StrictMode remount would see the same stale answer and hand the page a double flip. */
  useEffect(() => {
    if (reduce) return;
    if (shown.current === mode) return;
    shown.current = mode;
    const next = 1 - top.current;
    top.current = next;
    setSlots((s) =>
      s.map((slot, i) =>
        i === next
          ? { subject: mode, on: true, live: true }
          : { ...slot, on: false, live: true },
      ),
    );
    // The field being left behind has no reason to keep working once it has landed on nothing.
    window.clearTimeout(stop.current);
    stop.current = window.setTimeout(() => {
      setSlots((s) => s.map((slot, i) => (i === next ? slot : { ...slot, live: false })));
    }, DISSOLVE);
  }, [mode, reduce]);

  useEffect(() => () => window.clearTimeout(stop.current), []);

  if (reduce) return null;

  return (
    <>
      {slots.map((slot, i) => (
        <WallScene key={i} subject={slot.subject} on={slot.on} live={slot.live} />
      ))}
    </>
  );
}

function WallScene({ subject, on, live }: { subject: BgMotion | null; on: boolean; live: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!live || subject === null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const subjectKey = subject;

    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let clock = 0;
    let scroll = 0;

    const TEAL = "#6db1ae";

    /* One radial sprite for every halo on the site. `ctx.filter` and `shadowBlur` each force their own
       pass per call, so a soft bloom is drawn as a scaled image instead: one upload, hundreds of cheap
       blits. Its core is Tradewind rather than white, because on a light page a glow has to be darker
       than the ground to be seen at all. */
    const sprite = (() => {
      const size = 128;
      const s = document.createElement("canvas");
      s.width = size;
      s.height = size;
      const g = s.getContext("2d");
      if (!g) return null;
      const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, "rgba(109,177,174,0.9)");
      grad.addColorStop(0.35, "rgba(109,177,174,0.34)");
      grad.addColorStop(1, "rgba(109,177,174,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, size, size);
      return s;
    })();

    const halo = (x: number, y: number, r: number, a: number) => {
      if (!sprite || a <= 0) return;
      ctx.globalAlpha = a;
      ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2);
      ctx.globalAlpha = 1;
    };

    /* ------------------------------------ fields ------------------------------------ */
    type Node = { x: number; y: number; vx: number; vy: number; r: number; z: number };
    type Packet = { a: number; b: number; t: number; s: number };
    type Mote = { a: number; r: number; s: number; z: number; v: number };
    type Cube = { x: number; y: number; s: number };
    type Particle = { u: number; v: number; w: number };
    type Lane = { o: number; k: number; amp: number; ph: number; z: number; ps: Particle[] };
    type Plate = { v: number; o: number; g: number; t: number };

    let nodes: Node[] = [];
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let hubs: number[] = [];
    let packets: Packet[] = [];
    let rings: number[] = [];
    let motes: Mote[] = [];
    let cubes: Cube[] = [];
    let rowStep = 90;
    let lanes: Lane[] = [];
    let plates: Plate[] = [];

    const LINK = 178;
    const TAU = Math.PI * 2;
    const clamp = (v: number, lo: number, up: number) => Math.min(up, Math.max(lo, v));
    const wrap = (v: number, span: number) => ((v % span) + span) % span;
    const mod = (v: number, n: number) => ((v % n) + n) % n;

    const nextHop = (from: number) => {
      let to = Math.floor(Math.random() * nodes.length);
      if (to === from) to = (to + 1) % nodes.length;
      return to;
    };

    const build = () => {
      const area = width * height;
      nodes = Array.from({ length: clamp(Math.round(area / 19000), 22, 68) }, () => {
        const z = 0.4 + Math.random() * 0.6;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.44,
          vy: (Math.random() - 0.5) * 0.44,
          r: 1.1 + z * 2.8,
          z,
        };
      });
      px = new Float32Array(nodes.length);
      py = new Float32Array(nodes.length);
      // The fattest nodes are the ones that read as hubs, so they are the ones that get a ring.
      hubs = nodes
        .map((_, i) => i)
        .sort((a, b) => nodes[b].r - nodes[a].r)
        .slice(0, 6);
      packets = Array.from({ length: 9 }, () => {
        const a = Math.floor(Math.random() * nodes.length);
        return { a, b: nextHop(a), t: Math.random(), s: 0.16 + Math.random() * 0.3 };
      });

      // Seven pulses evenly staggered across one breath, so the assembly is never empty and never full.
      rings = Array.from({ length: 7 }, (_, i) => i / 7);
      motes = Array.from({ length: 30 }, () => {
        const z = 0.45 + Math.random() * 0.55;
        return {
          a: Math.random() * TAU,
          r: 0.26 + Math.random() * 0.94,
          s: 0.9 + Math.random() * 1.8,
          z,
          v: 0.5 + Math.random() * 1.5,
        };
      });

      const step = clamp(width / 12, 78, 132);
      rowStep = step * 0.86;
      cubes = [];
      for (let y = -rowStep * 2; y < height + rowStep * 3; y += rowStep) {
        for (let x = -step; x < width + step * 2; x += step) {
          const odd = mod(Math.round((y + rowStep * 2) / rowStep), 2);
          cubes.push({ x: x + (odd ? step / 2 : 0), y, s: step * 0.44 });
        }
      }

      /* Lanes are spread across nearly the whole height and kept close to parallel. Bundling them
         through the middle instead turns a routed system into a plate of spaghetti, which is the one
         thing this subject has to avoid. */
      const laneCount = width < 760 ? 4 : 6;
      lanes = Array.from({ length: laneCount }, (_, i) => {
        const z = 0.4 + (i / (laneCount - 1)) * 0.6;
        return {
          o: (i / (laneCount - 1) - 0.5) * 1.62,
          k: 0.9 + z * 0.9,
          amp: 0.34 + z * 0.5,
          ph: i * 2.1,
          z,
          ps: Array.from({ length: Math.round(4 + z * 6) }, () => ({
            u: Math.random(),
            v: 0.05 + z * 0.1,
            w: 0.5 + Math.random() * 1.5,
          })),
        };
      });

      plates = Array.from({ length: 7 }, (_, i) => ({
        v: (i % 2 ? -1 : 1) * (10 + i * 5),
        o: Math.random() * 1000,
        g: 46 + i * 24,
        t: 0.2 + (i % 3) * 0.32,
      }));
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      build();
    };

    /* Every scene advances on elapsed time rather than on tick count, so a throttled tab slows its
       clock instead of slowing its motion. `K` is the mesh's original 33ms step expressed as a rate,
       which keeps the plexus moving at exactly the speed it was measured at. */
    const K = 1 / 0.033;

    /* ---------------------------------- plexus ---------------------------------- */
    const drawPlexus = (dt: number) => {
      const sx = width + 60;
      const sy = height + 60;
      for (let i = 0; i < nodes.length; i += 1) {
        const n = nodes[i];
        n.x += n.vx * n.z * dt * K;
        n.y += n.vy * n.z * dt * K;
        /* Depth decides how hard the scroll pulls a node sideways and up, so the network shears as the
           page moves instead of sliding as one flat sheet. Links are measured from these painted
           positions, never from the raw field, so a wrapped node cannot string a line across the
           viewport. */
        px[i] = wrap(n.x - scroll * n.z * 0.05, sx) - 30;
        py[i] = wrap(n.y - scroll * n.z * 0.09, sy) - 30;
      }

      ctx.strokeStyle = TEAL;
      // Four weight bands, so the whole mesh is four stroke calls rather than a thousand.
      for (let b = 0; b < 4; b += 1) {
        const lo = b / 4;
        const hi = (b + 1) / 4;
        let any = false;
        ctx.beginPath();
        for (let i = 0; i < nodes.length; i += 1) {
          for (let j = i + 1; j < nodes.length; j += 1) {
            const dx = px[i] - px[j];
            const dy = py[i] - py[j];
            const d2 = dx * dx + dy * dy;
            if (d2 > LINK * LINK) continue;
            const w = (1 - Math.sqrt(d2) / LINK) * Math.min(nodes[i].z, nodes[j].z);
            if (w < lo || w >= hi) continue;
            ctx.moveTo(px[i], py[i]);
            ctx.lineTo(px[j], py[j]);
            any = true;
          }
        }
        if (!any) continue;
        ctx.lineWidth = 0.7 + hi * 3.1;
        ctx.globalAlpha = 0.42 + hi * 0.58;
        ctx.stroke();
      }

      // Dots in two passes: the far field small, the near field fat enough to read as a node.
      for (let pass = 0; pass < 2; pass += 1) {
        ctx.beginPath();
        let any = false;
        for (let i = 0; i < nodes.length; i += 1) {
          const near = nodes[i].z > 0.72;
          if ((pass === 0) === near) continue;
          const r = nodes[i].r * (pass === 0 ? 0.8 : 1.3);
          ctx.moveTo(px[i] + r, py[i]);
          ctx.arc(px[i], py[i], r, 0, TAU);
          any = true;
        }
        if (!any) continue;
        ctx.fillStyle = TEAL;
        ctx.globalAlpha = pass === 0 ? 0.55 : 1;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (let i = 0; i < hubs.length; i += 1) {
        const h = hubs[i];
        const pulse = 0.7 + 0.3 * Math.sin(clock * 0.9 + i * 1.4);
        ctx.strokeStyle = TEAL;
        ctx.globalAlpha = 0.6 + 0.4 * pulse;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(px[h], py[h], nodes[h].r + 7 + pulse * 4, 0, TAU);
        ctx.stroke();
        ctx.globalAlpha = 1;
        halo(px[h], py[h], 30 + pulse * 12, 0.3 + pulse * 0.2);
      }

      // Packets: the reason a network reads as a network rather than as static line art.
      for (const p of packets) {
        p.t += p.s * dt * K * 0.02;
        if (p.t >= 1) {
          p.a = p.b;
          p.b = nextHop(p.a);
          p.t = 0;
          p.s = 0.16 + Math.random() * 0.3;
        }
        const ax = px[p.a];
        const ay = py[p.a];
        const x = ax + (px[p.b] - ax) * p.t;
        const y = ay + (py[p.b] - ay) * p.t;
        const bx = ax + (px[p.b] - ax) * Math.max(0, p.t - 0.1);
        const by = ay + (py[p.b] - ay) * Math.max(0, p.t - 0.1);
        halo(x, y, 22, 0.45);
        ctx.strokeStyle = TEAL;
        ctx.globalAlpha = 0.85;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = TEAL;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(x, y, 2.8, 0, TAU);
        ctx.fill();
      }
    };

    /* ----------------------------------- rings ------------------------------------ */
    const drawRings = () => {
      const cx = width < 900 ? width * 0.5 : width * 0.755;
      const cy = height * 0.46;
      const R = Math.min(width * 0.9, height * 0.82) * 0.34;
      const tilt = 0.46;
      /* Scrolling turns the globe as well as time, which is what makes a fixed canvas read as depth
         rather than as a screensaver. */
      const rot = clock * 0.1 + scroll * 0.0016;
      const squash = Math.sin(tilt);

      // The laminar ribbon first, so the globe reads as sitting in front of it.
      ctx.strokeStyle = TEAL;
      for (let k = 0; k < 4; k += 1) {
        const base = height * (0.24 + k * 0.19);
        const amp = height * (0.045 + k * 0.016);
        ctx.lineWidth = 1.4 + (k === 1 ? 2 : 0.2);
        ctx.globalAlpha = k === 1 ? 0.85 : 0.5;
        ctx.beginPath();
        for (let x = -20; x <= width + 20; x += 14) {
          const y =
            base +
            Math.sin(
              (x / width) * TAU * (1.3 + k * 0.25) +
                clock * (0.22 + k * 0.05) +
                scroll * 0.001 * (1 + k * 0.3) +
                k,
            ) *
              amp;
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Latitude circles: an ellipse at the height of the parallel, squashed by the tilt.
      ctx.strokeStyle = TEAL;
      for (let i = -2; i <= 2; i += 1) {
        const lat = i * 0.44;
        const rx = R * Math.cos(lat);
        const face = 1 - Math.abs(i) / 2;
        ctx.globalAlpha = 0.55 + face * 0.45;
        ctx.lineWidth = 1.2 + face * 2.2;
        ctx.beginPath();
        ctx.ellipse(cx, cy - R * Math.sin(lat) * Math.cos(tilt), rx, rx * squash, 0, 0, TAU);
        ctx.stroke();
      }

      // Meridians: the same great circle seen edge-on collapses to a vertical line, and that
      // collapse is the only cheap way to sell a rotation on a 2D canvas.
      for (let m = 0; m < 6; m += 1) {
        const ph = rot + (m * Math.PI) / 6;
        const face = Math.abs(Math.sin(ph));
        ctx.globalAlpha = 0.48 + face * 0.52;
        ctx.lineWidth = 1 + face * 2.2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, R * face, R, 0, 0, TAU);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Two gyroscope rings running the other way, so the assembly has an outside as well as a body.
      for (let g = 0; g < 2; g += 1) {
        const a = -rot * (0.5 + g * 0.4) + g * 1.1;
        ctx.save();
        ctx.setLineDash([3, 11]);
        ctx.strokeStyle = TEAL;
        ctx.globalAlpha = 0.72;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(cx, cy, R * (1.24 + g * 0.16), R * (0.2 + g * 0.12), a, 0, TAU);
        ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      /* One breath per 9s, derived from the clock rather than accumulated per frame, so the cycle runs
         at the same speed whether the tab is at 30fps or throttled. A pulse leaves the core, opens to
         the rim and then comes back in — the radius is a triangle wave and the alpha peaks at the
         turn, which is what hides the reversal. */
      const reach = R * 1.34;
      ctx.strokeStyle = TEAL;
      for (let i = 0; i < rings.length; i += 1) {
        const p = (clock / 9 + rings[i]) % 1;
        const tri = p < 0.5 ? p * 2 : 2 - p * 2;
        const r = reach * (0.05 + tri * 0.95);
        ctx.globalAlpha = Math.sin(Math.PI * p) * 0.95;
        ctx.lineWidth = 1 + (1 - tri) * 2.6;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * squash, 0, 0, TAU);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      const beat = 0.5 + 0.5 * Math.sin(clock * 0.7);
      halo(cx, cy, R * (0.34 + beat * 0.1), 0.4 + beat * 0.2);
      ctx.strokeStyle = TEAL;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * 0.07, R * 0.07 * squash, 0, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = TEAL;
      ctx.beginPath();
      ctx.arc(cx, cy, 4.2, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;

      /* Motes orbit in one of the two planes, so some cross the face of the globe and some pass over
         its poles. Each leaves a short arc behind it, which is the difference between a dusting of
         dots and a field of bodies. */
      for (const m of motes) {
        const a = m.a + clock * (0.05 + m.z * 0.16) * m.v;
        const r = R * m.r;
        const flat = m.v < 1.2;
        const rx = r * (flat ? 1 : squash);
        const ry = r * (flat ? squash : 1);
        const x = cx + Math.cos(a) * rx;
        const y = cy + Math.sin(a) * ry;
        ctx.strokeStyle = TEAL;
        ctx.globalAlpha = 0.5 + 0.45 * m.z;
        ctx.lineWidth = 1.2 + m.z * 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, a - 0.24, a);
        ctx.stroke();
        ctx.fillStyle = TEAL;
        ctx.globalAlpha = 0.65 + 0.35 * Math.abs(Math.sin(clock * 0.6 + m.a));
        ctx.beginPath();
        ctx.arc(x, y, m.s * (0.7 + m.z), 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    /* ---------------------------------- lattice --------------------------------- */
    const drawLattice = () => {
      // A light front travels across the grid; a cube's weight is its distance from that front, which
      // is the animated version of the reference's neon-rimmed cubes.
      const fx = ((clock * 0.09) % 1.4 - 0.2) * width;
      const fy = ((clock * 0.055) % 1.3 - 0.15) * height;
      const band = Math.max(width, height) * 0.34;

      /* The grid slides up as the page scrolls, by a shift that wraps on two rows so the brick parity
         never changes and the reset is invisible. */
      const dy = wrap(-scroll * 0.05, rowStep * 2) - rowStep * 2;

      const hx = (s: number) => s * 0.866;
      const hot: Cube[] = [];
      // Four lighting bands, each drawn as one outline stroke, so ~200 cubes cost four path builds
      // rather than eight hundred state changes.
      for (let b = 0; b < 4; b += 1) {
        const lo = b / 4;
        const hi = (b + 1) / 4;
        const lids: Cube[] = [];
        let any = false;
        ctx.strokeStyle = TEAL;
        ctx.beginPath();
        for (const c of cubes) {
          const y = c.y + dy;
          if (y < -c.s * 2 || y > height + c.s * 2) continue;
          const d = Math.hypot(c.x - fx, y - fy);
          const l = Math.max(0, 1 - d / band);
          if (l < lo || l >= hi) continue;
          const s = c.s;
          const mid = y - s * 0.5;
          const bot = y + s * 0.5;
          const lx = c.x - hx(s);
          const rx = c.x + hx(s);
          ctx.moveTo(c.x, y - s);
          ctx.lineTo(rx, mid);
          ctx.lineTo(rx, bot);
          ctx.lineTo(c.x, y + s);
          ctx.lineTo(lx, bot);
          ctx.lineTo(lx, mid);
          ctx.closePath();
          ctx.moveTo(lx, mid);
          ctx.lineTo(c.x, y);
          ctx.lineTo(rx, mid);
          ctx.moveTo(c.x, y);
          ctx.lineTo(c.x, y + s);
          any = true;
          // Only the front of the wave gets a lid; a grid where every cube is solid is a wall.
          if (hi > 0.5) lids.push(c);
          if (l > 0.86 && hot.length < 12) hot.push(c);
        }
        if (!any) continue;
        ctx.globalAlpha = 0.42 + hi * 0.58;
        ctx.lineWidth = 0.9 + hi * 2.7;
        ctx.stroke();

        /* The lids go on their own path. Batched in with the outlines, one `fill()` would have taken
           the hexagons as well, because a closed subpath encloses area whether or not it was meant to
           be painted. */
        if (lids.length) {
          ctx.beginPath();
          for (const c of lids) {
            const y = c.y + dy;
            const s = c.s;
            ctx.moveTo(c.x, y - s);
            ctx.lineTo(c.x + hx(s), y - s * 0.5);
            ctx.lineTo(c.x, y);
            ctx.lineTo(c.x - hx(s), y - s * 0.5);
            ctx.closePath();
          }
          ctx.fillStyle = TEAL;
          ctx.globalAlpha = 0.16 + hi * 0.3;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      for (const c of hot) {
        const y = c.y + dy;
        const l = 1 - Math.hypot(c.x - fx, y - fy) / band;
        halo(c.x, y - c.s * 0.5, c.s * 1.9, 0.3 + l * 0.35);
      }
    };

    /* ---------------------------------- stream ---------------------------------- */
    const drawStream = (dt: number) => {
      const mid = height * 0.5;
      const laneY = (L: Lane, u: number) =>
        mid +
        L.o * height * 0.34 +
        Math.sin(u * TAU * L.k + L.ph + clock * 0.26 + scroll * 0.0012 * L.z) *
          L.amp *
          height *
          0.085;

      const stations = [0.16, 0.38, 0.6, 0.82];

      // Lane bodies, far to near, so the thick solid ones arrive last and sit in front.
      ctx.strokeStyle = TEAL;
      for (const L of lanes) {
        ctx.lineWidth = 1.1 + L.z * 3.2;
        ctx.globalAlpha = 0.45 + L.z * 0.5;
        ctx.beginPath();
        for (let u = -0.04; u <= 1.04; u += 0.02) {
          const x = u * width;
          const y = laneY(L, u);
          if (u <= -0.04) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Risers between adjacent lanes: the part that makes a stream a routed system rather than stripes.
      for (let i = 0; i < lanes.length - 1; i += 1) {
        const a = lanes[i];
        const b = lanes[i + 1];
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = 0.34 + Math.min(a.z, b.z) * 0.4;
        ctx.beginPath();
        for (const st of stations) {
          const x = st * width;
          ctx.moveTo(x, laneY(a, st));
          ctx.lineTo(x, laneY(b, st));
        }
        ctx.stroke();
        ctx.fillStyle = TEAL;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        for (const st of stations) {
          const x = st * width;
          const ya = laneY(a, st);
          const yb = laneY(b, st);
          ctx.moveTo(x + 2.6, ya);
          ctx.arc(x, ya, 2.6, 0, TAU);
          ctx.moveTo(x + 2.6, yb);
          ctx.arc(x, yb, 2.6, 0, TAU);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Particles, each with a tail long enough to read as motion and a head solid enough to read as
      // data. A junction flashes when a particle crosses it.
      for (const L of lanes) {
        for (const p of L.ps) {
          p.u += p.v * dt;
          if (p.u > 1.08) p.u -= 1.16;
          const x = p.u * width;
          const y = laneY(L, p.u);
          const tail = 0.05 + p.w * 0.02;
          const tx = (p.u - tail) * width;
          const ty = laneY(L, p.u - tail);
          ctx.strokeStyle = TEAL;
          ctx.lineWidth = 1.2 + p.w * 1.8;
          ctx.globalAlpha = 0.55 + L.z * 0.45;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.fillStyle = TEAL;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(x, y, 1.8 + p.w * 1.6, 0, TAU);
          ctx.fill();
          if (L.z > 0.62) halo(x, y, 14 + p.w * 8, 0.28 + L.z * 0.22);

          for (const st of stations) {
            const near = Math.abs(p.u - st);
            if (near < 0.018) halo(st * width, laneY(L, st), 30, 0.42 * (1 - near / 0.018));
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    /* ---------------------------------- strata ---------------------------------- */
    const drawStrata = () => {
      const n = plates.length;
      const gap = (height + 150) / n;
      /* The stack rises as the page scrolls, and the plate that leaves the top is the one that enters
         at the bottom: attributes are keyed to the absolute slot, so the wrap is invisible and the
         layer count on screen never changes. */
      const t = -scroll * 0.06;
      const k = Math.floor(t / gap);
      const shift = t - k * gap;
      // A gentle tilt. Any more than this and the plates stop reading as strata and become diagonals.
      const shear = 0.028 + Math.sin(clock * 0.18) * 0.012;

      for (let i = 0; i < n; i += 1) {
        const s = plates[mod(i - k, n)];
        const y = -80 + i * gap + shift + Math.sin(clock * 0.2 + i * 0.9) * height * 0.012;
        const th = 11 + s.t * 30;
        const tilt = shear * (width + 120);
        const x0 = -60;
        const x1 = width + 60;

        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x1, y - tilt);
        ctx.lineTo(x1, y - tilt - th);
        ctx.lineTo(x0, y - th);
        ctx.closePath();
        ctx.fillStyle = TEAL;
        ctx.globalAlpha = 0.1 + s.t * 0.16;
        ctx.fill();

        // The leading edge carries the weight, so the stack reads as plates with a top rather than bars.
        ctx.strokeStyle = TEAL;
        ctx.lineWidth = 1.6 + s.t * 3;
        ctx.globalAlpha = 0.7 + s.t * 0.3;
        ctx.beginPath();
        ctx.moveTo(x0, y - th);
        ctx.lineTo(x1, y - th - tilt);
        ctx.stroke();

        // Ticks sliding along the plate, which is where the "layers of records" read comes from.
        // The y is taken from the shifted position, or the ticks drift off the tilted edge they sit on.
        const off = wrap(s.o + clock * s.v, s.g);
        ctx.lineWidth = 1.2 + s.t * 2.4;
        ctx.globalAlpha = 0.45 + s.t * 0.4;
        ctx.beginPath();
        for (let x = x0 - s.g; x < x1 + s.g; x += s.g) {
          const xx = x + off;
          if (xx < x0 || xx > x1) continue;
          const yy = y - th - tilt * ((xx - x0) / (x1 - x0)) - th * 0.44;
          ctx.moveTo(xx, yy);
          ctx.lineTo(Math.min(xx + s.g * 0.6, x1), yy);
        }
        ctx.stroke();

        // A pulse runs the length of every plate at its own speed.
        const pu = wrap(clock * (0.06 + s.t * 0.05) + s.o * 0.001, 1.2) - 0.1;
        halo(x0 + pu * (x1 - x0), y - th - tilt * pu, 40, 0.34 + s.t * 0.24);
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
      // The subject is fixed for as long as this slot is lit: `WallMotion` hands a new one over on the
      // dark slot, so a section change never re-seeds a field that is already on screen.
      scenes[subjectKey](dt);
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
    const onScroll = () => {
      scroll = window.scrollY;
    };

    scroll = window.scrollY;
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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      stop();
      ro?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [subject, live]);

  return <canvas ref={canvasRef} aria-hidden data-on={on ? "1" : "0"} className="bgfx-mesh" />;
}
