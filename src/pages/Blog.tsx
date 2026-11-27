import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Search, SearchX } from "lucide-react";
import { PageHero } from "../components/blocks/PageHero";
import { BlogHeroArt } from "../components/visuals/BlogHeroArt";
import { PhotoFigure } from "../components/blocks/PhotoFigure";
import { PostCard } from "../components/blocks/cards";
import { Button } from "../components/ui/Button";
import {
  EmptyState,
  Reveal,
  Section,
  SectionHeading,
} from "../components/ui/primitives";
import { posts } from "../data/posts";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const postText = (post: (typeof posts)[number]) =>
  post.body.map((block) => ("text" in block ? block.text : "items" in block ? block.items.join(" ") : "")).join(" ");

export default function Blog() {
  usePageMeta({
    title: "Blog",
    description:
      "Perspectives on AI product development, software engineering, workflow automation and digital transformation.",
  });

  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const sort = params.get("sort") ?? "newest";

  const update = (next: Record<string, string | null>) => {
    const merged = new URLSearchParams(params);
    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === "") merged.delete(key);
      else merged.set(key, value);
    }
    setParams(merged, { replace: true });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (!q) return true;
      return `${post.title} ${post.excerpt} ${post.tags.join(" ")} ${postText(post)}`
        .toLowerCase()
        .includes(q);
    });
  }, [query]);

  const ordered = useMemo(() => {
    const items = [...results];
    if (sort === "longest") items.sort((a, b) => postText(b).length - postText(a).length);
    else if (sort === "title") items.sort((a, b) => a.title.localeCompare(b.title));
    else items.sort((a, b) => b.date.localeCompare(a.date));
    return items;
  }, [results, sort]);

  const featured = !query ? posts[0] : null;
  const list = featured ? ordered.filter((post) => post.slug !== featured.slug) : ordered;
  const clearFilters = () => setParams(new URLSearchParams(), { replace: true });

  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", to: paths.home() }, { label: "Blog" }]}
        title="A clearer view of what technology can do."
        lead="Practical perspectives on AI, product engineering, automation and the decisions behind technology that works."
        actions={
          <>
            <Button to={paths.request()} size="lg" magnetic>Start a conversation</Button>
            <Button to={paths.contact()} size="lg" variant="secondary" magnetic>Contact Septa</Button>
          </>
        }
        art={<BlogHeroArt />}
        aside={
          <div className="relative">
            <PhotoFigure
              eager
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85"
              alt="A diverse team sharing ideas and collaborating around a table in a bright workspace"
              ratio="aspect-[4/3]"
              edge="none"
            />
            <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-xl border border-white/15 bg-brand-pearl/90 p-4 shadow-xl backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
              <p className="mb-2 font-mono text-[0.62rem] tracking-[0.18em] text-brand-mint uppercase">Explore the thinking</p>
              <p className="max-w-sm font-display text-[1.3rem] leading-snug text-white sm:text-[1.45rem]">
                Useful ideas. Clear decisions. Better technology.
              </p>
            </div>
          </div>
        }
      />

      <Section id="journal" wall="use-case" className="section">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            as="h2"
            title="Perspectives for the work ahead"
          />
          <div className="grid w-full gap-3 sm:grid-cols-[minmax(15rem,1fr)_10rem] lg:w-auto">
            <div className="w-full sm:min-w-64">
              <label htmlFor="blog-search" className="eyebrow mb-2 block">Search articles</label>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" aria-hidden />
                <input
                  id="blog-search"
                  type="search"
                  value={query}
                  onChange={(event) => update({ q: event.target.value })}
                  placeholder="Search a topic or idea"
                  className="w-full rounded-pill border border-line bg-ink-raised py-2.5 pr-4 pl-10 text-[0.92rem] text-fg placeholder:text-faint focus:border-mint/60 focus:outline-none focus:ring-2 focus:ring-mint/10"
                />
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="blog-sort" className="eyebrow mb-2 block">Sort by</label>
              <select
                id="blog-sort"
                value={sort}
                onChange={(event) => update({ sort: event.target.value === "newest" ? null : event.target.value })}
                className="w-full rounded-pill border border-line bg-ink-raised px-4 py-2.5 text-[0.88rem] text-fg"
              >
                <option value="newest">Newest</option>
                <option value="longest">Longest read</option>
                <option value="title">Title A–Z</option>
              </select>
            </div>
          </div>
        </div>

        {query && (
          <p className="-mt-3 mb-7 flex flex-wrap items-center gap-3 text-[0.85rem] text-faint">
            Showing {results.length} of {posts.length}
            <button type="button" onClick={clearFilters} className="text-mint hover:underline">Clear filters</button>
          </p>
        )}

        {featured && (
          <Reveal className="mb-9">
            <div className="mb-4 flex items-center justify-between gap-4">
            </div>
            <PostCard post={featured} variant="featured" showCategory={false} />
          </Reveal>
        )}

        {results.length ? (
          <motion.div layout={!reduce} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((post, index) => (
                <motion.div
                  key={post.slug}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, delay: Math.min(index * 0.025, 0.15) }}
                  className="h-full"
                >
                  <PostCard post={post} showCategory={false} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            icon={<SearchX className="size-5" />}
            title="No matching perspectives"
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button onClick={clearFilters} size="sm" variant="secondary">Clear filters</Button>
                <Button to={paths.contact()} size="sm">Suggest a topic</Button>
              </div>
            }
          >
            Try another search or topic. You can also tell us what you would like to read about.
          </EmptyState>
        )}

        <div className="mt-12 flex justify-end border-t border-line pt-6">
          <Link to={paths.contact()} className="inline-flex items-center gap-2 text-[0.86rem] font-medium text-mint hover:underline">
            Have a topic in mind? Tell us
            <span aria-hidden>↗</span>
          </Link>
        </div>
      </Section>
    </>
  );
}
