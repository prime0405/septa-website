import { Link } from "react-router-dom";
import { Scale } from "lucide-react";
import { PageHero } from "../components/blocks/PageHero";
import { Button } from "../components/ui/Button";
import {
  Callout,
  Card,
  Pill,
  Section,
  Unconfigured,
} from "../components/ui/primitives";
import { legal, privacy, site } from "../lib/site";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

type Clause = { title: string; body: string[]; list?: string[] };

const privacyClauses: Clause[] = [
  {
    title: "Who we are",
    body: [
      `This notice explains how ${site.name} handles information submitted through this website: the contact form, the service request form and career applications.`,
      "The responsible entity name, registered address and any applicable registration details have not been supplied yet, so they are shown as unset rather than assumed.",
    ],
  },
  {
    title: "What we collect",
    body: ["Only what you type into a form on this site, plus the page it was submitted from and a timestamp."],
    list: [...privacy.collects],
  },
  {
    title: "What we do not collect",
    body: ["We do not ask for, and you should not send, the following:"],
    list: [...privacy.doesNotCollect],
  },
  {
    title: "Why we collect it",
    body: [
      "To reply to your enquiry, to assess a service request, and (for career applications) to consider you for current or future roles. We do not use submission data for advertising, and we do not sell it.",
    ],
  },
  {
    title: "Where it is stored",
    body: [
      "Submissions are written to the application's own database on the server that received them, and are additionally forwarded by email when SMTP is configured. Hosting provider, region and retention period are not yet confirmed.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "No retention schedule has been set. Until one is confirmed this section stays deliberately incomplete: it should state when enquiries and applications are deleted rather than guess.",
    ],
  },
  {
    title: "Who else may see it",
    body: [
      "People at Septa who need it to answer you, and any infrastructure provider required to run this website. We do not share submission data with advertisers or data brokers.",
    ],
  },
  {
    title: "Cookies and local storage",
    body: [
      "This site does not set advertising or tracking cookies. The request form stores a draft in your browser so a refresh does not lose your typing.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You can ask what we hold about you, ask for it to be corrected or deleted, and withdraw consent at any time. The applicable statutory rights depend on your location and on Septa's operating jurisdiction, which must be confirmed before this page is finalised.",
    ],
  },
  {
    title: "Security",
    body: [
      "Submission endpoints validate input on the server, apply rate limits per address, and include a hidden field that catches automated posts. No transmission method is completely secure, so please keep confidential or special-category data out of the forms.",
    ],
  },
  {
    title: "Contact",
    body: [
      "Ask for a privacy change (access, correction, deletion or consent withdrawal) through the contact form, quoting the reference you were given when you submitted.",
    ],
  },
];

const termsClauses: Clause[] = [
  {
    title: "About these terms",
    body: [
      `These terms govern use of the ${site.name} website. They are a starting template: the contracting entity, governing law and effective date are not yet confirmed, so this page must be reviewed before it is presented as binding.`,
    ],
  },
  {
    title: "Use of the site",
    body: [
      "You may read, share and link to this content for your own information. Automated scraping, republishing, or use of the material to train a competing service needs written permission.",
    ],
  },
  {
    title: "Content is informational",
    body: [
      "Service pages, articles and case studies describe Septa's work and thinking. They are not professional advice, and nothing here creates an obligation until a signed engagement document exists.",
    ],
  },
  {
    title: "Sample and illustrative material",
    body: [
      "Case studies and some metrics on this site are labelled as illustrative samples. They exist to show how the work is approached and must not be quoted as client outcomes or measured results.",
    ],
  },
  {
    title: "Requests and quotes",
    body: [
      "Submitting a request does not form a contract. Scope, price, timing and responsibilities are agreed in writing per engagement; anything on a service page is editable marketing copy.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      "The website's design, text and graphics belong to Septa or are used with permission. Work produced for a client is assigned according to that engagement's contract, typically with repositories, pipelines and accounts owned by the client.",
    ],
  },
  {
    title: "Third-party links and services",
    body: [
      "Links to external tools or providers are for convenience. Septa is not responsible for their content, availability or terms.",
    ],
  },
  {
    title: "Availability",
    body: [
      "This website is provided as-is. We do not guarantee uninterrupted access, and form submission is not a substitute for a contractual communication channel.",
    ],
  },
  {
    title: "Liability",
    body: [
      "To the extent permitted by applicable law, Septa is not liable for losses arising from reliance on website content. Any liability for delivered work is governed by the relevant engagement agreement, including its own limits.",
    ],
  },
  {
    title: "Changes to these terms",
    body: [
      "We may update this page; the effective date at the top changes when we do. Continued use of the site after a change means you accept it.",
    ],
  },
  {
    title: "Governing law",
    body: [
      "Not yet set. The jurisdiction and venue for these terms must be confirmed with the entity's legal adviser before publication.",
    ],
  },
];

export default function Legal({ kind }: { kind: "privacy" | "terms" }) {
  const isPrivacy = kind === "privacy";
  const title = isPrivacy ? "Privacy Policy" : "Terms of Service";
  const clauses = isPrivacy ? privacyClauses : termsClauses;
  const effective = isPrivacy ? legal.privacyEffectiveDate : legal.termsEffectiveDate;

  usePageMeta({
    title,
    description: isPrivacy
      ? `How ${site.name} handles information submitted through the contact, service request and career forms.`
      : `Terms governing use of the ${site.name} website.`,
  });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: title }]}
        eyebrow="Legal"
        title={title}
        lead={
          isPrivacy
            ? "What the forms on this site collect, why, where it goes, and how to ask us to change or delete it."
            : "The rules for using this website, what the content means, and what a request does and does not commit anyone to."
        }
        meta={
          <>
            <Pill tone="line">
              <Scale className="size-3.5" /> Entity: {legal.entity}
            </Pill>
            <Pill tone={effective ? "line" : "amber"}>
              {effective ? `Effective ${effective}` : "Effective date not set"}
            </Pill>
            <Pill tone="amber">Template: needs review</Pill>
          </>
        }
        actions={
          <Button to={paths.contact()} variant="secondary" size="md">
            {isPrivacy ? "Ask about your data" : "Ask a question about these terms"}
          </Button>
        }
      />

      <Section className="section">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <nav aria-label="Sections" className="lg:sticky lg:top-28 lg:self-start">
            <Card className="p-5">
              <p className="eyebrow mb-4">Contents</p>
              <ol className="space-y-2">
                {clauses.map((c, i) => (
                  <li key={c.title}>
                    <a
                      href={`#${slug(c.title)}`}
                      className="group flex gap-3 text-[0.85rem] text-muted hover:text-mint"
                    >
                      <span className="font-mono text-[0.7rem] text-faint group-hover:text-mint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {c.title}
                    </a>
                  </li>
                ))}
              </ol>
            </Card>

            <Callout kind="warn" title="Not yet a finished legal document" className="mt-5">
              <p>
                {isPrivacy
                  ? "Retention period, hosting region, governing law and the registered entity must be supplied and reviewed by a qualified adviser before this page is relied on."
                  : "These clauses were drafted as a working template. Entity name, governing law, effective date and liability caps need legal review for the jurisdiction Septa operates in."}
              </p>
            </Callout>
          </nav>

          <div className="max-w-3xl">
            <div className="mb-8 space-y-4">
              <Row label="Legal entity" value={legal.entity} always />
              <Row label="Effective date" value={effective} missing="effective date" />
              <Row
                label="Governing law"
                value={legal.governingLaw}
                missing="governing-law jurisdiction"
              />
              <Row label="Data retention" value={legal.dataRetention} missing="retention period" />
              <Row label="Contact for this" value={site.contact.email} missing="contact email" />
            </div>

            <div className="space-y-10">
              {clauses.map((c, i) => (
                <section key={c.title} id={slug(c.title)} className="scroll-mt-28">
                  <p className="font-mono text-[0.68rem] tracking-wider text-mint-bright uppercase">
                    clause {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 text-[1.35rem]">{c.title}</h2>
                  {c.body.map((b, bi) => (
                    <p key={bi} className="prose-body mt-3 text-[0.98rem]">
                      {b}
                    </p>
                  ))}
                  {c.list ? (
                    <ul className="mt-4 space-y-2">
                      {c.list.map((item) => (
                        <li key={item} className="flex gap-3 text-[0.92rem] text-muted">
                          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-mint/60" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            <div className="mt-12 border-t border-line pt-8 text-[0.88rem] text-muted">
              {isPrivacy ? (
                <>
                  Want the data-handling picture in one line: form submissions go to our own database
                  and, when email forwarding is configured, to an inbox we control. See{" "}
                  <Link to={paths.terms()} className="text-mint hover:underline">
                    the terms of service
                  </Link>{" "}
                  for what the site content means.
                </>
              ) : (
                <>
                  Questions about these terms, or about what a proposal commits anyone to, should go
                  through the{" "}
                  <Link to={paths.contact()} className="text-mint hover:underline">
                    contact form
                  </Link>
                  . How we handle your information is in the{" "}
                  <Link to={paths.privacy()} className="text-mint hover:underline">
                    privacy notice
                  </Link>
                  .
                </>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function Row({
  label,
  value,
  missing,
  always,
}: {
  label: string;
  value: string | null;
  missing?: string;
  always?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-surface-raised px-4 py-3">
      <span className="font-mono text-[0.7rem] tracking-wider text-faint uppercase">{label}</span>
      {value ? (
        <span className="text-[0.9rem] text-fg">{value}</span>
      ) : always ? (
        <span className="text-[0.9rem] text-fg">{value ?? "unset"}</span>
      ) : (
        <Unconfigured what={missing ?? "value"} where="src/lib/site.ts" />
      )}
    </div>
  );
}

function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
