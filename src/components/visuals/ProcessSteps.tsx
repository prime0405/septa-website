import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useRollCycle } from "../../lib/useRollCycle";
import { RollTicks } from "../ui/AutoRollList";

export type ProcessStep = { title: string; detail: string; icon?: ReactNode; note?: string };

/** Numbered delivery process rail, used on the service, About and product pages. */
export function ProcessSteps({
  steps,
  className,
  columns = 3,
  caption,
  autoRoll = false,
  interval = 3400,
}: {
  steps: ProcessStep[];
  className?: string;
  columns?: 2 | 3 | 4;
  caption?: string;
  /** Walk the rail one cell at a time, stopping under a pointer or a keyboard. */
  autoRoll?: boolean;
  interval?: number;
}) {
  const { reduce, active, cycle, frozen, advance, ref, hoverProps } = useRollCycle(steps.length);
  const rolling = autoRoll && !reduce;

  return (
    <div
      ref={rolling ? ref : undefined}
      data-roll-paused={rolling && frozen ? "true" : undefined}
      className={className}
      {...(rolling ? hoverProps : {})}
    >
      <ol
        className={cn(
          "relative grid gap-px overflow-hidden rounded-card border border-line bg-line",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {steps.map((s, i) => {
          const lit = rolling && i === active;
          return (
            <li
              key={s.title}
              className={cn(
                "group relative p-5 transition-colors duration-500",
                rolling ? (lit ? "bg-surface-raised" : "bg-surface") : "bg-surface-raised hover:bg-surface",
              )}
            >
              {rolling ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 top-0 h-[2px] origin-left bg-mint transition-transform duration-500 ease-out",
                    lit ? "scale-x-100" : "scale-x-0",
                  )}
                />
              ) : null}
              <div className="mb-3 flex items-center gap-3">
                <span
                  className={cn(
                    "font-mono text-[0.7rem] tracking-[0.2em] transition-colors",
                    lit ? "text-mint" : "text-mint/70",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="h-px flex-1 bg-gradient-to-r from-line to-transparent transition-colors group-hover:from-mint/40"
                />
                {s.icon ? <span className="text-muted group-hover:text-mint">{s.icon}</span> : null}
              </div>
              <h3 className="text-[1.02rem]">{s.title}</h3>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{s.detail}</p>
              {s.note ? (
                <p className="mt-3 border-t border-line-soft pt-2.5 font-mono text-[0.74rem] text-faint">
                  {s.note}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
      {rolling ? (
        <RollTicks
          className="mt-3"
          count={steps.length}
          active={active}
          cycle={cycle}
          interval={interval}
          advance={advance}
        />
      ) : null}
      {caption ? (
        <p className="mt-3 text-[0.8rem] text-faint" aria-hidden>
          {caption}
        </p>
      ) : null}
    </div>
  );
}
