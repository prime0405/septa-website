/**
 * Which animated gradient a page runs behind its content.
 *
 * The Septa brand manual (p.15) supplies four flat colours and no gradient objects, so every stop
 * below is built from those four — Black #000000, Black Pearl #061820, Tradewind #6DB1AE, White
 * #FFFFFF — mixed in CSS rather than invented as new hex values. The theme only chooses which two
 * or three of them meet, at what angle and how fast; the paint itself lives in `src/index.css` so
 * the colour contract stays in one place with the rest of the tokens.
 */
export type BgTheme =
  | "home"
  | "about"
  | "services"
  | "products"
  | "cases"
  | "blog"
  | "careers"
  | "engage"
  | "answers"
  | "legal";

/** Longest prefix wins, so `/services/ai-product-development` still reads as `services`. */
const PREFIXES: Array<[string, BgTheme]> = [
  ["/about", "about"],
  ["/services", "services"],
  ["/product-development", "products"],
  ["/case-studies", "cases"],
  ["/blog", "blog"],
  ["/careers", "careers"],
  ["/contact", "engage"],
  ["/request", "engage"],
  ["/faq", "answers"],
  ["/privacy", "legal"],
  ["/terms", "legal"],
];

export function bgThemeFor(pathname: string): BgTheme {
  for (const [prefix, theme] of PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) return theme;
  }
  if (pathname === "/") return "home";
  // A route that is not in the list is a 404 or something new: give it the quietest scheme rather
  // than the homepage's, so an unknown page never out-shouts the real ones.
  return "legal";
}
