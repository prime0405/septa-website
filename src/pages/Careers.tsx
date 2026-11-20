
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

import { CareerForm } from "../components/forms/CareerForm";
import { IntegrationNotice } from "../components/blocks/LaunchNote";
import { MarkerList } from "../components/ui/primitives";
import { StackSheet } from "../components/blocks/StackSheet";
import { Button } from "../components/ui/Button";

import { careers } from "../data/content";
import { openings } from "../data/jobs";
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
   COMPANY CULTURE
========================================== */

const culture = [
  {
    title: "Collaboration",
    description:
      "We bring different perspectives together to solve complex challenges.",
  },
  {
    title: "Curiosity",
    description:
      "We ask questions, explore technologies and continuously improve our approach.",
  },
  {
    title: "Transparency",
    description:
      "We communicate clearly about decisions, progress and challenges.",
  },
];

/* ==========================================
   SCRIBE VALUES
========================================== */

const values = [
  [
    "S",
    "Simplicity",
    "Make complex ideas easier to understand and use.",
  ],
  [
    "C",
    "Customer Collaboration",
    "Listen to customers and build around real needs.",
  ],
  [
    "R",
    "Relevance",
    "Prioritize work that delivers meaningful results.",
  ],
  [
    "I",
    "Intelligent Systems",
    "Use technology to improve everyday processes.",
  ],
  [
    "B",
    "Bold",
    "Explore ambitious ideas and test practical solutions.",
  ],
  [
    "E",
    "Excellence",
    "Pay attention to quality and follow through.",
  ],
];

/* ==========================================
   HIRING PROCESS
========================================== */

const steps = [
  [
    "Application Review",
    "We read every application.",
  ],
  [
    "Introductory Conversation",
    "30 minutes with the hiring lead.",
  ],
  [
    "Assessment & Technical Interview",
    "A real problem, discussed live.",
  ],
  [
    "Final Interview",
    "Meet the people you'd work with.",
  ],
  [
    "Offer & Onboarding",
    "Written decision, then a structured first week.",
  ],
];

/* ==========================================
   ARROW COMPONENT
========================================== */

function Arrow() {
  return (
    <span className="sc-arrow" aria-hidden="true">
      →
    </span>
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

  // Select a job without resetting other form fields.
  const selectRole = (title: string) => {
    setSpeculative(false);
    setRole(title);
  };

  // Expression of interest.
  const selectSpeculative = () => {
    setRole("Something else");
    setSpeculative(true);
  };

  return (
    <div className="septa-careers">
      <div className="sc-layer-stage">

      {/* ======================================
          1. HERO SECTION
      ====================================== */}

      <section
        className={`sc-dark sc-motif sc-grid sc-hero sc-layer-hero${reduceMotion ? "" : " sc-layer-pinned"}`}
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
            Join Septa in building intelligent software,
            AI-powered solutions and digital products
            that help businesses solve meaningful challenges.
          </p>

          <div className="sc-actions">
            <Button href="#open-roles" magnetic variant="dark-cta" className="sc-button sc-primary">
              Explore Opportunities
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
          <p className="sc-eyebrow">
            Our Culture
          </p>

          <h2 id="careers-culture-title">
            Great Work Starts With How We Work Together.
          </h2>

          <p className="sc-lead">
            Collaboration, curiosity and transparency
            shape how we approach challenges and
            build solutions.
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

          {/* SCRIBE VALUES */}

          <div className="sc-values-block">
            <p className="sc-eyebrow">
              Our Core Values
            </p>

            <h2>Driven by SCRIBE.</h2>

            <p className="sc-lead">
              Six principles that guide our decisions,
              relationships and the solutions we build.
            </p>

            <CareersReveal>
          <ul className="sc-values">
              {values.map(
                ([letter, title, description]) => (
                  <li key={letter}>
                    <span aria-hidden="true">
                      {letter}
                    </span>

                    <h3>{title}</h3>
                    <p>{description}</p>
                  </li>
                )
              )}
            </ul>
          </CareersReveal>
          </div>
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
            Find Your Place at Septa.
          </h2>

          <p className="sc-lead">
            Explore our current opportunities,
            review the requirements and apply
            for a position that matches your
            experience and interests.
          </p>

          <div className="sc-roles-count">
            {openings.length} Open Positions
          </div>

          <CareersReveal>
          <ul className="sc-roles">
            {openings.map((opening) => {
              const requirementCount =
                opening.groups.reduce(
                  (total, group) =>
                    total + group.items.length,
                  0
                );

              return (
                <li
                  key={opening.slug}
                  id={opening.slug}
                >
                  <details className="sc-job">
                    <summary className="sc-role">
                      <div>
                        <h3>{opening.title}</h3>

                        <p className="sc-role-description">
                          {opening.lead}
                        </p>
                      </div>

                      <span className="sc-tags">
                        <span>
                          {requirementCount} requirements
                        </span>
                      </span>

                      <Arrow />
                    </summary>

                    <div className="sc-job-detail">
                      {opening.groups.map((group) => (
                        <div key={group.heading}>
                          <h4>{group.heading}</h4>

                          <MarkerList
                            items={group.items}
                          />
                        </div>
                      ))}

                      <CareersMagneticButton
                        className="sc-button sc-primary"
                        href="#apply"
                        onClick={() =>
                          selectRole(opening.title)
                        }
                      >
                        Apply for {opening.title}
                        <Arrow />
                      </CareersMagneticButton>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
          </CareersReveal>

          {/* EXPRESSION OF INTEREST */}

          <CareersReveal>
          <div className="sc-speculative">
            <h3>
              Nothing Fits Yet? Send Us Your CV.
            </h3>

            <p>
              Don't see a suitable opportunity?
              Introduce yourself and share your
              experience for future consideration.
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
            We believe the hiring process should
            be clear, structured and focused on
            finding the right fit.
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
              Explore our current opportunities
              and find a role that matches your skills.
            </p>

            <CareersMagneticButton
              className="sc-button sc-primary"
              href="#open-roles"
              onClick={selectSpeculative}
            >
              Explore Opportunities
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

            {role && !speculative && (
              <p className="sc-selected-role">
                Selected position:{" "}
                <strong>{role}</strong>
              </p>
            )}

            <div className="mt-6">
              <IntegrationNotice />
            </div>
          </div>

          <CareerForm
            preselectRole={role}
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
