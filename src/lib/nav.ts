export type NavChild = { label: string; href: string; blurb?: string; badge?: string };
export type NavGroup = { heading: string; items: NavChild[] };
export type NavItem = { label: string; href: string; groups?: NavGroup[] };

export const SERVICE_ROUTES: Record<string, string> = {
  "ai-product-development": "/services/ai-product-development",
  "workflow-automation": "/services/workflow-automation",
  "digital-transformation": "/services/digital-transformation",
  "observability-monitoring": "/services/observability-monitoring",
  "talent-solution": "/services/talent-solution",
};

/** Desktop primary navigation. `groups` turns an item into a mega menu. */
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  {
    label: "Services",
    href: "/services",
    groups: [
      {
        heading: "Service categories",
        items: [
          { label: "AI Product Development", href: SERVICE_ROUTES["ai-product-development"] },
          { label: "Workflow Automation", href: SERVICE_ROUTES["workflow-automation"] },
          { label: "Digital Transformation", href: SERVICE_ROUTES["digital-transformation"] },
          {
            label: "Observability & Monitoring",
            href: SERVICE_ROUTES["observability-monitoring"],
          },
          { label: "Talent Solution", href: SERVICE_ROUTES["talent-solution"] },
        ],
      },
    ],
  },
  { label: "Career", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

export const REQUEST_HREF = "/request";

export const footerColumns: NavGroup[] = [
  {
    heading: "Company",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Career", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "Services",
    items: [
      { label: "AI Product Development", href: SERVICE_ROUTES["ai-product-development"] },
      { label: "Workflow Automation", href: SERVICE_ROUTES["workflow-automation"] },
      { label: "Digital Transformation", href: SERVICE_ROUTES["digital-transformation"] },
      { label: "Observability & Monitoring", href: SERVICE_ROUTES["observability-monitoring"] },
      { label: "Talent Solution", href: SERVICE_ROUTES["talent-solution"] },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];
