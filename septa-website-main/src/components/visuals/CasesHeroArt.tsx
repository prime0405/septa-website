/**
 * The case-studies plate: a printer's proof sheet.
 *
 * Where About draws survey orbits and the blog draws a manuscript, the case studies draw the
 * contact sheet a studio pins proofs to — a grid of empty frames with frame numbers and
 * registration crosses, one frame picked out in mint as the selected proof. It is the honest
 * metaphor for this page: a set of documented pieces of work, laid out for review, not a hero
 * photograph pretending to be a client site.
 *
 * Paint only: one gradient field, one SVG sheet, grain and a foot fade. Nothing animates, so the
 * plate stays still off the homepage and `prefers-reduced-motion` has nothing to collapse.
 */
export function CasesHeroArt() {
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
            "radial-gradient(52% 66% at 88% 8%, color-mix(in oklab, var(--color-brand-teal-lift) 26%, transparent) 0%, transparent 62%), radial-gradient(40% 54% at 6% 92%, color-mix(in oklab, var(--color-mint-deep) 12%, transparent) 0%, transparent 64%)",
        }}
      />
      {/* the proof sheet: three columns of frames, numbered, one selected */}
      <svg
        className="absolute -top-16 -right-20 size-[300px] text-brand-teal sm:size-[560px]"
        viewBox="0 0 560 560"
        fill="none"
      >
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => {
            const x = 40 + col * 170;
            const y = 40 + row * 170;
            const selected = row === 1 && col === 1;
            return (
              <g key={`${row}-${col}`}>
                <rect
                  x={x}
                  y={y}
                  width="140"
                  height="110"
                  stroke="currentColor"
                  strokeOpacity={selected ? 0.75 : 0.28}
                  strokeWidth={selected ? 1.6 : 1}
                />
                <text
                  x={x}
                  y={y - 8}
                  fill="currentColor"
                  fillOpacity={selected ? 0.8 : 0.4}
                  fontSize="11"
                  fontFamily="JetBrains Mono Variable, monospace"
                >
                  {String(row * 3 + col + 1).padStart(2, "0")}
                </text>
                {selected && (
                  <g stroke="var(--color-brand-mint)" strokeOpacity="0.8">
                    <line x1={x - 8} y1={y} x2={x + 8} y2={y} />
                    <line x1={x} y1={y - 8} x2={x} y2={y + 8} />
                    <line x1={x + 132} y1={y + 110} x2={x + 148} y2={y + 110} />
                    <line x1={x + 140} y1={y + 102} x2={x + 140} y2={y + 118} />
                  </g>
                )}
              </g>
            );
          }),
        )}
        <circle cx="40" cy="40" r="3" fill="var(--color-brand-mint)" fillOpacity="0.6" />
      </svg>
      {/* a faint diagonal crop mark bottom-left, the trim line of a printed sheet */}
      <svg
        className="absolute -bottom-10 -left-10 size-[150px] text-brand-teal opacity-60 sm:size-[240px]"
        viewBox="0 0 240 240"
        fill="none"
      >
        <line x1="0" y1="240" x2="240" y2="0" stroke="currentColor" strokeOpacity="0.3" />
        <line x1="0" y1="200" x2="200" y2="0" stroke="currentColor" strokeOpacity="0.18" />
      </svg>
      <div className="grain absolute inset-0 opacity-[0.05]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink" />
    </div>
  );
}