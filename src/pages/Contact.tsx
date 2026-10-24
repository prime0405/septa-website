import { Link, useSearchParams } from "react-router-dom";
import { Mail, MapPin, Phone, Send, Clock } from "lucide-react";
import { CtaBand, PageHero } from "../components/blocks/PageHero";
import { ContactForm } from "../components/forms/ContactForm";
import { IntegrationNotice } from "../components/blocks/LaunchNote";
import { LaunchNoteInline } from "../components/blocks/LaunchNote";
import { Button } from "../components/ui/Button";
import {
  Callout,
  Card,
  MarkerList,
  Reveal,
  Section,
  SectionHeading,
  Unconfigured,
} from "../components/ui/primitives";
import { inquiryTypes } from "../shared/schemas";
import { site } from "../lib/site";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const beforeYouWrite = [
  {
    label: "You want something built or fixed",
    detail:
      "Use the request form — it captures the service, the problem and your timeline in four short steps.",
    to: paths.request(),
    cta: "Open the request form",
  },
  {
    label: "You have a question about a service page",
    detail: "Pick the matching inquiry type below and mention the service in your message.",
    to: paths.services(),
    cta: "Read the services",
  },
  {
    label: "You want to work with us",
    detail: "The careers page explains what to send, including when no role is published.",
    to: paths.careers(),
    cta: "See careers",
  },
  {
    label: "You have worked with us before",
    detail: "If you would like your project published as a case study, say so — it needs your sign-off.",
    to: paths.cases(),
    cta: "See the studies",
  },
];

function ContactRow({
  icon,
  label,
  value,
  href,
  keyName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  href?: string;
  keyName: string;
}) {
  return (
    <li className="flex items-start gap-4 rounded-card border border-line bg-[#11181d] px-5 py-4">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-mint/25 bg-mint/[0.07] text-mint">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[0.68rem] tracking-wider text-faint uppercase">
          {label}
        </span>
        {value ? (
          href ? (
            <a href={href} className="mt-1.5 block text-[0.95rem] text-fg hover:text-mint">
              {value}
            </a>
          ) : (
            <span className="mt-1.5 block text-[0.95rem] whitespace-pre-line text-fg">{value}</span>
          )
        ) : (
          <span className="mt-2 block">
            <Unconfigured what={keyName} />
          </span>
        )}
      </span>
    </li>
  );
}

export default function Contact() {
  usePageMeta({
    title: "Contact Us",
    description:
      "Contact Septa with a question about AI products, software development, workflow automation, digital transformation, observability or technical staffing.",
  });

  const [params] = useSearchParams();
  const presetInquiry = params.get("inquiry");
  const defaultInquiry = (inquiryTypes as readonly string[]).includes(presetInquiry ?? "")
    ? presetInquiry!
    : undefined;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "Contact Us" }]}
        eyebrow="Contact"
        title="A real person reads this"
        lead="Questions, corrections, partnership enquiries and “is this relevant to us?” messages all land in the same place. If you already know what you want built, the request form is a faster route for both of us."
        meta={
          site.contact.responseTime ? (
            <span className="inline-flex items-center gap-2 text-[0.85rem] text-muted">
              <Clock className="size-4 text-mint" aria-hidden />
              Typically answered within {site.contact.responseTime}
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-[0.85rem] text-faint">
              <Clock className="size-4" aria-hidden />
              No response-time commitment is published yet
            </span>
          )
        }
        actions={
          <>
            <Button to={paths.request()} size="lg" iconEnd={<Send className="size-4" />}>
              Request a Service
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() =>
                document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Jump to the form
            </Button>
          </>
        }
        aside={
          <Reveal>
            <Card className="p-6">
              <p className="eyebrow mb-4">Direct details</p>
              <ul className="space-y-3">
                <ContactRow
                  icon={<Mail className="size-4" />}
                  label="General email"
                  value={site.contact.email}
                  href={site.contact.email ? `mailto:${site.contact.email}` : undefined}
                  keyName="general email address"
                />
                <ContactRow
                  icon={<Mail className="size-4" />}
                  label="Existing client support"
                  value={site.contact.supportEmail}
                  href={site.contact.supportEmail ? `mailto:${site.contact.supportEmail}` : undefined}
                  keyName="support email address"
                />
                <ContactRow
                  icon={<Phone className="size-4" />}
                  label="Phone"
                  value={site.contact.phone}
                  href={site.contact.phone ? `tel:${site.contact.phone.replace(/\s+/g, "")}` : undefined}
                  keyName="phone number"
                />
                <ContactRow
                  icon={<MapPin className="size-4" />}
                  label="Office"
                  value={site.contact.addressLines ? site.contact.addressLines.join("\n") : null}
                  keyName="office address"
                />
              </ul>
              {site.social.length ? (
                <div className="mt-5 border-t border-line pt-5">
                  <p className="eyebrow mb-3">Elsewhere</p>
                  <div className="flex flex-wrap gap-2">
                    {site.social.map((s) => (
                      <a
                        key={s.href}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="rounded-pill border border-line px-3 py-1.5 text-[0.82rem] text-muted hover:border-mint/45 hover:text-mint"
                      >
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </Card>
          </Reveal>
        }
      />

      {/* ---------------------------- form ----------------------------- */}
      <Section className="section" id="contact-form">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Write to us"
              title="Send a message"
              lead="Required fields are validated in the browser and again on the server. Nothing is marked as received until the backend confirms it."
              className="mb-8"
            />
            <ContactForm defaultInquiry={defaultInquiry} />
          </div>

          <div className="space-y-5">
            <IntegrationNotice />

            <Card className="p-6">
              <p className="eyebrow mb-4">Inquiry types</p>
              <MarkerList items={inquiryTypes.map((i) => ({ label: i }))} />
              <p className="mt-4 text-[0.85rem] leading-relaxed text-faint">
                Choose the closest one — it decides who sees the message first, not how it is treated.
              </p>
            </Card>

            <Callout kind="warn" title="Please leave sensitive data out">
              <p>
                Do not include credentials, personal data about customers, health information or
                anything under confidentiality. We will ask for the detail through a controlled
                channel if it is needed.
              </p>
            </Callout>

            {site.contact.hours ? (
              <Card className="p-6">
                <p className="eyebrow mb-3">Office hours</p>
                <p className="text-[0.9rem] text-muted">{site.contact.hours}</p>
              </Card>
            ) : (
              <Card className="border-dashed p-6">
                <p className="eyebrow mb-3">Office hours</p>
                <Unconfigured what="working hours" />
              </Card>
            )}
          </div>
        </div>
      </Section>

      {/* ------------------------- routing ---------------------------- */}
      <Section tone="raised" className="section border-y border-line-soft">
        <SectionHeading
          eyebrow="Before you write"
          title="There may be a faster route"
          className="mb-9"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {beforeYouWrite.map((b, i) => (
            <Reveal key={b.label} delay={i * 0.04} className="h-full">
              <Link to={b.to} className="card card-hover group flex h-full flex-col p-6">
                <h3 className="text-[1.05rem] text-fg group-hover:text-mint">{b.label}</h3>
                <p className="mt-2.5 flex-1 text-[0.9rem] leading-relaxed text-muted">{b.detail}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.84rem] font-medium text-mint">
                  {b.cta}
                  <Send className="size-3.5" aria-hidden />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <LaunchNoteInline label="Email, phone and address are read from src/lib/site.ts — set them before launch" />
      </Section>

      <CtaBand
        title="Ready when you are"
        lead="The request form takes a couple of minutes and preselects nothing you cannot change."
        secondary={{ label: "About Septa", to: paths.about() }}
      />
    </>
  );
}
