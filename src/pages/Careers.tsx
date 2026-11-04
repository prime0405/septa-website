import { useState } from "react";
import { Briefcase, Users } from "lucide-react";
import { PageHero } from "../components/blocks/PageHero";
import { CareerForm } from "../components/forms/CareerForm";
import { IntegrationNotice } from "../components/blocks/LaunchNote";
import { LaunchNoteInline } from "../components/blocks/LaunchNote";
import { Button } from "../components/ui/Button";
import {
  Card,
  MarkerList,
  Pill,
  Reveal,
  Section,
  SectionHero,
  SectionHeading,
} from "../components/ui/primitives";
import { about, careers } from "../data/content";
import { openings } from "../data/jobs";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const scrollToRoles = () =>
  document.getElementById("open-roles")?.scrollIntoView({ behavior: "smooth", block: "start" });
const scrollToApply = () =>
  document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });

export default function Careers() {
  usePageMeta({ title: "Career", description: careers.intro });

  const [role, setRole] = useState<string | null>(null);

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "Career" }]}
        title="Career"
        lead={careers.intro}
        meta={
          <Pill tone="mint">
            <Briefcase className="size-3.5" />
            {openings.length} open roles
          </Pill>
        }
        actions={
          <Button onClick={scrollToRoles} size="lg">
            {careers.rolesCta}
          </Button>
        }
      />

      {/* ---------------------------- our culture ---------------------------- */}
      <Section wall="blog" tone="raised" className="section border-y border-line-soft">
        <SectionHero title="Our Culture" lead={careers.cultureLead} className="mb-12" />
        <div className="grid gap-4 md:grid-cols-2">
          {careers.culture.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05} className="h-full">
              <Card className="card-hover flex h-full flex-col p-6 sm:p-7">
                <span className="flex size-11 items-center justify-center rounded-xl border border-mint/25 bg-mint/[0.07] text-mint">
                  <Users className="size-5" />
                </span>
                <h3 className="mt-5 text-[1.12rem]">{c.title}</h3>
                <p className="mt-2.5 flex-1 text-[0.92rem] leading-relaxed text-muted">{c.detail}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------ our value ecosystem ------------------------ */}
      <Section wall="use-case" className="section">
        <SectionHeading eyebrow="Values" title="Our Value Ecosystem" className="mb-8" />
        <Reveal>
          <ul className="flex flex-wrap gap-2.5">
            {about.values.map((value) => (
              <li
                key={value.letter}
                className="flex items-center gap-2.5 rounded-card border border-line bg-ink-raised px-4 py-3"
              >
                <span className="font-display text-[1.15rem] text-mint">{value.letter}</span>
                <span className="text-[0.92rem]">{value.word}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="mt-5 rounded-card border border-dashed border-line px-5 py-4">
          <LaunchNoteInline label="Awaiting copy: the revamp gives this section a heading and the six value words, but no text under them" />
        </div>
      </Section>

      {/* ------------------------- hiring process ------------------------- */}
      <Section wall="service-automation" tone="surface" className="section border-y border-line-soft">
        <SectionHero title="Our Hiring Process" lead={careers.hiringLead} className="mb-12" />
        <ol className="grid gap-4">
          {careers.hiring.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.04}>
              <li className="flex gap-5 rounded-card border border-line bg-ink px-5 py-5 sm:gap-7 sm:px-7">
                <span className="font-mono text-[1.5rem] leading-none text-mint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[1.05rem]">{s.title.replace(/^\d+\.\s*/, "")}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{s.detail}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ---------------------------- open roles ---------------------------- */}
      <Section wall="service-talent" tone="raised" id="open-roles" className="section scroll-mt-24 border-y border-line-soft">
        <SectionHeading eyebrow="Career" title="Open Roles" className="mb-9" />
        <div className="grid gap-5">
          {openings.map((o, i) => (
            <Reveal key={o.slug} delay={i * 0.04} className="h-full">
              <Card className="flex h-full flex-col p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h3 className="text-[1.25rem]">{o.title}</h3>
                  <Button
                    size="sm"
                    onClick={() => {
                      setRole(o.title);
                      scrollToApply();
                    }}
                  >
                    Apply
                  </Button>
                </div>
                <p className="mt-3 font-mono text-[0.72rem] tracking-[0.14em] text-faint uppercase">
                  {o.lead}
                </p>
                <div
                  className="mt-5 grid flex-1 gap-6 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                  {o.groups.map((g) => (
                    <div key={g.heading}>
                      <p className="eyebrow mb-3">{g.heading}</p>
                      <MarkerList items={g.items} />
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------ apply ------------------------------ */}
      <Section wall="engage" id="apply" className="section scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading eyebrow="Open Roles" title={careers.rolesCta} />
            <div className="mt-6">
              <IntegrationNotice />
            </div>
          </div>
          <CareerForm preselectRole={role ?? undefined} />
        </div>
      </Section>
    </>
  );
}
