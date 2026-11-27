import { useRef } from "react";
import { ArrowDown, ArrowRight, MessageSquare } from "lucide-react";
import { ContactIdeaVisual } from "../components/visuals/ContactIdeaVisual";
import { ContactForm } from "../components/forms/ContactForm";
import { ContactFaqSection } from "../components/blocks/ContactFaqSection";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";
import { contactCopy } from "../data/content";
import { Button } from "../components/ui/Button";
import { Eyebrow, MaskRise, Reveal, Section } from "../components/ui/primitives";

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
        {/* Static architectural grid */}
        <div aria-hidden className="grid-bg-dark absolute inset-0 opacity-45 mask-fade pointer-events-none" />

        <div className="wrap relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-[clamp(2.4rem,6.2vw,4.5rem)] font-bold leading-[1.08] text-white sm:leading-[1.02] drop-shadow-sm">
            {headlineWords.map((word, i) => (
              <span key={`${word}-${i}`}>
                {word.toLowerCase().includes("tech") || word.toLowerCase().includes("solution") ? (
                  <span className="text-brand-mint font-extrabold">{word}</span>
                ) : (
                  word
                )}{" "}
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


        </div>
      </section>

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
              <div className="card relative overflow-hidden p-6 sm:p-7">
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

          </div>
        </Section>
      </div>

      {/* ----------------------------- 5. FAQ ACCORDION ----------------------------- */}
      <ContactFaqSection />
    </div>
  );
}
