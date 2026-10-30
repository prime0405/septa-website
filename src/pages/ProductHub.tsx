import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, Layers, Send } from "lucide-react";
import { CtaBand, PageHero } from "../components/blocks/PageHero";
import { ArchitectureStack } from "../components/visuals/FeaturePanels";
import { ProcessSteps } from "../components/visuals/ProcessSteps";
import { ServiceIcon } from "../components/blocks/ServiceIcon";
import { Accordion } from "../components/ui/Accordion";
import { Button } from "../components/ui/Button";
import {
  Callout,
  Card,
  MarkerList,
  Pill,
  Reveal,
  Section,
  SectionHeading,
} from "../components/ui/primitives";
import { products } from "../data/products";
import { serviceBySlug } from "../data/services";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const sharedStandard = [
  {
    label: "Working software from the second week",
    detail: "Demos of a system that actually runs.",
  },
  { label: "Typed, reviewed code in your repository", detail: "The people who scope the work review it." },
  { label: "Tests on the paths that matter", detail: "Coverage aimed at the places a failure would cost you something." },
  {
    label: "Monitoring from the first release",
    detail: "Latency, errors, cost and usage visible before the first complaint.",
  },
  {
    label: "Documentation written for the next team",
    detail: "Decision records, runbooks and a handover walkthrough.",
  },
];

const sharedFaq = [
  {
    q: "Why are these separate from the service pages?",
    a: "Services describe what Septa offers to a buyer. Product development pages describe how a build actually runs: the sequence, the artefacts and the decisions at each stage. They cross-link so you can read either first.",
    links: [
      { label: "Read the services instead", to: "/services" },
      { label: "AI Product Development service", to: "/services/ai-product-development" },
    ],
  },
  {
    q: "Do we need a discovery phase if we already know what to build?",
    a: "Sometimes. If the requirement is genuinely stable, discovery shrinks to a data and integration check plus an agreed success measure. If it is not stable, skipping discovery is how projects end up rebuilding the same screen three times.",
  },
  {
    q: "Who owns the code?",
    a: "You do. Repositories, pipelines and cloud accounts are yours from the start, and transition checkpoints go in the plan rather than appearing at the end of a contract.",
  },
  {
    q: "Can you take over an existing codebase?",
    a: "Yes. That is usually framed as modernisation or reliability work rather than a new build, and starts with a read-only review before anything changes.",
    links: [{ label: "Digital Transformation", to: "/services/digital-transformation" }],
  },
];

export default function ProductHub() {
  usePageMeta({
    title: "Product Development",
    description:
      "Two product-development tracks at Septa: AI-enabled products and conventional software products, built to the same engineering standard.",
  });

  const ai = products.find((p) => p.slug === "ai")!;
  const traditional = products.find((p) => p.slug === "traditional")!;
  const aiService = serviceBySlug("ai-product-development");

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "Product Development" }]}
        eyebrow="Product development"
        title="Two build tracks. One engineering standard."
        lead="Whether the feature uses a model or a database index, the work is the same shape: understand the decision, prove the riskiest part, build in increments, measure it, release it safely, then hand it over so it stays healthy without us."
        meta={
          <>
            <Pill tone="mint">
              <BrainCircuit className="size-3.5" /> AI-enabled products
            </Pill>
            <Pill tone="mint">
              <Layers className="size-3.5" /> Conventional software
            </Pill>
            <Pill tone="line">Your repository, your accounts</Pill>
          </>
        }
        actions={
          <>
            <Button to={paths.request()} size="lg" iconEnd={<Send className="size-4" />}>
              Request a build
            </Button>
            <Button to={paths.cases()} size="lg" variant="secondary">
              Worked examples
            </Button>
          </>
        }
        aside={
          <Reveal>
            <ArchitectureStack />
          </Reveal>
        }
      />

      {/* --------------------------- tracks ---------------------------- */}
      <Section className="section">
        <SectionHeading
          eyebrow="Choose a track"
          title="Start with the kind of thing you are making"
          lead="Most engagements end up using both: a conventional application with one AI feature inside it. The distinction is about where the risk sits."
          className="mb-10"
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {[ai, traditional].map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06} className="h-full">
              <Card className="flex h-full flex-col p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-12 items-center justify-center rounded-xl border border-mint/25 bg-mint/[0.07] text-mint">
                    {p.slug === "ai" ? (
                      <ServiceIcon icon="ai" className="size-6" />
                    ) : (
                      <Layers className="size-6" />
                    )}
                  </span>
                  <span className="font-mono text-[0.7rem] text-faint">
                    track {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h2 className="mt-6 text-[1.5rem]">{p.name}</h2>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.navBlurb}</p>

                <ul className="mt-6 space-y-2.5">
                  {p.problems.slice(0, 3).map((problem) => (
                    <li key={problem} className="flex gap-3 text-[0.88rem] text-muted">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-mint/60" />
                      {problem}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {p.capabilities.map((c) => (
                    <span
                      key={c.group}
                      className="rounded-pill border border-line bg-surface px-3 py-1 text-[0.76rem] text-muted"
                    >
                      {c.group}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex flex-wrap gap-3 pt-7">
                  <Button to={paths.product(p.slug)} size="sm">
                    Open the track
                  </Button>
                  <Button to={paths.request(p.name)} size="sm" variant="secondary">
                    Request this
                  </Button>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        {aiService ? (
          <Callout kind="info" title="How this relates to the service pages" className="mt-8">
            <p>
              The AI Product Development service page states what Septa offers; the{" "}
              <Link to={paths.product("ai")} className="text-mint hover:underline">
                AI build track
              </Link>{" "}
              walks through what the build involves, and the{" "}
              <Link to={paths.service("ai-product-development")} className="text-mint hover:underline">
                {aiService.name}
              </Link>{" "}
              service page covers strategy, evaluation, deployment and responsible-AI considerations.
            </p>
          </Callout>
        ) : null}
      </Section>

      {/* ------------------------- standard ---------------------------- */}
      <Section tone="raised" className="section border-y border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Engineering standard"
            title="What stays constant whichever track you pick"
            lead="These are commitments about how we work, not claims about outcomes for named clients."
          />
          <Reveal>
            <MarkerList items={sharedStandard} />
          </Reveal>
        </div>
      </Section>

      {/* ------------------------- lifecycle --------------------------- */}
      <Section className="section">
        <SectionHeading
          eyebrow="Idea to running product"
          title="The product-development lifecycle"
          lead="Identical on both tracks. On the AI track, the evaluation step carries more weight because the behaviour is probabilistic."
          className="mb-9"
        />
        <ProcessSteps
          columns={3}
          caption="Durations depend on scope; the sequence does not."
          steps={[
            {
              title: "Discovery",
              detail: "Requirements, constraints, data reality and the success measure agreed in writing.",
              note: "Output: brief",
            },
            {
              title: "Design",
              detail: "Flows, interface and the architecture options, with what each one costs stated.",
              note: "Output: designs + ADRs",
            },
            {
              title: "Build",
              detail: "Two-week increments, reviewed code, integrations wired early rather than last.",
              note: "Output: software",
            },
            {
              title: "Test",
              detail: "Unit and end-to-end coverage on risky paths, plus accessibility and load checks.",
              note: "Output: evidence",
            },
            {
              title: "Release",
              detail: "Staged rollout, monitoring, rollback rehearsed before it is needed.",
              note: "Output: live product",
            },
            {
              title: "Iterate",
              detail: "Improvement argued with usage and incident data, then handed over or continued.",
              note: "Output: roadmap",
            },
          ]}
        />
      </Section>

      {/* --------------------------- FAQ ------------------------------- */}
      <Section tone="surface" className="section border-y border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Questions" title="Asked before a build starts" />
            <Button to={paths.contact()} variant="ghost" size="sm" className="mt-6">
              Ask something else
            </Button>
          </div>
          <Accordion items={sharedFaq} />
        </div>
      </Section>

      {/* ------------------------- cross-links ------------------------- */}
      <Section className="section">
        <SectionHeading eyebrow="Elsewhere" title="Pages that may be what you meant" className="mb-8" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "All services", to: paths.services(), hint: "The five lines of work" },
            { label: "Case studies", to: paths.cases(), hint: "Sample scenarios, labelled as such" },
            { label: "Talent Solution", to: paths.service("talent-solution"), hint: "Add people to your own delivery" },
            { label: "Contact", to: paths.contact(), hint: "A question before a request" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="card card-hover group flex items-center justify-between gap-3 p-5"
            >
              <span>
                <span className="block text-[0.98rem] text-fg group-hover:text-mint">{l.label}</span>
                <span className="mt-1 block text-[0.8rem] text-faint">{l.hint}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-faint transition-transform group-hover:translate-x-1 group-hover:text-mint" />
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Have something to build?"
        lead="Pick the closest service in step one of the request form, describe the problem in your own words, and we will come back with a point of view."
        primaryLabel="Request a Service"
        secondary={{ label: "Contact us", to: paths.contact() }}
      />
    </>
  );
}
