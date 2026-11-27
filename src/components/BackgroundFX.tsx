import { useEffect, useRef, useState } from "react";
import type { Ref } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { bgThemeFor, filmForTheme, motionForTheme, plateForTheme } from "../lib/bgThemes";
import { useActiveWall } from "../lib/useActiveWall";
import { WallMotion } from "./visuals/WallMotion";

/**
 * The moving backdrop for service and request journeys. It follows the section under the visitor's
 * eye, while the homepage and informational routes retain their own existing treatments.
 *
 * `bgfx-wash` is colour: a drifting plate, two soft orbs, a passing beam and a slow grid. It sits
 * behind the page content and changes theme as the visitor moves through the sections.
 *
 * The decorative layers are pointer-transparent, respect reduced motion, pause their media when
 * the tab is hidden, and keep their work bounded so they do not compete with the page itself.
 */
export function BackgroundFX() {
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const wall = useActiveWall();
  const theme = wall ?? bgThemeFor(pathname);
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

  // Two things are answered from the wall that is currently lit. `--bgfx-k` is how loud the moving
  // layers are: only the homepage hero keeps them at full strength, and every other section runs
  // them at the reduced value set on `html`. The attribute also picks the scrollbar gutter colour —
  // the classic Windows gutter paints the root background, so a dark hero with a white gutter reads
  // as a page that stops short of the screen. With this component parked, `Home` owns the flag.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.heroWall = theme === "home" ? "1" : "0";
    return () => {
      delete root.dataset.heroWall;
    };
  }, [theme]);

  return (
    <>
      <div
        ref={depthRef}
        aria-hidden
        data-bg={theme}
        className="bgfx bgfx-wash pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* The per-page gradient sheets. They paint first, so the plate, grid, beam and orbs sit on
            top of them. */}
        <div className="bgfx-sheet bgfx-sheet-a" />
        <div className="bgfx-sheet bgfx-sheet-b" />
        <div
          className="absolute inset-[-8%]"
          style={{ transform: "translate3d(0, var(--bgfx-slow, 0), 0)", opacity: "var(--bgfx-k, 1)" }}
        >
          <div className="bgfx-plate relative size-full">
            <PlateStack plate={plate} film={film} />
          </div>
        </div>
        {/* The grid and the light work sit in one opacity group so `--bgfx-k` reaches all of them at
            once. The orbs and the beam animate their own opacity, which a per-element rule could not
            scale without rewriting every keyframe stop. */}
        <div className="pointer-events-none absolute inset-0" style={{ opacity: "var(--bgfx-k, 1)" }}>
          <div
            className="absolute inset-[-4%]"
            style={{ transform: "translate3d(0, var(--bgfx-fast, 0), 0)" }}
          >
            <div className="bgfx-grid grid-bg size-full" />
          </div>
          <div className="bgfx-beam absolute inset-y-[-30%] left-0 w-[46%]" />
          <div className="bgfx-orb bgfx-orb-a" />
          <div className="bgfx-orb bgfx-orb-b" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>
      <WallMotion mode={motion} />
    </>
  );
}

/**
 * The plate slot, and the one job it has: a section change swaps which plate is current, and the
 * outgoing one has to stay visible until the incoming one has faded up over it. Without that the
 * wash drops to bare gradient for the length of the fade, which reads as a flicker every time the
 * visitor scrolls into a new headline.
 *
 * Two things make that hold. The outgoing plate is moved into `behind` during the same render that
 * adopts the new one, so no commit ever has the slot half empty, and the fade is started by the
 * decode rather than by a clock: a plate is a large image, `decoding="async"` can leave it in flight
 * a second after it mounts, and a timer started at the change can drop the outgoing plate while the
 * new one is still transparent and has nothing to show.
 */
const PLATE_FADE = 1100;

type Slot = { src: string; film: boolean };

function PlateStack({ plate, film }: { plate: string; film?: string }) {
  // Use the optimised still plate on immersive pages; continuous background video competed with page motion.
  const onFilm = false;
  const wanted: Slot = { src: onFilm ? (film ?? "") : plate, film: onFilm };
  const [slots, setSlots] = useState<{ current: Slot; behind: Slot | null }>({
    current: wanted,
    behind: null,
  });
  let { current, behind } = slots;
  if (current.src !== wanted.src || current.film !== wanted.film) {
    current = wanted;
    behind = slots.current;
    setSlots({ current: wanted, behind: slots.current });
  }
  const slotEl = useRef<HTMLImageElement | HTMLVideoElement | null>(null);
  // One holder for whichever element owns the slot this commit, so the decode gate can reach it
  // without the still and the film each carrying their own ref.
  const attach = (el: HTMLImageElement | HTMLVideoElement | null) => {
    slotEl.current = el;
  };

  // The fade is written to the element rather than held in state, because it belongs to this element
  // instance: a plate that comes back later has to fade up again, and a flag keyed on the src would
  // already be true for it. The two fields it is keyed on are read into locals first, so the effect
  // sees nothing but its dependencies.
  const slotSrc = current.src;
  const slotFilm = current.film;
  useEffect(() => {
    const el = slotEl.current;
    if (!el) return;
    let alive = true;
    let hold = 0;
    const ready =
      el instanceof HTMLVideoElement
        ? new Promise<void>((resolve) => {
            if (el.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) resolve();
            else el.addEventListener("canplay", () => resolve(), { once: true });
          })
        : el.decode().then(
            () => undefined,
            () => undefined
          );
    ready.then(() => {
      if (!alive) return;
      el.dataset.lit = "1";
      // Counted from the moment the incoming plate can actually be seen, and a beat longer than the
      // fade itself, so the outgoing one is still covering the wash when the new one lands. It retires
      // only the handover it started, in case the visitor has moved on to a third plate by now.
      hold = window.setTimeout(
        () =>
          setSlots((s) =>
            s.behind !== null && s.current.src === slotSrc && s.current.film === slotFilm
              ? { ...s, behind: null }
              : s
          ),
        PLATE_FADE + 150
      );
    });
    return () => {
      alive = false;
      window.clearTimeout(hold);
    };
  }, [slotSrc, slotFilm]);

  return (
    <>
      {behind ? (
        behind.film ? (
          <WallFilm src={behind.src} poster={plate} swap={false} />
        ) : (
          <img
            src={behind.src}
            alt=""
            decoding="async"
            className="absolute inset-0 size-full object-cover opacity-[0.55]"
          />
        )
      ) : null}
      {current.film ? (
        <WallFilm key={current.src} ref={attach} src={current.src} poster={plate} />
      ) : (
        <img
          key={current.src}
          ref={attach}
          src={current.src}
          alt=""
          decoding="async"
          className="bgfx-plate-swap absolute inset-0 size-full object-cover"
        />
      )}
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
function WallFilm({
  src,
  poster,
  swap = true,
  ref,
}: {
  src: string;
  poster: string;
  swap?: boolean;
  ref?: Ref<HTMLVideoElement>;
}) {
  const play = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = play.current;
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
      ref={(el) => {
        play.current = el;
        // The plate slot keeps one holder for whichever element is current, still or film.
        if (ref) {
          if (typeof ref === "function") ref(el);
          else ref.current = el;
        }
      }}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="auto"
      className={`${swap ? "bgfx-plate-swap" : "opacity-[0.55]"} absolute inset-0 size-full object-cover`}
    />
  );
}
