import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { CaseCard } from "../components/blocks/cards";
import { PageHero } from "../components/blocks/PageHero";
import { CasesHeroArt } from "../components/visuals/CasesHeroArt";
import {
  MarkerList,
  Pill,
  Reveal,
  Section,
  SectionHeading,
} from "../components/ui/primitives";
import { useCases } from "../data/useCases";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const kinds = Array.from(new Set(useCases.map((u) => u.kind)));

/**
 * The index down the hero's right margin: the five studies as a proof-sheet key, numbered in the
 * same order the sheet below lays them out. Every row is a real link to its study.
 */
const studyIndex = (
  <Reveal>
    <div className="relative overflow-hidden rounded-card border border-line bg-ink-raised/85 p-6">
      <div aria-hidden className="dot-bg absolute inset-0 opacity-30" />
      <div className="relative">
        <p className="eyebrow mb-4">The index</p>
        <ul className="space-y-3">
          {useCases.map((u, i) => (
            <li key={u.slug}>
              <Link
                to={paths.case(u.slug)}
                className="group flex items-baseline gap-3 text-[0.88rem] text-muted hover:text-mint"
              >
                <span className="font-mono text-[0.72rem] text-faint group-hover:text-mint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate">{u.client}</span>
                <span className="hidden font-mono text-[0.68rem] text-faint sm:inline">{u.kind}</span>
                <ArrowUpRight
                  className="size-3.5 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-mint"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-5 font-mono text-[0.66rem] tracking-[0.14em] text-faint uppercase">
          Documented work, supplied by Septa
        </p>
      </div>
    </div>
  </Reveal>
);

export default function Cases() {
  usePageMeta({
    title: "Our Product Development Use Case Study",
    description:
      "The product development use cases Septa supplies: Halogen Group, EHCC Clock-In App, Preppod, Septa LMS and TOVIRI.",
  });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "Case Studies" }]}
        eyebrow="Product Development"
        title="Our Product Development Use Case Study"
        lead="Five pieces of work, written up the same way each time: the situation, the challenge, what we built, how it was delivered and what it was built with. No outcomes are claimed here beyond what each study states."
        meta={
          <>
            <Pill tone="mint">{useCases.length} studies</Pill>
            <Pill tone="line">{kinds.length} kinds of work</Pill>
          </>
        }
        art={<CasesHeroArt />}
        aside={studyIndex}
      />

      <Section wall="services" className="section">
        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal className="lg:col-span-2">
            <CaseCard study={useCases[0]} featured />
          </Reveal>
          {useCases.slice(1).map((study, i) => (
            <Reveal key={study.slug} delay={i * 0.05}>
              <CaseCard study={study} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------- what a study documents ------------------------- */}
      <Section wall="service-automation" tone="raised" className="section">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="How to read one"
            title="What every study documents"
            lead="Each case follows the same spine, so two studies can be compared side by side without guessing what a section means."
          />
          <MarkerList
            items={[
              {
                label: "Overview and challenge",
                detail: "Who the client is and the situation the work had to answer.",
              },
              {
                label: "Our solution",
                detail: "What was built, as a lead paragraph plus bullets or numbered pillars.",
              },
              {
                label: "The process",
                detail: "The delivery steps in order, from workshop to testing and deployment.",
              },
              {
                label: "Tools and stack",
                detail: "The design, build and support tooling the work actually used.",
              },
            ]}
          />
        </div>
      </Section>
    </>
  );
}