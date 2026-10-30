import { Link } from "react-router-dom";
import { ArrowRight, Compass, Send, Target } from "lucide-react";
import { CtaBand, PageHero } from "../components/blocks/PageHero";
import { DevNote, LaunchNoteInline } from "../components/blocks/LaunchNote";
import { ProcessSteps } from "../components/visuals/ProcessSteps";
import { HeroDiagram } from "../components/visuals/HeroDiagram";
import { Button } from "../components/ui/Button";
import {
  Callout,
  Card,
  MarkerList,
  Pill,
  Reveal,
  Section,
  SectionHeading,
  Unconfigured,
} from "../components/ui/primitives";
import {
  approach,
  howWeWork,
  mission,
  statsPlaceholders,
  techCapabilities,
  values,
  vision,
} from "../data/content";
import { services } from "../data/services";
import { site } from "../lib/site";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

export default function About() {
  usePageMeta({
    title: "About Us",
    description:
      "Septa's mission, values, technical capability and approach to delivery — a technology company building AI products, software, automation, modernisation and observability work.",
  });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "About Us" }]}
        eyebrow="About Septa"
        title="We make useful technology ordinary"
        lead="Septa exists for organisations that know they need better systems and do not know which problem to open with. We take the operational pain, work out what is really blocking it, and leave behind software — and a team that can keep improving it."
        meta={
          <>
            <Pill tone="mint">AI products</Pill>
            <Pill tone="mint">Software</Pill>
            <Pill tone="mint">Automation</Pill>
            <Pill tone="line">{services.length} service lines</Pill>
          </>
        }
        actions={
          <>
            <Button to={paths.request()} size="lg" iconEnd={<Send className="size-4" />}>
              Request a Service
            </Button>
            <Button to={paths.contact()} size="lg" variant="secondary">
              Talk to a person
            </Button>
          </>
        }
        aside={
          <Reveal>
            <HeroDiagram />
          </Reveal>
        }
      />

      {/* ------------------------- mission/vision ------------------------ */}
      <Section className="section">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <Card className="relative flex h-full flex-col overflow-hidden p-7">
              <div aria-hidden className="dot-bg pointer-events-none absolute inset-0 opacity-40" />
              <div className="relative flex-1">
                <span className="flex size-11 items-center justify-center rounded-xl border border-mint/30 bg-mint/[0.07] text-mint">
                  <Compass className="size-5.5" />
                </span>
                <h2 className="mt-6 text-[1.6rem]">Mission</h2>
                <p className="prose-body mt-4 text-[1rem]">{mission.statement}</p>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.06} className="h-full">
            <Card className="relative flex h-full flex-col overflow-hidden p-7">
              <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
              <div className="relative flex-1">
                <span className="flex size-11 items-center justify-center rounded-xl border border-mint/30 bg-mint/[0.07] text-mint">
                  <Target className="size-5.5" />
                </span>
                <h2 className="mt-6 text-[1.6rem]">Vision</h2>
                <p className="prose-body mt-4 text-[1rem]">{vision.statement}</p>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* --------------------------- numbers --------------------------- */}
      <Section tone="raised" className="section border-y border-line-soft">
        <SectionHeading
          eyebrow="By the numbers"
          title="Company facts that still need to be supplied"
          lead={
            <>
              Rather than publish plausible-sounding figures, Septa leaves these unset until the real
              numbers exist.
              <DevNote> Each one reads from src/lib/site.ts and src/data/content.ts.</DevNote>
            </>
          }
          className="mb-9"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsPlaceholders.map((s, i) => (
            <div key={s.label} className="rounded-card border border-dashed border-line bg-surface p-5">
              <p className="text-[0.82rem] text-faint">{s.label}</p>
              {s.value ? (
                <p className="mt-3 font-display text-[1.9rem] text-mint">{s.value}</p>
              ) : (
                <div className="mt-3">
                  <Unconfigured what={`real ${s.label.toLowerCase()}`} where="src/data/content.ts" />
                </div>
              )}
              <p className="mt-4 font-mono text-[0.66rem] text-faint">
                {String(i + 1).padStart(2, "0")} / {String(statsPlaceholders.length).padStart(2, "0")}
              </p>
            </div>
          ))}
        </div>
        <LaunchNoteInline label="Add founding year, headcount and client sectors before this section reads as company facts" />
      </Section>

      {/* --------------------------- values ---------------------------- */}
      <Section className="section">
        <SectionHeading
          eyebrow="Values"
          title="Five commitments we hold ourselves to in public"
          lead="These are written to be checkable — each one should be visible in how an engagement runs, not just on this page."
          className="mb-10"
        />
        <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <div key={v.title} className="group relative bg-surface-raised p-6 transition-colors hover:bg-surface">
              <span className="font-mono text-[0.7rem] text-faint transition-colors group-hover:text-mint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-[1.1rem]">{v.title}</h3>
              <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted">{v.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------ capabilities ------------------------- */}
      <Section tone="surface" className="section border-y border-line-soft">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Technical capability"
              title="What the team actually works with"
              lead="A statement of working competence, not a keyword list. Anything here we would happily be assessed on in a technical conversation."
            />
            <Button to={paths.cases()} variant="ghost" size="sm" className="mt-6" iconEnd={<ArrowRight className="size-4" />}>
              See it applied in the case studies
            </Button>
          </div>

          <div className="space-y-8">
            {techCapabilities.map((group, i) => (
              <Reveal key={group.group} delay={i * 0.04}>
                <div>
                  <div className="mb-4 flex items-center gap-4">
                    <h3 className="font-display text-[1.05rem] text-fg">{group.group}</h3>
                    <span aria-hidden className="h-px flex-1 bg-line" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[0.83rem] text-muted transition-colors hover:border-mint/40 hover:text-fg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* -------------------------- approach --------------------------- */}
      <Section className="section">
        <SectionHeading
          eyebrow="How we solve problems"
          title="The approach, in the order we apply it"
          lead="Problem-first, evidence-first, and designed for the team that inherits the result."
          className="mb-10"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {approach.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.04} className="h-full">
              <Card className="flex h-full flex-col p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-lg border border-mint/30 bg-mint/[0.07] font-mono text-[0.72rem] text-mint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden className="h-px flex-1 bg-line" />
                </div>
                <h3 className="text-[1.05rem]">{a.title}</h3>
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-muted">{a.detail}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ----------------------- delivery process ---------------------- */}
      <Section tone="raised" className="section border-y border-line-soft">
        <SectionHeading
          eyebrow="Delivery"
          title="The collaboration process"
          lead="Same spine whether the work is an AI feature, an automation, a migration or a staffing engagement."
          className="mb-9"
        />
        <ProcessSteps
          columns={3}
          caption="Every step ends with something inspectable — a brief, a prototype, running software, measurements, a release, documentation."
          steps={approach.map((a, i) => ({
            title: a.title,
            detail: a.detail,
            note: `stage ${String(i + 1).padStart(2, "0")}`,
          }))}
        />
      </Section>

      {/* -------------------------- how we work ------------------------ */}
      <Section className="section">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Ways of working"
              title="Inside Septa"
              lead="What it is like to work here, and therefore what it is like to work with us."
              className="mb-8"
            />
            <div className="grid gap-3">
              {howWeWork.map((h, i) => (
                <Reveal key={h.title} delay={i * 0.04}>
                  <div className="rounded-card border border-line bg-surface-raised px-5 py-4">
                    <h3 className="text-[1rem]">{h.title}</h3>
                    <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted">{h.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.06}>
            <div className="space-y-5">
              <Card className="p-6">
                <p className="eyebrow mb-4">What that means for you</p>
                <MarkerList
                  items={[
                    "The people who scope your work build your work.",
                    "Progress is demonstrated as software, not slides.",
                    "Costs and risks are named before commitment.",
                    "Handover is scheduled, not an afterthought.",
                  ]}
                />
              </Card>

              <Callout kind="setup" title="Not yet published on this page">
                <p>
                  Company history, founders, office locations and team photos have not been supplied,
                  so they are absent rather than invented.
                  <DevNote>
                    {" "}Add them in <code className="font-mono text-[0.8rem]">src/lib/site.ts</code> and{" "}
                    <code className="font-mono text-[0.8rem]">src/data/content.ts</code> — or say so and
                    they will be written properly.
                  </DevNote>
                </p>
              </Callout>

              <Card className="border-mint/25 bg-surface p-6">
                <p className="text-[0.95rem] text-fg">Working with {site.name}?</p>
                <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">
                  The fastest way to find out whether we are the right fit is to describe the problem.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button to={paths.request()} size="sm">
                    Request a Service
                  </Button>
                  <Link
                    to={paths.careers()}
                    className="inline-flex items-center gap-1.5 self-center text-[0.85rem] text-mint hover:underline"
                  >
                    Or see how we work from the inside
                    <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                </div>
              </Card>
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaBand
        title="Tell us what you are trying to fix"
        lead="A short description is enough to start. We come back with a point of view, not a brochure."
        secondary={{ label: "Meet the services", to: paths.services() }}
      />
    </>
  );
}
