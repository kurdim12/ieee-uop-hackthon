import TopNav from './TopNav.jsx';
import Brand from './Brand.jsx';
import { useT } from '../i18n/index.jsx';

export default function Layout({ children, status }) {
  const { t } = useT();
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav status={status} />
      <main className="flex-1">{children}</main>
      <footer className="mt-24 border-t border-slate-100 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <Brand size="sm" />
          <div className="text-xs font-medium text-slate-500 ltr:text-right rtl:text-left">
            <div>{t.footer.line1}</div>
            <div className="mt-1 text-slate-400">{t.footer.line2}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
