import type { ServiceContent } from "./services";

export type ProductContent = ServiceContent & {
  /** The service page this product-development track maps to. */
  serviceSlug?: string;
  /** Extra framing for how the product track differs from the service framing. */
  framing: string;
};

export const products: ProductContent[] = [
  {
    slug: "ai",
    name: "AI Product Development",
    icon: "ai",
    serviceSlug: "ai-product-development",
    navBlurb: "From ambiguous idea to an AI feature you can measure and defend.",
    heroTitle: "Build the AI product, properly",
    lead: "The product-development track is where an AI idea becomes software: a scoped feature, an honest evaluation baseline, an architecture your team can operate, and a release that can be rolled back. It is the build half of the AI Product Development service.",
    framing:
      "The service page explains what we offer and how we think. This page walks through what the build actually involves, step by step.",
    problems: [
      "An idea that sounds obvious but has no measurable success criterion yet.",
      "A prototype that works on five examples and collapses on five hundred.",
      "Latency and cost budgets nobody wrote down before the build started.",
      "Evaluation done by reading outputs until something feels right.",
      "A feature that cannot be switched off cleanly when the model changes.",
    ],
    capabilities: [
      {
        group: "Shape the product",
        items: [
          {
            title: "Discovery and framing",
            detail:
              "Name the decision the feature supports, the cost of being wrong, and the human step that must stay human.",
          },
          {
            title: "Product strategy",
            detail:
              "Position the feature in the product: who sees it first, what it replaces, what it must integrate with.",
          },
          {
            title: "Prototype and validation",
            detail:
              "A thin vertical slice against real data, scored against a golden set before commitment.",
          },
        ],
      },
      {
        group: "Engineer it",
        items: [
          {
            title: "Architecture",
            detail:
              "Retrieval design, model routing, caching, fallbacks, queue boundaries and a schema that keeps prompts out of your codebase.",
          },
          {
            title: "Development",
            detail:
              "Typed, reviewed, tested delivery in two-week increments behind feature flags.",
          },
          {
            title: "Data and retrieval",
            detail:
              "Ingestion, chunking, embeddings, hybrid search and freshness policy tuned to how the content actually changes.",
          },
          {
            title: "Testing and evaluation",
            detail:
              "Unit and contract tests plus an evaluation suite: accuracy, refusal behaviour, latency at p95, and cost per useful answer.",
          },
        ],
      },
      {
        group: "Release and run it",
        items: [
          {
            title: "Deployment",
            detail: "Staged rollout with kill switches, versioned prompts and repeatable infrastructure.",
          },
          {
            title: "Ongoing evaluation",
            detail:
              "Sampled human review, drift checks, spend reporting and a queue of improvement candidates with evidence attached.",
          },
        ],
      },
    ],
    benefits: [
      {
        title: "Decisions before code",
        detail: "Success criteria and guardrails agreed while they are still cheap to change.",
      },
      {
        title: "Quality you can point at",
        detail: "The eval set is the argument when somebody wants to change a model or a prompt.",
      },
      {
        title: "Operable by your team",
        detail: "Instrumentation, runbook and documentation ship with the feature, not after it.",
      },
      {
        title: "Reversible",
        detail: "Flags and versioning mean a bad release is an operational event, not a project crisis.",
      },
    ],
    useCases: [
      { title: "Greenfield AI feature", detail: "A first generative capability inside an existing product." },
      { title: "Rescue a stalled pilot", detail: "A proof of concept that never survived handover." },
      { title: "Internal assistant", detail: "Grounded answers over your own documents and systems." },
      { title: "Prediction in a workflow", detail: "Ranking, scoring or anomaly detection inside a live process." },
    ],
    process: [
      { title: "Discovery", detail: "Decision framing, constraints, data audit.", note: "Week 1" },
      { title: "Product strategy", detail: "Scope, success metrics, rollout thesis.", note: "Signed off once" },
      { title: "Prototype", detail: "Thin slice plus baseline eval scores.", note: "1–3 weeks" },
      { title: "Architecture", detail: "Review of retrieval, models, safety, cost.", note: "With your engineers" },
      { title: "Build & test", detail: "Increments behind flags, regression suite growing.", note: "Two-week loops" },
      { title: "Deploy & evaluate", detail: "Staged release, monitoring, improvement cadence.", note: "Ongoing" },
    ],
    deliverables: [
      "Product brief with success metrics",
      "Prototype and evaluation baseline",
      "Architecture documentation",
      "Production feature with test and eval suites",
      "Monitoring, cost reporting and runbook",
    ],
    faq: [
      {
        q: "What do you need from us to start?",
        a: "Access to the data or systems involved, one person who owns the decision the feature supports, and a sandbox for the first prototype.",
      },
      {
        q: "Do you work inside our codebase?",
        a: "Usually yes — in your repositories, your review process and your deployment pipeline, so the work is yours from day one.",
      },
      {
        q: "What if the prototype says no?",
        a: "That is a valuable outcome and we will say so. Several engagements should end at the prototype stage with a written reason and the next-best option.",
      },
    ],
    visual: "ai",
    related: [
      { label: "AI Product Development service", to: "/services/ai-product-development" },
      { label: "Traditional Product Development", to: "/product-development/traditional" },
      { label: "Case studies", to: "/case-studies" },
    ],
    unconfirmed: [
      "Named model providers or platform partnerships",
      "Standard fixed-price package for a prototype phase",
    ],
  },
  {
    slug: "traditional",
    name: "Traditional Product Development",
    icon: "product",
    serviceSlug: undefined,
    navBlurb: "Web and software products engineered to be maintained by whoever comes next.",
    heroTitle: "Software built to be lived in, not just launched",
    lead: "Dashboards, platforms, marketplaces, portals, APIs, mobile backends — conventional product work, done with the discipline that keeps a codebase cheap to change two years after launch: clear architecture, tests that catch real regressions, sensible data modelling and honest documentation.",
    framing:
      "This is the non-generative counterpart to the AI product track: the same engineering discipline applied to ordinary, demanding software.",
    problems: [
      "A launch that promised speed and delivered a codebase nobody will touch.",
      "Requirements that lived in a chat thread and were quietly dropped.",
      "A data model that cannot answer the questions the business now asks.",
      "Third-party integrations with no retries, no idempotency and no observability.",
      "Technical debt priced into every future estimate without anyone naming it.",
    ],
    capabilities: [
      {
        group: "Define",
        items: [
          {
            title: "Product discovery",
            detail: "Who uses it, for what job, and how we will know the release worked.",
          },
          {
            title: "Requirements gathering",
            detail: "Flows, edge cases, permissions, non-functional limits — written down and agreed.",
          },
          {
            title: "UI/UX design",
            detail: "Accessible interface work: patterns, states, empty and error paths, and prototypes that carry into build.",
          },
        ],
      },
      {
        group: "Build",
        items: [
          {
            title: "Software architecture",
            detail: "Boundaries, service or module split, auth model and deployment shape chosen for your team size.",
          },
          {
            title: "Frontend development",
            detail: "Responsive, accessible React and TypeScript with real loading, empty and error states.",
          },
          {
            title: "Backend development",
            detail: "Services, queues, jobs, caching, background workers and the failure handling around them.",
          },
          {
            title: "Database design",
            detail: "Schema, constraints, indexes and migration strategy that can evolve without a rewrite.",
          },
          {
            title: "API development",
            detail: "Versioned, documented interfaces with authentication, rate policy and contract tests.",
          },
          {
            title: "Integrations",
            detail: "Payments, identity providers, CRM, ERP, email, storage and messaging wired with retries and reconciliation.",
          },
        ],
      },
      {
        group: "Ship and sustain",
        items: [
          {
            title: "Testing and quality assurance",
            detail: "Unit, integration and end-to-end coverage on the paths that matter, plus manual exploratory passes before release.",
          },
          {
            title: "Deployment",
            detail: "Repeatable pipelines, environment parity, migrations under control and a rollback that has been practised.",
          },
          {
            title: "Maintenance and iteration",
            detail: "Dependency care, monitoring, small improvements, and a backlog that stays honest about debt.",
          },
        ],
      },
    ],
    benefits: [
      {
        title: "Cheap to change",
        detail: "Structure and tests are chosen so the next team can move quickly without fear.",
      },
      {
        title: "Predictable delivery",
        detail: "Two-week increments with visible progress and a definition of done agreed in advance.",
      },
      {
        title: "Accessible by default",
        detail: "Keyboard paths, contrast, focus order and screen-reader labels handled during build, not as an audit afterwards.",
      },
      {
        title: "Visible under load",
        detail: "Instrumented from the start, so the first incident is a fixable one.",
      },
    ],
    useCases: [
      { title: "Customer platform", detail: "Portals, marketplaces and account experiences with real permission models." },
      { title: "Internal operations tool", detail: "The admin system that replaces the shared spreadsheet." },
      { title: "Regulated workflows", detail: "Approval chains, audit trails and reporting where records must hold up." },
      { title: "API product", detail: "Developer-facing interfaces with documentation, versioning and usage limits." },
    ],
    process: [
      { title: "Discovery", detail: "Users, jobs, constraints and success measures.", note: "Output: brief" },
      { title: "Requirements", detail: "Flows, edge cases and non-functional limits written down.", note: "Agreed, not assumed" },
      { title: "Design", detail: "Interface patterns and states prototyped with real content.", note: "Accessible from here" },
      { title: "Architecture", detail: "Data model, boundaries and deployment shape reviewed.", note: "Trade-offs documented" },
      { title: "Build & test", detail: "Incremental delivery behind flags with reviews and CI.", note: "Two-week loops" },
      { title: "Launch", detail: "Staged release, monitoring, hypercare period.", note: "Rollback practised" },
      { title: "Maintain", detail: "Iteration, dependency care, debt review.", note: "Optional retainer" },
    ],
    deliverables: [
      "Product brief and requirements document",
      "Design system or component set for the product",
      "Architecture and data-model documentation",
      "Working application with automated tests",
      "Deployment pipeline and environment configuration",
      "Launch checklist, monitoring and handover documentation",
    ],
    faq: [
      {
        q: "How do you keep scope from drifting?",
        a: "A written requirements baseline, increments with a definition of done, and a visible change list so every addition has a stated cost in time or displacement.",
      },
      {
        q: "Who owns the code afterwards?",
        a: "You do — repository, pipeline, infrastructure accounts and documentation. Our aim is that your team can extend it without us.",
      },
      {
        q: "Can you take over an existing codebase?",
        a: "Yes. Work starts with an audit: what is there, what is load-bearing, what is risky, and what the cheapest safe next step is.",
      },
      {
        q: "Do you build mobile apps?",
        a: "Web-first delivery is the core of this track. Native mobile capacity is confirmed per enquiry rather than assumed from this page.",
      },
    ],
    related: [
      { label: "AI Product Development", to: "/product-development/ai" },
      { label: "Digital Transformation", to: "/services/digital-transformation" },
      { label: "Workflow Automation", to: "/services/workflow-automation" },
    ],
    unconfirmed: [
      "Native mobile (iOS/Android) as a standing capability",
      "Specific frameworks Septa will commit to in writing",
      "Post-launch maintenance retainer terms",
    ],
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
