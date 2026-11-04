import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CtaSection } from "../components/blocks/CtaSection";
import { PageHero } from "../components/blocks/PageHero";
import {
  Card,
  EmptyState,
  MarkerList,
  Pill,
  Reveal,
  Section,
  SectionHeading,
} from "../components/ui/primitives";
import { Button } from "../components/ui/Button";
import { useCaseBySlug, useCases } from "../data/useCases";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

export default function UseCaseDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const study = useCaseBySlug(slug);

  usePageMeta({
    title: study ? study.title : "Case study not found",
    description: study?.overview,
    noindex: !study,
  });

  if (!study) {
    return (
      <div className="wrap section">
        <EmptyState heading="h1" title="That case study does not exist">
          The link may be out of date. These are the use cases the revamp document supplies.
        </EmptyState>
        <ul className="mx-auto mt-8 grid max-w-2xl gap-2 sm:grid-cols-2">
          {useCases.map((u) => (
            <li key={u.slug}>
              <Link
                to={paths.case(u.slug)}
                className="card card-hover flex items-center justify-between gap-3 p-4 text-[0.9rem]"
              >
                {u.title}
                <ArrowRight className="size-4 text-faint" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", to: paths.home() },
          { label: "Case Studies", to: paths.cases() },
          { label: study.client },
        ]}
        eyebrow={study.client}
        title={study.title}
        lead={study.overview}
        meta={
          <>
            <Pill tone="mint">{study.kind}</Pill>
            {study.products ? (
              <Pill tone="line">{study.products.length} products developed</Pill>
            ) : null}
            <Pill tone="line">{study.process.length}-step product development process</Pill>
          </>
        }
        actions={
          <Button to={paths.request(study.client)} size="lg">
            Start building
          </Button>
        }
      />

      {/* -------------------------------- the challenge ------------------------------- */}
      <Section wall="service-observability" className="section">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <SectionHeading eyebrow={study.client} title="The Challenge" className="lg:sticky lg:top-28 lg:self-start" />
          <Reveal>
            <p className="prose-body text-[1rem]">{study.challenge}</p>
          </Reveal>
        </div>
      </Section>

      {/* -------------------------------- our solution -------------------------------- */}
      <Section wall="service-automation" tone="raised" className="section border-y border-line-soft">
        <SectionHeading eyebrow={study.client} title="Our Solution" lead={study.solutionLead} className="mb-10" />
        {study.pillars ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {study.pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.04}>
                <Card className="card-hover h-full p-6">
                  <h3 className="text-[1.05rem]">{p.title}</h3>
                  <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted">{p.detail}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <MarkerList items={study.solution ?? []} />
          </Reveal>
        )}
      </Section>

      {/* ----------------------------- products developed ----------------------------- */}
      {study.products ? (
        <Section wall="use-case" className="section">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <SectionHeading eyebrow={study.client} title="Products Developed" className="lg:sticky lg:top-28 lg:self-start" />
            <Reveal>
              <MarkerList items={study.products} />
            </Reveal>
          </div>
        </Section>
      ) : null}

      {/* ------------------------- product development process ------------------------- */}
      <Section wall="cases" tone="surface" className="section border-y border-line-soft">
        <SectionHeading eyebrow={study.client} title="Product Development Process" className="mb-10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {study.process.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.04}>
              <Card className="h-full p-6">
                <span className="font-mono text-[0.72rem] text-mint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[1.02rem]">{step.title}</h3>
                {step.detail ? (
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{step.detail}</p>
                ) : null}
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ----------------------------- tools & technologies ---------------------------- */}
      <Section wall="blog" className="section">
        <SectionHeading
          eyebrow={study.client}
          title="Tools & Technologies"
          lead={study.toolsLead}
          className="mb-10"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {study.tools.map((group, gi) => (
            <Reveal key={group.heading ?? gi} delay={gi * 0.04}>
              <Card className="h-full p-6">
                {group.heading ? (
                  <p className="eyebrow mb-4">{group.heading}</p>
                ) : null}
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[0.88rem] leading-relaxed text-muted"
                    >
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-mint/70" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaSection
        wall="engage"
        headline={study.title}
        copy={study.overview}
        label="Start building"
        to={paths.request(study.client)}
      />
    </>
  );
}
