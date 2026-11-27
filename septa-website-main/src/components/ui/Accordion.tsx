import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
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
    <div className={cn("divide-y divide-line overflow-hidden rounded-card border border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        const pid = `${group}-panel-${i}`;
        const bid = `${group}-button-${i}`;
        return (
          <div key={item.q} className="bg-surface-raised">
            <h3>
              <button
                id={bid}
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={pid}
                className="flex w-full items-center justify-between gap-6 px-4 py-4 text-left transition-colors hover:bg-surface sm:px-5"
              >
                <span className={cn("text-[0.98rem] font-medium", isOpen ? "text-mint" : "text-fg")}>
                  {item.q}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted transition-transform duration-300",
                    isOpen && "rotate-180 text-mint",
                  )}
                  aria-hidden
                />
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
                  transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-5 text-[0.92rem] leading-relaxed text-muted sm:px-5">
                    {item.a}
                    {item.links?.length ? (
                      <span className="mt-3 flex flex-wrap gap-2">
                        {item.links.map((l) => (
                          <Link
                            key={l.to}
                            to={l.to}
                            className="rounded-pill border border-mint/35 px-3 py-1 text-[0.78rem] text-mint hover:bg-mint/10"
                          >
                            {l.label}
                          </Link>
                        ))}
                      </span>
                    ) : null}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
