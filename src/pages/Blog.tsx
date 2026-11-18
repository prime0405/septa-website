import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search, SearchX } from "lucide-react";
import { PageHero } from "../components/blocks/PageHero";
import { BlogHeroArt } from "../components/visuals/BlogHeroArt";
import { DevNote } from "../components/blocks/LaunchNote";
import { PostCard } from "../components/blocks/cards";
import { Button } from "../components/ui/Button";
import {
  Callout,
  Card,
  EmptyState,
  MarkerList,
  Pill,
  Reveal,
  Section,
  SectionHeading,
} from "../components/ui/primitives";
import { allTags, postCategories, posts } from "../data/posts";
import { cn, readingTime } from "../lib/cn";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const ALL = "All";

const postText = (p: (typeof posts)[number]) =>
  p.body.map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : "")).join(" ");

export default function Blog() {
  usePageMeta({
    title: "Blog",
    description:
      "Writing from Septa on AI product delivery, automation, legacy modernisation, observability and technology strategy. Current articles are placeholder editorial content.",
  });

  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? ALL;
  const tag = params.get("tag");

  const update = (next: Record<string, string | null>) => {
    const merged = new URLSearchParams(params);
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === "" || v === ALL) merged.delete(k);
      else merged.set(k, v);
    }
    setParams(merged, { replace: true });
  };

  const sort = params.get("sort") ?? "newest";

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (category !== ALL && p.category !== category) return false;
      if (tag && !p.tags.includes(tag)) return false;
      if (!q) return true;
      return `${p.title} ${p.excerpt} ${p.tags.join(" ")} ${p.author} ${postText(p)}`
        .toLowerCase()
        .includes(q);
    });
  }, [query, category, tag]);

  const ordered = useMemo(() => {
    const arr = [...results];
    if (sort === "longest") arr.sort((a, b) => postText(b).length - postText(a).length);
    else if (sort === "title") arr.sort((a, b) => a.title.localeCompare(b.title));
    else arr.sort((a, b) => b.date.localeCompare(a.date));
    return arr;
  }, [results, sort]);

  const reads = useMemo(
    () => posts.map((p) => ({ post: p, mins: readingTime(postText(p)) })),
    [],
  );
  const longest = [...reads].sort((a, b) => b.mins - a.mins).slice(0, 3);
  const maxMins = Math.max(...reads.map((r) => r.mins));

  const featured = category === ALL && !tag && !query ? posts[0] : null;
  const list = featured ? ordered.filter((p) => p.slug !== featured.slug) : ordered;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "Blog" }]}
        eyebrow="Writing"
        title="Notes from the work, written to be useful"
        lead="Opinions grounded in delivery: how AI projects actually get stuck, what makes automation survive, how to ask a good question about a legacy system, and what monitoring is for."
        meta={
          <>
            <Pill tone="mint">{posts.length} articles</Pill>
            <Pill tone="line">{postCategories.length} categories</Pill>
            <Pill tone="line">{allTags.length} tags</Pill>
            <Pill tone="amber">Placeholder editorial</Pill>
          </>
        }
        actions={
          <>
            <Button to={paths.request()} size="lg" magnetic>
              Work with us
            </Button>
            <Button to={paths.contact()} size="lg" variant="secondary" magnetic>
              Send us a topic
            </Button>
          </>
        }
        art={<BlogHeroArt />}
        aside={
          <Reveal>
            <div className="relative overflow-hidden rounded-card border border-line bg-ink-raised/85 p-6">
              <div aria-hidden className="rule-bg absolute inset-0 opacity-40" />
              <div className="relative">
                <p className="eyebrow mb-4">The reading list</p>
                <ul className="space-y-4">
                  {longest.map(({ post: p, mins }, i) => (
                    <li key={p.slug} className="group">
                      <Link
                        to={paths.post(p.slug)}
                        className="group flex items-baseline gap-3 text-[0.88rem] text-muted hover:text-mint"
                      >
                        <span className="font-mono text-[0.72rem] text-faint group-hover:text-mint">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{p.title}</span>
                        <span className="font-mono text-[0.72rem] text-faint">{mins}m</span>
                      </Link>
                      {/* a length meter against the longest piece, so the list reads as a shelf of
                          spines rather than three identical rows */}
                      <span
                        aria-hidden
                        className="mt-1.5 ml-7 block h-0.5 rounded-full bg-line"
                      >
                        <span
                          className="block h-full rounded-full bg-mint/45 transition-colors group-hover:bg-mint/70"
                          style={{ width: `${Math.round((mins / maxMins) * 100)}%` }}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 font-mono text-[0.66rem] tracking-[0.14em] text-faint uppercase">
                  Longest reads, measured against the longest
                </p>
              </div>
            </div>
          </Reveal>
        }
      />

      <Section wall="use-case" className="section">
        <Callout kind="warn" title="Sample editorial content" className="mb-10">
          <p>
            These articles exist to prove out the blog architecture: list, search, filters, article
            template and related posts. Authorship and dates are placeholders, not real bylines.
            <DevNote>
              {" "}Add or replace articles by appending to{" "}
              <code className="font-mono text-[0.8rem]">src/data/posts.ts</code>; the page layout reads
              entirely from that file, so new content needs no template work.
            </DevNote>
          </p>
        </Callout>

        {/* --------------------------- controls --------------------------- */}
        <div className="mb-9 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading as="h2" eyebrow="Library" title="Browse the writing" />
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end lg:w-auto">
            <div className="w-full sm:w-72">
              <label htmlFor="blog-search" className="eyebrow mb-2 block">
                Search articles
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint"
                  aria-hidden
                />
                <input
                  id="blog-search"
                  type="search"
                  value={query}
                  onChange={(e) => update({ q: e.target.value })}
                  placeholder="e.g. evaluation, error budget"
                  className="w-full rounded-pill border border-line bg-ink-raised py-2.5 pr-4 pl-10 text-[1rem] text-fg placeholder:text-faint"
                />
              </div>
            </div>
            <div className="w-full sm:w-44">
              <label htmlFor="blog-sort" className="eyebrow mb-2 block">
                Order
              </label>
              <select
                id="blog-sort"
                value={sort}
                onChange={(e) => update({ sort: e.target.value === "newest" ? null : e.target.value })}
                className="w-full rounded-pill border border-line bg-ink-raised px-4 py-2.5 text-[0.92rem] text-fg"
              >
                <option value="newest">Newest first</option>
                <option value="longest">Longest read</option>
                <option value="title">Title A to Z</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[0.68rem] tracking-wider text-faint uppercase">
            Category
          </span>
          {[ALL, ...postCategories].map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => update({ category: cat, tag: null })}
                className={cn(
                  "rounded-pill border px-3.5 py-1.5 text-[0.82rem] transition-colors",
                  active
                    ? "border-mint/50 bg-mint/10 text-mint"
                    : "border-line bg-ink-raised text-muted hover:border-muted/50 hover:text-fg",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="mb-10 flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[0.68rem] tracking-wider text-faint uppercase">
            Tags
          </span>
          {allTags.map((t) => {
            const active = tag === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => update({ tag: active ? null : t })}
                className={cn(
                  "rounded-pill border px-3 py-1 font-mono text-[0.72rem] transition-colors",
                  active
                    ? "border-mint/50 bg-mint/10 text-mint"
                    : "border-line bg-transparent text-faint hover:border-muted/50 hover:text-muted",
                )}
              >
                #{t}
              </button>
            );
          })}
        </div>

        {(query || category !== ALL || tag) && (
          <p className="-mt-6 mb-8 flex flex-wrap items-center gap-3 text-[0.85rem] text-faint">
            Showing {results.length} of {posts.length}
            <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true })} className="text-mint hover:underline">
              Reset filters
            </button>
          </p>
        )}

        {/* --------------------------- featured --------------------------- */}
        {featured ? (
          <Reveal className="mb-8">
            <p className="eyebrow mb-4">Featured</p>
            <PostCard post={featured} variant="featured" />
          </Reveal>
        ) : null}

        {/* ---------------------------- list ----------------------------- */}
        {results.length ? (
          <motion.div layout={!reduce} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.div
                  key={p.slug}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, delay: Math.min(i * 0.03, 0.18) }}
                  className="h-full"
                >
                  <PostCard post={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            icon={<SearchX className="size-5" />}
            title="Nothing published matches that"
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={() => setParams(new URLSearchParams(), { replace: true })} size="sm" variant="secondary">
                  Clear search and filters
                </Button>
                <Button to={paths.contact()} size="sm">
                  Ask us to write about it
                </Button>
              </div>
            }
          >
            Search covers titles, excerpts, tags, authors and article bodies. If a topic matters to
            you, it is worth telling us.
          </EmptyState>
        )}
      </Section>

      {/* ------------------------ content model ------------------------ */}
      <Section wall="service-automation" tone="raised" className="section">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Content model"
            title="How an article gets published"
            lead="The blog is data-driven by design: structured content in one file, one template, no rebuild needed to add a piece."
          />
          <div className="space-y-6">
            <MarkerList
              items={[
                {
                  label: "One entry in a single data file",
                  detail: "Title, excerpt, category, tags, author, date and body blocks.",
                },
                {
                  label: "Write the body as blocks",
                  detail: "Paragraphs, headings, lists, quotes and code, rendered by the article template.",
                },
                {
                  label: "Categories and tags update themselves",
                  detail: "Filters are derived from the data, so a new category appears without page edits.",
                },
                {
                  label: "Swap in a CMS later",
                  detail:
                    "The page consumes one exported array, so replacing the file with a fetch keeps the layout intact.",
                },
              ]}
            />
            <Card className="p-5">
              <p className="eyebrow mb-3">Body block types</p>
              <div className="flex flex-wrap gap-2">
                {["p", "h2", "h3", "ul", "quote", "code"].map((b) => (
                  <span
                    key={b}
                    className="rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-[0.74rem] text-muted"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
