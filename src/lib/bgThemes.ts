/**
 * Which animated wallpaper a page runs behind its content.
 *
 * Two halves per theme, both chosen from what the page is about:
 *
 * - A gradient scheme, declared in `src/index.css` under `[data-bg="<theme>"]`. The Septa brand
 *   manual (p.15) supplies four flat colours and no gradient objects, so every stop is a colour-mix
 *   of Black #000000, Black Pearl #061820, Tradewind #6DB1AE and White #FFFFFF; a theme only picks
 *   which of them meet, at what angle, and how fast the ramp travels.
 * - A plate: the generated abstract artwork that pans inside the wash. Each plate has a different
 *   subject, so a page gets the one that reads like its own work.
 */
export type BgTheme =
  | "home"
  | "about"
  | "services"
  | "service-ai"
  | "service-automation"
  | "service-transformation"
  | "service-observability"
  | "service-talent"
  | "cases"
  | "use-case"
  | "blog"
  | "careers"
  | "engage"
  | "answers"
  | "legal";

type ThemeSpec = { plate: string };

/**
 * The plates are decorative brand art in the Septa palette — network, flow, layers, traces, aurora —
 * and none of them depicts a client, a product or a person.
 */
const THEMES: Record<BgTheme, ThemeSpec> = {
  home: { plate: "/img/plate-aurora.jpg" },
  about: { plate: "/img/plate-layers.jpg" },
  services: { plate: "/img/plate-network.jpg" },
  // Circuit traces for a model being built, flow for a process being routed, stacked layers for a
  // system being replaced, network for one being watched, and the soft wash for a human match.
  "service-ai": { plate: "/img/plate-traces.jpg" },
  "service-automation": { plate: "/img/plate-flow.jpg" },
  "service-transformation": { plate: "/img/plate-layers.jpg" },
  "service-observability": { plate: "/img/plate-network.jpg" },
  "service-talent": { plate: "/img/plate-aurora.jpg" },
  cases: { plate: "/img/plate-flow.jpg" },
  "use-case": { plate: "/img/plate-traces.jpg" },
  blog: { plate: "/img/plate-aurora.jpg" },
  careers: { plate: "/img/plate-layers.jpg" },
  engage: { plate: "/img/plate-network.jpg" },
  answers: { plate: "/img/plate-aurora.jpg" },
  legal: { plate: "/img/plate-aurora.jpg" },
};

export const plateForTheme = (theme: BgTheme): string => THEMES[theme].plate;

/**
 * Exact paths first, then longest prefix. Listing the service slugs outright keeps each one on its
 * own wallpaper instead of falling back to the services index scheme.
 */
export function bgThemeFor(pathname: string): BgTheme {
  if (pathname === "/") return "home";

  const service = pathname.match(/^\/services\/([^/]+)/);
  if (service) {
    const bySlug: Record<string, BgTheme> = {
      "ai-product-development": "service-ai",
      "workflow-automation": "service-automation",
      "digital-transformation": "service-transformation",
      "observability-monitoring": "service-observability",
      "talent-solution": "service-talent",
    };
    return bySlug[service[1]] ?? "services";
  }

  if (pathname.startsWith("/case-studies/")) return "use-case";

  const prefixes: Array<[string, BgTheme]> = [
    ["/about", "about"],
    ["/services", "services"],
    ["/case-studies", "cases"],
    ["/blog", "blog"],
    ["/careers", "careers"],
    ["/contact", "engage"],
    ["/request", "engage"],
    ["/faq", "answers"],
    ["/privacy", "legal"],
    ["/terms", "legal"],
  ];
  for (const [prefix, theme] of prefixes) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) return theme;
  }
  // A route that is not in the list is a 404 or something new: give it the quietest scheme rather
  // than the homepage's, so an unknown page never out-shouts the real ones.
  return "legal";
}
