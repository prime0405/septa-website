import { useEffect, useState } from "react";
import { ArrowRight, Check, Compass, Sparkles } from "lucide-react";
import type { ServiceContent } from "../../data/services";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Card, Reveal, Section, SectionHeading, Pill } from "../ui/primitives";
import { PageHero } from "./PageHero";
import type { Crumb } from "./PageHero";
import { PhotoFigure } from "./PhotoFigure";
import { ServiceIcon } from "./ServiceIcon";
import { LaunchNoteInline } from "./LaunchNote";

function CapabilityExplorer({ page }: { page: ServiceContent }) {
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [page.slug]);
  const item = page.coreServices[active];
  if (!item) return null;

  return (
    <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        {page.coreServices.map((capability, index) => (
          <button key={capability.title} type="button" aria-pressed={active === index}
            onClick={() => setActive(index)}
            className={cn("group flex min-h-20 items-center gap-4 rounded-card border p-4 text-left transition-all duration-300",
              active === index ? "border-mint bg-mint/10 shadow-soft" : "border-line bg-surface-raised hover:border-mint/50")}>
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl border font-mono text-xs",
              active === index ? "border-mint bg-brand-teal text-brand-pearl" : "border-line bg-ink-raised text-muted")}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-fg">{capability.title}</span>
              <span className="mt-1 block text-xs text-muted">{active === index ? "Currently exploring" : "Explore capability"}</span>
            </span>
            <ArrowRight className={cn("size-4 shrink-0 transition-transform", active === index ? "text-mint" : "text-faint group-hover:translate-x-1")} aria-hidden />
          </button>
        ))}
      </div>
      <div className="relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-card border border-line bg-brand-pearl p-6 text-white sm:p-8" aria-live="polite">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full border border-brand-teal/25" />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <Pill tone="mint">Capability {String(active + 1).padStart(2, "0")}</Pill>
            <span className="font-mono text-xs text-white/60">{String(active + 1).padStart(2, "0")} / {String(page.coreServices.length).padStart(2, "0")}</span>
          </div>
          <h3 className="mt-8 max-w-lg text-2xl font-semibold text-white sm:text-3xl">{item.title}</h3>
          {item.detail ? <p className="mt-4 max-w-xl text-sm leading-7 text-white/75">{item.detail}</p> : null}
        </div>
        <div className="relative mt-8 flex items-center justify-between gap-4 border-t border-white/15 pt-4">
          <span className="text-xs text-white/60">Explore the next capability</span>
          <button type="button" onClick={() => setActive((value) => (value + 1) % page.coreServices.length)}
            className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-brand-teal px-4 text-sm font-semibold text-brand-pearl transition-transform hover:-translate-y-0.5">
            Next <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProcessJourney({ page }: { page: ServiceContent }) {
  const steps = page.process ?? [];
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [page.slug]);
  const step = steps[active];
  if (!step) return null;

  return (
    <div className="mt-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Pill tone="mint"><Compass className="size-3.5" aria-hidden /> Interactive journey</Pill>
        <span className="font-mono text-xs text-muted">STEP {String(active + 1).padStart(2, "0")} OF {String(steps.length).padStart(2, "0")}</span>
      </div>
      <div className="mb-7 h-1.5 overflow-hidden rounded-pill bg-line" role="progressbar" aria-label="Process exploration progress" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={active + 1}>
        <div className="h-full rounded-pill bg-mint transition-[width] duration-500" style={{ width: `${((active + 1) / steps.length) * 100}%` }} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((item, index) => (
          <button key={item.title} type="button" aria-pressed={active === index} onClick={() => setActive(index)}
            className={cn("flex min-h-24 items-start gap-3 rounded-card border p-4 text-left transition-all duration-300",
              active === index ? "border-mint bg-mint/10 shadow-soft" : "border-line bg-surface-raised hover:border-mint/50")}>
            <span className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border",
              index < active ? "border-mint bg-mint text-white" : active === index ? "border-mint bg-brand-teal text-brand-pearl" : "border-line bg-ink-raised text-muted")}>
              {index < active ? <Check className="size-4" aria-hidden /> : <span className="font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-fg">{item.title}</span>
              <span className="mt-1 block text-xs text-muted">{active === index ? "Selected stage" : "View this stage"}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="mt-5 rounded-card border border-line bg-surface-raised p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Pill tone="mint">Stage {String(active + 1).padStart(2, "0")}</Pill>
          <span className="font-mono text-xs text-faint">{Math.round(((active + 1) / steps.length) * 100)}% explored</span>
        </div>
        <h3 className="mt-5 text-xl sm:text-2xl">{step.title}</h3>
        {step.detail ? <p className="prose-body mt-3 max-w-3xl">{step.detail}</p> : null}
        {step.sub ? (
          <div className="mt-6 rounded-card border border-line-soft bg-ink-raised p-5">
            {step.sub.heading ? <p className="eyebrow mb-3">{step.sub.heading}</p> : null}
            {step.sub.lead ? <p className="mb-3 text-sm text-muted">{step.sub.lead}</p> : null}
            <div className="grid gap-4 sm:grid-cols-2">
              {step.sub.items.map((sub) => <div key={sub.title} className="flex gap-3">
                <Check className="mt-1 size-4 shrink-0 text-mint" aria-hidden />
                <div><p className="text-sm font-semibold text-fg">{sub.title}</p>{sub.detail ? <p className="mt-1 text-sm leading-6 text-muted">{sub.detail}</p> : null}</div>
              </div>)}
            </div>
          </div>
        ) : null}
        <div className="mt-7 flex flex-wrap justify-between gap-3">
          <button type="button" disabled={active === 0} onClick={() => setActive((value) => Math.max(0, value - 1))}
            className="min-h-11 rounded-pill border border-line px-5 text-sm font-medium text-fg transition-colors hover:border-mint disabled:cursor-not-allowed disabled:opacity-40">Previous stage</button>
          <button type="button" onClick={() => setActive((value) => (value + 1) % steps.length)}
            className="inline-flex min-h-11 items-center gap-2 rounded-pill bg-brand-teal px-5 text-sm font-semibold text-brand-pearl transition-transform hover:-translate-y-0.5">
            {active === steps.length - 1 ? "Explore again" : "Next stage"} <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ServiceTemplate({ page, crumbs }: { page: ServiceContent; crumbs: Crumb[] }) {
  return (
    <>
      <PageHero crumbs={crumbs} eyebrow={page.name} title={page.heroTitle} lead={page.intro}
        meta={<>
          <Pill tone="mint"><ServiceIcon icon={page.icon} className="size-3.5" strokeWidth={2} />{page.name}</Pill>
          <Pill tone="line">{page.coreServices.length} core services</Pill>
          {page.process ? <Pill tone="line">{page.process.length}-step process</Pill> : null}
        </>}
        actions={page.cta ? <Button to={page.cta.to} size="lg" magnetic>{page.cta.label}</Button> : null}
      />

      <Section wall="use-case" className="section">
        <div className={cn("grid items-center gap-8", page.image && "lg:grid-cols-[1fr_1.1fr] lg:gap-14")}>
          <SectionHeading eyebrow={page.name} title={page.coreServicesHeading} lead={page.coreServicesLead}
            className={page.image ? "lg:sticky lg:top-28 lg:self-start" : ""} />
          {page.image ? <Reveal delay={0.06} className="min-w-0"><PhotoFigure src={page.image.src} alt={page.image.alt} edge="right" /></Reveal> : null}
        </div>
        <CapabilityExplorer page={page} />
      </Section>

      <Section wall="about" tone="raised" className="section border-y border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading eyebrow={page.name} title={page.whyChooseHeading} className="lg:sticky lg:top-28 lg:self-start" />
          <div className="grid gap-4 sm:grid-cols-2">
            {page.whyChoose.map((item, index) => <Reveal key={item.title} delay={index * 0.04}>
              <Card tilt className="card-hover h-full p-5">
                <div className="mb-4 flex size-9 items-center justify-center rounded-xl border border-mint/35 bg-mint/10"><Sparkles className="size-4 text-mint" aria-hidden /></div>
                <h3 className="text-[1rem]">{item.title}</h3>
                {item.detail ? <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{item.detail}</p> : null}
              </Card>
            </Reveal>)}
          </div>
        </div>
      </Section>

      {page.process ? <Section wall="service-automation" className="section">
        <SectionHeading eyebrow={page.name} title={page.processHeading ?? "Our Process"} lead={page.processLead} />
        <ProcessJourney page={page} />
      </Section> : null}

      {page.whoWeServe ? <Section wall="services" tone="surface" className="section border-y border-line-soft">
        <SectionHeading eyebrow={page.name} title={page.whoWeServeHeading ?? "Who We Serve"} className="mb-10" />
        <div className="grid gap-4 sm:grid-cols-2">
          {page.whoWeServe.map((item, index) => <Reveal key={item.title} delay={index * 0.04}>
            <Card tilt className="h-full p-6"><div className="flex items-start gap-3">
              <Check className="mt-1 size-4 shrink-0 text-mint" aria-hidden />
              <div><h3 className="text-[1rem]">{item.title}</h3>{item.detail ? <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{item.detail}</p> : null}</div>
            </div></Card>
          </Reveal>)}
        </div>
      </Section> : null}

      {page.extra ? <Section wall="blog" className="section">
        <SectionHeading eyebrow={page.name} title={page.extra.heading} className="mb-8" />
        <div className="max-w-3xl space-y-4">{page.extra.paragraphs.map((paragraph, index) =>
          <Reveal key={paragraph.slice(0, 24)} delay={index * 0.05}><p className="prose-body text-[0.98rem]">{paragraph}</p></Reveal>)}</div>
      </Section> : null}

      {page.pending?.length ? <Section wall="use-case" tone="raised" className="section border-y border-line-soft">
        <div className="rounded-card border border-dashed border-line bg-surface p-6 sm:p-8">
          <p className="prose-body mx-auto max-w-2xl text-center text-[0.92rem]">
            {page.pending.join(" and ")} belong on this page. The revamp document asks for them
            and supplies no copy, so they stay empty rather than being written for you.
          </p>
          <div className="mt-5 flex justify-center"><LaunchNoteInline label={`Awaiting copy: ${page.pending.join(", ")}`} /></div>
        </div>
      </Section> : null}
    </>
  );
}
