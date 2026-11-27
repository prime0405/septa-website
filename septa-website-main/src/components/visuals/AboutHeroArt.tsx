/*
 * The About header's plate. Static by design: the interior pages keep their still white ground, so
 * this is paint, not motion — a pearl-to-white fall, three mesh stops in the brand's own hues (cool
 * teal lift at the reading corner, teal at the art corner, one warm amber breath low right so the
 * field is not monochrome), and the contour orbit the homepage spiral draws, here frozen mid-turn
 * as line art. The grain is the same speckle the vision band uses, kept under 6% so the smallest
 * mono label on the plate never loses its contrast margin.
 */
export function AboutHeroArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--color-surface) 0%, var(--color-ink) 58%, var(--color-ink-raised) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(52% 68% at 10% 6%, color-mix(in oklab, var(--color-brand-teal-lift) 30%, transparent) 0%, transparent 62%), radial-gradient(46% 62% at 90% 26%, color-mix(in oklab, var(--color-brand-teal) 20%, transparent) 0%, transparent 60%), radial-gradient(40% 48% at 68% 100%, color-mix(in oklab, var(--color-amber) 9%, transparent) 0%, transparent 64%)",
        }}
      />
      <svg
        className="absolute -right-44 -top-56 size-[720px] text-brand-teal"
        viewBox="0 0 720 720"
        fill="none"
      >
        <circle cx="360" cy="360" r="140" stroke="currentColor" strokeOpacity="0.55" />
        <circle cx="360" cy="360" r="192" stroke="currentColor" strokeOpacity="0.42" />
        <circle cx="360" cy="360" r="244" stroke="currentColor" strokeOpacity="0.32" />
        <circle cx="360" cy="360" r="296" stroke="currentColor" strokeOpacity="0.22" />
        <circle cx="360" cy="360" r="348" stroke="currentColor" strokeOpacity="0.14" />
        <circle
          cx="360"
          cy="360"
          r="268"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeDasharray="2 12"
        />
        <circle cx="656" cy="360" r="4" fill="var(--color-mint)" fillOpacity="0.7" />
        <circle cx="224" cy="224" r="3.5" fill="var(--color-mint)" fillOpacity="0.55" />
        <circle cx="360" cy="116" r="3" fill="var(--color-brand-teal)" fillOpacity="0.8" />
      </svg>
      <svg
        className="absolute -bottom-40 -left-44 size-[520px] text-brand-teal opacity-60"
        viewBox="0 0 520 520"
        fill="none"
      >
        <circle cx="260" cy="260" r="120" stroke="currentColor" strokeOpacity="0.3" />
        <circle cx="260" cy="260" r="176" stroke="currentColor" strokeOpacity="0.2" />
        <circle cx="260" cy="260" r="232" stroke="currentColor" strokeOpacity="0.12" />
        <circle cx="380" cy="260" r="3.5" fill="var(--color-mint)" fillOpacity="0.45" />
      </svg>
      <div className="grain absolute inset-0 opacity-[0.05]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink" />
    </div>
  );
}