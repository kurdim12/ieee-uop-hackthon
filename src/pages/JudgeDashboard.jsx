import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { IconLogout, IconArrow } from '../components/Icons.jsx';
import { supabase } from '../lib/supabase.js';
import { getJudge, clearJudge } from '../lib/auth.js';
import { useT } from '../i18n/index.jsx';

export default function JudgeDashboard() {
  const { t } = useT();
  const J = t.judge;
  const navigate = useNavigate();
  const judge = getJudge();
  const [teams, setTeams] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [{ data: tData, error: tErr }, { data: sData, error: sErr }] = await Promise.all([
          supabase
            .from('teams')
            .select('id, team_name, project_title, members, github_url')
            .order('created_at', { ascending: true }),
          supabase
            .from('scores')
            .select('team_id, total')
            .eq('judge_id', judge.id),
        ]);
        if (tErr) throw tErr;
        if (sErr) throw sErr;
        if (cancelled) return;
        setTeams(tData || []);
        const map = {};
        (sData || []).forEach((s) => { map[s.team_id] = s.total; });
        setScores(map);
      } catch (err) {
        if (!cancelled) setError(err?.message || J.loadFailed);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [judge.id, J.loadFailed]);

  const sorted = useMemo(() => {
    return [...teams].sort((a, b) => {
      const ha = scores[a.id] != null ? 1 : 0;
      const hb = scores[b.id] != null ? 1 : 0;
      if (ha !== hb) return ha - hb;
      return a.team_name.localeCompare(b.team_name);
    });
  }, [teams, scores]);

  const scoredCount = useMemo(
    () => teams.filter((tm) => scores[tm.id] != null).length,
    [teams, scores]
  );

  async function deleteTeam(team) {
    const tmpl = J.deleteConfirm || 'Delete "{team}"? This removes the team and all its scores. The team can resubmit.';
    if (!window.confirm(tmpl.replace('{team}', team.team_name))) return;
    try {
      const { error: delErr } = await supabase.from('teams').delete().eq('id', team.id);
      if (delErr) throw delErr;
      setTeams((prev) => prev.filter((tm) => tm.id !== team.id));
      setScores((prev) => {
        const next = { ...prev };
        delete next[team.id];
        return next;
      });
    } catch (err) {
      setError(err?.message || J.deleteFailed || 'Could not delete team.');
    }
  }

  function logout() {
    clearJudge();
    navigate('/login', { replace: true });
  }

  const rubricItems = t.landing.criteria.items;

  return (
    <Layout status={`${t.status.signedInPrefix} · ${judge.username.toUpperCase()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="eyebrow mb-3">{J.eyebrow}</div>
            <h1 className="font-display font-extrabold text-5xl sm:text-7xl leading-[0.9]">
              {J.welcome}<br />
              <span className="italic text-ieee">{judge.full_name}.</span>
            </h1>
          </div>
          <button onClick={logout} className="btn-ghost">
            <IconLogout width="20" height="20" /> {J.logoutBtn}
          </button>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          <div className="card-brut p-6">
            <div className="eyebrow">{J.progress}</div>
            <div className="font-display font-extrabold text-6xl mt-1 leading-none">
              {scoredCount}<span className="text-slate-400">/{teams.length || 0}</span>
            </div>
            <div className="font-mono text-[12px] uppercase tracking-wider mt-2 text-slate-500">
              {J.teamsScored}
            </div>
          </div>
          <div className="card-brut p-6">
            <div className="eyebrow">{J.remaining}</div>
            <div className="font-display font-extrabold text-6xl mt-1 leading-none">
              {Math.max(0, (teams.length || 0) - scoredCount)}
            </div>
            <div className="font-mono text-[12px] uppercase tracking-wider mt-2 text-slate-500">
              {J.teamsToScore}
            </div>
          </div>
          <div className="card-brut p-6 bg-slate-900 text-white shadow-card">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/80">
              {J.criteria}
            </div>
            <div className="font-display font-extrabold text-6xl mt-1 leading-none text-ieee">
              4
            </div>
            <div className="font-mono text-[12px] uppercase tracking-wider mt-2 text-white/80">
              {J.criteriaSub}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
            <h2 className="font-display font-extrabold text-3xl">
              {J.rubricTitleA} <span className="italic text-ieee">{J.rubricTitleB}</span>
            </h2>
            <span className="font-mono text-[12px] uppercase tracking-wider text-slate-500">
              {J.rubricSub}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rubricItems.map((c) => (
              <div key={c.n} className="card-brut bg-white p-5">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {c.n}
                  </span>
                  <span className="font-display font-extrabold text-3xl text-ieee tabular-nums leading-none">
                    {J.pts}
                    <span className="text-slate-400 text-sm"> {J.ptsUnit}</span>
                  </span>
                </div>
                <h3 className="mt-2 font-display font-extrabold text-lg leading-tight">
                  {c.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-snug">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="font-display font-extrabold text-3xl">{J.teamsTitle}</h2>
          <span className="font-mono text-[12px] uppercase tracking-wider text-slate-500">
            {J.teamsHint}
          </span>
        </div>

        {error && (
          <div className="mt-6 border border-red-200 bg-red-50 p-4 font-mono text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 font-mono text-sm uppercase tracking-[0.22em] text-slate-500">
            {J.loadingTeams}
          </div>
        ) : sorted.length === 0 ? (
          <div className="mt-10 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center">
            <div className="font-display font-extrabold text-3xl">{J.noTeams}</div>
            <p className="mt-2 text-slate-500 text-sm">{J.noTeamsSub}</p>
          </div>
        ) : (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((team, i) => {
              const total = scores[team.id];
              const scored = total != null;
              return (
                <Link
                  key={team.id}
                  to={`/judge/${team.id}`}
                  className="relative card-brut p-6 bg-white transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[8px_8px_0_0_#0a1a2f]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-[11px] tabular-nums tracking-wider text-slate-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {scored ? (
                      <span className="badge-mono bg-slate-900 text-white">
                        {J.statusScored} · {total}/100
                      </span>
                    ) : (
                      <span className="badge-mono border-ieee text-ieee">
                        {J.statusNotScored}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-extrabold text-2xl mt-3 leading-tight">
                    {team.team_name}
                  </h3>
                  <p className="mt-1 text-slate-600 line-clamp-2">{team.project_title}</p>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="eyebrow mb-1">{J.membersLabel}</div>
                    <p className="text-sm text-slate-500 line-clamp-2">{team.members}</p>
                  </div>
                  {team.github_url && (
                    <a
                      href={team.github_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 inline-flex items-center font-mono text-[11px] uppercase tracking-[0.18em] underline text-slate-500 hover:text-ieee break-all"
                    >
                      {J.openRepo}
                    </a>
                  )}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteTeam(team); }}
                      className="inline-flex items-center font-mono font-bold text-[10px] uppercase tracking-[0.18em] border border-red-200 text-petra px-2 py-1 hover:bg-petra hover:text-white transition-colors"
                    >
                      {J.deleteBtn || 'DELETE'}
                    </button>
                    <span className="inline-flex items-center font-mono text-[12px] uppercase tracking-[0.18em] text-ieee">
                      {scored ? J.adjustScore : J.scoreNow} <IconArrow width="14" height="14" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
