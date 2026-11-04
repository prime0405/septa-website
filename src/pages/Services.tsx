import { Button } from "../components/ui/Button";
import { PageHero } from "../components/blocks/PageHero";
import { Card, Reveal, Section, SectionHero } from "../components/ui/primitives";
import { serviceListings, serviceOverview, servicesIntro } from "../data/content";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

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
            <Button to={paths.request()} size="lg">
              Let’s Work Together
            </Button>
            <Button to={paths.contact()} size="lg" variant="secondary">
              Contact Us
            </Button>
          </>
        }
      />

      <Section className="section">
        <SectionHero eyebrow="Our Services" title={serviceOverview} className="mb-12" />
        <div className="grid gap-4 md:grid-cols-2">
          {serviceListings.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.05} className={i === 0 ? "md:col-span-2" : ""}>
              <Card className="card-hover flex h-full flex-col p-6 sm:p-7">
                <h2 className="text-[1.2rem]">{s.name}</h2>
                <p className="prose-body mt-3 flex-1 text-[0.94rem]">{s.detail}</p>
                <div className="mt-6">
                  <Button to={paths.service(s.slug)} size="sm" variant="secondary">
                    {s.cta}
                  </Button>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
