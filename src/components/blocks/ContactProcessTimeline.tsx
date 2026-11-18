import { CheckCircle2, Clock, FileCode2, Video } from "lucide-react";
import { PointerGlow } from "../ui/PointerGlow";
import { usePointerTrack } from "../../lib/pointerGlow";

const steps = [
  {
    num: "01",
    title: "Technical Triage",
    window: "< 24 Hours",
    icon: <FileCode2 className="size-4.5 text-mint" />,
    detail:
      "A senior systems architect personally reviews your requirements, technology stack, and architectural constraints.",
  },
  {
    num: "02",
    title: "Discovery Session",
    window: "30-Min Call",
    icon: <Video className="size-4.5 text-mint" />,
    detail:
      "A focused technical scoping call to align on business outcomes, integrations, budget range, and target launch dates.",
  },
  {
    num: "03",
    title: "Sprint Proposal",
    window: "Clear Deliverables",
    icon: <CheckCircle2 className="size-4.5 text-mint" />,
    detail:
      "You receive an actionable technical blueprint, phased sprint roadmap, and transparent milestone-based cost estimates.",
  },
];

function StepCard({
  num,
  title,
  window,
  icon,
  detail,
}: {
  num: string;
  title: string;
  window: string;
  icon: React.ReactNode;
  detail: string;
}) {
  const track = usePointerTrack<HTMLDivElement>("tilt", 6);

  return (
    <div
      onPointerMove={track.onPointerMove}
      onPointerLeave={track.onPointerLeave}
      className="card card-hover tilt group relative flex flex-col justify-between rounded-xl border border-line bg-surface p-5 sm:p-6 transition-all"
    >
      <PointerGlow />
      <div>
        <div className="flex items-center justify-between">
          <span className="flex size-10 items-center justify-center rounded-lg border border-line bg-surface-raised transition-all group-hover:border-mint/50 group-hover:scale-105">
            {icon}
          </span>
          <span className="font-mono text-[0.72rem] font-bold tracking-widest text-mint uppercase">
            Step {num}
          </span>
        </div>
        <h4 className="mt-4 text-[1.05rem] font-bold text-fg group-hover:text-mint transition-colors">
          {title}
        </h4>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{detail}</p>
      </div>
      <div className="mt-5 border-t border-line/60 pt-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] font-semibold text-faint">
          <Clock className="size-3 text-mint" /> {window}
        </span>
      </div>
    </div>
  );
}

export function ContactProcessTimeline() {
  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="overflow-hidden rounded-card border border-line bg-surface-raised p-6 sm:p-8 shadow-soft">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow text-mint font-semibold">WHAT HAPPENS NEXT</span>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-fg">
              Our 3-Step Intake &amp; Scoping Process
            </h3>
          </div>
          <p className="text-[0.85rem] text-muted sm:text-right">
            Zero automated black holes. Direct engineering access.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <StepCard key={s.num} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
}
