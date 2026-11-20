
import { useEffect, useState } from "react";
import { openings } from "../data/jobs";

const links = [
  { id: "why-septa", label: "Why Septa" },
  { id: "culture", label: "Our Culture" },
  { id: "open-roles", label: "Open Positions" },
  { id: "hiring-process", label: "How We Hire" },
  { id: "apply", label: "Apply Now" },
];

export default function CareersNavigation() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sectionIds = links.map((link) => link.id);

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + 180;

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
    };

    const updateHash = () => {
      const id = decodeURIComponent(
        window.location.hash.slice(1)
      );

      const opening = openings.find(
        (job) => job.slug === id
      );

      if (opening) {
        const container = document.getElementById(id);

        const details = container?.querySelector(
          "details.sc-job"
        );

        if (details instanceof HTMLDetailsElement) {
          details.open = true;
        }
      }

      updateActiveSection();
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
      updateHash
    );

    updateHash();

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
        updateHash
      );
    };
  }, []);

  const handleNavigation = (id: string) => {
    setActive(id);

    const target = document.getElementById(id);

    if (!target) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <nav
      className="sc-route sc-cream"
      aria-label="Careers page navigation"
    >
      <div className="sc-wrap">
        <p className="sc-eyebrow">
          Explore Careers
        </p>

        <ol>
          {links.map((link, index) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={
                  active === link.id
                    ? "location"
                    : undefined
                }
                onClick={() =>
                  handleNavigation(link.id)
                }
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
