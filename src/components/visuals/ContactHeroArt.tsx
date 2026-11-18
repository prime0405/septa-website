/**
 * The contact plate: a switchboard and a stamped envelope.
 *
 * The other interior plates draw their subject's instrument — orbits, a manuscript, a proof sheet,
 * a schematic. Contact draws the moment a message arrives: routes converging from the edges of the
 * sheet into a single inbox node, and a postage stamp with a postmark in the right margin. It says
 * "send it here and it lands somewhere real", which is exactly what the form below promises.
 *
 * Paint only: gradient field, one SVG of converging routes and the stamp, grain and a foot fade.
 * Nothing animates off the homepage; reduced motion has nothing to collapse.
 */
export function ContactHeroArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--color-surface) 0%, var(--color-ink) 56%, var(--color-ink-raised) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 64% at 86% 10%, color-mix(in oklab, var(--color-brand-teal-lift) 26%, transparent) 0%, transparent 62%), radial-gradient(42% 56% at 8% 94%, color-mix(in oklab, var(--color-amber) 9%, transparent) 0%, transparent 64%)",
        }}
      />
      {/* routes converging on the inbox node */}
      <svg
        className="absolute -top-12 -right-16 size-[320px] text-brand-teal max-sm:-top-24 sm:size-[520px]"
        viewBox="0 0 520 520"
        fill="none"
      >
        <g stroke="currentColor" strokeOpacity="0.34">
          <path d="M40 60 C 180 90, 240 160, 300 240" />
          <path d="M480 40 C 420 120, 360 180, 320 240" />
          <path d="M60 460 C 160 400, 240 320, 300 280" />
          <path d="M480 470 C 420 400, 360 330, 320 280" />
        </g>
        <rect x="270" y="230" width="80" height="60" rx="8" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.6" />
        <path d="M270 236 L310 268 L350 236" stroke="var(--color-brand-mint)" strokeOpacity="0.8" />
        <circle cx="40" cy="60" r="3" fill="var(--color-brand-mint)" fillOpacity="0.6" />
        <circle cx="480" cy="40" r="3" fill="var(--color-brand-mint)" fillOpacity="0.45" />
        <circle cx="60" cy="460" r="3" fill="var(--color-brand-mint)" fillOpacity="0.4" />
        <circle cx="480" cy="470" r="3" fill="var(--color-brand-mint)" fillOpacity="0.55" />
      </svg>
      {/* the stamp: a perforated frame (dots, not dashes) with a postmark ring over its corner */}
      <svg
        className="absolute -bottom-8 -left-8 size-[170px] text-brand-teal opacity-70 sm:size-[260px]"
        viewBox="0 0 260 260"
        fill="none"
      >
        <rect x="40" y="40" width="150" height="180" stroke="currentColor" strokeOpacity="0.35" />
        {Array.from({ length: 10 }, (_, i) => (
          <g key={i} fill="currentColor" fillOpacity="0.4">
            <circle cx={40 + i * 16.6} cy="40" r="2" />
            <circle cx={40 + i * 16.6} cy="220" r="2" />
          </g>
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <g key={i} fill="currentColor" fillOpacity="0.4">
            <circle cx="40" cy={40 + i * 18} r="2" />
            <circle cx="190" cy={40 + i * 18} r="2" />
          </g>
        ))}
        <circle cx="180" cy="60" r="46" stroke="currentColor" strokeOpacity="0.4" />
        <circle cx="180" cy="60" r="34" stroke="currentColor" strokeOpacity="0.28" />
        <line x1="134" y1="60" x2="226" y2="60" stroke="currentColor" strokeOpacity="0.3" />
      </svg>
      <div className="grain absolute inset-0 opacity-[0.05]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink" />
    </div>
  );
}