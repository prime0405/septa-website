import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CircleSlash } from "lucide-react";
import { CtaBand, PageHero } from "../components/blocks/PageHero";
import { CaseCard, RequestInline } from "../components/blocks/cards";
import { Button } from "../components/ui/Button";
import {
  Callout,
  Card,
  EmptyState,
  Pill,
  Reveal,
  SampleTag,
  Section,
  SectionHeading,
} from "../components/ui/primitives";
import type { CaseStudy } from "../data/cases";
import { caseBySlug, caseStudies } from "../data/cases";
import { productBySlug } from "../data/products";
import { serviceBySlug } from "../data/services";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

function StackRow({ study }: { study: CaseStudy }) {
  return (
    <dl className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
      {[
        { k: "Category", v: study.category },
        { k: "Scenario", v: study.clientDescriptor },
        { k: "Period", v: study.year },
        { k: "Services used", v: study.services.map((s) => serviceBySlug(s)?.name ?? s).join(", ") },
      ].map((row) => (
        <div key={row.k} className="bg-[#11181d] px-5 py-4">
          <dt className="font-mono text-[0.68rem] tracking-wider text-faint uppercase">{row.k}</dt>
          <dd className="mt-1.5 text-[0.92rem] text-fg">{row.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function CaseDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const study = caseBySlug(slug);

  usePageMeta({
    title: study ? study.title : "Case study not found",
    description: study?.summary,
    noindex: !study || study.results.some((r) => !r.verified),
  });

  if (!study) {
    return (
      <div className="wrap section">
        <EmptyState
          heading="h1"
          icon={<CircleSlash className="size-5" />}
          title="No case study at this address"
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button to={paths.cases()} size="sm">
                All case studies
              </Button>
              <Button to={paths.request()} size="sm" variant="secondary">
                Request a Service
              </Button>
            </div>
          }
        >
          The study may have been renamed. Here is what is currently published.
        </EmptyState>
        <div className="mx-auto mt-10 grid max-w-3xl gap-3">
          {caseStudies.map((c) => (
            <Link
              key={c.slug}
              to={paths.case(c.slug)}
              className="card card-hover flex items-center justify-between gap-4 p-4"
            >
              <span className="text-[0.92rem] text-fg">{c.title}</span>
              <ArrowRight className="size-4 shrink-0 text-faint" aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const related = study.relatedSlugs
    .map((s) => caseBySlug(s))
    .filter((c): c is CaseStudy => Boolean(c));

  const unverified = study.results.filter((r) => !r.verified);

  return (
    <>
      <PageHero
        crumbs={[
          { label: "Home", to: paths.home() },
          { label: "Case Studies", to: paths.cases() },
          { label: study.title },
        ]}
        eyebrow={`Case study · ${study.category}`}
        title={study.title}
        lead={study.summary}
        meta={
          <>
            <Pill tone="mint">{study.category}</Pill>
            <Pill tone="line">{study.clientDescriptor}</Pill>
            <SampleTag label="Illustrative scenario" />
          </>
        }
        actions={
          <>
            <Button to={paths.request()} size="lg">
              Request a similar solution
            </Button>
            <Button to={paths.cases()} size="lg" variant="secondary" iconStart={<ArrowLeft className="size-4" />}>
              All case studies
            </Button>
          </>
        }
        aside={
          <Reveal>
            <div className="relative">
              <div aria-hidden className="glow-mint pointer-events-none absolute inset-0 opacity-45" />
              <div className="relative rounded-card border border-line bg-[#0d1317]/85 p-5">
                <p className="mb-4 font-mono text-[0.68rem] tracking-[0.18em] text-faint uppercase">
                  At a glance
                </p>
                <ul className="space-y-3">
                  {study.objectives.slice(0, 4).map((o) => (
                    <li key={o} className="flex gap-3 text-[0.88rem] text-muted">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-mint/60" />
                      {o}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 border-t border-line pt-4">
                  <p className="eyebrow mb-2.5">Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {study.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-line bg-[#10171c] px-2 py-1 font-mono text-[0.7rem] text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        }
      />

      <Section className="section">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          {/* ------------------------- narrative ------------------------- */}
          <div className="space-y-14">
            <div>
              <SectionHeading as="h2" eyebrow="01 Background" title="Where this started" className="mb-5" />
              <p className="prose-body text-[1rem]">{study.background}</p>
            </div>

            <div>
              <SectionHeading as="h2" eyebrow="02 The challenge" title="What made it hard" className="mb-5" />
              <p className="prose-body text-[1rem]">{study.challenge}</p>
              <Card className="mt-6 border-mint/25 bg-[#101b20] p-5">
                <p className="eyebrow mb-3">Problem statement</p>
                <p className="text-[0.95rem] leading-relaxed text-fg">{study.problem}</p>
              </Card>
            </div>

            <div>
              <SectionHeading as="h2" eyebrow="03 Objectives" title="What success had to look like" className="mb-6" />
              <ol className="grid gap-3 sm:grid-cols-2">
                {study.objectives.map((o, i) => (
                  <li
                    key={o}
                    className="flex gap-3.5 rounded-card border border-line bg-[#11181d] px-4 py-3.5"
                  >
                    <span className="font-mono text-[0.72rem] text-mint">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[0.9rem] text-muted">{o}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <SectionHeading as="h2" eyebrow="04 The solution" title="What we built and why" className="mb-6" />
              <p className="prose-body mb-8 text-[1rem]">{study.solutionOverview}</p>
              <div className="space-y-4">
                {study.solution.map((s, i) => (
                  <Reveal key={s.title} delay={i * 0.04}>
                    <div className="relative overflow-hidden rounded-card border border-line bg-[#11181d] p-5">
                      <div
                        aria-hidden
                        className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-mint/70 to-transparent"
                      />
                      <h3 className="text-[1.02rem]">{s.title}</h3>
                      <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{s.detail}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading as="h2" eyebrow="05 Implementation" title="How it went in" className="mb-6" />
              <ol className="relative space-y-6 border-l border-line pl-6">
                {study.implementation.map((s, i) => (
                  <li key={s.title} className="relative">
                    <span
                      aria-hidden
                      className="absolute top-1.5 -left-[26px] size-2.5 rounded-full border border-mint/60 bg-ink"
                    />
                    <p className="font-mono text-[0.68rem] tracking-wider text-faint uppercase">
                      step {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1.5 text-[1rem]">{s.title}</h3>
                    <p className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">{s.detail}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <SectionHeading as="h2" eyebrow="06 Technology stack" title="What was used" className="mb-6" />
              <StackRow study={study} />
              <div className="mt-5 flex flex-wrap gap-1.5">
                {study.stack.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-line bg-[#10171c] px-2.5 py-1 font-mono text-[0.74rem] text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <SectionHeading
                as="h2"
                eyebrow="07 Results"
                title="What changed"
                lead="Figures below are not verified measurements. They describe the intended direction of travel for this sample scenario."
                className="mb-6"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {study.results.map((r, i) => (
                  <Reveal key={r.label} delay={i * 0.04} className="h-full">
                    <Card className="flex h-full flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[0.82rem] text-faint">{r.label}</p>
                        <Pill tone="amber" className="shrink-0 font-mono uppercase">
                          unverified
                        </Pill>
                      </div>
                      <p className="mt-3 flex-1 text-[1.05rem] text-fg">{r.value}</p>
                      <p className="mt-4 border-t border-line pt-3 text-[0.78rem] leading-relaxed text-faint">
                        To publish: {r.note}
                      </p>
                    </Card>
                  </Reveal>
                ))}
              </div>

              {unverified.length ? (
                <Callout kind="warn" title="Do not quote these numbers" className="mt-6">
                  <p>
                    None of the results on this page are measured outcomes from a real Septa
                    engagement. They exist so the template shows the right shape: a metric, a
                    direction, and the evidence that would be needed to publish it. Replace{" "}
                    <code className="font-mono text-[0.8rem]">src/data/cases.ts</code> with
                    client-approved studies before launch.
                  </p>
                </Callout>
              ) : null}
            </div>

            <div>
              <SectionHeading as="h2" eyebrow="08 Lessons learned" title="What we would carry forward" className="mb-6" />
              <ul className="grid gap-3">
                {study.lessons.map((l, i) => (
                  <li
                    key={l}
                    className="flex gap-4 rounded-card border border-line bg-[#11181d] px-5 py-4"
                  >
                    <span className="font-mono text-[0.72rem] text-mint/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.93rem] text-muted">{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            <RequestInline label="Request a solution like this" />
          </div>

          {/* --------------------------- rail ---------------------------- */}
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <Card className="p-5">
              <p className="eyebrow mb-4">This study used</p>
              <ul className="space-y-2">
                {study.services.map((s) => {
                  const service = serviceBySlug(s);
                  const product = service ? null : productBySlug(s);
                  const label = service?.name ?? product?.name ?? null;
                  const to = service ? paths.service(s) : product ? paths.product(s) : null;
                  const row = (
                    <span className="text-[0.88rem] text-muted group-hover:text-fg">{label ?? s}</span>
                  );
                  return (
                    <li key={s}>
                      {to ? (
                        <Link
                          to={to}
                          className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-[#10171c] px-3.5 py-2.5 transition-colors hover:border-mint/45"
                        >
                          {row}
                          <ArrowRight className="size-3.5 text-faint group-hover:text-mint" aria-hidden />
                        </Link>
                      ) : (
                        <span className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-line px-3.5 py-2.5">
                          {row}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>

            <Card className="border-mint/25 bg-[#101b20] p-5">
              <p className="eyebrow mb-3">Talk about your version</p>
              <p className="text-[0.88rem] leading-relaxed text-muted">
                Send the situation in your own words. We reply with which parts of this approach
                transfer and which do not.
              </p>
              <Button to={paths.request()} size="sm" className="mt-4">
                Request a Service
              </Button>
            </Card>

            <Card className="p-5">
              <p className="eyebrow mb-3">Status of this page</p>
              <p className="text-[0.85rem] leading-relaxed text-faint">
                Written as a demonstration of the case-study template. No client, project or metric
                here should be attributed to Septa.
              </p>
            </Card>
          </aside>
        </div>
      </Section>

      {related.length ? (
        <Section tone="raised" className="section border-y border-line-soft">
          <SectionHeading
            eyebrow="Related"
            title="Other studies worth reading"
            action={
              <Button to={paths.cases()} variant="ghost" size="sm">
                View all
              </Button>
            }
            className="mb-9"
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {related.map((r) => (
              <CaseCard key={r.slug} study={r} />
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand
        title="Facing something similar?"
        lead="You do not need the architecture worked out. Describe the operational pain and we will bring the options."
        secondary={{ label: "More case studies", to: paths.cases() }}
      />
    </>
  );
}
