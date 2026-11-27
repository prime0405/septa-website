import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

export type RevealStyle = "up" | "left" | "right" | "soft" | "scale";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  style?: RevealStyle;
  amount?: number;
};

const hiddenStates = {
  up: { opacity: 0, x: 0, y: 96, scale: 0.94, rotate: 0, filter: "blur(10px)" },
  left: { opacity: 0, x: -112, y: 22, scale: 0.96, rotate: -1.25, filter: "blur(9px)" },
  right: { opacity: 0, x: 112, y: 22, scale: 0.96, rotate: 1.25, filter: "blur(9px)" },
  soft: { opacity: 0, x: 0, y: 58, scale: 0.95, rotate: 0, filter: "blur(12px)" },
  scale: { opacity: 0, x: 0, y: 72, scale: 0.86, rotate: 0, filter: "blur(9px)" },
} as const;

const visibleState = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
  filter: "blur(0px)",
};

/**
 * Reversible viewport reveal. Elements arrive with a clear directional movement
 * and return to their hidden pose when they leave the viewport. Reduced-motion
 * preferences bypass the transform and opacity choreography entirely.
 */
export default function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.95,
  style = "up",
  amount = 0.16,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(elementRef, {
    once: false,
    amount,
    margin: "-4% 0px -4% 0px",
  });
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      ref={elementRef}
      initial={false}
      animate={reduceMotion || isInView ? visibleState : hiddenStates[style]}
      transition={{
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion || !isInView ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
