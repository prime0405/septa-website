import { ArrowRight } from "lucide-react";
import { ctaBanner } from "../../data/content";
import { paths } from "../../lib/paths";
import { Button } from "../ui/Button";
import { MaskRise, Section } from "../ui/primitives";
import { SectionStage } from "../blocks/SectionStage";

/*
 * The one closing ask, in its own band directly above the footer on every route. It used to live
 * inside the footer, which made the footer a second hero: a headline, a pitch and two buttons stacked
 * on top of the site map, so the band that should read as wayfinding was the tallest thing at the
 * bottom of the page. Septa asked for the ask moved up and the footer cut down, so the card now ends
 * the reading flow — the last thing a decided visitor meets before the directory — and the footer
 * below it is only marks, links and the legal line.
 *
 * The band is surface tone: on the homepage it steps down from the testimonial's raised plate and the
 * footer steps back up to raised, so the three bands separate by tone alone, the same grammar as the
 * rest of the page now that no drawn rules travel with the scroll.
 */
export function ClosingCta() {
  return (
    <Section tone="surface" className="py-12 sm:py-14">
      <SectionStage>
        <div className="wrap relative">
          <div className="relative overflow-hidden rounded-card border border-mint/25 bg-gradient-to-br from-ink via-surface-raised to-ink-raised px-6 py-7 sm:px-9 sm:py-9">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-mint/12 blur-3xl"
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <div className="min-w-0 max-w-2xl">
                <p className="eyebrow mb-3 text-faint">Next step</p>
                <h2 className="text-[clamp(1.45rem,3vw,2.35rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-fg">
                  <MaskRise>{ctaBanner.headline}</MaskRise>
                </h2>
                <p className="mt-3 max-w-xl text-[0.92rem] leading-relaxed text-muted">
                  {ctaBanner.subheadline}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <Button
                  to={paths.request()}
                  size="lg"
                  magnetic
                  iconEnd={<ArrowRight className="size-4" />}
                >
                  {ctaBanner.cta}
                </Button>
                <Button to={paths.contact()} size="lg" variant="secondary" magnetic>
                  Ask a question first
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SectionStage>
    </Section>
  );
}