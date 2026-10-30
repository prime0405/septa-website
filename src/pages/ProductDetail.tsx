import { Link, useParams } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";
import { ServiceTemplate } from "../components/blocks/ServiceTemplate";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/primitives";
import { productBySlug, products } from "../data/products";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

export default function ProductDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const product = productBySlug(slug);

  usePageMeta({
    title: product ? `${product.name} – Product Development` : "Product track not found",
    description: product?.navBlurb,
    noindex: !product,
  });

  if (!product) {
    return (
      <div className="wrap section">
        <EmptyState
          heading="h1"
          title="No product development track by that name"
          icon={<Layers className="size-5" />}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button to={paths.products()} size="sm">
                Product development hub
              </Button>
              <Button to={paths.request()} size="sm" variant="secondary">
                Request a build
              </Button>
            </div>
          }
        >
          Septa publishes two build tracks. Pick the one closest to what you are making.
        </EmptyState>
        <ul className="mx-auto mt-8 grid max-w-2xl gap-2 sm:grid-cols-2">
          {products.map((p) => (
            <li key={p.slug}>
              <Link
                to={paths.product(p.slug)}
                className="card card-hover flex items-center justify-between gap-3 p-4 text-[0.9rem]"
              >
                {p.name}
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
      page={product}
      crumbs={[
        { label: "Home", to: paths.home() },
        { label: "Product Development", to: paths.products() },
        { label: product.name },
      ]}
    />
  );
}
