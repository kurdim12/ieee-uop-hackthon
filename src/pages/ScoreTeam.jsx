import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { IconBack, IconCheck } from '../components/Icons.jsx';
import Toast from '../components/Toast.jsx';
import { supabase } from '../lib/supabase.js';
import { getJudge } from '../lib/auth.js';
import { useT } from '../i18n/index.jsx';

const KEYS = ['innovation', 'execution', 'presentation', 'impact'];
const DEFAULTS = { innovation: 12, execution: 12, presentation: 12, impact: 12 };

function clamp(v) {
  const n = Number.isFinite(v) ? Math.round(v) : 0;
  return Math.max(0, Math.min(25, n));
}

export default function ScoreTeam() {
  const { t } = useT();
  const SC = t.score;
  const criteriaTitles = t.landing.criteria.items;
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
            .select('id, team_name, project_title, project_desc, members, github_url, contact_email')
            .eq('id', teamId)
            .maybeSingle(),
          supabase
            .from('scores')
            .select('id, innovation, execution, presentation, impact, notes')
            .eq('team_id', teamId)
            .eq('judge_id', judge.id)
            .maybeSingle(),
        ]);
        if (tErr) throw tErr;
        if (sErr) throw sErr;
        if (cancelled) return;
        if (!tData) {
          setError(SC.teamNotFound);
          setTeam(null);
        } else {
          setTeam(tData);
        }
        if (sData) {
          setExistingId(sData.id);
          setValues({
            innovation: sData.innovation,
            execution: sData.execution,
            presentation: sData.presentation,
            impact: sData.impact,
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
    () => values.innovation + values.execution + values.presentation + values.impact,
    [values]
  );

  function setField(key, raw) {
    setValues((v) => ({ ...v, [key]: clamp(raw) }));
  }

  async function onSave() {
    setSaving(true);
    setError('');
    try {
      const payload = {
        team_id: teamId,
        judge_id: judge.id,
        innovation: values.innovation,
        execution: values.execution,
        presentation: values.presentation,
        impact: values.impact,
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
          {team.github_url && (
            <a
              href={team.github_url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center font-mono text-[12px] uppercase tracking-[0.18em] underline hover:text-ieee break-all"
            >
              {SC.openRepository} {team.github_url}
            </a>
          )}
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
        </div>

        <div className="mt-10 space-y-6">
          {KEYS.map((key, i) => {
            const c = criteriaTitles[i];
            return (
              <div key={key} className="card-brut bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      {c.n} {SC.pts25}
                    </div>
                    <h3 className="font-display font-extrabold text-2xl mt-1">{c.title}</h3>
                    <p className="mt-1 text-slate-500 max-w-xl">{c.desc}</p>
                  </div>
                  <div className="text-right">
                    <div className="eyebrow">{SC.current}</div>
                    <div className="font-display font-extrabold text-7xl leading-none text-ieee tabular-nums">
                      {values[key]}
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-4">
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    className="brut-slider flex-1"
                    value={values[key]}
                    onChange={(e) => setField(key, parseInt(e.target.value, 10))}
                    aria-label={`${c.title} score`}
                  />
                  <input
                    type="number"
                    min={0}
                    max={25}
                    step={1}
                    className="w-20 rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-center text-lg tabular-nums focus:outline-none focus:bg-ieee-50"
                    value={values[key]}
                    onChange={(e) => setField(key, parseInt(e.target.value || '0', 10))}
                  />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  <span>{SC.sliderLow}</span>
                  <span>{SC.sliderMid}</span>
                  <span>{SC.sliderHigh}</span>
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
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-sm focus:outline-none focus:bg-ieee-50"
              placeholder={SC.notesPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <div className="border border-red-200 bg-red-50 p-4 font-mono text-sm">{error}</div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">
              {SC.total}
            </span>
            <span className="font-display font-extrabold text-5xl sm:text-6xl tabular-nums leading-none">
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
