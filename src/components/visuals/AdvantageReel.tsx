import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BadgeCheck, Brain, Layers, RefreshCw, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { advantagePillars } from "../../data/content";
import { cn } from "../../lib/cn";

const labels: Record<string, string> = {
  "Intelligent by Design": "AI-driven solutions",
  "Built to Scale": "Designed to grow",
  "Human-Centered Technology": "Human insight",
  "Delivery You Can Trust": "Agile execution",
  "Proactive, End-to-End Support": "End-to-end support",
  "Stronger Brand Recognition": "A consistent brand experience",
};

const icons: Record<string, LucideIcon> = {
  "Intelligent by Design": Brain,
  "Built to Scale": Layers,
  "Human-Centered Technology": Users,
  "Delivery You Can Trust": ShieldCheck,
  "Proactive, End-to-End Support": RefreshCw,
  "Stronger Brand Recognition": BadgeCheck,
};

const pad = (n: number) => String(n).padStart(2, "0");

function IconTile({ title, className }: { title: string; className?: string }) {
  const Icon = icons[title] ?? BadgeCheck;
  return (
    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl border border-mint/25 bg-mint/[0.07] text-mint", className)}>
      <Icon className="size-5" strokeWidth={1.5} aria-hidden />
    </span>
  );
}

/** The advantage content reveals once as the visitor scrolls into the section. */
export function AdvantageReel() {
  const rows = advantagePillars;
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = rows[active] ?? rows[0];

  const reveal = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.65, ease: [0.22, 1, 0.36, 1], staggerChildren: reduce ? 0 : 0.1 } },
  };
  const itemReveal = {
    hidden: { opacity: 0, y: reduce ? 0 : 18, scale: reduce ? 1 : 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-10"
    >
      <motion.div variants={itemReveal} className="card relative overflow-hidden p-6 sm:p-7 lg:order-2">
        <motion.div
          key={current?.title}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          {current ? <>
            <div className="flex items-center gap-4">
              <IconTile title={current.title} className="size-12" />
              <p className="font-mono text-[0.7rem] tracking-[0.18em] text-faint uppercase">{labels[current.title]}</p>
            </div>
            <h3 className="mt-6 text-[1.35rem] leading-snug sm:text-[1.5rem]">{current.title}</h3>
            <p className="mt-3 min-h-13 text-[0.95rem] leading-relaxed text-muted">{current.detail}</p>
          </> : null}
        </motion.div>
        <div className="mt-6 flex items-center justify-between gap-6 border-t border-line-soft pt-5">
          <p className="font-mono text-[0.72rem] text-faint">Advantage {pad(active + 1)} of {pad(rows.length)}</p>
          <span className="font-mono text-[0.7rem] tracking-[0.14em] text-mint">EXPLORE THE DIFFERENCE</span>
        </div>
      </motion.div>

      <ul className="space-y-2.5 lg:order-1">
        {rows.map((p, i) => {
          const lit = i === active;
          return (
            <motion.li key={p.title} variants={itemReveal}>
              <button
                type="button"
                aria-pressed={lit}
                onClick={() => setActive(i)}
                className={cn(
                  "relative w-full overflow-hidden rounded-card border px-4 py-4 text-left transition-colors duration-300 sm:px-5",
                  lit ? "border-mint/40 bg-mint/[0.06]" : "border-line bg-surface hover:border-mint/25",
                )}
              >
                <span className="flex items-start gap-4">
                  <IconTile title={p.title} className={lit ? undefined : "opacity-70"} />
                  <span className="min-w-0">
                    <span className="flex items-baseline gap-2.5">
                      <span className={cn("font-mono text-[0.7rem] tracking-[0.16em]", lit ? "text-mint" : "text-faint")}>{pad(i + 1)}</span>
                      <span className={cn("text-[1.02rem] font-medium", lit ? "text-mint-deep" : "text-fg")}>{p.title}</span>
                    </span>
                    <span className="mt-1.5 block text-[0.85rem] leading-relaxed text-muted">{p.detail}</span>
                  </span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}
