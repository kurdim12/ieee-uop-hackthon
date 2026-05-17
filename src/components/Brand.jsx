// IEEE University of Petra Student Branch brand lockup.
// Inline SVG so it scales without an external asset.
// If you have the official PNG/SVG, drop it at /public/brand.svg and
// swap this component to render <img src="/brand.svg" />.

export default function Brand({ size = 'sm', className = '' }) {
  const cfg = {
    sm: { ieee: 22, petra: 22, label: 9, gap: 10 },
    md: { ieee: 32, petra: 32, label: 11, gap: 14 },
    lg: { ieee: 56, petra: 56, label: 14, gap: 22 },
  }[size];

  return (
    <div className={`inline-flex items-center ${className}`} style={{ gap: cfg.gap }}>
      <IEEEMark height={cfg.ieee} />
      <div className="h-full w-px bg-ink/30" style={{ height: cfg.ieee * 0.9 }} />
      <PetraMark height={cfg.petra} />
      <div
        className="font-sans font-bold uppercase tracking-[0.16em] leading-tight"
        style={{ fontSize: cfg.label }}
      >
        <span className="text-petra">University of Petra</span>{' '}
        <span className="text-ieee">Student Branch</span>
      </div>
    </div>
  );
}

function IEEEMark({ height = 24 }) {
  const w = height * 2.2;
  return (
    <svg height={height} viewBox="0 0 110 50" aria-label="IEEE">
      <g transform="translate(2,4)">
        <polygon
          points="20,0 40,20 20,40 0,20"
          fill="#00629B"
          stroke="#00629B"
          strokeWidth="1"
        />
        <path
          d="M20 8 L20 32 M16 22 L20 26 L24 22"
          stroke="#fff"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="square"
        />
      </g>
      <text
        x="48"
        y="33"
        fontFamily="'Inter Tight', sans-serif"
        fontWeight="900"
        fontSize="28"
        fill="#00629B"
        letterSpacing="-1"
      >
        IEEE
      </text>
    </svg>
  );
}

function PetraMark({ height = 24 }) {
  return (
    <svg height={height} viewBox="0 0 56 50" aria-label="University of Petra">
      <g fill="#a8242f" stroke="#a8242f" strokeWidth="0.6">
        {/* Pediment */}
        <polygon points="6,18 28,4 50,18 50,22 6,22" />
        {/* Columns */}
        <rect x="9" y="22" width="5" height="22" />
        <rect x="17" y="22" width="5" height="22" />
        <rect x="25" y="22" width="6" height="22" />
        <rect x="34" y="22" width="5" height="22" />
        <rect x="42" y="22" width="5" height="22" />
        {/* Capitals */}
        <rect x="7" y="22" width="9" height="2.5" />
        <rect x="15" y="22" width="9" height="2.5" />
        <rect x="23" y="22" width="10" height="2.5" />
        <rect x="32" y="22" width="9" height="2.5" />
        <rect x="40" y="22" width="9" height="2.5" />
        {/* Base */}
        <rect x="4" y="44" width="48" height="3" />
        {/* Center doorway */}
        <rect x="25" y="30" width="6" height="14" fill="#f6f8fb" stroke="none" />
      </g>
    </svg>
  );
}

export function BrandStacked({ className = '' }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center gap-6">
        <IEEEMark height={56} />
        <div className="h-14 w-[2px] bg-petra" />
        <PetraMark height={56} />
      </div>
      <div className="mt-3 font-sans font-bold uppercase tracking-[0.22em] text-sm">
        <span className="text-petra">University of Petra</span>{' '}
        <span className="text-ieee">Student Branch</span>
      </div>
    </div>
  );
}
