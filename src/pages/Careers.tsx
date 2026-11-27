
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Link2 } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { CareerForm } from "../components/forms/CareerForm";
import { StackSheet } from "../components/blocks/StackSheet";
import { Button } from "../components/ui/Button";

import { careers } from "../data/content";
import { openings } from "../data/jobs";
import { OTHER_ROLE } from "../shared/schemas";
import { usePageMeta } from "../lib/usePageMeta";

import CareersNavigation from "./CareersNavigation";
import {
  CareersReveal,
  CareersMagneticButton,
} from "../components/careers/CareersAnimations";
import "./careers.css";

/* ==========================================
   WHY WORK WITH SEPTA
========================================== */

const benefits = [
  {
    title: "Solve real problems",
    description:
      "Build AI and software solutions that help businesses improve how they work.",
  },
  {
    title: "Work as a team",
    description:
      "Collaborate across engineering, design and business to develop practical solutions.",
  },
  {
    title: "Grow through ownership",
    description:
      "Develop your skills by taking responsibility for meaningful work and learning through delivery.",
  },
];

/* ==========================================
   OUR CULTURE
========================================== */

const culture = [
  {
    title: "Collaboration & Curiosity",
    description:
      "We believe the best ideas come from working together. Every perspective matters, and curiosity drives us to keep asking 'what's possible?'",
  },
  {
    title: "Creativity in Action",
    description:
      "Challenges inspire us. Whether it's AI-powered platforms, digital products, or talent solutions, we solve problems with creativity and practical innovation.",
  },
  {
    title: "Growth Mindset",
    description:
      "Learning, experimentation, and ownership are part of who we are. We empower our team to push boundaries and innovate with purpose.",
  },
  {
    title: "Integrity & Transparency",
    description:
      "We work with honesty and openness, ensuring trust at every step with clients, colleagues, and partners.",
  },
];

/* ==========================================
   HIRING PROCESS
========================================== */

const steps = [
  [
    "Application Review",
    "Our team carefully reviews your resume and portfolio to understand your skills, experience, and alignment with Septa's mission of building intelligent, practical solutions.",
  ],
  [
    "Introductory Conversation",
    "A friendly chat to discuss your background, career goals, and interest in Septa. Learn about our culture, exciting projects, and how you can grow with us.",
  ],
  [
    "Assessment & Technical Interview",
    "For technical and specialized roles, you'll take on a challenge that reflects real project scenarios, allowing us to see your problem-solving skills and expertise in action. Afterwards, you'll engage in a detailed conversation with our technical team to dive deeper into your experience, approach, and how you can contribute to impactful projects at Septa.",
  ],
  [
    "Final Interview",
    "A conversation with senior leadership to align your vision, goals, and career aspirations with Septa's mission. It's also a chance for you to ask any remaining questions.",
  ],
  [
    "Offer & Onboarding",
    "If selected, you'll receive an offer and a guided onboarding experience to help you integrate seamlessly into the team and start making an impact from day one.",
  ],
];

/* ==========================================
   ARROW COMPONENT
========================================== */

function Arrow() {
  return <ArrowRight aria-hidden="true" className="sc-arrow size-4" />;
}

/* ==========================================
   COPY ROLE LINK
========================================== */

function CopyRoleLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    const url = new URL(window.location.href);
    url.hash = slug;

    try {
      await navigator.clipboard.writeText(url.href);
    } catch {
      return;
    }

    window.history.replaceState(null, "", url.href);
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      className="sc-copy-link"
      onClick={copy}
      aria-live="polite"
    >
      {copied ? (
        <Check size={18} aria-hidden="true" />
      ) : (
        <Link2 size={18} aria-hidden="true" />
      )}
      {copied ? "Link copied" : "Copy link"}
    </button>
  );
}

/* ==========================================
   MAIN CAREERS PAGE
========================================== */

export default function Careers() {
  usePageMeta({
    title: "Careers at Septa | AI & Software Engineering Jobs",
    description: careers.intro,
    absoluteTitle: true,
  });

  const runwayRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start end", "end end"],
  });
  const copyScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.79]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -22]);
  const backdropY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 110]);
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.12]);

  const [role, setRole] = useState<string>();
  const [speculative, setSpeculative] = useState(false);

  // Select a role from its card without resetting the rest of the form.
  const selectRole = (title: string) => {
    setSpeculative(false);
    setRole(title);
  };

  // Expression of interest.
  const selectSpeculative = () => {
    setSpeculative(true);
  };

  // A shared role link (…/careers#sales-manager) opens that role on arrival.
  useEffect(() => {
    const openRoleFromHash = () => {
      const slug = window.location.hash.slice(1);
      const target = slug ? document.getElementById(slug) : null;

      if (!(target instanceof HTMLDetailsElement)) return;

      target.open = true;
      target.scrollIntoView({ behavior: "auto", block: "start" });
    };

    openRoleFromHash();
    window.addEventListener("hashchange", openRoleFromHash);

    return () => window.removeEventListener("hashchange", openRoleFromHash);
  }, []);

  // The stacked sections retract as the page settles, which can leave a deep link a screen
  // away from its target. Follow the target until it holds still, then leave scrolling alone.
  useEffect(() => {
    const slug = window.location.hash.slice(1);
    const target = slug ? document.getElementById(slug) : null;

    if (!target) return;

    const start = performance.now();
    let last = Number.NaN;
    let stable = 0;
    let timer = 0;
    let cancelled = false;

    const stop = () => {
      cancelled = true;
      window.clearTimeout(timer);

      for (const type of ["wheel", "touchstart", "keydown"] as const) {
        window.removeEventListener(type, stop);
      }

      window.removeEventListener("load", wake);
    };

    // A late font or image swap moves everything above the target, so the count restarts.
    function wake() {
      stable = 0;
    }

    const tick = () => {
      if (cancelled || window.location.hash.slice(1) !== slug) {
        return stop();
      }

      const nav = document.querySelector<HTMLElement>(".sc-route");
      const offset = 72 + (nav?.offsetHeight ?? 72) + 16;
      const delta = target.getBoundingClientRect().top - offset;

      if (Math.abs(delta) > 1) {
        window.scrollTo({
          top: window.scrollY + delta,
          behavior: "instant",
        });
      }

      const top = target.getBoundingClientRect().top + window.scrollY;

      stable = Math.abs(top - last) < 1 ? stable + 1 : 0;
      last = top;

      const ready =
        document.readyState === "complete" && document.fonts.status === "loaded";

      if ((ready && stable >= 3) || performance.now() - start > 5000) {
        return stop();
      }

      timer = window.setTimeout(tick, 100);
    };

    for (const type of ["wheel", "touchstart", "keydown"] as const) {
      window.addEventListener(type, stop, { passive: true });
    }

    window.addEventListener("load", wake);
    void document.fonts.ready.then(wake);

    tick();

    return stop;
  }, []);

  return (
    <div className="septa-careers">
      <div className="sc-layer-stage">

      {/* ======================================
          1. HERO SECTION
      ====================================== */}

      <section
        className={`sc-hero-light sc-motif sc-grid sc-hero sc-layer-hero${reduceMotion ? "" : " sc-layer-pinned"}`}
        aria-labelledby="careers-title"
      >
        <motion.div
          aria-hidden="true"
          className="sc-layer-background"
          style={{ y: backdropY, scale: backdropScale }}
        />
        <motion.div className="sc-wrap sc-layer-copy" style={{ scale: copyScale, y: copyY }}>
          <p className="sc-eyebrow">
            Careers at Septa
          </p>

          <h1 id="careers-title">
            Build Work That Matters.
            <br />
            <span>Grow With Septa.</span>
          </h1>

          <p className="sc-lead">
            At Septa, we believe that talented individuals are the driving
            force behind our success. We are a dynamic and innovative company
            that values creativity, collaboration, and continuous learning.
            Join our team and be part of a diverse community of professionals
            who are passionate about making a difference in the world.
          </p>

          <div className="sc-actions">
            <Button href="#open-roles" magnetic variant="dark-cta" className="sc-button sc-primary">
              See Open Roles
              <Arrow />
            </Button>

            <Button href="#hiring-process" magnetic variant="outline-light" className="sc-button sc-secondary">
              How We Hire
              <Arrow />
            </Button>
          </div>
        </motion.div>
      </section>
      <div ref={runwayRef} aria-hidden="true" className={reduceMotion ? "sc-runway-reduced" : "sc-layer-runway"} />

      {/* ======================================
          CAREERS NAVIGATION
      ====================================== */}

      <CareersNavigation />

      {/* ======================================
          2. WHY WORK WITH US
      ====================================== */}

      <StackSheet order={2}>
      <section
        className="sc-section sc-why-section"
        id="why-septa"
        aria-labelledby="why-septa-title"
      >
        <div className="sc-wrap">
          <p className="sc-eyebrow">
            Why Septa?
          </p>

          <h2 id="why-septa-title">
            Meaningful Work. Shared Ambition.
          </h2>

          <p className="sc-lead">
            Discover the kind of work, collaboration
            and professional development we value.
          </p>

          <CareersReveal>
            <div className="sc-feature-grid">
              {benefits.map((benefit, index) => (
                <CareersReveal
                  key={benefit.title}
                  delay={index * 0.12}
                  className="sc-feature-motion"
                >
                  <article className="sc-feature-card">
                    <span className="sc-feature-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </article>
                </CareersReveal>
              ))}
            </div>
          </CareersReveal>
        </div>
      </section>
      </StackSheet>

      {/* ======================================
          3. OUR CULTURE
      ====================================== */}

      <StackSheet order={3}>
      <section
        className="sc-section sc-dark sc-motif sc-culture-section"
        id="culture"
        aria-labelledby="careers-culture-title"
      >
        <div className="sc-wrap">
          <h2 id="careers-culture-title">
            Our Culture
          </h2>

          <p className="sc-lead">
            At Septa, we don't just build solutions, we create an environment
            where people and ideas thrive.
          </p>

          <CareersReveal>
          <div className="sc-culture-grid">
            {culture.map((item) => (
              <article
                className="sc-culture-card"
                key={item.title}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          </CareersReveal>
        </div>
      </section>
      </StackSheet>

      {/* ======================================
          4. OPEN POSITIONS
      ====================================== */}

      <StackSheet order={4}>
      <section
        className="sc-section sc-cream sc-openings-section"
        id="open-roles"
        aria-labelledby="careers-roles-title"
      >
        <div className="sc-wrap">
          <p className="sc-eyebrow">
            Career Opportunities
          </p>

          <h2 id="careers-roles-title">
            {openings.length === 0
              ? "No Open Roles at the Moment."
              : "Open Positions"}
          </h2>

          {openings.length === 0 ? (
            <p className="sc-lead">
              We open new roles from time to time and
              post them here first. Until then, we
              would still like to meet you.
            </p>
          ) : (
            <CareersReveal>
            <ul className="sc-roles">
              {openings.map((opening) => (
                <li key={opening.slug}>
                  <details className="sc-job" id={opening.slug}>
                    <summary className="sc-role">
                      <h3>{opening.title}</h3>

                      <span className="sc-role-toggle">
                        View requirements
                        <ArrowRight aria-hidden="true" className="sc-arrow size-4" />
                      </span>
                    </summary>

                    <div className="sc-job-detail">
                      <div className="sc-job-groups">
                        {opening.groups.map((group) => (
                          <div
                            className="sc-job-group"
                            key={group.heading}
                          >
                            <h4>{group.heading}</h4>

                            <ul className="sc-req">
                              {group.items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="sc-job-actions">
                        <CareersMagneticButton
                          className="sc-button sc-primary"
                          href="#apply"
                          onClick={() => selectRole(opening.title)}
                        >
                          Apply for this role
                          <Arrow />
                        </CareersMagneticButton>

                        <CopyRoleLink slug={opening.slug} />
                      </div>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
            </CareersReveal>
          )}

          {/* SEND US YOUR CV */}

          <CareersReveal>
          <div className="sc-speculative">
            <h3>
              Send Us Your CV.
            </h3>

            <p>
              Introduce yourself, tell us the kind of
              work you would like to do, and share
              your experience. We read every
              application and will reach out when a
              role matches your skills.
            </p>

            <CareersMagneticButton
              className="sc-button sc-primary"
              href="#apply"
              onClick={selectSpeculative}
            >
              Send Your CV
              <Arrow />
            </CareersMagneticButton>
          </div>
          </CareersReveal>
        </div>
      </section>
      </StackSheet>

      {/* ======================================
          5. HIRING TIMELINE
      ====================================== */}

      <StackSheet order={5}>
      <section
        className="sc-section sc-hiring-section"
        id="hiring-process"
        aria-labelledby="careers-process-title"
      >
        <div className="sc-wrap">
          <p className="sc-eyebrow">
            Our Hiring Process
          </p>

          <h2 id="careers-process-title">
            Your Journey to Septa.
          </h2>

          <p className="sc-lead">
            At Septa, we believe in a transparent and engaging hiring journey.
            Here's what to expect when you apply:
          </p>

          <CareersReveal>
          <ol className="sc-timeline">
            {steps.map(
              ([title, description], index) => (
                <li key={title}>
                  <span
                    className="sc-node"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>{title}</h3>
                  <p>{description}</p>
                </li>
              )
            )}
          </ol>
          </CareersReveal>

          {/* HIRING CTA */}

          <CareersReveal>
          <div className="sc-hiring-cta">
            <h3>
              Ready to Take the Next Step?
            </h3>

            <p>
              Send us your CV and we will reach out
              when a role matches your experience.
            </p>

            <CareersMagneticButton
              className="sc-button sc-primary"
              href="#apply"
              onClick={selectSpeculative}
            >
              Send Your CV
              <Arrow />
            </CareersMagneticButton>
          </div>
          </CareersReveal>
        </div>
      </section>
      </StackSheet>

      </div>

      {/* ======================================
          6. APPLICATION SECTION
      ====================================== */}

      <section
        className="sc-section sc-dark sc-application-section"
        id="apply"
        aria-labelledby="careers-apply-title"
      >
        <div className="sc-wrap sc-apply">
          <div>
            <p className="sc-eyebrow">
              Join Septa
            </p>

            <h2 id="careers-apply-title">
              {speculative
                ? "Introduce Yourself."
                : "Your Next Chapter Starts Here."}
            </h2>

            <p className="sc-lead">
              {speculative
                ? "Share your CV and tell us how you would like to contribute."
                : "Complete the application form to express your interest in joining our team."}
            </p>
          </div>

          <CareerForm
            preselectRole={speculative ? OTHER_ROLE : role}
            source={
              speculative
                ? "speculative"
                : "careers-page"
            }
          />
        </div>
      </section>


      {/* Shared footer remains in the main layout */}

    </div>
  );
}
