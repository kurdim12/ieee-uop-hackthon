import { useEffect } from 'react';

export default function Toast({ message, tone = 'moss', onDone, duration = 2400 }) {
  useEffect(() => {
    if (!message) return undefined;
    const id = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(id);
  }, [message, duration, onDone]);

  if (!message) return null;
  const bg = tone === 'ieee' ? 'bg-ieee' : 'bg-moss';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className={`${bg} text-white border-2 border-ink shadow-brut px-6 py-3 font-mono uppercase tracking-[0.18em] text-sm`}>
        {message}
      </div>
    </div>
  );
}
