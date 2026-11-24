import { useEffect, useState } from "react";
import { Award, HeartHandshake, Lightbulb } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Decode } from "../components/ui/Decode";
import { PageHero } from "../components/blocks/PageHero";
import { PhotoFigure } from "../components/blocks/PhotoFigure";
import { SectionStage } from "../components/blocks/SectionStage";
import { AboutHeroArt } from "../components/visuals/AboutHeroArt";
import {
  Card,
  MaskRise,
  Reveal,
  Section,
  SectionHeading,
} from "../components/ui/primitives";
import { about } from "../data/content";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const strengths = [
  {
    icon: Award,
    title: "Deep expertise",
    detail: "Product, engineering, AI and talent capabilities brought together around the problem to solve.",
  },
  {
    icon: HeartHandshake,
    title: "People-first partnership",
    detail: "We start by understanding the people, goals and everyday work behind each brief.",
  },
  {
    icon: Lightbulb,
    title: "Practical innovation",
    detail: "Emerging technology matters when it creates useful outcomes, not simply because it is new.",
  },
];

export default function About() {
  const reduceMotion = useReducedMotion();
  const [activeValue, setActiveValue] = useState(0);
  const [isValuesPaused, setIsValuesPaused] = useState(false);

  useEffect(() => {
    if (isValuesPaused) return;

    const timeout = window.setTimeout(() => {
      setActiveValue((current) => (current + 1) % about.values.length);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [activeValue, isValuesPaused]);

  usePageMeta({
    title: "About Us",
    description:
      "Meet Septa Software Engineering Limited: a technology partner for AI-assisted product development, software engineering and workflow automation.",
  });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "About Us" }]}
        eyebrow="About Septa"
        title="Technology should move people and businesses forward."
        lead="We bring product thinking, engineering and AI together to make work simpler and ambitious ideas achievable."
        art={<AboutHeroArt />}
        aside={
          <div className="relative">
            <PhotoFigure
              eager
              src="https://images.pexels.com/photos/3862089/pexels-photo-3862089.jpeg?auto=compress&dpr=1&h=750&w=1260"
              alt="A multiracial team discussing a project around a laptop in a bright office"
              ratio="aspect-[4/3]"
              edge="none"
            />
            <p className="mt-4 font-mono text-[0.68rem] tracking-[0.12em] text-faint uppercase">
              Thoughtful technology. Practical progress.
            </p>
          </div>
        }
      />

      <Section wall="service-automation" className="section">
        <SectionHeading
          eyebrow="Who we are"
          title="Built around real-world needs."
          className="mb-6 max-w-4xl"
        />
        <Reveal>
          <p className="prose-body max-w-4xl text-[1.08rem]">
            Septa Software Engineering Limited helps organisations reimagine how they work,
            compete and grow through AI-assisted product development, software engineering,
            workflow automation and technology talent solutions.
          </p>
        </Reveal>
        <Reveal delay={0.12} className="mt-9">
          <PhotoFigure
            src="https://images.pexels.com/photos/30689114/pexels-photo-30689114.jpeg?cs=srgb&dl=pexels-ninthgrid-2149521550-30689114.jpg&fm=jpg"
            alt="Three Lagos professionals reviewing a project together on a laptop"
            ratio="aspect-[16/9]"
            width={1200}
            height={800}
            edge="none"
          />
        </Reveal>
      </Section>

      <Section wall="use-case" tone="raised" className="section">
        <SectionHeading
          eyebrow="The Septa approach"
          title="Good technology starts with the right questions."
          lead="Our work is shaped by three principles that keep innovation grounded in the people and outcomes it is meant to serve."
          className="mb-10"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {strengths.map(({ icon: Icon, title, detail }, i) => (
            <Reveal key={title} delay={i * 0.06} className="h-full">
              <div className="approach-float-stage relative h-full">
                <span className="approach-float__shadow" aria-hidden="true" />
                <div className="approach-float relative h-full">
                  <Card tilt interactive className="relative z-[1] flex h-full flex-col overflow-hidden p-7">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-mint/25 bg-mint/[0.07] text-mint">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-6 text-[1.2rem]">{title}</h3>
                    <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{detail}</p>
                  </Card>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="vision-band relative isolate overflow-hidden bg-brand-pearl">
        <div aria-hidden className="vision-band__backdrop pointer-events-none absolute inset-0">
          <div className="vision-band__wash absolute inset-[-12%]" />
          <div className="vision-band__glow vision-band__glow--one" />
          <div className="vision-band__glow vision-band__glow--two" />
          <svg
            className="vision-band__orbit vision-band__orbit--large absolute -right-32 -bottom-56 size-[640px] text-brand-teal"
            viewBox="0 0 640 640"
            fill="none"
          >
            <circle cx="320" cy="320" r="130" stroke="currentColor" strokeOpacity="0.4" />
            <circle cx="320" cy="320" r="186" stroke="currentColor" strokeOpacity="0.28" />
            <circle cx="320" cy="320" r="242" stroke="currentColor" strokeOpacity="0.18" />
            <circle
              className="vision-band__orbit-dash"
              cx="320"
              cy="320"
              r="212"
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeDasharray="2 12"
            />
            <circle cx="532" cy="320" r="4" fill="var(--color-brand-mint)" />
            <circle cx="170" cy="170" r="3" fill="var(--color-brand-teal-lift)" />
          </svg>
          <svg
            className="vision-band__orbit vision-band__orbit--small absolute -left-40 -top-48 size-[440px] text-brand-teal"
            viewBox="0 0 440 440"
            fill="none"
          >
            <circle cx="220" cy="220" r="112" stroke="currentColor" strokeOpacity="0.2" />
            <circle cx="220" cy="220" r="164" stroke="currentColor" strokeOpacity="0.15" />
            <circle
              className="vision-band__orbit-dash"
              cx="220"
              cy="220"
              r="190"
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeDasharray="2 10"
            />
            <circle cx="410" cy="220" r="3" fill="var(--color-brand-mint)" />
          </svg>
          <div className="grain absolute inset-0 opacity-[0.07]" />
        </div>
        <SectionStage>
          <div className="wrap relative grid gap-12 py-16 sm:py-22 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="mb-5 font-mono text-[0.7rem] tracking-[0.22em] text-brand-mint uppercase">
                Our vision
              </p>
              <MaskRise>
                <p className="max-w-xl font-display text-[clamp(1.8rem,4vw,3rem)] leading-[1.14] text-brand-white">
                  {about.vision}
                </p>
              </MaskRise>
            </div>
            <div className="lg:pt-2">
              <p className="mb-5 font-mono text-[0.7rem] tracking-[0.22em] text-brand-mint uppercase">
                Our mission
              </p>
              <p className="max-w-xl text-[1rem] leading-relaxed text-brand-teal-lift">
                {about.mission}
              </p>
            </div>
          </div>
        </SectionStage>
      </section>

      <Section wall="blog" tone="surface" className="section">
        <Reveal y={18} className="mb-10">
          <SectionHeading
            eyebrow="What guides us"
            title={about.valuesHeading}
            lead="Six principles that shape how we think, build and work with people."
            className="max-w-3xl"
          />
        </Reveal>
        <div className="mx-auto max-w-6xl">
          {(() => {
            const details = [
              "Make complex ideas and systems easier to understand and use.",
              "Listen closely, share context and build alongside the people we serve.",
              "Keep decisions connected to real needs, meaningful problems and useful outcomes.",
              "Use AI and engineering thoughtfully to make work smarter.",
              "Challenge assumptions, explore ambitious ideas and keep moving forward.",
              "Care about the craft, quality and details behind every delivery.",
            ];
            return (
              <>
                <style>{`@keyframes scribe-panel-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
                <div
                  className="hidden min-h-[23rem] gap-3 lg:flex"
                  onMouseEnter={() => setIsValuesPaused(true)}
                  onMouseLeave={() => setIsValuesPaused(false)}
                >
                  {about.values.map((value, i) => {
                    const active = activeValue === i;
                    return (
                      <motion.button
                        key={value.letter}
                        type="button"
                        layout
                        onClick={() => setActiveValue(i)}
                        aria-expanded={active}
                        aria-label={`${value.word}: ${active ? "currently expanded" : "expand principle"}`}
                        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.65, delay: reduceMotion ? 0 : i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        className={`group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border text-left transition-colors duration-500 ${active ? "flex-[3.4] border-mint/40 bg-surface shadow-[0_22px_70px_-45px_rgba(15,118,110,0.4)]" : "flex-1 border-line bg-surface/55 hover:border-mint/30 hover:bg-surface/80"}`}
                      >
                        <div className="flex items-center justify-between gap-3 p-5">
                          <span className="font-mono text-[0.64rem] tracking-[0.16em] text-faint">0{i + 1} / 06</span>
                          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl border font-display text-2xl transition-all duration-500 ${active ? "border-mint/30 bg-mint/10 text-mint" : "border-line bg-surface text-muted group-hover:border-mint/30 group-hover:text-mint"}`}>
                            {value.letter}
                          </span>
                        </div>
                        {active ? (
                          <motion.div
                            key={value.letter}
                            initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                            className="flex flex-1 flex-col justify-end px-6 pb-7"
                          >
                            <span className="mb-3 font-mono text-[0.62rem] tracking-[0.2em] text-mint uppercase">SCRIBE principle</span>
                            <h3 className="max-w-[18rem] font-display text-[clamp(1.6rem,2.3vw,2.5rem)] leading-[1.05] tracking-[-0.035em] text-fg">
                              <Decode text={value.word} />
                            </h3>
                            <p className="mt-4 max-w-[22rem] text-[0.94rem] leading-relaxed text-muted">{details[i]}</p>
                            <span className="mt-8 flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.15em] text-faint uppercase">
                              <span className="size-1.5 rounded-full bg-mint" /> Selected value
                            </span>
                          </motion.div>
                        ) : (
                          <div className="flex flex-1 items-end justify-center pb-7">
                            <span className="font-display text-[1rem] tracking-[-0.02em] text-muted [writing-mode:vertical-rl] rotate-180 transition-colors duration-300 group-hover:text-mint">
                              {value.word}
                            </span>
                          </div>
                        )}
                        <span
                          key={active ? `progress-${activeValue}` : `idle-${i}`}
                          aria-hidden="true"
                          style={{
                            transform: "scaleX(0)",
                            transformOrigin: "left",
                            animation: active ? "scribe-panel-progress 4s linear forwards" : "none",
                            animationPlayState: isValuesPaused ? "paused" : "running",
                          }}
                          className={`absolute inset-x-4 bottom-0 h-[3px] rounded-full ${active ? "bg-mint shadow-[0_0_12px_rgba(45,212,191,0.45)]" : "bg-mint/50"}`}
                        />
                      </motion.button>
                    );
                  })}
                </div>

                <div className="grid gap-3 lg:hidden">
                  {about.values.map((value, i) => (
                    <motion.article
                      key={value.letter}
                      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.18 }}
                      transition={{ duration: 0.6, delay: reduceMotion ? 0 : i * 0.06 }}
                      className="rounded-2xl border border-line bg-surface/90 p-5 sm:p-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-mono text-[0.64rem] tracking-[0.16em] text-faint">0{i + 1} / 06</span>
                        <span className="flex size-10 items-center justify-center rounded-xl border border-mint/20 bg-mint/[0.07] font-display text-2xl text-mint">{value.letter}</span>
                      </div>
                      <h3 className="mt-4 font-display text-[1.35rem] leading-tight text-fg"><Decode text={value.word} /></h3>
                      <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-muted">{details[i]}</p>
                    </motion.article>
                  ))}
                </div>
                <p className="mt-5 hidden text-center font-mono text-[0.62rem] tracking-[0.16em] text-faint uppercase lg:block">
                  Automatically exploring each principle · select any panel to jump ahead
                </p>
              </>
            );
          })()}
        </div>
      </Section>

    </>
  );
}
