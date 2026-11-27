import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useCases, useCaseBySlug } from "../data/useCases";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";
import EnyataCaseStudy from "./cases/EnyataCaseStudy";

export default function UseCaseDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const study = useCaseBySlug(slug);

  usePageMeta({
    title: study ? study.title : "Case study not found",
    description: study?.overview,
    noindex: !study,
  });

  if (!study) {
    return (
      <main className="wrap section">
        <div className="mx-auto max-w-2xl py-10 text-center">
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-mint">Case studies</p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-brand-pearl">That project could not be found.</h1>
          <p className="mt-4 text-[0.96rem] leading-relaxed text-muted">The link may be out of date. Explore the projects currently in our portfolio.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {useCases.map((item) => (
              <Link
                key={item.slug}
                to={paths.case(item.slug)}
                className="group flex items-center justify-between gap-4 rounded-xl border border-line-soft bg-white p-4 text-left text-[0.9rem] font-semibold text-brand-pearl transition-all hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-lg"
              >
                {item.client}
                <ArrowRight className="size-4 text-mint transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
          <Link to={paths.cases()} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-mint hover:text-brand-pearl">
            Back to all case studies <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  return <EnyataCaseStudy study={study} />;
}
