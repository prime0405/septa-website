import { useSyncExternalStore } from "react";

const STORED_KEY = "septa:intro-seen";

let running = false;
let armed: boolean | null = null;
const settled = new Set<() => void>();

/**
 * Decide, once per browser session, whether to play the welcome curtain. The decision
 * is memoised because React may run the initialiser twice under StrictMode, and a
 * curtain that arms twice never plays.
 *
 * It is skipped for anyone who asked for reduced motion, and skipped when the tab is
 * not visible, because a curtain nobody watched opening is still a page that took two
 * seconds to appear.
 */
export function armIntro(): boolean {
  if (armed !== null) return armed;
  if (typeof window === "undefined") return (armed = false);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return (armed = false);
  if (document.visibilityState !== "visible") return (armed = false);
  try {
    if (sessionStorage.getItem(STORED_KEY)) return (armed = false);
    sessionStorage.setItem(STORED_KEY, "1");
  } catch {
    // Private mode throws on storage: play the intro, just don't remember it.
  }
  running = true;
  armed = true;
  return armed;
}

export function endIntro() {
  armed = false;
  if (!running) return;
  running = false;
  for (const listener of settled) listener();
  settled.clear();
}

/**
 * `false` while the curtain still covers the page. Entrance animations subscribe so
 * they begin as the homepage is revealed rather than burning themselves out behind it.
 */
export function useIntroHeld() {
  return useSyncExternalStore(subscribeIntroHeld, isIntroHeld, isIntroHeldServer);
}

function subscribeIntroHeld(onChange: () => void) {
  settled.add(onChange);
  return () => {
    settled.delete(onChange);
  };
}

function isIntroHeld() {
  return running;
}

function isIntroHeldServer() {
  return false;
}
