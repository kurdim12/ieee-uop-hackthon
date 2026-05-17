const ITEMS = [
  'HACKATHON 2026',
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
          <span className="px-4 text-amber">●</span>
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
