import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { IconArrow } from '../components/Icons.jsx';
import { supabase } from '../lib/supabase.js';
import { setJudge } from '../lib/auth.js';
import { useT } from '../i18n/index.jsx';

export default function Login() {
  const { t } = useT();
  const L = t.login;
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/judge';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError(L.fillBoth);
      return;
    }
    setSubmitting(true);
    try {
      const { data, error: queryError } = await supabase
        .from('judges')
        .select('id, username, full_name')
        .eq('username', username.trim())
        .eq('password', password)
        .maybeSingle();
      if (queryError) throw queryError;
      if (!data) {
        setError(L.invalidCredentials);
        return;
      }
      setJudge(data);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || L.loginFailed);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout status={t.status.staffOnly}>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="eyebrow">{L.eyebrow}</div>
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl mt-2 leading-none">
              {L.titleA}<br />
              <span className="italic text-ieee">{L.titleB}</span>
            </h1>
            <p className="mt-4 text-slate-500 text-sm">{L.sub}</p>
          </div>

          <form onSubmit={onSubmit} className="card-brut p-8 bg-white space-y-6">
            <div>
              <label htmlFor="username" className="field-label">{L.username}</label>
              <input id="username" type="text" autoComplete="username" className="input-line"
                     value={username} onChange={(e) => setUsername(e.target.value)}
                     disabled={submitting} autoFocus dir="ltr" />
            </div>
            <div>
              <label htmlFor="password" className="field-label">{L.password}</label>
              <input id="password" type="password" autoComplete="current-password" className="input-line"
                     value={password} onChange={(e) => setPassword(e.target.value)}
                     disabled={submitting} dir="ltr" />
            </div>

            {error && (
              <div className="border border-red-200 bg-red-50 px-3 py-2 font-mono text-sm">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent animate-spin" />
                  {L.signingInBtn}
                </>
              ) : (
                <>
                  {L.signInBtn} <IconArrow width="20" height="20" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/" className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:text-ink underline">
                {L.backLink}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
