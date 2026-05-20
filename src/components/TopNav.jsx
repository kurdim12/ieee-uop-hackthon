import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Brand from './Brand.jsx';
import { useT } from '../i18n/index.jsx';

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function TopNav({ status }) {
  const { pathname } = useLocation();
  const now = useClock();
  const { t, lang, setLang } = useT();

  const time = now.toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  const labels = t.nav.labels;
  const label = pathname.startsWith('/judge/')
    ? labels['/judge/']
    : (labels[pathname] ?? pathname.toUpperCase());

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 grid grid-cols-3 items-center gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <Brand size="sm" className="hidden md:inline-flex" />
          <span className="md:hidden text-lg font-bold tracking-tight text-ieee">
            IEEE <span className="text-petra">UoP</span>
          </span>
        </Link>

        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {label}
          </span>
        </div>

        <div className="flex items-center justify-end gap-3">
          {status && (
            <span className="hidden md:inline-flex badge-mono">
              {status}
            </span>
          )}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            aria-label="Switch language"
            title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            {t.langSwitch}
          </button>
          <span className="text-xs font-medium tabular-nums text-slate-400">{time}</span>
        </div>
      </div>
    </header>
  );
}
