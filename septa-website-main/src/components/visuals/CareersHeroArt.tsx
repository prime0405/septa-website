/**
 * The career plate: a growth staircase.
 *
 * About draws orbits, the blog a manuscript, the case studies a proof sheet, the services a
 * schematic, contact a switchboard. Career draws the thing a candidate is actually looking at:
 * a ladder of steps rising across the sheet, numbered tread by tread, with a flag planted on the
 * top step and a measuring scale down the left margin. Aspiration drawn as stationery, not as a
 * stock photo of a summit.
 *
 * Paint only: gradient field, one SVG staircase, one margin scale, grain and a foot fade. Nothing
 * animates off the homepage; reduced motion has nothing to collapse.
 */
export function CareersHeroArt() {
  const treads = [
    { x: 90, y: 420, n: "01" },
    { x: 190, y: 340, n: "02" },
    { x: 290, y: 260, n: "03" },
    { x: 390, y: 180, n: "04" },
    { x: 470, y: 100, n: "05" },
  ];
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
            "radial-gradient(50% 62% at 74% 6%, color-mix(in oklab, var(--color-brand-teal-lift) 22%, transparent) 0%, transparent 62%), radial-gradient(42% 56% at 10% 90%, color-mix(in oklab, var(--color-mint-deep) 10%, transparent) 0%, transparent 64%)",
        }}
      />
      {/* the staircase: five numbered treads rising to a flagged top step */}
      <svg
        className="absolute -top-2 right-0 size-[200px] text-brand-teal sm:-top-10 sm:size-[520px]"
        viewBox="0 0 520 460"
        fill="none"
      >
        <line x1="40" y1="420" x2="500" y2="420" stroke="currentColor" strokeOpacity="0.25" />
        <path
          d="M40 420 H140 V340 H240 V260 H340 V180 H440 V100 H500"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
        <g stroke="currentColor" strokeOpacity="0.22" strokeDasharray="2 7">
          <line x1="140" y1="340" x2="140" y2="420" />
          <line x1="240" y1="260" x2="240" y2="420" />
          <line x1="340" y1="180" x2="340" y2="420" />
          <line x1="440" y1="100" x2="440" y2="420" />
        </g>
        {treads.map((t, i) => (
          <text
            key={t.n}
            x={t.x}
            y={t.y - 12}
            textAnchor="middle"
            fill="currentColor"
            fillOpacity={i === 4 ? 0.8 : 0.45}
            fontSize="11"
            fontFamily="JetBrains Mono Variable, monospace"
          >
            {t.n}
          </text>
        ))}
        <line x1="470" y1="100" x2="470" y2="52" stroke="var(--color-brand-mint)" strokeOpacity="0.8" />
        <path d="M470 52 L502 62 L470 72 Z" fill="var(--color-brand-mint)" fillOpacity="0.45" />
        <circle cx="470" cy="100" r="3.5" fill="var(--color-brand-mint)" fillOpacity="0.8" />
        <circle cx="40" cy="420" r="3" fill="var(--color-brand-mint)" fillOpacity="0.5" />
      </svg>
      {/* the measuring scale down the left margin: ticks a growth chart keeps its levels on */}
      <svg
        className="absolute inset-y-0 left-0 hidden h-full w-20 text-brand-teal opacity-70 sm:block"
        viewBox="0 0 80 800"
        preserveAspectRatio="none"
        fill="none"
      >
        <line x1="48" y1="0" x2="48" y2="800" stroke="currentColor" strokeOpacity="0.3" />
        {[140, 280, 420, 560, 700].map((y, i) => (
          <g key={y}>
            <line x1="40" y1={y} x2="56" y2={y} stroke="currentColor" strokeOpacity="0.35" />
            <circle cx="48" cy={y} r="2" fill="var(--color-brand-mint)" fillOpacity={0.6 - i * 0.08} />
          </g>
        ))}
      </svg>
      <div className="grain absolute inset-0 opacity-[0.05]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink" />
    </div>
  );
}