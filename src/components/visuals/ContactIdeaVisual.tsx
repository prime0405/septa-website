import { useState } from "react";
import { Check, Clock, Copy, Lock, Mail, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { site } from "../../lib/site";
import { SocialMark } from "../layout/SocialMarks";
import { PointerGlow } from "../ui/PointerGlow";
import { usePointerTrack } from "../../lib/pointerGlow";

export function ContactIdeaVisual() {
  const [copied, setCopied] = useState(false);
  const track = usePointerTrack<HTMLDivElement>("tilt", 6);
  const displayEmail = site.contact.email || "partnerships@septasoftware.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(displayEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onPointerMove={track.onPointerMove}
      onPointerLeave={track.onPointerLeave}
      className="card card-hover tilt relative flex h-full flex-col justify-between overflow-hidden p-6 sm:p-8"
    >
      <PointerGlow />

      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -left-16 size-72 rounded-full bg-brand-teal/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-16 size-72 rounded-full bg-mint/10 blur-3xl"
      />
      <div aria-hidden className="dot-bg pointer-events-none absolute inset-0 opacity-25" />

      {/* Top Header Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/25 bg-mint/10 px-3 py-1 font-mono text-[0.72rem] font-medium tracking-wide text-mint">
          <Sparkles className="size-3.5 text-mint" />
          Septa Engineering
        </span>
        <span className="flex items-center gap-1 font-mono text-[0.68rem] text-faint">
          <Lock className="size-3 text-mint/70" /> Confidential &amp; Protected
        </span>
      </div>

      {/* Center 3D Isometric Art Sculpture with Interactive Hover */}
      <div className="relative my-8 flex items-center justify-center py-4">
        <div className="relative flex size-64 items-center justify-center sm:size-72">
          {/* Outer rotating orbital ring */}
          <div className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-mint/25" />
          {/* Middle glow ring */}
          <div className="absolute inset-5 rounded-full border border-mint/35 shadow-[0_0_24px_rgba(109,177,174,0.18)]" />

          {/* Isometric Pedestal Base */}
          <svg
            className="absolute bottom-2 size-56 text-brand-pearl"
            viewBox="0 0 240 140"
            fill="none"
            aria-hidden
          >
            {/* Shadow */}
            <ellipse cx="120" cy="115" rx="85" ry="24" fill="rgba(6,24,32,0.12)" />
            {/* Block Top */}
            <polygon
              points="120,40 190,75 120,110 50,75"
              fill="var(--color-surface-raised)"
              stroke="var(--color-line)"
              strokeWidth="1.5"
            />
            {/* Block Left */}
            <polygon
              points="50,75 120,110 120,126 50,91"
              fill="var(--color-ink-raised)"
              stroke="var(--color-line)"
              strokeWidth="1.5"
            />
            {/* Block Right */}
            <polygon
              points="120,110 190,75 190,91 120,126"
              fill="var(--color-surface)"
              stroke="var(--color-line)"
              strokeWidth="1.5"
            />
            {/* Circuit Lines on top of block */}
            <path
              d="M100,55 L120,65 L140,55 M120,65 L120,95 M85,70 L120,88 L155,70"
              stroke="var(--color-brand-teal)"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              fill="none"
            />
          </svg>

          {/* Floating Core Glow & Idea Symbol */}
          <div className="animate-float relative z-10 flex -translate-y-5 flex-col items-center">
            <div className="relative flex size-28 items-center justify-center rounded-3xl border border-mint/40 bg-gradient-to-tr from-brand-pearl via-[#133541] to-brand-teal p-1 shadow-[0_12px_36px_rgba(109,177,174,0.35)] transition-transform duration-300 hover:scale-110">
              <div className="flex size-full items-center justify-center rounded-[22px] bg-brand-pearl/90">
                <svg
                  className="size-14 text-brand-mint"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <line x1="12" y1="2" x2="12" y2="4" stroke="var(--color-brand-teal)" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="var(--color-brand-teal)" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="var(--color-brand-teal)" />
                </svg>
              </div>

              {/* Top Pill: 4-6 Weeks */}
              <span className="absolute -top-3 flex items-center gap-1 rounded-full border border-mint/50 bg-brand-pearl px-2.5 py-0.5 font-mono text-[0.62rem] font-semibold text-brand-mint shadow-sm">
                <Zap className="size-2.5 fill-brand-mint text-brand-mint" /> 4–6 WEEKS MVP
              </span>
            </div>
          </div>

          {/* Floating Capability Badge 1: Top Right */}
          <div className="absolute top-2 right-0 z-20 rounded-xl border border-line bg-surface-raised px-3.5 py-2 shadow-md transition-transform duration-300 hover:scale-105">
            <span className="flex items-center gap-1.5 font-mono text-[0.72rem] font-bold text-fg">
              <span className="size-2 animate-pulse rounded-full bg-mint" /> AI Product Dev
            </span>
          </div>

          {/* Floating Capability Badge 2: Bottom Left */}
          <div className="absolute bottom-8 left-0 z-20 rounded-xl border border-line bg-surface-raised px-3.5 py-2 shadow-md transition-transform duration-300 hover:scale-105">
            <span className="flex items-center gap-1.5 font-mono text-[0.72rem] font-bold text-fg">
              <span className="size-2 rounded-full bg-brand-teal" /> Workflow Automation
            </span>
          </div>

          {/* Floating Capability Badge 3: Top Left */}
          <div className="absolute top-8 left-2 z-20 rounded-xl border border-line bg-surface-raised px-3 py-1.5 shadow-md">
            <span className="font-mono text-[0.68rem] font-semibold text-fg">
              100% Client IP
            </span>
          </div>
        </div>
      </div>

      {/* Trust & Channel Footnote */}
      <div className="relative z-10 space-y-3.5 rounded-xl border border-line bg-surface-raised/80 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-mint/10 text-mint">
              <Clock className="size-3.5" />
            </span>
            <div>
              <p className="font-mono text-[0.68rem] tracking-wider text-faint uppercase">Response SLA</p>
              <p className="text-[0.82rem] font-medium text-fg">Typically answered within 24 hours</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded border border-line bg-ink-raised px-2 py-0.5 font-mono text-[0.68rem] text-muted">
            <ShieldCheck className="size-3 text-mint" /> Mutual NDA
          </span>
        </div>

        {/* Email with copy button */}
        <div className="flex items-center justify-between border-t border-line/60 pt-2.5 text-[0.82rem]">
          <span className="flex items-center gap-1.5 text-muted">
            <Mail className="size-3.5 text-mint" /> {displayEmail}
          </span>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="flex items-center gap-1 font-mono text-[0.7rem] text-mint hover:underline"
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <Check className="size-3 text-mint" /> Copied
              </>
            ) : (
              <>
                <Copy className="size-3" /> Copy
              </>
            )}
          </button>
        </div>

        {/* Social channels from site.ts */}
        {site.social.length > 0 ? (
          <div className="flex items-center justify-between border-t border-line/60 pt-2.5">
            <span className="font-mono text-[0.68rem] text-faint uppercase">Follow Septa</span>
            <div className="flex items-center gap-2">
              {site.social.map((s) => (
                <a
                  key={s.network}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="mark-chip flex size-7 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:border-mint/50 hover:text-mint"
                >
                  <SocialMark network={s.network} className="size-3" />
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
