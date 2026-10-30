export const mission = {
  statement:
    "Make useful technology ordinary. We help organisations turn a hard operational problem into software, automation or a team that can keep improving it.",
};

export const vision = {
  statement:
    "A market where every serious organisation can build and run good technology, or work with a partner who behaves as if it will still be there in three years.",
};

export const values = [
  {
    title: "Evidence before promises",
    detail:
      "A prototype, a measurement or a written trade-off beats a confident estimate. When we do not know, we say so and find out cheaply.",
  },
  {
    title: "Built to be lived in",
    detail:
      "Software is judged years after launch, by whoever inherits it. We pick the architecture, tests and documentation with that future reader in mind.",
  },
  {
    title: "Honest about fit",
    detail:
      "Some problems should not become an AI project, some codebases should not be rewritten, and some engagements we should not take. We say which one you are in.",
  },
  {
    title: "Named owners",
    detail:
      "Named people accountable for delivery, monitoring and outcomes. That includes after handover, when the phone still gets answered.",
  },
  {
    title: "Transfer what we know",
    detail:
      "Pairing, review, documentation and runbooks are part of the work. Capability that leaves with us is a failure of the engagement.",
  },
];

export const approach = [
  {
    title: "Start from the decision",
    detail:
      "Every engagement opens with the decision the client is trying to make or the outcome they need to see. That is what sets the scope, ahead of any tool choice.",
  },
  {
    title: "Work in short, visible loops",
    detail:
      "Two-week increments, a running system from early on, and demos of real software, not status decks.",
  },
  {
    title: "Prove it before scaling it",
    detail:
      "Prototype, measure, then commit. If the evidence says stop, the engagement says stop and writes down why.",
  },
  {
    title: "Design for the next team",
    detail:
      "Typed code, tests on meaningful paths, readable infrastructure and documentation written for the person who inherits it.",
  },
  {
    title: "Instrument what we ship",
    detail:
      "Latency, errors, cost and usage are visible from the first release, so improvement is argued with data.",
  },
  {
    title: "Hand over properly",
    detail:
      "Runbooks, walkthroughs and a defined support window. The goal is your team owning the thing outright.",
  },
];

export const whySepta = [
  {
    title: "One team across the whole path",
    detail:
      "Strategy, product design, engineering, automation, observability and staffing sit in the same conversation instead of being split between vendors who blame each other.",
  },
  {
    title: "Senior and hands-on",
    detail:
      "The people who scope the work are the people who build it. No relay race from an account team to a delivery team you never met.",
  },
  {
    title: "Delivery you can inspect",
    detail:
      "Your repository, your trackers, your infrastructure accounts. Progress is software running, visible at every increment.",
  },
  {
    title: "Costs stated upfront",
    detail:
      "Inference, hosting and integration effort are modelled before commitment, so the finance team is not surprised by the architecture.",
  },
  {
    title: "Reliability as a feature",
    detail:
      "Monitoring, alerting and rollback are part of scope on everything we build, so they are never something you have to remember to buy separately.",
  },
  {
    title: "Exit planned from day one",
    detail:
      "Documentation, pairing and transition checkpoints so ownership can move to your team whenever you want it to.",
  },
];

export const techCapabilities = [
  {
    group: "Product and frontend",
    items: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Design systems", "Accessibility (WCAG-informed work)"],
  },
  {
    group: "Backend and data",
    items: ["Node.js", "Python", "PostgreSQL", "Redis", "Event queues", "REST and GraphQL APIs", "ETL and sync jobs"],
  },
  {
    group: "AI and applied ML",
    items: [
      "Large language model integration",
      "Retrieval-augmented generation",
      "Embeddings and vector search",
      "Evaluation harnesses",
      "Classical ML for prediction and anomaly detection",
    ],
  },
  {
    group: "Platform and operations",
    items: [
      "Containerised deployment",
      "Infrastructure as code",
      "OpenTelemetry instrumentation",
      "Metrics, logs and tracing",
      "Alerting and SLO practice",
    ],
  },
  {
    group: "Ways of working",
    items: ["Test coverage on critical paths", "Code review", "Trunk-based delivery", "Threat modelling", "Post-incident review"],
  },
];

export const statsPlaceholders = [
  { label: "Years delivering", value: null as string | null },
  { label: "Engineers and specialists", value: null as string | null },
  { label: "Systems in production", value: null as string | null },
  { label: "Client sectors served", value: null as string | null },
];

export const disciplines = [
  {
    title: "AI and machine learning",
    detail: "Retrieval, evaluation, model integration and the product thinking that keeps those honest.",
  },
  {
    title: "Backend and platform",
    detail: "Services, data models, queues, APIs and the operational plumbing around them.",
  },
  {
    title: "Frontend and design",
    detail: "Interfaces people can use with a keyboard, on a phone, under pressure, in poor light.",
  },
  {
    title: "Automation and integration",
    detail: "Connecting systems, approvals and reporting so manual handoffs stop being a job.",
  },
  {
    title: "Observability and reliability",
    detail: "Instrumentation, dashboards, alerting and incident practice.",
  },
  {
    title: "Delivery and analysis",
    detail: "Discovery, requirements, coordination and the hard work of landing change in a real organisation.",
  },
];

export const howWeWork = [
  {
    title: "Small teams, real authority",
    detail:
      "Delivery groups stay small enough that everyone knows the context, and they hold the authority to make engineering decisions themselves.",
  },
  {
    title: "Feedback while building",
    detail:
      "Demos every increment, written trade-offs, and a standing invitation to challenge a design before it hardens.",
  },
  {
    title: "Learning is scheduled",
    detail:
      "Time for spikes, dependency care and post-incident review is written into the plan.",
  },
  {
    title: "Clear expectations on hours",
    detail:
      "Client work has busy weeks. Sustained overtime is a planning failure, and we fix it instead of treating it as a normal cost.",
  },
];

/** Supplied by the Septa website revamp brief. Kept verbatim; see README. */
export const advantageIntro =
  "Septa combines modern engineering, product innovation, and AI-powered insights to help organizations scale faster, simplify complexity, and capture opportunities with confidence.";

export const advantagePillars = [
  {
    title: "Intelligent by Design",
    detail: "AI-driven solutions tailored to your goals, never one-size-fits-all.",
  },
  {
    title: "Built to Scale",
    detail: "Flexible products and systems designed to grow with your business.",
  },
  {
    title: "Human-Centered Technology",
    detail: "Smart automation powered by human insight for better decisions.",
  },
  {
    title: "Delivery You Can Trust",
    detail: "Agile execution with transparency, reliability, and measurable results.",
  },
  {
    title: "Proactive, End-to-End Support",
    detail: "Septa AI handles requests, resolves issues, and keeps your product running smoothly.",
  },
];

export const serviceOverview =
  "From startups to enterprises, we craft custom software solutions, provide top-tier tech talent, and upskill professionals for the future of work.";

export const servicesIntro =
  "We help businesses and individuals thrive through product development and tech talent solutions.";

/**
 * Named by Septa in the revamp brief. No logos were supplied, so these render as text
 * only, and nothing is claimed about the scope of each relationship.
 */
export const partners = [
  "Enyata",
  "Chinat Group",
  "Halogen Group",
  "MTN",
  "Preppod",
  "Atos",
  "Blusalt",
  "Toviri UK",
];
