import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ServiceIcon } from "../components/blocks/ServiceIcon";
import { Reveal, Section, SectionHero } from "../components/ui/primitives";
import { services } from "../data/services";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";
import "./service-page-theme.css";

export default function Services() {
  usePageMeta({
    title: "Services",
    description:
      "Explore Septa's AI product development, workflow automation, digital transformation, observability and talent solutions.",
  });

  return (
    <div className="service-page">
      <section className="relative isolate overflow-hidden bg-[#061820] text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(109,177,174,.32) 1px, transparent 1px), linear-gradient(90deg, rgba(109,177,174,.32) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div className="absolute -right-24 -top-32 size-[34rem] rounded-full border border-brand-teal/20" />
          <div className="absolute -right-10 -top-16 size-[24rem] rounded-full bg-brand-teal/10 blur-[100px]" />
          <div className="absolute -bottom-48 left-[8%] size-[28rem] rounded-full bg-brand-teal/[0.08] blur-[110px]" />
        </div>

        <div className="wrap relative py-11 sm:py-14 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-sans text-[0.7rem] uppercase tracking-wider text-white/55">
              <li><Link to={paths.home()} className="transition-colors hover:text-brand-mint">Home</Link></li>
              <li className="flex items-center gap-2"><ChevronRight className="size-3" aria-hidden /><span className="text-white">Services</span></li>
            </ol>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-12">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-3">
                <span className="flex size-11 items-center justify-center border border-brand-mint/35 bg-brand-mint/[0.07] text-brand-mint">
                  <span className="font-sans text-sm font-semibold">05</span>
                </span>
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-mint">Service overview</span>
              </div>
              <h1 className="max-w-4xl text-[clamp(2.8rem,6.2vw,5.6rem)] leading-[0.98] tracking-[-0.055em] text-white">
                Explore what we can <span className="text-brand-teal">build together.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-[.98rem] leading-7 text-white/75 sm:text-base sm:leading-7">
                Explore Septa's service areas, from intelligent digital products and connected workflows to modern infrastructure and technical talent.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button to={paths.request()} size="lg" variant="dark-cta" magnetic>Start a project</Button>
                <Link to={paths.contact()} className="inline-flex min-h-12 items-center gap-2 border border-white/30 px-5 text-sm font-semibold text-white transition-colors hover:border-brand-mint hover:bg-white/[0.04]">
                  Talk to our team <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/20 pt-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-3 py-2 font-sans text-xs text-white/75"><strong className="text-white">05</strong> service areas</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-3 py-2 font-sans text-xs text-white/75"><strong className="text-white">01</strong> connected team</span>
              </div>
            </div>

            <div className="service-glass relative mx-auto w-full max-w-lg rounded-[2.25rem] border border-brand-teal/25 bg-white/[0.04] p-2.5 backdrop-blur-xl sm:p-3">
              <div aria-hidden className="pointer-events-none absolute -inset-2 rounded-[2.6rem] border border-brand-teal/25" />
              <div className="relative isolate overflow-hidden rounded-[1.8rem] bg-brand-pearl sm:rounded-[2rem]">
                <img
                  src="/img/work/engineering-floor.webp"
                  alt="Technology professionals collaborating in an engineering workspace"
                  className="aspect-[5/4] w-full object-cover"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-pearl via-brand-pearl/20 to-brand-pearl/5" />
                <div className="absolute left-5 top-5 flex items-center gap-3 rounded-full border border-white/30 bg-brand-pearl/75 px-4 py-3 text-white shadow-lg backdrop-blur-md sm:left-7 sm:top-7">
                  <span className="size-2.5 rounded-full bg-brand-teal" />
                  <span className="font-sans text-[0.62rem] uppercase tracking-[0.2em]">SEPTA / CAPABILITIES</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                  <p className="font-sans text-[0.62rem] uppercase tracking-[0.2em] text-brand-teal">One technology partner</p>
                  <p className="mt-3 max-w-lg text-2xl font-semibold leading-tight sm:text-3xl">Strategy, engineering and people, working in step.</p>
                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/25 pt-4 sm:grid-cols-3">
                    {services.map((service, index) => (
                      <div key={service.slug} className="flex items-center gap-2 text-xs text-white/80">
                        <span className="font-sans text-brand-teal">{String(index + 1).padStart(2, "0")}</span>
                        <span className="min-w-0 truncate">{service.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden className="h-1 w-full bg-gradient-to-r from-transparent via-brand-mint/55 to-transparent" />
      </section>

      <Section id="service-catalog" wall="use-case" tone="surface" className="section">
        <div className="max-w-3xl">
          <SectionHero
            eyebrow="What we do"
            title="Five service areas. One connected approach."
            className="mb-12"
          />
          <p className="-mt-7 mb-12 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Each service can stand on its own or work alongside the others, depending on what your organisation needs.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service, index) => {
            const featured = index === 0;
            return (
              <Reveal key={service.slug} delay={index * 0.045} className={featured ? "md:col-span-2" : ""}>
                <article
                  className={`service-glass group relative flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-[#C9E3D7] bg-white shadow-[0_22px_60px_-42px_rgba(6,44,42,.28)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6DB1AE]/70 hover:shadow-[0_28px_70px_-42px_rgba(6,44,42,.36)] ${featured ? "md:grid md:grid-cols-[.94fr_1.06fr]" : "min-h-[27rem]"}`}
                >
                  <div className={`service-catalogue-image relative overflow-hidden bg-[#061820] ${featured ? "min-h-[17rem] md:min-h-[27rem]" : "aspect-[16/9]"}`}>
                    <img
                      src={service.image?.src ?? "/img/work/product-in-use.webp"}
                      alt={service.image?.alt ?? `Septa ${service.name} in practice`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#061820]/75 via-[#061820]/5 to-transparent" />
                    {featured ? <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#061820]/25 via-transparent to-transparent" /> : null}
                    <span className="absolute left-5 top-5 flex size-11 items-center justify-center border border-white/35 bg-[#061820]/65 text-[#91d9cf] shadow-lg backdrop-blur-md">
                      <ServiceIcon icon={service.icon} className="size-5" strokeWidth={1.8} />
                    </span>
                    <span className={`absolute bottom-4 right-5 font-sans font-light leading-none text-white/90 ${featured ? "text-6xl sm:text-7xl" : "text-5xl"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {featured ? (
                      <span className="absolute bottom-6 left-6 rounded-full border border-white/25 bg-[#061820]/55 px-3 py-2 font-sans text-[.62rem] uppercase tracking-[.18em] text-white/85 backdrop-blur-md">
                        Featured service
                      </span>
                    ) : null}
                  </div>

                  <div className={`flex flex-1 flex-col p-6 sm:p-8 ${featured ? "md:justify-center md:p-9 lg:p-11" : ""}`}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#286F6A]">
                        Septa service / {String(index + 1).padStart(2, "0")}
                      </p>
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#6DB1AE]/30 bg-[#EEF6F3] px-3 py-1.5 font-sans text-[0.68rem] text-[#49666A]">
                        <span className="size-1.5 rounded-full bg-[#429B89]" />
                        {service.coreServices.length} capabilities
                      </span>
                    </div>
                    <h2 className={`mt-5 max-w-xl font-semibold leading-[1.08] tracking-tight text-[#123F3D] ${featured ? "text-[clamp(2rem,3.6vw,3.25rem)]" : "text-[1.55rem]"}`}>
                      {service.name}
                    </h2>
                    <p className={`mt-4 flex-1 text-sm leading-7 text-[#49666A] ${featured ? "max-w-xl sm:text-[.96rem] sm:leading-8" : ""}`}>
                      {service.intro}
                    </p>
                    <div className="mt-7 border-t border-[#6DB1AE]/25 pt-5">
                      <Link
                        to={paths.service(service.slug)}
                        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#286F6A] transition-colors hover:text-[#123F3D]"
                      >
                        Explore service
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section wall="about" tone="raised" className="section border-y border-line-soft">
        <div className="flex flex-col gap-7 rounded-[2rem] border border-brand-teal/25 bg-white/65 p-7 shadow-[0_24px_60px_-48px_rgba(6,24,32,.35)] sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="max-w-2xl">
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-mint">Have a project in mind?</p>
            <h2 className="mt-3 text-[clamp(1.8rem,3vw,2.6rem)] leading-tight text-brand-pearl">Let’s work out the right approach.</h2>
            <p className="mt-3 text-sm leading-7 text-muted">Tell us what you are trying to build, improve or change. We’ll help identify the service or combination of services that makes sense.</p>
          </div>
          <Button to={paths.request()} size="lg" magnetic>Request a service</Button>
        </div>
      </Section>
    </div>
  );
}
