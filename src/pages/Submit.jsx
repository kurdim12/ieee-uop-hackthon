import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { IconArrow, IconCheck } from '../components/Icons.jsx';
import { supabase } from '../lib/supabase.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/[^\s]+\.[^\s]+/i;

function validate(values) {
  const errors = {};
  if (!values.team_name.trim()) errors.team_name = 'Team name is required.';
  if (!values.members.trim()) {
    errors.members = 'Add at least one member name.';
  } else {
    const list = values.members.split(',').map((s) => s.trim()).filter(Boolean);
    if (list.length === 0) errors.members = 'Add at least one member name.';
  }
  if (!values.project_title.trim()) errors.project_title = 'Project title is required.';
  const descLen = values.project_desc.trim().length;
  if (descLen < 50) errors.project_desc = `Idea must be at least 50 characters (currently ${descLen}).`;
  else if (descLen > 500) errors.project_desc = `Idea must be at most 500 characters (currently ${descLen}).`;
  const url = values.github_url.trim();
  if (!url) errors.github_url = 'GitHub repository URL is required.';
  else if (!URL_RE.test(url)) errors.github_url = 'Enter a valid URL starting with https://';
  else if (!/github\.com/i.test(url)) errors.github_url = 'URL must point to github.com';
  if (!values.contact_email.trim()) errors.contact_email = 'Contact email is required.';
  else if (!EMAIL_RE.test(values.contact_email.trim())) errors.contact_email = 'Enter a valid email address.';
  return errors;
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
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState(null);

  const liveErrors = useMemo(() => validate(values), [values]);
  const descCount = values.project_desc.trim().length;

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  const blur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));
  const showError = (field) => (touched[field] || errors[field]) && liveErrors[field];

  async function onSubmit(e) {
    e.preventDefault();
    const v = validate(values);
    setErrors(v);
    setTouched({
      team_name: true,
      members: true,
      project_title: true,
      project_desc: true,
      github_url: true,
      contact_email: true,
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
      setSubmitError(err?.message || 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <Layout status="SUBMITTED">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-20">
          <div className="card-brut bg-paper p-10">
            <div className="eyebrow mb-4">IDEA RECEIVED</div>
            <div className="flex items-start gap-4">
              <IconCheck className="text-moss shrink-0 mt-2" width="56" height="56" strokeWidth="3" />
              <h1 className="font-display italic font-black text-6xl sm:text-8xl text-amber leading-[0.9]">
                SUBMITTED ✓
              </h1>
            </div>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="border-2 border-ink p-4">
                <div className="eyebrow">TEAM</div>
                <div className="font-display font-black text-2xl mt-1">{result.team_name}</div>
              </div>
              <div className="border-2 border-ink p-4">
                <div className="eyebrow">PROJECT</div>
                <div className="font-display font-black text-2xl mt-1">{result.project_title}</div>
              </div>
            </div>
            <div className="mt-4 border-2 border-ink p-4">
              <div className="eyebrow">REPOSITORY</div>
              <a
                href={result.github_url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm mt-1 break-all underline hover:text-amber"
              >
                {result.github_url}
              </a>
            </div>
            <div className="mt-4 border-2 border-dashed border-ink/50 p-4">
              <div className="eyebrow">SUBMISSION ID</div>
              <div className="font-mono text-xs sm:text-sm mt-1 break-all">{result.id}</div>
            </div>
            <p className="mt-6 text-ink/70">
              Screenshot this page or note the submission ID. We will use it at
              check-in.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/" className="btn-ghost">
                Back to home
              </Link>
              <Link to="/leaderboard" className="btn-primary">
                View leaderboard <IconArrow width="20" height="20" />
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout status="SUBMISSION">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="eyebrow mb-4">§ SUBMISSION FORM</div>
        <h1 className="font-display font-black text-6xl sm:text-7xl leading-[0.9]">
          SUBMIT<br />YOUR <span className="italic text-amber">IDEA</span>
        </h1>
        <p className="mt-5 text-lg text-ink/70 max-w-xl">
          One submission per team. Push your code to GitHub first — judges
          will open the repo while they score you.
        </p>

        <form onSubmit={onSubmit} className="mt-12 space-y-10" noValidate>
          <div>
            <label htmlFor="team_name" className="field-label">01 · Team name</label>
            <input
              id="team_name"
              type="text"
              className="input-line"
              placeholder="e.g. Midnight Compiler"
              value={values.team_name}
              onChange={update('team_name')}
              onBlur={blur('team_name')}
              disabled={submitting}
              required
            />
            {showError('team_name') && <p className="field-error">{liveErrors.team_name}</p>}
          </div>

          <div>
            <label htmlFor="members" className="field-label">
              02 · Members — comma-separated, at least one
            </label>
            <textarea
              id="members"
              rows={2}
              className="input-line resize-none"
              placeholder="Ada Lovelace, Grace Hopper, Alan Turing"
              value={values.members}
              onChange={update('members')}
              onBlur={blur('members')}
              disabled={submitting}
              required
            />
            {showError('members') && <p className="field-error">{liveErrors.members}</p>}
          </div>

          <div>
            <label htmlFor="project_title" className="field-label">03 · Project title</label>
            <input
              id="project_title"
              type="text"
              className="input-line"
              placeholder="e.g. Lecture Note Whisperer"
              value={values.project_title}
              onChange={update('project_title')}
              onBlur={blur('project_title')}
              disabled={submitting}
              required
            />
            {showError('project_title') && <p className="field-error">{liveErrors.project_title}</p>}
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="project_desc" className="field-label">
                04 · The idea — what you built, 50 to 500 chars
              </label>
              <span
                className={`font-mono text-[11px] tabular-nums ${
                  descCount > 500 || descCount < 50 ? 'text-amber' : 'text-ink/60'
                }`}
              >
                {descCount} / 500
              </span>
            </div>
            <textarea
              id="project_desc"
              rows={5}
              className="input-line resize-none"
              placeholder="What it does, who it is for, and the one moment in the demo that will surprise us."
              value={values.project_desc}
              onChange={update('project_desc')}
              onBlur={blur('project_desc')}
              disabled={submitting}
              required
              maxLength={600}
            />
            {showError('project_desc') && <p className="field-error">{liveErrors.project_desc}</p>}
          </div>

          <div>
            <label htmlFor="github_url" className="field-label">
              05 · GitHub repository — public link
            </label>
            <input
              id="github_url"
              type="url"
              className="input-line"
              placeholder="https://github.com/your-team/your-project"
              value={values.github_url}
              onChange={update('github_url')}
              onBlur={blur('github_url')}
              disabled={submitting}
              required
            />
            {showError('github_url') && <p className="field-error">{liveErrors.github_url}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="contact_email" className="field-label">06 · Contact email</label>
              <input
                id="contact_email"
                type="email"
                className="input-line"
                placeholder="captain@team.edu"
                value={values.contact_email}
                onChange={update('contact_email')}
                onBlur={blur('contact_email')}
                disabled={submitting}
                required
              />
              {showError('contact_email') && (
                <p className="field-error">{liveErrors.contact_email}</p>
              )}
            </div>
            <div>
              <label htmlFor="contact_phone" className="field-label">
                07 · Contact phone (optional)
              </label>
              <input
                id="contact_phone"
                type="tel"
                className="input-line"
                placeholder="+962 7 9000 0000"
                value={values.contact_phone}
                onChange={update('contact_phone')}
                disabled={submitting}
              />
            </div>
          </div>

          {submitError && (
            <div className="border-2 border-amber bg-amber-soft p-4 font-mono text-sm">
              {submitError}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t-2 border-ink/30">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent animate-spin" />
                  SUBMITTING…
                </>
              ) : (
                <>
                  SUBMIT IDEA <IconArrow width="20" height="20" />
                </>
              )}
            </button>
            <Link to="/" className="font-mono text-[12px] uppercase tracking-[0.2em] underline">
              ← back to home
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
