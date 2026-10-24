export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; lang: string; text: string };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  /** Sample editorial content until Septa approves real articles. */
  status: "sample";
  body: Block[];
};

/**
 * Placeholder editorial content. Written to exercise the blog architecture
 * (list, search, filters, article template, related posts). Replace before launch;
 * authorship and dates are not real bylines. Add new posts by appending to this array.
 */
export const posts: Post[] = [
  {
    slug: "ai-pilot-production-gap",
    title: "The gap between an AI pilot and a product is evaluation, not models",
    excerpt:
      "Most stalled AI work is not stuck on capability. It is stuck because nobody defined what a good answer is, so no one could tell whether the next change helped.",
    category: "AI",
    tags: ["LLM", "Evaluation", "Product"],
    author: "Septa editorial",
    date: "2026-09-18",
    status: "sample",
    body: [
      {
        type: "p",
        text: "A pilot succeeds when somebody shows it to a room and the room says yes. A product starts where that leaves you: an owner for wrong answers, a cost budget, a latency limit, and a way to know whether version four is better or worse than version three. Teams that skip the last one drift, because every improvement argument becomes a taste argument.",
      },
      { type: "h2", text: "Write the failure down first" },
      {
        type: "p",
        text: "Before any retrieval design discussion, get the specific failures the business cannot tolerate. For a claims assistant it might be inventing a policy clause. For an internal search tool it might be citing a superseded document. Those failure modes decide the architecture far more than the choice of model, and they are cheap to state and expensive to discover in production.",
      },
      {
        type: "ul",
        items: [
          "Unacceptable error: what must never be output, and who sees it if it happens.",
          "Tolerated error rate: what fraction of answers may need correction before the feature loses trust.",
          "Latency budget: what the user will wait for, per interaction, not per benchmark run.",
          "Cost envelope: what one useful answer is allowed to cost, including retrieval and retries.",
          "Human step: where a person reviews, and what they can do about a bad answer in one click.",
        ],
      },
      { type: "h2", text: "Build the golden set with the domain team" },
      {
        type: "p",
        text: "A hundred examples chosen by an engineer measures what the engineer thought to test. A few hundred chosen with the people who do the job measure what the job actually contains: the awkward phrasing, the merged record, the attachment that is a scan of a scan. That set becomes the shared reference for every argument about quality, and it is the artefact that outlives the model choice.",
      },
      {
        type: "quote",
        text: "The eval set is the requirement. Everything else is an implementation detail you can change on a Tuesday.",
      },
      { type: "h2", text: "Score, then change" },
      {
        type: "p",
        text: "Once a baseline exists, model and prompt changes stop being frightening and start being decisions. Two things make this practical: run the suite in the pipeline so regressions block merges, and keep human review on a sample of live traffic so the suite does not quietly stop resembling reality.",
      },
      {
        type: "code",
        lang: "ts",
        text: "// The assertion that earns its keep: quality must not regress silently.\nconst before = await score(goldenSet, currentPrompt);\nconst after = await score(goldenSet, candidatePrompt);\n\nassertNoRegression(before, after, {\n  citationAccuracy: 0.97,\n  unsupportedClaims: 0.0,\n  p95LatencyMs: 900,\n});",
      },
      { type: "h2", text: "Instrument the thing you actually ship" },
      {
        type: "p",
        text: "Generative features need the same operational respect as any other service, plus three measures that are easy to forget: corrections made by users, refusal or fallback rates, and spend per useful output. Those are what let you argue for the next iteration with numbers rather than enthusiasm.",
      },
      {
        type: "p",
        text: "None of this slows the work down. It moves the difficult conversations from month six to week two, where they are much cheaper to have.",
      },
    ],
  },
  {
    slug: "automation-that-survives",
    title: "Automation that survives its first bad week",
    excerpt:
      "Fragile automation is rarely caused by a missing connector. It is caused by building the happy path and deciding what happens to failure later.",
    category: "Automation",
    tags: ["Integration", "Reliability", "Operations"],
    author: "Septa editorial",
    date: "2026-08-27",
    status: "sample",
    body: [
      {
        type: "p",
        text: "Every organisation has automation that quietly stopped working three months ago. The evidence is not an alert; it is a spreadsheet someone keeps because they no longer trust the flow. That failure mode is a design choice made at the start, when retries, ownership and replay were postponed.",
      },
      { type: "h2", text: "Assume the upstream system will misbehave" },
      {
        type: "ul",
        items: [
          "Rate limits and partial outages are normal operating conditions, not exceptions.",
          "Records arrive late, duplicated and out of order.",
          "A field that was always present last quarter becomes nullable next month.",
          "Credentials expire on a schedule that nobody owns.",
        ],
      },
      {
        type: "p",
        text: "Design for that reality: durable intake so nothing is lost while a dependency is down, idempotent writes so replays are safe, and an exception queue with a named owner instead of a log file.",
      },
      { type: "h2", text: "Give operators a replay button" },
      {
        type: "p",
        text: "The most used feature in any automation you build will be the one that re-runs yesterday's failed item after the data is fixed. It is cheap to build while the context is fresh and expensive to retrofit under pressure. It also changes who can maintain the system: with a replay tool and a queue view, the operations team owns it. Without, only the engineer who wrote it does.",
      },
      { type: "h2", text: "Alert on ageing, not on errors" },
      {
        type: "p",
        text: "A single failed record is noise; a record that has been failing for two hours is a problem. Alert thresholds set on queue depth and item age describe user-visible risk, and they keep the pager credible enough that people answer it.",
      },
      {
        type: "quote",
        text: "Automations do not fail loudly. They fail quietly and then get distrusted permanently.",
      },
      { type: "h2", text: "Remove steps before connecting them" },
      {
        type: "p",
        text: "The best automation project we have seen documented was a week of process review that deleted two approval steps and changed who entered a record once. The integration that followed was small. That ordering — map, cut, then connect — is the difference between a lighter workload and a faster version of the same wasted effort.",
      },
    ],
  },
  {
    slug: "legacy-system-questions",
    title: "Six questions to ask before anyone proposes rewriting your legacy system",
    excerpt:
      "Rewrite, extend, replace with a package, or live with it? The honest answer comes from constraints, not from how much the codebase offends anybody.",
    category: "Digital Transformation",
    tags: ["Modernisation", "Architecture", "Risk"],
    author: "Septa editorial",
    date: "2026-07-30",
    status: "sample",
    body: [
      {
        type: "p",
        text: "Legacy conversations go wrong when they become aesthetic. Five questions put the decision back on evidence.",
      },
      { type: "h3", text: "1. What does the system actually do?" },
      {
        type: "p",
        text: "Not what the documentation claims — what it does, including the rules that live in a nightly job and the workaround spreadsheet. If nobody can produce that inventory, the first project is characterisation, usually by replaying real traffic against a copy.",
      },
      { type: "h3", text: "2. Which parts are load-bearing for the business?" },
      {
        type: "p",
        text: "Some capabilities must behave identically for regulatory or downstream reasons. Some are legacy precisely because nobody depends on them. Splitting the two changes the size of the problem.",
      },
      { type: "h3", text: "3. What is the constraint that would make us regret a rewrite?" },
      {
        type: "ul",
        items: [
          "A fixed audit or reporting deadline during the change.",
          "One team that cannot be split across old and new work.",
          "Data that cannot be dual-written safely.",
          "Vendor licence expiry that sets the clock, not our preference.",
        ],
      },
      { type: "h3", text: "4. Can we take one journey at a time?" },
      {
        type: "p",
        text: "A strangler seam at the edge lets a new service absorb a single journey and roll back in configuration. That option is usually underrated, mostly because it produces fewer impressive diagrams.",
      },
      { type: "h3", text: "5. Who will observe the result?" },
      {
        type: "p",
        text: "Migration without instrumentation swaps a familiar unknown for a new one. SLOs, traces and a defined support model belong in slice one, so slice seven is boring.",
      },
      { type: "h3", text: "6. How does this end?" },
      {
        type: "p",
        text: "Decommissioning needs a named owner, an archival plan and sign-off, or the old system keeps being authoritative because it is still switched on. Programmes that skip that step are the reason the phrase 'temporary migration' is funny.",
      },
      {
        type: "quote",
        text: "Encapsulating a working system is often the cheapest senior engineering decision available.",
      },
    ],
  },
  {
    slug: "slos-that-mean-something",
    title: "Service level objectives that survive contact with a roadmap",
    excerpt:
      "An SLO is a written agreement about who suffers when reliability loses to features. If it does not change any decision, it is decoration.",
    category: "Monitoring",
    tags: ["SRE", "Reliability", "Alerting"],
    author: "Septa editorial",
    date: "2026-06-25",
    status: "sample",
    body: [
      {
        type: "p",
        text: "Most first attempts at SLOs produce a dashboard nobody argues with and a reliability report nobody reads. The test of a good objective is simpler: does it ever stop a release, and does it ever justify a piece of unglamorous work?",
      },
      { type: "h2", text: "Measure the symptom, not the cause" },
      {
        type: "p",
        text: "Availability of the host is not the user's experience. Choose the request path the business cares about — checkout, search, login — and measure success and latency there. Dependencies show up as symptoms without needing to be enumerated in advance.",
      },
      { type: "h2", text: "Negotiate the budget with product" },
      {
        type: "p",
        text: "An error budget is a shared allowance, agreed before the incident. If product owners have not signed up to the trade-off, the number becomes a policy nobody enforces, and the first breach turns into a negotiation instead of a decision.",
      },
      {
        type: "ul",
        items: [
          "Set targets from user impact, not from what current systems happen to achieve.",
          "State multi-window burn rates so a fast fire and a slow leak both page appropriately.",
          "Define who may spend the budget, and what buys it back.",
        ],
      },
      { type: "h2", text: "One screen per audience" },
      {
        type: "p",
        text: "Executives need status against targets. On-call needs the triage view: what is failing, since when, which deploy is suspect. Deep-dive belongs to the service team. A dashboard trying to be all three is usually used by none.",
      },
      { type: "h2", text: "Rewrite alerts until they are trustworthy" },
      {
        type: "p",
        text: "Page only where a person can act now; ticket everything else. Run new rules in shadow for a fortnight before cutover, and delete any panel whose purpose cannot be stated. Pager trust is a finite resource and it rebuilds slowly.",
      },
      {
        type: "quote",
        text: "Reliability work gets funded when somebody can point at the burn rate and name the customer journey at risk.",
      },
    ],
  },
  {
    slug: "maintainability-is-a-product-decision",
    title: "Maintainability is a product decision, not an engineering preference",
    excerpt:
      "The cost of the third year of a product is set by choices made in the first three months — and by whether anyone was accountable for them.",
    category: "Software Engineering",
    tags: ["Quality", "Architecture", "Delivery"],
    author: "Septa editorial",
    date: "2026-05-14",
    status: "sample",
    body: [
      {
        type: "p",
        text: "Speed and quality get presented as a trade-off in early conversations because it is an easy promise to make. In practice the variable that decides next year's velocity is decided now: can a change be made safely by someone who did not write the original?",
      },
      { type: "h2", text: "Tests that catch real regressions" },
      {
        type: "p",
        text: "Coverage as a target produces tests that assert the implementation and break on every refactor. Coverage on the paths that would hurt — money moved, permissions applied, records created — produces tests that earn their maintenance cost. The question is not how much is tested but which mistakes are impossible to ship.",
      },
      { type: "h2", text: "Data models age in public" },
      {
        type: "p",
        text: "Reporting questions arrive that the schema cannot answer, and the fix is either a migration or a permanent workaround in application code. Constraints, naming and relationship choices are product decisions with a long tail, which is why they deserve review alongside the interface.",
      },
      {
        type: "code",
        lang: "sql",
        text: "-- The boring choice that pays: enforce the rule the business stated,\n-- instead of trusting application paths to remember it.\nalter table work_orders\n  add constraint work_order_state_coherent\n  check (\n    (status = 'closed' and closed_at is not null) or\n    (status <> 'closed' and closed_at is null)\n  );",
      },
      { type: "h2", text: "Documentation for the next person" },
      {
        type: "ul",
        items: [
          "Why the boundary is where it is, not just where the files live.",
          "The one-page setup that gets a new engineer running in under an hour.",
          "Decisions that would be expensive to accidentally reverse.",
          "A runbook for each scheduled job, integration and failure mode.",
        ],
      },
      {
        type: "p",
        text: "All of this is cheap relative to the release it delays, and expensive relative to the quarter it is deferred into. It belongs in the plan as a stated product decision, not as an engineer's private battle.",
      },
    ],
  },
  {
    slug: "buying-technology-advice",
    title: "How to buy technology help without buying a dependency",
    excerpt:
      "A short field guide to engaging a delivery partner: what to ask, what a good answer sounds like, and which answers should worry you.",
    category: "Technology Strategy",
    tags: ["Procurement", "Delivery", "Governance"],
    author: "Septa editorial",
    date: "2026-04-09",
    status: "sample",
    body: [
      {
        type: "p",
        text: "The difference between a good engagement and an expensive one is rarely the quality of the engineers. It is whether ownership, evidence and exit were settled before work started.",
      },
      { type: "h2", text: "Ask who will actually do the work" },
      {
        type: "p",
        text: "If the people scoping the project are not the people building it, ask how that handoff is managed and what it has cost on a recent project. A credible answer names roles and a mechanism; a confident one about 'our delivery team' is a warning sign.",
      },
      { type: "h2", text: "Ask for the failure you should worry about" },
      {
        type: "p",
        text: "Every delivery shape has a characteristic failure mode: integration projects break on data quality, AI projects break on evaluation, transformations break on ownership. A partner who can name theirs and describe the early signal is worth more than one who claims a method that cannot fail.",
      },
      { type: "h2", text: "Set the evidence rhythm" },
      {
        type: "ul",
        items: [
          "Working software at a fixed interval, not status slides.",
          "Written trade-offs with the option you did not take and why.",
          "Measures agreed before build that decide whether the release worked.",
          "A visible change list so scope creep has a price, not a mood.",
        ],
      },
      { type: "h2", text: "Negotiate the exit on day one" },
      {
        type: "p",
        text: "Repositories, pipelines, cloud accounts and documentation should be yours, and transition should be scheduled rather than improvised at the end of a contract. If that request makes the proposal awkward, you have learned something useful early.",
      },
      {
        type: "quote",
        text: "The right partner is comfortable being planned around, not relied upon.",
      },
    ],
  },
];

export const postCategories = Array.from(new Set(posts.map((p) => p.category)));
export const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);
