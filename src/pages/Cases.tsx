import { CaseCard } from "../components/blocks/cards";
import { PageHero } from "../components/blocks/PageHero";
import { Reveal, Section } from "../components/ui/primitives";
import { useCases } from "../data/useCases";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

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
    </>
  );
}
