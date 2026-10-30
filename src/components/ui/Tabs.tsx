import { useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/cn";

export type Tab = { id: string; label: string; icon?: ReactNode; content: ReactNode };

export function Tabs({ tabs, className }: { tabs: Tab[]; className?: string }) {
  const group = useId();
  const [active, setActive] = useState(tabs[0]?.id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === active);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(tabs[next].id);
    refs.current[tabs[next].id]?.focus();
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Section views"
        onKeyDown={onKeyDown}
        className="flex gap-1 overflow-x-auto rounded-pill border border-line bg-ink-raised p-1"
      >
        {tabs.map((t) => {
          const selected = t.id === current?.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              role="tab"
              type="button"
              id={`${group}-tab-${t.id}`}
              tabIndex={selected ? 0 : -1}
              aria-selected={selected}
              aria-controls={`${group}-panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={cn(
                "relative shrink-0 rounded-pill px-4 py-2 text-[0.85rem] font-medium whitespace-nowrap transition-colors",
                selected ? "text-brand-pearl" : "text-muted hover:text-fg",
              )}
            >
              {selected ? (
                <motion.span
                  layoutId={`${group}-pill`}
                  className="absolute inset-0 rounded-pill bg-brand-teal"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative z-10 flex items-center gap-1.5">
                {t.icon}
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${group}-panel-${t.id}`}
          aria-labelledby={`${group}-tab-${t.id}`}
          tabIndex={0}
          hidden={t.id !== current?.id}
          className="pt-5 focus-visible:outline-offset-4"
        >
          {t.id === current?.id ? t.content : null}
        </div>
      ))}
    </div>
  );
}
