import { septaFaqs } from "../../data/contactFaq";
import { Accordion } from "../ui/Accordion";
import { MaskRise } from "../ui/primitives";

export function ContactFaqSection() {
  const items = septaFaqs.map((f) => ({
    q: f.q,
    a: f.a,
    links: f.link ? [{ label: f.link.label, to: f.link.to }] : undefined,
  }));

  return (
    <section className="section wrap" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow mb-3 text-mint font-bold text-[0.82rem] tracking-[0.2em]">Common Inquiries</p>
        <MaskRise>
          <h2
            id="faq-heading"
            className="text-[clamp(1.75rem,3.8vw,2.8rem)] font-bold tracking-tight text-fg"
          >
            Frequently Asked Questions
          </h2>
        </MaskRise>
        <p className="prose-body mx-auto mt-4 max-w-2xl text-[1.02rem] text-muted">
          Clear answers on how Septa plans, engineers, protects, and delivers high-impact software.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl">
        <Accordion items={items} defaultOpen={0} single={false} />
      </div>
    </section>
  );
}
