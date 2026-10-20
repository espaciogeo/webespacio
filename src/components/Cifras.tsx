// Lucian UX/UI Prompt #370 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#370
// Contadores + línea de tiempo que se enciende al pasar (solo hitos confirmados en el sitio).
import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { cifras } from '../content';
import { Img } from '../lib/Img';

function Counter({ to, from = 0, prefix, label, year }: { to: number; from?: number; prefix: string; label: string; year?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!inView) { setV(from); return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return; }
    const c = animate(from, to, { duration: year ? 1.4 : 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, from, year]);
  return (
    <div ref={ref}>
      <p className="font-display font-bold leading-[0.85] tracking-[-0.05em]" style={{ fontSize: 'clamp(52px, 6vw, 104px)', fontVariantNumeric: 'tabular-nums' }}>
        <span className="mr-1 align-top text-[0.4em] font-medium tracking-normal text-ink-3">{prefix.trim()}</span>
        {year ? v : v.toLocaleString('es-AR')}
      </p>
      <p className="mono mt-3 max-w-[26ch] text-[15px] text-ink-2">{label}</p>
    </div>
  );
}

export function Cifras() {
  const tl = useRef<HTMLDivElement>(null);
  const ln = useRef<HTMLSpanElement>(null);
  const evs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let raf = 0;
    const draw = () => {
      raf = 0;
      if (!tl.current || !ln.current) return;
      const r = ln.current.getBoundingClientRect();
      const tip = window.innerHeight * 0.6 - r.top;
      ln.current.style.setProperty('--p', Math.max(0, Math.min(1, tip / r.height)).toFixed(4));
      evs.current.forEach((el) => el.classList.toggle('on', el.getBoundingClientRect().top + 18 <= window.innerHeight * 0.6));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(draw); };
    window.addEventListener('scroll', on, { passive: true });
    draw();
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);

  const [a, b, c] = cifras.items;
  return (
    <section aria-labelledby="cifras-title" className="sec-azul relative">
      <div className="wrap py-[14svh]">
      <p className="kicker">{cifras.kicker}</p>
      <h2 id="cifras-title" className="sr-only font-bold">El Espacio en números</h2>
      {/* Una fila, tres columnas, todo a la misma altura */}
      <div className="mt-10 grid items-start gap-x-8 gap-y-12 md:grid-cols-3">
        <Counter to={a.valor} prefix={a.prefijo} label={a.label} />
        <Counter to={b.valor} prefix={b.prefijo} label={b.label} />
        <Counter to={c.valor} prefix={c.prefijo} label={c.label} />
      </div>

      <div className="mt-[14svh] grid grid-cols-12 gap-x-4 gap-y-10">
        <figure className="col-span-12 lg:col-span-6">
          <div className="aspect-[3/2] overflow-hidden rounded-[22px]">
            <Img name="taller-grupo" alt="Foto grupal de un workshop presencial del Espacio de Geometría Sagrada" sizes="(min-width:1024px) 46vw, 100vw" className="h-full w-full object-cover" />
          </div>
          <figcaption className="kicker mt-3 !normal-case !tracking-normal">Workshop presencial · 2024</figcaption>
        </figure>

        <div ref={tl} className="relative col-span-12 lg:col-span-5 lg:col-start-8">
          <span ref={ln} className="u370-ln left-[10px]" aria-hidden="true"><i /></span>
          <ol className="relative">
            {cifras.hitos.map((h, i) => (
              <li key={h.anio}>
                <div ref={(el) => { if (el) evs.current[i] = el; }} className="u370-ev relative pb-14 pl-12 last:pb-0">
                  <span className="u370-dot left-[10px]" aria-hidden="true" />
                  <div className="u370-cd" style={{ transform: 'translateX(18px)' }}>
                    <b className="mono block text-[26px] font-medium text-[var(--ochre)]">{h.anio}</b>
                    <span className="mt-1 block max-w-[34ch] text-[19px] leading-snug">{h.texto}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      </div>
    </section>
  );
}
