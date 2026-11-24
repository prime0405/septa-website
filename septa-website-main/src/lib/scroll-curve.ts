/**
 * The one curve the scroll-driven motion on this site is built on.
 *
 * Both `SectionStage` and `PhotoFigure` ask the same question — how far through its pass is this
 * element? — and answer it with the same shape: full strength across the middle of the pass, easing
 * away at both ends. Sharing the function is what keeps a section and the photograph inside it
 * breathing on the same schedule instead of two slightly different ones, which is the difference
 * between motion that reads as one gesture and motion that reads as a page that will not sit still.
 */

/** Eased 0→1 across [a, b], so anything built from it has no corner where it starts and stops. */
export function ramp(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** 1 while the element holds the middle of the screen, 0 at either end of its pass. */
export function settle(p: number): number {
  return Math.min(ramp(0.02, 0.38, p), 1 - ramp(0.62, 0.98, p));
}
