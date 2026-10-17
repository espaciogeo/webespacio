import { useEffect, useRef, useState } from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';
import { Outlet } from 'react-router-dom';
import { startLenis } from '../../lib/scroll';
import { setReady } from '../../lib/ready';

// Estructura común a TODAS las rutas: navbar fija, contenido y footer revelado por debajo (Lucian #236).
// Se monta una sola vez como ruta de layout del router. La única pieza propia de la home es su loader.
export function SiteLayout({ isHome }: { isHome: boolean }) {
  const footer = useRef<HTMLElement>(null);
  const [fh, setFh] = useState(0);
  const [reveal, setReveal] = useState(false);

  useEffect(() => startLenis(), []);
  // Entrada de secciones al hacer scroll (misma curva que la home): todo elemento con [data-rv].
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-rv]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach((e) => e.classList.add('is-rv')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-rv'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  // Sin loader (todas las páginas menos la home) la navbar aparece de inmediato.
  useEffect(() => { if (!isHome) setReady(); }, [isHome]);

  useEffect(() => {
    const el = footer.current!;
    const measure = () => { const h = el.offsetHeight; setFh(h); setReveal(h < window.innerHeight * 0.92); };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty('--r', Math.max(0, Math.min(1, 1 - (max - window.scrollY) / (el.offsetHeight || 1))).toFixed(3));
    };
    const ro = new ResizeObserver(() => { measure(); onScroll(); });
    ro.observe(el);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', onScroll, { passive: true });
    measure(); onScroll();
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); window.removeEventListener('scroll', onScroll); };
  }, []);

  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-paper">Saltar al contenido</a>
      <Navbar />
      <main id="contenido" className="relative z-10 bg-paper" style={{ marginBottom: reveal ? fh : 0 }}><Outlet /></main>
      <Footer ref={footer} reveal={reveal} />
      <div className="paper-grain" aria-hidden="true" />
    </>
  );
}
