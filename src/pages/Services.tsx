import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { PageHero } from "../components/blocks/PageHero";
import { ServiceIcon } from "../components/blocks/ServiceIcon";
import { ServicesHeroArt } from "../components/visuals/ServicesHeroArt";
import { Card, Reveal, Section, SectionHero } from "../components/ui/primitives";
import { serviceListings, serviceOverview, servicesIntro } from "../data/content";
import { services } from "../data/services";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

/**
 * The legend down the hero's right margin: the five services as numbered schematic nodes, in the
 * same order the cards below run. Every row is a real link to its service page.
 */
const serviceLegend = (
  <Reveal>
    <div className="relative overflow-hidden rounded-card border border-line bg-ink-raised/85 p-6">
      <div aria-hidden className="dot-bg absolute inset-0 opacity-30" />
      <div className="relative">
        <p className="eyebrow mb-4">The legend</p>
        <ul className="space-y-3">
          {serviceListings.map((s, i) => (
            <li key={s.slug}>
              <Link
                to={paths.service(s.slug)}
                className="group flex items-baseline gap-3 text-[0.88rem] text-muted hover:text-mint"
              >
                <span className="font-mono text-[0.72rem] text-faint group-hover:text-mint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate">{s.name}</span>
                <ArrowUpRight
                  className="size-3.5 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-mint"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-5 font-mono text-[0.66rem] tracking-[0.14em] text-faint uppercase">
          Five ways we plug into your team
        </p>
      </div>
    </div>
  </Reveal>
);

/**
 * The document's Service Overview and Our Services sections — the copy it supplies for the services
 * area of the site. Each card carries that service's own CTA label and opens its page.
 */
export default function Services() {
  usePageMeta({ title: "Services", description: servicesIntro });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "Services" }]}
        eyebrow="Service Overview"
        title={serviceOverview}
        lead={servicesIntro}
        actions={
          <>
            <Button to={paths.request()} size="lg" magnetic>
              Let’s Work Together
            </Button>
            <Button to={paths.contact()} size="lg" variant="secondary" magnetic>
              Contact Us
            </Button>
          </>
        }
        art={<ServicesHeroArt />}
        aside={serviceLegend}
      />

      <Section wall="use-case" className="section">
        <SectionHero eyebrow="Our Services" title="Explore our five service areas" className="mb-12" />
        <div className="grid gap-4 md:grid-cols-2">
          {serviceListings.map((s, i) => {
            const svc = services.find((x) => x.slug === s.slug);
            return (
              <Reveal key={s.slug} delay={i * 0.05} className={i === 0 ? "md:col-span-2" : ""}>
                <Card tilt className="card-hover group relative flex h-full flex-col overflow-hidden p-6 sm:p-7">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-5 -right-2 font-display text-[5rem] leading-none text-mint/[0.07]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative flex items-center gap-4">
                    {svc ? (
                      <span className="flex size-11 items-center justify-center rounded-xl border border-mint/25 bg-mint/[0.07] text-mint transition-colors group-hover:border-mint/50">
                        <ServiceIcon icon={svc.icon} className="size-5.5" />
                      </span>
                    ) : null}
                    <h2 className="text-[1.2rem]">{s.name}</h2>
                  </div>
                  <p className="prose-body relative mt-3 flex-1 text-[0.94rem]">{s.detail}</p>
                  {svc ? (
                    <p className="relative mt-4 font-mono text-[0.72rem] text-faint">
                      {svc.coreServices.length} core services
                    </p>
                  ) : null}
                  <div className="relative mt-6">
                    <Button to={paths.service(s.slug)} size="sm" variant="secondary">
                      {s.cta}
                    </Button>
                  </div>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-mint/45 transition-transform duration-500 group-hover:scale-x-100"
                  />
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>
    </>
  );
}