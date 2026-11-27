import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { AdvantageReel } from "../components/visuals/AdvantageReel";
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

const headlineWords = hero.headline.split(" ");

export default function Home() {
  usePageMeta({ title: site.name, description: hero.subheadline });

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
        className="hero-field relative flex h-[100svh] items-center overflow-hidden"
      >
          {/* The engineering floor, held low so it reads as depth in the field rather than as a
              picture behind the words. */}
          <div aria-hidden className="pointer-events-none absolute inset-[-6%]">
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
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-[-26%] left-1/2 h-[620px] w-[980px] -translate-x-1/2 rounded-full bg-brand-mint/20 blur-[130px]" />
            <div className="absolute top-[22%] left-[6%] hidden h-[420px] w-[420px] rounded-full bg-brand-mint/12 blur-[120px] lg:block" />
            <div className="absolute top-[8%] right-[4%] hidden h-[360px] w-[460px] rounded-full bg-brand-teal/16 blur-[120px] lg:block" />
          </div>

          <div className="wrap relative z-[2]">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-[clamp(2.6rem,7.2vw,4.9rem)] leading-[1.08] text-brand-white sm:leading-[0.98]">
                {headlineWords.map((word, i) => (
                  <span key={`${word}-${i}`}>
                    <span className="inline-block">
                      {/* One word carries the accent, and only one: the brief asks for green used for
                          emphasis rather than a green hero, and #5fdd9d over 4.9rem of type would
                          turn the headline into the lighting effect. */}
                      {word === "Forward." ? (
                        <span className="text-brand-mint">{word}</span>
                      ) : (
                        word
                      )}
                    </span>{" "}
                    {word === "Moves" ? <br className="hidden sm:block" /> : null}
                  </span>
                ))}
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-[1.06rem] leading-[1.7] text-brand-white/88">
                {hero.subheadline}
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button to={paths.services()} size="lg" variant="dark-cta">
                  {hero.ctaPrimary}
                </Button>
                <Button to={paths.contact()} size="lg" variant="outline-light">
                  {hero.ctaSecondary}
                </Button>
              </div>
            </div>
          </div>
        </section>

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
