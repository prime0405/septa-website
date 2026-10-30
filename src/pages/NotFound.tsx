import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Pill, Section } from "../components/ui/primitives";
import { services } from "../data/services";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const quickLinks = [
  { label: "Home", to: paths.home(), hint: "What Septa does, end to end" },
  { label: "About Us", to: paths.about(), hint: "Mission, values and how we work" },
  { label: "Case Studies", to: paths.cases(), hint: "Worked examples, labelled as samples" },
  { label: "Career", to: paths.careers(), hint: "Disciplines and expressions of interest" },
  { label: "Blog", to: paths.blog(), hint: "Writing on delivery, AI and reliability" },
  { label: "Contact Us", to: paths.contact(), hint: "A question before a request" },
];

export default function NotFound() {
  usePageMeta({ title: "Page not found", description: "That address does not match a Septa page.", noindex: true });

  return (
    <Section className="section" tone="none">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow justify-center mb-6">
          <span className="inline-flex items-center gap-2">
            <Compass className="size-3.5" /> Error 404
          </span>
        </p>
        <h1 className="text-[clamp(2.4rem,7vw,4rem)] leading-[1.02]">
          Nothing lives at <span className="text-mint">this address</span>
        </h1>
        <p className="prose-body mx-auto mt-6 max-w-xl text-[1.02rem]">
          The page was probably renamed, or a link was typed slightly wrong. Everything that exists
          is reachable from here. If you think something is missing, tell us and we will either
          point you at it or build it.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to={paths.home()} size="lg">
            Back to home
          </Button>
          <Button to={paths.services()} size="lg" variant="secondary">
            Browse services
          </Button>
          <Button to={paths.request()} size="lg" variant="outline-mint">
            Request a Service
          </Button>
        </div>
      </div>

      <div className="mt-16 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="text-left">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-[1.1rem]">Main pages</h2>
            <span aria-hidden className="h-px flex-1 bg-line" />
            <Pill tone="line">{quickLinks.length}</Pill>
          </div>
          <ul className="grid gap-2">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="group flex items-center justify-between gap-4 rounded-card border border-line bg-surface-raised px-4 py-3 transition-colors hover:border-mint/45"
                >
                  <span>
                    <span className="block text-[0.93rem] text-fg group-hover:text-mint">
                      {l.label}
                    </span>
                    <span className="mt-0.5 block text-[0.8rem] text-faint">{l.hint}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-faint group-hover:text-mint" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-left">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-[1.1rem]">Services</h2>
            <span aria-hidden className="h-px flex-1 bg-line" />
            <Pill tone="line">{services.length}</Pill>
          </div>
          <ul className="grid gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  to={paths.service(s.slug)}
                  className="group flex items-center justify-between gap-4 rounded-card border border-line bg-surface-raised px-4 py-3 transition-colors hover:border-mint/45"
                >
                  <span>
                    <span className="block text-[0.93rem] text-fg group-hover:text-mint">
                      {s.name}
                    </span>
                    <span className="mt-0.5 block text-[0.8rem] text-faint">{s.navBlurb}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-faint group-hover:text-mint" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
