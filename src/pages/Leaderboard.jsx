import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { IconBolt } from '../components/Icons.jsx';
import { useT } from '../i18n/index.jsx';

// The live leaderboard is intentionally hidden during the event.
// To re-enable it: restore the previous version of this file from git
// (e.g. `git show bc27ff3:src/pages/Leaderboard.jsx > src/pages/Leaderboard.jsx`).

export default function Leaderboard() {
  const { t } = useT();
  const LB = t.leaderboard;

  return (
    <Layout status={t.status.live}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-32 text-center">
        <div className="card-brut bg-white p-12 sm:p-16">
          <IconBolt className="mx-auto text-ieee mb-6" width="56" height="56" />
          <div className="eyebrow mb-4">{LB.eyebrow}</div>
          <h1 className="font-display font-extrabold text-5xl sm:text-7xl leading-[0.9]">
            {LB.titleA}<br />
            <span className="italic text-ieee">{LB.titleB}</span>
          </h1>
          <p className="mt-8 text-lg text-slate-500">
            {LB.lockedSub || 'The leaderboard is locked until judging is complete. Winners will be announced on the main stage.'}
          </p>
          <div className="mt-10">
            <Link to="/" className="btn-ghost">
              ← {t.submit?.success?.backHome || 'Back to home'}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
