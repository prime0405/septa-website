import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus, ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/cn";

export type AccordionItem = { q: string; a: string; links?: { label: string; to: string }[] };

export function Accordion({
  items,
  className,
  defaultOpen = 0,
  single = true,
}: {
  items: AccordionItem[];
  className?: string;
  defaultOpen?: number | null;
  single?: boolean;
}) {
  const group = useId();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number[]>(defaultOpen === null ? [] : [defaultOpen]);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const isOpen = prev.includes(i);
      if (single) return isOpen ? [] : [i];
      return isOpen ? prev.filter((p) => p !== i) : [...prev, i];
    });

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        const pid = `${group}-panel-${i}`;
        const bid = `${group}-button-${i}`;
        return (
          <motion.div
            key={item.q}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "overflow-hidden rounded-2xl border bg-surface-raised transition-[border-color,box-shadow] duration-300",
              isOpen
                ? "border-mint/50 shadow-[0_14px_38px_-28px_rgba(6,24,32,0.42)]"
                : "border-line shadow-[0_8px_24px_-22px_rgba(6,24,32,0.38)]",
            )}
          >
            <h3>
              <button
                id={bid}
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={pid}
                className="group flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5 sm:py-[1.15rem]"
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-xl border font-mono text-[0.68rem] font-semibold transition-colors duration-300",
                    isOpen
                      ? "border-mint/40 bg-mint/10 text-mint"
                      : "border-line bg-ink-raised text-faint",
                  )}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={cn("flex-1 text-[0.95rem] font-semibold leading-snug sm:text-[1rem]", isOpen ? "text-mint" : "text-fg")}>
                  {item.q}
                </span>
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border transition-colors duration-300",
                    isOpen
                      ? "border-mint/30 bg-mint/10 text-mint"
                      : "border-line text-muted group-hover:border-mint/40 group-hover:text-mint",
                  )}
                >
                  <Plus className={cn("size-4 transition-transform duration-300", isOpen && "rotate-45")} aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="body"
                  id={pid}
                  role="region"
                  aria-labelledby={bid}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mx-4 border-t border-line/80 px-1 pb-5 pt-4 text-[0.92rem] leading-relaxed text-muted sm:mx-5 sm:pl-[3.25rem]">
                    <p>{item.a}</p>
                    {item.links?.length ? (
                      <span className="mt-4 flex flex-wrap gap-2">
                        {item.links.map((l) => (
                          <Link
                            key={l.to}
                            to={l.to}
                            className="inline-flex items-center gap-1.5 rounded-pill border border-mint/35 bg-mint/5 px-3 py-1.5 text-[0.78rem] font-medium text-mint transition-colors hover:bg-mint/10"
                          >
                            {l.label}
                            <ArrowUpRight className="size-3.5" aria-hidden />
                          </Link>
                        ))}
                      </span>
                    ) : null}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
