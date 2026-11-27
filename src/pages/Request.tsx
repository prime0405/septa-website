import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { RequestWizard } from "../components/forms/RequestWizard";
import { IntegrationNotice } from "../components/blocks/LaunchNote";
import { Callout, Section, SectionHeading } from "../components/ui/primitives";
import { requestServices } from "../shared/schemas";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";
import "./service-page-theme.css";

export default function Request() {
  usePageMeta({
    title: "Request a Service",
    description:
      "Tell Septa what you need and share the key details of your project. Our team will use your enquiry to understand the challenge and identify a suitable next step.",
  });

  const [params] = useSearchParams();
  const raw = params.get("service");
  const preselected = raw && (requestServices as readonly string[]).includes(raw) ? raw : undefined;

  return (
    <div className="service-page">
      <section data-static-hero="" className="relative isolate overflow-hidden bg-[#061820] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(109,177,174,.32) 1px, transparent 1px), linear-gradient(90deg, rgba(109,177,174,.32) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div className="absolute -right-24 -top-32 size-[30rem] rounded-full border border-brand-teal/20" />
          <div className="absolute -right-10 -top-16 size-[22rem] rounded-full bg-brand-teal/10 blur-[100px]" />
        </div>

        <div className="wrap relative py-10 sm:py-12 lg:py-14">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-sans text-[0.7rem] uppercase tracking-wider text-white/55">
              <li><Link to={paths.home()} className="transition-colors hover:text-brand-mint">Home</Link></li>
              <li className="flex items-center gap-2"><ChevronRight className="size-3" aria-hidden /><span className="text-white">Request a service</span></li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <p className="mb-5 font-sans text-xs uppercase tracking-[0.2em] text-brand-mint">Start a conversation</p>
            <h1 className="max-w-4xl text-[clamp(2.8rem,6vw,5rem)] leading-[0.98] tracking-[-0.055em] text-white">
              Tell us what you <span className="text-brand-teal">need to move forward.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[.98rem] leading-7 text-white/75 sm:text-base">
              Share what you are trying to build, change or improve. A few clear details will help us understand the challenge and plan the right next step.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to={paths.services()} size="lg" variant="dark-cta">Explore our services</Button>
              <Link to={paths.contact()} className="inline-flex min-h-12 items-center gap-2 border border-white/30 px-5 text-sm font-semibold text-white transition-colors hover:border-brand-mint hover:bg-white/[0.04]">
                Contact us first <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
        <div aria-hidden className="h-1 w-full bg-gradient-to-r from-transparent via-brand-mint/55 to-transparent" />
      </section>

      <Section id="project-enquiry" wall="use-case" tone="surface" className="section">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 max-w-2xl">
            <SectionHeading
              eyebrow="Project enquiry"
              title="A little context goes a long way."
              lead="Work through the steps below. You can review your answers before submitting the request."
            />
          </div>

          {preselected ? (
            <Callout kind="info" title="Service preselected" className="mb-6">
              <p>
                Your enquiry is set to <span className="font-semibold text-fg">{preselected}</span>.
                You can change this in the first step if another service is a better fit.
              </p>
            </Callout>
          ) : null}

          <IntegrationNotice />
          <RequestWizard preselected={preselected} />
          <p className="mt-4 text-center text-xs leading-6 text-muted">
            Unfinished answers are saved in this browser so you can return to them later.{" "}
            <Link to={paths.privacy()} className="font-semibold text-mint hover:underline">Privacy policy</Link>.
          </p>

          <p className="mt-6 text-center text-sm leading-6 text-muted">
            Prefer to speak with someone first?{" "}
            <Link to={paths.contact()} className="font-semibold text-mint hover:underline">
              Contact the Septa team
            </Link>
            .
          </p>
        </div>
      </Section>
    </div>
  );
}
