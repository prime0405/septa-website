import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Clock, ShieldCheck, Zap, MessageSquare } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ContactIdeaVisual } from "../components/visuals/ContactIdeaVisual";
import { ContactForm } from "../components/forms/ContactForm";
import { ContactAdvantageSection } from "../components/blocks/ContactAdvantageSection";
import { ContactFaqSection } from "../components/blocks/ContactFaqSection";
import { ContactPartnerTicker } from "../components/blocks/ContactPartnerTicker";
import { ContactProcessTimeline } from "../components/blocks/ContactProcessTimeline";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";
import { contactCopy } from "../data/content";
import { Button } from "../components/ui/Button";
import { Eyebrow, MaskRise, Reveal, Section } from "../components/ui/primitives";
import { PointerGlow } from "../components/ui/PointerGlow";
import { usePointerTrack } from "../lib/pointerGlow";

/** Word-by-word reveal matching the Home hero */
function Rise({ i, children }: { i: number; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className="inline-block">{children}</span>;
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: "0.45em" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.62, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}

/** Dark-surface glass card with crystal-clear high-contrast text and luminous glow */
function MetricCard({
  icon,
  metric,
  label,
}: {
  icon: React.ReactNode;
  metric: string;
  label: string;
}) {
  const track = usePointerTrack<HTMLDivElement>("tilt", 6);
  return (
    <div
      onPointerMove={track.onPointerMove}
      onPointerLeave={track.onPointerLeave}
      className="tilt group relative flex flex-col justify-between overflow-hidden rounded-card border border-white/15 bg-white/[0.06] p-6 backdrop-blur-md transition-all duration-300 hover:border-brand-mint/60 hover:bg-white/[0.12] hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.25)]"
    >
      <PointerGlow />
      <div className="flex items-center justify-between">
        <span className="flex size-9 items-center justify-center rounded-lg border border-brand-mint/35 bg-brand-mint/15 text-brand-mint shadow-sm">
          {icon}
        </span>
        <span className="font-mono text-[0.68rem] font-bold tracking-wider text-brand-mint uppercase">
          Verified SLA
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-white">{metric}</p>
      <p className="mt-1 text-[0.88rem] leading-snug font-medium text-slate-200">{label}</p>
    </div>
  );
}

export default function Contact() {
  usePageMeta({
    title: "Contact Us",
    description: contactCopy.headline,
  });

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const headlineWords = contactCopy.headline.split(" ");

  return (
    <div className="overflow-x-hidden">
      {/* ----------------------------- 1. HERO SECTION ----------------------------- */}
      <section className="hero-field relative flex min-h-[82svh] items-center overflow-hidden bg-charcoal pt-24 pb-20 text-brand-white">
        {/* Animated Aurora Light Pools */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="animate-aurora absolute top-[-20%] left-1/2 h-[580px] w-[900px] -translate-x-1/2 rounded-full bg-brand-mint/20 blur-[130px]" />
          <div className="animate-aurora-slow absolute top-[25%] left-[8%] hidden h-[380px] w-[380px] rounded-full bg-brand-mint/12 blur-[120px] lg:block" />
          <div className="animate-aurora absolute top-[10%] right-[6%] hidden h-[340px] w-[420px] rounded-full bg-brand-teal/16 blur-[120px] lg:block" />
        </div>

        {/* Night-lit Grid Background */}
        <div aria-hidden className="grid-bg-dark absolute inset-0 opacity-45 mask-fade pointer-events-none" />

        <div className="wrap relative z-10 mx-auto max-w-4xl text-center">
          {/* Breadcrumbs */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 font-mono text-[0.74rem] text-slate-300">
            <Link to={paths.home()} className="text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-slate-500">/</span>
            <span className="text-brand-mint font-semibold">Contact Us</span>
          </div>

          {/* 1. Live Engineering Availability Pill */}
          <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/35 bg-emerald-950/50 px-4 py-1.5 backdrop-blur-md shadow-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[0.72rem] font-bold tracking-wider text-emerald-300 uppercase">
              Engineering Pods Active · Accepting New Sprint Kickoffs
            </span>
          </div>

          <div className="mb-5">
            <Eyebrow className="text-brand-mint font-bold text-[0.8rem] tracking-[0.2em]">
              GET IN TOUCH · SEPTA ENGINEERING
            </Eyebrow>
          </div>

          {/* Animated Headline */}
          <h1 className="text-[clamp(2.4rem,6.2vw,4.5rem)] font-bold leading-[1.08] text-white sm:leading-[1.02] drop-shadow-sm">
            {headlineWords.map((word, i) => (
              <span key={`${word}-${i}`}>
                <Rise i={i}>
                  {word.toLowerCase().includes("tech") || word.toLowerCase().includes("solution") ? (
                    <span className="text-brand-mint font-extrabold">{word}</span>
                  ) : (
                    word
                  )}
                </Rise>{" "}
              </span>
            ))}
          </h1>

          {/* Subtitle / Lead with High Contrast */}
          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-2xl text-[1.1rem] leading-[1.75] font-normal text-slate-100 sm:text-[1.2rem]">
              {contactCopy.lead}
            </p>
          </Reveal>

          {/* Magnetic CTA Actions */}
          <Reveal delay={0.22}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <Button
                type="button"
                onClick={scrollToForm}
                size="lg"
                variant="dark-cta"
                magnetic
                iconEnd={<ArrowDown className="size-4" />}
              >
                {contactCopy.formTitle}
              </Button>
              <Button
                to={paths.services()}
                size="lg"
                variant="outline-light"
                magnetic
                iconEnd={<ArrowRight className="size-4" />}
              >
                Explore Our Services
              </Button>
            </div>
          </Reveal>

          {/* Metric Highlights Strip with Crystal-Clear Contrast */}
          <div className="mt-16 grid grid-cols-1 gap-5 border-t border-white/15 pt-10 sm:grid-cols-3">
            <MetricCard
              icon={<Zap className="size-4.5" />}
              metric="4 to 6 Weeks"
              label="Rapid MVP Delivery from Concept to Launch"
            />
            <MetricCard
              icon={<Clock className="size-4.5" />}
              metric="< 24 Hours"
              label="Engineering Lead Direct Response SLA"
            />
            <MetricCard
              icon={<ShieldCheck className="size-4.5" />}
              metric="100% IP Secure"
              label="Strict Mutual NDA & Complete Code Transfer"
            />
          </div>
        </div>
      </section>

      {/* 2. Partner Trust Ticker */}
      <ContactPartnerTicker />

      {/* ----------------------------- 3. FORM & INNOVATION STUDIO ----------------------------- */}
      <div ref={formRef} id="contact-form">
        <Section tone="surface" className="section relative z-20">
          <div className="wrap">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <Eyebrow className="mb-3 text-mint font-bold text-[0.82rem] tracking-[0.2em]">
                START A PROJECT
              </Eyebrow>
              <MaskRise>
                <h2 className="text-[clamp(1.85rem,4vw,2.9rem)] font-bold tracking-tight text-fg">
                  {contactCopy.formTitle}
                </h2>
              </MaskRise>
              <p className="prose-body mt-3 text-[1.05rem] text-muted leading-relaxed">
                {contactCopy.close}
              </p>
            </div>

            <div className="overflow-hidden rounded-card border border-line bg-surface-raised p-6 sm:p-10 shadow-soft">
              <div className="grid gap-10 lg:grid-cols-[0.95fr_1.15fr] lg:gap-14">
                {/* Left Column: Interactive 3D Idea Hub */}
                <div>
                  <ContactIdeaVisual />
                </div>

                {/* Right Column: Interactive Form */}
                <div className="flex flex-col justify-center">
                  <ContactForm />
                </div>
              </div>
            </div>

            {/* A Good First Message Guide (From Original File) */}
            <div className="mx-auto mt-8 max-w-4xl">
              <div className="card card-hover tilt group relative overflow-hidden p-6 sm:p-7">
                <PointerGlow />
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-mint/15 text-mint">
                    <MessageSquare className="size-4" />
                  </span>
                  <p className="eyebrow text-mint font-bold text-[0.82rem] tracking-[0.2em]">
                    A Good First Message
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
                  <div className="rounded-xl border border-line/80 bg-surface/90 p-4">
                    <p className="font-mono text-[0.8rem] font-bold text-fg uppercase">1. The Problem</p>
                    <p className="mt-1 text-[0.88rem] leading-relaxed text-muted">What you are trying to get done, in plain words.</p>
                  </div>
                  <div className="rounded-xl border border-line/80 bg-surface/90 p-4">
                    <p className="font-mono text-[0.8rem] font-bold text-fg uppercase">2. Current State</p>
                    <p className="mt-1 text-[0.88rem] leading-relaxed text-muted">How it is handled today, even if it is spreadsheets.</p>
                  </div>
                  <div className="rounded-xl border border-line/80 bg-surface/90 p-4">
                    <p className="font-mono text-[0.8rem] font-bold text-fg uppercase">3. Constraints</p>
                    <p className="mt-1 text-[0.88rem] leading-relaxed text-muted">Budget range, timeline, or a system it has to fit into.</p>
                  </div>
                  <div className="rounded-xl border border-line/80 bg-surface/90 p-4">
                    <p className="font-mono text-[0.8rem] font-bold text-fg uppercase">4. Target Date</p>
                    <p className="mt-1 text-[0.88rem] leading-relaxed text-muted">When you need it live or ready for users.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. "What Happens Next?" 3-Step Process */}
            <ContactProcessTimeline />
          </div>
        </Section>
      </div>

      {/* ----------------------------- 4. THE SEPTA ADVANTAGE ----------------------------- */}
      <ContactAdvantageSection />

      {/* ----------------------------- 5. FAQ ACCORDION ----------------------------- */}
      <ContactFaqSection />
    </div>
  );
}
