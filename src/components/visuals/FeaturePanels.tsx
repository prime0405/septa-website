import { Boxes, Layers, ScanLine, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/cn";

/** Code-inspired motif for the AI product feature block. */
export function AiDeliveryPanel({ className }: { className?: string }) {
  const lines = [
    { t: "const decision = await triage(claim);", c: "text-fg" },
    { t: "const answer = await rag.retrieve(decision.query, {", c: "text-fg" },
    { t: "  topK: 6, filter: { policyVersion: claim.version },", c: "text-muted" },
    { t: " });", c: "text-fg" },
    { t: "", c: "" },
    { t: "await evaluate(goldenSet, answer, {", c: "text-fg" },
    { t: "  citationAccuracy: \">= 0.97\",", c: "text-mint" },
    { t: "  unsupportedClaims: \"== 0\",", c: "text-mint" },
    { t: "  p95LatencyMs: \"<= 900\",", c: "text-mint" },
    { t: "});", c: "text-fg" },
    { t: "// blocked in CI — a regression here ships to a claims file", c: "text-faint" },
  ];

  return (
    <div className={cn("card overflow-hidden", className)}>
      <div className="flex items-center gap-2 border-b border-line bg-ink-raised px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-mint/50" />
        </span>
        <span className="font-mono text-[0.72rem] text-faint">evaluation-gate.ts</span>
        <span className="ml-auto rounded-pill border border-mint/30 px-2 py-0.5 font-mono text-[0.62rem] text-mint">
          illustrative
        </span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[0.74rem] leading-relaxed sm:p-5">
        {lines.map((l, i) => (
          <div key={i} className="flex gap-3">
            <span className="w-5 shrink-0 text-right text-faint/60 select-none">{i + 1}</span>
            <code className={l.c}>{l.t || " "}</code>
          </div>
        ))}
      </pre>
      <div className="grid grid-cols-3 divide-x divide-line border-t border-line bg-ink-raised">
        {[
          { Icon: ScanLine, label: "Red-team suite" },
          { Icon: ShieldCheck, label: "PII boundaries" },
          { Icon: Boxes, label: "Versioned prompts" },
        ].map(({ Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 px-2 py-3 text-center">
            <Icon className="size-4 text-mint/80" aria-hidden />
            <span className="text-[0.72rem] text-faint">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Layered architecture motif for the traditional product feature block. */
export function ArchitectureStack({ className }: { className?: string }) {
  const layers = [
    { label: "Interface", detail: "React · TypeScript · accessible patterns", tone: "mint" },
    { label: "Application", detail: "Services, queues, jobs, background workers", tone: "base" },
    { label: "Data", detail: "Schema, constraints, migrations, backups", tone: "base" },
    { label: "Platform", detail: "IaC, environments, pipelines", tone: "base" },
    { label: "Observability", detail: "Metrics, logs, traces, alert routing", tone: "mint" },
  ];

  return (
    <div className={cn("relative", className)}>
      <ul className="space-y-2.5">
        {layers.map((l, i) => (
          <li
            key={l.label}
            className={cn(
              "group flex items-center gap-4 rounded-card border px-4 py-3.5 transition-colors",
              l.tone === "mint"
                ? "border-mint/30 bg-mint/[0.06] hover:border-mint/60"
                : "border-line bg-surface-raised hover:border-muted/40",
            )}
            style={{ marginLeft: `${Math.abs(i - 2) * 10}px` }}
          >
            <span className="font-mono text-[0.68rem] text-faint">{String(i + 1).padStart(2, "0")}</span>
            <Layers className="size-4 shrink-0 text-muted" aria-hidden />
            <div className="min-w-0">
              <p className="text-[0.92rem] font-medium text-fg">{l.label}</p>
              <p className="truncate text-[0.78rem] text-faint">{l.detail}</p>
            </div>
          </li>
        ))}
      </ul>
      <div
        aria-hidden
        className="absolute top-0 -left-4 hidden h-full w-px bg-gradient-to-b from-mint/40 via-line to-transparent sm:block"
      />
    </div>
  );
}
