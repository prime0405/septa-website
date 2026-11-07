import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "../../data/content";
import { paths } from "../../lib/paths";
import { cn } from "../../lib/cn";
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

/** The initial the badge carries: the first letter of the client name already on the use-case record. */
const letterOf = (org: string) => org.trim().charAt(0).toUpperCase();

/**
 * The client testimonial section: a ring of selectable clients on the left and one long quote on the
 * right, in the shape of the reference Septa supplied.
 *
 * There are no photographs to put in the ring and no individual names in the source material, so the
 * selection system is built out of type instead: the client's initial in a disc, the client's name
 * under it, and the ring itself drawn as the dashed orbit those discs sit on. The centre holds the
 * initial of whoever is selected, which is what makes the active choice readable from across the room
 * without a highlight colour doing all the work.
 *
 * Selecting is a click, never a hover — a pointer crossing the ring on its way to the nav would
 * otherwise rewrite the quote out from under the reader. Keyboard follows the tab pattern: arrows move
 * the selection and the focus together, Home and End jump to the ends, and only the selected node is
 * in the tab order.
 *
 * The four quotes share one grid cell, so the section is as tall as the longest one and changing
 * selection never resizes the page underneath the reader. See `.tpanel` in `src/index.css`.
 */
export function TestimonialOrbit() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number, moveFocus = false) => {
    const next = (index + testimonials.length) % testimonials.length;
    setActive(next);
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
        role="tablist"
        aria-label="Client testimonials"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="orbit lg:my-6"
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
        <div aria-hidden className="orbit-runner pointer-events-none absolute inset-[9%] hidden lg:block">
          <span className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-teal/70" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 hidden size-[6.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-mint/25 bg-surface-raised shadow-soft lg:grid"
        >
          {testimonials.map((t, i) => (
            <span
              key={t.org}
              className={cn(
                "absolute font-display text-[2.15rem] leading-none transition-opacity duration-300",
                i === active ? "text-mint opacity-100" : "text-faint opacity-0",
              )}
            >
              {letterOf(t.org)}
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
                      ? "border-mint/45 bg-surface-raised"
                      : "border-line bg-ink-raised group-hover:border-brand-teal/70",
                  )}
                />
                <span
                  className={cn(
                    "relative font-display text-[1.3rem] leading-none transition-colors duration-300 lg:text-[1.5rem]",
                    on ? "text-mint" : "text-faint group-hover:text-muted",
                  )}
                >
                  {letterOf(t.org)}
                </span>
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
                  <span className="flex h-11 shrink-0 items-center rounded-xl bg-brand-pearl px-3.5">
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
