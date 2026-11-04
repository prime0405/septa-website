import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "../components/blocks/PageHero";
import { ContactForm } from "../components/forms/ContactForm";
import { IntegrationNotice, LaunchNoteInline } from "../components/blocks/LaunchNote";
import {
  Callout,
  Card,
  Reveal,
  Section,
  SectionHeading,
  Unconfigured,
} from "../components/ui/primitives";
import { contactCopy } from "../data/content";
import { site } from "../lib/site";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

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
    <li className="flex items-start gap-4 rounded-card border border-line bg-surface-raised px-5 py-4">
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
  usePageMeta({ title: "Contact Us", description: contactCopy.headline });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "Contact Us" }]}
        eyebrow="Contact Us"
        title={contactCopy.headline}
        lead={contactCopy.lead}
        meta={
          site.contact.responseTime ? (
            <span className="inline-flex items-center gap-2 text-[0.85rem] text-muted">
              <Clock className="size-4 text-mint" aria-hidden />
              Typically answered within {site.contact.responseTime}
            </span>
          ) : null
        }
      />

      {/* ---------------------------- form ----------------------------- */}
      <Section className="section">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Contact Us" title={contactCopy.formTitle} className="mb-8" />
            <ContactForm />
            <p className="prose-body mt-10 border-l-2 border-mint/45 pl-5 text-[1rem]">
              {contactCopy.close}
            </p>
          </div>

          <div className="space-y-5">
            <Reveal>
              <Card className="p-6">
                <p className="eyebrow mb-4">Contact information</p>
                <ul className="space-y-3">
                  <ContactRow
                    icon={<Mail className="size-4" />}
                    label="General email"
                    value={site.contact.email}
                    href={site.contact.email ? `mailto:${site.contact.email}` : undefined}
                    keyName="general email address"
                  />
                  <ContactRow
                    icon={<Phone className="size-4" />}
                    label="Phone"
                    value={site.contact.phone}
                    href={
                      site.contact.phone ? `tel:${site.contact.phone.replace(/\s+/g, "")}` : undefined
                    }
                    keyName="phone number"
                  />
                  <ContactRow
                    icon={<MapPin className="size-4" />}
                    label="Office"
                    value={site.contact.addressLines ? site.contact.addressLines.join("\n") : null}
                    keyName="office address"
                  />
                </ul>
              </Card>
            </Reveal>

            <IntegrationNotice />

            <Callout kind="warn" title="Please leave sensitive data out">
              <p>
                Do not include credentials, personal data about customers, health information or
                anything under confidentiality. We will ask for the detail through a controlled
                channel if it is needed.
              </p>
            </Callout>

            <LaunchNoteInline label="Email, phone and address are read from src/lib/site.ts. Set them before launch" />
          </div>
        </div>
      </Section>
    </>
  );
}
