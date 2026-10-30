import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search, SearchX, FolderOpen } from "lucide-react";
import { CtaBand, PageHero } from "../components/blocks/PageHero";
import { DevNote } from "../components/blocks/LaunchNote";
import { CaseCard } from "../components/blocks/cards";
import { Button } from "../components/ui/Button";
import {
  Callout,
  EmptyState,
  Pill,
  Reveal,
  Section,
  SectionHeading,
} from "../components/ui/primitives";
import { caseCategories, caseStudies } from "../data/cases";
import { cn } from "../lib/cn";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const ALL = "All";

export default function Cases() {
  usePageMeta({
    title: "Case Studies",
    description:
      "How Septa approaches AI, automation, modernisation, observability and staffing work. Published examples are clearly labelled illustrative samples until client-approved studies exist.",
  });

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const reduce = useReducedMotion();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return caseStudies.filter((c) => {
      const inCategory = category === ALL || c.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      const haystack = [
        c.title,
        c.summary,
        c.problem,
        c.solutionOverview,
        c.category,
        c.clientDescriptor,
        c.stack.join(" "),
        c.services.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, category]);

  const countFor = (cat: string) =>
    cat === ALL ? caseStudies.length : caseStudies.filter((c) => c.category === cat).length;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "Case Studies" }]}
        eyebrow="Case studies"
        title="Work described as a problem, a decision and a result"
        lead="Each study follows the same structure so you can compare approaches: what was actually going wrong, what was tried, what shipped, and what the team learned. Measurable results are shown only where they can be verified."
        meta={
          <>
            <Pill tone="mint">{caseStudies.length} studies published</Pill>
            <Pill tone="line">{caseCategories.length} categories</Pill>
            <Pill tone="amber">Currently illustrative samples</Pill>
          </>
        }
        actions={
          <>
            <Button to={paths.request()} size="lg">
              Request a similar solution
            </Button>
            <Button to={paths.services()} size="lg" variant="secondary">
              Browse services
            </Button>
          </>
        }
        aside={
          <Reveal>
            <div className="relative rounded-card border border-line bg-ink-raised/85 p-6">
              <div aria-hidden className="dot-bg absolute inset-0 opacity-40" />
              <div className="relative">
                <p className="eyebrow mb-4">How to read these</p>
                <ul className="space-y-3 text-[0.88rem] text-muted">
                  <li className="flex gap-3">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-mint/60" />
                    Every study states the constraint that mattered — budget, data, politics or legacy code.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-mint/60" />
                    Outcomes are marked verified or unverified. Unverified figures are never presented as fact.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-mint/60" />
                    Client names are replaced with sector descriptors until approval is granted.
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        }
      />

      <Section className="section">
        <Callout kind="warn" title="These are sample scenarios" className="mb-10">
          <p>
            The studies below were written to demonstrate the page structure and our thinking. They
            are not Septa client engagements, and no metric here is a real result.
            <DevNote>
              {" "}Replace them with approved studies in{" "}
              <code className="font-mono text-[0.8rem]">src/data/cases.ts</code> before launch — the
              labels come from that file, not from the page.
            </DevNote>
          </p>
        </Callout>

        {/* --------------------------- controls --------------------------- */}
        <SectionHeading
          eyebrow="Library"
          title="Filter the studies"
          className="mb-8"
          action={
            <p className="font-mono text-[0.75rem] text-faint">
              {results.length} of {caseStudies.length} shown
            </p>
          }
        />

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-sm">
            <label htmlFor="case-search" className="eyebrow mb-2 block">
              Search
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint"
                aria-hidden
              />
              <input
                id="case-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. retrieval, reporting, legacy"
                className="w-full rounded-pill border border-line bg-ink-raised py-2.5 pr-4 pl-10 text-[0.9rem] text-fg placeholder:text-faint"
              />
            </div>
          </div>

          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            {[ALL, ...caseCategories].map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "relative rounded-pill border px-3.5 py-2 text-[0.82rem] transition-colors",
                    active
                      ? "border-mint/50 bg-mint/10 text-mint"
                      : "border-line bg-ink-raised text-muted hover:border-muted/50 hover:text-fg",
                  )}
                >
                  {cat}
                  <span className="ml-1.5 font-mono text-[0.7rem] opacity-70">{countFor(cat)}</span>
                  {active && !reduce ? (
                    <motion.span
                      layoutId="case-cat"
                      className="absolute inset-x-2 -bottom-px h-px bg-mint"
                      transition={{ duration: 0.25 }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* --------------------------- results --------------------------- */}
        {results.length ? (
          <motion.div
            layout={!reduce}
            className="grid gap-6 lg:grid-cols-2"
          >
            <AnimatePresence mode="popLayout">
              {results.map((study, i) => (
                <motion.div
                  key={study.slug}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.2) }}
                  className="h-full"
                >
                  <CaseCard study={study} featured={i === 0 && !query && category === ALL} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            icon={<SearchX className="size-5" />}
            title="No studies match that"
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  onClick={() => {
                    setQuery("");
                    setCategory(ALL);
                  }}
                  size="sm"
                  variant="secondary"
                >
                  Clear filters
                </Button>
                <Button to={paths.contact()} size="sm">
                  Ask if we have done something like it
                </Button>
              </div>
            }
          >
            Try a broader word, or switch category. Search covers titles, problems, approaches and
            the technology named in each study.
          </EmptyState>
        )}
      </Section>

      {/* ------------------------ structure note ----------------------- */}
      <Section tone="raised" className="section border-y border-line-soft">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Template"
            title="What a published study contains"
            lead="One structure for every study, so a reader can find the part they care about without relearning the layout."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Background — the situation and its constraints",
              "The challenge — what made it hard, not just what was missing",
              "Objectives — what success was meant to look like",
              "The solution — the design and why it was chosen",
              "Implementation — sequence, integrations and risks taken",
              "Technology stack — what was used and what replaced",
              "Results — verified where possible, marked where not",
              "Lessons learned — what we would do differently",
            ].map((s) => (
              <li
                key={s}
                className="rounded-card border border-line bg-surface-raised px-4 py-3.5 text-[0.88rem] text-muted"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 flex items-center gap-2 text-[0.85rem] text-faint">
          <FolderOpen className="size-4" aria-hidden />
          Real client stories need client sign-off. If you have worked with us,{" "}
          <Link to={paths.contact()} className="text-mint hover:underline">
            tell us which project
          </Link>{" "}
          and we will draft it for your review.
        </p>
      </Section>

      <CtaBand
        title="Want something like one of these?"
        lead="Send the shape of your problem through the request form. We will say which of these approaches transfers — and which part does not."
        secondary={{ label: "See the services", to: paths.services() }}
      />
    </>
  );
}
