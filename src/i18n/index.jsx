import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './en.js';
import ar from './ar.js';

const DICTS = { en, ar };
const STORAGE_KEY = 'lang_pref';

function readStored() {
  if (typeof window === 'undefined') return 'en';
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'ar' || v === 'en' ? v : 'en';
  } catch {
    return 'en';
  }
}

const LangContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: en,
  isRTL: false,
  format: (template, vars) => template,
});

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => readStored());

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLang = useCallback((next) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
    setLangState(next);
  }, []);

  const value = useMemo(() => {
    const t = DICTS[lang] ?? en;
    const format = (template, vars = {}) => {
      if (typeof template !== 'string') return template;
      return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
    };
    return { lang, setLang, t, isRTL: lang === 'ar', format };
  }, [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useT = () => useContext(LangContext);
