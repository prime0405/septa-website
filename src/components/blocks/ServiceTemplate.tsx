import { Check } from "lucide-react";
import type { ServiceContent } from "../../data/services";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import {
  Card,
  MarkerList,
  Reveal,
  Section,
  SectionHeading,
  Pill,
} from "../ui/primitives";
import { PageHero } from "./PageHero";
import type { Crumb } from "./PageHero";
import { PhotoFigure } from "./PhotoFigure";
import { ServiceIcon } from "./ServiceIcon";
import { LaunchNoteInline } from "./LaunchNote";

export function ServiceTemplate({
  page,
  crumbs,
}: {
  page: ServiceContent;
  crumbs: Crumb[];
}) {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={page.name}
        title={page.heroTitle}
        lead={page.intro}
        meta={
          <>
            <Pill tone="mint">
              <ServiceIcon icon={page.icon} className="size-3.5" strokeWidth={2} />
              {page.name}
            </Pill>
            <Pill tone="line">{page.coreServices.length} core services</Pill>
            {page.process ? <Pill tone="line">{page.process.length}-step process</Pill> : null}
          </>
        }
        actions={
          page.cta ? (
            <Button to={page.cta.to} size="lg" magnetic>
              {page.cta.label}
            </Button>
          ) : null
        }
      />

      {/* ------------------------------ core services ------------------------------ */}
      {/* A capability grid is a lattice: discrete tiles, one lit sweep across them. The service's
          workplace photograph leads the section, tied to the heading rather than dropped under it:
          at full column width the same frame becomes a 650px band that swallows the page, and the
          point of the picture is to say what the list below it is for. */}
      <Section wall="use-case" className="section">
        <div className={cn("grid items-center gap-8", page.image && "lg:grid-cols-[1fr_1.1fr] lg:gap-14")}>
          <SectionHeading
            eyebrow={page.name}
            title={page.coreServicesHeading}
            lead={page.coreServicesLead}
            className={page.image ? "lg:sticky lg:top-28 lg:self-start" : ""}
          />
          {page.image ? (
            <Reveal delay={0.06} className="min-w-0">
              <PhotoFigure src={page.image.src} alt={page.image.alt} edge="right" />
            </Reveal>
          ) : null}
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {page.coreServices.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.04}>
              <Card tilt className="card-hover h-full p-6">
                <h3 className="text-[1.05rem]">{item.title}</h3>
                {item.detail ? (
                  <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted">{item.detail}</p>
                ) : null}
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------ why choose us ------------------------------ */}
      <Section wall="about" tone="raised" className="section border-y border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading eyebrow={page.name} title={page.whyChooseHeading} className="lg:sticky lg:top-28 lg:self-start" />
          <div className="grid gap-4 sm:grid-cols-2">
            {page.whyChoose.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.04}>
                <div className="relative overflow-hidden rounded-card border border-line bg-surface-raised p-5">
                  <div
                    aria-hidden
                    className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-mint/70 to-transparent"
                  />
                  <h3 className="text-[1rem]">{b.title}</h3>
                  {b.detail ? (
                    <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{b.detail}</p>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* --------------------------------- process --------------------------------- */}
      {page.process ? (
        <Section wall="service-automation" className="section">
          <SectionHeading
            eyebrow={page.name}
            title={page.processHeading ?? "Our Process"}
            lead={page.processLead}
            className="mb-10"
          />
          <div className="space-y-4">
            {page.process.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.03}>
                <div className="rounded-card border border-line bg-surface p-6 sm:p-7">
                  <div className="flex items-baseline gap-4">
                    <h3 className="text-[1.08rem]">{step.title}</h3>
                    <span aria-hidden className="h-px flex-1 bg-line" />
                  </div>
                  {step.detail ? (
                    <p className="prose-body mt-3 text-[0.92rem]">{step.detail}</p>
                  ) : null}
                  {step.sub ? (
                    <div className="mt-5 rounded-card border border-line-soft bg-surface-raised p-5">
                      {step.sub.heading ? (
                        <p className="eyebrow mb-3">{step.sub.heading}</p>
                      ) : null}
                      {step.sub.lead ? (
                        <p className="mb-3 text-[0.88rem] text-muted">{step.sub.lead}</p>
                      ) : null}
                      <MarkerList items={step.sub.items.map((s) => (s.detail ? `${s.title}: ${s.detail}` : s.title))} />
                    </div>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* -------------------------------- who we serve ------------------------------- */}
      {page.whoWeServe ? (
        <Section wall="services" tone="surface" className="section border-y border-line-soft">
          <SectionHeading eyebrow={page.name} title={page.whoWeServeHeading ?? "Who We Serve"} className="mb-10" />
          <div className="grid gap-4 sm:grid-cols-2">
            {page.whoWeServe.map((u, i) => (
              <Reveal key={u.title} delay={i * 0.04}>
                <Card tilt className="h-full p-6">
                  <div className="flex items-start gap-3">
                    <Check className="mt-1 size-4 shrink-0 text-mint" aria-hidden />
                    <div>
                      <h3 className="text-[1rem]">{u.title}</h3>
                      {u.detail ? (
                        <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{u.detail}</p>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* ---------------------------------- extra ---------------------------------- */}
      {page.extra ? (
        <Section wall="blog" className="section">
          <SectionHeading eyebrow={page.name} title={page.extra.heading} className="mb-8" />
          <div className="max-w-3xl space-y-4">
            {page.extra.paragraphs.map((paragraph, i) => (
              <Reveal key={paragraph.slice(0, 24)} delay={i * 0.05}>
                <p className="prose-body text-[0.98rem]">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* ------------------------- sections awaiting copy -------------------------- */}
      {page.pending?.length ? (
        <Section wall="use-case" tone="raised" className="section border-y border-line-soft">
          <div className="rounded-card border border-dashed border-line bg-surface p-6 sm:p-8">
            <p className="prose-body mx-auto max-w-2xl text-center text-[0.92rem]">
              {page.pending.join(" and ")} belong on this page. The revamp document asks for them
              and supplies no copy, so they stay empty rather than being written for you.
            </p>
            <div className="mt-5 flex justify-center">
              <LaunchNoteInline label={`Awaiting copy: ${page.pending.join(", ")}`} />
            </div>
          </div>
        </Section>
      ) : null}

    </>
  );
}
