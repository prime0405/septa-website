import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import type { BgTheme } from "./bgThemes";

/**
 * Which section's wallpaper the backdrop should be wearing.
 *
 * The wash is one fixed layer behind the whole page, so a page cannot give each of its sections a
 * different background unless something works out which section the visitor is actually reading. This
 * picks the `[data-wall]` element that covers the middle of the viewport, which is the section the
 * copy at the centre of the screen belongs to.
 *
 * Measured from `getBoundingClientRect` on scroll rather than from an IntersectionObserver, for the
 * reason that already bit this site once: an observer reports the intersection rect clipped by every
 * ancestor with overflow, and a section that fills the screen tells you nothing about which of two
 * neighbours owns the centre line. A dozen rects, read at most once per frame while the page moves,
 * is both cheaper and honest.
 *
 * The answer is sticky in two ways, because a wallpaper change is now a visible one-second dissolve
 * and starting one carelessly is worse than starting one late. A section keeps the centre line until
 * the eye has moved past its edge, and two changes are never allowed to overlap into a third.
 *
 * Under `prefers-reduced-motion` the answer is always null: the page keeps its own wallpaper and
 * nothing re-tints as the visitor scrolls.
 */
/** How far past a boundary the centre line must travel before the incumbent loses it. */
const HYSTERESIS = 28;

/** How long after a handover the next one is allowed to start, so fast scrolling through several
 *  sections settles on the last one instead of stacking dissolves three deep. It is longer than the
 *  dissolve itself, which is the point: two mounted scenes are the most the ceiling argument can
 *  cover (same colour, so their combined coverage peaks at the single-layer number), and a third
 *  canvas painting the full viewport is both a contrast unknown and a GPU bill nobody asked for. */
const REHANDOVER = 1200;

export function useActiveWall(): BgTheme | null {
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const [wall, setWall] = useState<BgTheme | null>(null);
  const last = useRef<BgTheme | null>(null);

  useEffect(() => {
    if (reduce) {
      last.current = null;
      return;
    }
    let frame = 0;
    let timer = 0;
    let holdUntil = 0;
    // Armed only while the page has no wallpaper to read at all, and dropped as soon as it does.
    let arriving: MutationObserver | null = null;
    const read = () => {
      frame = 0;
      const mid = window.innerHeight * 0.45;
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-wall]"));
      if (nodes.length === 0) {
        // The lazy page has not mounted yet, so this frame shows the Suspense fallback: the route's own
        // theme is the right answer, and it is the one the wash is already wearing when `wall` is null.
        // But nothing here reads again when the sections arrive, and a page whose first walled section
        // covers the centre line would sit on the route theme until the visitor happened to scroll. So
        // watch the page, take the answer once it has one, and stop watching.
        if (!arriving) {
          const main = document.getElementById("main");
          if (main) {
            arriving = new MutationObserver(onMove);
            arriving.observe(main, { childList: true, subtree: true });
          }
        }
      } else if (arriving) {
        arriving.disconnect();
        arriving = null;
      }
      let owner: BgTheme | null = null;
      /* The incumbent is asked first, and gets the centre line for `HYSTERESIS` beyond its own edge.
         Without that, stopping one pixel past a boundary and nudging back starts a fresh dissolve on
         every nudge: the two neighbours trade the answer at whatever rate the wheel fires. */
      if (last.current !== null) {
        for (const el of nodes) {
          if (el.dataset.wall !== last.current) continue;
          const box = el.getBoundingClientRect();
          if (box.top - HYSTERESIS <= mid && box.bottom + HYSTERESIS >= mid) {
            owner = last.current;
            break;
          }
        }
      }
      if (owner === null) {
        // Above the first walled section the page is still wearing its own route theme, which is what
        // the interior page headers are designed around. Below the last one there is only the footer, so
        // the answer clamps to that last section instead of falling back: re-tinting the whole wash back
        // to the page's theme while someone reads the footer would be a change with nothing behind it.
        const first = nodes[0]?.getBoundingClientRect();
        const before = Boolean(first && mid < first.top + HYSTERESIS);
        let best = Number.POSITIVE_INFINITY;
        for (const el of nodes) {
          const box = el.getBoundingClientRect();
          const key = el.dataset.wall as BgTheme;
          // A section that spans the centre line wins outright; otherwise the nearest centre does.
          if (box.top <= mid && box.bottom >= mid) {
            owner = key;
            break;
          }
          const d = Math.abs((box.top + box.bottom) / 2 - mid);
          if (d < best) {
            best = d;
            owner = key;
          }
        }
        if (before) owner = null;
      }
      if (owner === last.current) return;
      const now = performance.now();
      if (now < holdUntil) {
        // A second handover is not wanted while the first is still running, but the answer must not be
        // lost either: look again when the window closes and take whatever the eye is on by then.
        timer = window.setTimeout(read, holdUntil - now + 16);
        return;
      }
      holdUntil = now + REHANDOVER;
      last.current = owner;
      setWall(owner);
    };
    const onMove = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onMove, { passive: true });
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove);
      window.removeEventListener("resize", onMove);
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      arriving?.disconnect();
      arriving = null;
    };
  }, [reduce, pathname]);

  // The answer is dropped at read time rather than reset in the effect, so a visitor who turns
  // reduced motion on mid-session gets the page's own wallpaper immediately without a second render.
  return reduce ? null : wall;
}
