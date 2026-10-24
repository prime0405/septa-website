import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { config } from "./config.ts";
import { formatBytes } from "./upload.ts";
import type { StoredSubmission } from "./store.ts";

/**
 * Optional SMTP delivery.
 *
 * Email is a *notification*, never the storage mechanism: if sending fails (or is not
 * configured) the submission row still exists and the caller marks it `forwarded: false`
 * with a human-readable note. This module must not throw.
 */

export interface DeliveryResult {
  /** False when no SMTP details are configured at all. */
  enabled: boolean;
  /** True only when the notification email was accepted by the SMTP server. */
  forwarded: boolean;
  note: string | null;
}

const STREAM_LABELS: Record<string, string> = {
  contact: "Contact enquiry",
  requests: "Service request",
  applications: "Career application",
};

const FIELD_LABELS: Record<string, string> = {
  fullName: "Name",
  email: "Email",
  company: "Company",
  organisation: "Organisation",
  phone: "Phone",
  inquiryType: "Enquiry type",
  service: "Service",
  relatedService: "Related service",
  projectName: "Project name",
  problem: "Problem to solve",
  description: "Description",
  outcomes: "Desired outcomes",
  technicalRequirements: "Technical requirements",
  budget: "Budget",
  timeline: "Timeline",
  stage: "Current stage",
  engagement: "Engagement type",
  preferredContact: "Preferred contact",
  role: "Area of interest",
  roleDetail: "Role detail",
  location: "Location",
  portfolioUrl: "Portfolio",
  linkedinUrl: "LinkedIn",
  note: "Note",
  cvFileName: "CV file",
  cvSizeBytes: "CV size",
  source: "Source",
  consent: "Consent given",
};

function labelFor(key: string): string {
  return FIELD_LABELS[key] ?? key;
}

/** Plain-text body: one labelled line per submitted field, in schema order. */
export function buildTextBody(submission: StoredSubmission): string {
  const lines: string[] = [
    `${STREAM_LABELS[submission.stream] ?? submission.stream} via septa website`,
    "",
    `Reference: ${submission.id}`,
    `Received:   ${submission.createdAt}`,
    "",
  ];

  for (const [key, value] of Object.entries(submission.payload)) {
    if (key === "_hp" || value === undefined || value === null || value === "") continue;
    const text = key === "cvSizeBytes" && typeof value === "number" ? formatBytes(value) : String(value);
    lines.push(`${labelFor(key)}: ${text}`);
  }

  if (submission.stream === "applications") {
    lines.push("");
    lines.push(
      submission.cvPath
        ? "CV: stored on the API host (uploads directory). Attachments are not emailed by default."
        : "CV: none uploaded.",
    );
  }

  lines.push("", "Do not reply to this address unless it is your configured inbox.");
  return lines.join("\n");
}

export function buildSubject(submission: StoredSubmission): string {
  const who =
    typeof submission.payload.fullName === "string" && submission.payload.fullName.length > 0
      ? submission.payload.fullName
      : typeof submission.payload.email === "string"
        ? submission.payload.email
        : "unknown sender";
  const label = STREAM_LABELS[submission.stream] ?? submission.stream;
  return `[Septa] New ${label.toLowerCase()} — ${who}`;
}

let cachedTransport: Transporter | null = null;

/** Kept short so a dead SMTP server can never pin a web request open. */
const TIMEOUTS = {
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
} as const;

function getTransport(): Transporter | null {
  if (!config.smtp.usable) return null;
  if (cachedTransport) return cachedTransport;

  if (config.smtp.url) {
    cachedTransport = nodemailer.createTransport({ url: config.smtp.url, ...TIMEOUTS });
    return cachedTransport;
  }

  if (!config.smtp.host || !config.smtp.from) return null;
  cachedTransport = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port ?? 587,
    secure: config.smtp.secure ?? (config.smtp.port === 465),
    auth:
      config.smtp.user && config.smtp.pass
        ? { user: config.smtp.user, pass: config.smtp.pass }
        : undefined,
    ...TIMEOUTS,
  });
  return cachedTransport;
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    timer.unref();
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}

function shorten(text: string, max = 180): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

/**
 * Sends the notification. Never throws and never blocks a request for longer than
 * `NOTIFY_TIMEOUT_MS` (default 10s).
 */
export async function notifySubmission(submission: StoredSubmission): Promise<DeliveryResult> {
  if (!config.emailDeliveryEnabled) {
    return {
      enabled: false,
      forwarded: false,
      note: "Saved to the site inbox. Email forwarding is not configured, so nothing was sent.",
    };
  }

  const transport = getTransport();
  if (!transport) {
    return {
      enabled: false,
      forwarded: false,
      note: "Saved to the site inbox, but the SMTP settings are incomplete so no email was sent.",
    };
  }

  const from = config.smtp.from ?? config.inboxEmail;
  const to = config.inboxEmail;
  if (!from || !to) {
    return {
      enabled: false,
      forwarded: false,
      note: "Saved to the site inbox. No INBOX_EMAIL is configured, so no email was sent.",
    };
  }

  try {
    await withTimeout(
      transport.sendMail({
        from,
        to,
        replyTo: config.smtp.replyTo ?? (typeof submission.payload.email === "string" ? submission.payload.email : undefined),
        subject: buildSubject(submission),
        text: buildTextBody(submission),
      }),
      config.notifyTimeoutMs,
      `SMTP did not respond within ${Math.round(config.notifyTimeoutMs / 1000)}s`,
    );
    return { enabled: true, forwarded: true, note: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[notify] delivery failed for ${submission.stream}/${submission.id}: ${shorten(message)}`);
    return {
      enabled: true,
      forwarded: false,
      note: `Saved to the site inbox, but the email notification failed (${shorten(message)}).`,
    };
  }
}
