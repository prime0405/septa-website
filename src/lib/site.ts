/**
 * Central company configuration.
 * Every company fact that has not been supplied by Septa is `null` here and renders
 * as a visibly-marked "not configured" chip in the UI rather than invented copy.
 */

export type Maybe<T> = T | null;

export const site = {
  name: "Septa",
  legalName: "Septa",
  tagline: "Technology That Moves Your Business Forward.",
  description:
    "We help businesses turn ideas into digital products through AI-assisted and traditional product development, streamline operations with workflow automation, access skilled technology talent, improve system reliability, and drive digital transformation.",
  /** Set VITE_SITE_URL at build time to emit canonical + absolute Open Graph URLs. */
  url: (import.meta.env.VITE_SITE_URL as string | undefined) ?? null,
  /** Current year for the footer copyright. */
  year: new Date().getFullYear(),

  contact: {
    email: null as Maybe<string>,
    supportEmail: null as Maybe<string>,
    careersEmail: null as Maybe<string>,
    phone: null as Maybe<string>,
    addressLines: null as Maybe<string[]>,
    hours: null as Maybe<string>,
    /** Confirmed reply window. Left unset until Septa confirms one. */
    responseTime: null as Maybe<string>,
  },

  /**
   * Supplied by Septa as handle names, not URLs. Each href is the platform's standard
   * profile pattern with that handle dropped in — click-test every one before launch.
   */
  social: [
    { label: "X — @septa_academy", href: "https://x.com/septa_academy" },
    { label: "X — @septasoftware", href: "https://x.com/septasoftware" },
    { label: "LinkedIn — Septa Academy", href: "https://www.linkedin.com/company/septa-academy" },
    { label: "LinkedIn — Septa Software", href: "https://www.linkedin.com/company/septasoftware" },
    { label: "Instagram — @septa_academy", href: "https://www.instagram.com/septa_academy" },
    { label: "Instagram — @septasoftware", href: "https://www.instagram.com/septasoftware" },
    { label: "Facebook — Septa Academy", href: "https://www.facebook.com/septa-academy" },
  ] as { label: string; href: string }[],

  maps: {
    /** Google Maps / analytics ids stay empty until provided. */
    analyticsId: null as Maybe<string>,
  },
} as const;

export const legal = {
  privacyEffectiveDate: null as Maybe<string>,
  termsEffectiveDate: null as Maybe<string>,
  /** Company entity name shown in legal pages. */
  entity: site.legalName,
  /** Jurisdiction for governing law — must be confirmed before launch. */
  governingLaw: null as Maybe<string>,
  /** Where submitted requests/contact data is stored, for the privacy notice. */
  dataRetention: null as Maybe<string>,
} as const;

export const privacy = {
  /** Local storage keys this site uses, referenced by the privacy notice. */
  localStorageKeys: ["septa.request-draft"],
  collects: [
    "Your name, email address and, optionally, a phone number.",
    "The service you are interested in and the project details you choose to describe.",
    "Your organisation name, budget range, timeline and engagement preference when supplied.",
    "For career applications: role of interest, portfolio or LinkedIn URL, CV file, and any supporting note you write.",
    "Which page submitted the form, and a timestamp of the submission.",
  ],
  doesNotCollect: [
    "Payment card details.",
    "Government identification numbers.",
    "Health, biometric or other special-category data — please do not include it in free-text fields.",
  ],
} as const;
