import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Compass, Pause, Play } from "lucide-react";
import type { ServiceContent } from "../../data/services";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Reveal, Section, SectionHeading, Pill } from "../ui/primitives";
import { PhotoFigure } from "./PhotoFigure";
import { ServiceIcon } from "./ServiceIcon";
import { useAutoPause } from "../../lib/useRollCycle";


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
            "linear-gradient(rgba(6,24,32,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(6,24,32,.14) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="absolute right-[10%] top-[14%] size-72 rounded-full bg-brand-pearl/[0.08] blur-[110px]" />
      <svg className="absolute right-0 top-0 h-full w-[58%] opacity-[0.14]" viewBox="0 0 760 620" fill="none">
        <motion.path
          d={trace.primary}
          stroke="#344B49"
          strokeWidth="1.2"
          strokeDasharray="5 13"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 2.8, ease: "easeOut" }}
        />
        <motion.path
          d={trace.secondary}
          stroke="#344B49"
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
  const [paused, setPaused] = useState(false);
  const { reduce, frozen, ref: carouselRef, hoverProps } = useAutoPause();

  useEffect(() => {
    if (frozen || paused || page.coreServices.length < 2) return;
    const timer = window.setTimeout(() => {
      setDirection(1);
      setActive((current) => (current + 1) % page.coreServices.length);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [active, frozen, page.coreServices.length, paused]);
  const item = page.coreServices[active];
  if (!item) return null;

  const visuals: Record<string, Record<string, { src: string; alt: string; tag: string }>> = {
    "ai-product-development": {
      "UI/UX Design": { src: "/img/services/UIUX Design.jpg", alt: "Black product designer reviewing interface wireframes and a connected prototype", tag: "EXPERIENCE DESIGN" },
      "Web Development": { src: "", alt: "Responsive website layouts displayed across desktop and mobile screens", tag: "WEB PLATFORMS" },
      "Mobile App Development": { src: "/img/services/Mobile App Development.jpg", alt: "A set of polished mobile application screens displayed in smartphone mockups", tag: "MOBILE PRODUCTS" },
      "AI and Machine Learning Integration": { src: "", alt: "Machine learning model pipeline connecting data, training and product features", tag: "AI & MACHINE LEARNING" },
      "End-to-End Delivery": { src: "", alt: "Software product lifecycle from planning and development through testing and deployment", tag: "END-TO-END BUILD" },
    },
    "workflow-automation": {
      "Business Process Automation": { src: "/img/services/Business Process Automation.jpg", alt: "Black operations professional reviewing an automated business workflow", tag: "WORKFLOW DESIGN" },
      "Custom Automation Tools": { src: "", alt: "Custom operations software interface with controls and automated task status", tag: "CUSTOM AUTOMATION" },
      "System Integration": { src: "", alt: "API architecture diagram connecting business applications and data services", tag: "SYSTEM INTEGRATION" },
      "Repetitive Task Elimination": { src: "", alt: "Document processing workflow showing manual steps replaced by automated actions", tag: "PROCESS IMPROVEMENT" },
    },
    "digital-transformation": {
      "Process Modernization": { src: "/img/services/Digital Transformation.jpg", alt: "Business process transitioning from legacy paperwork and systems to a modern digital workflow", tag: "PROCESS MODERNISATION" },
      "Cloud Migration": { src: "/img/services/Cloud Migration.jpg", alt: "Cloud migration architecture moving workloads from on-premise infrastructure into cloud services", tag: "CLOUD & INFRASTRUCTURE" },
      "Data Intelligence": { src: "/img/services/Data intelligence.jpg", alt: "Black data analyst interpreting business intelligence dashboards and data visualisations", tag: "DATA INTELLIGENCE" },
      "Customer Experience Upgrades": { src: "", alt: "Customer journey and omnichannel service experience interface", tag: "CUSTOMER EXPERIENCE" },
      "Change Management Support": { src: "", alt: "Black and diverse team collaborating during a digital change and adoption workshop", tag: "CHANGE & ADOPTION" },
    },
    "observability-monitoring": {
      "Real-Time Monitoring": { src: "/img/services/Real-Time Monitoring.jpg", alt: "Black network operations engineer monitoring live infrastructure and service health screens", tag: "LIVE SYSTEM HEALTH" },
      "Log Management": { src: "/img/services/Real time moitoring.jpg", alt: "Black software engineer investigating application logs and system event records", tag: "LOG INTELLIGENCE" },
      "Performance Optimization": { src: "/img/services/Performance Optimization.jpg", alt: "Black systems engineer reviewing application response times and performance metrics", tag: "PERFORMANCE TUNING" },
      "Dashboards & Reporting": { src: "/img/services/Dashboards & Reporting.jpg", alt: "Business intelligence dashboard with key performance indicators, charts and reporting panels", tag: "REPORTING & ALERTS" },
    },
    "talent-solution": {
      "Access to a pool of pre-scanned talent solutions": { src: "/img/services/Access to a Pool of Pre-Screened Talent.jpg", alt: "Candidate talent database with profiles, verified skills and role matching indicators", tag: "TALENT SOURCING" },
      "Tailored Recruitment process": { src: "/img/services/tailored recruitment process.jpg", alt: "Black recruiter conducting a tailored interview with a candidate", tag: "TAILORED RECRUITMENT" },
      "Payroll management": { src: "/img/services/Payroll Management.jpg", alt: "Payroll administration interface showing salary records, payslips and payment status", tag: "PAYROLL OPERATIONS" },
      "Employee benefits administration": { src: "/img/services/Hr customer benefits.jpg", alt: "Black HR professional helping an employee review healthcare, pension and insurance benefits", tag: "PEOPLE & BENEFITS" },
    },
  };
  const visual = visuals[page.slug]?.[item.title] ?? {
    src: "",
    alt: "",
    tag: "CAPABILITY OVERVIEW",
  };
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
      ref={carouselRef}
      className="service-capability-carousel mt-12 overflow-hidden rounded-[2rem] border border-brand-teal/25 bg-[#071f27] text-white shadow-[0_32px_90px_-48px_rgba(6,24,32,.72)] sm:rounded-[2.5rem]"
      role="region"
      aria-roledescription="carousel"
      aria-label={page.coreServicesHeading}
      {...hoverProps}
    >
      <div className="grid lg:min-h-[470px] lg:grid-cols-[1.04fr_.96fr]">
        <div className="service-capability-art relative min-h-[260px] overflow-hidden sm:min-h-[360px] lg:min-h-[470px]">
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
                    <img src={visual.src} alt={visual.alt} loading="eager" decoding="async" className="size-full object-cover" />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#061820]/90 via-[#061820]/15 to-[#061820]/10" />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#061820]/20 via-transparent to-[#061820]/10" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div aria-hidden className="size-44 rounded-full border border-brand-teal/30 bg-brand-teal/[0.06] shadow-[0_0_90px_rgba(109,177,174,.16)]" />
                    <div aria-hidden className="absolute size-28 rotate-45 border border-brand-teal/40" />
                    <div aria-hidden className="absolute h-px w-3/4 bg-gradient-to-r from-transparent via-brand-teal/60 to-transparent" />
                    <span className="absolute bottom-8 font-mono text-[.65rem] tracking-[.24em] text-white/50">SEPTA / DIGITAL CAPABILITY</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/25 bg-[#061820]/70 px-3 py-2 backdrop-blur-md sm:left-7 sm:top-7">
            <span className="size-2 rounded-full bg-[#72d8bd] shadow-[0_0_14px_rgba(114,216,189,.8)]" />
            <span className="font-mono text-[.62rem] tracking-[.18em] text-white/90">SEPTA / CAPABILITY {String(active + 1).padStart(2, "0")}</span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
            <div>
              <p className="font-mono text-[.62rem] tracking-[.2em] text-[#91d9cf]">{visual.tag}</p>
              
            </div>
            <span className="font-mono text-4xl font-light text-white/65 sm:text-5xl">{String(active + 1).padStart(2, "0")}</span>
          </div>
        </div>

        <div className="relative flex min-h-[360px] flex-col justify-between overflow-hidden bg-[linear-gradient(145deg,#10333c,#071f27_68%)] p-6 sm:p-9 lg:p-10">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full border border-brand-teal/20" />
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-brand-teal/[0.12] blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[.68rem] uppercase tracking-[.22em] text-[#91d9cf]">What we do / Core services</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-white/55">{String(active + 1).padStart(2, "0")} <span className="text-white/30">/</span> {String(page.coreServices.length).padStart(2, "0")}</span>
                <button type="button" aria-pressed={paused} aria-label={paused ? "Resume automatic capability rotation" : "Pause automatic capability rotation"} onClick={() => setPaused((value) => !value)} className="inline-flex size-9 items-center justify-center rounded-full border border-white/20 text-white/75 transition-colors hover:border-[#91d9cf] hover:text-white">
                  {paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
                </button>
              </div>
            </div>
            <div className="mt-8 grid min-w-0 sm:mt-10">
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={item.title}
                  className="col-start-1 row-start-1 min-w-0"
                  initial={{ opacity: 0, x: direction * 28, y: 5 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: direction * -22, y: -3 }}
                  transition={{ duration: reduce ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-mono text-xs tracking-[.2em] text-[#75c9bd]">CAPABILITY / {String(active + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 max-w-xl break-words text-balance text-[clamp(1.8rem,3.5vw,3rem)] leading-[1.08] tracking-tight text-white">{item.title}</h3>
                  {item.detail ? <p className="mt-5 max-w-xl break-words text-[.98rem] leading-7 text-white/75 sm:leading-8">{item.detail}</p> : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative mt-10">
            <p className="mb-5 text-xs text-white/55">Explore each capability</p>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {page.coreServices.map((capability, index) => (
                <button key={capability.title} type="button" aria-label={`Show capability ${index + 1}: ${capability.title}`} aria-current={active === index ? "true" : undefined} onClick={() => goTo(index)}
                  className={cn("min-h-10 min-w-0 break-words rounded-xl border px-3 py-2 text-left text-xs font-semibold leading-snug transition-all duration-300 sm:flex-1", active === index ? "border-[#91d9cf]/70 bg-[#6db1ae]/20 text-white shadow-[inset_0_0_0_1px_rgba(145,217,207,.12)]" : "border-white/15 bg-white/[.035] text-white/65 hover:border-white/35 hover:bg-white/[.08] hover:text-white")}>
                  <span className="mr-2 font-mono text-[.62rem] text-[#91d9cf]">{String(index + 1).padStart(2, "0")}</span>{capability.title}
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
  const [paused, setPaused] = useState(false);
  const { frozen, ref: journeyRef, hoverProps } = useAutoPause();
  useEffect(() => {
    if (frozen || paused || steps.length < 2) return;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % steps.length), 3000);
    return () => window.clearTimeout(timer);
  }, [active, frozen, steps.length, paused]);
  const step = steps[active];
  if (!step) return null;

  return (
    <div ref={journeyRef} {...hoverProps} className="mt-12 grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
      <div>
        <div className="mb-8 flex items-center justify-between gap-3">
          <Pill tone="mint"><Compass className="size-3.5" aria-hidden /> Your journey</Pill>
          <span className="font-mono text-xs text-muted">{String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
        </div>
        <div className="relative space-y-2">
          <div aria-hidden className="absolute bottom-7 left-[19px] top-7 w-px bg-brand-teal/30" />
          {steps.map((item, index) => (
            <button key={item.title} type="button" aria-pressed={active === index} onClick={() => setActive(index)}
              className={cn("relative flex w-full items-center gap-4 rounded-2xl border px-3 py-4 text-left transition-all duration-300",
                active === index ? "border-brand-pearl bg-brand-pearl text-white shadow-lg shadow-brand-pearl/10" : "border-transparent text-brand-pearl hover:border-white/60 hover:bg-white/55")}>
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

      <div className="service-glass relative flex min-h-[390px] flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-white/55 p-7 shadow-[0_24px_70px_-50px_rgba(6,24,32,.45)] backdrop-blur-xl sm:rounded-[2.4rem] sm:p-10">
        <div className="flex items-center justify-between gap-4 border-b border-line-soft pb-5">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-mint">Stage {String(active + 1).padStart(2, "0")}</span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted">{active + 1} of {steps.length} stages</span>
            <button type="button" aria-pressed={paused} aria-label={paused ? "Resume automatic process rotation" : "Pause automatic process rotation"} onClick={() => setPaused((value) => !value)} className="inline-flex size-9 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-mint hover:text-mint">
              {paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
            </button>
          </div>
        </div>
        <div className="mt-6 h-1 w-full bg-ink-raised" role="progressbar" aria-label="Selected process stage" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={active + 1}>
          <div className="h-full bg-brand-teal transition-[width] duration-500" style={{ width: `${((active + 1) / steps.length) * 100}%` }} />
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
  const peoplePhotos: Record<string, { src: string; alt: string }> = {
    "ai-product-development": {
      src: "/img/work/engineering-floor.webp",
      alt: "People working together in an engineering environment",
    },
    "workflow-automation": {
      src: "/img/work/product-in-use.webp",
      alt: "A person working with a digital product",
    },
    "digital-transformation": {
      src: "/img/work/transformation-floor.webp",
      alt: "People working in a modernised operations environment",
    },
    "observability-monitoring": {
      src: "/img/work/engineering-floor.webp",
      alt: "An engineering team working together",
    },
    "talent-solution": {
      src: "/img/work/hiring-review.webp",
      alt: "Colleagues reviewing candidates together",
    },
  };
  const peoplePhoto = peoplePhotos[page.slug];

  return (
    <div className="service-page">
      <section className="relative isolate overflow-hidden bg-[#6DB1AE] text-[#061820]">
        <ServiceMotionField slug={page.slug} />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#6DB1AE] via-[#6DB1AE]/95 to-[#6DB1AE]/35" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-2/3 w-2/3 bg-gradient-to-tl from-brand-pearl/10 via-transparent to-transparent" />
        <div className="wrap relative py-11 sm:py-14 lg:py-16">
          {crumbs.length ? <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.7rem] uppercase tracking-wider text-[#061820]/55">
              {crumbs.map((crumb, index) => <li key={crumb.label} className="flex items-center gap-2">
                {index > 0 ? <ChevronRight className="size-3" aria-hidden /> : null}
                {crumb.to ? <Link to={crumb.to} className="transition-colors hover:text-[#061820]">{crumb.label}</Link> : <span className="text-[#061820]">{crumb.label}</span>}
              </li>)}
            </ol>
          </nav> : null}
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-3">
                <span className="flex size-11 items-center justify-center border border-[#061820]/30 bg-[#061820]/[0.06] text-[#061820]"><ServiceIcon icon={page.icon} className="size-5" strokeWidth={1.8} /></span>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#061820]">{page.name}</span>
              </div>
              <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .72, delay: .08, ease: [.22, 1, .36, 1] }}>
                <h1 className="max-w-4xl text-[clamp(2.8rem,6.2vw,5.6rem)] leading-[0.98] tracking-[-0.055em] text-[#061820]">{page.heroTitle}</h1>
                <p className="mt-5 max-w-2xl text-[.98rem] leading-7 text-[#061820]/75 sm:text-base sm:leading-7">{page.intro}</p>
              </motion.div>
              <div className="mt-6 flex flex-wrap gap-3">
                {page.cta ? <Button to={page.cta.to} size="lg" variant="dark-cta" magnetic>{page.cta.label}</Button> : null}
                <Link to="/services" className="inline-flex min-h-12 items-center gap-2 border border-[#061820]/30 px-5 text-sm font-semibold text-[#061820] transition-colors hover:border-[#061820]/70 hover:bg-[#061820]/[0.04]">Explore all services <ArrowUpRight className="size-4" aria-hidden /></Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#061820]/20 pt-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#061820]/20 bg-[#061820]/[0.04] px-3 py-2 font-mono text-xs text-[#061820]/75"><strong className="text-[#061820]">{String(page.coreServices.length).padStart(2, "0")}</strong> core capabilities</span>
                {page.process ? <span className="inline-flex items-center gap-2 rounded-full border border-[#061820]/20 bg-[#061820]/[0.04] px-3 py-2 font-mono text-xs text-[#061820]/75"><strong className="text-[#061820]">{String(page.process.length).padStart(2, "0")}</strong> process stages</span> : null}
              </div>
            </div>

            <motion.div className="service-glass relative mx-auto w-full max-w-lg rounded-[2.25rem] border border-[#061820]/20 bg-white/[0.12] p-2.5 backdrop-blur-xl sm:p-3 lg:pb-2" initial={{ opacity: 0, y: 36, rotateY: -8 }} animate={{ opacity: 1, y: 0, rotateY: 0 }} transition={{ duration: .9, delay: .18, ease: [.2,.8,.2,1] }}>
              <div aria-hidden className="pointer-events-none absolute -inset-2 rounded-[2.6rem] border border-[#061820]/20" />
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
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em]">SEPTA / IN PRACTICE</span>
                </div>
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-brand-teal/55" />
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
              {peoplePhoto ? (
                <div className="service-people-photo absolute -right-2 -top-3 z-20 h-24 w-32 overflow-hidden rounded-2xl border border-white/65 bg-white/30 p-1 shadow-[0_18px_45px_-20px_rgba(0,0,0,.45)] backdrop-blur-xl sm:-right-5 sm:-top-5 sm:h-32 sm:w-40">
                  <img
                    src={peoplePhoto.src}
                    alt={peoplePhoto.alt}
                    loading="lazy"
                    className="size-full rounded-xl object-cover"
                  />
                  <span className="absolute inset-x-1 bottom-1 rounded-b-lg bg-gradient-to-t from-[#061820]/90 to-transparent px-2 pb-2 pt-5 font-mono text-[8px] tracking-[0.12em] text-white">
                    PEOPLE / IN PRACTICE
                  </span>
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>
        <motion.div aria-hidden className="h-1 w-full origin-left bg-gradient-to-r from-transparent via-[#061820]/55 to-transparent" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, delay: .2 }} />
      </section>

      <Section wall="use-case" tone="surface" className="section">
        <div className="max-w-3xl">
          <SectionHeading eyebrow="What we do" title={page.coreServicesHeading} lead={page.coreServicesLead} />
        </div>
        <CapabilityExplorer key={page.slug} page={page} />
      </Section>

      <Section wall="about" tone="raised" className="section border-y border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading eyebrow="The Septa difference" title={page.whyChooseHeading} />
            <p className="mt-6 max-w-sm text-sm leading-7 text-muted">A considered approach, built around the work your organisation needs to get done.</p>
            <figure className="mt-7 max-w-sm overflow-hidden rounded-[1.5rem] border border-brand-teal/25 bg-brand-pearl shadow-[0_22px_55px_-35px_rgba(6,24,32,.5)]">
              <img
                src="https://images.pexels.com/photos/6132652/pexels-photo-6132652.jpeg?cs=srgb&dl=pexels-aderawilson-6132652.jpg&fm=jpg"
                alt="An African professional smiling while working at his desk in a bright office"
                loading="lazy"
                decoding="async"
                className="aspect-[16/10] w-full object-cover object-center"
              />
              <figcaption className="border-t border-brand-teal/20 px-4 py-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-mint">
                People first. Technology with purpose.
              </figcaption>
            </figure>
          </div>
          {page.slug === "ai-product-development" ? (
            <div className="divide-y divide-line-soft border-y border-line-soft">
              {page.whyChoose.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.035}>
                  <article className="group grid gap-3 py-5 transition-colors duration-300 hover:bg-brand-teal/[0.035] sm:grid-cols-[3.5rem_minmax(0,0.78fr)_minmax(0,1.22fr)] sm:items-start sm:gap-5 sm:px-4">
                    <span className="flex size-9 items-center justify-center rounded-full border border-brand-teal/30 bg-brand-teal/[0.08] font-mono text-xs tracking-widest text-mint transition-colors duration-300 group-hover:border-brand-teal group-hover:bg-brand-teal group-hover:text-brand-pearl">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold leading-snug text-brand-pearl sm:pt-1">{item.title}</h3>
                      <ArrowUpRight className="size-4 shrink-0 text-mint opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" aria-hidden />
                    </div>
                    {item.detail ? <p className="max-w-2xl text-sm leading-6 text-muted sm:pt-1">{item.detail}</p> : null}
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className={cn("grid gap-4 sm:grid-cols-2", [3, 5].includes(page.whyChoose.length) && "xl:grid-cols-3")}>
              {page.whyChoose.map((item, index) => <Reveal key={item.title} delay={index * 0.04}>
                <article className="service-glass group relative h-full min-h-48 overflow-hidden rounded-[1.65rem] border border-white/60 bg-white/50 p-6 shadow-[0_16px_42px_-34px_rgba(6,24,32,.45)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-teal/45 hover:bg-white/75 hover:shadow-[0_24px_55px_-35px_rgba(6,24,32,.4)] sm:p-7">
                  <span className="inline-flex size-9 items-center justify-center rounded-full border border-brand-teal/25 bg-brand-teal/10 font-mono text-xs tracking-widest text-mint">{String(index + 1).padStart(2, "0")}</span>
                  <div className="mt-8 flex items-start justify-between gap-3">
                    <h3 className="max-w-xs text-xl">{item.title}</h3>
                    <ArrowUpRight className="mt-1 size-4 shrink-0 text-mint opacity-0 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100" aria-hidden />
                  </div>
                  {item.detail ? <p className="mt-3 max-w-md text-sm leading-7 text-muted">{item.detail}</p> : null}
                </article>
              </Reveal>)}
            </div>
          )}
        </div>
      </Section>

      {page.process ? <Section wall="service-automation" tone="surface" className="section">
        <div className="max-w-3xl">
          <SectionHeading eyebrow="From first step to delivery" title={page.processHeading ?? "Our Process"} lead={page.processLead} />
        </div>
        <ProcessJourney key={page.slug} page={page} />
      </Section> : null}

      {page.slug === "talent-solution" && page.whoWeServe ? <Section wall="services" tone="surface" className="section border-y border-line-soft">
        <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Who we work with"
            title={page.whoWeServeHeading ?? "Who We Serve"}
            lead="Flexible talent and workforce support for organisations at every stage of growth."
            className="max-w-2xl"
          />
          <p className="max-w-sm text-sm leading-7 text-muted lg:pb-2">
            From a growing team making its first hires to an established organisation managing a wider workforce.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {page.whoWeServe.map((item, index) => {
            const audienceImages = [
              "/img/work/product-in-use.webp",
              "/img/work/hiring-review.webp",
              "/img/work/engineering-floor.webp",
              "/img/work/transformation-floor.webp",
            ];
            return <Reveal key={item.title} delay={index * 0.06}>
              <article className="group relative isolate min-h-[350px] overflow-hidden service-glass service-glass-dark rounded-[1.8rem] border border-white/20 bg-brand-pearl/65 shadow-[0_22px_55px_-32px_rgba(6,24,32,.45)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_65px_-32px_rgba(6,24,32,.55)]">
                <img
                  src={audienceImages[index] ?? "/img/work/talent-matching.webp"}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#061820] via-[#061820]/55 to-[#061820]/5" />
                <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-white/15" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
                  <span className="rounded-full border border-white/25 bg-[#061820]/35 px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.16em] text-white/90 backdrop-blur-md">
                    0{index + 1} / 04
                  </span>
                  <ArrowUpRight className="size-5 text-white/75 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <h3 className="text-xl font-semibold tracking-tight text-white">{item.title}</h3>
                  {item.detail ? <p className="mt-2 text-sm leading-6 text-white/80">{item.detail}</p> : null}
                  <div className="mt-5 h-px w-full bg-white/25">
                    <div className="h-px w-0 bg-brand-teal transition-all duration-500 group-hover:w-full" />
                  </div>
                </div>
              </article>
            </Reveal>;
          })}
        </div>
      </Section> : null}

      {page.extra ? <Section wall="blog" tone="raised" className="section">
        <div className="service-glass service-glass-dark relative isolate overflow-hidden rounded-[2rem] border border-white/20 bg-[#0b2830]/70 p-7 text-white shadow-[0_30px_80px_-55px_rgba(6,24,32,.75)] sm:rounded-[2.5rem] sm:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 size-[28rem] rounded-full border border-brand-teal/20" />
          <div aria-hidden className="pointer-events-none absolute -right-12 -top-16 size-[20rem] rounded-full bg-brand-teal/10 blur-[80px]" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-brand-teal">{page.name}</p>
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
