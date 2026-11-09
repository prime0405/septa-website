import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { IntroCurtain } from "../IntroCurtain";
import { BackgroundFX } from "../BackgroundFX";
import { CursorHalo } from "../ui/CursorHalo";
import { cn } from "../../lib/cn";
import { armIntro, endIntro, useIntroHeld } from "../../lib/intro";

function useScrollReset() {
  const { pathname, hash } = useLocation();
  // A layout effect, so the reset lands before anything that reads the page on navigation. The
  // wallpaper selector works out which section is under the eye from scroll position, and its effect
  // is a passive one inside a child; with a passive reset here it would have measured the page
  // visitor just left, at the position they just left it, and tinted the backdrop for that.
  useLayoutEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    // `instant`, not `auto`: `auto` means "follow the CSS", and the global `scroll-behavior: smooth`
    // turns a route reset into a scroll that takes the visitor back up the page they just left. Every
    // section on the way has its own wallpaper, so the backdrop re-tints twice on the way to the new
    // page's own theme and then again when it lands. One frame, one change.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);
}

function BackToTop() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 720);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          type="button"
          key="back-to-top"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: reduce ? 0 : 0.22 }}
          onClick={() =>
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
          }
          aria-label="Back to top"
          className="fixed right-[max(1.25rem,env(safe-area-inset-right))] bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 flex size-11 items-center justify-center rounded-full border border-line bg-surface/90 text-muted backdrop-blur-sm transition-colors hover:border-mint/50 hover:text-mint"
        >
          <ArrowUp className="size-4.5" aria-hidden />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

export function Layout() {
  useScrollReset();
  const { pathname } = useLocation();
  // Decided during this render so the homepage below can see the curtain is already held.
  const [showIntro, setShowIntro] = useState(() => pathname === "/" && armIntro());
  const held = useIntroHeld();

  useEffect(() => {
    if (pathname !== "/") endIntro();
  }, [pathname]);

  // Stable so the curtain's timing effect is never restarted while the panels are on screen.
  const finishIntro = useCallback(() => setShowIntro(false), []);

  // `held` is what stops a curtain that was interrupted by navigation from replaying
  // when the visitor comes back to the homepage in the same session. The page wrapper is
  // inert while it runs so nothing behind the panels can take focus; the curtain itself
  // stays outside that wrapper, because inert would swallow its click-to-skip too.
  return (
    <>
      <div className="flex min-h-dvh flex-col" inert={showIntro && held}>
        <BackgroundFX />
        <Nav />
        <main
          id="main"
          className={cn(
            "relative z-10 flex-1",
            // The homepage hero is a charcoal field and the header is transparent at the top of it,
            // which only reads as one continuous surface if the field actually reaches y=0. Without
            // the pull-up the header keeps its own 72px of layout height, the hero starts under it,
            // and the nav sits on a white strip with white links on it. The extra 1px is the
            // header's bottom rule: its border-box is 73px, so 72 leaves a hair of page white above
            // the field at every width.
            pathname === "/" && "-mt-[73px]",
          )}
        >
          <Outlet />
        </main>
        <Footer />
        <BackToTop />
      </div>
      {showIntro && held && pathname === "/" ? <IntroCurtain onDone={finishIntro} /> : null}
      <CursorHalo />
    </>
  );
}
