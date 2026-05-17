import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const PAGE_LABELS = {
  '/': 'INDEX',
  '/submit': 'SUBMISSION',
  '/register': 'SUBMISSION',
  '/login': 'JUDGE LOGIN',
  '/judge': 'JUDGE DESK',
  '/leaderboard': 'LEADERBOARD',
  '/admin': 'ADMIN',
  '/admin/login': 'ADMIN LOGIN',
};

function getPageLabel(pathname) {
  if (pathname.startsWith('/judge/')) return 'SCORING';
  return PAGE_LABELS[pathname] ?? pathname.toUpperCase();
}

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
  const time = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const label = getPageLabel(pathname);

  return (
    <header className="border-b-2 border-ink bg-paper sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 grid grid-cols-3 items-center gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display italic font-black text-2xl tracking-tight">
            JUDGE<span className="text-amber">.</span>
          </span>
          <span className="hidden sm:inline-flex badge-mono border-ink/30 text-ink/60">v1</span>
        </Link>
        <div className="text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink/70">
            {label}
          </span>
        </div>
        <div className="flex items-center justify-end gap-3">
          {status && (
            <span className="hidden md:inline-flex badge-mono bg-amber text-white border-ink">
              {status}
            </span>
          )}
          <span className="font-mono text-[12px] tabular-nums tracking-wider">{time}</span>
        </div>
      </div>
    </header>
  );
}
