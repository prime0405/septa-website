import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/cn";
import { useRollCycle } from "../../lib/useRollCycle";

type Item = { label: string; detail?: string };

const toRows = (items: (string | Item)[]) =>
  items.map((i) => (typeof i === "string" ? { label: i } : i));

/**
 * The one interval bar shared by the rolling lists: `count` segments, and the active one fills over
 * exactly one interval. When the fill ends it asks the owner to advance, which is what keeps the
 * bar and the jump in step, and `animation-play-state` (driven by `data-roll-paused` further up the
 * tree) is the only pause mechanism.
 */
export function RollTicks({
  count,
  active,
  cycle,
  interval,
  advance,
  className,
}: {
  count: number;
  active: number;
  cycle: number;
  interval: number;
  advance: () => void;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("flex gap-1.5", className)}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-line">
          {i === active ? (
            <span
              key={`${active}-${cycle}`}
              className="roll-fill absolute inset-0 bg-mint"
              style={{ "--roll-interval": `${interval}ms` } as CSSProperties}
              onAnimationEnd={advance}
            />
          ) : null}
        </span>
      ))}
    </div>
  );
}

/**
 * A list that walks itself: one line lit at a time, a rail that glides down to the next, and a full
 * stop the moment a pointer or a keyboard lands on it. Every line stays in the DOM the whole time,
 * so nothing is hidden from a reader or a search engine — only de-emphasised.
 */
export function AutoRollList({
  items,
  interval = 3000,
  className,
}: {
  items: (string | Item)[];
  interval?: number;
  className?: string;
}) {
  const rows = toRows(items);
  const reduce = useReducedMotion();
  const { active, cycle, frozen, advance, ref, hoverProps } = useRollCycle(rows.length);
  const [rail, setRail] = useState({ y: 0, h: 0 });
  const ulRef = useRef<HTMLUListElement>(null);

  // The rail has to land on the lit row whatever the copy wraps to, so it is measured, not guessed.
  useEffect(() => {
    if (reduce) return;
    const ul = ulRef.current;
    const row = ul?.children[active] as HTMLElement | undefined;
    if (!ul || !row) return;
    const measure = () => {
      const a = row.getBoundingClientRect();
      const b = ul.getBoundingClientRect();
      setRail({ y: a.top - b.top, h: a.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ul);
    return () => ro.disconnect();
  }, [active, reduce, rows.length]);

  if (reduce) {
    return (
      <ul className={cn("space-y-3", className)}>
        {rows.map((it) => (
          <li key={it.label}>
            <span className="block text-[0.98rem] text-fg">{it.label}</span>
            {it.detail ? (
              <span className="mt-1 block text-[0.86rem] leading-relaxed text-muted">
                {it.detail}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      ref={ref}
      data-roll-paused={frozen ? "true" : undefined}
      className={cn("relative", className)}
      {...hoverProps}
    >
      <ul ref={ulRef} className="relative space-y-1.5 pl-6">
        <motion.span
          aria-hidden
          className="absolute top-0 left-0 w-[2px] rounded-full bg-mint"
          initial={false}
          animate={{ y: rail.y, height: rail.h }}
          transition={{ type: "spring", stiffness: 210, damping: 26 }}
          style={{ opacity: rail.h ? 1 : 0 }}
        />
        {rows.map((it, i) => (
          <li
            key={it.label}
            className={cn(
              "-ml-1 rounded-lg px-2 py-1.5 transition-colors duration-500 ease-out",
              i === active ? "bg-mint/[0.06]" : "bg-transparent",
            )}
          >
            <span
              className={cn(
                "block text-[0.98rem] transition-colors duration-500",
                i === active ? "text-mint" : "text-fg",
              )}
            >
              {it.label}
            </span>
            {it.detail ? (
              <span className="mt-1 block text-[0.86rem] leading-relaxed text-muted">
                {it.detail}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      <RollTicks
        className="mt-5 pl-6"
        count={rows.length}
        active={active}
        cycle={cycle}
        interval={interval}
        advance={advance}
      />
    </div>
  );
}
