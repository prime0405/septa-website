import { useMemo, useState } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Callout, Pill, SampleTag } from "../ui/primitives";
import { Tabs } from "../ui/Tabs";

/** Deterministic pseudo-random so the sample dashboard is stable per "refresh". */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function series(seed: number, points = 26, base = 60, spread = 40, spikeEvery = 9) {
  const rnd = mulberry32(seed);
  return Array.from({ length: points }, (_, i) => {
    const drift = Math.sin(i / 2.2 + seed) * spread * 0.35;
    const noise = rnd() * spread * 0.55;
    const spike = i % spikeEvery === spikeEvery - 1 ? spread * (0.5 + rnd() * 0.7) : 0;
    return Math.max(2, Math.round(base + drift + noise + spike));
  });
}

function Sparkline({
  data,
  height = 44,
  width = 168,
  tone = "mint",
}: {
  data: number[];
  height?: number;
  width?: number;
  tone?: "mint" | "amber" | "rose";
}) {
  const colors = { mint: "#6fd4b8", amber: "#e2c078", rose: "#e08a8a" } as const;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = Math.max(1, max - min);
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => `${(i * step).toFixed(1)},${(height - ((v - min) / span) * (height - 6) - 3).toFixed(1)}`);
  const id = `sp-${tone}-${data.length}-${max}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-11 w-full" role="img" aria-label="Sample trend">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors[tone]} stopOpacity="0.28" />
          <stop offset="100%" stopColor={colors[tone]} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${pts.join(" ")} ${width},${height}`} fill={`url(#${id})`} />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={colors[tone]}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / span) * (height - 6) - 3}
        r="2.4"
        fill={colors[tone]}
      />
    </svg>
  );
}

const TRACES = [
  { id: "4f2a91c0", route: "POST /v1/checkout", ms: 412, status: "error" },
  { id: "7b30de55", route: "GET /v1/orders", ms: 118, status: "ok" },
  { id: "11ac6f90", route: "POST /v1/payments/retry", ms: 902, status: "slow" },
  { id: "e5d20b77", route: "GET /v1/inventory", ms: 64, status: "ok" },
  { id: "9c14aa03", route: "POST /v1/checkout", ms: 388, status: "error" },
];

const ALERTS = [
  { sev: "critical", title: "p95 checkout latency above 400 ms", detail: "SLO burn 2.4× over the last 15 min", when: "4 min ago" },
  { sev: "warning", title: "Payment retry queue depth rising", detail: "queue=1 284, steady baseline is under 200", when: "11 min ago" },
  { sev: "info", title: "Deploy 2f9c1 marked as candidate", detail: "Error budget impact within tolerance", when: "26 min ago" },
];

/**
 * Illustrative observability dashboard. Every number here is synthetic sample data:
 * it demonstrates what an implemented dashboard looks like, not Septa infrastructure.
 */
export function DashboardMock({ className }: { className?: string }) {
  const [seed, setSeed] = useState(7);
  const [loading, setLoading] = useState(false);
  const [acked, setAcked] = useState<string[]>([]);

  const data = useMemo(
    () => ({
      p95: series(seed, 26, 260, 180, 7),
      err: series(seed + 31, 26, 12, 22, 5).map((v) => v / 10),
      rps: series(seed + 77, 26, 940, 520, 6),
      cpu: series(seed + 113, 26, 58, 30, 8),
    }),
    [seed],
  );

  const refresh = () => {
    setLoading(true);
    window.setTimeout(() => {
      setSeed((s) => s + 1);
      setLoading(false);
    }, 620);
  };

  const last = (arr: number[]) => arr[arr.length - 1];
  const kpis = [
    { label: "p95 latency", value: `${last(data.p95)} ms`, tone: "mint" as const, data: data.p95 },
    { label: "Error rate", value: `${last(data.err).toFixed(1)} %`, tone: "rose" as const, data: data.err },
    { label: "Throughput", value: `${last(data.rps)} rps`, tone: "mint" as const, data: data.rps },
    { label: "Node CPU", value: `${last(data.cpu)} %`, tone: "amber" as const, data: data.cpu },
  ];

  const metrics = (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-card border border-line bg-[#10171c] p-3.5">
            <p className="font-mono text-[0.68rem] tracking-wider text-faint uppercase">{k.label}</p>
            <p className="mt-1 font-display text-[1.35rem] text-fg tabular-nums">
              {loading ? <span className="skeleton inline-block h-6 w-20 rounded" /> : k.value}
            </p>
            <div className={cn("mt-2 transition-opacity", loading && "opacity-30")}>
              <Sparkline data={k.data} tone={k.tone} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-line bg-[#10171c] p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-[0.72rem] tracking-wider text-muted uppercase">
            Latency distribution · sample window 30 min
          </p>
          <Pill tone="mint">SLO 350 ms</Pill>
        </div>
        <div className="flex h-24 items-end gap-1.5">
          {data.p95.map((v, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-t-sm transition-all duration-500",
                v > 350 ? "bg-rose/60" : "bg-mint/35 hover:bg-mint/60",
              )}
              style={{ height: `${Math.min(100, (v / 520) * 100)}%` }}
              title={`${v} ms`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const maxMs = Math.max(...TRACES.map((t) => t.ms));
  const traces = (
    <div className="overflow-hidden rounded-card border border-line">
      <table className="w-full text-left text-[0.85rem]">
        <caption className="sr-only">Sample distributed traces with durations</caption>
        <thead className="bg-[#10171c] font-mono text-[0.68rem] tracking-wider text-faint uppercase">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-normal">Trace</th>
            <th scope="col" className="px-4 py-2.5 font-normal">Route</th>
            <th scope="col" className="px-4 py-2.5 font-normal">Duration</th>
            <th scope="col" className="px-4 py-2.5 font-normal">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {TRACES.map((t) => (
            <tr key={t.id} className="bg-[#11181d] transition-colors hover:bg-surface">
              <td className="px-4 py-2.5 font-mono text-[0.78rem] text-muted">{t.id}</td>
              <td className="px-4 py-2.5 text-fg">{t.route}</td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-14 text-right font-mono tabular-nums text-muted">{t.ms} ms</span>
                  <span
                    aria-hidden
                    className={cn(
                      "h-1.5 rounded-full",
                      t.status === "error" ? "bg-rose/70" : t.status === "slow" ? "bg-amber/70" : "bg-mint/50",
                    )}
                    style={{ width: `${(t.ms / maxMs) * 90}px` }}
                  />
                </div>
              </td>
              <td className="px-4 py-2.5">
                {t.status === "ok" ? (
                  <Pill tone="mint">200</Pill>
                ) : t.status === "slow" ? (
                  <Pill tone="amber">slow</Pill>
                ) : (
                  <Pill tone="line">5xx</Pill>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const alerts = (
    <div className="space-y-2.5">
      {ALERTS.map((a) => {
        const isAcked = acked.includes(a.title);
        return (
          <div
            key={a.title}
            className={cn(
              "flex flex-wrap items-start gap-3 rounded-card border p-4 transition-colors",
              isAcked ? "border-mint/30 bg-mint/[0.05]" : "border-line bg-[#11181d]",
            )}
          >
            <TriangleAlert
              className={cn(
                "mt-0.5 size-4 shrink-0",
                a.sev === "critical" ? "text-rose" : a.sev === "warning" ? "text-amber" : "text-muted",
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-[0.92rem] text-fg">{a.title}</p>
              <p className="mt-0.5 font-mono text-[0.76rem] text-faint">{a.detail}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.72rem] text-faint">{a.when}</span>
              <Pill tone={a.sev === "critical" ? "line" : "muted"}>{a.sev}</Pill>
              <button
                type="button"
                onClick={() => setAcked((prev) => (isAcked ? prev.filter((p) => p !== a.title) : [...prev, a.title]))}
                aria-pressed={isAcked}
                className={cn(
                  "rounded-pill border px-3 py-1 text-[0.76rem] transition-colors",
                  isAcked
                    ? "border-mint/50 text-mint"
                    : "border-line text-muted hover:border-mint/45 hover:text-mint",
                )}
              >
                {isAcked ? "Acknowledged" : "Acknowledge"}
              </button>
            </div>
          </div>
        );
      })}
      <p className="sr-only" role="status" aria-live="polite">
        {acked.length > 0 ? `${acked.length} sample alert(s) acknowledged locally.` : "No alerts acknowledged."}
      </p>
    </div>
  );

  return (
    <div className={cn("card overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-[#0d1317] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-mint" aria-hidden />
          <p className="font-mono text-[0.78rem] text-muted">
            checkout-api <span className="text-faint">/ production</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SampleTag label="Sample data" />
          <Button variant="ghost" size="sm" onClick={refresh} iconStart={<RefreshCw className={cn("size-3.5", loading && "animate-spin")} />}>
            {loading ? "Refreshing" : "Refresh sample"}
          </Button>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <Callout kind="setup" className="mb-4" title="Illustrative, not live">
          These metrics, traces and alerts are synthetic values generated in the browser to show the shape of an
          implemented observability dashboard. They do not describe Septa infrastructure or any real customer system.
        </Callout>
        <Tabs
          tabs={[
            { id: "metrics", label: "Metrics", content: metrics },
            { id: "traces", label: "Traces", content: traces },
            { id: "alerts", label: "Alerts", content: alerts },
          ]}
        />
      </div>
    </div>
  );
}
