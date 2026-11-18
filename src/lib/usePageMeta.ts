import { useEffect } from "react";
import { site } from "./site";

type PageMeta = {
  title: string;
  description?: string;
  noindex?: boolean;
};

function upsert(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

/** Page-level title, description, canonical and Open Graph tags. */
export function usePageMeta({ title, description, noindex }: PageMeta) {
  useEffect(() => {
    const brandless = title === site.name;
    const full = brandless ? `${site.name} | ${site.tagline}` : `${title} | ${site.name}`;
    const desc = description ?? site.description;

    document.title = full;
    upsert("name", "description", desc);
    upsert("property", "og:title", full);
    upsert("property", "og:description", desc);
    upsert("property", "og:type", "website");
    upsert("name", "twitter:title", full);
    upsert("name", "twitter:description", desc);
    upsert("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (site.url) {
      const path = window.location.pathname;
      const href = site.url.replace(/\/$/, "") + (path === "/" ? "/" : path);
      upsert("property", "og:url", href);
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = href;
    } else if (canonical) {
      canonical.remove();
    }
  }, [title, description, noindex]);
}
