import { useReducedMotion } from "motion/react";
import { Brain, Eye, Layers, Users, Workflow } from "lucide-react";
import { cn } from "../../lib/cn";

const NODES = [
  { key: "ai", label: "AI Products", Icon: Brain, angle: -60, dist: 152 },
  { key: "build", label: "Software", Icon: Layers, angle: 12, dist: 160 },
  { key: "automate", label: "Automation", Icon: Workflow, angle: 84, dist: 150 },
  { key: "observe", label: "Observability", Icon: Eye, angle: 156, dist: 158 },
  { key: "talent", label: "Talent", Icon: Users, angle: 228, dist: 152 },
] as const;

const C = 210; // centre

function point(angleDeg: number, dist: number) {
  const r = (angleDeg * Math.PI) / 180;
  return { x: C + dist * Math.cos(r), y: C + dist * Math.sin(r) };
}

/** Animated architecture graph: the hero visual on the homepage. */
export function HeroDiagram({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className="glow-mint pointer-events-none absolute inset-[-12%] opacity-70"
      />
      <svg
        viewBox="0 0 420 420"
        className="relative w-full max-w-[520px]"
        role="img"
        aria-label="Diagram: Septa's core delivery engine connected to AI products, software, automation, observability and talent services."
      >
        <defs>
          <linearGradient id="hd-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--color-mint)", stopOpacity: 0.85 }} />
            <stop offset="100%" style={{ stopColor: "var(--color-mint)", stopOpacity: 0.25 }} />
          </linearGradient>
          <radialGradient id="hd-core" cx="50%" cy="35%" r="70%">
            <stop offset="0%" style={{ stopColor: "var(--color-brand-pearl-raised)" }} />
            <stop offset="100%" style={{ stopColor: "var(--color-brand-pearl)" }} />
          </radialGradient>
          <pattern id="hd-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" className="fill-line" />
          </pattern>
        </defs>

        <circle cx={C} cy={C} r="196" fill="url(#hd-dots)" opacity="0.9" />
        <circle cx={C} cy={C} r="196" fill="none" strokeWidth="1" className="stroke-line" />

        {/* rotating measurement ring */}
        <g className={reduce ? undefined : "origin-center animate-spin-slow"}>
          <circle
            cx={C}
            cy={C}
            r="184"
            fill="none"
            strokeWidth="1"
            strokeDasharray="2 16"
            className="stroke-line"
          />
        </g>

        {/* connectors */}
        {NODES.map(({ key, angle, dist }) => {
          const p = point(angle, dist);
          const mid = { x: (C + p.x) / 2, y: (C + p.y) / 2 };
          const d = `M ${C} ${C} Q ${mid.x + (p.y - C) * 0.12} ${mid.y - (p.x - C) * 0.12} ${p.x} ${p.y}`;
          return (
            <g key={key}>
              <path d={d} fill="none" stroke="url(#hd-stroke)" strokeWidth="1.4" />
              <path
                d={d}
                fill="none"
                strokeOpacity="0.7"
                strokeWidth="1.4"
                strokeDasharray="4 20"
                className={cn("stroke-mint", reduce ? undefined : "animate-dash")}
              />
            </g>
          );
        })}

        {/* orbit nodes */}
        {NODES.map(({ key, label, Icon, angle, dist }, i) => {
          const p = point(angle, dist);
          const html = 40;
          return (
            <g key={key} transform={`translate(${p.x - html / 2} ${p.y - html / 2})`}>
              <rect
                width={html}
                height={html}
                rx="13"
                strokeWidth="1"
                className={cn("fill-ink-raised stroke-line", reduce ? undefined : "origin-center animate-float")}
                style={reduce ? undefined : { animationDelay: `${i * 0.9}s` }}
              />
              <foreignObject width={html} height={html}>
                <div
                  style={{ width: html, height: html }}
                  className="flex items-center justify-center text-mint"
                >
                  <Icon className="size-[19px]" strokeWidth={1.6} aria-hidden />
                </div>
              </foreignObject>
              <text
                x={html / 2}
                y={html + 17}
                textAnchor="middle"
                fontSize="10.5"
                fontFamily="var(--font-mono)"
                letterSpacing="0.6"
                className="fill-muted"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* core */}
        <g>
          <circle cx={C} cy={C} r="74" fill="none" strokeOpacity="0.3" className="stroke-mint" />
          <circle cx={C} cy={C} r="62" fill="url(#hd-core)" className="stroke-brand-teal" />
          <circle
            cx={C}
            cy={C}
            r="62"
            fill="none"
            strokeOpacity="0.7"
            strokeWidth="1"
            strokeDasharray="60 300"
            className={cn("stroke-brand-teal", reduce ? undefined : "origin-center animate-spin-slow")}
          />
          <text
            x={C}
            y={C - 8}
            textAnchor="middle"
            fontSize="19"
            fontFamily="var(--font-display)"
            fontWeight="600"
            letterSpacing="3"
            className="fill-brand-white"
          >
            SEPTA
          </text>
          <text
            x={C}
            y={C + 12}
            textAnchor="middle"
            fontSize="8.5"
            fontFamily="var(--font-mono)"
            letterSpacing="2.4"
            className="fill-brand-teal"
          >
            DELIVERY CORE
          </text>
          <line x1={C - 26} y1={C + 24} x2={C + 26} y2={C + 24} className="stroke-brand-pearl-raised" />
          <circle
            cx={C - 26}
            cy={C + 24}
            r="1.8"
            className={cn("fill-brand-teal", reduce ? undefined : "animate-pulse-node")}
          />
        </g>
      </svg>

      {/* corner telemetry chips keep the composition technical, not decorative filler */}
      <div className="pointer-events-none absolute top-2 right-2 hidden sm:block">
        <div className="rounded-lg border border-line bg-ink-raised/90 px-2.5 py-1.5 font-mono text-[0.66rem] text-faint">
          discovery → build → ship → observe
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-0 hidden sm:block">
        <div className="flex items-center gap-2 rounded-pill border border-mint/25 bg-mint/[0.06] px-3 py-1.5 font-mono text-[0.66rem] text-mint">
          <span className={cn("size-1.5 rounded-full bg-mint", reduce ? undefined : "animate-pulse-node")} />
          live delivery loop
        </div>
      </div>
    </div>
  );
}
