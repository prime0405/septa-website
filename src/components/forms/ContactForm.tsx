import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Send } from "lucide-react";
import { ApiError, api } from "../../lib/api";
import { useForm, v } from "../../lib/form";
import { paths } from "../../lib/paths";
import { contactSchema, inquiryTypes, type SubmissionResult } from "../../shared/schemas";
import { Button } from "../ui/Button";
import { CheckboxField, Honeypot, SelectField, TextArea, TextField } from "../ui/form";
import { Callout, Pill } from "../ui/primitives";

type Phase = "form" | "sending" | "done" | "failed";

const emptyValues = (defaultInquiry?: string) => ({
  fullName: "",
  email: "",
  company: "",
  inquiryType: defaultInquiry ?? "",
  message: "",
  consent: false,
  _hp: "",
});

export function ContactForm({ defaultInquiry }: { defaultInquiry?: string }) {
  const form = useForm(contactSchema, emptyValues(defaultInquiry));
  const [phase, setPhase] = useState<Phase>("form");
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === "sending") return;
    form.setAttempted(true);
    const { data: payload, errors } = form.validate();
    if (!payload) {
      form.focusFirstError(Object.keys(errors));
      return;
    }
    setPhase("sending");
    setFailure(null);
    try {
      const res = await api.contact(payload);
      setResult(res);
      setPhase("done");
    } catch (err) {
      if (err instanceof ApiError) {
        if (Object.keys(err.fieldErrors).length) form.setErrors(err.fieldErrors);
        setFailure(err.message);
      } else {
        setFailure("Something unexpected happened on the way out. Please try again.");
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
        <h2 className="mt-4 text-xl">Message received</h2>
        <p className="prose-body mt-2 text-[0.95rem]">
          Your enquiry is recorded with reference{" "}
          <span className="font-mono text-mint">{result.id}</span> at{" "}
          {new Date(result.receivedAt).toLocaleString()}.
        </p>
        <div className="mt-4">
          <Pill tone={result.forwarded ? "mint" : "amber"}>
            {result.forwarded ? "Delivered to the team inbox" : "Stored on the server, not emailed yet"}
          </Pill>
        </div>
        {result.note ? <Callout kind="setup" className="mt-4">{result.note}</Callout> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              form.reset(emptyValues(defaultInquiry));
              setResult(null);
              setPhase("form");
            }}
          >
            Send another message
          </Button>
          <Button to={paths.request()} size="sm" iconEnd={<ArrowRight className="size-4" />}>
            Request a Service instead
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form ref={form.formRef} onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
      <TextField
        label="Full name"
        value={v(form.values, "fullName")}
        onChange={(x) => form.set("fullName", x)}
        error={form.errors.fullName}
        autoComplete="name"
        maxLength={120}
        placeholder="Your name"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Email address"
          type="email"
          value={v(form.values, "email")}
          onChange={(x) => form.set("email", x)}
          error={form.errors.email}
          autoComplete="email"
          placeholder="you@company.com"
        />
        <TextField
          label="Company"
          optional
          value={v(form.values, "company")}
          onChange={(x) => form.set("company", x)}
          error={form.errors.company}
          autoComplete="organization"
          maxLength={120}
        />
      </div>
      <SelectField
        label="What is this about?"
        options={inquiryTypes}
        value={v(form.values, "inquiryType")}
        onChange={(x) => form.set("inquiryType", x)}
        error={form.errors.inquiryType}
      />
      <TextArea
        label="Message"
        rows={6}
        maxLength={4000}
        value={v(form.values, "message")}
        onChange={(x) => form.set("message", x)}
        error={form.errors.message}
        hint="A paragraph of context helps more than a one-liner. Please leave out anything confidential."
        placeholder="What are you trying to do, and what is getting in the way?"
      />
      <Honeypot value={v(form.values, "_hp")} onChange={(x) => form.set("_hp", x)} />
      <CheckboxField
        checked={form.values.consent === true}
        onChange={(x) => form.set("consent", x)}
        error={form.errors.consent}
        label={
          <>
            I agree that Septa may store and use the details above to reply to this enquiry, as
            described in the{" "}
            <Link to={paths.privacy()} className="text-mint underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </>
        }
      />

      {phase === "failed" && failure ? (
        <Callout kind="danger" title="Not sent">
          {failure} Your text is still on the page — adjust it and press send again.
        </Callout>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button
          type="submit"
          size="lg"
          disabled={phase === "sending"}
          iconStart={phase === "sending" ? undefined : <Send className="size-4" />}
        >
          {phase === "sending" ? "Sending…" : "Send message"}
        </Button>
        <p className="text-[0.8rem] text-faint">Checked in your browser, then checked again on our server.</p>
      </div>
      <p aria-live="polite" className="sr-only">
        {phase === "sending" ? "Sending your message" : phase === "failed" ? "Message failed to send" : ""}
      </p>
    </form>
  );
}
