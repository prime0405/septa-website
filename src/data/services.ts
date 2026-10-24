export type Capability = { title: string; detail: string };
export type ProcessStepData = { title: string; detail: string; note?: string };

export type ServiceContent = {
  slug: string;
  name: string;
  /** Icon registry key, resolved in components/blocks/ServiceIcon.tsx */
  icon: "ai" | "automation" | "transformation" | "observability" | "talent" | "product";
  navBlurb: string;
  heroTitle: string;
  lead: string;
  /** Business problems the service addresses. */
  problems: string[];
  /** What is actually done, grouped the way a buyer would read it. */
  capabilities: { group: string; items: Capability[] }[];
  benefits: Capability[];
  useCases: Capability[];
  process: ProcessStepData[];
  deliverables: string[];
  faq: { q: string; a: string }[];
  /** Which illustrative visual to embed: workflow diagram or dashboard mock. */
  visual?: "workflow" | "dashboard" | "ai";
  related: { label: string; to: string }[];
  /** Capabilities that must be confirmed by Septa before they read as an established offering. */
  unconfirmed: string[];
};

export const services: ServiceContent[] = [
  {
    slug: "ai-product-development",
    name: "AI Product Development",
    icon: "ai",
    navBlurb: "AI strategy, prototypes and production systems that hold up under real users.",
    heroTitle: "AI products that survive contact with reality",
    lead: "Most AI pilots stall between the demo and production. We work from the decision you want the system to make backwards — through evaluation, data readiness, guardrails and deployment — so the result is a product people trust with their work, not a chat window bolted onto a spreadsheet.",
    problems: [
      "A promising prototype that never made it past a proof of concept.",
      "Answers generated without ground truth, so nobody dares act on them.",
      "Model spend growing faster than the value it produces.",
      "Sensitive customer data pasted into third-party prompts.",
      "One engineer holding all the context about how the system actually works.",
    ],
    capabilities: [
      {
        group: "Strategy and discovery",
        items: [
          {
            title: "AI opportunity assessment",
            detail:
              "Map the workflows where an AI feature changes an outcome, then rank them by feasible value, data availability and risk.",
          },
          {
            title: "Use-case specification",
            detail:
              "Turn a vague ask into a testable brief: inputs, tolerated error rate, human review step, and what success looks like after 90 days.",
          },
          {
            title: "Data readiness review",
            detail:
              "Audit the documents, tables and APIs the system will rely on, and name the gaps before they become blockers.",
          },
        ],
      },
      {
        group: "Product and prototype",
        items: [
          {
            title: "Clickable prototyping",
            detail:
              "A working slice against real data in days, not quarters, so the decision to fund the build is cheap.",
          },
          {
            title: "Interaction design for uncertain output",
            detail:
              "Citations, confidence, undo, review queues and escalation paths — the parts that decide whether users adopt or abandon.",
          },
        ],
      },
      {
        group: "Build",
        items: [
          {
            title: "LLM feature development",
            detail:
              "Retrieval-augmented generation, tool calling, structured outputs, prompt versioning and caching, against whichever model provider fits your constraints.",
          },
          {
            title: "Machine learning integration",
            detail:
              "Classical and gradient-boosted models for prediction, ranking and anomaly detection, served behind the same API surface as generative features.",
          },
          {
            title: "Conversational interfaces",
            detail:
              "Assistants scoped to your domain: intent coverage, guardrails, handoff to a human, and transcripts that stay inside your boundary.",
          },
          {
            title: "Agent and workflow orchestration",
            detail:
              "Multi-step automations with explicit tool contracts, retries, idempotency and a human approval gate where the risk demands it.",
          },
        ],
      },
      {
        group: "Evaluation, safety and operations",
        items: [
          {
            title: "Evaluation harness",
            detail:
              "Golden datasets, regression suites and scored runs so every prompt or model change is measured, not vibes.",
          },
          {
            title: "Observability for AI",
            detail:
              "Token spend, latency, refusal and hallucination signals, per-route quality trends, wired into the same dashboards as the rest of the platform.",
          },
          {
            title: "Responsible AI controls",
            detail:
              "PII handling, access scoping, red-team test sets, refusal policies, and documentation of known limitations before users meet them.",
          },
          {
            title: "Deployment and iteration",
            detail:
              "Staged rollout, offline and online evaluation, rollback plan, then a cadence of improvement against the metrics that matter.",
          },
        ],
      },
    ],
    benefits: [
      {
        title: "Funded on evidence",
        detail: "A prototype and an evaluation baseline come before the big build, so money follows proof.",
      },
      {
        title: "Accountable answers",
        detail: "Every output can be traced to the source that produced it, with review where errors are costly.",
      },
      {
        title: "Costs that stay sane",
        detail: "Caching, routing and per-feature budgets keep inference spend tied to value.",
      },
      {
        title: "No single-person dependency",
        detail: "Prompts, evals and infrastructure are versioned and documented like any other product code.",
      },
    ],
    useCases: [
      {
        title: "Document-heavy teams",
        detail: "Contract, claims, compliance and support teams searching thousands of pages with cited answers.",
      },
      {
        title: "Operational triage",
        detail: "Sorting, summarising and routing inbound work — tickets, applications, alerts — with a human in the loop.",
      },
      {
        title: "Copilot inside your product",
        detail: "A domain assistant that drafts, explains and acts within your application's own permissions model.",
      },
      {
        title: "Prediction features",
        detail: "Demand, churn, risk and anomaly scoring where a traditional model beats a large language model.",
      },
    ],
    process: [
      { title: "Discovery", detail: "Decision-first scoping, data audit, constraint capture.", note: "Output: ranked use cases" },
      { title: "Prototype", detail: "One thin slice against real data, with a scoring baseline.", note: "Usually 1–3 weeks" },
      { title: "Architecture", detail: "Model, retrieval, storage and safety design reviewed with your team.", note: "Output: build plan" },
      { title: "Build", detail: "Iterative delivery behind feature flags with evaluation gates.", note: "Two-week loops" },
      { title: "Evaluate", detail: "Regression suite plus human review on sampled production traffic.", note: "Quality bar agreed upfront" },
      { title: "Deploy & iterate", detail: "Staged rollout, monitoring, cost review, scheduled improvement cycle.", note: "Handover with runbook" },
    ],
    deliverables: [
      "Use-case brief with success criteria",
      "Working prototype and evaluation baseline",
      "Architecture and data-flow documentation",
      "Production feature with tests and eval suite",
      "Monitoring dashboards and cost reporting",
      "Runbook, guardrail policy and team handover",
    ],
    faq: [
      {
        q: "Do we need our own model?",
        a: "Almost never. The usual answer is a hosted model with strong retrieval, careful prompting and your own evaluation set. We will tell you plainly when a fine-tune or a traditional model is the better tool.",
      },
      {
        q: "How do you stop it inventing answers?",
        a: "Retrieval with citations, structured outputs where the schema can enforce them, refusal policies for out-of-scope requests, and an eval set that blocks regressions before they ship.",
      },
      {
        q: "What about our data privacy?",
        a: "Data scoping decisions are made in discovery: which fields may reach a provider, where redaction happens, retention limits, and how access is audited. Where a provider is not acceptable, we design for self-hosted inference.",
      },
      {
        q: "How long before we see something real?",
        a: "A thin prototype typically runs in two to three weeks from a working data connection. Anything promising a full product in a fortnight is usually hiding the hard parts.",
      },
      {
        q: "Can you work with the team we already have?",
        a: "Yes. Pairing, code review, architecture guidance and evaluation practice transfer well, and several engagements are advisory or augmentation-shaped rather than full handover builds.",
      },
    ],
    visual: "ai",
    related: [
      { label: "Traditional Product Development", to: "/product-development/traditional" },
      { label: "Workflow Automation", to: "/services/workflow-automation" },
      { label: "Observability & Monitoring", to: "/services/observability-monitoring" },
    ],
    unconfirmed: [
      "Model and cloud provider partnerships or accreditations",
      "Named regulated-industry experience (finance, healthcare)",
      "Standing managed-support tiers for AI systems",
    ],
  },
  {
    slug: "workflow-automation",
    name: "Workflow Automation",
    icon: "automation",
    navBlurb: "Connect the systems your team already uses and remove the manual handoffs.",
    heroTitle: "Stop paying people to copy and paste",
    lead: "Automation work rarely fails because of the technology. It fails because nobody mapped the real process, or because a script was written with no owner, no retries and no alerting. We instrument the workflow first, then build the connections that survive a bad day upstream.",
    problems: [
      "The same record typed into three systems by three different people.",
      "Approvals that live in email and stall for days.",
      "Reporting built by hand every Monday morning.",
      "Zapier-style glue nobody owns, breaking silently.",
      "Onboarding, offboarding and access requests that depend on one helpful person.",
    ],
    capabilities: [
      {
        group: "Understand the process",
        items: [
          {
            title: "Workflow discovery",
            detail:
              "Sit with the people doing the work, trace one real case end to end, and document the exceptions nobody writes down.",
          },
          {
            title: "Process optimisation",
            detail:
              "Remove steps before automating them. A faster wrong process is still wrong.",
          },
          {
            title: "Ownership map",
            detail: "Name the person accountable for each step, each system and each failure mode.",
          },
        ],
      },
      {
        group: "Build the connections",
        items: [
          {
            title: "API integration",
            detail:
              "Auth, pagination, rate limits, webhooks and idempotency handled properly, with contract tests against sandboxes.",
          },
          {
            title: "Data synchronisation",
            detail:
              "One-way or two-way sync with conflict rules, an audit trail, and reconciliation when systems disagree.",
          },
          {
            title: "Task automation",
            detail:
              "Event-driven jobs: create, enrich, route, notify, escalate — with retries, dead-letter queues and manual replay.",
          },
          {
            title: "Approval workflows",
            detail:
              "State machines with roles, delegation, timeouts and a full record of who approved what and when.",
          },
          {
            title: "Internal tools and dashboards",
            detail:
              "The ops screen your team actually needs, built on the same data rather than a stale export.",
          },
          {
            title: "Reporting automation",
            detail:
              "Scheduled and on-demand reports generated from source systems, delivered where people already work.",
          },
        ],
      },
      {
        group: "Keep it running",
        items: [
          {
            title: "Monitoring and alerting",
            detail:
              "Every automation has a health check, lag indicator and an owner who is told before the business notices.",
          },
          {
            title: "Maintenance",
            detail:
              "Provider API changes, credential rotation and dependency upgrades handled as scheduled work, not emergencies.",
          },
        ],
      },
    ],
    benefits: [
      {
        title: "Hours returned weekly",
        detail: "Manual handoffs disappear; people spend time on judgement instead of transcription.",
      },
      {
        title: "Fewer silent failures",
        detail: "Retries plus alerting mean a broken integration is a five-minute incident, not a quarter-long data gap.",
      },
      {
        title: "One source of truth",
        detail: "Conflict rules and lineage replace the argument about which system is right.",
      },
      {
        title: "Audit-ready",
        detail: "Timestamped event logs and approval trails make compliance reviews boring in the best way.",
      },
    ],
    useCases: [
      {
        title: "Quote-to-cash",
        detail: "CRM deal → contract generation → finance system invoice → delivery notification, with human gates.",
      },
      {
        title: "Support escalation",
        detail: "Ticket triage, ownership routing, customer-context assembly and follow-up without manual chasing.",
      },
      {
        title: "People operations",
        detail: "Joiner-mover-leaver: accounts, devices, licences and access groups following the HR record.",
      },
      {
        title: "Data and finance hygiene",
        detail: "Nightly reconciliation, exception queues and monthly close packs built automatically.",
      },
    ],
    process: [
      { title: "Map", detail: "Shadow the real workflow, including its workarounds.", note: "Output: current-state flow" },
      { title: "Decide", detail: "Cut steps, pick the trigger and the system of record.", note: "Output: target-state design" },
      { title: "Build", detail: "Integrations and jobs behind flags, with contract tests.", note: "Sandbox first" },
      { title: "Parallel run", detail: "Automated and manual paths run side by side and are compared.", note: "Confidence gate" },
      { title: "Handover", detail: "Alerting, runbook, replay tooling, owner training.", note: "No black boxes" },
      { title: "Tune", detail: "Regular review of failures, volume and remaining manual steps.", note: "Ongoing or scoped" },
    ],
    deliverables: [
      "Current and target process documentation",
      "Integration build with tests and replay tooling",
      "Approval and escalation routing",
      "Monitoring, alerting and a named owner runbook",
      "Internal dashboard or reporting pack",
      "Maintenance plan",
    ],
    faq: [
      {
        q: "Can you work with the tools we already pay for?",
        a: "That is the normal case. We integrate against the APIs and webhooks your systems expose and flag the places where a tool's limits will shape the design.",
      },
      {
        q: "What if a system has no API?",
        a: "Options in order of preference: database or file export, an official connector, a brokered email or queue path, then carefully monitored browser automation as a last resort — we will be explicit about its fragility.",
      },
      {
        q: "Who owns the automation afterwards?",
        a: "You do, with tooling that lets you see and replay it. We also offer maintenance arrangements; the shape of that arrangement is confirmed per engagement.",
      },
      {
        q: "How do you avoid breaking production data?",
        a: "Dry-run mode, sandbox credentials, idempotency keys, feature flags, and a parallel comparison period before the manual path is switched off.",
      },
    ],
    visual: "workflow",
    related: [
      { label: "Digital Transformation", to: "/services/digital-transformation" },
      { label: "AI Product Development", to: "/services/ai-product-development" },
      { label: "Observability & Monitoring", to: "/services/observability-monitoring" },
    ],
    unconfirmed: [
      "Preferred automation platforms or vendor certifications",
      "Standard support response times for live automations",
      "Off-the-shelf connector library already built",
    ],
  },
  {
    slug: "digital-transformation",
    name: "Digital Transformation",
    icon: "transformation",
    navBlurb: "Modernise legacy systems and operations without stopping the business.",
    heroTitle: "Modernisation without the big-bang gamble",
    lead: "A transformation programme fails when it treats old systems as a moral failing rather than a set of specific constraints. We work in the boring, decisive order: understand what the current system actually does, decide what must keep working exactly as it does, then replace the rest in slices that ship value while the lights stay on.",
    problems: [
      "Core operations running on software nobody fully understands.",
      "A vendor licence renewal that costs more than rebuilding.",
      "Every new feature blocked by a dependency nobody can untangle.",
      "Paper and spreadsheet processes outside the system of record.",
      "Two teams maintaining near-identical versions of the same logic.",
    ],
    capabilities: [
      {
        group: "Direction",
        items: [
          {
            title: "Digital strategy",
            detail:
              "An outcome-led roadmap sequenced by dependency and value, with cost and risk stated in the same document.",
          },
          {
            title: "Systems and capability audit",
            detail:
              "What exists, who uses it, what data flows through it, and what genuinely has to survive the change.",
          },
          {
            title: "Target architecture",
            detail:
              "Pragmatic service, data and integration boundaries matched to your team size and operating model.",
          },
        ],
      },
      {
        group: "Modernisation",
        items: [
          {
            title: "Legacy system modernisation",
            detail:
              "Strangler-fig replacement at the seams, shared databases where migration cannot be atomic, and rollback at every step.",
          },
          {
            title: "Platform and software integration",
            detail:
              "Connect the purchased systems into one coherent operation instead of hoping they align.",
          },
          {
            title: "Cloud adoption",
            detail:
              "Where cloud genuinely helps: landing zones, migration waves, cost modelling, exit paths and operational readiness.",
          },
          {
            title: "Data and process modernisation",
            detail:
              "Consolidate reporting, fix master-data ownership, and move shadow spreadsheets into governed flows.",
          },
          {
            title: "Digital product implementation",
            detail:
              "Customer- and staff-facing applications that carry the new capabilities where work actually happens.",
          },
        ],
      },
      {
        group: "Landing the change",
        items: [
          {
            title: "Change management",
            detail:
              "Training, comms, support ramp and named champions, because the software is the easy half.",
          },
          {
            title: "Ongoing optimisation",
            detail:
              "Post-launch measurement against the original business case, then iteration on what moved and what did not.",
          },
          {
            title: "Legacy decommissioning",
            detail:
              "The unglamorous work of switching the old system off, archiving records and closing the access paths.",
          },
        ],
      },
    ],
    benefits: [
      {
        title: "Continuous operation",
        detail: "Slice-by-slice replacement keeps the business trading through the change.",
      },
      {
        title: "Decisions on evidence",
        detail: "Each wave carries its own cost, risk and measured outcome rather than a programme-wide promise.",
      },
      {
        title: "Reduced vendor lock",
        detail: "Portability, data ownership and exit paths designed in instead of discovered in a renewal negotiation.",
      },
      {
        title: "Skills left behind",
        detail: "Your engineers work alongside ours on the real system, so the capability stays after we leave.",
      },
    ],
    useCases: [
      {
        title: "End-of-life platform",
        detail: "A supported-but-aging core system replaced before the vendor withdraws it.",
      },
      {
        title: "Mergers and duplicating stacks",
        detail: "Two organisations running two versions of everything, converging without freezing delivery.",
      },
      {
        title: "Manual operations ceiling",
        detail: "Growth limited by admin headcount rather than demand.",
      },
      {
        title: "Regulatory or reporting pressure",
        detail: "Requirements the current data model cannot honestly satisfy.",
      },
    ],
    process: [
      { title: "Assess", detail: "Systems, data, dependencies, teams and constraints.", note: "2–4 weeks" },
      { title: "Prioritise", detail: "Sequence by risk removed and value released.", note: "Output: roadmap" },
      { title: "Pilot", detail: "One vertical slice migrated end to end to prove the pattern.", note: "De-risk early" },
      { title: "Waves", detail: "Repeat the proven pattern across domains with parallel teams.", note: "Ship every wave" },
      { title: "Operate", detail: "Monitoring, support model and cost control from day one.", note: "No orphan services" },
      { title: "Close out", detail: "Decommission legacy, archive, document, hand over.", note: "Formal sign-off" },
    ],
    deliverables: [
      "Assessment report and target architecture",
      "Prioritised roadmap with wave-level cost and risk",
      "Migrated capabilities released incrementally",
      "Data migration and reconciliation records",
      "Operational runbook and support model",
      "Legacy decommission plan and evidence trail",
    ],
    faq: [
      {
        q: "Is rewriting always the answer?",
        a: "No. Encapsulating, extending or migrating a working system is often cheaper and lower-risk. The recommendation comes from the assessment, not from a preference to rebuild.",
      },
      {
        q: "How do you handle unknown behaviour in legacy code?",
        a: "Characterisation: log and replay real traffic, pin down what the system actually does, then lock that behaviour with tests before changing anything.",
      },
      {
        q: "Do you move everything to the cloud?",
        a: "Only where it earns its place. Some workloads belong on-premise or in a managed service; the cost and compliance model decides, and we document the reasoning either way.",
      },
      {
        q: "What about our staff who rely on the old way?",
        a: "They are part of the plan: discovery includes them, pilots run with them, and training plus support cover the transition period.",
      },
    ],
    visual: "ai",
    related: [
      { label: "Workflow Automation", to: "/services/workflow-automation" },
      { label: "Traditional Product Development", to: "/product-development/traditional" },
      { label: "Talent Solution", to: "/services/talent-solution" },
    ],
    unconfirmed: [
      "Certified partner status with any specific cloud provider",
      "Industry compliance frameworks Septa is formally accredited against",
      "Managed hosting or support service levels",
    ],
  },
  {
    slug: "observability-monitoring",
    name: "Observability & Monitoring",
    icon: "observability",
    navBlurb: "Metrics, logs and traces that answer questions during an incident.",
    heroTitle: "Know what is broken before your customers do",
    lead: "Monitoring tells you a server is red. Observability lets an engineer answer \"which request path degraded, for whom, and why\" in the middle of an incident. We implement the three signals together, wire them to alerts with owners, and remove the noise that trained your team to ignore the phone.",
    problems: [
      "Incidents reconstructed from guesswork and terminal scrollback.",
      "Alerts firing at 3am for conditions nobody can act on.",
      "Dashboards that describe the infrastructure but not the user experience.",
      "No baseline, so nobody can say whether a change made things better.",
      "Distributed systems where a slow dependency is invisible until it is on fire.",
    ],
    capabilities: [
      {
        group: "Instrumentation",
        items: [
          {
            title: "Metrics",
            detail: "Golden signals plus business-level measures, with cardinality budgets so the store stays fast and affordable.",
          },
          {
            title: "Structured logs",
            detail: "Consistent levels, correlation ids, redaction rules, and sampling that keeps cost under control.",
          },
          {
            title: "Distributed tracing",
            detail: "Context propagation across services and queues so a trace shows the whole request path, not one hop.",
          },
          {
            title: "Real user and synthetic monitoring",
            detail: "Frontend performance, Core Web Vitals and scripted checks on the journeys that make or lose money.",
          },
        ],
      },
      {
        group: "Application performance",
        items: [
          {
            title: "APM setup",
            detail: "Service maps, latency percentiles, error rates, database and dependency breakdowns.",
          },
          {
            title: "Slow-path diagnosis",
            detail: "Profile the actual bottleneck — queries, N+1 access, serialised calls, cold starts — and fix the top of the list.",
          },
        ],
      },
      {
        group: "Infrastructure",
        items: [
          {
            title: "Infrastructure monitoring",
            detail: "Hosts, containers, clusters, queues, jobs and third-party endpoints, with saturation signals that lead rather than lag.",
          },
          {
            title: "Kubernetes and serverless coverage",
            detail: "Controller, pod, node and function-level telemetry plus cold-start and throttling visibility.",
          },
        ],
      },
      {
        group: "Using it under pressure",
        items: [
          {
            title: "Dashboards",
            detail: "One screen per audience: executive SLOs, on-call triage, service deep-dive — not forty graphs of vanity data.",
          },
          {
            title: "Alerting and routing",
            detail: "Symptom-based alerts with owners, escalation paths, snooze policy and a documented error budget.",
          },
          {
            title: "Incident workflow",
            detail: "Runbooks, severity definitions, blameless review templates and time-saved tracking after the fact.",
          },
          {
            title: "Reliability improvement",
            detail: "SLOs negotiated with the business, then a backlog of reliability work justified by burn-rate data.",
          },
        ],
      },
    ],
    benefits: [
      {
        title: "Shorter incidents",
        detail: "Teams stop triaging by guesswork; the trace and the log line are already there.",
      },
      {
        title: "Alerts worth receiving",
        detail: "Fewer, sharper, actionable pages restore trust in the paging system.",
      },
      {
        title: "Capacity decisions with data",
        detail: "Saturation trends and cost-per-request replace the \"add more nodes\" reflex.",
      },
      {
        title: "Change confidence",
        detail: "Every deploy gets compared against the baseline it changed.",
      },
    ],
    useCases: [
      {
        title: "New platform, no telemetry",
        detail: "Instrument before the first customer incident instead of after.",
      },
      {
        title: "Microservice sprawl",
        detail: "Nobody can say which service broke the checkout path.",
      },
      {
        title: "Tool already bought",
        detail: "Datadog, Grafana, New Relic, OpenTelemetry or self-hosted — under-used and paying for itself in shelf-ware.",
      },
      {
        title: "Chronic reliability debt",
        detail: "Recurring outages with no shared picture of cause or cost.",
      },
    ],
    process: [
      { title: "Audit", detail: "Current signals, tools, response process and gaps.", note: "Output: coverage map" },
      { title: "Define", detail: "SLOs per service and the user journeys worth protecting.", note: "With the business" },
      { title: "Instrument", detail: "Metrics, logs and traces shipped together behind OpenTelemetry where possible.", note: "Vendor-lean" },
      { title: "Visualise", detail: "Dashboards per audience and a triage view for on-call.", note: "Reviewed live" },
      { title: "Alert", detail: "Symptom alerts, routing, escalation, noise budget enforced.", note: "Page hygiene" },
      { title: "Improve", detail: "Post-incident reviews and a reliability backlog driven by burn data.", note: "Monthly rhythm" },
    ],
    deliverables: [
      "Observability audit and gap analysis",
      "SLO definitions agreed with product owners",
      "Instrumentation code and pipeline configuration",
      "Dashboard set with documented purpose per screen",
      "Alert rules, routing table and on-call runbooks",
      "Cost and retention configuration",
    ],
    faq: [
      {
        q: "Do we have to change monitoring vendors?",
        a: "Usually not. Instrumentation is standardised where the tool allows, so the existing stack gets more useful and a future move becomes a configuration task rather than a rewrite.",
      },
      {
        q: "Monitoring or observability — what is the difference in practice?",
        a: "Monitoring answers questions you predicted. Observability lets you ask new ones. You need both: alerting on the known failure modes, and enough signal richness to investigate the unknown ones.",
      },
      {
        q: "Won't this make our bill spike?",
        a: "Cardinality, sampling and retention are designed as part of the work, with a cost model before rollout. Noisy telemetry is also a reliability problem, not just a finance one.",
      },
      {
        q: "Can you work with our OpenTelemetry setup?",
        a: "Yes. Where it is partial or misconfigured, the audit states what to fix first and why.",
      },
    ],
    visual: "dashboard",
    related: [
      { label: "Workflow Automation", to: "/services/workflow-automation" },
      { label: "AI Product Development", to: "/services/ai-product-development" },
      { label: "Digital Transformation", to: "/services/digital-transformation" },
    ],
    unconfirmed: [
      "Named vendor partnerships (Datadog, Grafana, New Relic, AWS)",
      "24/7 managed on-call or SOC-style coverage",
      "Security detection engineering as a standalone offering",
    ],
  },
  {
    slug: "talent-solution",
    name: "Talent Solution",
    icon: "talent",
    navBlurb: "Technical people and teams that plug into your delivery model.",
    heroTitle: "Engineering capacity you can plan around",
    lead: "Hiring good engineers slowly is its own kind of outage. Whether you need one specialist who can work unsupervised, a squad that owns a product line, or a vetted contractor for a defined piece of work, the useful question is the same: who is accountable for the outcome, and how quickly can they start? That is what we arrange.",
    problems: [
      "A role open for five months while the roadmap waits.",
      "Contractors who need six weeks of context before producing.",
      "One internal expert holding three systems together.",
      "Delivery risk you cannot cover with a permanent hire budget.",
      "Technical screening your hiring team does not have time to run well.",
    ],
    capabilities: [
      {
        group: "Sourcing and placement",
        items: [
          {
            title: "Technical talent sourcing",
            detail: "Define the real role, search beyond the applicants, and present a shortlist with reasons.",
          },
          {
            title: "Developer placement",
            detail: "Permanent or contract hires placed into your process, with technical vetting done before you see a CV.",
          },
          {
            title: "Technical role matching",
            detail: "Mapping a candidate's demonstrated work onto your stack and stage rather than keyword overlap.",
          },
        ],
      },
      {
        group: "Team-shaped engagements",
        items: [
          {
            title: "Dedicated development teams",
            detail: "A stable team working against your backlog with your rituals, tools and definition of done.",
          },
          {
            title: "Project-based staffing",
            detail: "Scoped capacity for a migration, a platform build or a release push, with a clear exit.",
          },
          {
            title: "Team augmentation",
            detail: "Individual engineers embedded in your squad, sized to the gap rather than a headcount target.",
          },
        ],
      },
      {
        group: "Hiring support",
        items: [
          {
            title: "Technical screening",
            detail: "Interview design, take-home or pairing assessments and calibrated feedback your hiring managers can act on.",
          },
          {
            title: "Role and level definition",
            detail: "Writing the spec so candidates and internal panels agree on what good looks like.",
          },
          {
            title: "Onboarding ramp",
            detail: "A structured first month so new engineers ship something real early.",
          },
        ],
      },
    ],
    benefits: [
      {
        title: "Faster start, fewer dead ends",
        detail: "Vetting happens before your team's calendar is spent on it.",
      },
      {
        title: "Capacity that flexes",
        detail: "Scale a squad up for the push, taper it as ownership transfers.",
      },
      {
        title: "Accountability, not anonymity",
        detail: "Named engineers who own outcomes in your trackers, not an unseen pool of resources.",
      },
      {
        title: "Knowledge transfer built in",
        detail: "Documentation, pairing and handover checkpoints are part of the engagement, not an extra.",
      },
    ],
    useCases: [
      {
        title: "Blocked roadmap",
        detail: "Committed delivery dates with missing skills behind them.",
      },
      {
        title: "Specialist gap",
        detail: "ML evaluation, data platform, embedded, security or SRE depth you need for months, not years.",
      },
      {
        title: "New product line",
        detail: "A team assembled around a roadmap that cannot wait on serial hiring.",
      },
      {
        title: "Leaver risk",
        detail: "Bus-factor coverage for a critical system before the resignation letter arrives.",
      },
    ],
    process: [
      { title: "Brief", detail: "Outcome, constraints, must-have skills, and how the work will be judged.", note: "With the hiring lead" },
      { title: "Model", detail: "Choose placement, augmentation, squad or project shape.", note: "Costed per option" },
      { title: "Screen", detail: "Technical assessment plus structured evidence packs.", note: "Before you are charged time" },
      { title: "Start", detail: "Onboarding plan, access, first deliverable in week one.", note: "Ramp tracked" },
      { title: "Review", detail: "Regular check-ins on delivery quality and fit, not just utilisation.", note: "Cadence agreed" },
      { title: "Transition", detail: "Extend, convert to permanent, or hand over with documentation.", note: "Planned exit" },
    ],
    deliverables: [
      "Role or engagement brief",
      "Shortlist with assessment evidence",
      "Onboarding and ramp plan",
      "Delivery review cadence",
      "Transition or conversion documentation",
    ],
    faq: [
      {
        q: "What engagement shapes are available?",
        a: "Placement, augmentation, project-based work and dedicated teams are described on this page. Rates, contract terms and notice periods are confirmed per enquiry rather than published here.",
      },
      {
        q: "How is technical quality checked?",
        a: "Structured review of past work plus a practical assessment matched to the role. What you receive is the reasoning, not a score with no explanation.",
      },
      {
        q: "Where do engineers work from?",
        a: "Working locations, time-zone overlap and remote or on-site expectations are set in the brief; Septa's own base and footprint are still to be published on this site.",
      },
      {
        q: "Can a contractor convert to permanent?",
        a: "Conversions are common in this kind of arrangement and are discussed openly at the start so expectations are aligned.",
      },
    ],
    related: [
      { label: "Careers at Septa", to: "/careers" },
      { label: "AI Product Development", to: "/services/ai-product-development" },
      { label: "Digital Transformation", to: "/services/digital-transformation" },
    ],
    unconfirmed: [
      "Actual recruiter versus staffing model, and legal entity for contracts",
      "Geographies covered and time-zone commitments",
      "Conversion, guarantee and notice-period terms",
      "Any claim about speed of shortlisting or fill rates",
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
