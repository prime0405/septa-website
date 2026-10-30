import { Link, useSearchParams } from "react-router-dom";
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

  const [params] = useSearchParams();
  const raw = params.get("service");
  const preselected = raw && (requestServices as readonly string[]).includes(raw) ? raw : undefined;

  return (
    <>
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

      <Section className="section">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div className="min-w-0">
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

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
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

      <Section tone="raised" className="section border-y border-line-soft">
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
