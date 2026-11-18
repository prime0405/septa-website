import { Award, HeartHandshake, Lightbulb } from "lucide-react";
import { PageHero } from "../components/blocks/PageHero";
import { PhotoFigure } from "../components/blocks/PhotoFigure";
import { SectionStage } from "../components/blocks/SectionStage";
import { AboutHeroArt } from "../components/visuals/AboutHeroArt";
import { TestimonialOrbit } from "../components/visuals/TestimonialOrbit";
import {
  Card,
  MaskRise,
  Reveal,
  Section,
  SectionHeading,
  SectionHero,
} from "../components/ui/primitives";
import { about, testimonialTitle } from "../data/content";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const strengthIcons = [Award, HeartHandshake, Lightbulb] as const;

/*
 * Two photographs, leaned against each other like prints on a desk. Both are general scenes of the
 * kind of work Septa does — hands at a review table, hands at an operations counter — and the
 * caption says so, because neither is a client project and neither may read as one. The lean is
 * static; the life in them is PhotoFigure's own scroll and pointer settle, the same gesture every
 * other photograph on the site carries.
 */
const deskPrints = (
  <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
    <div className="relative h-[340px] sm:h-[420px]">
      <div className="absolute right-0 top-0 w-[68%] rotate-2">
        <PhotoFigure
          src="/img/work/transformation-floor.webp"
          alt="An operations counter with an ageing green-screen terminal and stacks of paper forms on one side, and a tablet showing a clean dashboard on the other, a worker's hands setting one form down"
          ratio="aspect-[4/3]"
          edge="none"
          className="mx-0!"
        />
      </div>
      <div className="absolute left-0 top-16 w-[70%] -rotate-3">
        <PhotoFigure
          eager
          src="/img/work/hiring-review.webp"
          alt="A laptop open on a code editor beside a tablet showing a candidate profile as an avatar and a shortlist of skill bars, two pairs of hands at the table, one writing a note"
          ratio="aspect-[4/3]"
          edge="none"
          className="mx-0!"
        />
      </div>
    </div>
    <p className="mt-5 font-mono text-[0.68rem] tracking-[0.14em] text-faint uppercase">
      General scenes of the work, not client projects
    </p>
  </div>
);

export default function About() {
  usePageMeta({ title: "About Us", description: about.whoWeAreTagline });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "About Us" }]}
        eyebrow="About Us"
        title={about.whoWeAreTagline}
        lead={about.whoWeAre}
        art={<AboutHeroArt />}
        aside={deskPrints}
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
            {/* The story is the one place on this page a reader is being asked to believe something
                about how the work happens, so it gets the picture of a room where work like that
                happens — a general scene, not a claim about a Septa project. */}
            <Reveal delay={0.1}>
              <PhotoFigure
                src="/img/work/product-delivery.webp"
                alt="Two colleagues standing at a wall of printed screen flows and coloured notes, one pointing at a step, while a monitor beside them shows a build pipeline with four stages checked and the fifth running"
                ratio="aspect-[3/2]"
                width={1200}
                height={800}
              />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ---------------------------- strengths ---------------------------- */}
      <Section wall="use-case" tone="raised" className="section">
        <div className="grid gap-5 lg:grid-cols-3">
          {about.strengths.map((s, i) => {
            const Icon = strengthIcons[i % strengthIcons.length];
            return (
              <Reveal key={s.n} delay={i * 0.06} className="h-full">
                <Card tilt className="card-hover relative flex h-full flex-col overflow-hidden p-7">
                  <div aria-hidden className="dot-bg pointer-events-none absolute inset-0 opacity-35" />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-6 -right-2 font-display text-[5.5rem] leading-none text-mint/[0.07]"
                  >
                    {s.n}
                  </span>
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

      {/* ----------------------------- vision -----------------------------
          The one dark band on the interior pages, and the one sentence the company steers by, so it
          gets the whole width and the largest type on the page. The plate is Black Pearl with the
          contour orbit in teal line and the same grain as the header: paint, not motion. */}
      <section className="relative overflow-hidden bg-brand-pearl">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 90% at 82% 10%, color-mix(in oklab, var(--color-brand-pearl-raised) 90%, transparent) 0%, transparent 66%), radial-gradient(48% 70% at 12% 96%, color-mix(in oklab, var(--color-mint-deep) 55%, transparent) 0%, transparent 62%)",
            }}
          />
          <svg
            className="absolute -right-32 -bottom-56 size-[640px] text-brand-teal"
            viewBox="0 0 640 640"
            fill="none"
          >
            <circle cx="320" cy="320" r="130" stroke="currentColor" strokeOpacity="0.4" />
            <circle cx="320" cy="320" r="186" stroke="currentColor" strokeOpacity="0.28" />
            <circle cx="320" cy="320" r="242" stroke="currentColor" strokeOpacity="0.18" />
            <circle
              cx="320"
              cy="320"
              r="212"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeDasharray="2 12"
            />
            <circle cx="532" cy="320" r="4" fill="var(--color-brand-mint)" fillOpacity="0.8" />
            <circle cx="188" cy="188" r="3" fill="var(--color-brand-mint)" fillOpacity="0.55" />
          </svg>
          <div className="grain absolute inset-0 opacity-[0.07]" />
        </div>
        <SectionStage>
          <div className="wrap relative py-16 sm:py-22">
            <p className="mb-6 font-mono text-[0.7rem] tracking-[0.22em] text-brand-mint uppercase">
              Our Vision
            </p>
            <MaskRise>
              <p className="max-w-4xl font-display text-[clamp(1.7rem,4vw,3rem)] leading-[1.16] tracking-[-0.015em] text-brand-white">
                {about.vision}
              </p>
            </MaskRise>
            <p className="mt-7 max-w-xl text-[0.95rem] leading-relaxed text-brand-teal-lift">
              The sentence every build, hire and workflow is measured against.
            </p>
          </div>
        </SectionStage>
      </section>

      {/* ----------------------------- mission ----------------------------- */}
      <Section wall="services" className="section">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="What Drives Us" title="Our Mission" className="mb-6" />
            <Reveal>
              <p className="prose-body text-[1.05rem]">{about.mission}</p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <PhotoFigure
              src="/img/work/talent-matching.webp"
              alt="A monitor showing a grid of candidate profiles as abstract avatars with skill bars, two of them joined by a curve, beside a laptop running a video interview"
              ratio="aspect-[3/2]"
              edge="left"
            />
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------ values ------------------------------ */}
      <Section wall="blog" tone="surface" className="section">
        <SectionHeading eyebrow="About Us" title={about.valuesHeading} className="mb-12" />
        <ul className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {about.values.map((value) => (
            <li
              key={value.letter}
              className="group relative flex items-center gap-5 overflow-hidden bg-surface-raised px-6 py-7 transition-colors hover:bg-surface"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-3 -bottom-7 font-display text-[6rem] leading-none text-mint/[0.07] transition-transform duration-500 group-hover:-translate-y-1.5"
              >
                {value.letter}
              </span>
              <span className="relative font-display text-[2.4rem] leading-none text-mint transition-transform duration-300 group-hover:-translate-y-0.5">
                {value.letter}
              </span>
              <span className="relative text-[1.05rem]">{value.word}</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-mint/45 transition-transform duration-500 group-hover:scale-x-100"
              />
            </li>
          ))}
        </ul>
      </Section>

      {/* -------------------------- client testimonial -------------------------- */}
      <Section wall="careers" tone="raised" className="section">
        <SectionHero eyebrow="Client Testimonial" title={testimonialTitle} className="mb-12" />
        <Reveal delay={0.1}>
          <TestimonialOrbit />
        </Reveal>
      </Section>
    </>
  );
}