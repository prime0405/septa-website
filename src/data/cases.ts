export type CaseResult = { label: string; value: string; verified: false; note: string };

export type CaseStudy = {
  slug: string;
  title: string;
  /** Sample scenario descriptor — never a real client name. */
  clientDescriptor: string;
  category: string;
  year: string;
  summary: string;
  problem: string;
  solutionOverview: string;
  stack: string[];
  services: string[];
  background: string;
  challenge: string;
  objectives: string[];
  solution: { title: string; detail: string }[];
  implementation: { title: string; detail: string }[];
  results: CaseResult[];
  lessons: string[];
  relatedSlugs: string[];
};

/**
 * Every case study here is an illustrative sample written to exercise the page
 * template. Replace with real, client-approved studies before launch — the UI
 * labels these explicitly so they can never read as Septa track record.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "claims-triage-assistant",
    title: "Claims triage assistant for a mid-sized insurer",
    clientDescriptor: "Sample scenario · regional general insurer",
    category: "AI Product",
    year: "Sample",
    summary:
      "Adjusters were spending the first forty minutes of every claim reading attachments. The assistant was built to take that under five, with every field citing the page it came from and the adjuster still making the call.",
    problem:
      "New claims arrived as a PDF bundle: forms, photos, third-party estimates. Adjusters had to read the whole thing before they could even say how severe a claim was, so the queue grew faster than the team.",
    solutionOverview:
      "A retrieval-augmented triage screen that summarises each claim against the insurer's own category definitions, quotes the source page for every field it extracts, and routes uncertain cases to a senior review queue.",
    stack: ["TypeScript", "React", "Node.js", "PostgreSQL", "pgvector", "LLM API", "OpenTelemetry", "Grafana"],
    services: ["ai-product-development", "observability-monitoring"],
    background:
      "The insurer ran a documented claims process with clear severity categories, but the classification step itself was manual and inconsistent between teams. Two earlier pilots had stalled after stakeholders could not tell whether the outputs were trustworthy.",
    challenge:
      "The hard part was accountability rather than extraction accuracy. Any summary that influenced a reserve decision had to point at the document and the page it came from, and a wrong answer had to be catchable before it reached a claim file.",
    objectives: [
      "Cut time-to-classify for a new claim materially without adding headcount",
      "Show the source evidence behind every extracted field",
      "Keep a senior adjuster in the loop for low-confidence cases",
      "Leave behind an evaluation set the internal team can extend",
    ],
    solution: [
      {
        title: "Extraction with sources",
        detail:
          "Documents were parsed once into a versioned store. Retrieval combined keyword and vector search over the insurer's own category definitions, and structured outputs were validated against a schema before any field was shown.",
      },
      {
        title: "Evidence in the interface",
        detail:
          "Each extracted value carried a citation link that opened the source page at the highlighted passage. An adjuster could correct a value in one action, and that wrote to a review queue instead of quietly changing the record.",
      },
      {
        title: "Confidence routing",
        detail:
          "Field-level confidence and disagreement between retrieval paths decided routing. Low-confidence claims went to senior review; high-confidence ones still logged the trace for sampling.",
      },
      {
        title: "Evaluation harness",
        detail:
          "A golden set of 180 labelled historical claims, picked with the claims team, was scored on every prompt or model change. Regression reports went into review with each run.",
      },
    ],
    implementation: [
      {
        title: "Week 1–2 · Discovery",
        detail:
          "Shadowed three adjusters, traced fourteen real claims end to end, agreed the accuracy bar and the escalation rule with the claims lead.",
      },
      {
        title: "Week 3–5 · Prototype",
        detail:
          "A thin slice over a sample document set, scored against a first golden set. It read structured forms well and photo evidence badly, so version one left out any field derived from a photograph.",
      },
      {
        title: "Week 6–12 · Build",
        detail:
          "Pipeline, review UI and evaluation suite built in the client's repository behind a feature flag, with weekly demo to the claims operations group.",
      },
      {
        title: "Week 13–16 · Parallel run",
        detail:
          "The assistant's output was compared against the manual classification on the live queue for three weeks, and the mismatch reports were reviewed jointly before it was switched on.",
      },
      {
        title: "Week 17+ · Release and monitor",
        detail:
          "Staged rollout team by team, dashboards for latency, cost per claim and correction rate, and a monthly review to keep growing the golden set.",
      },
    ],
    results: [
      {
        label: "Time to classify a new claim",
        value: "Target reduction agreed in discovery, measured after release",
        verified: false,
        note: "Replace with the figure measured in the client's own reporting once a real study is approved.",
      },
      {
        label: "Adjuster correction rate",
        value: "Tracked on a dashboard from launch",
        verified: false,
        note: "Needs a real number from an approved engagement.",
      },
      {
        label: "Queue ageing",
        value: "Instrumented as an operational measure",
        verified: false,
        note: "Business outcome to be supplied once the client approves publication.",
      },
    ],
    lessons: [
      "Leaving photo evidence out of version one was the decision that kept the project credible.",
      "Adjusters accepted the tool quickly once citations were visible; before that, no accuracy figure convinced them.",
      "A golden set built with the operations team became the shared reference for every argument about quality.",
      "Cost per claim mattered more to finance than the choice of model. Measuring it from day one avoided a late surprise.",
    ],
    relatedSlugs: ["ops-reporting-pipeline", "freight-doc-flow"],
  },
  {
    slug: "ops-reporting-pipeline",
    title: "Weekly operations reporting, rebuilt as an automated pipeline",
    clientDescriptor: "Sample scenario · multi-site service operator",
    category: "Automation",
    year: "Sample",
    summary:
      "Six spreadsheets and one fully occupied analyst became a single governed pipeline that produces the same weekly report in minutes, leaving the analyst to do the analysis part.",
    problem:
      "Leadership reporting depended on manual extracts from four systems and a shared workbook. It was late, frequently wrong in small ways, and impossible to audit.",
    solutionOverview:
      "Scheduled ingestion with reconciliation, a single modelled source of truth, exception queues for bad data, and reports generated from the same tables the operational dashboards use.",
    stack: ["Python", "Node.js", "PostgreSQL", "dbt-style transforms", "Airflow", "Grafana", "S3"],
    services: ["workflow-automation", "digital-transformation"],
    background:
      "The organisation had grown by acquisition, so each site reported differently. Finance, operations and the regional leads each maintained a private version of the numbers and defended them.",
    challenge:
      "The technical work was straightforward. The hard part was agreeing who owns a definition: what counts as a completed job, and who decides when two sites disagree about it.",
    objectives: [
      "One agreed definition set, documented and owned",
      "Weekly pack produced without manual assembly",
      "Visible data-quality exceptions instead of silent correction",
      "A path to retire the private spreadsheets",
    ],
    solution: [
      {
        title: "Definition workshop before code",
        detail:
          "Metric definitions were agreed in writing with named owners, including how late-arriving data is treated. That document became the acceptance criteria for the build.",
      },
      {
        title: "Ingestion with reconciliation",
        detail:
          "Nightly extracts from each system, loaded raw, transformed to the agreed model, then reconciled against source counts. Any variance over threshold produced a row in an exception queue with an owner.",
      },
      {
        title: "Reports generated from the model",
        detail:
          "The weekly pack renders from the transformed tables. The same tables power the operational dashboard, so nobody has to choose which number is real.",
      },
      {
        title: "Spreadsheet migration path",
        detail:
          "Each private workbook was mapped to a report section, then switched and archived with a note explaining the definitional difference it used to hide.",
      },
    ],
    implementation: [
      { title: "Week 1–2", detail: "Traced the existing reporting process and wrote the definition document with the three owners." },
      { title: "Week 3–6", detail: "Built raw ingestion plus reconciliation for two of four sources; parallel compared against the manual pack." },
      { title: "Week 7–10", detail: "Remaining sources, exception queue, generated report pack, dashboard for the pipeline itself." },
      { title: "Week 11–12", detail: "Spreadsheet retirement, training for regional leads, runbook handover to the internal data team." },
    ],
    results: [
      {
        label: "Manual assembly time",
        value: "Weekly analyst effort redirected to review instead of compilation",
        verified: false,
        note: "Insert measured hours saved once a real engagement is approved for publication.",
      },
      {
        label: "Report availability",
        value: "Generated on schedule with failure alerts",
        verified: false,
        note: "Replace with observed on-time percentage.",
      },
      {
        label: "Disputed figures",
        value: "Reduced by agreed definitions and audit trail",
        verified: false,
        note: "Needs a client-verified measure.",
      },
    ],
    lessons: [
      "Writing the definitions down was worth more than any tooling choice.",
      "An exception queue with a named owner stopped the quiet data fixes that destroy trust.",
      "Parallel running against the manual pack for four weeks is what made the switch uncontroversial.",
      "Retiring each spreadsheet needed a documented reason, or people kept copies.",
    ],
    relatedSlugs: ["legacy-branch-system", "freight-doc-flow"],
  },
  {
    slug: "freight-doc-flow",
    title: "Freight document flow across three disconnected systems",
    clientDescriptor: "Sample scenario · regional logistics operator",
    category: "Automation",
    year: "Sample",
    summary:
      "Dispatch, the transport management system and invoicing were joined by email. Event-driven glue plus an approval state machine closed the loop.",
    problem:
      "Proof-of-delivery documents arrived by email, were matched to orders by hand, and invoicing waited for someone to notice a mismatch. Cash was stuck in a clerical process.",
    solutionOverview:
      "Document intake with automated matching, a human approval step only where confidence was low, and a status model shared across all three systems with retries and replay.",
    stack: ["TypeScript", "Node.js", "PostgreSQL", "S3", "Webhooks", "Prometheus", "Alertmanager"],
    services: ["workflow-automation", "observability-monitoring"],
    background:
      "The operator had invested in each system separately. None of them knew when the others had finished, so dispatch ran a shadow process in spreadsheets to keep the trucks moving.",
    challenge:
      "Order data was imperfect: renamed customers, split deliveries, partial returns. A naive matcher created more work than it saved, so the design had to assume failure and route it visibly.",
    objectives: [
      "Match documents to orders automatically where confidence is high",
      "Route only genuine exceptions to staff, with context attached",
      "Make the state of every delivery leg visible in one place",
      "Never lose a document when an upstream system is down",
    ],
    solution: [
      {
        title: "Idempotent intake",
        detail:
          "Email and portal submissions land in a durable queue, and replays are safe. An upstream outage therefore shows up as a growing backlog with an alert attached.",
      },
      {
        title: "Tiered matching",
        detail:
          "Exact reference match, then fuzzy customer and amount scoring, then human review. Each tier reports its confidence so the rules can be tuned with evidence.",
      },
      {
        title: "Shared status model",
        detail:
          "One state machine for the document lifecycle, published to all three systems, with approvals and their audit trail in a single service.",
      },
      {
        title: "Operational visibility",
        detail:
          "Queue depth, matching rate by tier, exception ageing and a branch view. Alerts fire on how long an item has been waiting, which a raw error count never tells you.",
      },
    ],
    implementation: [
      { title: "Week 1–2", detail: "Shadowed the dispatch desk for a full week, including the workaround spreadsheets nobody had documented." },
      { title: "Week 3–4", detail: "Built intake plus exact matching in shadow mode; measured hit rate against six weeks of real documents." },
      { title: "Week 5–8", detail: "Fuzzy tiers, approval UI, status publishing, replay tooling for operators." },
      { title: "Week 9–11", detail: "Parallel operation, exception tuning, branch-by-branch cut-over." },
      { title: "Ongoing", detail: "Monthly review of unmatched documents to improve rules; the operator owns the rule set." },
    ],
    results: [
      {
        label: "Automatic match share",
        value: "Measured per tier from launch",
        verified: false,
        note: "Publish the real distribution once an approved study exists.",
      },
      {
        label: "Invoice release delay",
        value: "Business measure tracked with finance",
        verified: false,
        note: "Needs verified before/after figures.",
      },
      {
        label: "Lost documents",
        value: "Durable intake with replay",
        verified: false,
        note: "Replace with observed incident count.",
      },
    ],
    lessons: [
      "Shadow-mode measurement first: without it, the matching tiers would have been argued from opinion.",
      "Operators wanted a replay tool more than a nicer dashboard, and building it early bought trust for everything after.",
      "Alerting on ageing exceptions instead of errors cut pages dramatically.",
      "The spreadsheet workaround was the real specification; documenting it took a week and saved a quarter.",
    ],
    relatedSlugs: ["legacy-branch-system", "ops-reporting-pipeline"],
  },
  {
    slug: "legacy-branch-system",
    title: "Strangling a 15-year-old branch operations system",
    clientDescriptor: "Sample scenario · service network operator",
    category: "Transformation",
    year: "Sample",
    summary:
      "The old system was replaced in seven vertical slices, each shipped and each reversible, which is how the business avoided the eighteen-month freeze a rewrite would have meant.",
    problem:
      "A monolith written before the current team existed held the daily operating process. Every change was risky, every vendor quote for replacement assumed a full rewrite.",
    solutionOverview:
      "Behaviour capture through traffic replay, a strangler seam at the edge, new services for reporting, approvals and scheduling first, with the legacy database shared under a documented contract.",
    stack: ["Java", "PostgreSQL", "TypeScript", "React", "Kong-style gateway", "OpenTelemetry", "Grafana", "Terraform"],
    services: ["digital-transformation", "observability-monitoring"],
    background:
      "The organisation had tried a package selection twice. Both stalled in configuration workshops because the in-house system encoded rules nobody could fully articulate.",
    challenge:
      "The system's behaviour was the requirement, and it was undocumented. Replacement work had to discover it empirically, because staff could not recall rules they had stopped noticing years ago.",
    objectives: [
      "Understand what the current system actually does, with evidence",
      "Replace highest-friction capabilities first without a freeze",
      "Keep one authoritative data store during transition",
      "Leave instrumentation in place for whatever comes after",
    ],
    solution: [
      {
        title: "Characterisation before design",
        detail:
          "Production traffic was mirrored and replayed against a copy, producing a behavioural baseline of the rules staff used daily. That baseline became the test suite for every new service.",
      },
      {
        title: "Edge seams",
        detail:
          "Routing at the edge let a new service take over one flow at a time while the monolith kept the rest. Rolling back was a configuration change, so it did not need a release.",
      },
      {
        title: "Shared data with a contract",
        detail:
          "Rather than a risky dual-write, the legacy database was wrapped by a documented service contract, so both old and new paths read the same records during the overlap.",
      },
      {
        title: "Operational baseline",
        detail:
          "Instrumentation landed in slice one, so every later slice shipped into a system that could already be observed and compared.",
      },
    ],
    implementation: [
      { title: "Phase 1 · 6 weeks", detail: "Replay harness, behaviour inventory, constraint register, target architecture reviewed with internal engineers." },
      { title: "Phase 2 · slices 1–3", detail: "Reporting, approvals and scheduling moved out. Each slice shipped with its baseline tests passing." },
      { title: "Phase 3 · slices 4–7", detail: "The screens customers use, then internal admin, then billing handoff, then the last read path." },
      { title: "Phase 4", detail: "Legacy write paths retired, archival of obsolete tables, decommission runbook executed with the operations team." },
    ],
    results: [
      {
        label: "Delivery continuity",
        value: "Slices released incrementally with no change freeze",
        verified: false,
        note: "State real dates and counts once approved.",
      },
      {
        label: "Change risk",
        value: "Per-route rollback in configuration",
        verified: false,
        note: "Needs measured change-failure rate.",
      },
      {
        label: "Running cost",
        value: "Legacy hosting retired at close-out",
        verified: false,
        note: "Insert verified cost comparison.",
      },
    ],
    lessons: [
      "Capturing behaviour empirically settled arguments that workshops could not.",
      "Sharing the legacy database cost a little architectural tidiness and bought a lot of safety, as long as the contract and the exit were both written down.",
      "Instrumenting in slice one made slice seven boring, which was the point.",
      "Decommissioning needs its own plan and a named approval. It never happens as a side effect.",
    ],
    relatedSlugs: ["ops-reporting-pipeline", "freight-doc-flow"],
  },
  {
    slug: "platform-reliability-baseline",
    title: "Reliability baseline for a growing SaaS platform",
    clientDescriptor: "Sample scenario · B2B software company",
    category: "Observability",
    year: "Sample",
    summary:
      "A pager that had trained people to ignore it was replaced with alerts based on what users actually feel, SLOs product agreed to, and traces that answered the question during the incident.",
    problem:
      "The platform had outgrown its monitoring. Rules were written around host health. Real degradations therefore hid inside a wall of noise, and engineers stopped believing their own dashboards.",
    solutionOverview:
      "OpenTelemetry instrumentation across services and queues, three dashboard audiences, error budgets negotiated with product, and an incident process that produced written reviews.",
    stack: ["OpenTelemetry", "Go", "Node.js", "Prometheus", "Grafana", "Loki", "Tempo", "Terraform"],
    services: ["observability-monitoring", "traditional"],
    background:
      "Two senior engineers knew how the system fit together. A hiring freeze meant that knowledge was not spreading, and on-call rotation was burning them.",
    challenge:
      "The tooling budget was already committed. The work had to make the existing stack useful, and a new platform was not on the table.",
    objectives: [
      "Instrument the request path end to end, including queues",
      "Reduce alert volume while still catching every incident a customer would notice",
      "Agree SLOs product will honour in roadmap decisions",
      "Enable a second-tier engineer to run an incident",
    ],
    solution: [
      {
        title: "Trace-first instrumentation",
        detail:
          "Context propagated through services and async jobs, so one trace followed a request from the click through to the queue. Sampling kept the volume affordable without dropping error paths.",
      },
      {
        title: "Alerting on what users feel",
        detail:
          "Rules were rewritten to fire on symptoms a customer would notice, with a threshold worth waking somebody for. Conditions with no urgent action became tickets. Volume dropped in the first fortnight.",
      },
      {
        title: "Three audiences, three dashboards",
        detail:
          "Executive SLO status, the on-call triage view, and the per-service detail view. Each had a documented purpose; anything without one was deleted.",
      },
      {
        title: "Incident practice",
        detail:
          "Severity definitions, runbooks for the top ten failure modes, and blameless review templates filled in for the first time.",
      },
    ],
    implementation: [
      { title: "Week 1–2", detail: "Audit of existing signals, alert history triage and interviews with the on-call rotation." },
      { title: "Week 3–4", detail: "SLO negotiation with product and engineering leads; error budget policy written down." },
      { title: "Week 5–9", detail: "Instrumentation across the critical paths, dashboard builds, alert rewrite in a shadow period." },
      { title: "Week 10–12", detail: "Cut over alerting, runbook workshops, game-day exercises with the team." },
      { title: "After", detail: "A monthly reliability review, using error budget burn data to pick the next piece of work." },
    ],
    results: [
      {
        label: "Off-hours pages",
        value: "Reduced by alert rewrite onto symptoms",
        verified: false,
        note: "Replace with measured before/after page counts.",
      },
      {
        label: "Time to identify cause",
        value: "Shorter with end-to-end traces",
        verified: false,
        note: "Needs incident-review data from a real engagement.",
      },
      {
        label: "Error budget usage",
        value: "Traded against roadmap by agreement",
        verified: false,
        note: "Publish a real figure once available.",
      },
    ],
    lessons: [
      "Deleting dashboards nobody could explain was the fastest way to gain credibility with the team.",
      "A shadow period for new alert rules prevented the rewrite from becoming an outage of its own.",
      "Error budgets only work when product agrees to the trade before the incident happens.",
      "The game day taught more than the documentation did. Rehearsing a runbook is what made it usable under pressure.",
    ],
    relatedSlugs: ["freight-doc-flow", "legacy-branch-system"],
  },
];

export const caseCategories = Array.from(new Set(caseStudies.map((c) => c.category)));

export const caseBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
