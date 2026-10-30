import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import { ArrowRight, CalendarDays, Clock, PenLine } from "lucide-react";
import { CtaBand } from "../components/blocks/PageHero";
import { DevNote } from "../components/blocks/LaunchNote";
import { PostCard } from "../components/blocks/cards";
import { Button } from "../components/ui/Button";
import {
  Callout,
  Card,
  EmptyState,
  Pill,
  Reveal,
  Section,
  SectionHeading,
} from "../components/ui/primitives";
import type { Block, Post } from "../data/posts";
import { postBySlug, posts } from "../data/posts";
import { formatDate, readingTime } from "../lib/cn";
import { paths } from "../lib/paths";
import { usePageMeta } from "../lib/usePageMeta";

const postText = (p: Post) =>
  p.body.map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : "")).join(" ");

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-12 mb-4 scroll-mt-28 text-[clamp(1.4rem,3vw,1.85rem)]" id={slug(block.text)}>
          {block.text}
        </h2>
      );
    case "h3":
      return <h3 className="mt-8 mb-3 text-[1.2rem]">{block.text}</h3>;
    case "ul":
      return (
        <ul className="my-5 space-y-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[1rem] leading-relaxed text-muted">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-mint/60" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="my-8 border-l-2 border-mint/60 bg-surface px-6 py-5">
          <p className="font-display text-[1.12rem] leading-relaxed text-fg">{block.text}</p>
        </blockquote>
      );
    case "code":
      return (
        <pre className="my-7 overflow-x-auto rounded-card border border-line bg-ink-raised p-5 font-mono text-[0.82rem] leading-relaxed text-muted">
          <code>{block.text}</code>
        </pre>
      );
    default:
      return <p className="prose-body my-5 text-[1.02rem]">{block.text}</p>;
  }
}

function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function Contents({ blocks }: { blocks: Block[] }) {
  const heads = blocks.filter((b) => b.type === "h2");
  if (heads.length < 2) return null;
  return (
    <nav aria-label="Article contents" className="mb-10 rounded-card border border-line bg-surface p-5">
      <p className="eyebrow mb-3">In this article</p>
      <ol className="space-y-2">
        {heads.map((h, i) =>
          h.type === "h2" ? (
            <li key={h.text}>
              <a
                href={`#${slug(h.text)}`}
                className="group flex gap-3 text-[0.88rem] text-muted hover:text-mint"
              >
                <span className="font-mono text-[0.72rem] text-faint group-hover:text-mint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {h.text}
              </a>
            </li>
          ) : null,
        )}
      </ol>
    </nav>
  );
}

/** Scroll progress for long reads; disabled when reduced motion is preferred. */
function Progress({ slug: _slug }: { slug: string }) {
  const reduce = useReducedMotion();
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      setPct(total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduce, _slug]);
  if (reduce) return null;
  return (
    <div aria-hidden className="fixed top-0 left-0 z-40 h-[2px] w-full bg-transparent">
      <div className="h-full bg-mint/70 transition-[width] duration-150" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function BlogPost() {
  const { slug = "" } = useParams<{ slug: string }>();
  const post = postBySlug(slug);

  usePageMeta({
    title: post ? post.title : "Article not found",
    description: post?.excerpt,
    /** Placeholder editorial content should not be indexed as company writing. */
    noindex: !post || post.status === "sample",
  });

  if (!post) {
    return (
      <div className="wrap section">
        <EmptyState
          heading="h1"
          icon={<PenLine className="size-5" />}
          title="That article is not here"
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button to={paths.blog()} size="sm">
                Back to the blog
              </Button>
              <Button to={paths.contact()} size="sm" variant="secondary">
                Tell us what you were after
              </Button>
            </div>
          }
        >
          The link may be out of date, or the piece was a draft. Everything currently published is on
          the blog index.
        </EmptyState>
        <div className="mx-auto mt-10 grid max-w-3xl gap-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to={paths.post(p.slug)}
              className="card card-hover flex items-center justify-between gap-4 p-4"
            >
              <span className="text-[0.92rem] text-fg">{p.title}</span>
              <ArrowRight className="size-4 shrink-0 text-faint" aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const related = posts
    .filter(
      (p) =>
        p.slug !== post.slug &&
        (p.category === post.category || p.tags.some((t) => post.tags.includes(t))),
    )
    .slice(0, 3);

  const minutes = readingTime(postText(post));

  return (
    <>
      <Progress slug={post.slug} />

      <article>
        <header className="relative overflow-hidden border-b border-line-soft">
          <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-40 mask-fade" />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-28 -right-20 size-[380px] rounded-full bg-mint/[0.07] blur-[90px]"
          />
          <div className="wrap relative py-14 sm:py-16">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1 font-mono text-[0.72rem] text-faint">
                <li>
                  <Link to={paths.home()} className="hover:text-mint">
                    Home
                  </Link>
                </li>
                <li aria-hidden> / </li>
                <li>
                  <Link to={paths.blog()} className="hover:text-mint">
                    Blog
                  </Link>
                </li>
                <li aria-hidden> / </li>
                <li>
                  <Link to={paths.blog()} className="hover:text-mint">
                    {post.category}
                  </Link>
                </li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="mint">{post.category}</Pill>
              <span className="inline-flex items-center gap-1.5 font-mono text-[0.74rem] text-faint">
                <Clock className="size-3.5" aria-hidden />
                {minutes} min read
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[0.74rem] text-faint">
                <CalendarDays className="size-3.5" aria-hidden />
                {formatDate(post.date)}
              </span>
              <Pill tone="amber" className="font-mono uppercase">
                Sample content
              </Pill>
            </div>

            <h1 className="mt-6 max-w-3xl text-[clamp(2rem,4.8vw,3.2rem)]">{post.title}</h1>
            <p className="prose-body mt-5 max-w-2xl text-[1.08rem]">{post.excerpt}</p>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.85rem] text-muted">
              <span>
                By <span className="text-fg">{post.author}</span>
              </span>
              <span aria-hidden className="text-line">
                |
              </span>
              <span className="flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    to={`${paths.blog()}?tag=${encodeURIComponent(t)}`}
                    className="rounded-pill border border-line px-2.5 py-0.5 font-mono text-[0.72rem] text-faint hover:border-mint/45 hover:text-mint"
                  >
                    #{t}
                  </Link>
                ))}
              </span>
            </div>
          </div>
        </header>

        <Section className="section">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
            <div>
              <Contents blocks={post.body} />

              <Callout kind="warn" title="Placeholder editorial" className="mb-10">
                <p>
                  This article was written to demonstrate the blog template. Authorship and
                  publication date are not real.
                  <DevNote>
                    {" "}Approved articles replace it in{" "}
                    <code className="font-mono text-[0.8rem]">src/data/posts.ts</code>.
                  </DevNote>
                </p>
              </Callout>

              <div className="max-w-[68ch]">
                {post.body.map((b, i) => (
                  <BlockView key={`${b.type}-${i}`} block={b} />
                ))}
              </div>

              <div className="mt-12 border-t border-line pt-8">
                <p className="eyebrow mb-4">Written by</p>
                <Card className="flex items-start gap-4 p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-mint/30 bg-mint/[0.07] font-display text-[1rem] text-mint">
                    {post.author.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-[1rem] text-fg">{post.author}</p>
                    <p className="mt-1.5 text-[0.88rem] leading-relaxed text-muted">
                      Placeholder author profile. Replace with real bylines, roles and short bios when
                      Septa confirms who publishes under the company name.
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <Card className="border-mint/25 bg-surface p-5">
                <p className="eyebrow mb-3">Working on this yourself?</p>
                <p className="text-[0.88rem] leading-relaxed text-muted">
                  Send the situation. If this article is relevant to you, the conversation is
                  usually short.
                </p>
                <Button to={paths.request()} size="sm" className="mt-4">
                  Request a Service
                </Button>
              </Card>

              <Card className="p-5">
                <p className="eyebrow mb-4">More in {post.category}</p>
                <ul className="space-y-2.5">
                  {posts
                    .filter((p) => p.slug !== post.slug && p.category === post.category)
                    .slice(0, 4)
                    .map((p) => (
                      <li key={p.slug}>
                        <Link
                          to={paths.post(p.slug)}
                          className="group flex items-start justify-between gap-3 text-[0.86rem] text-muted hover:text-fg"
                        >
                          <span>{p.title}</span>
                          <ArrowRight
                            className="mt-0.5 size-3.5 shrink-0 text-faint group-hover:text-mint"
                            aria-hidden
                          />
                        </Link>
                      </li>
                    ))}
                </ul>
              </Card>

              <Card className="p-5">
                <p className="eyebrow mb-3">Article facts</p>
                <dl className="space-y-2.5 text-[0.82rem]">
                  <div className="flex justify-between gap-3">
                    <dt className="text-faint">Read time</dt>
                    <dd className="font-mono text-muted">{minutes} min</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-faint">Sections</dt>
                    <dd className="font-mono text-muted">
                      {post.body.filter((b) => b.type === "h2").length}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-faint">Tags</dt>
                    <dd className="font-mono text-muted">{post.tags.length}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-faint">Status</dt>
                    <dd className="font-mono text-amber">{post.status}</dd>
                  </div>
                </dl>
              </Card>
            </aside>
          </div>
        </Section>
      </article>

      {related.length ? (
        <Section tone="raised" className="section border-y border-line-soft">
          <SectionHeading
            eyebrow="Related"
            title="Continue reading"
            action={
              <Button to={paths.blog()} variant="ghost" size="sm">
                All articles
              </Button>
            }
            className="mb-9"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05} className="h-full">
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand
        title="Put this into practice"
        lead="Describe what you are dealing with and we will tell you whether the thinking here transfers to your context."
        secondary={{ label: "Read more writing", to: paths.blog() }}
      />
    </>
  );
}
