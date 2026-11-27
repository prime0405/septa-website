import { CheckCircle2, Cpu, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { advantageIntro, advantagePillars } from "../../data/content";
import { PointerGlow } from "../ui/PointerGlow";
import { usePointerTrack } from "../../lib/pointerGlow";
import { MaskRise, Section } from "../ui/primitives";

const icons = [
  <Sparkles key="1" className="size-5 text-mint" />,
  <Layers key="2" className="size-5 text-mint" />,
  <Cpu key="3" className="size-5 text-mint" />,
  <CheckCircle2 key="4" className="size-5 text-mint" />,
  <ShieldCheck key="5" className="size-5 text-mint" />,
];

function AdvantageCard({
  title,
  detail,
  icon,
}: {
  title: string;
  detail: string;
  icon: React.ReactNode;
}) {
  const track = usePointerTrack<HTMLDivElement>("tilt", 8);

  return (
    <div
      onPointerMove={track.onPointerMove}
      onPointerLeave={track.onPointerLeave}
      className="card card-hover tilt group relative flex flex-col justify-between p-6 sm:p-7 bg-surface-raised"
    >
      <PointerGlow />
      <div>
        <span className="flex size-11 items-center justify-center rounded-xl border border-line bg-surface transition-all group-hover:border-mint/50 group-hover:scale-110">
          {icon}
        </span>
        <h3 className="mt-5 text-[1.12rem] font-bold text-fg group-hover:text-mint transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{detail}</p>
      </div>
      <div className="mt-5 border-t border-line/60 pt-3">
        <span className="font-mono text-[0.74rem] font-bold tracking-wider text-faint uppercase">
          Septa Standard
        </span>
      </div>
    </div>
  );
}

export function ContactAdvantageSection() {
  return (
    <Section tone="raised" className="section" aria-labelledby="advantage-heading">
      <div className="wrap">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-3 text-mint font-bold text-[0.82rem] tracking-[0.2em]">Why Work With Us</p>
          <MaskRise>
            <h2
              id="advantage-heading"
              className="text-[clamp(1.75rem,3.8vw,2.8rem)] font-bold tracking-tight text-fg"
            >
              The Septa Advantage
            </h2>
          </MaskRise>
          <p className="prose-body mx-auto mt-4 max-w-2xl text-[1.02rem] text-muted">
            {advantageIntro}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {advantagePillars.map((p, i) => (
            <AdvantageCard key={p.title} title={p.title} detail={p.detail} icon={icons[i % icons.length]} />
          ))}

          {/* 6th Card: Guaranteed Response & Partnership SLA */}
          <div className="card card-hover tilt group relative flex flex-col justify-between border-dashed p-6 sm:p-7 bg-surface-raised">
            <PointerGlow />
            <div>
              <span className="flex size-11 items-center justify-center rounded-xl border border-mint/30 bg-mint/10 text-mint">
                <Sparkles className="size-5" />
              </span>
              <h3 className="mt-5 text-[1.12rem] font-bold text-fg group-hover:text-mint transition-colors">
                Dedicated Engineering Leads
              </h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
                You speak directly with technical leads and senior architects from day one, not account handlers or ticket dispatchers.
              </p>
            </div>
            <div className="mt-5 border-t border-line/60 pt-3">
              <span className="font-mono text-[0.74rem] font-bold tracking-wider text-mint uppercase">
                Transparent Execution
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
