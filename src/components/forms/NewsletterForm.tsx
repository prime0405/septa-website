import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Send } from "lucide-react";
import { ApiError, api } from "../../lib/api";
import { useForm, v } from "../../lib/form";
import { paths } from "../../lib/paths";
import { newsletterSchema, type SubmissionResult } from "../../shared/schemas";
import { Button } from "../ui/Button";
import { CheckboxField, Honeypot, TextField } from "../ui/form";
import { Callout } from "../ui/primitives";

const empty = { email: "", consent: false, _hp: "" };

/**
 * Footer newsletter sign-up. The address is only treated as subscribed once the API
 * has written the row and returned `ok: true`.
 */
export function NewsletterForm() {
  const form = useForm(newsletterSchema, empty);
  const [phase, setPhase] = useState<"form" | "sending" | "done" | "failed">("form");
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
      setResult(await api.newsletter(payload));
      setPhase("done");
    } catch (err) {
      if (err instanceof ApiError) {
        if (Object.keys(err.fieldErrors).length) form.setErrors(err.fieldErrors);
        setFailure(err.message);
      } else {
        setFailure("Something unexpected happened. Please try again.");
      }
      setPhase("failed");
    }
  };

  if (phase === "done" && result) {
    return (
      <div className="rounded-card border border-mint/30 bg-surface p-5">
        <p className="flex items-center gap-2 text-[0.95rem] text-fg">
          <Check className="size-4 shrink-0 text-mint" aria-hidden />
          Address saved.
        </p>
        <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">
          Reference <span className="font-mono text-mint">{result.id}</span>. Nothing is sent to you
          until Septa has a newsletter to send.
        </p>
        <button
          type="button"
          onClick={() => {
            form.reset(empty);
            setResult(null);
            setPhase("form");
          }}
          className="mt-3 text-[0.82rem] text-faint underline underline-offset-4 transition-colors hover:text-mint"
        >
          Add another address
        </button>
      </div>
    );
  }

  return (
    <form ref={form.formRef} onSubmit={onSubmit} noValidate className="space-y-3">
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-[190px] flex-1">
          <TextField
            label="Email address"
            srOnlyLabel
            type="email"
            value={v(form.values, "email")}
            onChange={(x) => form.set("email", x)}
            error={form.errors.email}
            autoComplete="email"
            placeholder="you@company.com"
          />
        </div>
        <Button
          type="submit"
          disabled={phase === "sending"}
          className="mt-0.5"
          iconStart={phase === "sending" ? undefined : <Send className="size-4" />}
        >
          {phase === "sending" ? "Sending…" : "Subscribe"}
        </Button>
      </div>
      <Honeypot value={v(form.values, "_hp")} onChange={(x) => form.set("_hp", x)} />
      <CheckboxField
        checked={form.values.consent === true}
        onChange={(x) => form.set("consent", x)}
        error={form.errors.consent}
        label={
          <>
            Keep my address on Septa&rsquo;s list, as described in the{" "}
            <Link to={paths.privacy()} className="text-mint underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </>
        }
      />
      {phase === "failed" && failure ? (
        <Callout kind="danger" title="Not saved">
          {failure}
        </Callout>
      ) : null}
      <p aria-live="polite" className="sr-only">
        {phase === "sending" ? "Saving your address" : phase === "failed" ? "Could not save" : ""}
      </p>
    </form>
  );
}
