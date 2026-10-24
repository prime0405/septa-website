/**
 * Route builders. Every entry is a function so call sites never have to remember
 * which ones took parameters — `paths.contact()` and `paths.case(slug)` read the same way.
 */
export const paths = {
  home: () => "/",
  about: () => "/about",
  cases: () => "/case-studies",
  case: (slug: string) => `/case-studies/${slug}`,
  services: () => "/services",
  service: (slug: string) => `/services/${slug}`,
  products: () => "/product-development",
  product: (slug: string) => `/product-development/${slug}`,
  careers: () => "/careers",
  blog: () => "/blog",
  post: (slug: string) => `/blog/${slug}`,
  contact: () => "/contact",
  privacy: () => "/privacy",
  terms: () => "/terms",
  /** Optional preselected service for the wizard. */
  request: (service?: string) =>
    service ? `/request?service=${encodeURIComponent(service)}` : "/request",
} as const;
