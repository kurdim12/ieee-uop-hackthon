import Marquee from './Marquee.jsx';
import TopNav from './TopNav.jsx';
import Brand from './Brand.jsx';
import { useT } from '../i18n/index.jsx';

export default function Layout({ children, status }) {
  const { t } = useT();
  return (
    <div className="paper-grain min-h-screen flex flex-col">
      <Marquee />
      <TopNav status={status} />
      <main className="flex-1">{children}</main>
      <footer className="border-t-2 border-ink mt-24 bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Brand size="sm" />
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/70 ltr:text-right rtl:text-left">
            <div>{t.footer.line1}</div>
            <div className="mt-1 text-ink/50">{t.footer.line2}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
