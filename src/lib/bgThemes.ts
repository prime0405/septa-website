/**
 * Which animated wallpaper a page runs behind its content.
 *
 * A theme is keyed to a section as well as to a page: `Section` carries an optional `wall` that becomes
 * a `data-wall` attribute, and `useActiveWall` hands the fixed backdrop whichever one is under the
 * visitor's eye. On a long page that means several wallpapers in sequence, each matched to the
 * headline it sits behind; a theme with no `wall` simply keeps whatever the route gives it.
 *
 * Two halves per theme, both chosen from what the page is about:
 *
 * - A gradient scheme, declared in `src/index.css` under `[data-bg="<theme>"]`. The Septa brand
 *   manual (p.15) supplies four flat colours and no gradient objects, so every stop is a colour-mix
 *   of Black #000000, Black Pearl #061820, Tradewind #6DB1AE and White #FFFFFF; a theme only picks
 *   which of them meet and at what angle.
 * - A plate: the generated abstract artwork that pans inside the wash. Each plate has a different
 *   subject, so a page gets the one that reads like its own work.
 * - A motion subject: the live line art drawn on the mesh canvas over the plate. This is the layer
 *   that actually moves, and it is the reason a page reads as its own wallpaper rather than a
 *   different tint of the same one.
 * - Optionally a film: a generated loop that takes the plate slot outright, for the one page where a
 *   moving picture earns the weight. Its still is used as the poster and as the reduced-motion path.
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

/**
 * The five subjects the wallpaper canvas can draw: `rings` is a slow wireframe globe, `plexus` the
 * node network, `lattice` an isometric cube grid, `stream` a set of routed data lanes, and `strata`
 * stacked bands sliding past each other.
 */
export type BgMotion = "rings" | "plexus" | "lattice" | "stream" | "strata";

type ThemeSpec = { plate: string; motion: BgMotion; film?: string };

/**
 * The plates are decorative brand art in the Septa palette — network, flow, layers, traces, aurora —
 * and none of them depicts a client, a product or a person.
 *
 * The subject each page is handed follows what the page is about: a model being built is a lattice,
 * a process being routed is a stream, a system being watched is a network, a system being replaced is
 * strata, a human match is the soft ring field, and the two pages a visitor acts on take the brightest.
 */
const THEMES: Record<BgTheme, ThemeSpec> = {
  home: { plate: "/img/plate-aurora.jpg", motion: "rings", film: "/video/wall-rings.webm" },
  about: { plate: "/img/plate-layers.jpg", motion: "strata" },
  services: { plate: "/img/plate-network.jpg", motion: "plexus" },
  "service-ai": { plate: "/img/plate-traces.jpg", motion: "lattice" },
  "service-automation": { plate: "/img/plate-flow.jpg", motion: "stream" },
  "service-transformation": { plate: "/img/plate-layers.jpg", motion: "strata" },
  "service-observability": { plate: "/img/plate-network.jpg", motion: "plexus" },
  "service-talent": { plate: "/img/plate-aurora.jpg", motion: "rings" },
  cases: { plate: "/img/plate-flow.jpg", motion: "stream" },
  "use-case": { plate: "/img/plate-traces.jpg", motion: "lattice" },
  blog: { plate: "/img/plate-aurora.jpg", motion: "rings" },
  careers: { plate: "/img/plate-layers.jpg", motion: "strata" },
  engage: { plate: "/img/plate-network.jpg", motion: "plexus" },
  answers: { plate: "/img/plate-aurora.jpg", motion: "rings" },
  legal: { plate: "/img/plate-aurora.jpg", motion: "rings" },
};

export const plateForTheme = (theme: BgTheme): string => THEMES[theme].plate;
export const motionForTheme = (theme: BgTheme): BgMotion => THEMES[theme].motion;
/** A generated film for the plate slot, where one exists. Absent means the still plate alone. */
export const filmForTheme = (theme: BgTheme): string | undefined => THEMES[theme].film;

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
