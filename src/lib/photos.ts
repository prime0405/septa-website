/**
 * The photograph each case-study and article tile carries.
 *
 * These are generic illustrative frames, not documentation: no client photography exists for this
 * site, so a tile's picture shows the *kind* of work the entry describes — a build pipeline for a
 * platform delivery, a handheld scanner for an app used in the field, a monitoring wall for an
 * observability piece — and is never captioned as Septa work.
 *
 * The list is explicit rather than hashed because the point of the picture is that it fits. A hash
 * keeps a card stable but says nothing about what the card is about, which is exactly the complaint
 * the previous set was answered with.
 */
const BY_SUBJECT: Record<string, string> = {
  // The five supplied use cases, matched to what each one delivered.
  "halogen-group": "/img/work/product-delivery.webp",
  "ehcc-clock-in-app": "/img/work/product-in-use.webp",
  preppod: "/img/work/ai-model-build.webp",
  "septa-lms": "/img/work/hiring-review.webp",
  toviri: "/img/work/transformation-floor.webp",

  // The six editorial drafts, matched to the subject of the argument.
  "ai-pilot-production-gap": "/img/work/ai-model-build.webp",
  "automation-that-survives": "/img/work/automation-flows.webp",
  "legacy-system-questions": "/img/work/transformation-floor.webp",
  "slos-that-mean-something": "/img/work/observability-noc.webp",
  "maintainability-is-a-product-decision": "/img/work/product-delivery.webp",
  "buying-technology-advice": "/img/work/talent-matching.webp",
};

const FALLBACK = "/img/work/product-delivery.webp";

export function photoFor(key: string): string {
  return BY_SUBJECT[key] ?? FALLBACK;
}
