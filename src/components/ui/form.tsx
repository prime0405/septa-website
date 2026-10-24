import { useId } from "react";
import type { ReactNode } from "react";
import { AlertCircle, Paperclip, Upload } from "lucide-react";
import { cn } from "../../lib/cn";

function Shell({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
  as = "label",
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
  as?: "label" | "fieldset";
}) {
  const Tag = as;
  return (
    <Tag className={cn("block", className)} {...(as === "fieldset" ? {} : { htmlFor: id })}>
      {label ? (
        <span className="mb-2 flex flex-wrap items-baseline gap-2">
          <span
            className={cn(
              "text-[0.86rem] font-medium text-fg",
              as === "fieldset" && "block w-full",
            )}
          >
            {label}
          </span>
          {optional ? (
            <span className="text-[0.72rem] tracking-wide text-faint uppercase">optional</span>
          ) : (
            <span className="sr-only">required</span>
          )}
        </span>
      ) : null}
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.8rem] text-faint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1.5 flex items-start gap-1.5 text-[0.82rem] text-rose"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
    </Tag>
  );
}

type BaseProps = {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  /** Stable field name used for validation focus and server-side error mapping. */
  name?: string;
  autoComplete?: string;
  disabled?: boolean;
};

export function TextField({
  type = "text",
  maxLength,
  ...p
}: BaseProps & { type?: string; maxLength?: number }) {
  const auto = useId();
  const id = p.id ?? auto;
  return (
    <Shell {...p} id={id}>
      <div className="relative">
        <input
          id={id}
          name={p.name ?? id}
          type={type}
          value={p.value}
          placeholder={p.placeholder}
          maxLength={maxLength}
          disabled={p.disabled}
          autoComplete={p.autoComplete}
          onChange={(e) => p.onChange(e.target.value)}
          aria-invalid={p.error ? true : undefined}
          aria-describedby={cn(p.error && `${id}-error`, !p.error && p.hint && `${id}-hint`)}
        />
        {maxLength && p.value.length > maxLength * 0.8 ? (
          <span className="pointer-events-none absolute top-2.5 right-3 font-mono text-[0.7rem] text-faint">
            {p.value.length}/{maxLength}
          </span>
        ) : null}
      </div>
    </Shell>
  );
}

export function TextArea({
  rows = 5,
  maxLength,
  ...p
}: BaseProps & { rows?: number; maxLength?: number }) {
  const auto = useId();
  const id = p.id ?? auto;
  return (
    <Shell {...p} id={id}>
      <textarea
        id={id}
        name={p.name ?? id}
        rows={rows}
        value={p.value}
        placeholder={p.placeholder}
        maxLength={maxLength}
        disabled={p.disabled}
        onChange={(e) => p.onChange(e.target.value)}
        aria-invalid={p.error ? true : undefined}
        aria-describedby={cn(p.error && `${id}-error`, !p.error && p.hint && `${id}-hint`)}
      />
      {maxLength ? (
        <p className="mt-1 text-right font-mono text-[0.7rem] text-faint">
          {p.value.length}/{maxLength}
        </p>
      ) : null}
    </Shell>
  );
}

export function SelectField({
  options,
  placeholder = "Choose one…",
  ...p
}: BaseProps & { options: readonly string[] }) {
  const auto = useId();
  const id = p.id ?? auto;
  return (
    <Shell {...p} id={id}>
      <select
        id={id}
        name={p.name ?? id}
        value={p.value}
        disabled={p.disabled}
        onChange={(e) => p.onChange(e.target.value)}
        aria-invalid={p.error ? true : undefined}
        aria-describedby={cn(p.error && `${id}-error`, !p.error && p.hint && `${id}-hint`)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Shell>
  );
}

/** Card-style radio group — used for service, budget, contact method, etc. */
export function RadioCards({
  label,
  name,
  value,
  onChange,
  options,
  error,
  hint,
  columns = 2,
  className,
}: {
  label: ReactNode;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; blurb?: string; icon?: ReactNode }[];
  error?: string;
  hint?: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  const id = `${name}-field`;
  return (
    <Shell id={id} label={label} error={error} hint={hint} as="fieldset" className={className}>
      <div
        role="radiogroup"
        aria-labelledby={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "grid gap-2.5",
          columns === 1 && "grid-cols-1",
          columns === 2 && "sm:grid-cols-2",
          columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {options.map((o) => {
          const checked = value === o.value;
          const oid = `${name}-${o.value.replace(/\W+/g, "-").toLowerCase()}`;
          return (
            <label
              key={o.value}
              htmlFor={oid}
              className={cn(
                "group relative flex cursor-pointer items-start gap-3 rounded-card border p-3.5 transition-colors duration-200",
                checked
                  ? "border-mint/55 bg-mint/[0.07]"
                  : "border-line bg-[#10171c] hover:border-muted/50",
              )}
            >
              <input
                id={oid}
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                  checked ? "border-mint bg-mint" : "border-line group-hover:border-muted",
                )}
              >
                {checked ? <span className="size-1.5 rounded-full bg-[#06251e]" /> : null}
              </span>
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-[0.92rem] font-medium",
                    checked ? "text-fg" : "text-muted group-hover:text-fg",
                  )}
                >
                  {o.icon ? (
                    <span className="mr-1.5 inline-flex align-[-3px] text-mint">{o.icon}</span>
                  ) : null}
                  {o.value}
                </span>
                {o.blurb ? (
                  <span className="mt-0.5 block text-[0.8rem] leading-snug text-faint">
                    {o.blurb}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </Shell>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
  error,
  id,
  className,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  id?: string;
  className?: string;
}) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Shell id={fid} label="" error={error} className={className}>
      <label htmlFor={fid} className="group flex cursor-pointer items-start gap-3">
        <input
          id={fid}
          name={fid}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fid}-error` : undefined}
        />
        <span
          aria-hidden
          className={cn(
            "mt-[3px] flex size-[18px] shrink-0 items-center justify-center rounded-[6px] border transition-colors",
            checked
              ? "border-mint bg-mint text-[#06251e]"
      : cn("border-line bg-[#10171c] group-hover:border-muted", error && "border-rose/60"),
          )}
        >
          {checked ? (
            <svg viewBox="0 0 16 16" className="size-3" fill="none">
              <path
                d="M3 8.5l3.2 3.2L13 5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
        <span className="text-[0.88rem] leading-relaxed text-muted">{label}</span>
      </label>
    </Shell>
  );
}

export function FileField({
  label,
  hint,
  file,
  onSelect,
  error,
  accept,
  id,
}: {
  label: ReactNode;
  hint?: ReactNode;
  file: File | null;
  onSelect: (f: File | null) => void;
  error?: string;
  accept: string;
  id?: string;
}) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Shell id={fid} label={label} hint={hint} error={error} optional>
      <div
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-card border border-dashed bg-[#0e1418] p-3",
          error ? "border-rose/50" : "border-line",
        )}
      >
        {file ? (
          <>
            <Paperclip className="size-4 shrink-0 text-mint" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-[0.88rem] text-fg">{file.name}</span>
            <span className="font-mono text-[0.75rem] text-faint">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="rounded-pill border border-line px-3 py-1 text-[0.78rem] text-muted transition-colors hover:border-rose/50 hover:text-rose"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <Upload className="size-4 shrink-0 text-muted" aria-hidden />
            <span className="flex-1 text-[0.86rem] text-faint">{hint ?? "No file selected"}</span>
            <label
              htmlFor={fid}
              className="cursor-pointer rounded-pill border border-mint/45 px-3.5 py-1.5 text-[0.8rem] text-mint transition-colors hover:bg-mint/10"
            >
              Choose file
            </label>
          </>
        )}
        <input
          id={fid}
          name={fid}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onSelect(e.target.files?.[0] ?? null)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fid}-error` : undefined}
        />
      </div>
    </Shell>
  );
}

/** Anti-spam honeypot: visually hidden but present in the DOM. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
      <label htmlFor="septa-website">Website</label>
      <input
        id="septa-website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
