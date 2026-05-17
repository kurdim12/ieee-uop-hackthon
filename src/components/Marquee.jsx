const ITEMS = [
  'IEEE UOP HACKATHON 2026',
  'UNIVERSITY OF PETRA STUDENT BRANCH',
  'DEMO DAY',
  'BUILD WEIRD',
  'BUILD HARD',
  'SHIP IT',
  'JUDGE FAIRLY',
];

function Strip() {
  return (
    <div className="marquee-track">
      {ITEMS.concat(ITEMS).map((t, i) => (
        <span key={i} className="flex items-center pr-8">
          <span className="font-mono text-[12px] tracking-[0.25em] uppercase">{t}</span>
          <span className="px-4 text-petra">●</span>
          <span className="font-mono text-[12px] tracking-[0.25em] uppercase text-ieee/80">
            {/* small accent dot color separator handled via next iteration */}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="bg-ink text-paper border-b-2 border-ink overflow-hidden">
      <div className="flex animate-marquee py-2">
        <Strip />
        <Strip />
      </div>
    </div>
  );
}
