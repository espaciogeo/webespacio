// Lucian UX/UI Prompt #223 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#223
// Tarjetas sticky que se apilan: cada una se achica (−6 %) y se oscurece (18 %) a medida que la siguiente la cubre.
import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { propuestas, propuestasIntro } from '../content';
import { ClaseCard } from './ClaseCard';
import { Img } from '../lib/Img';

const STICK = 84, STEP = 14;
const TONES = ['bg-ink text-paper', 'bg-paper shadow-[inset_0_0_0_1px_var(--line-2)]', 'bg-paper shadow-[inset_0_0_0_1px_var(--line-2)]', 'bg-[var(--ink-soft)] text-paper', 'bg-paper shadow-[inset_0_0_0_1px_var(--line-2)]'];

export function Propuestas() {
  const cards = useRef<HTMLElement[]>([]);

  useEffect(() => {
    let raf = 0;
    const draw = () => {
      raf = 0;
      const els = cards.current;
      const pos = els.map((c) => c.getBoundingClientRect().top);
      els.forEach((c, i) => {
        let depth = 0;
        for (let j = i + 1; j < els.length; j++) {
          const stick = STICK + j * STEP, d = (pos[j] - stick) / (c.offsetHeight || 1);
          depth += Math.max(0, Math.min(1, 1 - d));
        }
        c.style.transform = `scale(${(1 - depth * 0.06).toFixed(3)})`;
        const sh = c.querySelector<HTMLElement>('.u223-sh');
        if (sh) sh.style.opacity = (depth * 0.18).toFixed(3);
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(draw); };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    draw();
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);

  const total = propuestas.length + 1;
  return (
    <section id="propuestas" aria-labelledby="propuestas-title" className="wrap relative pb-[12svh] pt-[16svh]">
      <div className="grid grid-cols-12 gap-x-4">
        <p className="kicker col-span-12 lg:col-span-3"><b>05</b> · {propuestasIntro.kicker}</p>
        <h2 id="propuestas-title" className="h-section col-span-12 mt-3 max-w-[16ch] lg:col-span-9 lg:mt-0">{propuestasIntro.titulo}</h2>
      </div>

      <div className="mt-[8svh]">
        <article id="clase" ref={(el) => { if (el) cards.current[0] = el; }} className={`u223-c relative mb-6 overflow-hidden rounded-[28px] ${TONES[0]}`}
          style={{ top: STICK, minHeight: 'min(70svh, 620px)' }} aria-labelledby="clase-title">
          <div className="grid h-full min-h-[inherit] lg:grid-cols-12">
            <div className="flex flex-col p-6 sm:p-9 lg:col-span-8 lg:p-12">
              <p className="mono mb-2 text-sm text-paper/50">01 / 0{total}</p>
              <ClaseCard />
            </div>
            <div className="relative hidden overflow-hidden lg:col-span-4 lg:block">
              <Img name="taller-grupo" alt="Grupo de estudiantes en un taller presencial del Espacio" sizes="34vw" className="absolute inset-0 h-full w-full object-cover opacity-80" />
            </div>
          </div>
          <span id="clase-title" className="sr-only">Clase gratuita</span>
          <span className="u223-sh" aria-hidden="true" />
        </article>

        {propuestas.map((p, i) => {
          const idx = i + 1;
          const flip = idx % 2 === 0;
          return (
            <article key={p.id} ref={(el) => { if (el) cards.current[idx] = el; }}
              className={`u223-c relative mb-6 overflow-hidden rounded-[28px] ${TONES[idx]}`}
              style={{ top: STICK + idx * STEP, minHeight: 'min(70svh, 620px)' }}>
              <div className={`grid h-full min-h-[inherit] lg:grid-cols-12 ${flip ? '' : ''}`}>
                <div className={`relative h-[30svh] overflow-hidden lg:h-auto ${flip ? 'lg:order-2 lg:col-span-5' : 'lg:col-span-6'}`}>
                  <Img name={p.img} alt="" sizes="(min-width:1024px) 45vw, 100vw"
                    className={`absolute inset-0 h-full w-full ${p.img === 'libro' ? 'object-contain p-8 lg:p-14' : 'object-cover'}`} />
                </div>
                <div className={`flex flex-col p-6 sm:p-9 lg:p-12 ${flip ? 'lg:col-span-7' : 'lg:col-span-6'}`}>
                  <p className="mono text-sm opacity-60">0{idx + 1} / 0{total}</p>
                  <h3 className="mt-3 font-bold tracking-[-0.04em]" style={{ fontSize: 'clamp(30px, 3.8vw, 60px)', lineHeight: 0.98 }}>{p.titulo}</h3>
                  <p className="mt-4 max-w-[46ch] text-[18px] leading-relaxed opacity-80">{p.texto}</p>
                  {p.lista && (
                    <ol className="mono mt-5 grid max-w-[460px] grid-cols-2 gap-x-6 gap-y-1 text-[14px] opacity-80">
                      {p.lista.map((x, k) => <li key={x}><span className="opacity-50">{k + 1}.</span> {x}</li>)}
                    </ol>
                  )}
                  <p className="mono mt-auto pt-6 text-[14px] opacity-70">{p.meta}</p>
                  <a href={p.href} className={`btn mt-4 self-start ${TONES[idx].includes('text-paper') ? 'btn-ghost-light' : 'btn-ghost'}`}>
                    {p.cta} <ArrowUpRight size={18} aria-hidden />
                  </a>
                </div>
              </div>
              <span className="u223-sh" aria-hidden="true" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
