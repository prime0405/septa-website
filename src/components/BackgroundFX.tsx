import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { bgThemeFor, filmForTheme, motionForTheme, plateForTheme } from "../lib/bgThemes";
import { WallMotion } from "./visuals/WallMotion";

/**
 * The site-wide moving backdrop, in two layers that answer to different rules.
 *
 * `bgfx-wash` is colour: a drifting plate, two soft orbs, a beam that crosses every so often, and a
 * slow grid. It sits behind everything and is masked so that most of it lands in the gutters beside
 * the reading column. The plate is a still on most pages and a generated film where a theme supplies
 * one. `bgfx-mesh` is the live line art on top of it, whose subject changes with the page; it is the
 * one layer allowed to pass over the text, held at a fixed 16% so the smallest label on the site
 * still clears AA where a stroke crosses a chip.
 *
 * Everything here is decorative and pointer-transparent. The canvas caps its work by area, holds at
 * ~30fps, stops when the tab is hidden, and never starts under `prefers-reduced-motion`, where the
 * film likewise falls back to its own still.
 */
export function BackgroundFX() {
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const theme = bgThemeFor(pathname);
  const plate = plateForTheme(theme);
  const motion = motionForTheme(theme);
  const film = filmForTheme(theme);
  const depthRef = useRef<HTMLDivElement>(null);

  // Scroll-linked depth: each sheet drifts at its own rate as the page moves.
  useEffect(() => {
    if (reduce) return;
    const host = depthRef.current;
    if (!host) return;
    let frame = 0;
    const write = () => {
      frame = 0;
      const y = window.scrollY;
      host.style.setProperty("--bgfx-slow", `${(-y * 0.035).toFixed(1)}px`);
      host.style.setProperty("--bgfx-fast", `${(-y * 0.09).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [reduce]);

  return (
    <>
      <div
        ref={depthRef}
        aria-hidden
        data-bg={theme}
        className="bgfx bgfx-wash pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* The per-page gradient sheets. They paint first, so the plate, grid, beam and orbs sit on
            top of them and the whole wash still runs under the same mirror mask. */}
        <div className="bgfx-sheet bgfx-sheet-a" />
        <div className="bgfx-sheet bgfx-sheet-b" />
        <div
          className="absolute inset-[-8%]"
          style={{ transform: "translate3d(0, var(--bgfx-slow, 0), 0)" }}
        >
          <div className="bgfx-plate size-full">
            {film && !reduce ? (
              <WallFilm key={film} src={film} poster={plate} />
            ) : (
              <img
                key={plate}
                src={plate}
                alt=""
                decoding="async"
                className="bgfx-plate-swap size-full object-cover opacity-[0.55]"
              />
            )}
          </div>
        </div>
        <div className="absolute inset-[-4%]" style={{ transform: "translate3d(0, var(--bgfx-fast, 0), 0)" }}>
          <div className="grid-bg bgfx-grid size-full opacity-[0.16]" />
        </div>
        <div className="bgfx-beam absolute inset-y-[-30%] left-0 w-[46%]" />
        <div className="bgfx-orb bgfx-orb-a" />
        <div className="bgfx-orb bgfx-orb-b" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>
      <WallMotion mode={motion} />
    </>
  );
}

/**
 * A generated film in the plate slot, replacing the still rather than sitting on top of it, so the
 * wash keeps one plate layer and the contrast model is untouched.
 *
 * The still is the poster, which is what a visitor sees before the first frame decodes and what the
 * reduced-motion path renders. Playback follows the tab instead of the `autoplay` attribute: a
 * wallpaper that keeps decoding in a background tab buys nothing and costs battery.
 */
function WallFilm({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => {
      if (document.hidden) el.pause();
      else el.play().catch(() => undefined);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="auto"
      className="bgfx-plate-swap size-full object-cover opacity-[0.55]"
    />
  );
}
