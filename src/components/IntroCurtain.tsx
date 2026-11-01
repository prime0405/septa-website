import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "./layout/Logo";
import { endIntro } from "../lib/intro";

/** How long the curtain stays shut, and how long the panels take to part. */
const HOLD_MS = 1150;
const PART_MS = 900;

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

/**
 * The welcome curtain: two Black Pearl panels over the homepage that split apart to
 * reveal the site. Shown once per browser session, never under `prefers-reduced-motion`,
 * and dismissible with a click or Escape.
 *
 * It is deliberately driven by CSS transitions and timers rather than an animation
 * loop, so a background tab still finishes and uncovers the page on schedule.
 */
export function IntroCurtain({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const timers = useRef<number[]>([]);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    for (const t of timers.current) window.clearTimeout(t);
    endIntro();
    onDone();
  }, [onDone]);

  /** Part the panels, then release the page once they have nearly cleared. */
  const skip = useCallback(() => {
    if (finished.current) return;
    setOpen(true);
    timers.current.push(window.setTimeout(finish, PART_MS * 0.4));
  }, [finish]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t1 = window.setTimeout(() => setDrawn(true), 120);
    const t2 = window.setTimeout(() => setOpen(true), HOLD_MS);
    const t3 = window.setTimeout(finish, HOLD_MS + PART_MS + 60);
    timers.current = [t1, t2, t3];

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      for (const t of timers.current) window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      endIntro();
    };
  }, [finish, skip]);

  const panel =
    "absolute top-0 bottom-0 w-1/2 bg-brand-pearl will-change-transform";

  return (
    <div
      aria-hidden
      onClick={skip}
      className="fixed inset-0 z-[70] overflow-hidden"
      style={{ cursor: open ? "default" : "pointer" }}
    >
      <div
        className={`${panel} left-0 border-r border-brand-teal/25`}
        style={{
          transform: open ? "translate3d(-100%,0,0)" : "translate3d(0,0,0)",
          transition: `transform ${PART_MS}ms ${EASE}`,
        }}
      />
      <div
        className={`${panel} right-0 border-l border-brand-teal/25`}
        style={{
          transform: open ? "translate3d(100%,0,0)" : "translate3d(0,0,0)",
          transition: `transform ${PART_MS}ms ${EASE}`,
        }}
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6"
        style={{
          opacity: open ? 0 : 1,
          transform: open ? "translateY(-14px)" : "translateY(0)",
          transition: `opacity 380ms ease, transform 380ms ease`,
        }}
      >
        <Logo className="size-10 text-brand-white" />
        <p className="font-display text-center text-[clamp(1.6rem,4.6vw,2.6rem)] leading-tight text-brand-white">
          Welcome to Septa
        </p>
        <span
          className="block h-px bg-brand-teal"
          style={{
            width: drawn ? "clamp(120px, 22vw, 210px)" : "0px",
            transition: `width 700ms ${EASE} 120ms`,
          }}
        />
        <p className="font-mono text-[0.66rem] tracking-[0.22em] text-brand-teal uppercase">
          {open ? "" : "click or press esc to skip"}
        </p>
      </div>
    </div>
  );
}
