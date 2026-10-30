import { useState } from "react";
import { ArrowRight, Briefcase, Inbox, Send, Users } from "lucide-react";
import { CtaBand, PageHero } from "../components/blocks/PageHero";
import { CareerForm } from "../components/forms/CareerForm";
import { IntegrationNotice } from "../components/blocks/LaunchNote";
import { LaunchNoteInline } from "../components/blocks/LaunchNote";
import { Button } from "../components/ui/Button";
import {
  Callout,
  Card,
  EmptyState,
  MarkerList,
  Pill,
  Reveal,
  Section,
  SectionHeading,
  Unconfigured,
} from "../components/ui/primitives";
import { disciplines, howWeWork, values } from "../data/content";
import { applicationChecklist, openings, openingsNote, whatHappensNext } from "../data/jobs";
import { site } from "../lib/site";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

export default function Careers() {
  usePageMeta({
    title: "Career",
    description:
      "Work at Septa: how the team operates, the technical disciplines we hire into, current openings, and how to send an expression of interest.",
  });

  const [showSpeculative, setShowSpeculative] = useState(openings.length === 0);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "Career" }]}
        eyebrow="Career at Septa"
        title="Do work that stays useful after the launch"
        lead="We build systems that other people have to live with, which means engineering decisions are made for the reader who inherits them. If that is the kind of work you want, this page tells you how we operate and how to reach us."
        meta={
          <>
            <Pill tone="mint">
              <Briefcase className="size-3.5" />
              {openings.length ? `${openings.length} open roles` : "No published openings right now"}
            </Pill>
            <Pill tone="line">{disciplines.length} disciplines</Pill>
            <Pill tone="line">Expressions of interest welcome</Pill>
          </>
        }
        actions={
          <>
            <Button
              onClick={() => {
                setShowSpeculative(true);
                document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              size="lg"
              iconEnd={<Send className="size-4" />
            }
            >
              Send an expression of interest
            </Button>
            <Button to={paths.about()} size="lg" variant="secondary">
              How we work
            </Button>
          </>
        }
        aside={
          <Reveal>
            <div className="relative rounded-card border border-line bg-ink-raised/85 p-6">
              <div aria-hidden className="dot-bg absolute inset-0 opacity-40" />
              <div className="relative">
                <p className="eyebrow mb-4">What we look for</p>
                <MarkerList
                  items={[
                    "Comfort with ambiguity at the start of a problem",
                    "Care about the person who maintains it next",
                    "Evidence of something shipped, fixed or improved",
                    "Clear writing under pressure",
                  ]}
                />
              </div>
            </div>
          </Reveal>
        }
      />

      {/* -------------------------- openings --------------------------- */}
      <Section className="section">
        <SectionHeading
          eyebrow="Openings"
          title="Current vacancies"
          lead={openingsNote}
          className="mb-9"
          action={
            openings.length ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSpeculative((s) => !s)}
              >
                {showSpeculative ? "Hide the interest form" : "Send one anyway"}
              </Button>
            ) : null
          }
        />

        {openings.length ? (
          <div className="grid gap-4">
            {openings.map((o, i) => (
              <Reveal key={o.slug} delay={i * 0.04}>
                <Card className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-[1.25rem]">{o.title}</h3>
                      <div className="mt-2.5 flex flex-wrap items-center gap-2">
                        <Pill tone="mint">{o.discipline}</Pill>
                        <Pill tone="line">{o.engagement}</Pill>
                        <Pill tone="line">{o.seniority}</Pill>
                        {o.locations.map((l) => (
                          <Pill key={l} tone="muted">
                            {l}
                          </Pill>
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowSpeculative(true);
                        document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Apply
                    </Button>
                  </div>

                  <p className="mt-4 text-[0.93rem] leading-relaxed text-muted">{o.summary}</p>

                  <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <div>
                      <p className="eyebrow mb-3">What you do</p>
                      <MarkerList items={o.responsibilities} />
                    </div>
                    <div>
                      <p className="eyebrow mb-3">What we need</p>
                      <MarkerList items={o.requirements} />
                    </div>
                    <div>
                      <p className="eyebrow mb-3">Nice to have</p>
                      <ul className="space-y-2 text-[0.86rem] text-muted">
                        {o.niceToHave.map((n) => (
                          <li key={n} className="flex gap-2.5">
                            <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-line" />
                            {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="mt-5 border-t border-line pt-4 font-mono text-[0.72rem] text-faint">
                    Published {o.publishedOn}
                    {o.closesOn ? ` · closes ${o.closesOn}` : ""}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Inbox className="size-5" />}
            title="No published openings right now"
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  size="sm"
                  onClick={() => {
                    setShowSpeculative(true);
                    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Send an expression of interest
                </Button>
                <Button to={paths.contact()} size="sm" variant="secondary">
                  Ask about future roles
                </Button>
              </div>
            }
          >
            That is the honest state of this page: nothing has been approved for publication, so
            nothing is invented here. Speculative applications still reach the same people and are
            kept for the next relevant role.
          </EmptyState>
        )}

        {!openings.length ? (
          <LaunchNoteInline label="Publish real vacancies in src/data/jobs.ts: the page renders whatever that array contains" />
        ) : null}
      </Section>

      {/* ------------------------ disciplines -------------------------- */}
      <Section tone="raised" className="section border-y border-line-soft">
        <SectionHeading
          eyebrow="Areas of work"
          title="The disciplines we hire into"
          lead="Roles move between these. A backend engineer on an AI engagement is still a backend engineer: the difference is what they are deciding."
          className="mb-10"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {disciplines.map((d, i) => (
            <Reveal key={d.title} delay={i * 0.04} className="h-full">
              <Card className="flex h-full flex-col p-6">
                <span className="flex size-10 items-center justify-center rounded-xl border border-mint/25 bg-mint/[0.07] text-mint">
                  <Users className="size-4.5" />
                </span>
                <h3 className="mt-5 text-[1.05rem]">{d.title}</h3>
                <p className="mt-2 flex-1 text-[0.89rem] leading-relaxed text-muted">{d.detail}</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowSpeculative(true);
                    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mt-5 inline-flex items-center gap-1.5 self-start text-[0.84rem] font-medium text-mint hover:underline"
                >
                  Say you work in this
                  <ArrowRight className="size-3.5" aria-hidden />
                </button>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------- how we work ------------------------- */}
      <Section className="section">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Working here"
              title="What the day-to-day is actually like"
              lead="Written as commitments about how work is organised."
              className="mb-8"
            />
            <div className="grid gap-3">
              {howWeWork.map((h, i) => (
                <Reveal key={h.title} delay={i * 0.04}>
                  <div className="rounded-card border border-line bg-surface-raised px-5 py-4">
                    <h3 className="text-[1rem]">{h.title}</h3>
                    <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted">{h.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Card className="mt-8 p-6">
              <p className="eyebrow mb-4">Values behind that</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {values.map((v) => (
                  <li key={v.title} className="text-[0.88rem]">
                    <span className="text-fg">{v.title}</span>
                    <span className="mt-1 block text-muted">{v.detail}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="p-6">
              <p className="eyebrow mb-4">Include in your note</p>
              <MarkerList items={applicationChecklist} />
            </Card>

            <Card className="p-6">
              <p className="eyebrow mb-5">What happens next</p>
              <ol className="relative space-y-6 border-l border-line pl-6">
                {whatHappensNext.map((s, i) => (
                  <li key={s.title} className="relative">
                    <span
                      aria-hidden
                      className="absolute top-1.5 -left-[26px] size-2.5 rounded-full border border-mint/60 bg-ink"
                    />
                    <p className="font-mono text-[0.68rem] tracking-wider text-faint uppercase">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 text-[0.98rem]">{s.title}</h3>
                    <p className="mt-1 text-[0.86rem] leading-relaxed text-muted">{s.detail}</p>
                  </li>
                ))}
              </ol>
            </Card>

            <Callout kind="setup" title="Contact details not yet configured">
              <p>
                There is no published careers inbox: {site.name} has not supplied one, so nothing is
                invented here. The form below is the route until{" "}
                <code className="font-mono text-[0.8rem]">site.contact.careersEmail</code> is set.
              </p>
              <div className="mt-3">
                <Unconfigured what="careers email address" />
              </div>
            </Callout>
          </div>
        </div>
      </Section>

      {/* ---------------------------- apply ---------------------------- */}
      <Section tone="surface" id="apply" className="section scroll-mt-24 border-y border-line-soft">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Apply"
              title={
                openings.length
                  ? "Send an application"
                  : "No role to apply to? Send an expression of interest"
              }
              lead="Tell us the area you want to work in, something you have built or fixed, and how you got unstuck when it went wrong. A CV helps but is not a filter."
            />
            <IntegrationNotice />
          </div>

          {showSpeculative ? (
            <CareerForm source={openings.length ? "careers-page" : "speculative"} />
          ) : (
            <EmptyState
              title="Pick a role to apply"
              icon={<Briefcase className="size-5" />}
              action={
                <Button size="sm" onClick={() => setShowSpeculative(true)}>
                  Or send a speculative application
                </Button>
              }
            >
              Choose one of the published roles above and the application form appears here with that
              role preselected.
            </EmptyState>
          )}
        </div>
      </Section>

      <CtaBand
        title="Not here for a role, but want to talk?"
        lead="Delivery work with clients is the same craft. If you would rather discuss a project, the request form is the faster route."
        primaryLabel="Request a Service"
        secondary={{ label: "Contact us", to: paths.contact() }}
      />
    </>
  );
}
