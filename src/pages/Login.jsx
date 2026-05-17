import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { IconArrow } from '../components/Icons.jsx';
import { supabase } from '../lib/supabase.js';
import { setJudge } from '../lib/auth.js';

export default function Login() {
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
      setError('Enter username and password.');
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
        setError('Invalid credentials');
        return;
      }
      setJudge(data);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || 'Login failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout status="STAFF ONLY">
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="eyebrow">RESTRICTED</div>
            <h1 className="font-display font-black text-5xl sm:text-6xl mt-2 leading-none">
              JUDGE<br />
              <span className="italic text-ieee">LOGIN</span>
            </h1>
            <p className="mt-4 text-ink/70 text-sm">
              Pre-seeded accounts only. No public sign-up.
            </p>
          </div>

          <form onSubmit={onSubmit} className="card-brut p-8 bg-paper space-y-6">
            <div>
              <label htmlFor="username" className="field-label">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                className="input-line"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="password" className="field-label">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="input-line"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </div>

            {error && (
              <div className="border-2 border-ieee bg-ieee-soft px-3 py-2 font-mono text-sm">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent animate-spin" />
                  SIGNING IN…
                </>
              ) : (
                <>
                  SIGN IN <IconArrow width="20" height="20" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60 hover:text-ink underline"
              >
                ← back to home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
