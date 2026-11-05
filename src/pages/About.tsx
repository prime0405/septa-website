import { Award, HeartHandshake, Lightbulb, Quote } from "lucide-react";
import { CtaSection } from "../components/blocks/CtaSection";
import { PageHero } from "../components/blocks/PageHero";
import {
  Card,
  MaskRise,
  Reveal,
  Section,
  SectionHeading,
  SectionHero,
} from "../components/ui/primitives";
import { about, testimonialTitle, testimonials } from "../data/content";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const strengthIcons = [Award, HeartHandshake, Lightbulb] as const;

export default function About() {
  usePageMeta({ title: "About Us", description: about.whoWeAreTagline });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "About Us" }]}
        eyebrow="About Us"
        title={about.whoWeAreTagline}
        lead={about.whoWeAre}
      />

      {/* ---------------------------- our story ---------------------------- */}
      <Section wall="service-automation" className="section">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <SectionHeading
            eyebrow="Who We Are"
            title="Our Story"
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <div className="space-y-5">
            {about.story.map((paragraph, i) => (
              <Reveal key={paragraph.slice(0, 24)} delay={i * 0.05}>
                <p className="prose-body text-[1.02rem]">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------- strengths ---------------------------- */}
      <Section wall="use-case" tone="raised" className="section border-y border-line-soft">
        <div className="grid gap-5 lg:grid-cols-3">
          {about.strengths.map((s, i) => {
            const Icon = strengthIcons[i % strengthIcons.length];
            return (
              <Reveal key={s.n} delay={i * 0.06} className="h-full">
                <Card tilt className="card-hover relative flex h-full flex-col overflow-hidden p-7">
                  <div aria-hidden className="dot-bg pointer-events-none absolute inset-0 opacity-35" />
                  <div className="relative flex-1">
                    <div className="flex items-center gap-4">
                      <span className="flex size-11 items-center justify-center rounded-xl border border-mint/25 bg-mint/[0.07] text-mint">
                        <Icon className="size-5" />
                      </span>
                      <span className="font-mono text-[0.85rem] text-mint-bright">{s.n}</span>
                    </div>
                    <h3 className="mt-6 text-[1.25rem]">{s.title}</h3>
                    <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{s.detail}</p>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* --------------------------- vision/mission --------------------------- */}
      <Section wall="services" className="section">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <Card tilt className="relative flex h-full flex-col overflow-hidden p-7">
              <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
              <div className="relative">
                <p className="font-mono text-[0.72rem] tracking-[0.18em] text-mint-bright uppercase">
                  Our Vision
                </p>
                <MaskRise>
                  <p className="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.05rem)] leading-[1.25]">
                    {about.vision}
                  </p>
                </MaskRise>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.06} className="h-full">
            <Card tilt className="relative flex h-full flex-col overflow-hidden p-7">
              <div aria-hidden className="dot-bg pointer-events-none absolute inset-0 opacity-40" />
              <div className="relative">
                <p className="font-mono text-[0.72rem] tracking-[0.18em] text-mint-bright uppercase">
                  Our Mission
                </p>
                <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">{about.mission}</p>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------ values ------------------------------ */}
      <Section wall="blog" tone="surface" className="section border-y border-line-soft">
        <SectionHeading eyebrow="About Us" title={about.valuesHeading} className="mb-12" />
        <ul className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {about.values.map((value) => (
            <li
              key={value.letter}
              className="group flex items-center gap-5 bg-surface-raised px-6 py-7 transition-colors hover:bg-surface"
            >
              <span className="font-display text-[2.4rem] leading-none text-mint transition-transform duration-300 group-hover:-translate-y-0.5">
                {value.letter}
              </span>
              <span className="text-[1.05rem]">{value.word}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* -------------------------- client testimonial -------------------------- */}
      <Section wall="careers" tone="raised" className="section border-y border-line-soft">
        <SectionHero eyebrow="Client Testimonial" title={testimonialTitle} className="mb-12" />
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.attribution} delay={i * 0.05}>
              <Card tilt className="flex h-full flex-col p-6 sm:p-7">
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

      {/* ------------------------------ call to action ------------------------------ */}
      <CtaSection
        wall="engage"
        headline={about.cta.headline}
        copy={about.cta.copy}
        label={about.cta.button}
        to={paths.contact()}
      />
    </>
  );
}
