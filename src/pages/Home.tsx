import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Compass, Layers, Search, Send, Users2 } from "lucide-react";
import { useIntroHeld } from "../lib/intro";
import { AiDeliveryPanel, ArchitectureStack } from "../components/visuals/FeaturePanels";
import { ProcessSteps } from "../components/visuals/ProcessSteps";
import { CaseCard, PostCard, ServiceCard } from "../components/blocks/cards";
import { CtaBand } from "../components/blocks/PageHero";
import { LaunchNoteInline } from "../components/blocks/LaunchNote";
import { Button } from "../components/ui/Button";
import { AutoRollList } from "../components/ui/AutoRollList";
import {
  Card,
  Pill,
  Reveal,
  SampleTag,
  Section,
  SectionHero,
} from "../components/ui/primitives";
import { caseStudies } from "../data/cases";
import {
  advantageIntro,
  advantagePillars,
  audiences,
  markets,
  partners,
  serviceOverview,
} from "../data/content";
import { posts } from "../data/posts";
import { serviceBySlug } from "../data/services";
import { products } from "../data/products";
import { site } from "../lib/site";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const techStrip = [
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
];

const deliveryProcess = [
  { title: "Discovery", detail: "Find the real decision, the actual constraint and the system that quietly runs the process.", note: "Week 1–2" },
  { title: "Prototype", detail: "A thin, working slice that answers the riskiest question first.", note: "Answered in days" },
  { title: "Build", detail: "Two-week increments of shippable software, reviewed in your repository.", note: "Visible progress" },
  { title: "Evaluate", detail: "Tests on the paths that matter, plus measurement of quality, cost and latency.", note: "Blocks regressions" },
  { title: "Ship", detail: "Staged release with monitoring from the first user, and a practised rollback.", note: "Hypercare period" },
  { title: "Operate", detail: "Improve against the baseline, hand over properly, stay reachable.", note: "Then repeat" },
];

/** One headline word, rising into place. `held` keeps it waiting for the curtain. */
function Rise({ i, held, children }: { i: number; held: boolean; children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className="inline-block">{children}</span>;
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: "0.45em" }}
      animate={held ? { opacity: 0, y: "0.45em" } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.62, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}

export default function Home() {
  usePageMeta({ title: site.name });
  const held = useIntroHeld();
  const heroRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const gridY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : 70]);
  const plateY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : 46]);
  const auroraY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : 130]);
  const copyY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : -26]);

  const ai = serviceBySlug("ai-product-development")!;
  const talent = serviceBySlug("talent-solution")!;

  return (
    <>
      {/* ------------------------------ hero ------------------------------ */}
      {/* `band` keeps the moving wash from reaching the 10.5px mint label directly; the veil sits
          under this section's own decorative layers, so the plate, grid and aurora are unchanged. */}
      <section ref={heroRef} className="band relative overflow-hidden pt-6 pb-16 sm:pt-10 lg:pb-24">
        <motion.div
          aria-hidden
          style={{ y: plateY }}
          className="pointer-events-none absolute inset-x-[-4%] top-[4%] h-[460px]"
        >
          <img
            src="/img/plate-hero.jpg"
            alt=""
            decoding="async"
            className="plate-drift-slow size-full object-cover opacity-[0.55] mask-fade"
          />
          <div className="absolute inset-0 bg-ink/82" />
        </motion.div>
        <motion.div aria-hidden style={{ y: gridY }} className="pointer-events-none absolute inset-0">
          <div className="grid-bg absolute inset-0 opacity-35 mask-fade" />
        </motion.div>
        <motion.div aria-hidden style={{ y: auroraY }} className="pointer-events-none absolute inset-0">
          <div className="animate-aurora absolute top-[-22%] left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-mint/[0.08] blur-[120px]" />
          <div className="animate-aurora-slow absolute top-[18%] left-[8%] hidden h-[380px] w-[380px] rounded-full bg-mint/[0.07] blur-[110px] lg:block" />
          <div className="animate-aurora absolute top-[6%] right-[6%] hidden h-[320px] w-[420px] rounded-full bg-mint/[0.06] blur-[110px] lg:block" />
        </motion.div>

        <motion.div style={{ y: copyY }} className="wrap relative">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-[clamp(2.6rem,7.2vw,4.9rem)] leading-[0.96]">
              <Rise i={0} held={held}>Technology</Rise>{" "}
              <Rise i={1} held={held}>That</Rise>{" "}
              <Rise i={2} held={held}>Moves</Rise>
              <br className="hidden sm:block" /> <Rise i={3} held={held}>Your</Rise>{" "}
              <span className="text-mint">
                <Rise i={4} held={held}>Business</Rise>{" "}
                <Rise i={5} held={held}>Forward.</Rise>
              </span>
            </h1>

            <Reveal delay={0.12}>
              <p className="prose-body mx-auto mt-6 max-w-2xl text-[1.06rem]">
                We help businesses turn ideas into digital products through AI-assisted and
                traditional product development, streamline operations with workflow automation,
                access skilled technology talent, improve system reliability, and drive digital
                transformation.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button to={paths.services()} size="lg" magnetic iconEnd={<ArrowRight className="size-4" />}>
                  Explore Our Services
                </Button>
                <Button to={paths.contact()} size="lg" variant="outline-mint" magnetic>
                  Let’s Work Together
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.24}>
            <p className="prose-body mx-auto mt-10 max-w-2xl text-center text-[0.95rem]">
              {serviceOverview}
            </p>
          </Reveal>
        </motion.div>

        <div className="relative mt-14 border-y border-line-soft">
          <div className="marquee py-4">
            <div className="marquee-inner">
              {[0, 1].map((copy) => (
                <div key={copy} className="marquee-group" aria-hidden={copy === 1 || undefined}>
                  {techStrip.map((t) => (
                    <span
                      key={t}
                      className="shrink-0 rounded-pill border border-line px-3 py-1 font-mono text-[0.72rem] whitespace-nowrap text-faint"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------- company intro -------------------------- */}
      <Section tone="raised" className="section border-y border-line-soft">
        <SectionHero
          eyebrow="Company information"
          title={site.legalName}
          lead="Septa is a technology company that builds and modernises software: AI products, conventional applications, workflow automation, observability and the teams that sustain them. We are most useful when a system matters, when being wrong has a cost, and somebody has to be accountable afterwards."
          action={
            <Button to={paths.about()} variant="secondary" size="sm">
              About Septa
            </Button>
          }
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="prose-body">
              We take work in three shapes: build something new, fix or modernise something that
              exists, and strengthen the team doing it. Most engagements mix all three.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <AutoRollList
              interval={3400}
              items={[
                { label: "Products with AI inside them", detail: "Grounded, evaluated, and reversible when a model changes." },
                { label: "Software that stays cheap to change", detail: "Typed, tested, documented, and handed over properly." },
                { label: "Processes stitched together", detail: "Integrations with retries, ownership and alerting." },
                { label: "Systems you can see inside", detail: "Metrics, logs and traces wired to alerts people answer." },
                { label: "Capacity when you are short", detail: "Specialists, squads or hiring support, planned around." },
              ]}
            />
          </Reveal>
        </div>
      </Section>

      {/* --------------------------- who we serve --------------------------- */}
      <Section className="section">
        <SectionHero
          eyebrow="Who we serve"
          title="The organisations Septa is built for, and where they are"
          lead="Both lists are Septa's own: the four kinds of organisation this work is aimed at, and the three markets it is sold into."
        />

        <div className="mt-14">
          <p className="eyebrow mb-6">Target audience</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {audiences.map((a, i) => (
              <Reveal key={a.label} delay={i * 0.04}>
                <Card className="card-hover h-full p-6">
                  <h3 className="text-[1.05rem]">{a.label}</h3>
                  <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted">{a.detail}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <p className="eyebrow mb-6">Primary markets</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {markets.map((m, i) => (
              <Reveal key={m.region} delay={i * 0.05}>
                <div className="border-l border-line pl-5 transition-colors hover:border-mint/50">
                  <h3 className="text-[1.05rem]">{m.region}</h3>
                  <p className="mt-1.5 font-mono text-[0.72rem] tracking-[0.08em] text-faint">
                    {m.countries}
                  </p>
                  <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">{m.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ----------------------------- services ---------------------------- */}
      <Section tone="raised" className="section border-y border-line-soft">
        <SectionHero
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
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-mint">
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
        <SectionHero
          eyebrow="AI product development"
          title="From a demo that impresses a room to a feature that survives an audit"
          lead="The difference between a pilot and a product is measurement. We define what a good answer means with your domain team, build the evaluation set that encodes it, and ship behind flags with citations, guardrails and cost tracking from the first release."
        />
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <AutoRollList
                interval={2800}
                items={[
                  "Retrieval with source citations",
                  "Golden-set evaluation running in the pipeline",
                  "Latency, cost and correction rates on one dashboard",
                  "Refusal policy and human review where errors are costly",
                ]}
              />
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
        <SectionHero
          eyebrow="Traditional product development"
          title="Ordinary software, engineered with unusual care"
          lead="Portals, platforms, APIs, internal tools and data products. Discovery, requirements, design, architecture, build, test, deploy — and the discipline that keeps a codebase cheap to change in year three."
          action={
            <Button to={paths.product("traditional")} size="md" variant="outline-mint">
              See how product work runs
            </Button>
          }
        />
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <ArchitectureStack />
          </Reveal>
          <Reveal delay={0.06}>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { Icon: Compass, label: "Discovery and requirements that get written down" },
                { Icon: Layers, label: "Architecture reviewed for the next team" },
                { Icon: Search, label: "Tests on the paths that would actually hurt" },
                { Icon: Send, label: "Deploys with rollback that has been practised" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex gap-3 rounded-card border border-line bg-surface p-3.5">
                  <Icon className="mt-0.5 size-4 shrink-0 text-mint" aria-hidden />
                  <span className="text-[0.86rem] leading-snug text-muted">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* -------------------------- Septa advantage ------------------------- */}
      <Section tone="raised" className="section border-y border-line-soft">
        <SectionHero
          eyebrow="The Septa Advantage"
          title="Why the combination matters"
          lead={advantageIntro}
          className="mb-10"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {advantagePillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.05} className={i === 0 ? "lg:col-span-1" : ""}>
              <Card className="card-hover h-full p-6">
                <span className="font-mono text-[0.72rem] text-mint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[1.08rem]">{pillar.title}</h3>
                <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted">{pillar.detail}</p>
              </Card>
            </Reveal>
          ))}
          <Reveal delay={0.25}>
            <Card className="flex h-full flex-col justify-between gap-5 border-mint/25 bg-surface p-6">
              <p className="prose-body text-[0.92rem]">
                Five commitments, one accountable team. Every engagement gets the same spine:
                discovery, prototype, build, evaluate, ship, operate.
              </p>
              <Button to={paths.about()} variant="secondary" size="sm" iconEnd={<ArrowRight className="size-4" />}>
                How we work
              </Button>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------ process ---------------------------- */}
      <Section className="section">
        <SectionHero
          eyebrow="Our approach"
          title="A delivery loop that runs on repeat"
          lead="Every engagement runs the same spine. What changes is how long each stage takes and who is in the room."
          action={
            <Button to={paths.about()} variant="secondary" size="sm">
              More about how we work
            </Button>
          }
        />
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Pill tone="mint">Two-week increments</Pill>
          <Pill tone="line">Working software</Pill>
          <Pill tone="line">Written decisions</Pill>
        </div>
        <Reveal delay={0.06} className="mt-12 block">
          <ProcessSteps steps={deliveryProcess} columns={3} autoRoll />
        </Reveal>
      </Section>

      {/* ------------------------------ why us ----------------------------- */}
      <Section tone="surface" className="section border-y border-line-soft">
        <SectionHero
          eyebrow="Why Septa"
          title="Reasons organisations pick us, in their words"
          lead="These are not testimonials — they are the practical differences we are able to commit to on this page."
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
                "Inference, hosting and integration effort are modelled before commitment rather than discovered later.",
            },
            {
              title: "Reliability included",
              detail:
                "Instrumentation, alerting and rollback are in scope on everything we build.",
            },
          ].map((w, i) => (
            <Reveal key={w.title} delay={i * 0.04}>
              <div className="group flex gap-4 border-l border-line pl-5 transition-colors hover:border-mint/50">
                <span className="font-mono text-[0.72rem] text-mint">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[1.05rem]">{w.title}</h3>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{w.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* --------------------------- case studies -------------------------- */}
      <Section className="section">
        <SectionHero
          eyebrow="Case studies"
          title="How this kind of work goes"
          lead="The studies below are illustrative sample scenarios written to show the shape of a Septa engagement: the problem framing, the sequence and the costs of the choices made. They are not client references, and their outcomes are not measured results."
          action={
            <Button to={paths.cases()} variant="secondary" size="sm" iconEnd={<ArrowRight className="size-4" />}>
              All case studies
            </Button>
          }
          className="mb-8"
        />
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          <SampleTag label="Placeholder content until real studies are approved" />
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

      {/* ------------------------------ talent ----------------------------- */}
      <Section tone="surface" className="section border-y border-line-soft">
        <SectionHero
          eyebrow="Talent solutions"
          title="Sometimes the missing piece is people"
          lead="A specialist who can work unsupervised, a squad that owns a product line, or technical screening your hiring team does not have time to run well. Engagement shape is agreed against the outcome rather than a headcount target."
          action={
            <>
              <Button to={paths.service("talent-solution")} size="md">
                Talent Solution service
              </Button>
              <Button
                to={paths.careers()}
                variant="secondary"
                size="md"
                iconStart={<Users2 className="size-4" />}
              >
                Work at Septa
              </Button>
            </>
          }
        />
        <Reveal delay={0.06}>
          <ul className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Technical talent sourcing",
              "Developer placement",
              "Dedicated development teams",
              "Project-based staffing",
              "Team augmentation",
              "Technical role matching",
            ].map((t) => (
              <li
                key={t}
                className="flex items-center gap-2.5 rounded-card border border-line bg-surface px-4 py-3.5 text-[0.88rem] text-muted"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-mint/70" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {/* --------------------------- latest writing -------------------------- */}
      <Section className="section">
        <SectionHero
          eyebrow="Latest writing"
          title="Notes on the parts of this work that usually go wrong"
          action={
            <Button to={paths.blog()} variant="secondary" size="sm">
              Read the blog
            </Button>
          }
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {posts.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <PostCard post={p} variant="compact" />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ----------------------------- partners ---------------------------- */}
      {/* A solid Pearl field rather than a veiled band: three of the supplied marks are white
          artwork drawn for a dark site, so no light ground can carry all seven. Each asset is
          rendered as one silhouette so the row reads as a single treatment. */}
      <section className="on-dark section relative border-y border-brand-teal/25 bg-brand-pearl">
        <div className="wrap mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-5">Our partners</p>
          <h2 className="text-[clamp(2rem,4.6vw,3.1rem)] leading-[1.04] text-brand-white">
            Organisations we work alongside
          </h2>
          <p className="prose-body mx-auto mt-5 max-w-2xl text-[1.02rem]">
            The names below were supplied by Septa, with each organisation's published mark. Nothing
            here describes the scope, contract or length of any individual relationship.
          </p>
        </div>

        <div className="marquee marquee-logos mt-12">
          <div className="marquee-inner">
            {[0, 1].map((copy) => (
              <div key={copy} className="marquee-group" aria-hidden={copy === 1 || undefined}>
                {partners.map((p) => (
                  <span key={p.name} className="flex h-9 shrink-0 items-center">
                    {p.logo ? (
                      <img
                        src={p.logo}
                        alt=""
                        decoding="async"
                        className="logo-mono h-9 w-auto opacity-70 transition-opacity duration-300 hover:opacity-100"
                      />
                    ) : (
                      <span className="text-[1.02rem] tracking-tight whitespace-nowrap text-brand-white/75">
                        {p.name}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* The strip repeats itself to close the loop, so the names are exposed once, here. */}
        <ul className="sr-only">
          {partners.map((p) => (
            <li key={p.name}>{p.name}</li>
          ))}
        </ul>
      </section>

      {/* ---------------------------- testimonial --------------------------- */}
      <Section tone="raised" className="section border-y border-line-soft">
        <SectionHero
          eyebrow="Testimonial"
          title="Waiting on real quotes"
          lead="The revamp brief reserves a testimonial section but supplies no content for it. Inventing one would be a fabricated client reference, so this stays visibly empty until Septa provides approved quotes."
          className="mb-8"
        />
        <Reveal>
          <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center sm:p-12">
            <p className="prose-body mx-auto max-w-lg text-[0.95rem]">
              To populate this section, add approved client quotes to{" "}
              <code className="font-mono text-mint">src/data/content.ts</code> once they exist.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <SampleTag label="No testimonial content supplied" />
              <LaunchNoteInline label="Needs client approval before publication" />
            </div>
          </div>
        </Reveal>
      </Section>

      <CtaBand secondary={{ label: "Ask a question first", to: paths.contact() }} />
    </>
  );
}
