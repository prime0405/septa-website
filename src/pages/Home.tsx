import { Link } from "react-router-dom";
import { ArrowRight, Compass, Layers, Search, Send, Users2 } from "lucide-react";
import { AiDeliveryPanel, ArchitectureStack } from "../components/visuals/FeaturePanels";
import { HeroDiagram } from "../components/visuals/HeroDiagram";
import { ProcessSteps } from "../components/visuals/ProcessSteps";
import { CaseCard, PostCard, ServiceCard } from "../components/blocks/cards";
import { Logo } from "../components/layout/Logo";
import { CtaBand } from "../components/blocks/PageHero";
import { LaunchNoteInline } from "../components/blocks/LaunchNote";
import { Button } from "../components/ui/Button";
import {
  Card,
  MarkerList,
  Pill,
  Reveal,
  SampleTag,
  Section,
  SectionHeading,
} from "../components/ui/primitives";
import { caseStudies } from "../data/cases";
import { posts } from "../data/posts";
import { serviceBySlug } from "../data/services";
import { products } from "../data/products";
import { site } from "../lib/site";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const deliveryProcess = [
  { title: "Discovery", detail: "Find the real decision, the actual constraint and the system that quietly runs the process.", note: "Week 1–2" },
  { title: "Prototype", detail: "A thin, working slice that answers the riskiest question first.", note: "Days, not quarters" },
  { title: "Build", detail: "Two-week increments of shippable software, reviewed in your repository.", note: "Visible progress" },
  { title: "Evaluate", detail: "Tests on the paths that matter, plus measurement of quality, cost and latency.", note: "Blocks regressions" },
  { title: "Ship", detail: "Staged release with monitoring from the first user, and a practised rollback.", note: "Hypercare period" },
  { title: "Operate", detail: "Improve against the baseline, hand over properly, stay reachable.", note: "Then repeat" },
];

export default function Home() {
  usePageMeta({ title: site.name });

  const ai = serviceBySlug("ai-product-development")!;
  const talent = serviceBySlug("talent-solution")!;

  return (
    <>
      {/* ------------------------------ hero ------------------------------ */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-45" />
        <div
          aria-hidden
          className="pointer-events-none absolute top-[-18%] left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-mint/[0.09] blur-[110px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-14%] left-[-7%] hidden size-[360px] opacity-[0.055] lg:block"
        >
          <Logo className="size-full" />
        </div>
        <div className="wrap relative grid items-center gap-12 py-16 sm:py-20 lg:min-h-[calc(100svh-72px)] lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:py-10">
          <div>
            <Reveal>
              <p className="eyebrow mb-5">
                AI · Software · Automation · Transformation · Observability · Talent
              </p>
            </Reveal>

            <h1 className="text-[clamp(2.5rem,6.6vw,4.4rem)] leading-[0.98]">
              Build Smarter.
              <br />
              Automate Better.
              <br />
              <span className="text-mint">Scale Faster.</span>
            </h1>

            <p className="prose-body mt-6 max-w-xl text-[1.06rem]">
              Septa helps organisations turn hard operational problems into intelligent products,
              connected workflows and modern systems — then keeps them running. We design, build,
              test, deploy and observe software, and strengthen the teams around it.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={paths.services()} size="lg" iconEnd={<ArrowRight className="size-4" />}>
                Explore Our Services
              </Button>
              <Button to={paths.request()} size="lg" variant="outline-mint">
                Request a Service
              </Button>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[0.75rem] text-faint">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-mint" aria-hidden />
                discovery → prototype → build → ship → observe
              </span>
              <span>Your repository, your accounts, your code</span>
              <span className="hidden sm:inline">Senior engineers in the work, not beside it</span>
            </div>
          </div>

          <div className="relative">
            <HeroDiagram className="mx-auto w-full max-w-[520px]" />
          </div>
        </div>

        {/* tech strip */}
        <div className="relative border-t border-line-soft bg-[#0b1114]">
          <div className="wrap flex gap-3 overflow-x-auto py-4 [scrollbar-width:none]">
            {[
              "React",
              "TypeScript",
              "Node.js",
              "Python",
              "PostgreSQL",
              "OpenTelemetry",
              "Retrieval-augmented generation",
              "Model evaluation",
              "Kubernetes",
              "Terraform",
              "Grafana",
              "Workflow orchestration",
            ].map((t) => (
              <span key={t} className="shrink-0 rounded-pill border border-line px-3 py-1 font-mono text-[0.72rem] whitespace-nowrap text-faint">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------- company intro -------------------------- */}
      <Section className="section">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              as="h2"
              eyebrow="Who we are"
              title="A technology partner for the part that is actually hard"
              lead="Septa is a technology company that builds and modernises software: AI products, conventional applications, workflow automation, observability and the teams that sustain them. We are most useful when a system matters — when being wrong has a cost, and somebody has to be accountable afterwards."
              action={
                <Button to={paths.about()} variant="secondary" size="sm">
                  About Septa
                </Button>
              }
            />
          </div>
          <Reveal delay={0.1}>
            <div className="space-y-6">
              <p className="prose-body">
                We take work in three shapes: build something new, fix or modernise something that
                exists, and strengthen the team doing it. Most engagements mix all three.
              </p>
              <MarkerList
                items={[
                  { label: "Products with AI inside them", detail: "Grounded, evaluated, and reversible when a model changes." },
                  { label: "Software that stays cheap to change", detail: "Typed, tested, documented, and handed over properly." },
                  { label: "Processes stitched together", detail: "Integrations with retries, ownership and alerting." },
                  { label: "Systems you can see inside", detail: "Metrics, logs and traces wired to alerts people answer." },
                  { label: "Capacity when you are short", detail: "Specialists, squads or hiring support, planned around." },
                ]}
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ----------------------------- services ---------------------------- */}
      <Section tone="raised" className="section border-y border-line-soft">
        <SectionHeading
          eyebrow="Services"
          title="Five ways we take work"
          lead="Each service has its own page with capabilities, process, use cases and questions we would want answered."
          action={
            <Button to={paths.services()} variant="secondary" size="sm" iconEnd={<ArrowRight className="size-4" />}>
              All services
            </Button>
          }
          className="mb-10"
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <ServiceCard service={ai} href={paths.service(ai.slug)} />
          </Reveal>
          <Reveal delay={0.06} className="lg:col-span-5">
            <ServiceCard
              service={serviceBySlug("workflow-automation")!}
              href={paths.service("workflow-automation")}
              compact
            />
          </Reveal>
          <Reveal delay={0.04} className="lg:col-span-4">
            <ServiceCard
              service={serviceBySlug("digital-transformation")!}
              href={paths.service("digital-transformation")}
              compact
            />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-4">
            <ServiceCard
              service={serviceBySlug("observability-monitoring")!}
              href={paths.service("observability-monitoring")}
              compact
            />
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-4">
            <ServiceCard service={talent} href={paths.service(talent.slug)} compact />
          </Reveal>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <Link
                to={paths.product(p.slug)}
                className="card card-hover group flex items-center gap-4 p-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-[#10171c] text-mint">
                  <Layers className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[0.66rem] tracking-[0.18em] text-faint uppercase">
                    Product development track
                  </span>
                  <span className="mt-1 block text-[1.02rem] text-fg group-hover:text-mint">
                    {p.name}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-mint" aria-hidden />
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------ AI feature highlight ---------------------- */}
      <Section className="section">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <p className="eyebrow mb-5">AI product development</p>
              <h2 className="text-[clamp(1.7rem,3.6vw,2.5rem)]">
                From a demo that impresses a room to a feature that survives an audit
              </h2>
              <p className="prose-body mt-5">
                The difference between a pilot and a product is measurement. We define what a good
                answer means with your domain team, build the evaluation set that encodes it, and
                ship behind flags with citations, guardrails and cost tracking from the first release.
              </p>
              <div className="mt-7 space-y-3">
                {[
                  "Retrieval with source citations, not vibes",
                  "Golden-set evaluation running in the pipeline",
                  "Latency, cost and correction rates on one dashboard",
                  "Refusal policy and human review where errors are costly",
                ].map((l) => (
                  <p key={l} className="flex items-start gap-3 text-[0.92rem] text-muted">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-mint" aria-hidden />
                    {l}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to={paths.service("ai-product-development")} size="md">
                  How we build AI products
                </Button>
                <Button to={paths.product("ai")} variant="secondary" size="md">
                  The product-development track
                </Button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <AiDeliveryPanel />
          </Reveal>
        </div>
      </Section>

      {/* ------------------- Traditional product development ---------------- */}
      <Section tone="surface" className="section border-y border-line-soft">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <ArchitectureStack />
          </Reveal>
          <Reveal delay={0.06} className="order-1 lg:order-2">
            <div>
              <p className="eyebrow mb-5">Traditional product development</p>
              <h2 className="text-[clamp(1.7rem,3.6vw,2.5rem)]">
                Ordinary software, engineered with unusual care
              </h2>
              <p className="prose-body mt-5">
                Portals, platforms, APIs, internal tools and data products. Discovery, requirements,
                design, architecture, build, test, deploy — and the discipline that decides whether
                the codebase is still cheap to change in year three.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  { Icon: Compass, label: "Discovery and requirements that get written down" },
                  { Icon: Layers, label: "Architecture reviewed for the next team" },
                  { Icon: Search, label: "Tests on the paths that would actually hurt" },
                  { Icon: Send, label: "Deploys with rollback that has been practised" },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex gap-3 rounded-card border border-line bg-[#10171c] p-3.5">
                    <Icon className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden />
                    <span className="text-[0.86rem] leading-snug text-muted">{label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button to={paths.product("traditional")} size="md" variant="outline-mint">
                  See how product work runs
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* --------------------------- case studies -------------------------- */}
      <Section className="section">
        <SectionHeading
          eyebrow="Case studies"
          title="How this kind of work goes"
          lead="The studies below are illustrative sample scenarios written to show the shape of a Septa engagement — the problem framing, the sequence, the trade-offs. They are not client references, and their outcomes are not measured results."
          action={
            <Button to={paths.cases()} variant="secondary" size="sm" iconEnd={<ArrowRight className="size-4" />}>
              All case studies
            </Button>
          }
          className="mb-4"
        />
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <SampleTag label="Placeholder content — real studies pending approval" />
          <LaunchNoteInline label="Replace with client-approved case studies" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal className="lg:col-span-2">
            <CaseCard study={caseStudies[0]} featured />
          </Reveal>
          {caseStudies.slice(1, 3).map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <CaseCard study={c} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------ process ---------------------------- */}
      <Section tone="raised" className="section border-y border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Our approach"
              title="A delivery loop, not a waterfall with better slides"
              lead="Every engagement runs the same spine. What changes is how long each stage takes and who is in the room."
            />
            <div className="mt-7 flex flex-wrap gap-2">
              <Pill tone="mint">Two-week increments</Pill>
              <Pill tone="line">Software, not status decks</Pill>
              <Pill tone="line">Written trade-offs</Pill>
            </div>
            <Button to={paths.about()} variant="ghost" size="sm" className="mt-6">
              More about how we work
            </Button>
          </div>
          <Reveal delay={0.06}>
            <ProcessSteps steps={deliveryProcess} columns={3} />
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------ why us ----------------------------- */}
      <Section className="section">
        <SectionHeading
          eyebrow="Why Septa"
          title="Reasons organisations pick us, in their words"
          lead="Not testimonials — these are the practical differences we are able to commit to on this page."
          className="mb-10"
        />
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "One team across the path",
              detail:
                "Strategy, design, engineering, automation and observability sit in the same conversation, so nothing falls between vendors.",
            },
            {
              title: "The scopers build it",
              detail:
                "Senior people do the work they estimated. No relay from an account team to strangers.",
            },
            {
              title: "Evidence over confidence",
              detail:
                "A prototype and a measurement beat a promise. If the evidence says stop, we say stop.",
            },
            {
              title: "You keep the keys",
              detail:
                "Your repository, your cloud accounts, your documentation. Transition is scheduled from day one.",
            },
            {
              title: "Costs named early",
              detail:
                "Inference, hosting and integration effort are modelled before commitment, not discovered later.",
            },
            {
              title: "Reliability included",
              detail:
                "Instrumentation, alerting and rollback are in scope on everything we build, not an upsell.",
            },
          ].map((w, i) => (
            <Reveal key={w.title} delay={i * 0.04}>
              <div className="group flex gap-4 border-l border-line pl-5 transition-colors hover:border-mint/50">
                <span className="font-mono text-[0.72rem] text-mint/70">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[1.05rem]">{w.title}</h3>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{w.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------ talent ----------------------------- */}
      <Section tone="surface" className="section border-y border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div>
            <p className="eyebrow mb-5">Talent solutions</p>
            <h2 className="text-[clamp(1.7rem,3.6vw,2.5rem)]">
              Sometimes the missing piece is people
            </h2>
            <p className="prose-body mt-5">
              A specialist who can work unsupervised, a squad that owns a product line, or technical
              screening your hiring team does not have time to run well. Engagement shape is agreed
              against the outcome, not a headcount target.
            </p>
            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {[
                "Technical talent sourcing",
                "Developer placement",
                "Dedicated development teams",
                "Project-based staffing",
                "Team augmentation",
                "Technical role matching",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-[0.9rem] text-muted">
                  <span className="size-1.5 rounded-full bg-mint/70" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to={paths.service("talent-solution")}>Talent Solution service</Button>
              <Button to={paths.careers()} variant="secondary" iconStart={<Users2 className="size-4" />}>
                Work at Septa
              </Button>
            </div>
          </div>
          <Reveal delay={0.08}>
            <Card className="p-6">
              <p className="font-mono text-[0.68rem] tracking-[0.18em] text-faint uppercase">
                Latest writing
              </p>
              <div className="mt-4 space-y-4">
                {posts.slice(0, 3).map((p) => (
                  <PostCard key={p.slug} post={p} variant="compact" />
                ))}
              </div>
              <Button to={paths.blog()} variant="ghost" size="sm" className="mt-4">
                Read the blog
              </Button>
            </Card>
          </Reveal>
        </div>
      </Section>

      <CtaBand secondary={{ label: "Ask a question first", to: paths.contact() }} />
    </>
  );
}
