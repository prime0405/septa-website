import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ServiceTemplate } from "../components/blocks/ServiceTemplate";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/primitives";
import { serviceBySlug, services } from "../data/services";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

export default function ServiceDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const service = serviceBySlug(slug);

  usePageMeta({
    title: service ? service.name : "Service not found",
    description: service?.navBlurb,
    noindex: !service,
  });

  if (!service) {
    return (
      <div className="wrap section">
        <EmptyState
          heading="h1"
          title="That service page does not exist"
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button to={paths.services()} size="sm">
                All services
              </Button>
              <Button to={paths.request()} size="sm" variant="secondary">
                Request a Service
              </Button>
            </div>
          }
        >
          The link may be out of date. These are the services Septa publishes pages for.
        </EmptyState>
        <ul className="mx-auto mt-8 grid max-w-2xl gap-2 sm:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                to={paths.service(s.slug)}
                className="card card-hover flex items-center justify-between gap-3 p-4 text-[0.9rem]"
              >
                {s.name}
                <ArrowRight className="size-4 text-faint" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <ServiceTemplate
      page={service}
      crumbs={[
        { label: "Home", to: paths.home() },
        { label: "Services", to: paths.services() },
        { label: service.name },
      ]}
    />
  );
}
