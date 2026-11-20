
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Check, Send } from "lucide-react";

import { ApiError, api } from "../../lib/api";
import { useForm, v } from "../../lib/form";
import { paths } from "../../lib/paths";
import { openings } from "../../data/jobs";

import {
  CV_ALLOWED_EXT,
  CV_MAX_BYTES,
  careerSchema,
  disciplines,
  type SubmissionResult,
} from "../../shared/schemas";

import { Button } from "../ui/Button";

import {
  CheckboxField,
  FileField,
  Honeypot,
  RadioCards,
  TextArea,
  TextField,
} from "../ui/form";

import { Callout, Pill } from "../ui/primitives";

type Phase = "form" | "sending" | "done" | "failed";

type CareerSource = "careers-page" | "speculative";

interface CareerFormProps {
  source?: CareerSource;
  preselectRole?: string;
}

const careerRoleOptions = [
  ...new Set([
    ...openings.map((opening) => opening.title),
    ...disciplines,
  ]),
].map((title) => ({
  value: title,
}));

const emptyValues = (source: CareerSource) => ({
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
}: CareerFormProps) {
  const form = useForm(careerSchema, {
    ...emptyValues(source),
    role: preselectRole ?? "",
  });

  const [phase, setPhase] = useState<Phase>("form");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  // Keep the selected job synchronized with Apply buttons.
  // Preserve the candidate's other form answers.
  useEffect(() => {
    if (preselectRole !== undefined) {
      form.set("role", preselectRole);
    }
  }, [preselectRole]);

  // Keep application source synchronized.
  useEffect(() => {
    form.set("source", source);
  }, [source]);

  // Validate and store selected CV.
  const pickFile = (selectedFile: File | null) => {
    setFileError(null);

    if (selectedFile) {
      const ext = (
        selectedFile.name.split(".").pop() ?? ""
      ).toLowerCase();

      if (
        !CV_ALLOWED_EXT.includes(
          ext as (typeof CV_ALLOWED_EXT)[number]
        )
      ) {
        setFileError(
          `Unsupported file type. Allowed: ${CV_ALLOWED_EXT.join(", ")}.`
        );

        setFile(null);
        form.set("cvFileName", "");
        form.patch({ cvSizeBytes: undefined });
        return;
      }

      if (selectedFile.size > CV_MAX_BYTES) {
        setFileError(
          `That file is ${(selectedFile.size / 1024 / 1024).toFixed(1)} MB. The limit is ${CV_MAX_BYTES / 1024 / 1024} MB.`
        );

        setFile(null);
        form.set("cvFileName", "");
        form.patch({ cvSizeBytes: undefined });
        return;
      }
    }

    setFile(selectedFile);

    form.set(
      "cvFileName",
      selectedFile?.name ?? ""
    );

    form.patch({
      cvSizeBytes: selectedFile?.size,
    });
  };

  // Submit application.
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      const response = await api.careersWithCv(raw, file);

      setResult(response);
      setPhase("done");
    } catch (err) {
      if (err instanceof ApiError) {
        if (Object.keys(err.fieldErrors).length) {
          form.setErrors(err.fieldErrors);
        }

        setFailure(err.message);
      } else {
        setFailure(
          "We could not complete the submission. Please try again."
        );
      }

      setPhase("failed");
    }
  };

  // Reset form for another application.
  const resetApplication = () => {
    form.reset({
      ...emptyValues(source),
      role: preselectRole ?? "",
    });

    setFile(null);
    setFileError(null);
    setResult(null);
    setFailure(null);
    setPhase("form");
  };

  // Application success screen.
  if (phase === "done" && result) {
    return (
      <div
        className="card p-6 sm:p-8"
        role="status"
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-mint/15">
          <Check
            className="size-5 text-mint"
            aria-hidden="true"
          />
        </span>

        <h2 className="mt-4 text-xl">
          Application received
        </h2>

        <p className="prose-body mt-2 text-[0.95rem]">
          Thank you for your interest in joining Septa.
          Your application reference is{" "}
          <span className="font-mono text-mint">
            {result.id}
          </span>.
        </p>

        <p className="prose-body mt-2 text-sm">
          Keep this reference if you need to ask
          about your application later.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Pill
            tone={result.forwarded ? "mint" : "amber"}
          >
            {result.forwarded
              ? "Notified to the hiring inbox"
              : "Stored on the server, not emailed yet"}
          </Pill>

          {file && (
            <Pill tone="line">
              CV attached: {file.name}
            </Pill>
          )}
        </div>

        {result.note && (
          <Callout
            kind="setup"
            className="mt-4"
          >
            {result.note}
          </Callout>
        )}

        <Callout
          kind="info"
          className="mt-4"
        >
          You can review the hiring process above
          to understand the next stages.
        </Callout>

        <div className="mt-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={resetApplication}
          >
            Send another application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={form.formRef}
      onSubmit={onSubmit}
      noValidate
      className="card space-y-5 p-6 sm:p-8"
    >
      {/* Applicant details */}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full name"
          value={v(form.values, "fullName")}
          onChange={(value) =>
            form.set("fullName", value)
          }
          error={form.errors.fullName}
          autoComplete="name"
        />

        <TextField
          label="Email"
          type="email"
          value={v(form.values, "email")}
          onChange={(value) =>
            form.set("email", value)
          }
          error={form.errors.email}
          autoComplete="email"
        />
      </div>

      {/* Position selection */}
      <div>
        <RadioCards
          label="Which position are you interested in?"
          name="role"
          columns={2}
          value={v(form.values, "role")}
          onChange={(value) =>
            form.set("role", value)
          }
          error={form.errors.role}
          options={careerRoleOptions}
        />

              {typeof form.values.role === "string" &&
        form.values.role !== "" &&
        form.values.role !== "Something else" && (
          <p className="mt-3 text-sm text-mint">
            Selected position:{" "}
            <strong>{form.values.role}</strong>
          </p>
        )}
      </div>

      {/* Custom position */}
      {form.values.role === "Something else" && (
        <TextField
          label="Describe the role you have in mind"
          value={v(form.values, "roleDetail")}
          onChange={(value) =>
            form.set("roleDetail", value)
          }
          error={form.errors.roleDetail}
          maxLength={120}
        />
      )}

      {/* Location and portfolio */}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Where are you based?"
          optional
          value={v(form.values, "location")}
          onChange={(value) =>
            form.set("location", value)
          }
          error={form.errors.location}
          maxLength={120}
          hint="City and time zone is enough."
        />

        <TextField
          label="Portfolio or personal site"
          optional
          value={v(form.values, "portfolioUrl")}
          onChange={(value) =>
            form.set("portfolioUrl", value)
          }
          error={form.errors.portfolioUrl}
          placeholder="https://…"
        />
      </div>

      {/* LinkedIn */}
      <TextField
        label="LinkedIn profile"
        optional
        value={v(form.values, "linkedinUrl")}
        onChange={(value) =>
          form.set("linkedinUrl", value)
        }
        error={form.errors.linkedinUrl}
        placeholder="https://linkedin.com/in/…"
      />

      {/* Applicant message */}
      <TextArea
        label={
          source === "speculative"
            ? "Why are you writing?"
            : "Why this work, and what would you bring?"
        }
        rows={6}
        maxLength={3000}
        value={v(form.values, "note")}
        onChange={(value) =>
          form.set("note", value)
        }
        error={form.errors.note}
        hint="Tell us about your experience, interests, and the value you could bring to Septa."
      />

      {/* CV upload */}
      <FileField
        label="CV or résumé (optional)"
        accept={CV_ALLOWED_EXT.map(
          (ext) => "." + ext
        ).join(",")}
        file={file}
        onSelect={pickFile}
        error={
          fileError ?? form.errors.cvFileName
        }
        hint={`Up to ${CV_MAX_BYTES / 1024 / 1024} MB. ${CV_ALLOWED_EXT.join(", ")}. Stored privately and never published on the site.`}
      />

      {/* Spam protection */}
      <Honeypot
        value={v(form.values, "_hp")}
        onChange={(value) =>
          form.set("_hp", value)
        }
      />

      {/* Privacy consent */}
      <CheckboxField
        checked={form.values.consent === true}
        onChange={(value) =>
          form.set("consent", value)
        }
        error={form.errors.consent}
        label={
          <>
            I agree that Septa may store this
            application, including any attached CV,
            to consider me for current and future
            roles, as described in the{" "}
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

      {/* Submission error */}
      {phase === "failed" && failure && (
        <Callout
          kind="danger"
          title="Not sent"
        >
          {failure} Your answers are still on
          the page.
        </Callout>
      )}

      {/* Submit button */}
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button
          type="submit"
          size="lg"
          disabled={
            phase === "sending" ||
            Boolean(fileError)
          }
          iconStart={
            phase === "sending"
              ? undefined
              : (
                <Send className="size-4" />
              )
          }
        >
          {phase === "sending"
            ? "Submitting…"
            : source === "speculative"
              ? "Send expression of interest"
              : "Submit application"}
        </Button>

        <p className="text-[0.8rem] text-faint">
          Your application is private and
          will not be published.
        </p>
      </div>

      <p
        aria-live="polite"
        className="sr-only"
      >
        {phase === "sending"
          ? "Submitting your application"
          : phase === "failed"
            ? "Submission failed"
            : ""}
      </p>
    </form>
  );
}
