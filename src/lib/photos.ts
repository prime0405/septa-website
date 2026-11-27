/**
 * Editorial imagery for case studies and blog cards.
 *
 * Blog articles use contextual editorial photographs. The case-study index uses a separate
 * collection of verified client/company visuals: official client-site photography, Septa's own
 * published project artwork, and the real partner marks already used on the homepage.
 * Where a verified photograph is not available, the page uses the authentic logo rather than
 * substituting an unrelated or generated image.
 */
const BY_SUBJECT: Record<string, string> = {
  // Retained for legacy CaseCard usage; the new index uses CASE_STUDY_VISUALS below.
  "halogen-group": "/img/work/product-delivery.webp",
  "ehcc-clock-in-app": "/img/work/product-in-use.webp",
  preppod: "/img/work/ai-model-build.webp",
  "septa-lms": "/img/work/hiring-review.webp",
  toviri: "/img/work/transformation-floor.webp",

  // Natural editorial photography for the six sample articles.
  "ai-pilot-production-gap":
    "https://images.unsplash.com/photo-1758876203026-99a024dc43b9?auto=format&fit=crop&w=1400&q=82",
  "automation-that-survives":
    "https://images.unsplash.com/photo-1604933762161-67313106146c?auto=format&fit=crop&w=1400&q=82",
  "legacy-system-questions":
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=82",
  "slos-that-mean-something":
    "https://images.unsplash.com/photo-1755882296306-1598974ecde3?auto=format&fit=crop&w=1400&q=82",
  "maintainability-is-a-product-decision":
    "https://images.unsplash.com/photo-1759984782632-732eea46df77?auto=format&fit=crop&w=1400&q=82",
  "buying-technology-advice":
    "https://images.unsplash.com/photo-1739300293091-6e187cdf4b2c?auto=format&fit=crop&w=1400&q=82",
};

export type CaseStudyVisual = {
  photo?: string;
  photoAlt?: string;
  logo?: string;
  logoAlt?: string;
  surface: "light" | "pearl";
  fit?: "cover" | "contain";
  logoPlacement?: "badge" | "center";
};

const CASE_STUDY_VISUALS: Record<string, CaseStudyVisual> = {
  "halogen-group": {
    photo:
      "https://res.cloudinary.com/dnjccz6dn/image/upload/v1724671422/large_CUT_8148_4ca8e8cb58.jpg",
    photoAlt: "Halogen Group security personnel outside their workplace",
    logo: "/partners/color/halogen-group.svg",
    logoAlt: "Halogen Group logo",
    surface: "pearl",
    fit: "cover",
    logoPlacement: "badge",
  },
  "ehcc-clock-in-app": {
    photo:
      "https://enthronementassembly.org/wp-content/uploads/2023/08/about_banner_ehcc-1024x519.jpg",
    photoAlt: "Official Enthronement House Christian Centre church image",
    surface: "light",
    fit: "cover",
  },
  preppod: {
    logo: "/partners/color/preppod.svg",
    logoAlt: "Preppod logo",
    surface: "light",
    fit: "contain",
    logoPlacement: "center",
  },
  "septa-lms": {
    photo: "https://www.septasoftware.com/assets/home/acad_main.png",
    photoAlt: "Septa Academy learning visual from Septa's official website",
    logo: "https://www.septasoftware.com/assets/logo-light-1.svg",
    logoAlt: "Septa Software logo",
    surface: "light",
    fit: "cover",
    logoPlacement: "badge",
  },
  toviri: {
    photo: "https://www.toviri.com/Group3.png",
    photoAlt: "Toviri's official travel platform preview",
    logo: "/partners/color/toviri-uk.svg",
    logoAlt: "Toviri logo",
    surface: "light",
    fit: "contain",
    logoPlacement: "badge",
  },
};

const FALLBACK = "/img/work/product-delivery.webp";

export function photoFor(key: string): string {
  return BY_SUBJECT[key] ?? FALLBACK;
}

export function caseStudyVisualFor(key: string): CaseStudyVisual {
  return CASE_STUDY_VISUALS[key] ?? {
    surface: "light",
    fit: "cover",
  };
}
