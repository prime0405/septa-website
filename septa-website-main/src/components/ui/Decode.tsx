import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useIntroHeld } from "../../lib/intro";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\|+*<>#%";

/** Milliseconds each character takes to lock in, and how long it scrambles before the first one lands. */
const PER_CHAR_MS = 34;
const LEAD_MS = 170;

/**
 * The scramble-decode used by every section label: glyphs churn, then resolve left to
 * right once the line scrolls into view.
 *
 * The real text is always in the DOM and always the thing that reserves the width; only
 * the animated copy on top of it changes. That keeps screen readers reading the label
 * rather than the noise, and keeps the line from jittering, which it could otherwise do
 * because this sits inside a flex row with a hairline before it.
 */
export function Decode({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const held = useIntroHeld();
  const inView = useInView(ref, { once: true, margin: "-30px 0px -30px 0px" });
  const [scrambled, setScrambled] = useState<string | null>(null);

  useEffect(() => {
    if (reduce || held || !inView) return;
    const chars = [...text];
    const total = chars.length * PER_CHAR_MS + LEAD_MS;
    let frame = 0;
    let began = 0;
    let painted = 0;

    const tick = (now: number) => {
      began ||= now;
      const elapsed = now - began;
      if (now - painted > 26) {
        painted = now;
        let out = "";
        for (let i = 0; i < chars.length; i += 1) {
          const c = chars[i];
          if (c === " " || c === "·" || c === "•") out += c;
          else out += elapsed > i * PER_CHAR_MS + LEAD_MS ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        setScrambled(out);
      }
      if (elapsed < total) frame = requestAnimationFrame(tick);
      else setScrambled(null);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, held, reduce, text]);

  return (
    <span ref={ref} className="relative">
      <span className={scrambled ? "opacity-0" : undefined}>{text}</span>
      {scrambled ? (
        <span aria-hidden className="absolute top-0 left-0 whitespace-pre">
          {scrambled}
        </span>
      ) : null}
    </span>
  );
}
