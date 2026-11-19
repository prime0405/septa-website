import { Link, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { PageHero } from "../components/blocks/PageHero";
import { RequestWizard } from "../components/forms/RequestWizard";
import { IntegrationNotice } from "../components/blocks/LaunchNote";
import { Button } from "../components/ui/Button";
import {
  Callout,
  Card,
  MarkerList,
  Pill,
  Reveal,
  Section,
  SectionHeading,
} from "../components/ui/primitives";
import { requestServices } from "../shared/schemas";
import { privacy } from "../lib/site";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const steps = [
  { label: "Choose a service", detail: "One selection. “Other” is a real option." },
  { label: "Describe the project", detail: "The problem, the outcome you want, constraints you already know." },
  { label: "Project details", detail: "Organisation, budget range and timeline. Optional where it should be." },
  { label: "Your contact details", detail: "How to reach you and which channel you prefer." },
  { label: "Review and send", detail: "Everything you entered, in one screen, before it leaves the browser." },
];

export default function Request() {
  usePageMeta({
    title: "Request a Service",
    description:
      "Tell Septa what you need: AI product development, traditional software, workflow automation, digital transformation, observability or technical talent.",
  });

  const reduce = useReducedMotion();
  const [params] = useSearchParams();
  const raw = params.get("service");
  const preselected = raw && (requestServices as readonly string[]).includes(raw) ? raw : undefined;

  return (
    <>
      <motion.div initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : .65, ease: [.22, 1, .36, 1] }}>
      <PageHero
        className="request-hero min-h-[570px] border-b border-brand-teal/20"
        crumbs={[{ label: "Home", to: paths.home() }, { label: "Request a Service" }]}
        eyebrow={<span className="inline-flex items-center gap-2"><span className="size-2 animate-pulse rounded-full bg-brand-teal shadow-[0_0_14px_rgba(109,177,174,.9)]" /> SEPTA / PROJECT INTAKE</span>}
        title={<span className="block max-w-4xl text-white">Let's build something <span className="text-brand-teal">that moves you forward.</span></span>}
        lead="Tell us what you are trying to change, build or improve. We'll use the details to understand the challenge and identify the right people and approach."
        wall="engage"
        art={
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[#061820]">
            <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: "linear-gradient(rgba(109,177,174,.32) 1px, transparent 1px), linear-gradient(90deg, rgba(109,177,174,.32) 1px, transparent 1px)", backgroundSize: "54px 54px" }} />
            <motion.div className="absolute -right-24 -top-56 size-[48rem] rounded-full border border-brand-teal/20" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 90, repeat: Infinity, ease: "linear" }} />
            <motion.div className="absolute -right-4 -top-36 size-[34rem] rounded-full border border-dashed border-brand-teal/25" animate={reduce ? undefined : { rotate: -360 }} transition={{ duration: 68, repeat: Infinity, ease: "linear" }} />
            <motion.div className="absolute right-[12%] top-[12%] size-[28rem] rounded-full bg-brand-teal/15 blur-[110px]" animate={reduce ? undefined : { x: [0, -45, 20, 0], y: [0, 38, -18, 0], scale: [1, 1.16, .94, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div className="absolute -bottom-40 left-[8%] size-[30rem] rounded-full bg-brand-teal/10 blur-[110px]" animate={reduce ? undefined : { x: [0, 65, -20, 0], y: [0, -28, 18, 0] }} transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }} />
            <svg className="absolute right-0 top-0 h-full w-[62%] opacity-50" viewBox="0 0 760 600" fill="none">
              <motion.path d="M760 110H610L510 210H390L270 330H140L40 430H0" stroke="#6DB1AE" strokeWidth="1.2" strokeDasharray="7 10" initial={{ pathLength: 0 }} animate={reduce ? { pathLength: 1 } : { pathLength: [0, 1] }} transition={{ duration: 7, repeat: Infinity, repeatDelay: 2 }} />
              <motion.path d="M760 430H650L560 340H440L340 440H220L120 540H0" stroke="#6DB1AE" strokeWidth="1" strokeDasharray="3 11" initial={{ pathLength: 0 }} animate={reduce ? { pathLength: 1 } : { pathLength: [0, 1] }} transition={{ duration: 8, delay: 1, repeat: Infinity, repeatDelay: 2 }} />
              {[{x:610,y:110},{x:510,y:210},{x:390,y:210},{x:270,y:330},{x:560,y:340},{x:440,y:340},{x:340,y:440},{x:220,y:440}].map((p,i)=><motion.circle key={i} cx={p.x} cy={p.y} r="4" fill="#8AC2BF" animate={reduce ? undefined : { opacity:[.2,1,.2], r:[3,5,3] }} transition={{ duration:2.8, delay:i*.2, repeat:Infinity }} />)}
            </svg>
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#061820] to-transparent" />
          </div>
        }
        meta={
          <div className="flex flex-wrap gap-2">
            <Pill tone="mint"><ShieldCheck className="size-3.5" /> Validated as you go</Pill>
            <Pill tone="line">Draft saved on this device</Pill>
            <Pill tone="line">Review before sending</Pill>
          </div>
        }
        actions={
          <Button to={paths.contact()} variant="secondary" iconStart={<ArrowLeft className="size-4" />}>
            Have a question first? Contact us
          </Button>
        }
        aside={
          <div className="request-hero-panel relative overflow-hidden rounded-[1.8rem] p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-brand-teal">Intake sequence</p>
              <span className="font-mono text-xs text-white/45">05 STEPS</span>
            </div>
            <ol className="space-y-2.5">
              {steps.map((s, i) => (
                <li key={s.label} className="request-hero-step flex items-start gap-3 rounded-xl p-3">
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-brand-teal/35 font-mono text-[0.68rem] text-brand-teal">{String(i + 1).padStart(2, "0")}</span>
                  <span><span className="block text-sm font-semibold text-white">{s.label}</span><span className="mt-1 block text-xs leading-relaxed text-white/55">{s.detail}</span></span>
                </li>
              ))}
            </ol>
          </div>
        }
      />      </motion.div>

      <Section wall="answers" className="section relative isolate overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div className="absolute -right-24 top-12 size-[28rem] rounded-full border border-mint/20" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }} />
          <motion.div className="absolute -right-12 top-24 size-[22rem] rounded-full border border-dashed border-mint/20" animate={reduce ? undefined : { rotate: -360 }} transition={{ duration: 65, repeat: Infinity, ease: "linear" }} />
          <motion.div className="absolute -left-28 bottom-0 size-80 rounded-full bg-mint/10 blur-[90px]" animate={reduce ? undefined : { x: [0, 65, 0], y: [0, -35, 0], scale: [1, 1.2, 1] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
          <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(circle, var(--color-mint) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
        </div>
        <div className="relative z-10 grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <motion.div className="min-w-0" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: reduce ? 0 : .55 }}>
            {preselected ? (
              <Callout kind="info" title="Service preselected" className="mb-6">
                <p>
                  You arrived from the <span className="text-fg">{preselected}</span> page, so step one
                  starts there. Change it if the problem is really somewhere else. Mixed engagements
                  are normal.
                </p>
              </Callout>
            ) : null}
            <RequestWizard preselected={preselected} />
          </motion.div>

          <motion.aside className="space-y-5 lg:sticky lg:top-28 lg:self-start" initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: reduce ? 0 : .6, delay: .08 }}>
            <motion.figure className="group relative isolate aspect-[16/10] overflow-hidden bg-brand-pearl shadow-[0_24px_70px_-35px_rgba(6,24,32,.5)]"
              whileHover={reduce ? undefined : { y: -5 }} transition={{ duration: .35 }}>
              <motion.img
                src="/img/work/engineering-floor.webp"
                alt="Technology professionals working together in an engineering environment"
                className="absolute inset-0 size-full object-cover"
                initial={false}
                animate={reduce ? undefined : { scale: [1.04, 1.1, 1.04] }}
                transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-pearl/95 via-brand-pearl/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
                <div>
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-brand-teal">SEPTA / COLLABORATION</p>
                  <p className="mt-2 max-w-xs text-xl font-semibold leading-tight">Good technology starts with understanding the people who use it.</p>
                </div>
                <span className="mb-1 hidden size-10 shrink-0 items-center justify-center border border-white/30 bg-white/10 sm:flex">
                  <ArrowRight className="size-4" />
                </span>
              </div>
              <motion.span aria-hidden className="absolute left-0 top-0 h-1 w-1/3 bg-brand-teal"
                animate={reduce ? undefined : { x: ["0%", "200%", "0%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
            </motion.figure>
            <IntegrationNotice />

            <Card className="p-6">
              <p className="eyebrow mb-4">What we do with it</p>
              <MarkerList
                items={[
                  {
                    label: "Stored in the request record",
                    detail: "So a follow-up conversation has the context you already gave us.",
                  },
                  {
                    label: "Read by a person",
                    detail: "Someone replies with a point of view and a suggested next step.",
                  },
                  {
                    label: "Nothing shared onward",
                    detail: "No advertising trackers, no resale of enquiry data.",
                  },
                ]}
              />
              <p className="mt-4 border-t border-line pt-4 text-[0.82rem] leading-relaxed text-faint">
                Full detail is in the{" "}
                <Link to={paths.privacy()} className="text-mint hover:underline">
                  privacy notice
                </Link>
                .
              </p>
            </Card>

            <Card className="p-6">
              <p className="eyebrow mb-4">Local draft storage</p>
              <p className="text-[0.86rem] leading-relaxed text-muted">
                This form keeps a draft in your browser under{" "}
                <code className="font-mono text-[0.78rem] text-fg">
                  {privacy.localStorageKeys.join(", ")}
                </code>{" "}
                so a lost tab is not lost work. It clears when the request is accepted, and you can
                discard it at any time from the form.
              </p>
            </Card>

            <Callout kind="setup" title="Before this page takes real enquiries">
              <p>
                Submissions need a configured destination: SMTP credentials for email forwarding, and
                a durable database for production. The banner above tells you which of those is
                missing right now.
              </p>
            </Callout>
          </motion.aside>
        </div>
      </Section>

      <Section wall="use-case" tone="raised" className="section border-y border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Useful context"
            title="What makes a request easy to answer well"
            lead="None of this is required. It is what turns a reply that guesses into a reply that is specific."
          />
          <MarkerList
            items={[
              "Who is affected by the problem today, and how often they hit it.",
              "What you already tried, including anything that quietly failed.",
              "Systems the solution has to touch, and the ones it must stay away from.",
              "A rough date, if one exists, and what makes that date real.",
              "Who needs to say yes, and what they care about.",
            ]}
          />
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3 rounded-card border border-line bg-surface px-5 py-4 text-[0.86rem] text-muted">
          <Sparkles className="size-4 shrink-0 text-mint" aria-hidden />
          Short is fine. “Our finance team rebuilds this report by hand every month” is a complete
          brief to start from.
        </div>
      </Section>
    </>
  );
}
