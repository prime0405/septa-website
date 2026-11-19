import { Link, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
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
        crumbs={[{ label: "Home", to: paths.home() }, { label: "Request a Service" }]}
        eyebrow="Start a project"
        title="Request a Service"
        lead="Five short steps, and you can go back and edit anything before sending. If you get partway, your answers stay in this browser so a refresh does not lose them."
        meta={
          <>
            <Pill tone="mint">
              <ShieldCheck className="size-3.5" /> Validated on the way in
            </Pill>
            <Pill tone="line">Saves a local draft</Pill>
            <Pill tone="line">Nothing sent until you review</Pill>
          </>
        }
        actions={
          <Button to={paths.contact()} variant="secondary" iconStart={<ArrowLeft className="size-4" />}>
            Have a question first? Use the contact form
          </Button>
        }
        aside={
          <Reveal>
            <Card className="p-6">
              <p className="eyebrow mb-4">What happens in each step</p>
              <ol className="space-y-3.5">
                {steps.map((s, i) => (
                  <li key={s.label} className="flex gap-3.5">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg border border-mint/30 bg-mint/[0.07] font-mono text-[0.68rem] text-mint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-[0.92rem] text-fg">{s.label}</span>
                      <span className="mt-0.5 block text-[0.83rem] leading-relaxed text-muted">
                        {s.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          </Reveal>
        }
      />
      </motion.div>

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
          </div>

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
          </aside>
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
