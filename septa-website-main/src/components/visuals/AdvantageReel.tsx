import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { Brain, Layers, RefreshCw, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { advantagePillars } from "../../data/content";
import { cn } from "../../lib/cn";
import { useRollCycle } from "../../lib/useRollCycle";
import { RollTicks } from "../ui/AutoRollList";

/*
 * The label above the active advantage. Each phrase is a substring of that pillar's own supplied
 * sentence, so the reel can classify a point without saying anything the company document does not.
 */
const labels: Record<string, string> = {
  "Intelligent by Design": "AI-driven solutions",
  "Built to Scale": "Designed to grow",
  "Human-Centered Technology": "Human insight",
  "Delivery You Can Trust": "Agile execution",
  "Proactive, End-to-End Support": "End-to-end support",
};

const icons: Record<string, LucideIcon> = {
  "Intelligent by Design": Brain,
  "Built to Scale": Layers,
  "Human-Centered Technology": Users,
  "Delivery You Can Trust": ShieldCheck,
  "Proactive, End-to-End Support": RefreshCw,
};

const INTERVAL = 5000;
const pad = (n: number) => String(n).padStart(2, "0");

function IconTile({ title, className }: { title: string; className?: string }) {
  const Icon = icons[title];
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl border border-mint/25 bg-mint/[0.07] text-mint",
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={1.5} aria-hidden />
    </span>
  );
}

/**
 * The Septa Advantage as a reel: five advantages down the left, the one in focus written out on the
 * right, and an unhurried walk through the set that never needs the visitor's help to start.
 *
 * A pointer or a keyboard over the list stops the walk and takes it to the row being read, so hovering
 * an advantage shows that advantage rather than the one the timer was about to reach. Leaving the list
 * resumes on the row that was selected, because selecting remounts the interval fill — the advantage
 * that was just read gets its own full interval instead of the leftover fraction of the previous one.
 *
 * The `RollTicks` fill is the only clock. The bar across the top of the lit row is decoration that
 * shares its key, so both are wound and paused together by `data-roll-paused` on the wrapper.
 */
export function AdvantageReel() {
  const rows = advantagePillars;
  const { reduce, active, cycle, frozen, advance, select, hoverable, ref, hoverProps } =
    useRollCycle(rows.length);

  if (reduce) {
    return (
      <ul className="grid gap-3 sm:grid-cols-2">
        {rows.map((p, i) => (
          <li key={p.title} className="card px-5 py-4">
            <span className="flex items-start gap-4">
              <IconTile title={p.title} />
              <span>
                <span className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[0.7rem] tracking-[0.16em] text-faint">
                    {pad(i + 1)}
                  </span>
                  <span className="text-[1.02rem] font-medium">{p.title}</span>
                </span>
                <span className="mt-1.5 block text-[0.86rem] leading-relaxed text-muted">
                  {p.detail}
                </span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    );
  }

  const current = rows[active];

  return (
    <div
      ref={ref}
      data-roll-paused={frozen ? "true" : undefined}
      className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-10"
    >
      {/* On a phone the panel comes first, so the advantage being read is on screen while the list
          below it is being tapped. */}
      <div className="card relative overflow-hidden p-6 sm:p-7 lg:order-2">
        {/* Remounting on the advantage is what plays the swap, and the box stays in flow the whole
            time, so the card never collapses into a height jump between rows. The footer sits
            outside this wrapper because `RollTicks` is the clock. */}
        <motion.div
          key={current.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-4">
            <IconTile title={current.title} className="size-12" />
            <p className="font-mono text-[0.7rem] tracking-[0.18em] text-faint uppercase">
              {labels[current.title]}
            </p>
          </div>
          <h3 className="mt-6 text-[1.35rem] leading-snug sm:text-[1.5rem]">{current.title}</h3>
          <p className="mt-3 min-h-13 text-[0.95rem] leading-relaxed text-muted">{current.detail}</p>
        </motion.div>
        <div className="mt-6 flex items-center justify-between gap-6 border-t border-line-soft pt-5">
          <p className="font-mono text-[0.72rem] text-faint">
            Advantage {pad(active + 1)} of {pad(rows.length)}
          </p>
          <RollTicks
            className="w-28 shrink-0"
            count={rows.length}
            active={active}
            cycle={cycle}
            interval={INTERVAL}
            advance={advance}
          />
        </div>
      </div>

      <ul className="space-y-2.5 lg:order-1" {...hoverProps}>
        {rows.map((p, i) => {
          const lit = i === active;
          return (
            <li key={p.title}>
              <button
                type="button"
                aria-current={lit ? "true" : undefined}
                onPointerEnter={() => hoverable && select(i)}
                onFocus={() => select(i)}
                onClick={() => select(i)}
                className={cn(
                  "relative w-full overflow-hidden rounded-card border px-4 py-4 text-left transition-colors duration-500 ease-out sm:px-5",
                  lit ? "border-mint/40 bg-mint/[0.05]" : "border-line bg-surface hover:border-mint/25",
                )}
              >
                <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-line">
                  {lit ? (
                    <span
                      key={`${active}-${cycle}`}
                      className="roll-fill absolute inset-0 bg-mint"
                      style={{ "--roll-interval": `${INTERVAL}ms` } as CSSProperties}
                    />
                  ) : null}
                </span>
                <span className="flex items-start gap-4">
                  <IconTile title={p.title} className={lit ? undefined : "opacity-70"} />
                  <span className="min-w-0">
                    <span className="flex items-baseline gap-2.5">
                      <span
                        className={cn(
                          "font-mono text-[0.7rem] tracking-[0.16em] transition-colors duration-500",
                          lit ? "text-mint" : "text-faint",
                        )}
                      >
                        {pad(i + 1)}
                      </span>
                      <span
                        className={cn(
                          "text-[1.02rem] font-medium transition-colors duration-500",
                          lit ? "text-mint-deep" : "text-fg",
                        )}
                      >
                        {p.title}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-[0.85rem] leading-relaxed text-muted">
                      {p.detail}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
