import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "../../lib/cn";

/*
 * Stacked sections: the band you are reading holds still, and the next one slides up over it.
 *
 * The version this replaces displaced every band by a few pixels against the scrollbar. That reads
 * as parallax — two edges drifting past each other — because nothing ever stops moving. A cover needs
 * something to be covered: the outgoing band has to stop, and the incoming one has to keep going.
 *
 * So each sheet is `position: sticky` with its top set to `100svh - its own height`. Read that as a
 * bottom edge pinned to the bottom of the screen. A sheet scrolls normally until its last line has
 * reached the bottom of the viewport — which is to say, until it has been fully read — and only then
 * does it stick. Everything after it keeps scrolling, and because later sheets carry a higher
 * z-index and an opaque plate, what you watch is the next band travel up over the one that stopped.
 * Nothing is displaced, nothing lags, and the scroll distance is the page's own: sticky does not add
 * height, so the scrollbar is exactly as long as it was.
 *
 * This is why the height is measured rather than assumed. The sheets run from a 250px logo strip to a
 * 1150px service grid, and a single `top: 0` would pin every one of them at its first line and hide
 * the rest of it. `--sheet-h` is written by a ResizeObserver on the sheet itself, so the pin point is
 * correct at every width, after fonts load, and when a quote or a photograph changes the band's
 * height. Nothing about the measurement feeds back into the size: `top` moves a sticky box, it does
 * not resize one.
 *
 * The containing block is the homepage's pinned stage — the wrapper that holds the hero through the
 * partners strip — not a per-sheet wrapper: a wrapper cut to the sheet's own height would leave the
 * sticky box no room to travel and it would never stick at all. Sharing one containing block also
 * means every sheet releases together, in the last viewport of the stage, which is exactly when the
 * partners strip has been fully read. Below that strip the stack ends: the remaining sections and
 * the footer are ordinary flow, so the cover gesture is a chapter of the page rather than its whole
 * grammar.
 *
 * The hero is pinned against the same containing block and sits at the bottom of the stack, so it is
 * the floor under every sheet: there is no frame, at any scroll position, where the page shows
 * through a seam. `100svh` rather than `100dvh` or `100vh` is deliberate — it is the smallest mobile
 * viewport, so a sheet always pins with its last line above the fold even with the browser chrome
 * showing, and when the chrome retracts the extra strip at the bottom is already filled by the next
 * sheet arriving, never by a gap.
 *
 * Under `prefers-reduced-motion` the class is not applied at all. The sheets stay in normal flow, in
 * the same order, as the plain sequence of bands this was before.
 */

export function StackSheet({ order, children }: { order: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => el.style.setProperty("--sheet-h", `${el.offsetHeight}px`);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("stack-sheet", !reduce && "stack-sticky")}
      style={{ zIndex: order }}
    >
      {children}
    </div>
  );
}