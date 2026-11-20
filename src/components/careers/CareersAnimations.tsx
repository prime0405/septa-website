
import {
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/* ==========================================
   1. SCROLL-LINKED HERO ANIMATION
========================================== */

type CareersHeroMotionProps = {
  children: ReactNode;
};

export function CareersHeroMotion({
  children,
}: CareersHeroMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

    const heroScale = useTransform(
    smoothProgress,
    [0, 1],
    [1, 0.95]
    );

    const heroY = useTransform(
    smoothProgress,
    [0, 1],
    [0, -25]
    );

    const heroOpacity = useTransform(
    smoothProgress,
    [0, 1],
    [1, 1]
    );

  const backgroundY = useTransform(
    smoothProgress,
    [0, 1],
    [0, 100]
  );

  return (
    <div
      ref={containerRef}
      className="sc-animated-hero"
    >
      <motion.div
        aria-hidden="true"
        className="sc-hero-parallax"
        style={
          reduceMotion
            ? undefined
            : { y: backgroundY }
        }
      />

      <motion.div
        className="sc-hero-animated-content"
        style={
          reduceMotion
            ? undefined
            : {
                scale: heroScale,
                y: heroY,
                opacity: heroOpacity,
              }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ==========================================
   2. FADE-UP SECTION REVEAL
========================================== */

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function CareersReveal({
  children,
  className,
  delay = 0,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              y: 28,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.55,
        delay: reduceMotion ? 0 : delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/* ==========================================
   3. MAGNETIC BUTTON
========================================== */

type MagneticButtonProps = {
  children: ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
};

export function CareersMagneticButton({
  children,
  href,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const handlePointerMove = (
    event: PointerEvent<HTMLAnchorElement>
  ) => {
    if (reduceMotion || event.pointerType !== "mouse") {
      return;
    }

    const element = buttonRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (event.clientX - centerX) * 0.12;
    const y = (event.clientY - centerY) * 0.12;

    setPosition({ x, y });
  };

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      className={className}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={() =>
        setPosition({ x: 0, y: 0 })
      }
      animate={
        reduceMotion
          ? { x: 0, y: 0 }
          : position
      }
      whileTap={
        reduceMotion
          ? undefined
          : { scale: 0.96 }
      }
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 18,
      }}
    >
      {children}
    </motion.a>
  );
}
