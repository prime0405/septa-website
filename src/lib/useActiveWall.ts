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
 * Under `prefers-reduced-motion` the answer is always null: the page keeps its own wallpaper and
 * nothing re-tints as the visitor scrolls.
 */
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
    const read = () => {
      frame = 0;
      const mid = window.innerHeight * 0.45;
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-wall]"));
      // Above the first walled section the page is still wearing its own route theme, which is what
      // the interior page headers are designed around. Below the last one there is only the footer, so
      // the answer clamps to that last section instead of falling back: re-tinting the whole wash back
      // to the page's theme while someone reads the footer would be a change with nothing behind it.
      const first = nodes[0]?.getBoundingClientRect();
      const before = Boolean(first && mid < first.top);
      let owner: BgTheme | null = null;
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
      if (owner !== last.current) {
        last.current = owner;
        setWall(owner);
      }
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
    };
  }, [reduce, pathname]);

  // The answer is dropped at read time rather than reset in the effect, so a visitor who turns
  // reduced motion on mid-session gets the page's own wallpaper immediately without a second render.
  return reduce ? null : wall;
}
