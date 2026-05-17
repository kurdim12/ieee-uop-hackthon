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
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const labels = t.nav.labels;
  const label = pathname.startsWith('/judge/') ? labels['/judge/'] : (labels[pathname] ?? pathname.toUpperCase());

  return (
    <header className="border-b-2 border-ink bg-paper sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 grid grid-cols-3 items-center gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <Brand size="sm" className="hidden md:inline-flex" />
          <span className="md:hidden font-display italic font-black text-xl tracking-tight text-ieee">
            IEEE <span className="text-petra">UoP</span>
          </span>
          <span className="hidden lg:inline-flex font-display italic font-black text-xl tracking-tight border-l-2 border-ink/30 ltr:pl-3 rtl:pr-3 ltr:ml-1 rtl:mr-1">
            {t.nav.platformDot.split('.')[0]}<span className="text-ieee">.</span>
          </span>
        </Link>
        <div className="text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink/70">
            {label}
          </span>
        </div>
        <div className="flex items-center justify-end gap-3">
          {status && (
            <span className="hidden md:inline-flex badge-mono bg-ieee text-white border-ink">
              {status}
            </span>
          )}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="badge-mono border-ink bg-paper hover:bg-ieee hover:text-white transition-colors"
            aria-label="Switch language"
            title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            {t.langSwitch}
          </button>
          <span className="font-mono text-[12px] tabular-nums tracking-wider">{time}</span>
        </div>
      </div>
    </header>
  );
}
