import { Button } from "../ui/Button";
import { MaskRise } from "../ui/primitives";

/**
 * The call-to-action banner exactly as the document writes one: a headline, a line of copy and a
 * single labelled button. Nothing else, so no label has to be invented to fill a slot.
 */
export function CtaSection({
  headline,
  copy,
  label,
  to,
}: {
  headline: string;
  copy: string;
  label: string;
  to: string;
}) {
  return (
    <section className="wrap section">
      <div className="relative overflow-hidden rounded-card border border-line bg-surface px-6 py-10 sm:px-10 sm:py-12">
        <div aria-hidden className="dot-bg pointer-events-none absolute inset-0 opacity-50" />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-1/3 size-72 rounded-full bg-mint/10 blur-3xl"
        />
        <div className="relative max-w-2xl">
          <MaskRise>
            <h2 className="text-[clamp(1.6rem,3.4vw,2.4rem)]">{headline}</h2>
          </MaskRise>
          <p className="prose-body mt-4">{copy}</p>
          <div className="mt-7">
            <Button to={to} size="lg">
              {label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
