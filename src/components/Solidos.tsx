import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import { solidos, solidosIntro } from '../content';
import { useReducedMotionPref } from '../lib/useMedia';

const SolidsCanvas = lazy(() => import('./SolidsCanvas'));

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

export function Solidos() {
  const wrap = useRef<HTMLDivElement>(null);
  const prog = useRef(0);
  const [near, setNear] = useState(false);
  const [gl, setGl] = useState(true);
  const [cur, setCur] = useState(0);
  const reduced = useReducedMotionPref();
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });

  // Three.js se descarga recién cuando la sección está por entrar.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGl(hasWebGL()); setNear(true); io.disconnect(); } }, { rootMargin: '100% 0px' });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => scrollYProgress.on('change', (p) => {
    prog.current = p;
    setCur(Math.min(solidos.length - 1, Math.max(0, Math.round(p * (solidos.length - 1)))));
  }), [scrollYProgress]);

  const s = solidos[cur];
  return (
    <section ref={wrap} aria-labelledby="solidos-title" className="relative bg-night text-paper" style={{ height: '260svh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Guías de construcción en azul: circunferencia circunscrita y ejes */}
        <svg className="pointer-events-none absolute left-1/2 top-[50%] h-[min(52svh,86vw)] w-[min(52svh,86vw)] -translate-x-1/2 -translate-y-1/2 lg:left-[62%] lg:top-1/2 lg:h-[min(84svh,52vw)] lg:w-[min(84svh,52vw)]" viewBox="-1.2 -1.2 2.4 2.4" aria-hidden="true">
          <g fill="none" stroke="rgb(var(--c-accent) / .42)" strokeWidth="1" style={{ vectorEffect: 'non-scaling-stroke' }}>
            <circle r="1.04" vectorEffect="non-scaling-stroke" />
            <path d="M-1.18 0H1.18M0 -1.18V1.18" strokeDasharray="3 6" vectorEffect="non-scaling-stroke" />
          </g>
          <text x="0.74" y="-0.8" fill="rgb(var(--c-accent) / .85)" fontSize="0.045" style={{ fontFamily: 'var(--font-mono)' }}>R = 1</text>
        </svg>
        <div className="absolute left-1/2 top-[50%] h-[min(52svh,86vw)] w-[min(52svh,86vw)] -translate-x-1/2 -translate-y-1/2 lg:left-[62%] lg:top-1/2 lg:h-[min(84svh,52vw)] lg:w-[min(84svh,52vw)]">
          {near && gl && (
            <Suspense fallback={null}>
              <SolidsCanvas prog={prog} reduced={reduced} />
            </Suspense>
          )}
        </div>

        <div className="wrap relative flex h-full flex-col pb-8 pt-20 lg:justify-center lg:pt-24">
          <div className="lg:max-w-[38%]">
            <p className="kicker !text-paper/60"><b className="!text-paper">04</b> · {solidosIntro.kicker}</p>
            <h2 id="solidos-title" className="h-section mt-3" style={{ fontSize: 'clamp(34px, 4.8vw, 80px)' }}>{solidosIntro.titulo}</h2>
            <p className="mt-4 hidden max-w-[40ch] text-[18px] text-paper/70 lg:block">{solidosIntro.texto}</p>
            {/* qué es C · V · A */}
            <p className="mt-4 max-w-[40ch] text-[16px] leading-relaxed text-paper/70"><b className="font-medium text-paper">{solidosIntro.cva.split(':')[0]}:</b>{solidosIntro.cva.slice(solidosIntro.cva.indexOf(':') + 1)}</p>
          </div>

          {/* Lista completa (desktop) */}
          <ol className="mt-10 hidden max-w-[38%] lg:block">
            {solidos.map((x, i) => (
              <li key={x.nombre} className="border-t border-paper/15 py-3 transition-opacity duration-500" style={{ opacity: i === cur ? 1 : 0.38 }}>
                <div className="flex items-baseline gap-4">
                  <span className="mono text-sm text-paper/60">0{i + 1}</span>
                  <span className="font-display text-[28px] font-bold tracking-[-0.03em]">{x.nombre}</span>
                  <span className="mono ml-auto text-sm text-accent">{x.elemento}</span>
                </div>
                <div className="grid transition-[grid-template-rows] duration-500" style={{ gridTemplateRows: i === cur ? '1fr' : '0fr' }}>
                  <p className="mono overflow-hidden pl-9 text-[14px] text-paper/75">
                    <span className="block pt-2">C {x.caras} · V {x.vertices} · A {x.aristas} · caras: {x.cara}</span>
                    <span className="block pb-1 text-paper/45">C − A + V = {x.caras - x.aristas + x.vertices}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* Solo el activo (móvil) */}
          <div className="mt-auto lg:hidden" aria-live="polite">
            <p className="mono text-sm text-paper/60"><span className="text-accent">{s.elemento}</span></p>
            <p className="mt-1 font-display text-[44px] font-bold leading-none tracking-[-0.04em]">{s.nombre}</p>
            <p className="mono mt-3 text-[15px] text-paper/75">{s.caras} caras · {s.vertices} vértices · {s.aristas} aristas</p>
          </div>
          {!gl && <p className="mono mt-6 text-sm text-paper/60">Tu navegador no puede mostrar la vista 3D.</p>}
        </div>
      </div>
    </section>
  );
}
