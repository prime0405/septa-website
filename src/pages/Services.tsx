import { Link } from "react-router-dom";
import { ArrowRight, Compass, Layers, Send } from "lucide-react";
import { CtaBand, PageHero } from "../components/blocks/PageHero";
import { ServiceCard } from "../components/blocks/cards";
import { ServiceIcon } from "../components/blocks/ServiceIcon";
import { ProcessSteps } from "../components/visuals/ProcessSteps";
import { Button } from "../components/ui/Button";
import {
  Card,
  MarkerList,
  Pill,
  Reveal,
  Section,
  SectionHeading,
} from "../components/ui/primitives";
import { products } from "../data/products";
import { services } from "../data/services";
import { cn } from "../lib/cn";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const engagementModel = [
  {
    title: "Fixed-scope spike",
    detail:
      "One or two weeks on a single question — is this feasible, where does the data live, what would it cost to run. Ends with a written answer and a working artefact.",
    fits: "You need evidence before committing budget.",
  },
  {
    title: "Delivery engagement",
    detail:
      "A build team working in two-week increments against a shared backlog, in your repository, with monitoring from the first release.",
    fits: "You know the problem and need it shipped.",
  },
  {
    title: "Ongoing partnership",
    detail:
      "A standing capacity commitment: roadmap input, delivery, reliability work and handover checkpoints reviewed regularly.",
    fits: "Technology is part of your operating model, not a project.",
  },
];

const routing = [
  {
    label: "Something that does not exist yet",
    answer: "Start with product development",
    to: paths.products(),
    why: "Discovery, design and engineering for a new capability.",
  },
  {
    label: "Something that exists and hurts",
    answer: "Start with a service",
    to: paths.service("digital-transformation"),
    why: "Modernisation, automation and reliability work on what you already run.",
  },
  {
    label: "Something you cannot staff",
    answer: "Start with talent",
    to: paths.service("talent-solution"),
    why: "People and teams that join your delivery model.",
  },
];

export default function Services() {
  usePageMeta({
    title: "Services",
    description:
      "Septa's five service lines: AI product development, workflow automation, digital transformation, observability and monitoring, and talent solutions — plus the product-development tracks behind them.",
  });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "Services" }]}
        eyebrow="Services"
        title="Five ways we take a hard operational problem and make it software"
        lead="Each service page states what the work involves, what you receive, and what still needs confirming about how Septa sells it. Pick the closest one — mixed engagements are the norm, not the exception."
        meta={
          <>
            <Pill tone="mint">{services.length} service lines</Pill>
            <Pill tone="line">{products.length} product-development tracks</Pill>
            <Pill tone="line">One team across the path</Pill>
          </>
        }
        actions={
          <>
            <Button to={paths.request()} size="lg" iconEnd={<Send className="size-4" />}>
              Request a Service
            </Button>
            <Button to={paths.cases()} size="lg" variant="secondary">
              See worked examples
            </Button>
          </>
        }
        aside={
          <div className="relative">
            <div aria-hidden className="glow-mint pointer-events-none absolute inset-0 opacity-45" />
            <nav
              aria-label="Jump to a service"
              className="relative rounded-card border border-line bg-ink-raised/85 p-3"
            >
              <p className="px-3 pt-2 pb-3 font-mono text-[0.68rem] tracking-[0.18em] text-faint uppercase">
                Service index
              </p>
              <ul className="space-y-1">
                {services.map((s, i) => (
                  <li key={s.slug}>
                    <Link
                      to={paths.service(s.slug)}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface",
                      )}
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-raised text-muted transition-colors group-hover:border-mint/45 group-hover:text-mint">
                        <ServiceIcon icon={s.icon} className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.92rem] text-fg group-hover:text-mint">
                          {s.name}
                        </span>
                        <span className="block truncate text-[0.78rem] text-faint">
                          {s.navBlurb}
                        </span>
                      </span>
                      <span className="font-mono text-[0.68rem] text-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        }
      />

      {/* ------------------------- service grid ------------------------- */}
      <Section className="section">
        <SectionHeading
          eyebrow="The five lines"
          title="Choose the closest starting point"
          lead="These overlap on purpose. A claims assistant is AI product development, workflow automation and observability at once — the pages describe the same company, not five departments."
          className="mb-10"
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.04} className="h-full">
              <ServiceCard service={s} href={paths.service(s.slug)} index={i} />
            </Reveal>
          ))}

          <Reveal delay={services.length * 0.04} className="h-full">
            <Card className="flex h-full flex-col justify-between border-mint/30 bg-surface p-6">
              <div>
                <span className="flex size-11 items-center justify-center rounded-xl border border-mint/35 bg-mint/10 text-mint">
                  <Compass className="size-5.5" />
                </span>
                <h3 className="mt-5 text-[1.15rem]">Not sure which one fits?</h3>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
                  Send the situation in your own words. We will tell you which line it belongs to —
                  or that it does not need one yet.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <Button to={paths.request()} size="sm">
                  Start a request
                </Button>
                <Button to={paths.contact()} size="sm" variant="secondary">
                  Ask a question first
                </Button>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------- product development --------------------- */}
      <Section tone="raised" className="section border-y border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Product development"
              title="Two build tracks, one engineering standard"
              lead="The service pages describe what we offer. The product-development pages walk through how a new product actually gets built — AI-enabled or conventional software."
            />
            <Button to={paths.products()} variant="ghost" size="sm" className="mt-6" iconEnd={<ArrowRight className="size-4" />}>
              Open the product-development hub
            </Button>
          </div>
          <div className="grid gap-4">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <Link
                  to={paths.product(p.slug)}
                  className="card card-hover group flex flex-col gap-4 p-6 sm:flex-row sm:items-start"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-mint/25 bg-mint/[0.07] text-mint">
                    {p.slug === "ai" ? (
                      <ServiceIcon icon="ai" className="size-5" />
                    ) : (
                      <Layers className="size-5" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-[1.1rem] text-fg group-hover:text-mint">{p.name}</span>
                      <Pill tone="muted">build track</Pill>
                    </span>
                    <span className="mt-2 block text-[0.9rem] leading-relaxed text-muted">
                      {p.navBlurb}
                    </span>
                    <span className="mt-3 block text-[0.82rem] text-faint">{p.framing}</span>
                  </span>
                  <ArrowRight
                    className="mt-1 hidden size-4 shrink-0 text-faint transition-transform group-hover:translate-x-1 group-hover:text-mint sm:block"
                    aria-hidden
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* --------------------------- routing ---------------------------- */}
      <Section className="section">
        <SectionHeading
          eyebrow="Orientation"
          title="Where to start, depending on your situation"
          className="mb-9"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {routing.map((r, i) => (
            <Reveal key={r.label} delay={i * 0.05}>
              <Link
                to={r.to}
                className="card card-hover group flex h-full flex-col justify-between p-6"
              >
                <div>
                  <p className="eyebrow mb-4">{r.label}</p>
                  <p className="text-[1.05rem] text-fg group-hover:text-mint">{r.answer}</p>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{r.why}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-[0.72rem] text-mint">
                  open
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* -------------------------- process ---------------------------- */}
      <Section tone="surface" className="section border-y border-line-soft">
        <SectionHeading
          eyebrow="How work runs"
          title="The same spine under every service"
          lead="Discovery, prototype, build, evaluate, ship, operate. What changes between services is the content of each step, not the shape of the engagement."
          className="mb-9"
        />
        <ProcessSteps
          columns={3}
          caption="Each service page expands the steps that matter for that line of work."
          steps={[
            { title: "Discovery", detail: "Name the decision, the constraint and the data reality." },
            { title: "Prototype", detail: "Answer the riskiest question with working software." },
            { title: "Build", detail: "Increments reviewed in your repository as they land." },
            { title: "Evaluate", detail: "Quality, cost, latency and error rates against a baseline." },
            { title: "Ship", detail: "Staged release, monitoring, rehearsed rollback." },
            { title: "Operate", detail: "Improve, document, hand over, stay reachable." },
          ]}
        />
      </Section>

      {/* ------------------------ engagement --------------------------- */}
      <Section className="section">
        <SectionHeading
          eyebrow="Engagement models"
          title="Three ways to buy this"
          lead="Named so a conversation about scope has a shape. Commercial terms are agreed per engagement and are not published here."
          className="mb-10"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {engagementModel.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.05} className="h-full">
              <Card className="flex h-full flex-col p-6">
                <p className="font-mono text-[0.7rem] tracking-[0.18em] text-mint uppercase">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-[1.15rem]">{m.title}</h3>
                <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-muted">{m.detail}</p>
                <div className="mt-5 border-t border-line pt-4">
                  <MarkerList items={[{ label: "Best fit", detail: m.fits }]} />
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Tell us the situation, not the solution"
        lead="The request form takes four short steps and preselects a service for you. We reply with a point of view and the smallest useful next step."
        secondary={{ label: "Browse services", to: paths.services() }}
      />
    </>
  );
}
