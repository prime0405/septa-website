import type { CSSProperties } from "react";
import { partners } from "../../data/content";

export function ContactPartnerTicker() {
  return (
    <div className="border-y border-line/60 bg-surface/80 py-7 backdrop-blur-sm">
      <div className="wrap mb-4 text-center">
        <p className="font-mono text-[0.7rem] font-bold tracking-[0.2em] text-faint uppercase">
          Trusted by Innovative Teams &amp; Enterprises
        </p>
      </div>

      <div className="marquee marquee-logos">
        <div className="marquee-inner">
          {[0, 1].map((copy) => (
            <div key={copy} className="marquee-group" aria-hidden={copy === 1 || undefined}>
              {partners.map((p) => (
                <span key={`${p.name}-${copy}`} className="partner-slot">
                  {p.mark ? (
                    <img
                      src={p.mark}
                      alt={p.name}
                      decoding="async"
                      className="partner-mark"
                      style={{ "--mark-h": `${p.height}px` } as CSSProperties}
                    />
                  ) : (
                    <span className="partner-word">{p.name}</span>
                  )}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
