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
 * to happen without being asked — so the light now walks the row on `INTERVAL`, and the card it
 * lands on presses in 3D as well as lifting (`.card-hover[data-lit]` in `src/index.css`). The press
 * runs on the same interval as the light and writes its own angles, so a cursor arriving mid-press
 * takes the card over instead of fighting it.
 *
 * The clock is the line running around the lit card's call to action. It used to be a rail across
 * the top of the card, which put the movement on the wrong object — the button is the thing you
 * press, so the line goes round the button. One lap is one interval and `animationend` is what
 * advances the walk, so the arc is an honest statement of how long is left on this card and pausing
 * it pauses the section. Hovering, focusing or scrolling the grid off screen freezes it; pointing at
 * a card selects it, so the pointer still wins — it just no longer has to arrive first.
 *
 * Under `prefers-reduced-motion` nothing advances and no ring is drawn: every card sits at rest,
 * bordered as an ordinary card, and the walk never starts. Reduced motion is also what stops the
 * arrival pulse on the CTAs (see `CtaArrival`), so this section becomes the plain, still grid it was
 * before.
 */
export function ServiceGrid() {
  const { active, cycle, frozen, reduce, advance, select, ref, hoverProps } = useRollCycle(
    serviceListings.length,
  );

  return (
    <div
      ref={ref}
      data-roll-paused={frozen ? "true" : undefined}
      style={{ "--roll-interval": `${INTERVAL}ms` } as CSSProperties}
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
              <h3 className="text-[1.2rem]">{s.name}</h3>
              <p className="prose-body mt-3 flex-1 text-[0.94rem]">{s.detail}</p>
              <div className="mt-6">
                <CtaArrival>
                  <span className="relative inline-flex">
                    <Button
                      to={paths.service(s.slug)}
                      size="sm"
                      variant="secondary"
                      className="cta-line"
                    >
                      {s.cta}
                    </Button>
                    {lit && !reduce ? (
                      <span
                        key={`${active}-${cycle}`}
                        aria-hidden
                        className="cta-ring"
                        onAnimationEnd={advance}
                      />
                    ) : null}
                  </span>
                </CtaArrival>
              </div>
            </Card>
          </Reveal>
        );
      })}
    </div>
  );
}
