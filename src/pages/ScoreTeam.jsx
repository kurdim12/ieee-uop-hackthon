import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { IconBack, IconCheck } from '../components/Icons.jsx';
import Toast from '../components/Toast.jsx';
import { supabase } from '../lib/supabase.js';
import { getJudge } from '../lib/auth.js';
import { useT } from '../i18n/index.jsx';
import { findHardcodedTeam } from '../data/teams.js';

// Six criteria, each with its own max score. Total maxes at 100.
const CRITERIA = [
  { key: 'problem_understanding', max: 25, n: '01' },
  { key: 'role_completeness',     max: 20, n: '02' },
  { key: 'fullstack_execution',   max: 20, n: '03' },
  { key: 'uxui_design',           max: 15, n: '04' },
  { key: 'pitch_storytelling',    max: 10, n: '05' },
  { key: 'creativity',            max: 10, n: '06' },
];

const KEYS = CRITERIA.map((c) => c.key);
const DEFAULTS = CRITERIA.reduce(
  (acc, c) => ({ ...acc, [c.key]: Math.round(c.max / 2) }),
  {}
);

function clamp(v, max) {
  const n = Number.isFinite(v) ? Math.round(v) : 0;
  return Math.max(0, Math.min(max, n));
}

export default function ScoreTeam() {
  const { t } = useT();
  const SC = t.score;
  const criteriaTitles = t.criteria?.items ?? [];
  const { teamId } = useParams();
  const navigate = useNavigate();
  const judge = getJudge();

  const [team, setTeam] = useState(null);
  const [values, setValues] = useState(DEFAULTS);
  const [notes, setNotes] = useState('');
  const [existingId, setExistingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [{ data: tData, error: tErr }, { data: sData, error: sErr }] = await Promise.all([
          supabase
            .from('teams')
            .select('id, team_name, project_title, project_desc, members, github_url, deck_url, contact_email')
            .eq('id', teamId)
            .maybeSingle(),
          supabase
            .from('scores')
            .select('id, problem_understanding, role_completeness, fullstack_execution, uxui_design, pitch_storytelling, creativity, notes')
            .eq('team_id', teamId)
            .eq('judge_id', judge.id)
            .maybeSingle(),
        ]);
        if (tErr) throw tErr;
        if (sErr) throw sErr;
        if (cancelled) return;
        if (!tData) {
          // Fall back to the hardcoded hackathon roster so judges can
          // open + score even if the DB row is missing.
          const hardcoded = findHardcodedTeam(teamId);
          if (hardcoded) {
            setTeam(hardcoded);
          } else {
            setError(SC.teamNotFound);
            setTeam(null);
          }
        } else {
          setTeam(tData);
        }
        if (sData) {
          setExistingId(sData.id);
          setValues({
            problem_understanding: sData.problem_understanding,
            role_completeness:     sData.role_completeness,
            fullstack_execution:   sData.fullstack_execution,
            uxui_design:           sData.uxui_design,
            pitch_storytelling:    sData.pitch_storytelling,
            creativity:            sData.creativity,
          });
          setNotes(sData.notes || '');
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || SC.loadFailed);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [teamId, judge.id, SC.teamNotFound, SC.loadFailed]);

  const total = useMemo(
    () => KEYS.reduce((sum, k) => sum + (values[k] || 0), 0),
    [values]
  );

  function setField(key, max, raw) {
    setValues((v) => ({ ...v, [key]: clamp(raw, max) }));
  }

  async function onSave() {
    setSaving(true);
    setError('');
    try {
      const payload = {
        team_id: teamId,
        judge_id: judge.id,
        problem_understanding: values.problem_understanding,
        role_completeness:     values.role_completeness,
        fullstack_execution:   values.fullstack_execution,
        uxui_design:           values.uxui_design,
        pitch_storytelling:    values.pitch_storytelling,
        creativity:            values.creativity,
        notes: notes.trim() || null,
        updated_at: new Date().toISOString(),
      };
      const { data, error: upErr } = await supabase
        .from('scores')
        .upsert(payload, { onConflict: 'team_id,judge_id' })
        .select('id')
        .single();
      if (upErr) throw upErr;
      setExistingId(data.id);
      setToast(SC.savedToast);
    } catch (err) {
      setError(err?.message || SC.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Layout status={t.status.scoring}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-20 font-mono text-sm uppercase tracking-[0.22em] text-slate-500">
          {SC.loadingTeam}
        </div>
      </Layout>
    );
  }

  if (!team) {
    return (
      <Layout status={t.status.scoring}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-20">
          <h1 className="font-display font-extrabold text-5xl">{SC.teamNotFound}</h1>
          <button onClick={() => navigate('/judge')} className="btn-ghost mt-6">
            <IconBack width="20" height="20" /> {SC.backToTeamsBtn}
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout status={`${t.status.judgingPrefix} · ${judge.username.toUpperCase()}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 pb-32">
        <Link
          to="/judge"
          className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.2em] hover:text-ieee"
        >
          <IconBack width="16" height="16" /> {SC.backLink}
        </Link>

        <div className="mt-8 card-brut bg-white p-8">
          <div className="eyebrow mb-2">{SC.subject}</div>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl leading-[0.95]">
            {team.team_name}
          </h1>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl text-ieee">
            {team.project_title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            {team.github_url && (
              <a
                href={team.github_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center font-mono text-[12px] uppercase tracking-[0.18em] underline hover:text-ieee break-all"
              >
                {SC.openRepository}
              </a>
            )}
            {team.deck_url && (
              <a
                href={team.deck_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.18em] underline text-petra hover:text-petra-700 break-all"
              >
                {SC.openDeck ?? 'open pitch deck ↗'}
              </a>
            )}
          </div>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 rounded-xl border border-slate-200 p-4">
              <div className="eyebrow">{SC.theIdea}</div>
              <p className="mt-2 text-slate-700 leading-relaxed whitespace-pre-line">
                {team.project_desc}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="eyebrow">{SC.members}</div>
              <p className="mt-2 text-slate-700">{team.members}</p>
            </div>
          </div>

          <div className="mt-4">
            <Link
              to="/judge/brief"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.18em] text-ieee hover:text-ieee-700"
            >
              {SC.openBrief || 'open judge brief ↗'}
            </Link>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {CRITERIA.map(({ key, max, n }) => {
            const c = criteriaTitles[Number(n) - 1] ?? {};
            return (
              <div key={key} className="card-brut bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      {n} · {max} pts
                    </div>
                    <h3 className="font-display font-extrabold text-2xl mt-1">{c.title}</h3>
                    {c.desc && <p className="mt-1 text-slate-500 max-w-xl">{c.desc}</p>}
                  </div>
                  <div className="text-right">
                    <div className="eyebrow">{SC.current}</div>
                    <div className="font-display font-extrabold text-7xl leading-none text-ieee tabular-nums">
                      {values[key]}
                      <span className="text-slate-300 text-3xl"> / {max}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-4">
                  <input
                    type="range"
                    min={0}
                    max={max}
                    step={1}
                    className="brut-slider flex-1"
                    value={values[key]}
                    onChange={(e) => setField(key, max, parseInt(e.target.value, 10))}
                    aria-label={c.title || key}
                  />
                  <input
                    type="number"
                    min={0}
                    max={max}
                    step={1}
                    className="w-20 rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-center text-lg tabular-nums focus:outline-none focus:border-ieee focus:ring-4 focus:ring-ieee/15"
                    value={values[key]}
                    onChange={(e) => setField(key, max, parseInt(e.target.value || '0', 10))}
                  />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  <span>0</span>
                  <span>{Math.round(max / 2)}</span>
                  <span>{max}</span>
                </div>
              </div>
            );
          })}

          <div className="card-brut bg-white p-6">
            <div className="eyebrow">{SC.privateNotes}</div>
            <label className="sr-only" htmlFor="notes">{SC.privateNotes}</label>
            <textarea
              id="notes"
              rows={4}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 font-sans text-sm focus:outline-none focus:border-ieee focus:ring-4 focus:ring-ieee/15"
              placeholder={SC.notesPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {SC.total}
            </span>
            <span className="font-display font-extrabold text-5xl sm:text-6xl tabular-nums leading-none text-slate-900">
              {total}
              <span className="text-slate-400 text-3xl"> / 100</span>
            </span>
          </div>
          <button onClick={onSave} className="btn-primary" disabled={saving}>
            {saving ? (
              <>
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent animate-spin" />
                {SC.savingBtn}
              </>
            ) : existingId ? (
              <>
                <IconCheck width="20" height="20" /> {SC.updateScoreBtn}
              </>
            ) : (
              <>
                <IconCheck width="20" height="20" /> {SC.saveScoreBtn}
              </>
            )}
          </button>
        </div>
      </div>

      <Toast message={toast} onDone={() => setToast('')} />
    </Layout>
  );
}
