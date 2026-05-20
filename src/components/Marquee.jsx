import { useT } from '../i18n/index.jsx';

function Strip({ items }) {
  return (
    <div className="marquee-track">
      {items.concat(items).map((t, i) => (
        <span key={i} className="flex items-center pr-8">
          <span className="font-mono text-[12px] tracking-[0.25em] uppercase">{t}</span>
          <span className="px-4 text-petra">●</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  const { t } = useT();
  return (
    <div className="bg-slate-900 text-white border-b border-slate-100 overflow-hidden">
      <div className="flex animate-marquee py-2">
        <Strip items={t.marquee} />
        <Strip items={t.marquee} />
      </div>
    </div>
  );
}
