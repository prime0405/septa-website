import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Compass, Sparkles } from "lucide-react";
import type { ServiceContent } from "../../data/services";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Card, Reveal, Section, SectionHeading, Pill } from "../ui/primitives";
import { PhotoFigure } from "./PhotoFigure";
import { ServiceIcon } from "./ServiceIcon";
import { LaunchNoteInline } from "./LaunchNote";


function ServiceMotionField({ slug }: { slug: string }) {
  const reduce = useReducedMotion();
  const motifs: Record<string, string[]> = {
    "ai-product-development": ["MODEL GRAPH", "DATA", "INFERENCE", "PRODUCT"],
    "workflow-automation": ["TRIGGER", "ROUTE", "ACTION", "COMPLETE"],
    "digital-transformation": ["LEGACY", "CONNECT", "MODERNISE", "SCALE"],
    "observability-monitoring": ["METRICS", "LOGS", "TRACES", "INSIGHT"],
    "talent-solution": ["PEOPLE", "SKILLS", "MATCH", "GROWTH"],
  };
  const labels = motifs[slug] ?? ["DISCOVER", "DESIGN", "BUILD", "DELIVER"];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: "linear-gradient(rgba(109,177,174,.32) 1px, transparent 1px), linear-gradient(90deg, rgba(109,177,174,.32) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <motion.div className="absolute -right-32 top-[-18rem] size-[42rem] rounded-full border border-brand-teal/20"
        animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }} />
      <motion.div className="absolute -right-12 top-[-12rem] size-[30rem] rounded-full border border-dashed border-brand-teal/25"
        animate={reduce ? undefined : { rotate: -360 }} transition={{ duration: 72, repeat: Infinity, ease: "linear" }} />
      <motion.div className="absolute right-[9%] top-[16%] size-72 rounded-full bg-brand-teal/15 blur-[90px]"
        animate={reduce ? undefined : { x: [0, -55, 20, 0], y: [0, 45, -20, 0], scale: [1, 1.22, .92, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute -bottom-40 left-[18%] size-96 rounded-full bg-brand-teal/10 blur-[100px]"
        animate={reduce ? undefined : { x: [0, 80, -30, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }} />
      <svg className="absolute right-0 top-0 h-full w-[58%] opacity-40" viewBox="0 0 760 620" fill="none">
        <motion.path d="M760 90H570L470 190H330L230 290H0" stroke="#6DB1AE" strokeWidth="1"
          strokeDasharray="7 11" initial={{ pathLength: 0 }} animate={reduce ? { pathLength: 1 } : { pathLength: [0, 1] }}
          transition={{ duration: 5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }} />
        <motion.path d="M760 410H600L500 310H390L290 410H130" stroke="#6DB1AE" strokeWidth="1"
          strokeDasharray="3 9" initial={{ pathLength: 0 }} animate={reduce ? { pathLength: 1 } : { pathLength: [0, 1] }}
          transition={{ duration: 6, delay: 1, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }} />
        {[{x:570,y:90},{x:470,y:190},{x:330,y:190},{x:230,y:290},{x:600,y:410},{x:500,y:310},{x:390,y:310},{x:290,y:410}].map((p,i) =>
          <motion.circle key={i} cx={p.x} cy={p.y} r="4" fill="#6DB1AE"
            animate={reduce ? undefined : { opacity: [.25, 1, .25], r: [3, 5, 3] }}
            transition={{ duration: 2.8, delay: i * .22, repeat: Infinity }} />
        )}
      </svg>
      <div className="absolute bottom-8 right-8 hidden gap-2 md:flex">
        {labels.map((label, i) => <motion.span key={label}
          className="border border-brand-teal/20 bg-white/[0.04] px-3 py-2 font-mono text-[9px] tracking-[.18em] text-brand-teal/70 backdrop-blur-sm"
          animate={reduce ? undefined : { y: [0, -7, 0], opacity: [.55, 1, .55] }}
          transition={{ duration: 3.2, delay: i * .35, repeat: Infinity, ease: "easeInOut" }}>{label}</motion.span>)}
      </div>
    </div>
  );
}

function CapabilityExplorer({ page }: { page: ServiceContent }) {
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [page.slug]);
  const item = page.coreServices[active];
  if (!item) return null;

  return (
    <div className="mt-12 grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:gap-7">
      <div className="flex flex-col gap-2" role="tablist" aria-label={page.coreServicesHeading}>
        {page.coreServices.map((capability, index) => (
          <button key={capability.title} type="button" role="tab" aria-selected={active === index}
            onClick={() => setActive(index)}
            className={cn("group relative flex min-h-[82px] items-center gap-4 border-b px-4 py-4 text-left transition-all duration-300",
              active === index ? "border-brand-teal bg-brand-pearl text-white shadow-[0_12px_32px_-20px_rgba(6,24,32,.65)]" : "border-line-soft bg-white/70 text-brand-pearl hover:bg-white")}>
            {active === index ? <motion.span layoutId="service-capability-active" className="absolute inset-y-0 left-0 w-1 bg-brand-teal" transition={{ type: "spring", stiffness: 360, damping: 32 }} /> : null}
            <span className={cn("font-mono text-xs tracking-widest", active === index ? "text-brand-teal" : "text-muted")}>{String(index + 1).padStart(2, "0")}</span>
            <span className="min-w-0 flex-1 text-[0.96rem] font-semibold">{capability.title}</span>
            <ArrowUpRight className={cn("size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5", active === index ? "text-brand-teal" : "text-muted")} aria-hidden />
          </button>
        ))}
      </div>

      <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden bg-brand-pearl p-7 text-white shadow-[0_30px_90px_-45px_rgba(6,24,32,.7)] sm:p-10 lg:min-h-[430px]" aria-live="polite">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full border border-brand-teal/20" />
        <div aria-hidden className="pointer-events-none absolute -right-10 -top-14 size-52 rounded-full border border-brand-teal/20" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-1/2 w-2/3 bg-gradient-to-tl from-brand-teal/20 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-brand-teal">Capability / {String(active + 1).padStart(2, "0")}</span>
            <span className="font-mono text-xs text-white/45">{String(active + 1).padStart(2, "0")} <span className="text-white/25">/</span> {String(page.coreServices.length).padStart(2, "0")}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={item.title} initial={{ opacity: 0, y: 18, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(6px)" }} transition={{ duration: .35 }}>
              <h3 className="mt-12 max-w-xl text-[clamp(1.8rem,3.5vw,3rem)] leading-[1.05] text-white">{item.title}</h3>
              {item.detail ? <p className="mt-5 max-w-xl text-[0.98rem] leading-8 text-white/70">{item.detail}</p> : null}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
          <span className="text-xs text-white/50">Select another capability to explore</span>
          <button type="button" onClick={() => setActive((value) => (value + 1) % page.coreServices.length)}
            className="inline-flex min-h-11 items-center gap-2 bg-brand-teal px-5 text-sm font-semibold text-brand-pearl transition-colors hover:bg-white">
            Next capability <ArrowRight className="size-4" aria-hidden />
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
    <div className="mt-12 grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
      <div>
        <div className="mb-8 flex items-center justify-between gap-3">
          <Pill tone="mint"><Compass className="size-3.5" aria-hidden /> Your journey</Pill>
          <span className="font-mono text-xs text-muted">{String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
        </div>
        <div className="relative space-y-2">
          <div aria-hidden className="absolute bottom-7 left-[19px] top-7 w-px bg-brand-teal/30" />
          {steps.map((item, index) => (
            <button key={item.title} type="button" aria-pressed={active === index} onClick={() => setActive(index)}
              className={cn("relative flex w-full items-center gap-4 px-3 py-4 text-left transition-all duration-300",
                active === index ? "bg-brand-pearl text-white" : "text-brand-pearl hover:bg-white")}>
              <span className={cn("relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs",
                index < active ? "border-brand-teal bg-brand-teal text-brand-pearl" : active === index ? "border-brand-teal bg-brand-teal text-brand-pearl" : "border-line bg-white text-muted")}>
                {index < active ? <Check className="size-4" aria-hidden /> : String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block text-sm font-semibold", active === index ? "text-white" : "text-brand-pearl")}>{item.title}</span>
                <span className={cn("mt-1 block text-xs", active === index ? "text-white/50" : "text-muted")}>{active === index ? "Currently viewing" : "Explore this stage"}</span>
              </span>
              <ChevronRight className={cn("size-4", active === index ? "text-brand-teal" : "text-muted")} aria-hidden />
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex min-h-[390px] flex-col overflow-hidden bg-white p-7 shadow-[0_24px_70px_-50px_rgba(6,24,32,.45)] sm:p-10">
        <div className="flex items-center justify-between gap-4 border-b border-line-soft pb-5">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-mint">Stage {String(active + 1).padStart(2, "0")}</span>
          <span className="font-mono text-xs text-muted">{Math.round(((active + 1) / steps.length) * 100)}% complete</span>
        </div>
        <div className="mt-6 h-1 w-full bg-ink-raised" role="progressbar" aria-label="Process exploration progress" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={active + 1}>
          <div className="h-full bg-brand-teal transition-[width] duration-500" style={{ width: `${((active + 1) / steps.length) * 100}%` }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step.title} initial={{ opacity: 0, y: 20, filter: "blur(7px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(5px)" }} transition={{ duration: .32 }}>
            <h3 className="mt-9 max-w-xl text-[clamp(1.65rem,3vw,2.5rem)] leading-tight">{step.title}</h3>
            {step.detail ? <p className="prose-body mt-4 max-w-2xl text-[0.98rem]">{step.detail}</p> : null}
          </motion.div>
        </AnimatePresence>
        {step.sub ? (
          <div className="mt-7 border-l-2 border-brand-teal bg-surface p-5 sm:p-6">
            {step.sub.heading ? <p className="eyebrow mb-3">{step.sub.heading}</p> : null}
            {step.sub.lead ? <p className="mb-4 text-sm text-muted">{step.sub.lead}</p> : null}
            <div className="grid gap-4 sm:grid-cols-2">
              {step.sub.items.map((sub) => <div key={sub.title} className="flex gap-3">
                <Check className="mt-1 size-4 shrink-0 text-mint" aria-hidden />
                <div><p className="text-sm font-semibold text-fg">{sub.title}</p>{sub.detail ? <p className="mt-1 text-sm leading-6 text-muted">{sub.detail}</p> : null}</div>
              </div>)}
            </div>
          </div>
        ) : null}
        <div className="mt-auto flex flex-wrap justify-between gap-3 pt-9">
          <button type="button" disabled={active === 0} onClick={() => setActive((value) => Math.max(0, value - 1))}
            className="min-h-11 border border-line px-5 text-sm font-medium text-fg transition-colors hover:border-mint disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
          <button type="button" onClick={() => setActive((value) => (value + 1) % steps.length)}
            className="inline-flex min-h-11 items-center gap-2 bg-brand-pearl px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal hover:text-brand-pearl">
            {active === steps.length - 1 ? "Start again" : "Next stage"} <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ServiceTemplate({ page, crumbs }: { page: ServiceContent; crumbs: { label: string; to?: string }[] }) {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-brand-pearl text-white">
        <ServiceMotionField slug={page.slug} />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-pearl via-brand-pearl/95 to-brand-pearl/45" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-2/3 w-2/3 bg-gradient-to-tl from-brand-teal/20 via-transparent to-transparent" />
        <div className="wrap relative py-16 sm:py-24 lg:py-28">
          {crumbs.length ? <nav aria-label="Breadcrumb" className="mb-12">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.7rem] uppercase tracking-wider text-white/45">
              {crumbs.map((crumb, index) => <li key={crumb.label} className="flex items-center gap-2">
                {index > 0 ? <ChevronRight className="size-3" aria-hidden /> : null}
                {crumb.to ? <Link to={crumb.to} className="transition-colors hover:text-brand-teal">{crumb.label}</Link> : <span className="text-brand-teal">{crumb.label}</span>}
              </li>)}
            </ol>
          </nav> : null}
          <div className="grid items-end gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
            <div className="max-w-3xl">
              <div className="mb-7 inline-flex items-center gap-3">
                <span className="flex size-11 items-center justify-center border border-brand-teal/50 bg-brand-teal/10 text-brand-teal"><ServiceIcon icon={page.icon} className="size-5" strokeWidth={1.8} /></span>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-teal">{page.name}</span>
              </div>
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72, delay: .08, ease: [.22, 1, .36, 1] }}>
                <h1 className="max-w-4xl text-[clamp(2.8rem,6.2vw,5.6rem)] leading-[0.98] tracking-[-0.055em] text-white">{page.heroTitle}</h1>
                <p className="mt-7 max-w-2xl text-[1.02rem] leading-8 text-white/65 sm:text-lg">{page.intro}</p>
              </motion.div>
              <div className="mt-8 flex flex-wrap gap-3">
                {page.cta ? <Button to={page.cta.to} size="lg" magnetic>{page.cta.label}</Button> : null}
                <Link to="/services" className="inline-flex min-h-12 items-center gap-2 border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:border-brand-teal hover:text-brand-teal">Explore all services <ArrowUpRight className="size-4" aria-hidden /></Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/15 pt-6">
                <span className="font-mono text-xs text-white/55"><strong className="mr-2 text-brand-teal">{String(page.coreServices.length).padStart(2, "0")}</strong> core capabilities</span>
                {page.process ? <span className="font-mono text-xs text-white/55"><strong className="mr-2 text-brand-teal">{String(page.process.length).padStart(2, "0")}</strong> process stages</span> : null}
              </div>
            </div>

            <motion.div className="relative mx-auto w-full max-w-xl lg:pb-2" initial={{ opacity: 0, y: 36, rotateY: -8 }} animate={{ opacity: 1, y: 0, rotateY: 0 }} transition={{ duration: .9, delay: .18, ease: [.2,.8,.2,1] }}>
              <motion.div className="absolute -inset-5 border border-brand-teal/35" animate={{ opacity: [.35,.85,.35], scale: [1,1.018,1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
              <div className="relative isolate overflow-hidden bg-brand-pearl shadow-[0_35px_110px_-42px_rgba(0,0,0,.75)]">
                <PhotoFigure
                  src={page.image?.src ?? "/img/work/product-in-use.webp"}
                  alt={page.image?.alt ?? `Septa ${page.name} in practice`}
                  edge="none"
                  ratio="aspect-[4/5] sm:aspect-[5/4]"
                  className="w-full"
                  eager
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-pearl via-brand-pearl/25 to-brand-pearl/5" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-pearl/45 via-transparent to-transparent" />
                <div className="absolute left-5 top-5 flex items-center gap-3 border border-white/30 bg-brand-pearl/75 px-4 py-3 text-white backdrop-blur-md sm:left-7 sm:top-7">
                  <span className="relative flex size-2.5">
                    <motion.span className="absolute inline-flex size-full rounded-full bg-brand-teal" animate={{ scale: [1, 2.4], opacity: [0.8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
                    <span className="relative inline-flex size-2.5 rounded-full bg-brand-teal" />
                  </span>
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em]">SEPTA / IN PRACTICE</span>
                </div>
                <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand-teal shadow-[0_0_18px_5px_rgba(109,177,174,.38)]"
                  animate={{ y: ["0%", "65vh"] }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }} />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-brand-teal">What this enables</span>
                    <span className="font-mono text-xs text-white/55">{String(page.coreServices.length).padStart(2, "0")} capabilities</span>
                  </div>
                  <p className="max-w-lg text-2xl font-semibold leading-tight sm:text-3xl">{page.name}<span className="text-brand-teal">.</span></p>
                  <div className="mt-5 grid gap-2 border-t border-white/25 pt-4 sm:grid-cols-2">
                    {page.coreServices.slice(0, 2).map((item, index) => (
                      <div key={item.title} className="flex items-start gap-3 text-sm text-white/85">
                        <span className="font-mono text-xs text-brand-teal">{String(index + 1).padStart(2, "0")}</span>
                        <span>{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div aria-hidden className="h-1 w-full origin-left bg-gradient-to-r from-transparent via-brand-teal to-transparent" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, delay: .2 }} />
      </section>

      <Section wall="use-case" tone="surface" className="section">
        <div className="max-w-3xl">
          <SectionHeading eyebrow="What we do" title={page.coreServicesHeading} lead={page.coreServicesLead} />
        </div>
        <CapabilityExplorer page={page} />
      </Section>

      <Section wall="about" tone="raised" className="section border-y border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading eyebrow="The Septa difference" title={page.whyChooseHeading} />
            <p className="mt-6 max-w-sm text-sm leading-7 text-muted">A considered approach, built around the work your organisation needs to get done.</p>
          </div>
          <div className="grid gap-px bg-line-soft sm:grid-cols-2">
            {page.whyChoose.map((item, index) => <Reveal key={item.title} delay={index * 0.04}>
              <article className="group relative h-full min-h-48 bg-white p-6 transition-colors duration-300 hover:bg-[#f1f8f7] sm:p-7">
                <span className="font-mono text-xs tracking-widest text-mint/70">{String(index + 1).padStart(2, "0")}</span>
                <div className="mt-8 flex items-start justify-between gap-3">
                  <h3 className="max-w-xs text-xl">{item.title}</h3>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-mint opacity-0 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100" aria-hidden />
                </div>
                {item.detail ? <p className="mt-3 max-w-md text-sm leading-7 text-muted">{item.detail}</p> : null}
              </article>
            </Reveal>)}
          </div>
        </div>
      </Section>

      {page.process ? <Section wall="service-automation" tone="surface" className="section">
        <div className="max-w-3xl">
          <SectionHeading eyebrow="From first step to delivery" title={page.processHeading ?? "Our Process"} lead={page.processLead} />
        </div>
        <ProcessJourney page={page} />
      </Section> : null}

      {page.whoWeServe ? <Section wall="services" className="section border-y border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <SectionHeading eyebrow="Who we work with" title={page.whoWeServeHeading ?? "Who We Serve"} />
          <div className="grid gap-3 sm:grid-cols-2">
            {page.whoWeServe.map((item, index) => <Reveal key={item.title} delay={index * 0.04}>
              <Card className="h-full border border-white/10 bg-brand-pearl p-6 text-white transition-transform duration-300 hover:-translate-y-1">
                <span className="font-mono text-xs text-brand-teal">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-lg text-white">{item.title}</h3>
                {item.detail ? <p className="mt-3 text-sm leading-7 text-white/60">{item.detail}</p> : null}
              </Card>
            </Reveal>)}
          </div>
        </div>
      </Section> : null}

      {page.extra ? <Section wall="blog" tone="raised" className="section">
        <SectionHeading eyebrow={page.name} title={page.extra.heading} className="mb-8" />
        <div className="max-w-3xl space-y-4">{page.extra.paragraphs.map((paragraph, index) =>
          <Reveal key={paragraph.slice(0, 24)} delay={index * 0.05}><p className="prose-body text-[0.98rem]">{paragraph}</p></Reveal>)}</div>
      </Section> : null}

      {page.pending?.length ? <Section wall="use-case" tone="surface" className="section border-y border-line-soft">
        <div className="border border-dashed border-line bg-white p-6 sm:p-8">
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
