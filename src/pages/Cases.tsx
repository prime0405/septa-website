import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Globe2, MoveUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useCases, type UseCase } from "../data/useCases";
import { paths } from "../lib/paths";
import { caseStudyVisualFor } from "../lib/photos";
import { usePageMeta } from "../lib/usePageMeta";
import AnimatedCaseBackdrop from "../components/ui/AnimatedCaseBackdrop";
import ScrollReveal from "../components/ui/ScrollReveal";

const summaries: Record<string, string> = {
  "halogen-group":
    "A more useful digital presence and secure online experience for a leading security group.",
  "ehcc-clock-in-app":
    "A connected attendance platform for members, departmental teams and church leadership.",
  preppod:
    "A digital music-learning ecosystem designed to support learners, parents and instructors.",
  "septa-lms":
    "An in-house learning environment built around practical training and measurable progress.",
  toviri:
    "A mobile travel companion bringing itinerary planning, transport support and safety together.",
};

const clientGroups: {
  id: string;
  title: string;
  intro: string;
  projects: UseCase[];
}[] = [
  {
    id: "startups",
    title: "Startups",
    intro:
      "We partner with ambitious teams to turn early ideas into useful digital products. From the first product decisions to a confident launch, we help build the foundations for what comes next.",
    projects: useCases.filter((study) => ["preppod", "toviri"].includes(study.slug)),
  },
  {
    id: "enterprise",
    title: "Enterprise",
    intro:
      "We help established organisations make technology work harder for their people and their customers, creating connected digital experiences around real operational needs.",
    projects: useCases.filter((study) =>
      ["halogen-group", "ehcc-clock-in-app"].includes(study.slug),
    ),
  },
];

function ClientLogo({ study, compact = false }: { study: UseCase; compact?: boolean }) {
  const visual = caseStudyVisualFor(study.slug);
  const label = study.client === "Septa" ? "Septa" : study.client;

  if (visual.logo) {
    return (
      <span
        className={
          "inline-flex items-center justify-center rounded-lg bg-white " +
          (compact ? "h-10 min-w-10 px-2.5" : "h-12 min-w-12 px-3")
        }
      >
        <img
          src={visual.logo}
          alt={visual.logoAlt ?? label + " logo"}
          className={compact ? "max-h-6 max-w-24 object-contain" : "max-h-7 max-w-32 object-contain"}
        />
      </span>
    );
  }

  return (
    <span
      className={
        "inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-pearl font-semibold tracking-[0.04em] text-white " +
        (compact ? "h-10 min-w-10 px-2.5 text-[0.67rem]" : "h-12 min-w-12 px-3 text-[0.72rem]")
      }
    >
      {label}
    </span>
  );
}

function CaseStudyCard({
  study,
  index,
  reduceMotion,
}: {
  study: UseCase;
  index: number;
  reduceMotion: boolean;
}) {
  const visual = caseStudyVisualFor(study.slug);
  const [photoFailed, setPhotoFailed] = useState(false);
  const hasPhoto = Boolean(visual.photo && !photoFailed);
  const projectName = study.title.replace(/ Use Case$/, "");

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{
        duration: 0.65,
        delay: (index % 2) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="min-w-0"
    >
      <Link
        to={paths.case(study.slug)}
        className="group block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-brand-teal"
      >
        <div
          className={
            "relative aspect-[1.55] overflow-hidden rounded-[1.35rem] border border-brand-pearl/[0.07] " +
            (visual.surface === "pearl" ? "bg-brand-pearl" : "bg-[#eaf1ee]")
          }
        >
          {hasPhoto ? (
            <img
              src={visual.photo}
              alt={visual.photoAlt ?? ""}
              loading="lazy"
              decoding="async"
              onError={() => setPhotoFailed(true)}
              className={
                "absolute inset-0 size-full transition-transform duration-700 group-hover:scale-[1.035] " +
                (visual.fit === "contain" ? "object-contain p-8 sm:p-11" : "object-cover")
              }
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div
                aria-hidden
                className="absolute -right-12 -top-24 size-[24rem] rounded-full border border-brand-teal/25"
              />
              <div
                aria-hidden
                className="absolute -right-2 -top-14 size-[17rem] rounded-full border border-brand-teal/20"
              />
              <div
                aria-hidden
                className="absolute -bottom-40 -left-20 size-[25rem] rounded-full bg-brand-teal/10 blur-3xl"
              />
              {visual.logo ? (
                <img
                  src={visual.logo}
                  alt={visual.logoAlt ?? study.client + " logo"}
                  className="relative z-10 max-h-24 max-w-[65%] object-contain sm:max-h-32"
                />
              ) : (
                <span className="relative z-10 text-4xl font-semibold tracking-[-0.06em] text-brand-pearl sm:text-6xl">
                  {study.client}
                </span>
              )}
            </div>
          )}

          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-brand-pearl/35 via-transparent to-transparent"
          />
          <span className="absolute left-4 top-4 rounded-full border border-white/65 bg-white/90 px-3 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-brand-pearl shadow-sm backdrop-blur-sm sm:left-5 sm:top-5">
            {study.kind}
          </span>
          <span className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full border border-white/75 bg-brand-pearl/75 text-white backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-brand-teal group-hover:text-brand-pearl sm:bottom-5 sm:right-5">
            <MoveUpRight className="size-4" />
          </span>
        </div>

        <div className="pt-5 sm:pt-6">
          <div className="flex items-center gap-3">
            <ClientLogo study={study} compact />
            <h3 className="min-w-0 truncate text-[1.32rem] font-semibold tracking-[-0.04em] text-brand-pearl transition-colors duration-300 group-hover:text-mint sm:text-[1.5rem]">
              {projectName}
            </h3>
          </div>

          <p className="mt-4 max-w-xl text-[0.91rem] leading-[1.8] text-muted sm:text-[0.95rem]">
            {summaries[study.slug] ?? study.overview}
          </p>

          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-pearl/20 px-4 py-2.5 text-[0.78rem] font-semibold text-brand-pearl transition-all duration-300 group-hover:border-brand-teal group-hover:bg-brand-teal group-hover:text-brand-pearl">
            View case study
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

function ClientGroup({
  group,
  reduceMotion,
}: {
  group: (typeof clientGroups)[number];
  reduceMotion: boolean;
}) {
  return (
    <section id={group.id} className="scroll-mt-28 py-16 sm:py-20 lg:py-24">
      <div className="wrap">
        <ScrollReveal style="up" className="mx-auto mb-11 max-w-3xl text-center sm:mb-14 lg:mb-16">
          <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-mint">
            Who we build with
          </p>
          <h2 className="text-[clamp(2.5rem,5vw,4.3rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-brand-pearl">
            {group.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[0.96rem] leading-[1.85] text-muted sm:text-[1.02rem]">
            {group.intro}
          </p>
        </ScrollReveal>

        <div className="grid items-start gap-x-9 gap-y-14 md:grid-cols-2 lg:gap-x-14 lg:gap-y-16">
          {group.projects.map((study, index) => (
            <CaseStudyCard
              key={study.slug}
              study={study}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function InHouseFeature({ reduceMotion }: { reduceMotion: boolean }) {
  const study = useCases.find((item) => item.slug === "septa-lms");
  if (!study) return null;

  const visual = caseStudyVisualFor(study.slug);

  return (
    <section className="bg-[#f1f5f3] py-16 sm:py-20 lg:py-24">
      <div className="wrap">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid overflow-hidden rounded-[1.5rem] bg-brand-pearl text-white lg:grid-cols-[1fr_1fr]"
        >
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-teal">
              Built by Septa · In-house product
            </p>
            <h2 className="max-w-xl text-[clamp(2.2rem,4.2vw,3.7rem)] font-semibold leading-[1.02] tracking-[-0.06em]">
              We build the tools we believe in.
            </h2>
            <p className="mt-5 max-w-lg text-[0.94rem] leading-[1.85] text-white/68">
              Septa LMS is our own learning environment, created to support practical
              technology education, project-based learning and learner progress.
            </p>
            <Link
              to={paths.case(study.slug)}
              className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/35 px-5 py-3 text-[0.82rem] font-semibold text-white transition-colors hover:border-brand-teal hover:bg-brand-teal hover:text-brand-pearl"
            >
              Explore Septa LMS
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <div className="relative min-h-[18rem] overflow-hidden bg-[#e7efec] sm:min-h-[24rem] lg:min-h-[30rem]">
            {visual.photo ? (
              <img
                src={visual.photo}
                alt={visual.photoAlt ?? "Septa LMS"}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ClientLogo study={study} />
              </div>
            )}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-brand-pearl/35 via-transparent to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function EventCard({
  href,
  image,
  imageAlt,
  eyebrow,
  title,
  description,
  action,
}: {
  href: string;
  image: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="group block min-w-0"
    >
      <div className="relative aspect-[1.28] overflow-hidden rounded-[1.2rem] bg-[#eaf1ee]">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-white text-brand-pearl shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-brand-teal">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="pt-4">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.17em] text-mint">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-[1.2rem] font-semibold leading-tight tracking-[-0.035em] text-brand-pearl transition-colors group-hover:text-mint sm:text-[1.35rem]">
          {title}
        </h3>
        <p className="mt-2 text-[0.86rem] leading-[1.75] text-muted">{description}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-[0.78rem] font-semibold text-brand-pearl">
          {action}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
}

export default function Cases() {
  usePageMeta({
    title: "Case Studies | Septa Software",
    description:
      "Explore digital products and platforms Septa Software has designed and developed with startups and established organisations.",
  });

  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className="overflow-hidden bg-white">
      <section data-static-hero="" className="relative isolate overflow-hidden bg-white">
        <AnimatedCaseBackdrop variant="light" />
        <div className="wrap relative z-10 pb-20 pt-20 text-center sm:pb-24 sm:pt-24 lg:pb-32 lg:pt-28">
          <nav
            aria-label="Breadcrumb"
            className="mb-12 flex items-center justify-center gap-2 text-[0.76rem] text-muted sm:mb-16"
          >
            <Link to={paths.home()} className="transition-colors hover:text-mint">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-brand-pearl">Case Studies</span>
          </nav>

          <p className="mb-6 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-mint">
            Our work · Septa Software
          </p>
          <h1 className="mx-auto max-w-5xl text-[clamp(3rem,7.4vw,6.8rem)] font-semibold leading-[0.94] tracking-[-0.075em] text-brand-pearl">
            Digital solutions built around{" "}
            <span className="text-mint">real needs.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-[1rem] leading-[1.9] text-muted sm:text-[1.08rem]">
            From growing startups to established organisations, we turn ideas and business
            challenges into thoughtful digital products built for the people who use them.
          </p>
          <div>
            <Link
              to={paths.contact()}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-brand-pearl px-6 py-4 text-[0.86rem] font-semibold text-white transition-colors duration-300 hover:bg-brand-teal hover:text-brand-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal"
            >
              Start a project
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-[#f5f8f6]">
        <ClientGroup group={clientGroups[0]} reduceMotion={reduceMotion} />
      </div>
      <div className="bg-white">
        <ClientGroup group={clientGroups[1]} reduceMotion={reduceMotion} />
      </div>

      <InHouseFeature reduceMotion={reduceMotion} />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="wrap">
          <ScrollReveal style="scale" className="grid gap-8 rounded-[1.5rem] bg-[#eaf1ee] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:p-14">
            <div className="max-w-3xl">
              <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-mint">
                Have an idea?
              </p>
              <h2 className="text-[clamp(2.2rem,4.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.065em] text-brand-pearl">
                Your idea, paired with our expertise, can go further.
              </h2>
              <p className="mt-4 max-w-xl text-[0.94rem] leading-[1.8] text-muted">
                Tell us what you are looking to create. We will help you shape the right path
                from first conversation to delivery.
              </p>
            </div>
            <Link
              to={paths.contact()}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-brand-pearl px-6 py-4 text-[0.86rem] font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-brand-teal hover:text-brand-pearl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal"
            >
              Share your idea
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-white pb-16 sm:pb-20 lg:pb-24">
        <div className="wrap">
          <ScrollReveal style="scale" className="relative isolate overflow-hidden rounded-[1.5rem] bg-brand-pearl px-7 py-12 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-40 size-[32rem] rounded-full border border-brand-teal/20"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-24 size-[22rem] rounded-full border border-brand-teal/15"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage: "radial-gradient(rgba(109,177,174,.8) 1px,transparent 1px)",
                backgroundSize: "18px 18px",
                maskImage: "linear-gradient(to left,black,transparent 75%)",
              }}
            />
            <div className="relative mx-auto max-w-3xl text-center">
              <p className="mb-5 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-teal">
                <Globe2 className="size-4" />
                We are global
              </p>
              <h2 className="text-[clamp(2.3rem,5.2vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-white">
                Let’s build the future together.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-[0.94rem] leading-[1.85] text-white/65 sm:text-[1rem]">
                Great products move beyond borders. We bring product thinking, engineering
                and collaboration together to create digital experiences for organisations
                serving people in different markets and communities.
              </p>
              <Link
                to={paths.contact()}
                className="group mt-8 inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-[0.82rem] font-semibold text-white transition-colors hover:border-brand-teal hover:bg-brand-teal hover:text-brand-pearl"
              >
                Build with Septa
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="ideas-gather-section relative isolate overflow-hidden bg-[#f5f8f6] py-16 sm:py-20 lg:py-24">
        <div aria-hidden="true" className="ideas-network pointer-events-none absolute inset-y-0 right-0 hidden w-[68%] lg:block">
          <svg viewBox="0 0 900 620" preserveAspectRatio="xMidYMid slice" className="size-full">
            <g className="ideas-network__lines" fill="none" stroke="currentColor" strokeWidth="1.15">
              <path d="M110 110 270 205 430 120 590 230 760 125 M110 110 170 365 350 445 590 230 710 470 760 125 M270 205 350 445 520 365 710 470 M430 120 520 365 590 230 M170 365 270 205 M590 230 820 330 710 470" />
              <path d="M110 110 430 120 760 125 M170 365 520 365 820 330" />
            </g>
            <g className="ideas-network__nodes" fill="currentColor">
              <circle cx="110" cy="110" r="4" />
              <circle cx="270" cy="205" r="5" />
              <circle cx="430" cy="120" r="3.5" />
              <circle cx="590" cy="230" r="5" />
              <circle cx="760" cy="125" r="4" />
              <circle cx="170" cy="365" r="3.5" />
              <circle cx="350" cy="445" r="5" />
              <circle cx="520" cy="365" r="3.5" />
              <circle cx="710" cy="470" r="4.5" />
              <circle cx="820" cy="330" r="3" />
            </g>
          </svg>
        </div>
        <div className="wrap relative z-10 grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <ScrollReveal style="left" className="max-w-xl">
            <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-mint">
              Our events
            </p>
            <h2 className="text-[clamp(2.2rem,4.4vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.06em] text-brand-pearl">
              Ideas grow when people come together.
            </h2>
            <p className="mt-5 text-[0.94rem] leading-[1.85] text-muted">
              A look at the programmes, conversations and learning experiences happening
              across the Septa community.
            </p>
            <a
              href="https://ng.linkedin.com/company/septa-software-engineering-ltd"
              target="_blank"
              rel="noreferrer noopener"
              className="group mt-7 inline-flex items-center gap-2 border-b border-brand-teal pb-2 text-[0.84rem] font-semibold text-brand-pearl transition-colors hover:text-mint"
            >
              Explore Septa updates
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </ScrollReveal>

          <div className="grid items-start gap-8 sm:grid-cols-2 sm:gap-6 lg:gap-8">
            <ScrollReveal style="up" delay={0.08}>
              <EventCard
                href="https://ng.linkedin.com/company/septa-software-engineering-ltd"
                image="https://www.septasoftware.com/assets/home/acad_main.png"
                imageAlt="Septa Academy programme visual from Septa's official website"
                eyebrow="Septa Academy · 2026"
                title="Beta Cohort 2026"
                description="A learning initiative spanning eight career tracks, with scholarship opportunities for selected learners."
                action="Explore the programme"
              />
            </ScrollReveal>
            <div className="sm:mt-16">
              <ScrollReveal style="right" delay={0.18}>
                <EventCard
                  href="https://blog.septasoftware.com/start-your-tech-career-with-zero-experience-at-septa-academy"
                  image="https://cdn.hashnode.com/res/hashnode/image/upload/v1751626420069/b680c717-0431-46b6-bf8a-ace273528278.jpeg"
                  imageAlt="Promotional artwork for Septa Academy's July 2025 three-day webinar"
                  eyebrow="Septa Academy · July 2025"
                  title="Start your tech career with confidence"
                  description="A three-day webinar created to help people take their first steps into technology."
                  action="Read the story"
                />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
