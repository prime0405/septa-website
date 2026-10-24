import { useCallback, useMemo, useRef, useState } from "react";
import type { z } from "zod";

export type Errors = Record<string, string>;

export function flattenIssues(error: z.ZodError): Errors {
  const out: Errors = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

type Values = Record<string, unknown>;

/**
 * Small form engine: controlled values, zod validation, per-field errors,
 * and first-error focus so keyboard and screen-reader users land on the problem.
 */
export function useForm<S extends z.ZodTypeAny>(schema: S, initial: Values) {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const set = useCallback(
    <K extends keyof Values & string>(key: K, value: unknown) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      if (attempted) {
        setErrors((prev) => {
          if (!prev[key as string]) return prev;
          const next = { ...prev };
          delete next[key as string];
          return next;
        });
      }
    },
    [attempted],
  );

  const patch = useCallback((partial: Values) => setValues((prev) => ({ ...prev, ...partial })), []);

  const validate = useCallback((): { data: Values | null; errors: Errors } => {
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      return { data: result.data as Values, errors: {} };
    }
    const flat = flattenIssues(result.error);
    setErrors(flat);
    return { data: null, errors: flat };
  }, [schema, values]);

  const focusFirstError = useCallback((keys: string[]) => {
    if (!keys.length) return;
    const root = formRef.current;
    if (!root) return;
    for (const key of keys) {
      const escaped = CSS.escape(key);
      const el = root.querySelector<HTMLElement>(`[name="${escaped}"], #${escaped}`);
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        el.focus({ preventScroll: true });
        return;
      }
    }
    // No stable handle: move focus to the marked region so the alert text is announced.
    const anchor = root.querySelector<HTMLElement>("[data-form-anchor]");
    if (anchor) {
      anchor.scrollIntoView({ block: "center", behavior: "smooth" });
      anchor.focus({ preventScroll: true });
    }
  }, []);

  const reset = useCallback((next: Values = {}) => {
    setValues(next);
    setErrors({});
    setAttempted(false);
  }, []);

  const firstErrorKeys = useMemo(() => Object.keys(errors), [errors]);

  return {
    values,
    errors,
    attempted,
    setAttempted,
    setErrors,
    set,
    patch,
    validate,
    reset,
    formRef,
    firstErrorKeys,
    focusFirstError,
  };
}

export const v = (values: Values, key: string) => {
  const x = values[key];
  return typeof x === "string" ? x : x === undefined || x === null ? "" : String(x);
};
