/**
 * The services plate: a delivery schematic.
 *
 * About draws orbits, the blog a manuscript, the case studies a proof sheet; the services draw the
 * thing this page actually sells — a pipeline. Five numbered stage nodes sit on orthogonal routes
 * across swimlanes, the way a workflow diagram reads, with a legend of the same nodes down the
 * left margin. It is a schematic of how work moves, not a decoration of dots.
 *
 * Paint only: gradient field, lane rules, one SVG of nodes and routes, grain and a foot fade.
 * Nothing animates off the homepage; reduced motion has nothing to collapse.
 */
export function ServicesHeroArt() {
  const nodes = [
    { x: 90, y: 90, n: "01" },
    { x: 250, y: 90, n: "02" },
    { x: 250, y: 230, n: "03" },
    { x: 410, y: 230, n: "04" },
    { x: 410, y: 370, n: "05" },
  ];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(132deg, #344B49 0%, #123A43 52%, #061820 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 64% at 12% 6%, rgba(109,177,174,.28) 0%, transparent 62%), radial-gradient(44% 58% at 90% 90%, rgba(95,221,157,.12) 0%, transparent 64%)",
        }}
      />
      {/* swimlanes: the horizontal bands a workflow diagram keeps its stages in */}
      <div
        className="mask-fade absolute inset-0 opacity-40"
        style={{
          background:
            "repeating-linear-gradient(to bottom, color-mix(in oklab, #344B49 24%, transparent) 0 1px, transparent 1px 96px)",
        }}
      />
      <svg
        className="absolute -top-10 -right-16 size-[300px] text-[#6DB1AE] sm:size-[520px]"
        viewBox="0 0 520 460"
        fill="none"
      >
        {/* orthogonal routes between stages */}
        <g stroke="currentColor" strokeOpacity="0.4">
          <line x1="130" y1="90" x2="210" y2="90" />
          <line x1="250" y1="130" x2="250" y2="190" />
          <line x1="290" y1="230" x2="370" y2="230" />
          <line x1="410" y1="270" x2="410" y2="330" />
        </g>
        {nodes.map((nd, i) => (
          <g key={nd.n}>
            <rect
              x={nd.x - 40}
              y={nd.y - 40}
              width="80"
              height="80"
              rx="10"
              stroke="currentColor"
              strokeOpacity={i === 4 ? 0.7 : 0.34}
              strokeWidth={i === 4 ? 1.6 : 1}
            />
            <text
              x={nd.x}
              y={nd.y + 4}
              textAnchor="middle"
              fill="currentColor"
              fillOpacity={i === 4 ? 0.85 : 0.5}
              fontSize="13"
              fontFamily="JetBrains Mono Variable, monospace"
            >
              {nd.n}
            </text>
            {i === 4 && (
              <circle cx={nd.x + 40} cy={nd.y - 40} r="4" fill="var(--color-brand-mint)" fillOpacity="0.8" />
            )}
          </g>
        ))}
        <circle cx="90" cy="50" r="3" fill="var(--color-brand-mint)" fillOpacity="0.5" />
      </svg>
      {/* the legend down the left margin: the same five nodes as a key */}
      <svg
        className="absolute inset-y-0 left-0 hidden h-full w-20 text-[#6DB1AE] opacity-70 sm:block"
        viewBox="0 0 80 800"
        preserveAspectRatio="none"
        fill="none"
      >
        <line x1="48" y1="0" x2="48" y2="800" stroke="currentColor" strokeOpacity="0.3" />
        {[120, 260, 400, 540, 680].map((y, i) => (
          <g key={y}>
            <rect x="40" y={y - 8} width="16" height="16" rx="3" stroke="currentColor" strokeOpacity="0.4" />
            <circle cx="48" cy={y} r="2" fill="var(--color-brand-mint)" fillOpacity={0.6 - i * 0.08} />
          </g>
        ))}
      </svg>
      <div className="grain absolute inset-0 opacity-[0.05]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#6DB1AE]" />
    </div>
  );
}