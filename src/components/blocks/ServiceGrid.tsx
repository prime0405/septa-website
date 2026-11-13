import type { CSSProperties } from "react";
import { useRollCycle } from "../../lib/useRollCycle";
import { serviceListings } from "../../data/content";
import { paths } from "../../lib/paths";
import { Button } from "../ui/Button";
import { Card, Reveal } from "../ui/primitives";
import { CtaArrival } from "./CtaArrival";

/** How long a card holds the light before it moves. Long enough to read a card's first line. */
const INTERVAL = 3600;

/**
 * The five services, with the attention arriving on its own.
 *
 * This grid used to answer only a cursor: five identical cards, and the one you happened to be
 * pointing at lifted, warmed and glowed, while the other four sat inert. Septa asked for that state
 * to happen without being asked — so the light now walks the row on `INTERVAL`, on the same clock the
 * Septa Advantage reel runs (`useRollCycle`, which advances on the fill's own `animationend` rather
 * than on a parallel timer, so the bar and the jump cannot drift). A card that has never been touched
 * still lifts, still takes the mint edge, and still casts the glow.
 *
 * The thin rail across the top of the lit card is not decoration: it is the timer. Because the fill
 * is what fires the advance, the bar is an honest statement of how long is left in the current card,
 * and pausing it pauses the walk. Hovering, focusing or scrolling the grid off screen freezes both;
 * pointing at a card selects it, so the pointer still wins — it just no longer has to arrive first.
 *
 * The hover itself is untouched and still works. `data-lit` only adds a second way into the same
 * state, and it does that through `--lift` rather than a new transform, so the 3D lean the card
 * already carries and the automatic lift share one transform instead of overwriting each other.
 *
 * Under `prefers-reduced-motion` nothing advances: every card sits at rest, bordered as an ordinary
 * card, and the walk never starts. Reduced motion is also what stops the arrival pulse on the CTAs
 * (see `CtaArrival`), so this section becomes the plain, still grid it was before.
 */
export function ServiceGrid() {
  const { active, cycle, frozen, advance, select, ref, hoverProps } = useRollCycle(
    serviceListings.length,
  );

  return (
    <div
      ref={ref}
      data-roll-paused={frozen ? "true" : undefined}
      className="grid gap-4 md:grid-cols-2"
      {...hoverProps}
    >
      {serviceListings.map((s, i) => {
        const lit = i === active;
        return (
          <Reveal key={s.slug} delay={i * 0.05} className={i === 0 ? "md:col-span-2" : ""}>
            <Card
              tilt
              lit={lit}
              onPointerEnter={() => select(i)}
              className="card-hover flex h-full flex-col p-6 sm:p-7"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] overflow-hidden bg-line">
                {lit ? (
                  <span
                    key={`${active}-${cycle}`}
                    className="roll-fill absolute inset-0 bg-mint"
                    style={{ "--roll-interval": `${INTERVAL}ms` } as CSSProperties}
                    onAnimationEnd={advance}
                  />
                ) : null}
              </span>
              <h3 className="text-[1.2rem]">{s.name}</h3>
              <p className="prose-body mt-3 flex-1 text-[0.94rem]">{s.detail}</p>
              <div className="mt-6">
                <CtaArrival>
                  <Button to={paths.service(s.slug)} size="sm" variant="secondary" className="cta-line">
                    {s.cta}
                  </Button>
                </CtaArrival>
              </div>
            </Card>
          </Reveal>
        );
      })}
    </div>
  );
}
