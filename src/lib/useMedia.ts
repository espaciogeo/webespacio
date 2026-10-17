import { useEffect, useState } from 'react';

export function useMedia(query: string, initial = false) {
  const [m, setM] = useState(() => (typeof window === 'undefined' ? initial : window.matchMedia(query).matches));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return m;
}
export const useReducedMotionPref = () => useMedia('(prefers-reduced-motion: reduce)');
