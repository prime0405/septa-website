import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useIntroHeld } from "../lib/intro";
import { AdvantageReel } from "../components/visuals/AdvantageReel";
import { HeroSpiral } from "../components/visuals/HeroSpiral";
import { TestimonialOrbit } from "../components/visuals/TestimonialOrbit";
import { PhotoFigure } from "../components/blocks/PhotoFigure";
import { SectionStage } from "../components/blocks/SectionStage";
import { StackSheet } from "../components/blocks/StackSheet";
import { ServiceGrid } from "../components/blocks/ServiceGrid";
import { CtaArrival } from "../components/blocks/CtaArrival";
import { Button } from "../components/ui/Button";
import {
  Eyebrow,
  MaskRise,
  Reveal,
  Section,
  SectionHero,
} from "../components/ui/primitives";
import {
  advantageIntro,
  hero,
  landingBlocks,
  partners,
  serviceOverview,
  servicesIntro,
  testimonialTitle,
} from "../data/content";
import { site } from "../lib/site";
import { cn } from "../lib/cn";
import { paths } from "../lib/paths";
import type { BgTheme } from "../lib/bgThemes";
import { usePageMeta } from "../lib/usePageMeta";

/*
 * The wallpaper each offering block runs behind. A model being built is a lattice, a product being
 * taken to market is a stream, a person being matched is the ring field — and no two neighbours
 * share a subject, so scrolling from one headline into the next always shows the backdrop moving.
 */
const blockWalls: Record<string, BgTheme> = {
  ai: "service-ai",
  traditional: "cases",
  talent: "service-talent",
};

/** One headline word, rising into place. `held` keeps it waiting for the curtain. */
function Rise({ i, held, children }: { i: number; held: boolean; children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className="inline-block">{children}</span>;
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: "0.45em" }}
      animate={held ? { opacity: 0, y: "0.45em" } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.62, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}

/** Below this width the pinned stretch is shortened — see the note above. */
function useWideHero() {
  const [wide, setWide] = useState(() => window.matchMedia("(min-width: 1024px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return wide;
}

/*
 * The pinned stage. The hero sticks to the top of the stage wrapper — the same containing block
 * every `StackSheet` on this page uses — and a spacer the height of the runway sits after it, so the
 * hero holds at the top of the screen while the sheets arrive over it.
 *
 * The wrapper this used to sit in was one viewport plus the runway, which made the hero release at
 * exactly the scroll position the next section entered the screen: the two edges met and passed, and
 * the first transition on the page was the one place nothing covered anything. Against the whole
 * stage the hero never releases early, so the first offering block slides up over a hero that has
 * finished shrinking — and because the hero is a viewport tall and pinned at zero, it is also the
 * floor under the whole stack. There is no scroll position at which the page can show through a seam
 * between two sheets.
 *
 * The stage ends before the partners strip, and that end is the stack's release: a sticky box cannot
 * leave its containing block, so every pinned sheet lets go together in the viewport where the last
 * offering block has been fully read and the partners strip is entering. From the strip down the
 * page is ordinary flow again — partners, the advantage, the service overview, the testimonial and
 * the footer scroll past each other the way plain bands do. The cover gesture is the opening
 * chapter of the homepage, not its whole grammar.
 *
 * `RELEASE` is no longer a fraction of a wrapper: the spacer is the runway outright, 58vh on desktop
 * and 26vh below `lg`, and the shrink is measured against it. The phone and tablet runway is
 * deliberately short — the brief asks for a shrinking hero at every size and for mobile not to be
 * made to fight its way through a long pinned stretch, so the composition gets a quarter-screen of
 * visible tightening and then hands over.
 */

const headlineWords = hero.headline.split(" ");

export default function Home() {
  usePageMeta({ title: site.name, description: hero.subheadline });
  const held = useIntroHeld();
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const wide = useWideHero();
  const pinned = !reduce;

  // The hero is the only dark surface on the site, and the classic Windows scrollbar paints its gutter
  // from the root background — so the field reaches both edges only while it owns the middle of the
  // screen, and the gutter goes back to white with the page underneath it. `BackgroundFX` used to
  // publish this flag from whichever wallpaper was lit; the wallpaper is gone, so the field answers
  // for itself, and does so under reduced motion too, where the hook it used always answered null.
  const fieldRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const root = document.documentElement;
    const observer = new IntersectionObserver(
      ([entry]) => {
        root.dataset.heroWall = entry?.isIntersecting ? "1" : "0";
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    observer.observe(field);
    return () => {
      observer.disconnect();
      delete root.dataset.heroWall;
    };
  }, []);

  // The spacer is the runway, so its own pass is the shrink: `start end` is the moment its top edge
  // reaches the bottom of the screen, which with a viewport-tall hero above it is scroll zero, and
  // `end end` is one runway later. Measuring the spacer rather than the hero is what keeps this
  // exact — the hero is pinned, so its own rect stops moving and would report a frozen progress.
  const { scrollYProgress: heroScroll } = useScroll({
    target: stageRef,
    offset: ["start end", "end end"],
  });
  const gridY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : 70]);
  const auroraY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : 130]);

  /*
   * The shrinking itself. Everything is driven by `heroScroll`, which is the runway's real position
   * in the viewport, so the composition is a function of the scrollbar and nothing else: scrolling
   * down shrinks it, scrolling back up re-inflates it, and a fast flick in either direction lands on
   * the exact frame the position implies because there is no timer to fall behind. Measured at the
   * endpoints, the headline block sits at 1.0000 and returns to 1.0000, and only `scale` and
   * `translate` are touched — paint-only properties, so nothing reflows and the stage keeps the
   * height it was given at load.
   *
   * The groups move independently on purpose. The copy tightens the most because it is the thing
   * that has to stop dominating; the field and the light drift on the existing parallax and only
   * widen, which is what gives the composition depth behind a shrinking foreground. The nav is not
   * in this subtree and holds its size throughout.
   */
  const copyScale = useTransform(heroScroll, [0, 1], [1, reduce ? 1 : wide ? 0.78 : 0.88]);
  const copyY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : wide ? -18 : -10]);
  const copyFade = useTransform(heroScroll, [0.82, 1], [1, reduce ? 1 : 0.62]);
  const fieldScale = useTransform(heroScroll, [0, 1], [1, reduce ? 1 : 1.1]);
  const fieldFade = useTransform(heroScroll, [0.4, 1], [1, 0.5]);

  return (
    <>
      {/* The stage: hero through the third offering block. Its bottom edge is where every pin
          releases, so the stacked cover gesture ends as the partners strip enters and the rest of
          the page is flow. */}
      <div className="stack-stage">
      {/* ------------------------------- 1. hero ------------------------------- */}
      <section
        ref={fieldRef}
        data-wall="home"
        data-static-hero=""
        className={
          pinned
            ? "hero-field sticky top-0 z-[1] flex h-[100svh] items-center overflow-hidden"
            : "hero-field relative flex h-[100svh] items-center overflow-hidden"
        }
      >
          {/* The engineering floor, held low so it reads as depth in the field rather than as a
              picture behind the words. */}
          <motion.div
            aria-hidden
            style={{ y: gridY, scale: fieldScale, opacity: fieldFade }}
            className="pointer-events-none absolute inset-[-6%]"
          >
            <img
              src="/img/work/engineering-floor.webp"
              alt=""
              decoding="async"
              fetchPriority="high"
              className="plate-drift-slow size-full object-cover opacity-[0.34] mask-fade"
            />
            {/* The photograph is a night-lit hall, so the field no longer needs Pearl to pull a
                daylight image down to charcoal — it needs a scrim that keeps the charcoal and lets
                the rack lights stay dots rather than becoming the subject. 58% of the field's own
                colour over 34% of a mostly-black image is the pass the contrast harness measured. */}
            <div className="absolute inset-0 bg-charcoal/58" />
            <div className="grid-bg-dark absolute inset-0 opacity-[0.6] mask-fade" />
          </motion.div>
          <motion.div
            aria-hidden
            style={{ y: auroraY, scale: fieldScale }}
            className="pointer-events-none absolute inset-0"
          >
            <div className="animate-aurora absolute top-[-26%] left-1/2 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-brand-mint/20 blur-[130px]" />
            <div className="animate-aurora-slow absolute top-[22%] left-[6%] hidden h-[420px] w-[420px] rounded-full bg-brand-mint/12 blur-[120px] lg:block" />
            <div className="animate-aurora absolute top-[8%] right-[4%] hidden h-[360px] w-[460px] rounded-full bg-brand-teal/16 blur-[120px] lg:block" />
          </motion.div>

          {/* The spiral runs over the plate and under the copy. It dims itself to 10% inside the
              measured box of the headline block, so no glyph ever sits on a stroke stronger than the
              site-wide mesh's worst pixel, while the gutters and corners get the line at full run.
              The box is re-measured every frame, which is what lets the headline shrink underneath it. */}
          <HeroSpiral copyRef={copyRef} className="pointer-events-none absolute inset-0 z-0 size-full" />

          <motion.div
            ref={copyRef}
            style={{ y: copyY, scale: copyScale, opacity: copyFade, transformOrigin: "50% 38%" }}
            className="wrap relative z-[2]"
          >
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-[clamp(2.6rem,7.2vw,4.9rem)] leading-[1.08] text-brand-white sm:leading-[0.98]">
                {headlineWords.map((word, i) => (
                  <span key={`${word}-${i}`}>
                    <Rise i={i} held={held}>
                      {/* One word carries the accent, and only one: the brief asks for green used for
                          emphasis rather than a green hero, and #5fdd9d over 4.9rem of type would
                          turn the headline into the lighting effect. */}
                      {word === "Forward." ? (
                        <span className="text-brand-mint">{word}</span>
                      ) : (
                        word
                      )}
                    </Rise>{" "}
                    {word === "Moves" ? <br className="hidden sm:block" /> : null}
                  </span>
                ))}
              </h1>

              <Reveal delay={0.12}>
                <p className="mx-auto mt-6 max-w-2xl text-[1.06rem] leading-[1.7] text-brand-white/88">
                  {hero.subheadline}
                </p>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <CtaArrival waiting={held}>
                    <Button to={paths.services()} size="lg" variant="dark-cta" magnetic>
                      {hero.ctaPrimary}
                    </Button>
                  </CtaArrival>
                  <CtaArrival waiting={held}>
                    <Button to={paths.contact()} size="lg" variant="outline-light" magnetic>
                      {hero.ctaSecondary}
                    </Button>
                  </CtaArrival>
                </div>
              </Reveal>
            </div>
          </motion.div>
        </section>

      {/* The runway. It carries no content: it is the scroll distance the hero shrinks across, and
          it is the element measured for that shrink, because a pinned hero's own rect does not move.
          Under reduced motion the hero is not pinned and nothing shrinks, so it collapses to a
          hairline — a zero-height target would make the progress a division by zero. */}
      <div
        ref={stageRef}
        aria-hidden
        className={reduce ? "h-px" : wide ? "h-[58vh]" : "h-[26vh]"}
      />

      {/* ------------------- 2–4. the three offering blocks ------------------- */}
      {/* A workplace photograph matched to each offering sits beside the words instead of under
          them. The picture changes side on every block, so the three read as one argument being
          built rather than three copies of the same layout, and the text column is left-aligned
          because a column of prose next to a picture has no centre to share.

          All three frames are the same 3:2 sheet and all three files are 3:2, so the crop is a
          pass-through: the picture fills the box it was asked for and nothing is cut away. The sheet
          is not framed — it steps one grid gap past its column into the gutter on the side away from
          the words, which is the side it was generated to be read from. */}
      {landingBlocks.map((block, i) => (
        <StackSheet key={block.key} order={2 + i}>
          <Section
            wall={blockWalls[block.key]}
            tone={i % 2 ? "surface" : "raised"}
            className="section"
          >
            <SectionStage>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                <div className="max-w-xl">
                  <Eyebrow className="mb-4">{block.label}</Eyebrow>
                  <MaskRise>
                    <h2 className="text-[clamp(2rem,4.6vw,3.1rem)] leading-[1.04]">
                      {block.headline}
                    </h2>
                  </MaskRise>
                  <p className="prose-body mt-5 text-[1.02rem]">{block.subheading}</p>
                  <div className="mt-7">
                    <CtaArrival>
                      <Button to={block.to} size="lg" magnetic>
                        {block.cta}
                      </Button>
                    </CtaArrival>
                  </div>
                </div>

                <Reveal
                  delay={0.08}
                  className={cn("min-w-0", i % 2 ? "lg:order-first" : "lg:order-last")}
                >
                  <PhotoFigure
                    src={block.image}
                    alt={block.alt}
                    eager={i === 0}
                    edge={i % 2 ? "left" : "right"}
                  />
                </Reveal>
              </div>
            </SectionStage>
          </Section>
        </StackSheet>
      ))}
      </div>

      {/* ---------------------------- 5. our partners ---------------------------- */}
      {/* The first band of the ordinary flow: the stack releases above it, so the strip scrolls in
          like a plain band instead of covering anything. One image per partner: the colour lockup,
          with the colour taken out of it by a filter at rest and put back on hover. Two stacked files
          could never register — the supplied colour artwork was a different crop on a different
          canvas — so the reveal used to change the mark's size and shape along with its colour. A
          filter on one element cannot do that. The marquee already stops while the pointer is
          anywhere on it, so the mark being looked at is a still one.

          This band is deliberately the shortest on the page: `py-12 sm:py-14` instead of the
          `.section` rhythm of 56–112px, a heading at two thirds of the other section titles, and
          seven pixels of air between them instead of forty. A logo strip is a footnote to the page,
          not a chapter, and it was taking a screen of its own. It also drops out of
          `SectionStage`: the strip runs edge to edge, so scaling it would pull both ends off the
          screen and show the band through the gap it left — and a band this short has no reading
          middle to hold still.

          No hairline rules anywhere on this page any more. A 1px border on a moving sheet is a line
          that travels up the screen during every cover, and the eye reads it as a seam dragging
          rather than as a surface arriving. The bands separate by tone alone — raised, surface,
          white — which is a step of two or three L* and reads as depth, not as a drawn edge. */}
      <Section
        wall="services"
        tone="surface"
        bleed
        className="py-12 sm:py-14"
      >
          <div className="wrap">
            <MaskRise>
              <h2 className="text-center text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.08]">
                Our Partners
              </h2>
            </MaskRise>
          </div>

          <div className="marquee marquee-logos mt-6 sm:mt-7">
            <div className="marquee-inner">
              {[0, 1].map((copy) => (
                <div key={copy} className="marquee-group" aria-hidden={copy === 1 || undefined}>
                  {partners.map((p) => (
                    <span key={p.name} className="partner-slot">
                      {p.mark ? (
                        <img
                          src={p.mark}
                          alt={p.name}
                          decoding="async"
                          className="partner-mark"
                          style={{ "--mark-h": `${p.height}px` } as CSSProperties}
                        />
                      ) : (
                        <span className="partner-word">{p.name}</span>
                      )}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
      </Section>

      {/* -------------------------- 6. the Septa advantage -------------------------- */}
      {/* Below the stage: ordinary flow. These bands keep their arrival settle but no pin and no
          cover — the stack ended before the partners strip above. */}
      <Section wall="use-case" tone="raised" className="section">
        <SectionStage>
          <SectionHero title="The Septa Advantage" lead={advantageIntro} className="mb-12" />
          <Reveal delay={0.1}>
            <AdvantageReel />
          </Reveal>
        </SectionStage>
      </Section>

      {/* --------------------------- 7. service overview --------------------------- */}
      <Section wall="service-automation" className="section">
        <SectionStage>
          <SectionHero
            eyebrow="Service overview"
            title={serviceOverview}
            lead={servicesIntro}
            size="md"
            className="mb-12"
          />
          <ServiceGrid />
        </SectionStage>
      </Section>

      {/* ----------------------------- 8. testimonial ----------------------------- */}
      <Section wall="blog" tone="raised" className="section">
        <SectionStage>
          <SectionHero eyebrow="Testimonial" title={testimonialTitle} className="mb-12" />
          <Reveal delay={0.1}>
            <TestimonialOrbit />
          </Reveal>
        </SectionStage>
      </Section>
    </>
  );
}
