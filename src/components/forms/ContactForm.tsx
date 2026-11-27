import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Send } from "lucide-react";
import { ApiError, api } from "../../lib/api";
import { paths } from "../../lib/paths";
import { contactSchema, contactServices, type SubmissionResult } from "../../shared/schemas";
import { Button } from "../ui/Button";
import { CheckboxField, Honeypot } from "../ui/form";
import { Callout, Pill } from "../ui/primitives";

type Phase = "form" | "sending" | "done" | "failed";

const countryCodes = [
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+1", flag: "🇨🇦", name: "Canada" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+233", flag: "🇬🇭", name: "Ghana" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+", flag: "🌍", name: "Other" },
];

export function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [phoneNum, setPhoneNum] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState<string>(contactServices[0]);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [_hp, setHp] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<Phase>("form");
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhoneNum("");
    setCompany("");
    setService(contactServices[0]);
    setMessage("");
    setConsent(false);
    setHp("");
    setErrors({});
    setResult(null);
    setFailure(null);
    setPhase("form");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === "sending") return;

    const cleanPhone = phoneNum.trim() ? `${countryCode} ${phoneNum.trim()}` : undefined;

    // Validate using Zod schema
    const check = contactSchema.safeParse({
      fullName: fullName.trim(),
      phone: cleanPhone,
      company: company.trim() || undefined,
      email: email.trim(),
      service,
      message: message.trim(),
      consent,
      _hp: _hp || undefined,
    });

    if (!check.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of check.error.issues) {
        const key = issue.path[0]?.toString() || "form";
        if (key === "phone") {
          fieldErrors.phoneNum = issue.message;
        } else {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setPhase("sending");
    setFailure(null);

    try {
      const res = await api.contact(check.data);
      setResult(res);
      setPhase("done");
    } catch (err) {
      if (err instanceof ApiError) {
        if (Object.keys(err.fieldErrors).length) setErrors(err.fieldErrors);
        setFailure(err.message);
      } else {
        setFailure("Something unexpected happened on the way out. Please try again.");
      }
      setPhase("failed");
    }
  };

  if (phase === "done" && result) {
    return (
      <div className="rounded-card border border-mint/30 bg-surface-raised p-6 sm:p-10 shadow-soft">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-mint/15 text-mint">
          <Check className="size-6" />
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-fg">Message Received</h2>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
          Thank you for reaching out to Septa. Your enquiry has been securely logged under reference:{" "}
          <span className="font-mono font-semibold text-mint">{result.id}</span> at{" "}
          {new Date(result.receivedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.
        </p>

        <div className="mt-5">
          <Pill tone={result.forwarded ? "mint" : "amber"}>
            {result.forwarded
              ? "Forwarded to our engineering inbox"
              : "Saved on server · Awaiting SMTP forwarding"}
          </Pill>
        </div>

        {result.note ? <Callout kind="setup" className="mt-4">{result.note}</Callout> : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={resetForm}>
            Send another message
          </Button>
          <Button to={paths.request()} size="sm" iconEnd={<ArrowRight className="size-4" />}>
            Explore the 5-step Service Wizard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <Honeypot value={_hp} onChange={setHp} />

      {/* Name */}
      <div>
        <label htmlFor="full-name" className="mb-2 block text-[0.86rem] font-medium text-fg">
          Name <span className="sr-only">required</span>
        </label>
        <input
          id="full-name"
          type="text"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
          }}
          placeholder="Your full name"
          autoComplete="name"
          maxLength={120}
          aria-invalid={errors.fullName ? true : undefined}
          className="w-full"
        />
        {errors.fullName ? (
          <p className="mt-1.5 text-[0.8rem] text-rose">{errors.fullName}</p>
        ) : null}
      </div>

      {/* Phone Number with Country Code */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="phone-number" className="text-[0.86rem] font-medium text-fg">
            Phone number
          </label>
          <span className="font-mono text-[0.7rem] text-faint uppercase">optional</span>
        </div>
        <div className="grid grid-cols-[115px_1fr] gap-2">
          <div className="relative">
            <select
              aria-label="Country Code"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full font-mono text-[0.85rem]"
            >
              {countryCodes.map((c) => (
                <option key={`${c.name}-${c.code}`} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
          </div>
          <input
            id="phone-number"
            type="tel"
            value={phoneNum}
            onChange={(e) => {
              setPhoneNum(e.target.value);
              if (errors.phoneNum) setErrors((prev) => ({ ...prev, phoneNum: "" }));
            }}
            placeholder="810 000 0000"
            autoComplete="tel-national"
            maxLength={20}
            aria-invalid={errors.phoneNum ? true : undefined}
          />
        </div>
        {errors.phoneNum ? <p className="mt-1.5 text-[0.8rem] text-rose">{errors.phoneNum}</p> : null}
      </div>

      {/* Company Name */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="company-name" className="text-[0.86rem] font-medium text-fg">
            Company name
          </label>
          <span className="font-mono text-[0.7rem] text-faint uppercase">optional</span>
        </div>
        <input
          id="company-name"
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Your company or organisation"
          autoComplete="organization"
          maxLength={120}
          className="w-full"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="work-email" className="mb-2 block text-[0.86rem] font-medium text-fg">
          Email address <span className="sr-only">required</span>
        </label>
        <input
          id="work-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
          }}
          placeholder="you@company.com"
          autoComplete="email"
          maxLength={120}
          aria-invalid={errors.email ? true : undefined}
          className="w-full"
        />
        {errors.email ? <p className="mt-1.5 text-[0.8rem] text-rose">{errors.email}</p> : null}
      </div>

      {/* Message Textarea */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label htmlFor="build-message" className="text-[0.86rem] font-medium text-fg">
            What are you partnering with us to build?
          </label>
          <span className="font-mono text-[0.7rem] text-faint">
            {message.length}/4000
          </span>
        </div>
        <textarea
          id="build-message"
          rows={5}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
          }}
          placeholder="Briefly describe your product idea, business challenge, target timeline, or systems you want to automate..."
          maxLength={4000}
          aria-invalid={errors.message ? true : undefined}
          className="w-full"
        />
        {errors.message ? (
          <p className="mt-1.5 text-[0.8rem] text-rose">{errors.message}</p>
        ) : (
          <p className="mt-1 text-[0.78rem] text-faint">
            At least 20 characters. Please do not include passwords or confidential credentials.
          </p>
        )}
      </div>

      {/* Service Dropdown */}
      <div>
        <label htmlFor="service-select" className="mb-2 block text-[0.86rem] font-medium text-fg">
          What service do you need from us? <span className="sr-only">required</span>
        </label>
        <select
          id="service-select"
          value={service}
          onChange={(e) => {
            setService(e.target.value);
            if (errors.service) setErrors((prev) => ({ ...prev, service: "" }));
          }}
          aria-invalid={errors.service ? true : undefined}
          className="w-full"
        >
          {contactServices.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.service ? <p className="mt-1.5 text-[0.8rem] text-rose">{errors.service}</p> : null}
      </div>

      {/* Privacy Agreement Checkbox */}
      <CheckboxField
        checked={consent}
        onChange={(x) => {
          setConsent(x);
          if (errors.consent) setErrors((prev) => ({ ...prev, consent: "" }));
        }}
        error={errors.consent}
        label={
          <span className="text-[0.86rem] text-muted">
            You agree to our friendly{" "}
            <Link to={paths.privacy()} className="text-mint underline underline-offset-4 hover:text-mint-bright">
              privacy policy
            </Link>
            . We respect your data and never spam.
          </span>
        }
      />

      {/* Error Callout */}
      {phase === "failed" && failure ? (
        <Callout kind="danger" title="Message not sent">
          {failure} Your input remains intact. Please check details and try again.
        </Callout>
      ) : null}

      {/* Action Button */}
      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          disabled={phase === "sending"}
          className="w-full sm:w-auto"
          iconEnd={phase === "sending" ? undefined : <Send className="size-4" />}
        >
          {phase === "sending" ? "Sending your message…" : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
