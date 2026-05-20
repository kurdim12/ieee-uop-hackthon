import { useCallback, useEffect, useMemo, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { IconLogout } from '../components/Icons.jsx';
import { supabase } from '../lib/supabase.js';
import { getAdmin, clearAdmin } from '../lib/auth.js';
import { useT } from '../i18n/index.jsx';

const REQUIRED_JUDGES = 3;
const REFRESH_MS = 10000;

function downloadCSV(rows, A) {
  const headers = [
    A.cols.team, A.cols.project, A.expanded.members, A.cols.repo,
    A.expanded.contact, 'Phone', A.expanded.submitted,
    A.cols.judged, A.cols.total, A.cols.avg,
  ];
  const escape = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
  const csv = [headers.join(',')]
    .concat(
      rows.map((r) =>
        [
          r.team_name, r.project_title, r.members, r.github_url,
          r.contact_email, r.contact_phone || '', r.created_at,
          r.judges_scored, r.total_score, r.avg_score,
        ].map(escape).join(',')
      )
    )
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function Admin() {
  const { t } = useT();
  const A = t.admin;
  const navigate = useNavigate();
  const admin = getAdmin();
  const [teams, setTeams] = useState([]);
  const [judges, setJudges] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    try {
      const [tq, jq, sq] = await Promise.all([
        supabase.from('teams').select('*').order('created_at', { ascending: false }),
        supabase.from('judges').select('id, username, full_name'),
        supabase.from('scores').select('*'),
      ]);
      if (tq.error) throw tq.error;
      if (jq.error) throw jq.error;
      if (sq.error) throw sq.error;
      setTeams(tq.data || []);
      setJudges(jq.data || []);
      setScores(sq.data || []);
      setError('');
      setLastUpdated(new Date());
    } catch (err) {
      setError(err?.message || A.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [A.loadFailed]);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  const enriched = useMemo(() => {
    return teams.map((tm) => {
      const teamScores = scores.filter((s) => s.team_id === tm.id);
      const total = teamScores.reduce((a, b) => a + b.total, 0);
      const avg = teamScores.length ? total / teamScores.length : 0;
      return {
        ...tm,
        scores_by_judge: teamScores,
        judges_scored: teamScores.length,
        total_score: total,
        avg_score: Math.round(avg * 100) / 100,
      };
    });
  }, [teams, scores]);

  const sorted = useMemo(() => {
    return [...enriched].sort((a, b) => {
      if (b.judges_scored !== a.judges_scored) return b.judges_scored - a.judges_scored;
      return b.total_score - a.total_score;
    });
  }, [enriched]);

  const totalJudges = judges.length || REQUIRED_JUDGES;
  const stats = useMemo(() => {
    const fullyJudged = enriched.filter((tm) => tm.judges_scored >= totalJudges).length;
    return {
      teams: teams.length,
      judges: judges.length,
      fullyJudged,
      totalScoresSubmitted: scores.length,
    };
  }, [enriched, teams.length, judges.length, scores.length, totalJudges]);

  function logout() {
    clearAdmin();
    navigate('/admin/login', { replace: true });
  }


  const updatedLabel = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    : '—';

  return (
    <Layout status={`${t.status.adminPrefix} · ${admin.username.toUpperCase()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="eyebrow mb-3">{A.eyebrow}</div>
            <h1 className="font-display font-black text-5xl sm:text-7xl leading-[0.9]">
              {A.titleA}<br />
              <span className="italic text-ieee">{A.titleB}</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => downloadCSV(enriched, A)} className="btn-ghost" disabled={enriched.length === 0}>
              {A.exportBtn}
            </button>
            <button onClick={logout} className="btn-ghost">
              <IconLogout width="20" height="20" /> {A.logoutBtn}
            </button>
          </div>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label={A.stats.submissions} value={stats.teams} />
          <Stat label={A.stats.judgesActive} value={stats.judges} />
          <Stat label={A.stats.fullyJudged} value={`${stats.fullyJudged}/${stats.teams}`} accent />
          <Stat label={A.stats.scoresSubmitted} value={stats.totalScoresSubmitted} />
        </div>

        <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
          {A.lastRefresh} · {updatedLabel}
        </div>

        {error && (
          <div className="mt-6 border-2 border-petra bg-petra-soft p-4 font-mono text-sm">{error}</div>
        )}

        <div className="mt-10">
          <h2 className="font-display font-black text-3xl mb-4">{A.submissionsTitle}</h2>
          {loading && teams.length === 0 ? (
            <div className="font-mono text-sm uppercase tracking-[0.22em] text-ink/60">{A.loading}</div>
          ) : sorted.length === 0 ? (
            <div className="border-2 border-dashed border-ink/40 p-10 text-center">
              <div className="font-display italic font-black text-3xl">{A.noSubmissions}</div>
            </div>
          ) : (
            <div className="card-brut overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-ink text-paper">
                  <tr className="font-mono uppercase tracking-[0.18em] text-[11px]">
                    <th className="p-3 w-10"></th>
                    <th className="p-3">{A.cols.team}</th>
                    <th className="p-3 hidden md:table-cell">{A.cols.project}</th>
                    <th className="p-3 hidden lg:table-cell w-32">{A.cols.repo}</th>
                    <th className="p-3 w-24 text-center">{A.cols.judged}</th>
                    <th className="p-3 w-24 text-right">{A.cols.total}</th>
                    <th className="p-3 w-24 text-right">{A.cols.avg}</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, i) => {
                    const isOpen = expanded === row.id;
                    return (
                      <Fragment key={row.id}>
                        <tr
                          className={`border-t border-ink/15 cursor-pointer hover:bg-ieee-soft ${
                            i % 2 === 0 ? 'bg-paper' : 'bg-paper-dark'
                          }`}
                          onClick={() => setExpanded(isOpen ? null : row.id)}
                        >
                          <td className="p-3 text-center font-mono text-ink/40">{isOpen ? '−' : '+'}</td>
                          <td className="p-3">
                            <div className="font-display font-black text-xl">{row.team_name}</div>
                            <div className="md:hidden text-ink/70 text-sm">{row.project_title}</div>
                          </td>
                          <td className="p-3 hidden md:table-cell text-ink/80">{row.project_title}</td>
                          <td className="p-3 hidden lg:table-cell">
                            <a
                              href={row.github_url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="font-mono text-xs underline hover:text-ieee break-all"
                            >
                              {A.repoLink}
                            </a>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`badge-mono ${row.judges_scored >= totalJudges ? 'bg-moss text-white border-ink' : 'border-ieee text-ieee'}`}>
                              {row.judges_scored}/{totalJudges}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold tabular-nums text-xl">{row.total_score}</td>
                          <td className="p-3 text-right font-mono tabular-nums text-ink/70">
                            {row.judges_scored ? row.avg_score : '—'}
                          </td>
                        </tr>
                        {isOpen && (
                          <tr className="bg-paper-dark border-t border-ink/15">
                            <td colSpan={7} className="p-0">
                              <div className="p-6 border-l-4 border-ieee">
                                <div className="grid lg:grid-cols-3 gap-6">
                                  <div className="border-2 border-ink p-4 bg-paper">
                                    <div className="eyebrow">{A.expanded.members}</div>
                                    <p className="mt-2 text-sm">{row.members}</p>
                                  </div>
                                  <div className="border-2 border-ink p-4 bg-paper">
                                    <div className="eyebrow">{A.expanded.contact}</div>
                                    <p className="mt-2 text-sm break-all">{row.contact_email}</p>
                                    {row.contact_phone && (
                                      <p className="text-sm font-mono mt-1">{row.contact_phone}</p>
                                    )}
                                  </div>
                                  <div className="border-2 border-ink p-4 bg-paper">
                                    <div className="eyebrow">{A.expanded.submitted}</div>
                                    <p className="mt-2 font-mono text-sm">
                                      {new Date(row.created_at).toLocaleString()}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-4 border-2 border-ink p-4 bg-paper">
                                  <div className="eyebrow">{A.expanded.theIdea}</div>
                                  <p className="mt-2 whitespace-pre-line">{row.project_desc}</p>
                                </div>

                                <div className="mt-4 border-2 border-ink p-4 bg-paper">
                                  <div className="eyebrow mb-3">{A.expanded.judgeBreakdown}</div>
                                  {judges.length === 0 ? (
                                    <p className="text-sm text-ink/60">{A.noJudges}</p>
                                  ) : (
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-left text-sm">
                                        <thead>
                                          <tr className="font-mono uppercase tracking-wider text-[10px] text-ink/60">
                                            <th className="py-1 pr-3">{A.expanded.cols.judge}</th>
                                            <th className="py-1 pr-3 text-right">{A.expanded.cols.innov}</th>
                                            <th className="py-1 pr-3 text-right">{A.expanded.cols.exec}</th>
                                            <th className="py-1 pr-3 text-right">{A.expanded.cols.pres}</th>
                                            <th className="py-1 pr-3 text-right">{A.expanded.cols.impact}</th>
                                            <th className="py-1 pr-3 text-right">{A.expanded.cols.total}</th>
                                            <th className="py-1 pl-3">{A.expanded.cols.notes}</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {judges.map((j) => {
                                            const sc = row.scores_by_judge.find((x) => x.judge_id === j.id);
                                            if (!sc) {
                                              return (
                                                <tr key={j.id} className="border-t border-ink/10">
                                                  <td className="py-2 pr-3 font-mono text-xs">{j.username}</td>
                                                  <td colSpan={6} className="py-2 text-ink/40 italic">
                                                    {A.expanded.notScoredYet}
                                                  </td>
                                                </tr>
                                              );
                                            }
                                            return (
                                              <tr key={j.id} className="border-t border-ink/10">
                                                <td className="py-2 pr-3 font-mono text-xs">{j.username}</td>
                                                <td className="py-2 pr-3 text-right font-mono tabular-nums">{sc.innovation}</td>
                                                <td className="py-2 pr-3 text-right font-mono tabular-nums">{sc.execution}</td>
                                                <td className="py-2 pr-3 text-right font-mono tabular-nums">{sc.presentation}</td>
                                                <td className="py-2 pr-3 text-right font-mono tabular-nums">{sc.impact}</td>
                                                <td className="py-2 pr-3 text-right font-mono font-bold tabular-nums">{sc.total}</td>
                                                <td className="py-2 pl-3 text-ink/70 text-xs italic max-w-md">
                                                  {sc.notes || '—'}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>

                                <a
                                  href={row.github_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-4 inline-flex items-center font-mono text-xs uppercase tracking-[0.2em] underline hover:text-ieee"
                                >
                                  {A.expanded.openRepo}
                                </a>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className={`card-brut p-5 ${accent ? 'bg-ink text-paper shadow-brut-ieee' : ''}`}>
      <div className={`font-mono text-[11px] uppercase tracking-[0.22em] ${accent ? 'text-paper/70' : 'text-ink/70'}`}>
        {label}
      </div>
      <div className={`font-display italic font-black text-5xl mt-1 leading-none tabular-nums ${accent ? 'text-ieee' : 'text-ink'}`}>
        {value}
      </div>
    </div>
  );
}
