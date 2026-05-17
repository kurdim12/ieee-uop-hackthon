const KEY = 'judge_session';

export function getJudge() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id && parsed.username) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function setJudge(judge) {
  if (typeof window === 'undefined') return;
  const payload = {
    id: judge.id,
    username: judge.username,
    full_name: judge.full_name,
  };
  window.localStorage.setItem(KEY, JSON.stringify(payload));
}

export function clearJudge() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}
