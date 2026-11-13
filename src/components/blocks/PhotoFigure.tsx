import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cn } from "../../lib/cn";

/**
 * A framed photograph that answers the scrollbar the way the homepage hero does.
 *
 * The hero tightens as it is scrolled past and re-inflates coming back, because its movement is a
 * function of the stage's position in the viewport rather than a timer. This is the same idea, at
 * the scale a section image can carry: the picture is widest while it owns the middle of the screen
 * and settles as it leaves, so scrolling down through the offerings reads as the images drawing in
 * and letting go instead of three still frames passing by. It never reaches 1.0 at either end,
 * which is what keeps the frame covered — a scale under one would show the page through the edge of
 * the box.
 *
 * Only `scale` is touched, so nothing reflows: the frame keeps the height its aspect ratio gives it
 * from the first paint and the layout cannot jump under the reader. Under
 * `prefers-reduced-motion` the range collapses to one value, and the global rule already stops the
 * drift on the picture itself, which leaves the identical, still image.
 */
export function PhotoFigure({
  src,
  alt,
  eager,
  ratio = "aspect-[4/3]",
  width = 900,
  height = 675,
  className,
}: {
  src: string;
  alt: string;
  /** The first image on a page is worth an early request; the rest can wait for the scroll. */
  eager?: boolean;
  ratio?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [1.04, 1.04, 1.04] : [1.04, 1.14, 1.04],
  );

  return (
    <div
      ref={frameRef}
      className={cn("overflow-hidden rounded-card border border-line shadow-soft", className)}
    >
      <motion.div style={{ scale }} className="will-change-transform">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          loading={eager ? "eager" : "lazy"}
          className={cn("photo-breathe w-full object-cover", ratio)}
        />
      </motion.div>
    </div>
  );
}
