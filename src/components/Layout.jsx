import Marquee from './Marquee.jsx';
import TopNav from './TopNav.jsx';

export default function Layout({ children, status }) {
  return (
    <div className="paper-grain min-h-screen flex flex-col">
      <Marquee />
      <TopNav status={status} />
      <main className="flex-1">{children}</main>
      <footer className="border-t-2 border-ink mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/70">
            © 2026 · Hackathon Demo Day · University Edition
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/70">
            Built in a day · Judged in a night
          </span>
        </div>
      </footer>
    </div>
  );
}
