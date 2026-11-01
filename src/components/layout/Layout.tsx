import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { IntroCurtain } from "../IntroCurtain";
import { armIntro, endIntro, useIntroHeld } from "../../lib/intro";

function useScrollReset() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
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
          className="fixed right-5 bottom-5 z-40 flex size-11 items-center justify-center rounded-full border border-line bg-surface/90 text-muted backdrop-blur-sm transition-colors hover:border-mint/50 hover:text-mint"
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

  // `held` is what stops a curtain that was interrupted by navigation from replaying
  // when the visitor comes back to the homepage in the same session. The page wrapper is
  // inert while it runs so nothing behind the panels can take focus; the curtain itself
  // stays outside that wrapper, because inert would swallow its click-to-skip too.
  return (
    <>
      <div className="flex min-h-dvh flex-col bg-ink" inert={showIntro && held}>
        <Nav />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <BackToTop />
      </div>
      {showIntro && held && pathname === "/" ? (
        <IntroCurtain onDone={() => setShowIntro(false)} />
      ) : null}
    </>
  );
}
