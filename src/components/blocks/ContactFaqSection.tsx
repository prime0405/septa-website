import { septaFaqs } from "../../data/contactFaq";
import { Accordion } from "../ui/Accordion";

export function ContactFaqSection() {
  const items = septaFaqs.map((f) => ({
    q: f.q,
    a: f.a,
    links: f.link ? [{ label: f.link.label, to: f.link.to }] : undefined,
  }));

  return (
    <section
      className="relative isolate overflow-hidden border-y border-line bg-[#edf3f2] py-16 sm:py-24"
      aria-labelledby="faq-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-[8%] size-[28rem] rounded-full bg-brand-teal/10 blur-[100px]"
      />
      <div className="wrap relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-5 flex items-center gap-2 text-mint font-bold text-[0.78rem] tracking-[0.2em]">
            <span className="size-2 rounded-full bg-mint" />
            Common Inquiries
          </p>
          <h2
            id="faq-heading"
            className="max-w-md text-[clamp(2rem,4vw,3.25rem)] font-bold tracking-tight text-fg"
          >
            Frequently Asked Questions
          </h2>
          <p className="prose-body mt-5 max-w-sm text-[1.02rem] text-muted">
            Clear answers on how Septa plans, engineers, protects, and delivers high-impact software.
          </p>
          <div className="mt-8 hidden h-px w-24 bg-mint/60 lg:block" />
        </div>

        <div className="min-w-0">
          <Accordion items={items} defaultOpen={0} single={false} />
        </div>
      </div>
    </section>
  );
}
