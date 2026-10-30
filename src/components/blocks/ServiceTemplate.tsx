import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import type { ProductContent } from "../../data/products";
import type { ServiceContent } from "../../data/services";
import { paths } from "../../lib/paths";
import { Button } from "../ui/Button";
import {
  Card,
  MarkerList,
  Pill,
  Reveal,
  Section,
  SectionHeading,
} from "../ui/primitives";
import { Accordion } from "../ui/Accordion";
import { ProcessSteps } from "../visuals/ProcessSteps";
import { DashboardMock } from "../visuals/DashboardMock";
import { AiDeliveryPanel } from "../visuals/FeaturePanels";
import { WorkflowDiagram } from "../visuals/WorkflowDiagram";
import { CtaBand, PageHero } from "./PageHero";
import { LaunchNote } from "./LaunchNote";
import { ServiceIcon } from "./ServiceIcon";

type Page = ServiceContent | ProductContent;

const isProduct = (p: Page): p is ProductContent => "framing" in p;

function ServiceVisual({ page }: { page: Page }) {
  if (page.visual === "workflow") return <WorkflowDiagram className="mt-10" />;
  if (page.visual === "dashboard") return <DashboardMock className="mt-10" />;
  if (page.visual === "ai")
    return (
      <Reveal className="mt-10">
        <AiDeliveryPanel />
      </Reveal>
    );
  return null;
}

export function ServiceTemplate({ page, crumbs }: { page: Page; crumbs: { label: string; to?: string }[] }) {
  const serviceMatch = isProduct(page) && page.serviceSlug ? paths.service(page.serviceSlug) : null;

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={isProduct(page) ? "Product development track" : "Service"}
        title={page.heroTitle}
        lead={page.lead}
        meta={
          <>
            <Pill tone="mint">
              <ServiceIcon icon={page.icon} className="size-3.5" strokeWidth={2} />
              {page.name}
            </Pill>
            <Pill tone="line">{page.capabilities.length} capability groups</Pill>
            <Pill tone="line">{page.process.length}-step process</Pill>
            <Pill tone="line">{page.faq.length} common questions</Pill>
          </>
        }
        actions={
          <>
            <Button to={paths.request(page.name)} size="lg">
              Request this service
            </Button>
            <Button to={paths.contact()} size="lg" variant="secondary">
              Ask a question first
            </Button>
          </>
        }
        aside={<ServiceAside page={page} />}
      />

      {page.detail ? (
        <Section className="py-10">
          <Reveal>
            <p className="prose-body max-w-3xl border-l-2 border-mint/45 pl-5 text-[1.02rem]">
              {page.detail}
            </p>
          </Reveal>
        </Section>
      ) : null}

      {isProduct(page) ? (
        <Section className="py-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card border border-line bg-surface px-5 py-4 text-[0.88rem] text-muted">
            <span className="font-mono text-[0.7rem] tracking-wider text-mint uppercase">Track</span>
            <span>{page.framing}</span>
            {serviceMatch ? (
              <Link to={serviceMatch} className="inline-flex items-center gap-1.5 text-mint hover:underline">
                See the service page
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            ) : null}
          </div>
        </Section>
      ) : null}

      {/* problems */}
      <Section className="section">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="What we take on"
            title="The situations that bring people here"
            lead="If one of these describes your week, this service is worth a conversation."
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <Reveal>
            <ul className="space-y-3">
              {page.problems.map((p, i) => (
                <li
                  key={p}
                  className="group flex gap-4 rounded-card border border-line bg-surface-raised px-4 py-3.5 transition-colors hover:border-mint/40"
                >
                  <span className="mt-0.5 font-mono text-[0.72rem] text-faint transition-colors group-hover:text-mint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.93rem] text-muted">{p}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* capabilities */}
      <Section tone="raised" className="section border-y border-line-soft">
        <SectionHeading
          eyebrow="Capabilities"
          title="What the work actually involves"
          lead="Grouped the way a buyer reads it: what we look at, what we build, what keeps it healthy."
          className="mb-10"
        />
        <div className="space-y-12">
          {page.capabilities.map((group, gi) => (
            <div key={group.group}>
              <div className="mb-5 flex items-center gap-4">
                <h3 className="font-display text-[1.15rem] text-fg">{group.group}</h3>
                <span aria-hidden className="h-px flex-1 bg-line" />
                <span className="font-mono text-[0.7rem] text-faint">
                  {String(gi + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item, i) => (
                  <Reveal key={item.title} delay={i * 0.03}>
                    <Card className="h-full p-5">
                      <h4 className="text-[1rem] text-fg">{item.title}</h4>
                      <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{item.detail}</p>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>

        <ServiceVisual page={page} />
      </Section>

      {/* benefits */}
      <Section className="section">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading eyebrow="Outcomes" title="What changes when this is done properly" />
          <div className="grid gap-4 sm:grid-cols-2">
            {page.benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.04}>
                <div className="relative overflow-hidden rounded-card border border-line bg-surface-raised p-5">
                  <div
                    aria-hidden
                    className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-mint/70 to-transparent"
                  />
                  <h3 className="text-[1rem]">{b.title}</h3>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{b.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* use cases */}
      <Section tone="surface" className="section border-y border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Where it fits"
              title="Use cases we are asked for"
              lead="Descriptions of typical situations, not a client list."
              className="mb-8"
            />
            <div className="grid gap-3">
              {page.useCases.map((u, i) => (
                <Reveal key={u.title} delay={i * 0.04}>
                  <div className="flex flex-col gap-1 rounded-card border border-line bg-surface px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                    <h3 className="w-full shrink-0 text-[0.98rem] sm:w-56">{u.title}</h3>
                    <p className="text-[0.88rem] leading-relaxed text-muted">{u.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.06}>
            <Card className="p-6">
              <p className="eyebrow mb-4">What you receive</p>
              <MarkerList items={page.deliverables} />
              <div className="mt-6 border-t border-line pt-5">
                <p className="text-[0.85rem] text-faint">
                  Scope, pricing and timelines are agreed per engagement — this page is editable
                  service copy, not a contract.
                </p>
                <Button to={paths.request(page.name)} size="sm" variant="outline-mint" className="mt-4">
                  Request a Service
                </Button>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* process */}
      <Section className="section">
        <SectionHeading
          eyebrow="How it runs"
          title="The process behind the work"
          lead="The same spine on every engagement: understand, prove, build, measure, release, operate."
          className="mb-9"
        />
        <ProcessSteps steps={page.process} columns={3} />
        <LaunchNote items={page.unconfirmed} title="Confirm before this page goes live" />
      </Section>

      {/* faq */}
      <Section tone="raised" className="section border-y border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Questions" title="Things people ask us first" />
            <Button to={paths.contact()} variant="ghost" size="sm" className="mt-6">
              Ask something else
            </Button>
          </div>
          <Accordion items={page.faq} />
        </div>
      </Section>

      {/* related */}
      <Section className="section">
        <SectionHeading eyebrow="Related" title="Other pages that may fit better" className="mb-8" />
        <div className="grid gap-4 sm:grid-cols-3">
          {page.related.map((r, i) => (
            <Reveal key={r.to} delay={i * 0.05}>
              <Link
                to={r.to}
                className="card card-hover group flex h-full flex-col justify-between p-5"
              >
                <span className="text-[0.98rem] text-fg group-hover:text-mint">{r.label}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[0.82rem] text-muted">
                  <Check className="size-3.5 text-mint/70" aria-hidden />
                  Related page
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        title={`Want ${page.name.toLowerCase()}?`}
        lead="Send the shape of the problem. We reply with a point of view and the smallest useful next step."
        primaryLabel="Request a Service"
      />
    </>
  );
}

function ServiceAside({ page }: { page: Page }) {
  const items: ReactNode = (
    <ul className="space-y-2.5">
      {page.capabilities.map((c) => (
        <li key={c.group} className="flex items-center justify-between gap-4 rounded-lg border border-line bg-surface px-4 py-3">
          <span className="text-[0.88rem] text-muted">{c.group}</span>
          <span className="font-mono text-[0.72rem] text-mint">{c.items.length}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative">
      <div aria-hidden className="glow-mint pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative rounded-card border border-line bg-ink-raised/80 p-5 backdrop-blur-sm">
        <p className="mb-4 font-mono text-[0.68rem] tracking-[0.18em] text-faint uppercase">
          Coverage on this page
        </p>
        {items}
      </div>
    </div>
  );
}
