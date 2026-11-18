import { useState } from "react";
import { ArrowDownRight, Briefcase, Users } from "lucide-react";
import { PageHero } from "../components/blocks/PageHero";
import { PhotoFigure } from "../components/blocks/PhotoFigure";
import { CareerForm } from "../components/forms/CareerForm";
import { CareersHeroArt } from "../components/visuals/CareersHeroArt";
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

const reqCount = (o: (typeof openings)[number]) =>
  o.groups.reduce((n, g) => n + g.items.length, 0);

/**
 * The route down the hero's right margin: the open roles first, then the three stops every
 * candidate passes on the way to the form. Every row is a real in-page anchor.
 */
const careerRoute = (
  <Reveal>
    <div className="relative overflow-hidden rounded-card border border-line bg-ink-raised/85 p-6">
      <div aria-hidden className="dot-bg absolute inset-0 opacity-30" />
      <div className="relative">
        <p className="eyebrow mb-4">The route</p>
        <ul className="space-y-3">
          {openings.map((o, i) => (
            <li key={o.slug}>
              <a
                href={`#${o.slug}`}
                className="group flex items-baseline gap-3 text-[0.88rem] text-muted hover:text-mint"
              >
                <span className="font-mono text-[0.72rem] text-faint group-hover:text-mint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate">{o.title}</span>
                <span className="hidden font-mono text-[0.68rem] text-faint sm:inline">
                  {reqCount(o)} requirements
                </span>
                <ArrowDownRight
                  className="size-3.5 shrink-0 text-faint transition-transform group-hover:translate-y-0.5 group-hover:text-mint"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
        <ul className="mt-4 space-y-3 border-t border-line pt-4">
          {[
            { href: "#culture", label: "Our Culture" },
            { href: "#hiring-process", label: "Our Hiring Process" },
            { href: "#apply", label: "Apply" },
          ].map((r, i) => (
            <li key={r.href}>
              <a
                href={r.href}
                className="group flex items-baseline gap-3 text-[0.88rem] text-muted hover:text-mint"
              >
                <span className="font-mono text-[0.72rem] text-faint group-hover:text-mint">
                  {String(openings.length + i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate">{r.label}</span>
                <ArrowDownRight
                  className="size-3.5 shrink-0 text-faint transition-transform group-hover:translate-y-0.5 group-hover:text-mint"
                  aria-hidden
                />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-5 font-mono text-[0.66rem] tracking-[0.14em] text-faint uppercase">
          {openings.length} roles open, requirements as supplied
        </p>
      </div>
    </div>
  </Reveal>
);

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
          <>
            <Pill tone="mint">
              <Briefcase className="size-3.5" />
              {openings.length} open roles
            </Pill>
            <Pill tone="line">{careers.hiring.length} hiring steps</Pill>
          </>
        }
        art={<CareersHeroArt />}
        aside={careerRoute}
        actions={
          <Button onClick={scrollToRoles} size="lg" magnetic>
            {careers.rolesCta}
          </Button>
        }
      />

      {/* ---------------------------- our culture ---------------------------- */}
      <Section wall="blog" tone="raised" id="culture" className="section scroll-mt-24">
        <SectionHero title="Our Culture" lead={careers.cultureLead} className="mb-10" />
        {/* Culture is the one heading on this page that cannot be shown as a list of benefits, so
            it gets a room with people in it. Held to the width of the prose column: at full section
            width the same frame is taller than the viewport and becomes the page, not the point.
            A general scene, not a claim about a Septa team. */}
        <Reveal className="mb-12 block">
          <PhotoFigure
            src="/img/work/hiring-review.webp"
            alt="A laptop open on a code editor beside a tablet showing a candidate profile as an avatar and a shortlist of skill bars, two pairs of hands at the table, one writing a note"
            ratio="aspect-[3/2]"
            width={1200}
            height={800}
            className="mx-auto max-w-4xl"
          />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2">
          {careers.culture.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05} className="h-full">
              <Card tilt className="card-hover group relative flex h-full flex-col overflow-hidden p-6 sm:p-7">
                <span className="flex size-11 items-center justify-center rounded-xl border border-mint/25 bg-mint/[0.07] text-mint transition-colors group-hover:border-mint/50">
                  <Users className="size-5" />
                </span>
                <h3 className="mt-5 text-[1.12rem]">{c.title}</h3>
                <p className="mt-2.5 flex-1 text-[0.92rem] leading-relaxed text-muted">{c.detail}</p>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-mint/45 transition-transform duration-500 group-hover:scale-x-100"
                />
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
                className="group flex items-center gap-2.5 rounded-card border border-line bg-ink-raised px-4 py-3 transition-colors hover:border-mint/40 hover:bg-mint/[0.06]"
              >
                <span className="font-display text-[1.15rem] text-mint transition-colors group-hover:text-mint-bright">
                  {value.letter}
                </span>
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
      <Section wall="service-automation" tone="surface" id="hiring-process" className="section scroll-mt-24">
        <SectionHero title="Our Hiring Process" lead={careers.hiringLead} className="mb-12" />
        <ol className="grid gap-4">
          {careers.hiring.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.04}>
              <li className="group relative flex gap-5 overflow-hidden rounded-card border border-line bg-ink px-5 py-5 transition-colors hover:border-mint/35 sm:gap-7 sm:px-7">
                <span className="font-mono text-[1.5rem] leading-none text-mint transition-colors group-hover:text-mint-bright">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[1.05rem]">{s.title.replace(/^\d+\.\s*/, "")}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{s.detail}</p>
                </div>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-mint/45 transition-transform duration-500 group-hover:scale-x-100"
                />
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ---------------------------- open roles ---------------------------- */}
      <Section wall="service-talent" tone="raised" id="open-roles" className="section scroll-mt-24">
        <SectionHeading eyebrow="Career" title="Open Roles" className="mb-9" />
        <div className="grid gap-5">
          {openings.map((o, i) => (
            <div key={o.slug} id={o.slug} className="scroll-mt-28">
              <Reveal delay={i * 0.04} className="h-full">
                <Card className="group relative flex h-full flex-col overflow-hidden p-6 sm:p-7">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-5 -right-2 font-display text-[5rem] leading-none text-mint/[0.07]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative flex flex-wrap items-start justify-between gap-4">
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
                  <p className="relative mt-3 font-mono text-[0.72rem] tracking-[0.14em] text-faint uppercase">
                    {o.lead}
                  </p>
                  <p className="relative mt-1.5 font-mono text-[0.72rem] text-faint">
                    {o.groups.length} groups, {reqCount(o)} requirements listed
                  </p>
                  <div
                    className="relative mt-5 grid flex-1 gap-6 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4"
                  >
                    {o.groups.map((g) => (
                      <div key={g.heading}>
                        <p className="eyebrow mb-3">{g.heading}</p>
                        <MarkerList items={g.items} />
                      </div>
                    ))}
                  </div>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-mint/45 transition-transform duration-500 group-hover:scale-x-100"
                  />
                </Card>
              </Reveal>
            </div>
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
