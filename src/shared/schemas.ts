import { z } from "zod";

/**
 * Validation schemas shared by the browser and the API server.
 * The server re-validates everything: client validation is for speed, not safety.
 */

const text = (label: string, max = 400) =>
  z
    .string()
    .trim()
    .min(2, `${label} is required.`)
    .max(max, `${label} must be shorter than ${max} characters.`);

const optionalText = (max = 1200) =>
  z
    .string()
    .trim()
    .max(max, "Please keep this under " + max + " characters.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined));

/** Hidden anti-spam field: must stay empty. */
const honeypot = z
  .string()
  .optional()
  .transform((v) => (v === undefined || v === "" ? undefined : "spam"))
  .refine((v) => v === undefined, { message: "Spam detected." });

const consent = z
  .boolean()
  .refine((v) => v === true, "You need to accept the privacy notice before sending this.");

export const emailField = z
  .string()
  .trim()
  .min(1, "Email address is required.")
  .max(160, "Email address is too long.")
  .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Enter a valid email address.");

export const urlField = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined))
  .refine(
    (v) => v === undefined || /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(v),
    "Enter a full web address starting with http:// or https://",
  );

export const phoneField = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length > 0 ? v : undefined))
  .refine(
    (v) => v === undefined || /^[+()\-.\s\d]{6,24}$/.test(v),
    "Enter a valid phone number.",
  );

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

export const contactServices = [
  "AI product development",
  "Traditional product development",
  "Workflow Automation",
  "Digital Transformation",
  "Observability & Monitoring",
  "Talent Solution",
] as const;

/**
 * The six fields the revamp's contact form asks for. `service` is the dropdown it names, `message`
 * is the long "what are you partnering with us to build" answer.
 */
export const contactSchema = z.object({
  fullName: text("Name", 120),
  phone: phoneField,
  company: optionalText(120),
  email: emailField,
  service: z.enum(contactServices, { message: "Choose the service you need from us." }),
  message: z
    .string()
    .trim()
    .min(20, "Please add a little more detail (at least 20 characters).")
    .max(4000, "Please keep the message under 4,000 characters."),
  consent,
  _hp: honeypot,
});

export type ContactPayload = z.infer<typeof contactSchema>;

/* ------------------------------------------------------------------ */
/* Request a Service                                                   */
/* ------------------------------------------------------------------ */

export const requestServices = [
  "AI Product Development",
  "Traditional Product Development",
  "Workflow Automation",
  "Digital Transformation",
  "Observability & Monitoring",
  "Talent Solution",
  "Other",
] as const;

export const budgetRanges = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
  "Not sure yet",
] as const;

export const timelines = [
  "As soon as possible",
  "Within 1 month",
  "1 – 3 months",
  "3 – 6 months",
  "Later / exploring",
] as const;

export const projectStages = [
  "Just an idea",
  "Researching options",
  "Requirements defined",
  "Design exists",
  "Existing product to improve",
] as const;

export const engagementTypes = [
  "Fixed-scope project",
  "Ongoing retainer",
  "Dedicated team",
  "Advisory / audit only",
  "Not sure yet",
] as const;

export const contactMethods = ["Email", "Phone call", "Video call", "Whatever works best"] as const;

/** Per-step subsets so the wizard can validate one step at a time. */
export const requestStep1 = z.object({
  service: z.enum(requestServices, { message: "Choose the service you need." }),
  relatedService: optionalText(120),
});

export const requestStep2 = z.object({
  projectName: text("Project or initiative name", 120),
  problem: z
    .string()
    .trim()
    .min(20, "Describe the problem in at least 20 characters.")
    .max(2500, "Please keep this under 2,500 characters."),
  description: z
    .string()
    .trim()
    .min(30, "Describe the project in at least 30 characters.")
    .max(4000, "Please keep this under 4,000 characters."),
  outcomes: optionalText(2000),
  technicalRequirements: optionalText(2000),
});

export const requestStep3 = z.object({
  organisation: text("Organisation name", 140),
  budget: z.enum(budgetRanges).optional(),
  timeline: z.enum(timelines).optional(),
  stage: z.enum(projectStages).optional(),
  engagement: z.enum(engagementTypes).optional(),
});

export const requestStep4 = z.object({
  fullName: text("Full name", 120),
  email: emailField,
  phone: phoneField,
  preferredContact: z.enum(contactMethods, { message: "Pick a preferred contact method." }),
  consent,
  _hp: honeypot,
});

export const requestSchema = z.object({
  ...requestStep1.shape,
  ...requestStep2.shape,
  ...requestStep3.shape,
  ...requestStep4.shape,
});

export type RequestPayload = z.infer<typeof requestSchema>;
export type RequestDraft = Partial<RequestPayload>;

/* ------------------------------------------------------------------ */
/* Careers                                                             */
/* ------------------------------------------------------------------ */

export const disciplines = [
  // The titles Septa has published as open roles, first, so the Apply buttons on the career page
  // can preselect them. Everything after this is an area of work rather than a live vacancy.
  "Sales Manager",
  "Digital Marketing Specialist",
  "AI / Machine Learning Engineering",
  "Backend Engineering",
  "Frontend Engineering",
  "Full-Stack Engineering",
  "Data Engineering",
  "DevOps / Platform / Observability",
  "Product Design (UI/UX)",
  "Product Management",
  "Quality Assurance",
  "Business Analysis / Consulting",
  "Something else",
] as const;

/** Below the ~4.5 MB body limit a Vercel Function rejects before our code runs, so an applicant
 * who picks a huge CV gets the field message here instead of a platform error page. */
export const CV_MAX_BYTES = 4 * 1024 * 1024;
export const CV_ALLOWED_EXT = ["pdf", "doc", "docx", "rtf", "txt"] as const;

export const careerSchema = z.object({
  fullName: text("Full name", 120),
  email: emailField,
  role: z.enum(disciplines, { message: "Choose the area you want to work in." }),
  roleDetail: optionalText(120),
  location: optionalText(120),
  portfolioUrl: urlField,
  linkedinUrl: urlField,
  note: z
    .string()
    .trim()
    .min(20, "Tell us a little about your work (at least 20 characters).")
    .max(3000, "Please keep your note under 3,000 characters."),
  cvFileName: optionalText(200),
  cvSizeBytes: z.number().int().nonnegative().optional(),
  source: z.enum(["careers-page", "speculative"]).default("careers-page"),
  consent,
  _hp: honeypot,
});

export type CareerPayload = z.infer<typeof careerSchema>;

/* ------------------------------------------------------------------ */
/* Newsletter                                                          */
/* ------------------------------------------------------------------ */

export const newsletterSchema = z.object({
  email: emailField,
  consent,
  _hp: honeypot,
});

export type NewsletterPayload = z.infer<typeof newsletterSchema>;

export const statusSchema = z.object({
  ok: z.boolean(),
  backend: z.literal("septa-api"),
  storage: z.string(),
  emailDelivery: z.boolean(),
  uploadsEnabled: z.boolean(),
  mode: z.enum(["live", "record-only"]),
});

export type ApiStatus = z.infer<typeof statusSchema>;

export const submissionResult = z.object({
  ok: z.boolean(),
  id: z.string(),
  receivedAt: z.string(),
  /** False when the row is stored but no email integration is configured. */
  forwarded: z.boolean(),
  note: z.string().optional(),
});

export type SubmissionResult = z.infer<typeof submissionResult>;
