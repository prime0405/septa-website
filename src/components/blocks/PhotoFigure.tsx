import { useRef, type PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "../../lib/cn";
import { settle } from "../../lib/scroll-curve";

/**
 * A section photograph: the picture itself, cut and placed, with no frame around it.
 *
 * It is not a framed print. There is no border, no rounded plate and no inset highlight: the sheet
 * goes to the edges of the screen on a phone, and on a desk `edge` decides which way it leaves its
 * column — past the gutter toward the page edge, with the side that faces the words cut on a
 * diagonal so the picture ends in a decision rather than a container. `edge="none"` is for a picture
 * standing in the middle of a column of prose, where bleeding sideways would collide with something;
 * there the cut is a single chamfer at the bottom corner.
 *
 * Six things happen to it and each is on a different layer, which is the only reason the combination
 * still reads as calm:
 *
 *   - the picture is 15 per cent larger than its box at all times, so it can be pushed around
 *     inside the cut without ever showing the page through an edge;
 *   - `scroll` moves it — it widens to 1.17 while it holds the middle of the screen and settles to
 *     1.05 as it arrives and leaves, the hero's shrink at the scale an image can carry, on the same
 *     plateau curve so that neither the page nor the photographs inside it are ever quietly wobbling
 *     while you look at them. It drifts 18px the other way on the same value, which is the parallax
 *     that makes the picture read as a window onto a larger scene rather than a thumbnail of one;
 *   - `scroll` colours it too: saturation lifts from 0.86 to full and the shadows open a half step
 *     as it centres, so a photograph arriving from below comes up into its own colour rather than
 *     sliding in already finished. It is the one part of this that is not a transform, and it stays
 *     inside the narrow band where a filter is a paint, not a repaint;
 *   - `the pointer` leans the whole plane toward the cursor, 3.4 degrees at most, and lifts it 16px
 *     out of the cut on the same spring, so the picture has weight and arrives with a little
 *     settle rather than snapping to the mouse;
 *   - `the pointer` also drags a highlight across it — a soft white bloom that follows the cursor
 *     and is gone when it leaves;
 *   - `nothing` moves it — a 34s breath and a light that crosses it every twelve seconds, for the
 *     long stretches in which nobody is scrolling or hovering.
 *
 * `scale`, `translate`, `rotate`, a low-alpha gradient and a narrow filter only, so no frame ever
 * reflows and the layout cannot jump under the reader. Under `prefers-reduced-motion` every scroll
 * and pointer value collapses to a constant, the lean is never armed, and the global rule stops the
 * breath and the travelling light: what is left is the identical, still photograph. The lean needs a
 * real pointer, so it is also gated on `hover: hover`.
 */
export function PhotoFigure({
  src,
  alt,
  eager,
  edge = "right",
  ratio = "aspect-[3/2]",
  width = 1200,
  height = 800,
  className,
  static: isStatic = false,
}: {
  src: string;
  alt: string;
  /** The first image on a page is worth an early request; the rest can wait for the scroll. */
  eager?: boolean;
  /** Which way the sheet leaves its column, and therefore which side carries the diagonal cut. */
  edge?: "left" | "right" | "none";
  ratio?: string;
  width?: number;
  height?: number;
  className?: string;
  /** Keep a hero photograph still while preserving its normal section behaviour elsewhere. */
  static?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduce = isStatic || useReducedMotion();
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const scrollScale = useTransform(scrollYProgress, (p) => (reduce ? 1.1 : 1.05 + 0.12 * settle(p)));
  const parallax = useTransform(scrollYProgress, (p) => (reduce ? 0 : (0.5 - p) * 36));
  const saturation = useTransform(scrollYProgress, (p) => (reduce ? 1 : 0.86 + 0.14 * settle(p)));
  const brightness = useTransform(scrollYProgress, (p) => (reduce ? 1 : 0.97 + 0.03 * settle(p)));

  // One pointer value arms the lean, the lift and the bloom together, so all three arrive on the
  // same spring and settle at the same moment instead of three layers easing at three rates.
  const leanX = useMotionValue(0);
  const leanY = useMotionValue(0);
  const active = useMotionValue(0);
  const spring = { stiffness: 150, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(leanY, [-0.5, 0.5], [3.4, -3.4]), spring);
  const rotateY = useSpring(useTransform(leanX, [-0.5, 0.5], [-3.4, 3.4]), spring);
  const lift = useSpring(active, { stiffness: 190, damping: 20, mass: 0.6 });
  const hoverScale = useTransform(lift, [0, 1], [1, 1.022]);
  const planeScale = useTransform([scrollScale, hoverScale], ([a, b]) => (a as number) * (b as number));
  const depth = useTransform(lift, [0, 1], [0, reduce ? 0 : 16]);
  const filter = useTransform(
    [saturation, brightness],
    ([s, br]) => `saturate(${s as number}) brightness(${br as number})`,
  );

  // The bloom is positioned in percentages of the frame, and it is sprung rather than direct
  // because glass does not track a hand; it arrives a moment after it.
  const gx = useSpring(useTransform(leanX, [-0.5, 0.5], [8, 92]), { stiffness: 90, damping: 18 });
  const gy = useSpring(useTransform(leanY, [-0.5, 0.5], [8, 92]), { stiffness: 90, damping: 18 });
  const bloom = useTransform([gx, gy, lift], ([x, y, on]) =>
    (on as number) < 0.01
      ? "none"
      : `radial-gradient(38% 46% at ${x as number}% ${y as number}%, rgb(255 255 255 / ${
          0.3 * (on as number)
        }), rgb(255 255 255 / 0) 70%)`,
  );

  const track = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const box = event.currentTarget.getBoundingClientRect();
    leanX.set((event.clientX - box.left) / box.width - 0.5);
    leanY.set((event.clientY - box.top) / box.height - 0.5);
  };
  const release = () => {
    leanX.set(0);
    leanY.set(0);
    active.set(0);
  };

  return (
    <div
      ref={frameRef}
      data-edge={edge}
      onPointerMove={track}
      onPointerEnter={() => !reduce && active.set(1)}
      onPointerLeave={release}
      className={cn("photo-sheet group", className)}
    >
      <div style={{ perspective: 1100 }} className={cn("photo-cut relative overflow-hidden", ratio)}>
        <motion.div
          style={{ scale: planeScale, y: parallax, z: depth, rotateX, rotateY, filter }}
          className="photo-plane absolute inset-[-8%] will-change-transform"
        >
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            decoding="async"
            fetchPriority={eager ? "high" : "auto"}
            loading={eager ? "eager" : "lazy"}
            className="photo-breathe size-full object-cover"
          />
        </motion.div>
        {/* The light crossing the glass, the bloom that follows the cursor, and the edge the glass is
            cut with. All painted, none laid out, so none of them can move anything. */}
        <span aria-hidden className="photo-sheen pointer-events-none absolute inset-0 block" />
        <motion.span
          aria-hidden
          style={{ background: bloom }}
          className="pointer-events-none absolute inset-0 block mix-blend-plus-lighter"
        />
        <span
          aria-hidden
          className="photo-vignette pointer-events-none absolute inset-0 block opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>
    </div>
  );
}
