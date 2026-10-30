import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Wrench } from "lucide-react";
import { apiBase, loadApiStatus } from "../../lib/api";
import { showLaunchNotes as showNotes } from "../../lib/launchNotes";
import type { ApiStatus } from "../../shared/schemas";
import { Callout } from "../ui/primitives";

/**
 * Honest note about content that must be confirmed by Septa before launch.
 * Shown during development and preview builds; hidden in production once
 * VITE_SHOW_LAUNCH_NOTES is unset.
 */
export function LaunchNote({ items, title }: { items: string[]; title?: string }) {
  if (!showNotes || items.length === 0) return null;
  return (
    <Callout kind="setup" title={title ?? "Confirm before launch"} className="mt-6">
      <p className="mb-2">
        This page is written as editable service copy. The following is not yet a confirmed Septa
        offering or fact, so adjust the wording in <code className="font-mono">src/data/</code> if it
        is inaccurate:
      </p>
      <ul className="list-disc space-y-1 pl-5">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </Callout>
  );
}

/** Explains, truthfully, where a submitted form actually goes. */
export function IntegrationNotice() {
  const [status, setStatus] = useState<ApiStatus | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    loadApiStatus().then((s) => alive && setStatus(s));
    return () => {
      alive = false;
    };
  }, []);

  if (!showNotes) return null;
  if (status === undefined) return null;

  if (status === null) {
    return (
      <Callout kind="warn" title="Demo mode: no backend reachable">
        The site cannot reach <code className="font-mono">{apiBase}</code>. Nothing you submit right now
        can be received, and the form will report a failure rather than pretend to succeed.{" "}
        {import.meta.env.DEV ? (
          <>
            Start the API with <code className="font-mono">npm run dev</code> (or{" "}
            <code className="font-mono">npm run start:api</code>) to test submissions for real.
          </>
        ) : (
          <>
            This deployment serves the frontend only. Until the API is hosted somewhere with persistent
            storage and <code className="font-mono">VITE_API_BASE_URL</code> points at it, enquiries
            cannot arrive.
          </>
        )}
      </Callout>
    );
  }

  if (status.mode === "record-only") {
    return (
      <Callout kind="info" title="Submissions are stored, not emailed yet">
        The backend is live and writing to <code className="font-mono">{status.storage}</code>, but no
        email integration is configured, so requests are recorded in the submission store rather than
        delivered to an inbox. Set <code className="font-mono">SMTP_*</code> and{" "}
        <code className="font-mono">INBOX_EMAIL</code> in <code className="font-mono">.env</code> before launch.
        {!status.uploadsEnabled ? " CV uploads are also disabled until an upload directory is writable." : null}
      </Callout>
    );
  }

  return (
    <Callout kind="success" title="Delivery configured">
      Submissions are stored and emailed to the configured inbox.
    </Callout>
  );
}

export function LaunchNoteInline({ label }: { label: string }) {
  if (!showNotes) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-dashed border-line px-2.5 py-1 font-mono text-[0.7rem] text-faint">
      <Wrench className="size-3" aria-hidden />
      {label}
    </span>
  );
}

/**
 * A clause of maintainer instruction — which file to edit — inside copy that is otherwise honest
 * and stays on the public site. Renders nothing once the launch notes are off.
 */
export function DevNote({ children }: { children: ReactNode }) {
  return showNotes ? <>{children}</> : null;
}
