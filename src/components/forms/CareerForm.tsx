import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Send } from "lucide-react";
import { ApiError, api } from "../../lib/api";
import { useForm, v } from "../../lib/form";
import { paths } from "../../lib/paths";
import {
  CV_ALLOWED_EXT,
  CV_MAX_BYTES,
  careerSchema,
  disciplines,
  type SubmissionResult,
} from "../../shared/schemas";
import { Button } from "../ui/Button";
import { CheckboxField, FileField, Honeypot, RadioCards, TextArea, TextField } from "../ui/form";
import { Callout, Pill } from "../ui/primitives";

type Phase = "form" | "sending" | "done" | "failed";

const emptyValues = (source: "careers-page" | "speculative") => ({
  fullName: "",
  email: "",
  role: "",
  roleDetail: "",
  location: "",
  portfolioUrl: "",
  linkedinUrl: "",
  note: "",
  cvFileName: "",
  cvSizeBytes: undefined,
  source,
  consent: false,
  _hp: "",
});

export function CareerForm({
  source = "careers-page",
  preselectRole,
}: {
  source?: "careers-page" | "speculative";
  preselectRole?: string;
}) {
  const form = useForm(careerSchema, { ...emptyValues(source), role: preselectRole ?? "" });
  const [phase, setPhase] = useState<Phase>("form");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const pickFile = (f: File | null) => {
    setFileError(null);
    if (f) {
      const ext = (f.name.split(".").pop() ?? "").toLowerCase();
      if (!CV_ALLOWED_EXT.includes(ext as (typeof CV_ALLOWED_EXT)[number])) {
        setFileError(`Unsupported file type. Allowed: ${CV_ALLOWED_EXT.join(", ")}.`);
        setFile(null);
        form.set("cvFileName", "");
        return;
      }
      if (f.size > CV_MAX_BYTES) {
        setFileError(`That file is ${(f.size / 1024 / 1024).toFixed(1)} MB. The limit is ${CV_MAX_BYTES / 1024 / 1024} MB.`);
        setFile(null);
        form.set("cvFileName", "");
        return;
      }
    }
    setFile(f);
    form.set("cvFileName", f?.name ?? "");
    form.patch({ cvSizeBytes: f?.size });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === "sending") return;
    if (fileError) return;
    form.setAttempted(true);
    const { data: raw, errors } = form.validate();
    if (!raw) {
      form.focusFirstError(Object.keys(errors));
      return;
    }
    setPhase("sending");
    setFailure(null);
    try {
      const res = await api.careersWithCv(raw, file);
      setResult(res);
      setPhase("done");
    } catch (err) {
      if (err instanceof ApiError) {
        if (Object.keys(err.fieldErrors).length) form.setErrors(err.fieldErrors);
        setFailure(err.message);
      } else {
        setFailure("We could not complete the submission. Please try again.");
      }
      setPhase("failed");
    }
  };

  if (phase === "done" && result) {
    return (
      <div className="card p-6 sm:p-8">
        <span className="flex size-10 items-center justify-center rounded-full bg-mint/15">
          <Check className="size-5 text-mint" aria-hidden />
        </span>
        <h2 className="mt-4 text-xl">Application received</h2>
        <p className="prose-body mt-2 text-[0.95rem]">
          Reference <span className="font-mono text-mint">{result.id}</span>. Keep it if you want to
          ask about your application later.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Pill tone={result.forwarded ? "mint" : "amber"}>
            {result.forwarded ? "Notified to the hiring inbox" : "Stored on the server, not emailed yet"}
          </Pill>
          {file ? <Pill tone="line">CV attached: {file.name}</Pill> : null}
        </div>
        {result.note ? <Callout kind="setup" className="mt-4">{result.note}</Callout> : null}
        <Callout kind="info" className="mt-4">
          What happens next is described above this form. We reply either way — including when there
          is no matching opening yet.
        </Callout>
        <div className="mt-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              form.reset(emptyValues(source));
              setFile(null);
              setResult(null);
              setPhase("form");
            }}
          >
            Send another application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form ref={form.formRef} onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
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

      <RadioCards
        label="Which area do you want to work in?"
        name="role"
        columns={2}
        value={v(form.values, "role")}
        onChange={(x) => form.set("role", x)}
        error={form.errors.role}
        options={disciplines.map((d) => ({ value: d }))}
      />

      {form.values.role === "Something else" ? (
        <TextField
          label="Describe the role you have in mind"
          value={v(form.values, "roleDetail")}
          onChange={(x) => form.set("roleDetail", x)}
          error={form.errors.roleDetail}
          maxLength={120}
        />
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Where are you based?"
          optional
          value={v(form.values, "location")}
          onChange={(x) => form.set("location", x)}
          error={form.errors.location}
          maxLength={120}
          hint="City and time zone is enough."
        />
        <TextField
          label="Portfolio or personal site"
          optional
          value={v(form.values, "portfolioUrl")}
          onChange={(x) => form.set("portfolioUrl", x)}
          error={form.errors.portfolioUrl}
          placeholder="https://…"
        />
      </div>

      <TextField
        label="LinkedIn profile"
        optional
        value={v(form.values, "linkedinUrl")}
        onChange={(x) => form.set("linkedinUrl", x)}
        error={form.errors.linkedinUrl}
        placeholder="https://linkedin.com/in/…"
      />

      <TextArea
        label={source === "speculative" ? "Why are you writing?" : "Why this work, and what would you bring?"}
        rows={6}
        maxLength={3000}
        value={v(form.values, "note")}
        onChange={(x) => form.set("note", x)}
        error={form.errors.note}
        hint="One specific thing you have built or fixed is worth more than a summary of your CV."
      />

      <FileField
        label="CV or résumé (optional)"
        accept={CV_ALLOWED_EXT.map((e) => "." + e).join(",")}
        file={file}
        onSelect={pickFile}
        error={fileError ?? form.errors.cvFileName}
        hint={`Up to ${CV_MAX_BYTES / 1024 / 1024} MB. ${CV_ALLOWED_EXT.join(", ")}. Stored privately — never published on the site.`}
      />

      <Honeypot value={v(form.values, "_hp")} onChange={(x) => form.set("_hp", x)} />

      <CheckboxField
        checked={form.values.consent === true}
        onChange={(x) => form.set("consent", x)}
        error={form.errors.consent}
        label={
          <>
            I agree that Septa may store this application, including any attached CV, to consider me
            for current and future roles, as described in the{" "}
            <Link to={paths.privacy()} className="text-mint underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </>
        }
      />

      {phase === "failed" && failure ? (
        <Callout kind="danger" title="Not sent">
          {failure} Your answers are still on the page.
        </Callout>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button
          type="submit"
          size="lg"
          disabled={phase === "sending" || Boolean(fileError)}
          iconStart={phase === "sending" ? undefined : <Send className="size-4" />}
        >
          {phase === "sending" ? "Submitting…" : source === "speculative" ? "Send expression of interest" : "Submit application"}
        </Button>
        <p className="text-[0.8rem] text-faint">
          Only you can see this submission; nothing here is published.
        </p>
      </div>
      <p aria-live="polite" className="sr-only">
        {phase === "sending" ? "Submitting your application" : phase === "failed" ? "Submission failed" : ""}
      </p>
    </form>
  );
}
