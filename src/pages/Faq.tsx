import { Link } from "react-router-dom";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import { PageHero } from "../components/blocks/PageHero";
import { LaunchNoteInline } from "../components/blocks/LaunchNote";
import { Button } from "../components/ui/Button";
import { Card, Reveal, Section } from "../components/ui/primitives";
import { serviceListings } from "../data/content";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

/**
 * The revamp lists FAQ as a footer page but supplies no questions or answers for it, and none of the
 * service pages carry an FAQ block any more. So this page publishes the gap rather than writing
 * questions on Septa's behalf, and routes the reader to a person.
 */
export default function Faq() {
  usePageMeta({
    title: "FAQ",
    description:
      "Questions about working with Septa, routed to the service page that covers them or to a person.",
  });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "FAQ" }]}
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        actions={
          <Button to={paths.contact()} size="lg">
            Contact Us
          </Button>
        }
      />

      <Section wall="service-observability" className="section">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceListings.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.04} className="h-full">
              <Link
                to={paths.service(s.slug)}
                className="card card-hover group flex h-full flex-col justify-between p-6"
              >
                <span className="text-[1.05rem]">{s.name}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-mint">
                  Service page
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}

          <Reveal delay={serviceListings.length * 0.04} className="h-full">
            <Card className="flex h-full flex-col justify-between border-dashed p-6">
              <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-ink-raised text-faint">
                <MessageCircleQuestion className="size-5" />
              </span>
              <div className="mt-5">
                <LaunchNoteInline label="Awaiting copy: the revamp lists this page and supplies no questions or answers for it" />
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
