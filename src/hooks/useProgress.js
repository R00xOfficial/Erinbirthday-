import { useCallback, useEffect, useState } from 'react';

export const initialProgress = {
  envelopeOpened: false,
  puzzleComplete: false,
  matchedPairs: [],
  foundHearts: [],
  quizAnswers: [],
  quizComplete: false,
  scrapbookOpened: false,
  letterOpened: false,
};

function load(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return initialProgress;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? { ...initialProgress, ...parsed } : initialProgress;
  } catch {
    // Private mode, blocked storage or corrupt data: start fresh.
    return initialProgress;
  }
}

/** Small shared progress object, persisted to localStorage when available. */
export function useProgress(key) {
  const [progress, setProgress] = useState(() => load(key));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(progress));
    } catch {
      /* storage unavailable — the experience still works without it */
    }
  }, [key, progress]);

  const update = useCallback((patch) => {
    setProgress((p) => ({ ...p, ...(typeof patch === 'function' ? patch(p) : patch) }));
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    setProgress(initialProgress);
  }, [key]);

  return [progress, update, reset];
}
