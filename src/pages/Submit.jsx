import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { IconArrow, IconCheck } from '../components/Icons.jsx';
import { supabase } from '../lib/supabase.js';
import { useT } from '../i18n/index.jsx';

// Hard cutoff for team submissions — 14:00 Asia/Amman (UTC+3).
// Edit the date string here when scheduling future events.
const SUBMISSION_DEADLINE = new Date('2026-05-21T14:00:00+03:00');

function pad(n) { return String(n).padStart(2, '0'); }

function formatRemaining(ms) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/[^\s]+\.[^\s]+/i;

function buildValidator(v, format) {
  return function validate(values) {
    const errors = {};
    if (!values.team_name.trim()) errors.team_name = v.teamNameRequired;
    if (!values.members.trim()) {
      errors.members = v.membersRequired;
    } else {
      const list = values.members.split(',').map((s) => s.trim()).filter(Boolean);
      if (list.length === 0) errors.members = v.membersRequired;
    }
    if (!values.project_title.trim()) errors.project_title = v.projectTitleRequired;
    const descLen = values.project_desc.trim().length;
    if (descLen < 50) errors.project_desc = format(v.ideaMin, { n: descLen });
    else if (descLen > 500) errors.project_desc = format(v.ideaMax, { n: descLen });
    const url = values.github_url.trim();
    if (!url) errors.github_url = v.githubRequired;
    else if (!URL_RE.test(url)) errors.github_url = v.githubInvalid;
    else if (!/github\.com/i.test(url)) errors.github_url = v.githubNotGithub;
    if (!values.contact_email.trim()) errors.contact_email = v.emailRequired;
    else if (!EMAIL_RE.test(values.contact_email.trim())) errors.contact_email = v.emailInvalid;
    return errors;
  };
}

const INITIAL = {
  team_name: '',
  members: '',
  project_title: '',
  project_desc: '',
  github_url: '',
  contact_email: '',
  contact_phone: '',
};

export default function Submit() {
  const { t, format, lang } = useT();
  const S = t.submit;
  const validate = useMemo(() => buildValidator(S.validation, format), [S, format]);

  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState(null);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const remainingMs = SUBMISSION_DEADLINE.getTime() - now.getTime();
  const isClosed = remainingMs <= 0;

  const closedAt = SUBMISSION_DEADLINE.toLocaleTimeString(lang === 'ar' ? 'ar-JO' : 'en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Amman', hour12: false,
  });
  const closedDate = SUBMISSION_DEADLINE.toLocaleDateString(lang === 'ar' ? 'ar-JO' : 'en-GB', {
    day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Amman',
  });

  const liveErrors = useMemo(() => validate(values), [validate, values]);
  const descCount = values.project_desc.trim().length;

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  const blur = (field) => () => setTouched((tt) => ({ ...tt, [field]: true }));
  const showError = (field) => (touched[field] || errors[field]) && liveErrors[field];

  async function onSubmit(e) {
    e.preventDefault();
    if (isClosed) {
      setSubmitError(S.closed?.body ?? 'Submissions are closed.');
      return;
    }
    const v = validate(values);
    setErrors(v);
    setTouched({
      team_name: true, members: true, project_title: true,
      project_desc: true, github_url: true, contact_email: true,
    });
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        team_name: values.team_name.trim(),
        members: values.members.split(',').map((s) => s.trim()).filter(Boolean).join(', '),
        project_title: values.project_title.trim(),
        project_desc: values.project_desc.trim(),
        github_url: values.github_url.trim(),
        contact_email: values.contact_email.trim(),
        contact_phone: values.contact_phone.trim() || null,
      };
      const { data, error } = await supabase
        .from('teams')
        .insert(payload)
        .select('id, team_name, project_title, github_url')
        .single();
      if (error) throw error;
      setResult(data);
    } catch (err) {
      setSubmitError(err?.message || S.validation.generic);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const SS = S.success;
    return (
      <Layout status={t.status.submitted}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-20">
          <div className="card-brut bg-white p-10">
            <div className="eyebrow mb-4">{SS.eyebrow}</div>
            <div className="flex items-start gap-4">
              <IconCheck className="text-moss shrink-0 mt-2" width="56" height="56" strokeWidth="3" />
              <h1 className="font-display font-extrabold text-6xl sm:text-8xl text-ieee leading-[0.9]">
                {SS.heading}
              </h1>
            </div>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="eyebrow">{SS.team}</div>
                <div className="font-display font-extrabold text-2xl mt-1">{result.team_name}</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="eyebrow">{SS.project}</div>
                <div className="font-display font-extrabold text-2xl mt-1">{result.project_title}</div>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 p-4">
              <div className="eyebrow">{SS.repository}</div>
              <a href={result.github_url} target="_blank" rel="noreferrer"
                 className="font-mono text-sm mt-1 break-all underline hover:text-ieee">
                {result.github_url}
              </a>
            </div>
            <div className="mt-4 border-2 border-dashed border-slate-200/50 p-4">
              <div className="eyebrow">{SS.submissionId}</div>
              <div className="font-mono text-xs sm:text-sm mt-1 break-all">{result.id}</div>
            </div>
            <p className="mt-6 text-slate-500">{SS.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/" className="btn-primary">
                {SS.backHome} <IconArrow width="20" height="20" />
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isClosed) {
    const C = S.closed ?? {};
    return (
      <Layout status={C.statusTag ?? 'CLOSED'}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-20">
          <div className="card-brut bg-white p-10 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-petra-50 text-petra mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </div>
            <div className="eyebrow">{C.eyebrow ?? 'SUBMISSIONS LOCKED'}</div>
            <h1 className="mt-3 font-display font-extrabold text-5xl sm:text-6xl text-slate-900 leading-tight tracking-tight">
              {C.title ?? 'Submissions are closed'}
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              {(C.body ?? 'The submission window closed at {time} on {date} (Jordan time).')
                .replace('{time}', closedAt).replace('{date}', closedDate)}
            </p>
            <div className="mt-10">
              <Link to="/" className="btn-ghost">← {C.backHome ?? 'Back to home'}</Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout status={t.status.submission}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
        {/* Live countdown until the 14:00 Jordan-time cutoff */}
        <div className="mb-8 rounded-2xl border border-ieee-100 bg-ieee-50/60 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ieee-700">
              {S.countdown?.label ?? 'Submissions close at'} {closedAt} {S.countdown?.tz ?? '(Jordan time)'}
            </div>
            <div className="text-sm text-slate-600 mt-0.5">
              {S.countdown?.sub ?? 'Submit before the timer runs out.'}
            </div>
          </div>
          <div className="font-mono font-bold tabular-nums text-2xl text-ieee" dir="ltr">
            {formatRemaining(remainingMs)}
          </div>
        </div>

        <div className="eyebrow mb-4">{S.eyebrow}</div>
        <h1 className="font-display font-extrabold text-6xl sm:text-7xl leading-[0.9]">
          {S.titleA}{S.titleB ? <><br />{S.titleB}</> : null}{' '}
          <span className="italic text-ieee">{S.titleC}</span>
        </h1>
        <p className="mt-5 text-lg text-slate-500 max-w-xl">{S.subhead}</p>

        <form onSubmit={onSubmit} className="mt-12 space-y-10" noValidate>
          <Field label={S.fields.teamName} error={showError('team_name') && liveErrors.team_name}>
            <input id="team_name" type="text" className="input-line" placeholder={S.fields.teamNamePh}
                   value={values.team_name} onChange={update('team_name')} onBlur={blur('team_name')}
                   disabled={submitting} required />
          </Field>

          <Field label={S.fields.members} error={showError('members') && liveErrors.members}>
            <textarea id="members" rows={2} className="input-line resize-none"
                      placeholder={S.fields.membersPh}
                      value={values.members} onChange={update('members')} onBlur={blur('members')}
                      disabled={submitting} required />
          </Field>

          <Field label={S.fields.projectTitle} error={showError('project_title') && liveErrors.project_title}>
            <input id="project_title" type="text" className="input-line" placeholder={S.fields.projectTitlePh}
                   value={values.project_title} onChange={update('project_title')} onBlur={blur('project_title')}
                   disabled={submitting} required />
          </Field>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="project_desc" className="field-label">{S.fields.ideaLabel}</label>
              <span className={`font-mono text-[11px] tabular-nums ${descCount > 500 || descCount < 50 ? 'text-petra' : 'text-slate-500'}`}>
                {descCount} / 500
              </span>
            </div>
            <textarea id="project_desc" rows={5} className="input-line resize-none"
                      placeholder={S.fields.ideaPh}
                      value={values.project_desc} onChange={update('project_desc')} onBlur={blur('project_desc')}
                      disabled={submitting} required maxLength={600} />
            {showError('project_desc') && <p className="field-error">{liveErrors.project_desc}</p>}
          </div>

          <Field label={S.fields.github} error={showError('github_url') && liveErrors.github_url}>
            <input id="github_url" type="url" className="input-line" placeholder={S.fields.githubPh}
                   value={values.github_url} onChange={update('github_url')} onBlur={blur('github_url')}
                   disabled={submitting} required dir="ltr" />
          </Field>

          <div className="grid md:grid-cols-2 gap-8">
            <Field label={S.fields.email} error={showError('contact_email') && liveErrors.contact_email}>
              <input id="contact_email" type="email" className="input-line" placeholder={S.fields.emailPh}
                     value={values.contact_email} onChange={update('contact_email')} onBlur={blur('contact_email')}
                     disabled={submitting} required dir="ltr" />
            </Field>
            <Field label={S.fields.phone}>
              <input id="contact_phone" type="tel" className="input-line" placeholder={S.fields.phonePh}
                     value={values.contact_phone} onChange={update('contact_phone')}
                     disabled={submitting} dir="ltr" />
            </Field>
          </div>

          {submitError && (
            <div className="border border-red-200 bg-red-50 p-4 font-mono text-sm">{submitError}</div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t-2 border-slate-200">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent animate-spin" />
                  {S.submittingBtn}
                </>
              ) : (
                <>
                  {S.submitBtn} <IconArrow width="20" height="20" />
                </>
              )}
            </button>
            <Link to="/" className="font-mono text-[12px] uppercase tracking-[0.2em] underline">
              {S.backLink}
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
