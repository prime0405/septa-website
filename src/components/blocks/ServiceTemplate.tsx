import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Compass } from "lucide-react";
import type { ServiceContent } from "../../data/services";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Reveal, Section, SectionHeading, Pill } from "../ui/primitives";
import { PhotoFigure } from "./PhotoFigure";
import { ServiceIcon } from "./ServiceIcon";


const anchorSlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function ServiceMotionField({ slug }: { slug: string }) {
  const reduce = useReducedMotion();
  const traces: Record<string, { primary: string; secondary: string }> = {
    "ai-product-development": {
      primary: "M760 90H570L470 190H330L230 290H0",
      secondary: "M760 410H600L500 310H390L290 410H130",
    },
    "workflow-automation": {
      primary: "M760 160H610V260H470V180H330V300H190V420H0",
      secondary: "M610 260H690V390H520V470H350",
    },
    "digital-transformation": {
      primary: "M760 100H650V190H540V280H420V370H280V460H120V540H0",
      secondary: "M760 500H650V410H540V320H420V230H280V140H120V70H0",
    },
    "observability-monitoring": {
      primary: "M760 300H650L620 300L590 210L555 390L520 150L485 440L450 260H0",
      secondary: "M760 500H620L580 450H500L460 500H380L340 450H0",
    },
    "talent-solution": {
      primary: "M760 90H610L500 200H380L260 320H0",
      secondary: "M760 500H620L500 390H380L260 270H120",
    },
  };
  const trace = traces[slug] ?? traces["ai-product-development"];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(95,221,157,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(95,221,157,.07) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="absolute right-[10%] top-[14%] size-72 rounded-full bg-brand-mint/[0.10] blur-[110px]" />
      <svg className="absolute right-0 top-0 h-full w-[58%] opacity-[0.14]" viewBox="0 0 760 620" fill="none">
        <motion.path
          d={trace.primary}
          stroke="#5fdd9d"
          strokeWidth="1.2"
          strokeDasharray="5 13"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 2.8, ease: "easeOut" }}
        />
        <motion.path
          d={trace.secondary}
          stroke="#6db1ae"
          strokeWidth="1"
          strokeDasharray="3 15"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 3.2, delay: 0.15, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

function CapabilityExplorer({ page }: { page: ServiceContent }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion();
  const item = page.coreServices[active];

  const visuals: Record<string, Record<string, { src: string; alt: string; tag: string }>> = {
    "ai-product-development": {
      "UI/UX Design": { src: "/img/services/UIUX Design.jpg", alt: "A design workspace showing desktop and mobile wireframes connected in a prototype flow", tag: "EXPERIENCE DESIGN" },
      "Web Development": { src: "/img/work/product-in-use.webp", alt: "A worker uses a handheld digital interface while an operational dashboard tracks activity in the background", tag: "WEB PLATFORMS" },
      "Mobile App Development": { src: "/img/services/Mobile App Development.jpg", alt: "A set of polished mobile application screens displayed in smartphone mockups", tag: "MOBILE PRODUCTS" },
      "AI and Machine Learning Integration": { src: "/img/work/ai-model-build.webp", alt: "Machine learning model pipeline connecting data, training and product features", tag: "AI & MACHINE LEARNING" },
      "End-to-End Delivery": { src: "/img/work/product-delivery.webp", alt: "Two colleagues review connected product screens beside a delivery pipeline with completed stages and one in progress", tag: "END-TO-END BUILD" },
    },
    "workflow-automation": {
      "Business Process Automation": { src: "/img/services/Business Process Automation.jpg", alt: "A workflow automation dashboard showing connected triggers, data collection, validation and completion steps", tag: "WORKFLOW DESIGN" },
      "Custom Automation Tools": { src: "/img/work/automation-flows.webp", alt: "A monitor displays an automation flow with triggers, branching steps and completed actions", tag: "CUSTOM AUTOMATION" },
      "System Integration": { src: "/img/work/product-in-use.webp", alt: "A worker uses a handheld scanner interface while an operations dashboard tracks the wider workflow", tag: "SYSTEM INTEGRATION" },
      "Repetitive Task Elimination": { src: "/img/work/transformation-floor.webp", alt: "Paper records and a legacy terminal sit beside a tablet displaying a modern digital dashboard", tag: "PROCESS IMPROVEMENT" },
    },
    "digital-transformation": {
      "Process Modernization": { src: "/img/services/Digital Transformation.jpg", alt: "A team reviews a digital workflow diagram connecting documents, mobile interfaces, cloud storage and data systems", tag: "PROCESS MODERNISATION" },
      "Cloud Migration": { src: "/img/services/Cloud Migration.jpg", alt: "Cloud migration architecture moving workloads from on-premise infrastructure into cloud services", tag: "CLOUD & INFRASTRUCTURE" },
      "Data Intelligence": { src: "/img/services/Data intelligence.jpg", alt: "Black data analyst interpreting business intelligence dashboards and data visualisations", tag: "DATA INTELLIGENCE" },
      "Customer Experience Upgrades": { src: "/img/services/UIUX Design.jpg", alt: "Desktop and mobile interface wireframes connected as a user journey prototype", tag: "CUSTOMER EXPERIENCE" },
      "Change Management Support": { src: "/img/work/transformation-floor.webp", alt: "An older terminal and paper-based workflow sit beside a tablet showing a modern digital dashboard", tag: "CHANGE & ADOPTION" },
    },
    "observability-monitoring": {
      "Real-Time Monitoring": { src: "/img/services/Real-Time Monitoring.jpg", alt: "A server monitoring dashboard showing availability, health status, alerts and performance metrics", tag: "LIVE SYSTEM HEALTH" },
      "Log Management": { src: "/img/work/observability-noc.webp", alt: "Monitoring screens showing a latency graph, service health tiles and a live log stream", tag: "LOG INTELLIGENCE" },
      "Performance Optimization": { src: "/img/services/Performance Optimization.jpg", alt: "A performance overview dashboard showing core web vitals, page-speed scores and optimization opportunities", tag: "PERFORMANCE TUNING" },
      "Dashboards & Reporting": { src: "/img/services/Dashboards & Reporting.jpg", alt: "A business intelligence dashboard showing revenue, sales, customers and performance charts", tag: "REPORTING & ALERTS" },
    },
    "talent-solution": {
      "Access to a Pool of Pre-Screened Talent": { src: "/img/services/Access to a Pool of Pre-Screened Talent.jpg", alt: "A recruitment planning session with a facilitator and team reviewing hiring priorities on a whiteboard", tag: "TALENT SOURCING" },
      "Tailored Recruitment Process": { src: "/img/services/tailored recruitment process.jpg", alt: "A recruiter speaking with a candidate during an interview", tag: "TAILORED RECRUITMENT" },
      "Payroll Management": { src: "/img/services/Payroll Management.jpg", alt: "An HR professional reviews payroll and employee records across desktop and tablet interfaces", tag: "PAYROLL OPERATIONS" },
      "Employee Benefits Administration": { src: "/img/services/Hr customer benefits.jpg", alt: "An HR professional and employee review workplace benefits documents together", tag: "PEOPLE & BENEFITS" },
    },
  };
  const visual = visuals[page.slug]?.[item.title] ?? {
    src: page.image?.src ?? "/img/work/product-delivery.webp",
    alt: page.image?.alt ?? `Septa ${page.name} capability in practice`,
    tag: "CAPABILITY OVERVIEW",
  };

  // Advance the capability carousel automatically. Any manual selection restarts this timer.
  useEffect(() => {
    if (page.coreServices.length < 2) return;
    const timer = window.setTimeout(() => {
      setDirection(1);
      setActive((current) => (current + 1) % page.coreServices.length);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [active, page.coreServices.length]);

  useEffect(() => {
    const target = window.location.hash.match(/^#capability-(.+)$/)?.[1];
    if (!target) return;
    const index = page.coreServices.findIndex((capability) => anchorSlug(capability.title) === target);
    if (index < 0) return;
    setActive(index);
    document.getElementById(`capability-${target}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [page.slug, page.coreServices]);

  if (!item) return null;

  const goTo = (index: number) => {
    const length = page.coreServices.length;
    const next = ((index % length) + length) % length;
    if (next === active) return;

    const forwardDistance = (next - active + length) % length;
    const backwardDistance = (active - next + length) % length;
    setDirection(forwardDistance <= backwardDistance ? 1 : -1);
    setActive(next);
  };

  return (
    <div
      className="service-capability-carousel mt-12 overflow-hidden rounded-[2rem] border border-brand-teal/25 bg-[#061820] text-white shadow-[0_32px_90px_-48px_rgba(6,24,32,.72)] sm:rounded-[2.5rem]"
      role="region"
      aria-label={page.coreServicesHeading}
    >
      <div className="grid lg:min-h-[400px] lg:grid-cols-[1.04fr_.96fr]">
        <div className="service-capability-art relative min-h-[230px] overflow-hidden sm:min-h-[300px] lg:min-h-[400px]">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_18%,rgba(109,177,174,.28),transparent_52%),linear-gradient(145deg,#123a43,#061820_72%)]" />
          <div aria-hidden className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: "linear-gradient(rgba(109,177,174,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(109,177,174,.4) 1px,transparent 1px)", backgroundSize: "34px 34px" }} />
          <div className="absolute inset-0">
            <AnimatePresence mode="sync" initial={false} custom={direction}>
              <motion.div
                key={visual.src + active}
                custom={direction}
                initial={{ opacity: 0, x: direction * 44 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -36 }}
                className="absolute inset-0"
                transition={{ duration: reduce ? 0 : 0.58, ease: [0.22, 1, 0.36, 1] }}
              >
                {visual.src ? (
                  <>
                    <img
                      src={encodeURI(visual.src)}
                      alt={visual.alt}
                      loading="eager"
                      decoding="async"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/img/work/product-delivery.webp";
                      }}
                      className="size-full object-cover"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#061820]/90 via-[#061820]/15 to-[#061820]/10" />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#061820]/20 via-transparent to-[#061820]/10" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div aria-hidden className="size-44 rounded-full border border-brand-teal/30 bg-brand-teal/[0.06] shadow-[0_0_90px_rgba(109,177,174,.16)]" />
                    <div aria-hidden className="absolute size-28 rotate-45 border border-brand-teal/40" />
                    <div aria-hidden className="absolute h-px w-3/4 bg-gradient-to-r from-transparent via-brand-teal/60 to-transparent" />
                    <span className="absolute bottom-8 font-sans text-[.65rem] tracking-[.24em] text-white/50">SEPTA / DIGITAL CAPABILITY</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
            <div>
              <p className="font-sans text-[.62rem] tracking-[.2em] text-[#91d9cf]">{visual.tag}</p>
              
            </div>
            <span className="font-sans text-4xl font-light text-white/65 sm:text-5xl">{String(active + 1).padStart(2, "0")}</span>
          </div>
        </div>

        <div className="service-capability-copy relative flex flex-col justify-between overflow-hidden bg-[#DDEFE6] p-5 sm:p-7 lg:p-8">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full border border-brand-teal/20" />
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-brand-teal/[0.12] blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <span className="font-sans text-[.68rem] uppercase tracking-[.22em] text-[#91d9cf]">What we do / Core services</span>

            </div>
            <div className="mt-5 grid min-w-0 sm:mt-6">
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={item.title}
                  className="col-start-1 row-start-1 min-w-0"
                  initial={{ opacity: 0, x: direction * 28, y: 5 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: direction * -22, y: -3 }}
                  transition={{ duration: reduce ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-sans text-xs tracking-[.2em] text-[#75c9bd]">CAPABILITY / {String(active + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 max-w-xl break-words text-balance text-[clamp(1.8rem,3.5vw,3rem)] leading-[1.08] tracking-tight text-white">{item.title}</h3>
                  {item.detail ? <p className="mt-5 max-w-xl break-words text-[.98rem] leading-7 text-white/75 sm:leading-8">{item.detail}</p> : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative mt-6">
            <p className="mb-3 text-xs text-white/55">Explore each capability</p>
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              {page.coreServices.map((capability, index) => (
                <button
                  id={`capability-${anchorSlug(capability.title)}`}
                  key={capability.title}
                  type="button"
                  aria-label={`Show capability ${index + 1}: ${capability.title}`}
                  aria-current={active === index ? "true" : undefined}
                  onClick={() => goTo(index)}
                  className={cn(
                    "group relative flex min-h-[66px] min-w-0 items-center gap-2.5 overflow-hidden rounded-[1rem] rounded-tr-[1.8rem] rounded-bl-[1.45rem] border px-3 py-2.5 text-left transition-all duration-300 sm:min-h-[72px] sm:px-3.5 sm:py-3",
                    active === index
                      ? "border-[#6db1ae]/70 bg-[#6db1ae]/15 text-[#123f3d] shadow-[0_10px_24px_-18px_rgba(6,44,42,.65),inset_0_0_0_1px_rgba(109,177,174,.18)]"
                      : "border-[#6db1ae]/25 bg-white/65 text-[#17383b] hover:-translate-y-0.5 hover:border-[#6db1ae]/60 hover:bg-white hover:shadow-[0_12px_26px_-20px_rgba(6,44,42,.55)]"
                  )}
                >
                  <strong className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md rounded-br-lg border font-sans text-[.64rem] font-bold transition-colors",
                    active === index
                      ? "border-[#286f6a]/30 bg-[#286f6a] text-white"
                      : "border-[#286f6a]/20 bg-[#eaf5f0] text-[#286f6a]"
                  )}>
                    {String(index + 1).padStart(2, "0")}
                  </strong>
                  <span className="min-w-0 flex-1 whitespace-normal break-words [overflow-wrap:anywhere] text-[.74rem] font-semibold leading-[1.3] sm:text-[.78rem]">
                    {capability.title}
                  </span>
                  <span aria-hidden className={cn(
                    "absolute bottom-0 right-0 h-1 w-10 rounded-tl-full transition-all",
                    active === index ? "bg-[#286f6a] w-14" : "bg-[#6db1ae]/35 group-hover:w-14"
                  )} />
                </button>
              ))}
            </div>
            <p className="sr-only" aria-live="polite">{item.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessJourney({ page }: { page: ServiceContent }) {
  const steps = page.process ?? [];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const target = window.location.hash.match(/^#process-stage-(\d+)$/)?.[1];
    if (target) {
      const index = Number(target) - 1;
      if (index >= 0 && index < steps.length) {
        setActive(index);
        document.getElementById(`process-stage-${target}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [page.slug, steps.length]);

  useEffect(() => {
    if (steps.length < 2) return;

    const timer = window.setTimeout(() => {
      setActive((current) => (current + 1) % steps.length);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [active, steps.length]);

  const step = steps[active];
  if (!step) return null;

  return (
    <div className="service-process-journey mt-12 grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
      <div>
        <div className="mb-8 flex items-center justify-between gap-3">
          <Pill tone="mint"><Compass className="size-3.5" aria-hidden /> Your journey</Pill>
          <span className="font-sans text-xs text-muted">{String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
        </div>
        <div className="relative space-y-2">
          <div aria-hidden className="absolute bottom-7 left-[19px] top-7 w-px bg-brand-teal/30" />
          {steps.map((item, index) => (
            <button id={`process-stage-${index + 1}`} key={item.title} type="button" aria-pressed={active === index} onClick={() => setActive(index)}
              className={cn("relative flex w-full items-center gap-4 rounded-2xl border px-3 py-4 text-left transition-all duration-300",
                active === index ? "border-brand-pearl bg-brand-pearl text-white shadow-lg shadow-brand-pearl/10" : "border-transparent text-brand-pearl hover:border-white/60 hover:bg-white/55")}>
              <span className={cn("relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-sans text-xs",
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

      <div className="service-glass relative flex min-h-[390px] flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-white/55 p-7 shadow-[0_24px_70px_-50px_rgba(6,24,32,.45)] backdrop-blur-xl sm:rounded-[2.4rem] sm:p-10">
        <div className="border-b border-line-soft pb-5">
          <span className="font-sans text-xs uppercase tracking-[0.18em] text-mint">How we work</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step.title} initial={{ opacity: 0, y: 20, filter: "blur(7px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(5px)" }} transition={{ duration: .32 }}>
            <h3 className="mt-9 max-w-xl text-[clamp(1.65rem,3vw,2.5rem)] leading-tight">{step.title}</h3>
            {step.detail ? <p className="prose-body mt-4 max-w-2xl text-[0.98rem]">{step.detail}</p> : null}
          </motion.div>
        </AnimatePresence>
        {step.sub ? (
          <div className="mt-7 rounded-2xl border border-brand-teal/20 border-l-4 border-l-brand-teal bg-surface/90 p-5 sm:p-6">
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
    <div className="service-page">
      <section data-static-hero="" className="relative isolate overflow-hidden bg-[#061820] text-white">
        <ServiceMotionField slug={page.slug} />

        <div className="wrap relative py-11 sm:py-14 lg:py-16">
          {crumbs.length ? <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-sans text-[0.7rem] uppercase tracking-wider text-white/55">
              {crumbs.map((crumb, index) => <li key={crumb.label} className="flex items-center gap-2">
                {index > 0 ? <ChevronRight className="size-3" aria-hidden /> : null}
                {crumb.to ? <Link to={crumb.to} className="transition-colors hover:text-brand-mint">{crumb.label}</Link> : <span className="text-white">{crumb.label}</span>}
              </li>)}
            </ol>
          </nav> : null}
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-3">
                <span className="flex size-11 items-center justify-center border border-brand-mint/35 bg-brand-mint/[0.07] text-brand-mint"><ServiceIcon icon={page.icon} className="size-5" strokeWidth={1.8} /></span>
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-mint">{page.name}</span>
              </div>
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72, delay: .08, ease: [.22, 1, .36, 1] }}>
                <h1 className="max-w-4xl text-[clamp(2.8rem,6.2vw,5.6rem)] leading-[0.98] tracking-[-0.055em] text-white">{page.heroTitle}</h1>
                <p className="mt-5 max-w-2xl text-[.98rem] leading-7 text-white/75 sm:text-base sm:leading-7">{page.intro}</p>
              </motion.div>
              <div className="mt-6 flex flex-wrap gap-3">
                {page.cta ? <Button to={page.cta.to} size="lg" variant="dark-cta" magnetic>{page.cta.label}</Button> : null}
                <Link to="/services" className="inline-flex min-h-12 items-center gap-2 border border-white/30 px-5 text-sm font-semibold text-white transition-colors hover:border-brand-mint hover:bg-white/[0.04]">Explore all services <ArrowUpRight className="size-4" aria-hidden /></Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/20 pt-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-3 py-2 font-sans text-xs text-white/75"><strong className="text-white">{String(page.coreServices.length).padStart(2, "0")}</strong> core capabilities</span>
                {page.process ? <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-3 py-2 font-sans text-xs text-white/75"><strong className="text-white">{String(page.process.length).padStart(2, "0")}</strong> process stages</span> : null}
              </div>
            </div>

            <motion.div className="service-glass relative mx-auto w-full max-w-lg rounded-[2.25rem] border border-brand-teal/25 bg-white/[0.04] p-2.5 backdrop-blur-xl sm:p-3 lg:pb-2" initial={{ opacity: 0, y: 36, rotateY: -8 }} animate={{ opacity: 1, y: 0, rotateY: 0 }} transition={{ duration: .9, delay: .18, ease: [.2,.8,.2,1] }}>
              <div aria-hidden className="pointer-events-none absolute -inset-2 rounded-[2.6rem] border border-brand-teal/25" />
              <div className="relative isolate overflow-hidden rounded-[1.8rem] bg-brand-pearl shadow-[0_35px_110px_-42px_rgba(0,0,0,.75)] sm:rounded-[2rem]">
                <PhotoFigure
                  src={page.image?.src ?? "/img/work/product-in-use.webp"}
                  alt={page.image?.alt ?? `Septa ${page.name} in practice`}
                  edge="none"
                  ratio="aspect-[5/4]"
                  className="w-full photo-soft-frame"
                  eager
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-pearl via-brand-pearl/25 to-brand-pearl/5" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-pearl/45 via-transparent to-transparent" />
                <div className="absolute left-5 top-5 flex items-center gap-3 rounded-full border border-white/30 bg-brand-pearl/75 px-4 py-3 text-white shadow-lg backdrop-blur-md sm:left-7 sm:top-7">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex size-full rounded-full bg-brand-teal/25" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-brand-teal" />
                  </span>
                  <span className="font-sans text-[0.62rem] uppercase tracking-[0.2em]">SEPTA / IN PRACTICE</span>
                </div>
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand-teal/55" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="font-sans text-[0.62rem] uppercase tracking-[0.2em] text-brand-teal">What this enables</span>
                    <span className="font-sans text-xs text-white/55">{String(page.coreServices.length).padStart(2, "0")} capabilities</span>
                  </div>
                  <p className="max-w-lg text-2xl font-semibold leading-tight sm:text-3xl">{page.name}<span className="text-brand-teal">.</span></p>
                  <div className="mt-5 grid gap-2 border-t border-white/25 pt-4 sm:grid-cols-2">
                    {page.coreServices.slice(0, 2).map((item, index) => (
                      <div key={item.title} className="flex items-start gap-3 text-sm text-white/85">
                        <span className="font-sans text-xs text-brand-teal">{String(index + 1).padStart(2, "0")}</span>
                        <span>{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div aria-hidden className="h-1 w-full origin-left bg-gradient-to-r from-transparent via-brand-mint/55 to-transparent" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, delay: .2 }} />
      </section>

      <Section id="core-services" wall="use-case" tone="surface" className="section">
        <div className="max-w-3xl">
          <SectionHeading eyebrow="What we do" title={page.coreServicesHeading} lead={page.coreServicesLead} />
        </div>
        <CapabilityExplorer key={page.slug} page={page} />
      </Section>

      <Section id="the-septa-difference" wall="about" tone="raised" className="section service-why-section border-y border-line-soft">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading eyebrow="The Septa difference" title={page.whyChooseHeading} />
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted">
              A considered approach, built around the work your organisation needs to get done.
            </p>
          </div>

          <div className="septa-orbit mt-10 sm:mt-14" style={{ "--orbit-count": page.whyChoose.length } as CSSProperties}>
            <div className="septa-orbit__stage">
              <div className="septa-orbit__track" aria-hidden="true" />
              <figure className="septa-orbit__portrait">
                <img
                  src={encodeURI("/img/services/Confident Corporate Portrait of a Smiling Executive.png")}
                  alt="Smiling Black business executive in a black suit, standing with his arms crossed"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>People first. Technology with purpose.</figcaption>
              </figure>
              <div className="septa-orbit__cards">
                {page.whyChoose.map((item, index) => {
                  const angle = -90 + (360 / page.whyChoose.length) * index;
                  return (
                    <div
                      key={item.title}
                      className="septa-orbit__item"
                      style={{ "--orbit-angle": `${angle}deg`, "--orbit-index": index } as CSSProperties}
                    >
                      <Link
                        to={item.href ?? "#core-services"}
                        className="septa-orbit__card group"
                      >
                        <span className="septa-orbit__number">{String(index + 1).padStart(2, "0")}</span>
                        <span className="septa-orbit__copy">
                          <strong>{item.title}</strong>
                          {item.detail ? <span>{item.detail}</span> : null}
                        </span>
                        <ArrowUpRight className="septa-orbit__arrow" aria-hidden />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {page.process ? <Section id="our-process" wall="service-automation" tone="surface" className="section">
        <div className="max-w-3xl">
          <SectionHeading eyebrow="From first step to delivery" title={page.processHeading ?? "Our Process"} lead={page.processLead} />
        </div>
        <ProcessJourney key={page.slug} page={page} />
      </Section> : null}

      {page.whoWeServe ? <Section wall="services" tone="surface" className="section border-y border-[#DDEFE6]">
        <div className="mb-10 max-w-3xl">
          <SectionHeading
            eyebrow="Who we work with"
            title={page.whoWeServeHeading ?? "Who We Serve"}
            lead="Septa works with teams and organizations whose needs align with this service."
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {page.whoWeServe.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <article className="group relative h-full min-h-48 overflow-hidden rounded-[1.65rem] border border-[#DDEFE6] bg-white p-6 text-[#344B49] shadow-[0_16px_42px_-34px_rgba(52,75,73,.35)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6DB1AE] sm:p-7">
                <span className="inline-flex size-9 items-center justify-center rounded-full border border-[#6DB1AE]/45 bg-[#DDEFE6] font-sans text-xs tracking-widest text-[#344B49]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-7 text-xl font-semibold leading-snug text-[#344B49]">{item.title}</h3>
                {item.detail ? <p className="mt-3 text-sm leading-7 text-[#344B49]/80">{item.detail}</p> : null}
                <div className="mt-6 h-1 w-12 rounded-full bg-[#6DB1AE] transition-all duration-300 group-hover:w-20" />
              </article>
            </Reveal>
          ))}
        </div>
      </Section> : null}

      {page.extra ? <Section wall="blog" tone="raised" className="section">
        <div className="service-extra-panel service-glass relative isolate overflow-hidden rounded-[2rem] border border-[#DDEFE6] bg-white p-7 text-[#344B49] shadow-[0_30px_80px_-55px_rgba(52,75,73,.18)] sm:rounded-[2.5rem] sm:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 size-[28rem] rounded-full border border-brand-teal/20" />
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-16 size-[20rem] rounded-full bg-brand-teal/10 blur-[80px]" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="font-sans text-[0.68rem] uppercase tracking-[0.22em] text-brand-teal">{page.name}</p>
              <h2 className="mt-5 max-w-sm text-[clamp(1.8rem,3.2vw,2.7rem)] font-semibold leading-[1.08] tracking-tight text-white">{page.extra.heading}</h2>
            </div>
            <div className="space-y-5 border-l border-brand-teal/30 pl-6 sm:pl-8">
              {page.extra.paragraphs.map((paragraph, index) =>
                <Reveal key={paragraph.slice(0, 24)} delay={index * 0.05}>
                  <p className="max-w-3xl text-[1.02rem] leading-8 text-white/75">{paragraph}</p>
                </Reveal>)}
            </div>
          </div>
        </div>
      </Section> : null}

    </div>
  );
}
