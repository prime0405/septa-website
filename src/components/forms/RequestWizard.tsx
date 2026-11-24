import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Brain, Check, Layers, Pencil, RotateCcw, Send, Users } from "lucide-react";
import { ApiError, api } from "../../lib/api";
import { cn } from "../../lib/cn";
import { useForm, v } from "../../lib/form";
import { paths } from "../../lib/paths";
import {
  budgetRanges,
  contactMethods,
  engagementTypes,
  projectStages,
  requestSchema,
  requestStep1,
  requestStep2,
  requestStep3,
  requestStep4,
  timelines,
  type SubmissionResult,
} from "../../shared/schemas";
import { Button } from "../ui/Button";
import { CheckboxField, Honeypot, RadioCards, SelectField, TextArea, TextField } from "../ui/form";
import { Callout, Pill } from "../ui/primitives";

const DRAFT_KEY = "septa.request-draft";

const STEPS = [
  { key: "service", label: "Service", blurb: "What you need" },
  { key: "project", label: "Project", blurb: "The problem and the shape of work" },
  { key: "details", label: "Details", blurb: "Budget, timing, stage" },
  { key: "contact", label: "Contact", blurb: "How to reach you" },
  { key: "review", label: "Review", blurb: "Check, then send" },
] as const;

const SERVICE_OPTIONS = [
  { value: "AI Product Development", blurb: "Assistants, retrieval, prediction, evaluation.", icon: <Brain className="size-4" /> },
  { value: "Traditional Product Development", blurb: "Software products built to be maintained.", icon: <Layers className="size-4" /> },
  { value: "Workflow Automation", blurb: "Connect systems, remove manual handoffs.", icon: <RotateCcw className="size-4" /> },
  { value: "Digital Transformation", blurb: "Modernise legacy technology and operations." },
  { value: "Observability & Monitoring", blurb: "Metrics, traces, alerting, reliability." },
  { value: "Talent Solutions", blurb: "Engineers, squads or hiring support.", icon: <Users className="size-4" /> },
  { value: "Other", blurb: "Not sure yet. Describe it instead." },
];

const EMPTY = {
  service: "",
  relatedService: "",
  projectName: "",
  problem: "",
  description: "",
  outcomes: "",
  technicalRequirements: "",
  organisation: "",
  budget: "",
  timeline: "",
  stage: "",
  engagement: "",
  fullName: "",
  email: "",
  phone: "",
  preferredContact: "",
  consent: false,
  _hp: "",
};

type Phase = "editing" | "sending" | "done";

export function RequestWizard({ preselected }: { preselected?: string }) {
  const reduce = useReducedMotion();
  const bootstrap = useMemo(() => {
    let values: Record<string, unknown> = { ...EMPTY, service: preselected ?? "" };
    let hadDraft = false;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        values = { ...values, ...(JSON.parse(raw) as Record<string, unknown>), consent: false, _hp: "" };
        hadDraft = true;
      }
    } catch {
      /* an unreadable draft is simply ignored */
    }
    return { values, hadDraft };
  }, [preselected]);

  const form = useForm(requestSchema, bootstrap.values);
  const [restored, setRestored] = useState(bootstrap.hadDraft);
  const [step, setStep] = useState(preselected && !bootstrap.hadDraft ? 1 : 0);
  const [maxVisited, setMaxVisited] = useState(preselected && !bootstrap.hadDraft ? 1 : 0);
  const [phase, setPhase] = useState<Phase>("editing");
  const [stepError, setStepError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const sendingRef = useRef(false);
  const topRef = useRef<HTMLDivElement | null>(null);

  // Persist the draft so a refresh or a lost tab does not throw away a long answer.
  useEffect(() => {
    if (phase === "done") return;
    const t = window.setTimeout(() => {
      try {
        const { consent: _c, _hp: _h, ...safe } = form.values;
        localStorage.setItem(DRAFT_KEY, JSON.stringify(safe));
      } catch {
        /* storage full or blocked — the form still works in memory */
      }
    }, 400);
    return () => window.clearTimeout(t);
  }, [form.values, phase]);

  const stepSchemas = [requestStep1, requestStep2, requestStep3, requestStep4];

  const scrollTop = () =>
    topRef.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });

  const goNext = () => {
    setStepError(null);
    if (step >= STEPS.length - 1) return;
    const check = stepSchemas[step].safeParse(form.values);
    if (!check.success) {
      const flat = Object.fromEntries(check.error.issues.map((i) => [String(i.path[0]), i.message]));
      form.setErrors(flat);
      form.focusFirstError(Object.keys(flat));
      setStepError("Please complete this step before continuing.");
      return;
    }
    // drop blank optional fields so validation does not reject empty strings
    form.patch(cleanOptionals(form.values));
    const next = step + 1;
    setStep(next);
    setMaxVisited((m) => Math.max(m, next));
    scrollTop();
  };

  const goBack = () => {
    setStepError(null);
    setStep((s) => Math.max(0, s - 1));
    scrollTop();
  };

  const jumpTo = (i: number) => {
    if (phase === "sending") return;
    if (i > maxVisited) return;
    setStepError(null);
    setStep(i);
    scrollTop();
  };

  const submit = async () => {
    if (sendingRef.current) return;
    sendingRef.current = true;
    setFailure(null);
    const payload = cleanOptionals(form.values);
    const check = requestSchema.safeParse(payload);
    if (!check.success) {
      const flat = Object.fromEntries(check.error.issues.map((i) => [String(i.path[0]), i.message]));
      form.setErrors(flat);
      setStepError("Some answers are missing or invalid. Use the step buttons above to correct them.");
      sendingRef.current = false;
      return;
    }
    setPhase("sending");
    try {
      const res = await api.request(check.data as Record<string, unknown>);
      setResult(res);
      setPhase("done");
      localStorage.removeItem(DRAFT_KEY);
    } catch (err) {
      if (err instanceof ApiError) {
        if (Object.keys(err.fieldErrors).length) form.setErrors(err.fieldErrors);
        setFailure(err.message);
      } else {
        setFailure("We could not reach the server, so the request was not sent. Your answers are still here. Try again in a moment.");
      }
      setPhase("editing");
    } finally {
      sendingRef.current = false;
    }
  };

  if (phase === "done" && result) {
    return (
      <RequestConfirmation result={result} onRestart={() => {
        form.reset(EMPTY);
        setStep(0);
        setMaxVisited(0);
        setResult(null);
        setPhase("editing");
      }} />
    );
  }

  const isReview = step === STEPS.length - 1;

  return (
    <div ref={topRef} className="card request-console overflow-hidden">
      <div className="request-console-topline">
        <span className="request-console-kicker"><span className="request-console-live" /> SEPTA / INTAKE CONSOLE</span>
        <span className="request-console-encrypted">PRIVATE PROJECT ENQUIRY</span>
      </div>
      <StepHeader step={step} maxVisited={maxVisited} onJump={jumpTo} disabled={phase === "sending"} />

      <div className="request-console-body p-5 sm:p-8">
        {restored && step === 0 ? (
          <Callout kind="info" className="mb-5" title="Draft restored">
            We found your unfinished request from an earlier visit on this device.{" "}
            <button
              type="button"
              className="text-mint underline underline-offset-4"
              onClick={() => {
                localStorage.removeItem(DRAFT_KEY);
                form.reset({ ...EMPTY, service: preselected ?? "" });
                setRestored(false);
                setStep(0);
                setMaxVisited(0);
              }}
            >
              Discard it and start again
            </button>
            .
          </Callout>
        ) : null}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -14 }}
            transition={{ duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 0 ? (
              <StepShell
                index={0}
                title="Which service do you need?"
                hint="Pick the closest match. If several apply, choose the one you would want to start with, and we will map the rest together."
              >
                <RadioCards
                  label="Service"
                  name="service"
                  columns={1}
                  value={v(form.values, "service")}
                  onChange={(x) => form.set("service", x)}
                  error={form.errors.service}
                  options={SERVICE_OPTIONS}
                />
                {form.values.service === "Other" ? (
                  <TextField
                    label="What are you actually looking for?"
                    value={v(form.values, "relatedService")}
                    onChange={(x) => form.set("relatedService", x)}
                    error={form.errors.relatedService}
                    maxLength={120}
                  />
                ) : null}
              </StepShell>
            ) : null}

            {step === 1 ? (
              <StepShell
                index={1}
                title="Describe the project"
                hint="Write it the way you would explain it to a colleague. Rough is fine. This is what we read first."
              >
                <div className="space-y-5">
                  <TextField
                    label="Project or initiative name"
                    value={v(form.values, "projectName")}
                    onChange={(x) => form.set("projectName", x)}
                    error={form.errors.projectName}
                    maxLength={120}
                    placeholder="e.g. Claims triage assistant"
                  />
                  <TextArea
                    label="Problem to solve"
                    rows={4}
                    maxLength={2500}
                    value={v(form.values, "problem")}
                    onChange={(x) => form.set("problem", x)}
                    error={form.errors.problem}
                    placeholder="What is happening today, and why is it a problem?"
                  />
                  <TextArea
                    label="Project description"
                    rows={5}
                    maxLength={4000}
                    value={v(form.values, "description")}
                    onChange={(x) => form.set("description", x)}
                    error={form.errors.description}
                    placeholder="What you imagine the thing being built or changed looks like."
                  />
                  <TextArea
                    label="Desired outcomes"
                    optional
                    rows={3}
                    maxLength={2000}
                    value={v(form.values, "outcomes")}
                    onChange={(x) => form.set("outcomes", x)}
                    error={form.errors.outcomes}
                    hint="How will you know this worked?"
                  />
                  <TextArea
                    label="Relevant technical requirements"
                    optional
                    rows={3}
                    maxLength={2000}
                    value={v(form.values, "technicalRequirements")}
                    onChange={(x) => form.set("technicalRequirements", x)}
                    error={form.errors.technicalRequirements}
                    hint="Stacks, systems, data sources, integrations, hosting or security constraints."
                  />
                </div>
              </StepShell>
            ) : null}

            {step === 2 ? (
              <StepShell
                index={2}
                title="Project details"
                hint="Rough answers are useful. Budget and timeline especially help us propose a realistic shape of work."
              >
                <div className="space-y-5">
                  <TextField
                    label="Organisation or company name"
                    value={v(form.values, "organisation")}
                    onChange={(x) => form.set("organisation", x)}
                    error={form.errors.organisation}
                    autoComplete="organization"
                    maxLength={140}
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <SelectField
                      label="Estimated budget range"
                      optional
                      options={budgetRanges}
                      value={v(form.values, "budget")}
                      onChange={(x) => form.set("budget", x)}
                      error={form.errors.budget}
                      placeholder="Prefer not to say"
                    />
                    <SelectField
                      label="Desired timeline"
                      optional
                      options={timelines}
                      value={v(form.values, "timeline")}
                      onChange={(x) => form.set("timeline", x)}
                      error={form.errors.timeline}
                    />
                    <SelectField
                      label="Current project stage"
                      optional
                      options={projectStages}
                      value={v(form.values, "stage")}
                      onChange={(x) => form.set("stage", x)}
                      error={form.errors.stage}
                    />
                    <SelectField
                      label="Preferred engagement type"
                      optional
                      options={engagementTypes}
                      value={v(form.values, "engagement")}
                      onChange={(x) => form.set("engagement", x)}
                      error={form.errors.engagement}
                    />
                  </div>
                </div>
              </StepShell>
            ) : null}

            {step === 3 ? (
              <StepShell
                index={3}
                title="How do we reach you?"
                hint="A work email is best. We only use these details to answer this request."
              >
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField
                      label="Full name"
                      value={v(form.values, "fullName")}
                      onChange={(x) => form.set("fullName", x)}
                      error={form.errors.fullName}
                      autoComplete="name"
                    />
                    <TextField
                      label="Email"
                      type="email"
                      value={v(form.values, "email")}
                      onChange={(x) => form.set("email", x)}
                      error={form.errors.email}
                      autoComplete="email"
                    />
                  </div>
                  <TextField
                    label="Phone"
                    optional
                    type="tel"
                    value={v(form.values, "phone")}
                    onChange={(x) => form.set("phone", x)}
                    error={form.errors.phone}
                    autoComplete="tel"
                  />
                  <RadioCards
                    label="Preferred contact method"
                    name="preferredContact"
                    columns={2}
                    value={v(form.values, "preferredContact")}
                    onChange={(x) => form.set("preferredContact", x)}
                    error={form.errors.preferredContact}
                    options={contactMethods.map((m) => ({ value: m }))}
                  />
                  <Honeypot value={v(form.values, "_hp")} onChange={(x) => form.set("_hp", x)} />
                  <CheckboxField
                    checked={form.values.consent === true}
                    onChange={(x) => form.set("consent", x)}
                    error={form.errors.consent}
                    label={
                      <>
                        I consent to Septa storing this request and contacting me about it, as set
                        out in the{" "}
                        <Link
                          to={paths.privacy()}
                          className="text-mint underline underline-offset-4"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </>
                    }
                  />
                </div>
              </StepShell>
            ) : null}

            {isReview ? (
              <StepShell
                index={4}
                title="Review before sending"
                hint="Nothing is submitted until you press send. Use the edit buttons to change any step."
              >
                <ReviewList values={form.values} onEdit={jumpTo} />
                {failure ? (
                  <Callout kind="danger" title="Submission failed" className="mt-5">
                    {failure} Your answers are preserved.
                  </Callout>
                ) : null}
                {phase === "sending" ? (
                  <Callout kind="info" title="Sending" className="mt-5">
                    Handing your request to the server…
                  </Callout>
                ) : null}
              </StepShell>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {stepError ? (
          <p role="alert" className="mt-4 text-[0.85rem] text-rose">
            {stepError}
          </p>
        ) : null}

        <div className="request-console-actions mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <Button
            variant="ghost"
            size="md"
            onClick={goBack}
            disabled={step === 0 || phase === "sending"}
            iconStart={<ArrowLeft className="size-4" />}
          >
            Back
          </Button>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.74rem] text-faint">
              Step {step + 1} of {STEPS.length}
            </span>
            {isReview ? (
              <Button
                size="lg"
                onClick={submit}
                disabled={phase === "sending"}
                iconStart={phase === "sending" ? undefined : <Send className="size-4" />}
              >
                {phase === "sending" ? "Sending…" : "Send request"}
              </Button>
            ) : (
              <Button size="lg" onClick={goNext} disabled={phase === "sending"} iconEnd={<ArrowRight className="size-4" />}>
                Continue
              </Button>
            )}
          </div>
        </div>

        <p className="request-console-footnote mt-3 text-[0.78rem] text-faint">
          Your answers are saved on this device as a draft until you send the request (stored under{" "}
          <code className="font-mono">{DRAFT_KEY}</code>).{" "}
          <Link to={paths.privacy()} className="text-mint underline underline-offset-4">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------- pieces ------------------------------- */

function StepHeader({
  step,
  maxVisited,
  onJump,
  disabled,
}: {
  step: number;
  maxVisited: number;
  onJump: (i: number) => void;
  disabled: boolean;
}) {
  const pct = ((step + 1) / STEPS.length) * 100;
  return (
    <div className="request-console-steps border-b border-line bg-ink-raised px-5 py-5 sm:px-7">
      <ol className="flex items-center gap-2 overflow-x-auto pb-3">
        {STEPS.map((s, i) => {
          const state = i === step ? "current" : i < step ? "done" : i <= maxVisited ? "visited" : "todo";
          const clickable = i <= maxVisited && !disabled;
          return (
            <li key={s.key} className="flex min-w-0 shrink-0 items-center gap-1">
              <motion.button
                type="button"
                disabled={!clickable}
                onClick={() => onJump(i)}
                aria-current={state === "current" ? "step" : undefined}
                whileHover={clickable ? { y: -2, scale: 1.025 } : undefined}
                whileTap={clickable ? { scale: 0.97 } : undefined}
                layout
                className={cn(
                  "relative flex items-center gap-2 overflow-hidden rounded-pill border px-3 py-1.5 text-[0.78rem] transition-colors",
                  state === "current" && "border-mint bg-mint/10 text-mint shadow-[0_0_24px_rgba(109,177,174,.12)]",
                  state === "done" && "border-line bg-surface text-muted hover:text-fg",
                  state === "visited" && "border-line text-muted hover:text-fg",
                  state === "todo" && "border-line-soft text-faint",
                  !clickable && "cursor-default",
                )}
              >
                {state === "current" ? <motion.span layoutId="request-step-indicator" className="absolute inset-x-0 bottom-0 h-0.5 bg-mint" /> : null}
                <span className="relative font-mono text-[0.7rem]">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative">{s.label}</span>
                {state === "done" ? <Check className="relative size-3" aria-hidden /> : null}
              </motion.button>
            </li>
          );
        })}
      </ol>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-line-soft">
        <motion.div
          className="h-full rounded-full bg-mint shadow-[0_0_14px_rgba(109,177,174,.55)]"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 180, damping: 24 }}
          aria-hidden
        />
      </div>
      <div className="mt-2 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">
        <span>{STEPS[step].blurb}</span>
        <span>{String(Math.round(pct)).padStart(3, "0")}%</span>
      </div>
      <p className="sr-only" aria-live="polite">
        Step {step + 1} of {STEPS.length}: {STEPS[step].label}. {STEPS[step].blurb}.
      </p>
    </div>
  );
}

function StepShell({
  index,
  title,
  hint,
  children,
}: {
  index: number;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div data-form-anchor tabIndex={-1} className="request-step-content focus:outline-none">
      <div className="request-step-heading"><span className="request-step-index">0{index + 1} / 05</span><h2 className="text-[1.55rem] sm:text-[1.8rem]">{title}</h2></div>
      <p className="prose-body mt-2 max-w-2xl text-[0.92rem]">{hint}</p>
      <div className="mt-6">{children}</div>
      <p className="sr-only">Step {index + 1}.</p>
    </div>
  );
}

const LABELS: Record<string, string> = {
  service: "Service",
  relatedService: "Also relevant",
  projectName: "Project name",
  problem: "Problem to solve",
  description: "Project description",
  outcomes: "Desired outcomes",
  technicalRequirements: "Technical requirements",
  organisation: "Organisation",
  budget: "Budget range",
  timeline: "Timeline",
  stage: "Project stage",
  engagement: "Engagement type",
  fullName: "Name",
  email: "Email",
  phone: "Phone",
  preferredContact: "Preferred contact",
};

function ReviewList({
  values,
  onEdit,
}: {
  values: Record<string, unknown>;
  onEdit: (step: number) => void;
}) {
  const groups = [
    { step: 0, keys: ["service", "relatedService"] },
    { step: 1, keys: ["projectName", "problem", "description", "outcomes", "technicalRequirements"] },
    { step: 2, keys: ["organisation", "budget", "timeline", "stage", "engagement"] },
    { step: 3, keys: ["fullName", "email", "phone", "preferredContact"] },
  ];

  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.step} className="rounded-card border border-line bg-surface">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <p className="font-mono text-[0.7rem] tracking-wider text-faint uppercase">
              Step {g.step + 1}: {STEPS[g.step].label}
            </p>
            <button
              type="button"
              onClick={() => onEdit(g.step)}
              className="inline-flex items-center gap-1.5 rounded-pill border border-line px-2.5 py-1 text-[0.76rem] text-muted transition-colors hover:border-mint/45 hover:text-mint"
            >
              <Pencil className="size-3" aria-hidden />
              Edit
            </button>
          </div>
          <dl className="divide-y divide-line-soft">
            {g.keys
              .filter((k) => String(values[k] ?? "").trim().length > 0)
              .map((k) => (
                <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[170px_1fr] sm:gap-4">
                  <dt className="text-[0.8rem] text-faint">{LABELS[k]}</dt>
                  <dd className="text-[0.88rem] whitespace-pre-wrap text-fg">{String(values[k])}</dd>
                </div>
              ))}
            {g.keys.every((k) => String(values[k] ?? "").trim().length === 0) ? (
              <p className="px-4 py-3 text-[0.82rem] text-faint">Nothing captured here yet.</p>
            ) : null}
          </dl>
        </div>
      ))}
    </div>
  );
}

function RequestConfirmation({ result, onRestart }: { result: SubmissionResult; onRestart: () => void }) {
  return (
    <div className="card p-6 sm:p-9">
      <span className="flex size-11 items-center justify-center rounded-full bg-mint/15">
        <Check className="size-5.5 text-mint" aria-hidden />
      </span>
      <h2 className="mt-5 text-[1.6rem]">Request received</h2>
      <p className="prose-body mt-3 text-[0.98rem]">
        Your request is stored with reference{" "}
        <span className="font-mono text-mint">{result.id}</span>, timestamped{" "}
        {new Date(result.receivedAt).toLocaleString()}. Quote that reference in any follow-up.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Pill tone={result.forwarded ? "mint" : "amber"}>
          {result.forwarded ? "Routed to the team inbox" : "Recorded in the submission store"}
        </Pill>
        <Pill tone="line">Draft cleared from this device</Pill>
      </div>
      {result.note ? <Callout kind="setup" className="mt-5">{result.note}</Callout> : null}

      <div className="mt-6 rounded-card border border-line bg-surface p-5">
        <p className="eyebrow mb-3">What happens next</p>
        <ol className="space-y-2.5 text-[0.9rem] text-muted">
          <li className="flex gap-3">
            <span className="font-mono text-mint">01</span> A person reads the request and works out
            which discipline the problem actually sits in.
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-mint">02</span> You get a reply with a point of view, even
            when the answer is "this is not a job for us".
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-mint">03</span> If it fits, we set up a working session
            and bring the right people.
          </li>
        </ol>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        <Button variant="secondary" size="sm" onClick={onRestart}>
          Start another request
        </Button>
        <Button to={paths.cases()} size="sm">
          Read how similar work went
        </Button>
      </div>
    </div>
  );
}

/** Optional enums arrive as empty strings from the selects; zod wants undefined. */
function cleanOptionals(values: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, val] of Object.entries(values)) {
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed === "") {
        if (["budget", "timeline", "stage", "engagement", "phone", "relatedService", "outcomes", "technicalRequirements", "company"].includes(k)) {
          continue;
        }
        out[k] = "";
        continue;
      }
      out[k] = trimmed;
    } else {
      out[k] = val;
    }
  }
  return out;
}
