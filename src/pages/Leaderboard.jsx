import { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { supabase } from '../lib/supabase.js';
import { useT } from '../i18n/index.jsx';

const REQUIRED_JUDGES = 3;
const REFRESH_MS = 10000;

function useLeaderboard(LB) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data, error: qErr } = await supabase
        .from('leaderboard')
        .select('team_id, team_name, project_title, members, total_score, avg_score, judges_scored');
      if (qErr) throw qErr;
      setRows(data || []);
      setError('');
      setLastUpdated(new Date());
    } catch (err) {
      setError(err?.message || LB.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [LB.loadFailed]);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  return { rows, loading, error, lastUpdated, refresh: load };
}

function partitionRows(rows) {
  const complete = [];
  const pending = [];
  rows.forEach((r) => {
    if (r.judges_scored >= REQUIRED_JUDGES) complete.push(r);
    else pending.push(r);
  });
  complete.sort((a, b) => {
    if (b.total_score !== a.total_score) return b.total_score - a.total_score;
    return a.team_name.localeCompare(b.team_name);
  });
  pending.sort((a, b) => b.judges_scored - a.judges_scored);
  return { complete, pending };
}

function PodiumCard({ row, rank, LB }) {
  const isOne = rank === 1;
  const rankSize = {
    1: 'text-[160px] sm:text-[220px]',
    2: 'text-[110px] sm:text-[140px]',
    3: 'text-[110px] sm:text-[140px]',
  }[rank];
  return (
    <div
      className={`relative border-2 border-ink bg-paper shadow-brut p-6 sm:p-8 flex flex-col ${
        isOne ? 'lg:scale-110 lg:-translate-y-4 bg-paper' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="badge-mono bg-ink text-paper">
          {LB.rankLabel} · {String(rank).padStart(2, '0')}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink/60">
          {row.judges_scored}/{REQUIRED_JUDGES} {LB.judgesLabel}
        </span>
      </div>
      <div className={`font-display italic font-black leading-[0.78] mt-2 ${rankSize} ${isOne ? 'text-ieee' : 'text-ink'}`}>
        #{rank}
      </div>
      <div className="mt-4">
        <div className="font-display font-black text-2xl sm:text-3xl leading-tight">
          {row.team_name}
        </div>
        <div className="mt-1 text-ink/80">{row.project_title}</div>
      </div>
      <div className="mt-6 pt-4 border-t-2 border-ink/20 flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink/60">
          {LB.totalLabel}
        </span>
        <span className="font-mono font-bold text-3xl sm:text-4xl tabular-nums">
          {row.total_score}
        </span>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const { t, format } = useT();
  const LB = t.leaderboard;
  const { rows, loading, error, lastUpdated } = useLeaderboard(LB);
  const { complete, pending } = useMemo(() => partitionRows(rows), [rows]);

  const podium = complete.slice(0, 3);

  const updatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    : '—';

  return (
    <Layout status={t.status.live}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="eyebrow mb-3">{LB.eyebrow}</div>
            <h1 className="font-display font-black text-6xl sm:text-8xl leading-[0.85]">
              {LB.titleA}<br />
              <span className="italic text-ieee">{LB.titleB}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 border-2 border-ink bg-paper px-4 py-2 shadow-brut-sm">
            <span className="relative inline-flex h-3 w-3">
              <span className="absolute inset-0 rounded-full bg-ieee animate-pulse-dot" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-ieee" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em]">{LB.liveChip}</span>
            <span className="font-mono text-[11px] tabular-nums text-ink/60 hidden sm:inline">· {updatedLabel}</span>
          </div>
        </div>

        {error && (
          <div className="mt-8 border-2 border-petra bg-petra-soft p-4 font-mono text-sm">{error}</div>
        )}

        <section className="mt-12">
          {loading && rows.length === 0 ? (
            <div className="font-mono text-sm uppercase tracking-[0.22em] text-ink/60">
              {LB.loading}
            </div>
          ) : podium.length === 0 ? (
            <div className="border-2 border-dashed border-ink/40 p-10 text-center">
              <div className="font-display italic font-black text-3xl">{LB.waitingTitle}</div>
              <p className="mt-2 text-ink/60 text-sm">{LB.waitingSub}</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 items-end">
              {podium[1] ? <PodiumCard row={podium[1]} rank={2} LB={LB} /> : <div className="hidden lg:block" />}
              {podium[0] ? <PodiumCard row={podium[0]} rank={1} LB={LB} /> : null}
              {podium[2] ? <PodiumCard row={podium[2]} rank={3} LB={LB} /> : <div className="hidden lg:block" />}
            </div>
          )}
        </section>

        <section className="mt-16">
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
            <h2 className="font-display font-black text-3xl">{LB.fullRanking}</h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">
              {format(LB.pendingSub, { n: REQUIRED_JUDGES })}
            </span>
          </div>
          <div className="card-brut overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-ink text-paper">
                <tr className="font-mono uppercase tracking-[0.18em] text-[11px]">
                  <th className="p-3 w-16">{LB.cols.rank}</th>
                  <th className="p-3">{LB.cols.team}</th>
                  <th className="p-3 hidden sm:table-cell">{LB.cols.project}</th>
                  <th className="p-3 w-24 text-center">{LB.cols.judges}</th>
                  <th className="p-3 w-28 text-right">{LB.cols.total}</th>
                </tr>
              </thead>
              <tbody>
                {complete.length === 0 && pending.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-ink/60 font-mono text-sm">
                      {LB.noTeams}
                    </td>
                  </tr>
                )}
                {complete.map((row, i) => {
                  const rank = i + 1;
                  return (
                    <tr key={row.team_id} className={`border-t border-ink/15 ${i % 2 === 0 ? 'bg-paper' : 'bg-paper-dark'}`}>
                      <td className="p-3 font-mono font-bold tabular-nums text-lg">
                        {String(rank).padStart(2, '0')}
                      </td>
                      <td className="p-3">
                        <div className="font-display font-black text-xl">{row.team_name}</div>
                        <div className="sm:hidden text-ink/70 text-sm">{row.project_title}</div>
                      </td>
                      <td className="p-3 hidden sm:table-cell text-ink/80">{row.project_title}</td>
                      <td className="p-3 text-center">
                        <span className="badge-mono bg-moss text-white border-ink">
                          {row.judges_scored}/{REQUIRED_JUDGES}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold tabular-nums text-2xl">
                        {row.total_score}
                      </td>
                    </tr>
                  );
                })}
                {pending.map((row, i) => (
                  <tr
                    key={row.team_id}
                    className={`border-t border-ink/15 ${(complete.length + i) % 2 === 0 ? 'bg-paper' : 'bg-paper-dark'} text-ink/70`}
                  >
                    <td className="p-3 font-mono tabular-nums text-lg">—</td>
                    <td className="p-3">
                      <div className="font-display font-black text-xl">{row.team_name}</div>
                      <div className="sm:hidden text-ink/60 text-sm">{row.project_title}</div>
                    </td>
                    <td className="p-3 hidden sm:table-cell">{row.project_title}</td>
                    <td className="p-3 text-center">
                      <span className="badge-mono border-ieee text-ieee">
                        {row.judges_scored}/{REQUIRED_JUDGES}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono uppercase tracking-wider text-ieee">
                      {LB.pending}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
}
