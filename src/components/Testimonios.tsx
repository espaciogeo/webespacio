// Lucian UX/UI Prompt #207 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#207
// Muro de testimonios en dos columnas (una en móvil). Citas reales de /formacion-profesional/; sin estrellas ni puntajes.
import { useEffect, useRef, useState } from 'react';
import { testimonios } from '../content';
import { useMedia } from '../lib/useMedia';

function Quote({ t, dup }: { t: (typeof testimonios.lista)[number]; dup?: boolean }) {
  const [pre, post] = t.texto.split(t.marca);
  return (
    <figure className="u207-cd m-0 rounded-[18px] bg-paper p-5 shadow-[inset_0_0_0_1px_var(--ux-line)]" aria-hidden={dup || undefined}>
      <blockquote className="m-0 text-[18px] leading-relaxed text-ink-2">“{pre}<mark>{t.marca}</mark>{post}”</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-ink text-[14px] font-bold text-paper" aria-hidden="true">{t.nombre.replace('Ma. ', '').charAt(0)}</span>
        <span><b className="block text-[16px] text-ink">{t.nombre}</b><small className="mono block text-[13px] text-ink-3">{t.lugar}</small></span>
      </figcaption>
    </figure>
  );
}

export function Testimonios() {
  const root = useRef<HTMLDivElement>(null);
  const two = useMedia('(min-width: 768px)', true);
  const rm = useMedia('(prefers-reduced-motion: reduce)');
  const [off, setOff] = useState(false);
  const L = testimonios.lista;
  const cols = two ? [L.filter((_, i) => i % 2 === 0), L.filter((_, i) => i % 2 === 1)] : [L];

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOff(!e.isIntersecting));
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="testimonios-title" className="wrap py-[10svh]">
      <div className="grid grid-cols-12 gap-x-4 gap-y-8">
        <div className="col-span-12 lg:col-span-4">
          <p className="kicker"><b>·</b> {testimonios.kicker}</p>
          <h2 id="testimonios-title" className="h-section mt-3" style={{ fontSize: 'clamp(36px, 4.4vw, 72px)' }}>{testimonios.titulo}</h2>
        </div>
        <div ref={root} className={`u207 col-span-12 lg:col-span-8 ${off ? 'is-off' : ''}`}>
          <div className="u207-wl grid gap-[14px] overflow-hidden md:grid-cols-2" style={{ height: rm ? 'auto' : 'min(78svh, 680px)' }}>
            {cols.map((col, c) => (
              <div key={c} className="u207-co"
                onFocus={(e) => e.currentTarget.classList.add('is-hold')} onBlur={(e) => e.currentTarget.classList.remove('is-hold')}>
                <div className="u207-tr" style={{ ['--t' as string]: c ? '58s' : '50s', ['--dir' as string]: c ? 'reverse' : 'normal' }}>
                  {col.map((t) => <Quote key={t.nombre} t={t} />)}
                  {!rm && col.map((t) => <Quote key={`d-${t.nombre}`} t={t} dup />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
