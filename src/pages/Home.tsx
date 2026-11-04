import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Quote } from "lucide-react";
import { useIntroHeld } from "../lib/intro";
import { AdvantageReel } from "../components/visuals/AdvantageReel";
import { HeroSpiral } from "../components/visuals/HeroSpiral";
import { CtaSection } from "../components/blocks/CtaSection";
import { Button } from "../components/ui/Button";
import {
  Card,
  MaskRise,
  Reveal,
  Section,
  SectionHero,
} from "../components/ui/primitives";
import {
  advantageIntro,
  ctaBanner,
  hero,
  landingBlocks,
  partners,
  serviceListings,
  serviceOverview,
  servicesIntro,
  testimonialTitle,
  testimonials,
} from "../data/content";
import { site } from "../lib/site";
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

const headlineWords = hero.headline.split(" ");

export default function Home() {
  usePageMeta({ title: site.name, description: hero.subheadline });
  const held = useIntroHeld();
  const heroRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : 70]);
  const plateY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : 46]);
  const auroraY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : 130]);
  const copyY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : -26]);

  return (
    <>
      {/* ------------------------------- 1. hero ------------------------------- */}
      <section
        ref={heroRef}
        data-wall="home"
        className="band relative overflow-hidden pt-6 pb-16 sm:pt-10 lg:pb-24"
      >
        <motion.div
          aria-hidden
          style={{ y: plateY }}
          className="pointer-events-none absolute inset-x-[-4%] top-[4%] h-[460px]"
        >
          <img
            src="/img/plate-hero.jpg"
            alt=""
            decoding="async"
            className="plate-drift-slow size-full object-cover opacity-[0.55] mask-fade"
          />
          <div className="absolute inset-0 bg-ink/82" />
        </motion.div>
        <motion.div aria-hidden style={{ y: gridY }} className="pointer-events-none absolute inset-0">
          <div className="grid-bg absolute inset-0 opacity-35 mask-fade" />
        </motion.div>
        <motion.div aria-hidden style={{ y: auroraY }} className="pointer-events-none absolute inset-0">
          <div className="animate-aurora absolute top-[-22%] left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-mint/[0.08] blur-[120px]" />
          <div className="animate-aurora-slow absolute top-[18%] left-[8%] hidden h-[380px] w-[380px] rounded-full bg-mint/[0.07] blur-[110px] lg:block" />
          <div className="animate-aurora absolute top-[6%] right-[6%] hidden h-[320px] w-[420px] rounded-full bg-mint/[0.06] blur-[110px] lg:block" />
        </motion.div>

        {/* The spiral runs over the plate and under the copy. It dims itself to 10% inside the
            measured box of the headline block, so no glyph ever sits on a stroke stronger than the
            site-wide mesh's worst pixel, while the gutters and corners get the line at full run. */}
        <HeroSpiral copyRef={copyRef} className="pointer-events-none absolute inset-0 z-0 size-full" />

        <motion.div ref={copyRef} style={{ y: copyY }} className="wrap relative">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-[clamp(2.6rem,7.2vw,4.9rem)] leading-[1.08] sm:leading-[0.96]">
              {headlineWords.map((word, i) => (
                <span key={`${word}-${i}`}>
                  <Rise i={i} held={held}>
                    {word}
                  </Rise>{" "}
                </span>
              ))}
            </h1>

            <Reveal delay={0.12}>
              <p className="prose-body mx-auto mt-6 max-w-2xl text-[1.06rem]">{hero.subheadline}</p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button to={paths.services()} size="lg">
                  {hero.ctaPrimary}
                </Button>
                <Button to={paths.contact()} size="lg" variant="outline-mint">
                  {hero.ctaSecondary}
                </Button>
              </div>
            </Reveal>
          </div>
        </motion.div>
      </section>

      {/* ------------------- 2–4. the three offering blocks ------------------- */}
      {landingBlocks.map((block, i) => (
        <Section
          key={block.key}
          wall={blockWalls[block.key]}
          tone={i % 2 ? "surface" : "raised"}
          className="section border-y border-line-soft"
        >
          <SectionHero
            eyebrow={block.label}
            title={block.headline}
            lead={block.subheading}
            action={
              <Button to={block.to} size="lg">
                {block.cta}
              </Button>
            }
          />
        </Section>
      ))}

      {/* ---------------------------- 5. our partners ---------------------------- */}
      {/* A solid Pearl field rather than a veiled band: three of the supplied marks are white
          artwork drawn for a dark site, so no light ground can carry all eight. */}
      <section
        data-wall="services"
        className="on-dark section relative border-y border-brand-teal/25 bg-brand-pearl"
      >
        <div className="wrap mx-auto max-w-3xl text-center">
          <MaskRise>
            <h2 className="text-[clamp(2rem,4.6vw,3.1rem)] leading-[1.04] text-brand-white">
              Our Partners
            </h2>
          </MaskRise>
        </div>

        <div className="marquee marquee-logos mt-12">
          <div className="marquee-inner">
            {[0, 1].map((copy) => (
              <div key={copy} className="marquee-group" aria-hidden={copy === 1 || undefined}>
                {partners.map((p) => (
                  <span key={p.name} className="flex h-9 shrink-0 items-center">
                    {p.logo ? (
                      <img
                        src={p.logo}
                        alt={p.name}
                        decoding="async"
                        className="logo-mono h-9 w-auto opacity-70 transition-opacity duration-300 hover:opacity-100"
                      />
                    ) : (
                      <span className="text-[1.02rem] tracking-tight whitespace-nowrap text-brand-white/75">
                        {p.name}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------- 6. the Septa advantage -------------------------- */}
      <Section wall="use-case" tone="raised" className="section border-y border-line-soft">
        <SectionHero title="The Septa Advantage" lead={advantageIntro} className="mb-12" />
        <Reveal delay={0.1}>
          <AdvantageReel />
        </Reveal>
      </Section>

      {/* --------------------------- 7. service overview --------------------------- */}
      <Section wall="service-automation" className="section">
        <SectionHero
          eyebrow="Service overview"
          title={serviceOverview}
          lead={servicesIntro}
          className="mb-12"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {serviceListings.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.05} className={i === 0 ? "md:col-span-2" : ""}>
              <Card className="card-hover flex h-full flex-col p-6 sm:p-7">
                <h3 className="text-[1.2rem]">{s.name}</h3>
                <p className="prose-body mt-3 flex-1 text-[0.94rem]">{s.detail}</p>
                <div className="mt-6">
                  <Button to={paths.service(s.slug)} size="sm" variant="secondary">
                    {s.cta}
                  </Button>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ----------------------------- 8. testimonial ----------------------------- */}
      <Section wall="blog" tone="raised" className="section border-y border-line-soft">
        <SectionHero eyebrow="Testimonial" title={testimonialTitle} className="mb-12" />
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.attribution} delay={i * 0.05}>
              <Card className="flex h-full flex-col p-6 sm:p-7">
                <Quote className="size-5 text-mint" aria-hidden />
                <p className="mt-4 flex-1 text-[0.92rem] leading-relaxed text-muted">“{t.quote}”</p>
                <p className="mt-5 font-mono text-[0.72rem] tracking-[0.14em] text-faint uppercase">
                  — {t.attribution}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* -------------------------- 9. call-to-action banner -------------------------- */}
      <CtaSection
        wall="engage"
        headline={ctaBanner.headline}
        copy={ctaBanner.subheadline}
        label={ctaBanner.cta}
        to={paths.contact()}
      />
    </>
  );
}
