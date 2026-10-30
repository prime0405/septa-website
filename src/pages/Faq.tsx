import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CtaBand, PageHero } from "../components/blocks/PageHero";
import { Accordion } from "../components/ui/Accordion";
import { Reveal, Section, SectionHeading } from "../components/ui/primitives";
import { products } from "../data/products";
import { services } from "../data/services";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const general = [
  {
    q: "What does Septa actually do?",
    a: "Five services: AI product development, workflow automation, digital transformation, observability and monitoring, and talent solutions. Alongside them are two product development tracks for turning an idea into software, with AI or conventionally. Every one of them ends with something running in your environment, instrumented and handed over.",
  },
  {
    q: "How does a piece of work start?",
    a: "With a request or a conversation. You describe the problem in the form; we come back with a point of view, the questions we would need answered, and a shape of work. Discovery is the first paid stage on anything non-trivial.",
  },
  {
    q: "Who owns the code and the accounts?",
    a: "You do. Work happens in your repository and your cloud accounts wherever that is possible, and transition is planned from the first week of the engagement.",
  },
  {
    q: "Do you take on fixed-scope work?",
    a: "Yes, where the scope can honestly be fixed: a prototype phase, an audit, an integration. Where it cannot, we work in two-week increments against a prioritised list, because a fixed date this early would be a guess.",
  },
  {
    q: "How do I get an estimate?",
    a: "Send a request with what you know. An estimate comes out of discovery, so the first number you get is a range and a proposal for how to narrow it.",
  },
];

export default function Faq() {
  usePageMeta({
    title: "FAQ",
    description:
      "Answers to the questions Septa is asked most often, grouped by service, plus how engagements start, what you own and how estimates work.",
  });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: "/" }, { label: "FAQ" }]}
        eyebrow="Questions"
        title="The questions we get asked before the first call"
        lead="General answers first, then the questions that belong to a specific service. If yours is not here, the contact form reaches a person."
      />

      <Section className="section">
        <SectionHeading
          eyebrow="General"
          title="Working with Septa"
          className="mb-8"
        />
        <Reveal>
          <Accordion items={general} defaultOpen={null} single={false} />
        </Reveal>
      </Section>

      <Section tone="raised" className="section border-y border-line-soft">
        <SectionHeading
          eyebrow="By service"
          title="The detailed questions"
          lead="Each service page carries the same list in context, including what each choice costs."
          className="mb-10"
        />
        <div className="space-y-12">
          {[
            ...services.map((s) => ({ page: s, to: paths.service(s.slug), kind: "Service" })),
            ...products.map((p) => ({ page: p, to: paths.product(p.slug), kind: "Track" })),
          ].map(({ page, to, kind }) => (
            <div key={`${kind}-${page.slug}`}>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-[1.2rem]">
                  {page.name}
                  <span className="ml-2 font-mono text-[0.66rem] tracking-[0.16em] text-faint uppercase">
                    {kind}
                  </span>
                </h3>
                <Link
                  to={to}
                  className="inline-flex items-center gap-1.5 text-[0.85rem] text-mint hover:underline"
                >
                  Open the {kind.toLowerCase()} page
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </div>
              <Accordion items={page.faq} defaultOpen={null} single={false} />
            </div>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Question not answered here?"
        lead="Send it through the contact form. A person reads every submission and replies with a point of view."
        primaryLabel="Ask a question"
        secondary={{ label: "Start a request instead", to: paths.request() }}
      />
    </>
  );
}
