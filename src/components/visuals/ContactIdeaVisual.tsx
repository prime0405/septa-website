export function ContactIdeaVisual() {
  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-card border border-[#1e3940] bg-[#091a20]">
      <style>{`
        .contact-core {
          transform-box: fill-box;
          transform-origin: center;
          animation: core-hover 6s ease-in-out infinite;
        }
        .contact-orbit {
          transform-origin: 210px 210px;
          animation: orbit-turn 28s linear infinite;
        }
        .contact-signal {
          stroke-dasharray: 0.12 0.88;
          stroke-dashoffset: 1;
          animation: signal-run 4.2s cubic-bezier(.45, 0, .55, 1) infinite;
        }
        .contact-glow {
          animation: glow-breathe 4.2s ease-in-out infinite;
        }
        @keyframes core-hover {
          0%, 100% { transform: translateY(5px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes orbit-turn {
          to { transform: rotate(360deg); }
        }
        @keyframes signal-run {
          0%, 15% { stroke-dashoffset: 1; opacity: .15; }
          60%, 85% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -1; opacity: .15; }
        }
        @keyframes glow-breathe {
          0%, 100% { opacity: .22; }
          50% { opacity: .48; }
        }
        @media (prefers-reduced-motion: reduce) {
          .contact-core, .contact-orbit, .contact-signal, .contact-glow {
            animation: none;
          }
          .contact-signal { stroke-dashoffset: 0; opacity: .6; }
        }
      `}</style>

      <svg
        viewBox="0 0 420 420"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Animated abstract system architecture"
      >
        <defs>
          <radialGradient id="contact-backlight" cx="0" cy="0" r="1" gradientTransform="matrix(0 246 -246 0 210 206)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#28534F" stopOpacity=".72" />
            <stop offset="1" stopColor="#091A20" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="contact-top" x1="120" y1="110" x2="300" y2="212" gradientUnits="userSpaceOnUse">
            <stop stopColor="#376B65" />
            <stop offset="1" stopColor="#18363A" />
          </linearGradient>
          <linearGradient id="contact-left" x1="125" y1="185" x2="211" y2="315" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1B4545" />
            <stop offset="1" stopColor="#102D33" />
          </linearGradient>
          <linearGradient id="contact-right" x1="210" y1="205" x2="305" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="#24504E" />
            <stop offset="1" stopColor="#102A30" />
          </linearGradient>
          <filter id="contact-blur" x="30" y="58" width="360" height="318" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <pattern id="contact-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" stroke="#91BDB3" strokeOpacity=".09" />
          </pattern>
        </defs>

        <path fill="url(#contact-backlight)" d="M0 0h420v420H0z" />
        <path fill="url(#contact-grid)" d="M0 0h420v420H0z" />
        <ellipse className="contact-glow" cx="210" cy="224" rx="112" ry="80" fill="#5FDD9D" opacity=".3" filter="url(#contact-blur)" />

        <g className="contact-orbit" opacity=".8">
          <ellipse cx="210" cy="210" rx="164" ry="62" stroke="#7BAAA0" strokeOpacity=".38" strokeWidth="1" transform="rotate(-32 210 210)" />
          <ellipse cx="210" cy="210" rx="144" ry="84" stroke="#7BAAA0" strokeOpacity=".18" strokeWidth="1" transform="rotate(58 210 210)" />
          <circle cx="363" cy="118" r="4" fill="#A4D9C1" />
          <circle cx="70" cy="206" r="3" fill="#6DB1AE" />
        </g>

        <g className="contact-core">
          <path d="m210 105 102 58-102 59-102-59 102-59Z" fill="url(#contact-top)" stroke="#77A99D" strokeOpacity=".8" strokeWidth="1.5" />
          <path d="m108 163 102 59v120l-102-59V163Z" fill="url(#contact-left)" stroke="#56857E" strokeOpacity=".7" strokeWidth="1.5" />
          <path d="m210 222 102-59v120l-102 59V222Z" fill="url(#contact-right)" stroke="#6B9E91" strokeOpacity=".72" strokeWidth="1.5" />

          <path d="m210 137 47 26-47 27-47-27 47-26Z" fill="#0E292E" stroke="#77A99D" strokeOpacity=".68" />
          <path d="m163 163 47 27v55l-47-27v-55Z" fill="#15373B" stroke="#77A99D" strokeOpacity=".48" />
          <path d="m210 190 47-27v55l-47 27v-55Z" fill="#204742" stroke="#77A99D" strokeOpacity=".62" />

          <path d="M210 163v83" stroke="#A3D9BD" strokeOpacity=".7" strokeWidth="1.5" />
          <circle className="contact-glow" cx="210" cy="163" r="14" fill="#5FDD9D" opacity=".3" filter="url(#contact-blur)" />
          <circle cx="210" cy="163" r="4" fill="#B7E5CB" />
        </g>

        <path className="contact-signal" pathLength="1" d="m108 163 102 59 102-59" stroke="#A5E3C0" strokeWidth="2.5" strokeLinecap="round" />
        <path d="m108 163 102 59 102-59" stroke="#8DB8A9" strokeOpacity=".22" strokeWidth="1" />
        <circle cx="108" cy="163" r="3" fill="#B7DCCD" />
        <circle cx="312" cy="163" r="3" fill="#B7DCCD" />
      </svg>
    </div>
  );
}
