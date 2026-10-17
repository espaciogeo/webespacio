import Lenis from 'lenis';

// Scroll suave compartido. Se desactiva con prefers-reduced-motion.
let lenis: Lenis | null = null;

export function startLenis() {
  if (typeof window === 'undefined') return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  lenis = new Lenis({ lerp: 0.16, wheelMultiplier: 1.1, smoothWheel: true });
  let raf = 0;
  const loop = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); lenis?.destroy(); lenis = null; };
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -24, duration: 1.4 });
  else el.scrollIntoView({ behavior: 'auto', block: 'start' });
}

export const lockScroll = (on: boolean) => {
  if (lenis) { if (on) lenis.stop(); else lenis.start(); }
  document.documentElement.style.overflow = on ? 'hidden' : '';
};
