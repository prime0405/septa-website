import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "../../data/content";
import { paths } from "../../lib/paths";
import { cn } from "../../lib/cn";
import { useAutoPause } from "../../lib/useRollCycle";
import { ArrowLink, Pill } from "../ui/primitives";

/* The nodes sit on a circle, so the dashed path is drawn through them rather than under them. At 29%
   off the centre line on both axes the radius is 29·√2 = 41% of the box, which is the number the SVG
   and the travelling dot both use. */
const R = 41;
const IN = 50 - R / Math.SQRT2;
const OUT = 50 + R / Math.SQRT2;
const SLOTS = [
  { x: `${IN}%`, y: `${IN}%` },
  { x: `${OUT}%`, y: `${IN}%` },
  { x: `${IN}%`, y: `${OUT}%` },
  { x: `${OUT}%`, y: `${OUT}%` },
];

/** Where each node sits on the dot's own clock face: degrees clockwise from twelve. */
const NODE_ANGLE = [315, 45, 225, 135];
/** The same four indices in the order the dot reaches them, starting from the first one it passes. */
const ORDER = [1, 3, 2, 0];
/** One full lap. A quarter of it — six seconds — is how long each client holds the quote. */
const LAP = 24_000;
/** Degrees per millisecond when the dot is travelling to a node someone chose by hand. */
const SEEK = 0.4;

/** Below `lg` the ring is a swipe strip with no dot on it, so there is nothing to run the clock. */
function useOrbitLayout() {
  const [wide, setWide] = useState(() => window.matchMedia("(min-width: 1024px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
}

/**
 * The client testimonial section: a ring of clients on the left and one long quote on the right.
 *
 * The dot is the clock. It used to run its own 22-second lap as scenery while the quote changed only
 * when someone clicked, which meant the two things in the ring were telling different stories. Now
 * the angle is the single source of truth: the dot's position is advanced one frame at a time, the
 * client it has most recently passed is derived from that angle, and the quote follows. When the dot
 * reaches a logo, that logo's testimonial is the one on screen — exactly, and not on a timer that
 * happens to be about the same length.
 *
 * Choosing by hand does not stop the dot, it steers it. A click, an arrow key or a step button sets
 * the quote immediately and sends the dot round the shorter arc to the node that was chosen, so the
 * ring never shows one client selected while the dot is standing somewhere else. From there it
 * carries on. Hover, keyboard focus, scrolling the ring off screen and reduced motion all freeze the
 * lap (`useAutoPause`, shared with the service grid), because a quote that rewrites itself under
 * someone who is reading it is worse than no animation at all.
 *
 * Three of the four clients have supplied artwork and show it; EHCC has none, so it is set in type
 * rather than given an invented mark. The marks are silhouettes until their node is the active one,
 * which is the same treatment the partner strip uses and for the same reason: four coloured logos in
 * a ring is four competing focal points.
 *
 * The four quotes share one grid cell, so the section is as tall as the longest one and changing
 * selection never resizes the page underneath the reader. See `.tpanel` in `src/index.css`.
 */
export function TestimonialOrbit() {
  const { reduce, frozen, ref, hoverProps } = useAutoPause();
  const wide = useOrbitLayout();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const angle = useMotionValue(NODE_ANGLE[0]);
  const seek = useRef<number | null>(null);
  const still = reduce || !wide;

  // With no lap to run, the dot simply stands at whichever client is selected.
  useEffect(() => {
    if (!still) return;
    seek.current = null;
    angle.set(NODE_ANGLE[active]);
  }, [still, active, angle]);

  useAnimationFrame((_, delta) => {
    // A backgrounded tab hands back a delta of seconds; without the clamp the dot would jump half a
    // lap on the first frame after coming back, taking the quote with it.
    const d = Math.min(delta, 64);
    const target = seek.current;
    if (target !== null) {
      const current = angle.get();
      const arc = (((target - current) % 360) + 540) % 360 - 180;
      const reach = d * SEEK;
      if (Math.abs(arc) <= reach) {
        angle.set(target);
        seek.current = null;
      } else {
        angle.set((current + Math.sign(arc) * reach + 360) % 360);
      }
      return;
    }
    if (frozen || still) return;
    // Kept inside one turn: rotation is periodic, so wrapping costs nothing visually and keeps the
    // shortest-arc arithmetic above honest after any number of laps.
    const next = (angle.get() + (d / LAP) * 360) % 360;
    angle.set(next);
    const reached = ORDER[Math.floor(((((next - 45) % 360) + 360) % 360) / 90)];
    if (reached !== active) setActive(reached);
  });

  const select = (index: number, moveFocus = false) => {
    const next = (index + testimonials.length) % testimonials.length;
    setActive(next);
    if (still) angle.set(NODE_ANGLE[next]);
    else seek.current = NODE_ANGLE[next];
    if (moveFocus) tabs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (step !== undefined) {
      event.preventDefault();
      select(active + step, true);
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      select(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      select(testimonials.length - 1, true);
    }
  };

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-center lg:gap-14 xl:gap-20">
      {/* ------------------------------ the selector ------------------------------ */}
      <div
        ref={ref}
        role="tablist"
        aria-label="Client testimonials"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="orbit lg:my-6"
        {...hoverProps}
      >
        {/* The track, the ring's own focal point and the dot that runs the line are scenery; the nodes
            are the only things in the accessibility tree. */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 hidden size-full lg:block"
        >
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth="1"
            strokeDasharray="1.7 3.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="orbit-path"
          />
        </svg>
        <motion.div
          aria-hidden
          style={{ rotate: angle }}
          className="pointer-events-none absolute inset-[9%] hidden lg:block"
        >
          <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint shadow-[0_0_0_5px_rgb(40_111_106/0.14)]" />
        </motion.div>
        {/* The lit plate takes the ground the selected lockup was drawn for. Halogen's mark is gold
            and Preppod's wordmark is white, so on a white plate the active mark loses the half of
            itself that carries the name; Toviri's is a single dark blue and needs the opposite. One
            fixed ground cannot serve all three, so the plate cross-fades with the mark. */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-1/2 top-1/2 hidden size-[6.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border shadow-soft transition-colors duration-300 lg:grid",
            testimonials[active].knockout
              ? "border-brand-pearl-raised bg-brand-pearl"
              : "border-mint/25 bg-surface-raised",
          )}
        >
          {testimonials.map((t, i) => (
            <span
              key={t.org}
              className={cn(
                "absolute inset-0 grid place-items-center transition-opacity duration-300",
                i === active ? "opacity-100" : "opacity-0",
              )}
            >
              {t.logo ? (
                <img
                  src={t.logo}
                  alt=""
                  decoding="async"
                  data-on="true"
                  className="orbit-mark h-10 w-[4.6rem] object-contain"
                />
              ) : (
                <span className="font-display text-[1.5rem] leading-none tracking-[0.02em] text-mint">
                  {t.org}
                </span>
              )}
            </span>
          ))}
        </div>

        {testimonials.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={t.attribution}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`testimonial-tab-${i}`}
              aria-selected={on}
              aria-controls={`testimonial-panel-${i}`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(i)}
              style={{ "--x": SLOTS[i].x, "--y": SLOTS[i].y } as CSSProperties}
              className="orbit-node group flex flex-col items-center gap-2 text-center lg:gap-2.5"
            >
              <span className="relative grid size-14 shrink-0 place-items-center lg:size-16">
                {on ? (
                  reduce ? (
                    <span className="absolute -inset-1 rounded-full border border-mint/70" />
                  ) : (
                    <motion.span
                      layoutId="testimonial-ring"
                      className="absolute -inset-1 rounded-full border border-mint/70"
                      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )
                ) : null}
                <span
                  className={cn(
                    "absolute inset-0 rounded-full border transition-colors duration-300",
                    on
                      ? t.knockout
                        ? "border-brand-pearl-raised bg-brand-pearl"
                        : "border-mint/45 bg-surface-raised"
                      : "border-line bg-ink-raised group-hover:border-brand-teal/70",
                  )}
                />
                {t.logo ? (
                  <img
                    src={t.logo}
                    alt=""
                    decoding="async"
                    data-on={on ? "true" : "false"}
                    className="orbit-mark relative max-h-6 w-auto max-w-[74%] object-contain lg:max-h-7"
                  />
                ) : (
                  <span
                    aria-hidden
                    className={cn(
                      "relative font-display text-[0.82rem] leading-none tracking-[0.04em] transition-colors duration-300",
                      on ? "text-mint" : "text-faint group-hover:text-muted",
                    )}
                  >
                    {t.org}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "text-[0.72rem] leading-tight transition-colors duration-300",
                  on ? "text-fg" : "text-faint group-hover:text-muted",
                )}
              >
                {t.org}
              </span>
            </button>
          );
        })}
      </div>

      {/* -------------------------------- the quote -------------------------------- */}
      <div className="card mt-8 p-7 sm:p-9 lg:mt-0">
        <Quote className="size-8 text-brand-teal" aria-hidden />
        <div className="mt-5 grid">
          {testimonials.map((t, i) => (
            <article
              key={t.attribution}
              id={`testimonial-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`testimonial-tab-${i}`}
              data-on={i === active ? "1" : "0"}
              inert={i === active ? undefined : true}
              aria-hidden={i === active ? undefined : true}
              className="tpanel"
            >
              {/* The measure is capped in `em`, so it binds where the card is wide for the type —
                  tablet, where a full-bleed panel would otherwise run the line to eighty characters —
                  and gets out of the way at desktop, where the column is already narrower than it. */}
              <blockquote className="max-w-[34em] text-[clamp(1rem,1.35vw,1.2rem)] leading-[1.62] text-muted">
                “{t.quote}”
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                {t.logo ? (
                  <span
                    className={cn(
                      "flex h-11 shrink-0 items-center rounded-xl px-3.5",
                      t.knockout ? "bg-brand-pearl" : "border border-line bg-ink-raised",
                    )}
                  >
                    <img src={t.logo} alt={t.org} decoding="async" className="max-h-6 w-auto" />
                  </span>
                ) : null}
                <span>
                  <span className="block font-display text-[1.05rem] text-fg">{t.attribution}</span>
                  <Pill tone="mint" className="mt-1.5">
                    {t.kind}
                  </Pill>
                </span>
              </div>
              <ArrowLink to={paths.case(t.caseSlug)} className="mt-6">
                Read the {t.org} case study
              </ArrowLink>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-line-soft pt-5">
          <span className="font-mono text-[0.7rem] tracking-[0.18em] text-faint uppercase">
            {String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
          </span>
          <span className="flex gap-2">
            <StepButton label="Previous testimonial" onClick={() => select(active - 1)}>
              <ChevronLeft className="size-4" aria-hidden />
            </StepButton>
            <StepButton label="Next testimonial" onClick={() => select(active + 1)}>
              <ChevronRight className="size-4" aria-hidden />
            </StepButton>
          </span>
        </div>
      </div>
    </div>
  );
}

function StepButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-line bg-surface-raised text-muted transition-colors hover:border-mint/55 hover:text-mint lg:size-9"
    >
      {children}
    </button>
  );
}