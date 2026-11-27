import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Circle,
  Layers3,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { UseCase } from "../../data/useCases";
import { useCases } from "../../data/useCases";
import { paths } from "../../lib/paths";
import { caseStudyVisualFor } from "../../lib/photos";
import AnimatedCaseBackdrop from "../../components/ui/AnimatedCaseBackdrop";
import ScrollReveal from "../../components/ui/ScrollReveal";

const CASE_STORY: Record<string, { headline: string; introduction: string; coverNote: string }> = {
  "halogen-group": {
    headline: "A clearer digital front door for security.",
    introduction: "A connected website and secure client experience for one of the region’s leading security groups.",
    coverNote: "Website and secure client extranet",
  },
  "ehcc-clock-in-app": {
    headline: "A more connected way to manage attendance.",
    introduction: "A web and mobile attendance experience that gives members and church leadership a clearer view of participation.",
    coverNote: "Attendance platform for members and leadership",
  },
  preppod: {
    headline: "Making music learning more engaging.",
    introduction: "A learning platform and public website designed to support music students, parents, instructors and administrators.",
    coverNote: "Website and adaptive learning platform",
  },
  "septa-lms": {
    headline: "A more practical path into technology.",
    introduction: "An in-house learning environment built around hands-on technology education, project work and learner progress.",
    coverNote: "In-house technology learning platform",
  },
  toviri: {
    headline: "A smarter companion for every journey.",
    introduction: "A mobile travel assistant that brings itinerary planning, transport support and safety tools into one experience.",
    coverNote: "Mobile travel assistant",
  },
};

function cleanPillarTitle(title: string) {
  return title.replace(/^\s*\d+[\.\)]\s*/, "");
}

function CaseCoverVisual({ study }: { study: UseCase }) {
  const visual = caseStudyVisualFor(study.slug);
  const [photoFailed, setPhotoFailed] = useState(false);
  const hasPhoto = Boolean(visual.photo && !photoFailed);

  return (
    <div className="relative min-h-[22rem] overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.045] shadow-[0_34px_100px_-48px_rgba(0,0,0,.75)] sm:min-h-[28rem] lg:min-h-[34rem]">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(109,177,174,.22),transparent_48%),linear-gradient(145deg,rgba(255,255,255,.07),transparent_58%)]" />
      {hasPhoto ? (
        <img
          src={visual.photo}
          alt={visual.photoAlt ?? ""}
          loading="eager"
          decoding="async"
          onError={() => setPhotoFailed(true)}
          className={
            "absolute inset-0 size-full " +
            (visual.fit === "contain" ? "object-contain p-7 sm:p-10" : "object-cover") +
            " will-change-transform"
          }
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div aria-hidden className="absolute size-[22rem] rounded-full border border-brand-teal/20 sm:size-[28rem]" />
          <div aria-hidden className="absolute size-[16rem] rounded-full border border-brand-teal/15 sm:size-[21rem]" />
          <div aria-hidden className="absolute size-[10rem] rounded-full bg-brand-teal/10 blur-3xl" />
          {visual.logo ? (
            <img
              src={visual.logo}
              alt={visual.logoAlt ?? study.client + " logo"}
              className="relative z-10 max-h-28 max-w-[72%] object-contain sm:max-h-36"
            />
          ) : (
            <span className="relative z-10 text-center text-4xl font-semibold tracking-[-0.06em] text-white sm:text-6xl">
              {study.client}
            </span>
          )}
        </div>
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-brand-pearl/70 via-transparent to-brand-pearl/10" />
      {hasPhoto && visual.logo ? (
        <div className="absolute bottom-5 left-5 flex h-14 min-w-14 items-center justify-center rounded-xl border border-white/75 bg-white/95 p-3 shadow-xl sm:bottom-7 sm:left-7 sm:h-16 sm:p-3.5">
          <img
            src={visual.logo}
            alt={visual.logoAlt ?? study.client + " logo"}
            className="max-h-full max-w-40 object-contain"
          />
        </div>
      ) : null}
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full border border-brand-teal/25" />
    </div>
  );
}

function SolutionGrid({ study }: { study: UseCase }) {
  if (study.pillars?.length) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {study.pillars.map((pillar, index) => (
          <ScrollReveal key={pillar.title} style="up" delay={index * 0.07}>
            <article className="group h-full rounded-2xl border border-line-soft bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-teal/35 hover:shadow-[0_24px_60px_-48px_rgba(6,24,32,.35)] sm:p-7">
            <span className="mb-6 flex size-10 items-center justify-center rounded-xl bg-brand-teal/10 text-mint">
              <Layers3 className="size-5" strokeWidth={1.6} />
            </span>
            <h3 className="text-[1.1rem] font-semibold tracking-[-0.025em] text-brand-pearl">
              {cleanPillarTitle(pillar.title)}
            </h3>
            <p className="mt-3 text-[0.91rem] leading-[1.75] text-muted">{pillar.detail}</p>
            </article>
          </ScrollReveal>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-x-10 sm:grid-cols-2">
      {(study.solution ?? []).map((item, index) => (
        <ScrollReveal key={item} style="soft" delay={index * 0.035}>
          <div className="flex gap-4 border-b border-line-soft py-5">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-mint">
            <Check className="size-4" strokeWidth={2} />
          </span>
            <p className="text-[0.94rem] leading-[1.7] text-brand-pearl">{item}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}

function ProductList({ products }: { products: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {products.map((product, index) => (
        <ScrollReveal key={product} style="up" delay={index * 0.045}>
          <div className="flex h-full items-start gap-4 rounded-xl border border-white/10 bg-white/[0.045] p-5 transition-colors duration-300 hover:border-brand-teal/40 hover:bg-white/[0.07]">
          <span className="mt-1 size-2 shrink-0 rounded-full bg-brand-teal shadow-[0_0_0_5px_rgba(109,177,174,.1)]" />
            <p className="text-[0.91rem] leading-[1.7] text-white/80">{product}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}

function ToolCard({ item }: { item: string }) {
  const splitAt = item.indexOf(":");
  const title = splitAt > 0 ? item.slice(0, splitAt).trim() : item;
  const detail = splitAt > 0 ? item.slice(splitAt + 1).trim() : "";

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.045] p-5">
      <div className="flex items-start gap-3">
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-teal" />
        <div>
          <h4 className="text-[0.9rem] font-semibold text-white">{title}</h4>
          {detail ? <p className="mt-2 text-[0.82rem] leading-[1.7] text-white/55">{detail}</p> : null}
        </div>
      </div>
    </div>
  );
}

export default function EnyataCaseStudy({ study }: { study: UseCase }) {
  const reduceMotion = useReducedMotion() ?? false;
  const story = CASE_STORY[study.slug] ?? {
    headline: study.client,
    introduction: study.overview,
    coverNote: study.kind,
  };
  const currentIndex = useCases.findIndex((item) => item.slug === study.slug);
  const nextStudy = useCases[(currentIndex + 1) % useCases.length];

  return (
    <main className="overflow-hidden bg-white">
      <section data-static-hero="" className="relative isolate overflow-hidden bg-brand-pearl text-white">
        <AnimatedCaseBackdrop variant="dark" />
        <div className="wrap relative z-10 py-9 sm:py-12 lg:py-14">
          <div className="mb-10 sm:mb-14">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[0.76rem] text-white/50">
            <Link to={paths.home()} className="transition-colors hover:text-brand-teal">Home</Link>
            <ChevronRight aria-hidden className="size-3" />
            <Link to={paths.cases()} className="transition-colors hover:text-brand-teal">Case Studies</Link>
            <ChevronRight aria-hidden className="size-3" />
            <span className="text-white/85">{study.client}</span>
            </nav>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
            <div className="max-w-2xl">
              <motion.div
                className="mb-7 flex min-h-10 items-center"
                initial={reduceMotion ? false : { opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {caseStudyVisualFor(study.slug).logo ? (
                  <img
                    src={caseStudyVisualFor(study.slug).logo}
                    alt={caseStudyVisualFor(study.slug).logoAlt ?? study.client + " logo"}
                    className="max-h-10 max-w-44 object-contain object-left"
                  />
                ) : (
                  <span className="text-sm font-semibold tracking-[0.08em] text-brand-teal">{study.client}</span>
                )}
              </motion.div>
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand-teal"
              >
                {study.kind}
              </motion.p>
              <motion.h1
                initial={reduceMotion ? false : { opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-xl text-[clamp(2.65rem,5.7vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-white"
              >
                {story.headline}
              </motion.h1>
              <motion.p
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 max-w-lg text-[0.98rem] leading-[1.8] text-white/65 sm:text-[1.04rem]"
              >
                {story.introduction}
              </motion.p>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.78rem] text-white/65"
              >
                <span>{story.coverNote}</span>
                <span aria-hidden className="hidden size-1 rounded-full bg-brand-teal sm:block" />
                <a href="#project-overview" className="inline-flex items-center gap-2 font-semibold text-brand-teal transition-colors hover:text-white">
                  Explore the project <ArrowRight className="size-4" />
                </a>
              </motion.div>
            </div>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <CaseCoverVisual study={study} />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="project-overview" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-28">
        <ScrollReveal style="left" className="wrap grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
          <div>
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.19em] text-mint">Project overview</p>
            <h2 className="max-w-sm text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.055em] text-brand-pearl">Built around a real-world need.</h2>
          </div>
          <div className="max-w-3xl">
            <p className="text-[1.03rem] leading-[1.9] text-muted sm:text-[1.12rem]">{study.overview}</p>
            <div className="mt-9 border-t border-line-soft pt-6">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-faint">Project type</p>
              <p className="mt-2 text-[1.05rem] font-semibold text-brand-pearl">{study.kind}</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="relative isolate overflow-hidden bg-[#f3f7f6] py-16 sm:py-20 lg:py-28">
        <div aria-hidden className="pointer-events-none absolute -right-40 top-0 size-[34rem] rounded-full bg-brand-teal/[0.07] blur-[100px]" />
        <ScrollReveal style="right" className="wrap relative grid gap-10 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
          <div>
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.19em] text-mint">The challenge</p>
            <h2 className="max-w-sm text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.055em] text-brand-pearl">What needed to change.</h2>
          </div>
          <div className="max-w-3xl">
            <p className="text-[1.03rem] leading-[1.9] text-brand-pearl/80 sm:text-[1.12rem]">{study.challenge}</p>
            <div aria-hidden className="mt-9 h-px w-24 bg-brand-teal" />
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-28">
        <div className="wrap">
          <ScrollReveal style="left" className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
            <div>
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.19em] text-mint">Our solution</p>
              <h2 className="max-w-sm text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.055em] text-brand-pearl">A considered response to the challenge.</h2>
            </div>
            <p className="max-w-3xl self-end text-[1rem] leading-[1.85] text-muted sm:text-[1.08rem]">{study.solutionLead}</p>
          </ScrollReveal>
          <ScrollReveal style="up" delay={0.12}>
            <SolutionGrid study={study} />
          </ScrollReveal>
        </div>
      </section>

      {study.products?.length ? (
        <section className="bg-brand-pearl py-16 text-white sm:py-20 lg:py-28">
          <div className="wrap">
            <ScrollReveal style="left" className="mb-10 max-w-2xl lg:mb-14">
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.19em] text-brand-teal">Products developed</p>
              <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.055em] text-white">The parts that make the experience work.</h2>
            </ScrollReveal>
            <ScrollReveal style="up" delay={0.12}>
              <ProductList products={study.products} />
            </ScrollReveal>
          </div>
        </section>
      ) : null}

      <section className="bg-[#f3f7f6] py-16 sm:py-20 lg:py-28">
        <ScrollReveal style="left" className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.19em] text-mint">How we worked</p>
            <h2 className="max-w-md text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.055em] text-brand-pearl">From first conversations to delivery.</h2>
            <p className="mt-5 max-w-md text-[0.96rem] leading-[1.8] text-muted">A collaborative process shaped around the requirements, people and practical needs of the project.</p>
            <div className="mt-8 hidden items-center gap-3 text-[0.8rem] font-semibold text-mint lg:flex">
              <Circle className="size-3 fill-brand-teal text-brand-teal" />
              <span>Product development process</span>
            </div>
          </div>
          <div className="relative">
            <div aria-hidden className="absolute bottom-7 left-[0.82rem] top-3 w-px bg-brand-teal/25" />
            <div className="space-y-7">
              {study.process.map((step, index) => (
                <ScrollReveal key={step.title} style="right" delay={index * 0.055}>
                  <article className="relative flex gap-5">
                  <span className="relative z-10 mt-1 flex size-[1.7rem] shrink-0 items-center justify-center rounded-full border border-brand-teal/40 bg-[#f3f7f6]">
                    <span className="size-1.5 rounded-full bg-brand-teal" />
                  </span>
                  <div className="pb-1">
                    <h3 className="text-[1rem] font-semibold text-brand-pearl">{step.title}</h3>
                    {step.detail ? <p className="mt-2 text-[0.9rem] leading-[1.75] text-muted">{step.detail}</p> : null}
                  </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="relative isolate overflow-hidden bg-brand-pearl py-16 text-white sm:py-20 lg:py-28">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-32 size-[34rem] rounded-full bg-brand-teal/10 blur-[105px] animate-aurora-slow" />
        <div className="wrap relative">
          <ScrollReveal style="left" className="mb-10 max-w-2xl lg:mb-14">
            <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.19em] text-brand-teal">Technology</p>
            <h2 className="text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.055em] text-white">The tools behind the work.</h2>
            {study.toolsLead ? <p className="mt-4 max-w-xl text-[0.94rem] leading-[1.8] text-white/60">{study.toolsLead}</p> : null}
          </ScrollReveal>
          <div className="grid gap-5 md:grid-cols-2">
            {study.tools.map((group, index) => (
              <ScrollReveal key={group.heading ?? "tools-" + index} style="up" delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
                {group.heading ? <h3 className="mb-4 text-[0.95rem] font-semibold text-brand-teal">{group.heading}</h3> : null}
                <div className="grid gap-3">
                  {group.items.map((item, itemIndex) => (
                    <ScrollReveal key={item} style="soft" delay={itemIndex * 0.035}>
                      <ToolCard item={item} />
                    </ScrollReveal>
                  ))}
                </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="wrap">
          <ScrollReveal style="scale" className="grid gap-8 rounded-[1.65rem] bg-[#f3f7f6] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-14">
            <div className="max-w-2xl">
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.19em] text-mint">Have a project in mind?</p>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.06em] text-brand-pearl">Let’s build something that works.</h2>
              <p className="mt-4 max-w-xl text-[0.95rem] leading-[1.8] text-muted">Tell us what you’re looking to create. We’ll help you find the right way forward.</p>
            </div>
            <Link to={paths.contact()} className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand-pearl px-6 py-4 text-[0.88rem] font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-teal hover:text-brand-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal">
              Start a conversation <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </ScrollReveal>
          <ScrollReveal style="soft" className="mt-8 flex flex-col gap-5 border-t border-line-soft pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link to={paths.cases()} className="inline-flex items-center gap-2 text-[0.84rem] font-semibold text-brand-pearl transition-colors hover:text-mint">
              <ArrowLeft className="size-4" /> Back to all case studies
            </Link>
            {nextStudy && nextStudy.slug !== study.slug ? (
              <Link to={paths.case(nextStudy.slug)} className="group inline-flex items-center gap-3 text-[0.84rem] font-semibold text-brand-pearl transition-colors hover:text-mint">
                Explore {nextStudy.client} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : null}
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
