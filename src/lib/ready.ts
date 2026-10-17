import { useSyncExternalStore } from 'react';

// Estado global mínimo: ¿ya se abrió la cortina del loader?
let ready = false;
const subs = new Set<() => void>();
export const setReady = () => { if (!ready) { ready = true; subs.forEach((f) => f()); } };
export const useReady = () => useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, () => ready, () => ready);
