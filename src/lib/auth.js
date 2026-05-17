const JUDGE_KEY = 'judge_session';
const ADMIN_KEY = 'admin_session';

function read(key) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id && parsed.username) return parsed;
    return null;
  } catch {
    return null;
  }
}

function write(key, value) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    key,
    JSON.stringify({ id: value.id, username: value.username, full_name: value.full_name })
  );
}

function clear(key) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
}

export const getJudge = () => read(JUDGE_KEY);
export const setJudge = (j) => write(JUDGE_KEY, j);
export const clearJudge = () => clear(JUDGE_KEY);

export const getAdmin = () => read(ADMIN_KEY);
export const setAdmin = (a) => write(ADMIN_KEY, a);
export const clearAdmin = () => clear(ADMIN_KEY);
