
import { useEffect, useRef, useState } from "react";

const links = [
  { id: "why-septa", label: "Why Septa" },
  { id: "culture", label: "Our Culture" },
  { id: "open-roles", label: "Open Positions" },
  { id: "hiring-process", label: "How We Hire" },
  { id: "apply", label: "Apply Now" },
];

export default function CareersNavigation() {
  const [active, setActive] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const activeRef = useRef("");

  // Keep the page's scroll offset in step with the bar's rendered height.
  useEffect(() => {
    const nav = navRef.current;

    if (!nav) return;

    const measure = () => {
      document.documentElement.style.setProperty(
        "--careers-nav-h",
        `${nav.offsetHeight}px`
      );
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(nav);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--careers-nav-h");
    };
  }, []);

  useEffect(() => {
    const sectionIds = links.map((link) => link.id);

    const updateActiveSection = () => {
      const navHeight = navRef.current?.offsetHeight ?? 72;
      const scrollPosition = window.scrollY + 72 + navHeight + 20;

      let currentSection = "";

      for (const id of sectionIds) {
        const section = document.getElementById(id);

        if (
          section &&
          section.getBoundingClientRect().top +
            window.scrollY <= scrollPosition
        ) {
          currentSection = id;
        }
      }

      setActive(currentSection);

      // On narrow screens the links become a scrolling rail; keep the current one in view
      // when the section changes, without fighting a manual swipe.
      if (currentSection === activeRef.current) return;

      activeRef.current = currentSection;

      const list = listRef.current;
      const link = currentSection
        ? list?.querySelector<HTMLAnchorElement>(`a[href="#${currentSection}"]`)
        : null;

      if (!list || !link) return;

      const listRect = list.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();

      if (linkRect.left >= listRect.left && linkRect.right <= listRect.right) return;

      list.scrollBy({
        left:
          linkRect.left -
          listRect.left -
          (list.clientWidth - linkRect.width) / 2,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches
          ? "auto"
          : "smooth",
      });
    };

    window.addEventListener(
      "scroll",
      updateActiveSection,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateActiveSection
    );

    window.addEventListener(
      "hashchange",
      updateActiveSection
    );

    updateActiveSection();

    return () => {
      window.removeEventListener(
        "scroll",
        updateActiveSection
      );

      window.removeEventListener(
        "resize",
        updateActiveSection
      );

      window.removeEventListener(
        "hashchange",
        updateActiveSection
      );
    };
  }, []);

  const handleNavigation = (id: string) => {
    setActive(id);

    const target = document.getElementById(id);

    if (!target) return;

    const navHeight = navRef.current?.offsetHeight ?? 72;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Measured here rather than left to the browser: the browser's own jump uses a
    // position from before the stacked sections settle, which lands short.
    window.scrollTo({
      top:
        target.getBoundingClientRect().top +
        window.scrollY -
        (72 + navHeight + 16),
      behavior: reducedMotion ? "instant" : "smooth",
    });

    window.history.pushState(null, "", `#${id}`);
  };

  return (
    <nav
      ref={navRef}
      className="sc-route sc-cream"
      aria-label="Careers page navigation"
    >
      <div className="sc-wrap">
        <p className="sc-eyebrow">
          Explore Careers
        </p>

        <ol ref={listRef}>
          {links.map((link, index) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={
                  active === link.id
                    ? "location"
                    : undefined
                }
                onClick={(event) => {
                  event.preventDefault();
                  handleNavigation(link.id);
                }}
              >
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {link.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
