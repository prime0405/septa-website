import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowRight, Check, Link2, Link2Off, RefreshCw } from "lucide-react";
import { cn } from "../../lib/cn";

const SILOS = [
  { label: "CRM", y: 24 },
  { label: "Invoicing", y: 96 },
  { label: "Sheets", y: 168 },
  { label: "Support inbox", y: 240 },
  { label: "Ops dashboard", y: 312 },
];

/**
 * Before/after diagram for Workflow Automation. The toggle is a real control:
 * it switches between disconnected manual handoffs and one connected pipeline.
 */
export function WorkflowDiagram({ className }: { className?: string }) {
  const [connected, setConnected] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className={cn("card overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-[0.72rem] tracking-wider text-faint uppercase">
          {connected ? (
            <Link2 className="size-3.5 text-mint" aria-hidden />
          ) : (
            <Link2Off className="size-3.5 text-amber" aria-hidden />
          )}
          {connected ? "After: one connected flow" : "Before: manual handoffs"}
        </div>
        <div className="flex items-center gap-1 rounded-pill border border-line bg-ink-raised p-1">
          {[
            { v: false, l: "Disconnected" },
            { v: true, l: "Automated" },
          ].map((o) => (
            <button
              key={o.l}
              type="button"
              onClick={() => setConnected(o.v)}
              aria-pressed={connected === o.v}
              className={cn(
                "rounded-pill px-3 py-1.5 text-[0.78rem] font-medium transition-colors",
                connected === o.v
                  ? "bg-brand-teal text-brand-pearl"
                  : "text-muted hover:text-fg",
              )}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[300px_1fr] lg:p-6">
        <svg
          viewBox="0 0 300 380"
          className="h-auto w-full max-w-[300px]"
          role="img"
          aria-label={
            connected
              ? "Five business systems joined through a single automation layer."
              : "Five business systems with no connections between them."
          }
        >
          {/* hub */}
          <rect
            x="196"
            y="150"
            width="92"
            height="80"
            rx="14"
            className={connected ? "fill-brand-teal stroke-mint" : "fill-ink-raised stroke-line"}
            strokeDasharray={connected ? undefined : "4 4"}
            style={{ transition: "all .35s ease" }}
          />
          <text
            x="242"
            y="184"
            textAnchor="middle"
            fontSize="10"
            fontFamily="var(--font-mono)"
            className={connected ? "fill-brand-pearl" : "fill-faint"}
          >
            AUTOMATION
          </text>
          <text
            x="242"
            y="200"
            textAnchor="middle"
            fontSize="10"
            fontFamily="var(--font-mono)"
            className={connected ? "fill-brand-pearl" : "fill-faint"}
          >
            LAYER
          </text>
          <text
            x="242"
            y="220"
            textAnchor="middle"
            fontSize="8.5"
            fontFamily="var(--font-mono)"
            fillOpacity={connected ? 0.75 : 1}
            className={connected ? "fill-brand-pearl" : "fill-faint"}
          >
            {connected ? "rules · retries · alerts" : "waiting"}
          </text>

          {SILOS.map((s, i) => {
            const x = 12;
            const w = 118;
            const h = 40;
            const startX = x + w;
            const startY = s.y + h / 2;
            const endX = 196;
            const endY = 190;
            const d = `M ${startX} ${startY} C ${startX + 40} ${startY}, ${endX - 46} ${endY}, ${endX} ${endY}`;
            return (
              <g key={s.label}>
                <rect
                  x={x}
                  y={s.y}
                  width={w}
                  height={h}
                  rx="10"
                  className="fill-surface-raised stroke-line"
                />
                <text
                  x={x + 12}
                  y={s.y + 25}
                  fontSize="10.5"
                  fontFamily="var(--font-sans)"
                  className="fill-muted"
                >
                  {s.label}
                </text>
                <path
                  d={d}
                  fill="none"
                  className={connected ? "stroke-mint" : "stroke-line"}
                  strokeWidth="1.3"
                  strokeDasharray={connected ? undefined : "3 6"}
                  opacity={connected ? 0.85 : 0.5}
                  style={{ transition: "all .35s ease" }}
                />
                {connected ? (
                  <circle r="3" className="fill-mint">
                    <animateMotion
                      dur="2.8s"
                      begin={`${i * 0.45}s`}
                      repeatCount={reduce ? "1" : "indefinite"}
                      path={d}
                    />
                  </circle>
                ) : (
                  <text x={startX + 16} y={startY + 3} fontSize="12" className="fill-faint">
                    ✕
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="flex flex-col justify-center gap-4">
          {connected ? <ConnectedList /> : <DisconnectedList />}
          <button
            type="button"
            onClick={() => setConnected((v) => !v)}
            className="inline-flex items-center gap-2 self-start rounded-pill border border-line px-4 py-2 text-[0.82rem] text-muted transition-colors hover:border-mint/45 hover:text-mint"
          >
            <RefreshCw className="size-3.5" aria-hidden />
            {connected ? "Show the manual state again" : "Show what breaks without automation"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DisconnectedList() {
  const rows = [
    "Someone copies a deal from the CRM into a spreadsheet.",
    "Finance is emailed to raise an invoice when they remember to.",
    "Support tickets are pasted into three places at once.",
    "Nobody knows which copy is current, so work is repeated.",
    "Failures surface days later, after a customer notices.",
  ];
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r} className="flex gap-3 text-[0.9rem] text-muted">
          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber/70" aria-hidden />
          {r}
        </li>
      ))}
    </ul>
  );
}

function ConnectedList() {
  const rows = [
    "One event in the CRM triggers every dependent step.",
    "Records sync both ways, with retries when a system is down.",
    "Approvals route to the right person with a full audit trail.",
    "Reports build themselves from the same source of truth.",
    "Failures alert whoever owns the workflow, immediately.",
  ];
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r} className="flex gap-3 text-[0.9rem] text-fg">
          <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-mint/15">
            <Check className="size-2.5 text-mint" aria-hidden />
          </span>
          {r}
        </li>
      ))}
    </ul>
  );
}

export function StepArrow() {
  return <ArrowRight className="size-4 text-faint" aria-hidden />;
}
