// Propuestas: la clase gratuita en una caja ancha y, debajo, las demás propuestas en cajas una al lado de la otra.
import { ArrowUpRight } from 'lucide-react';
import { propuestas, propuestasIntro } from '../content';
import { ClaseCard } from './ClaseCard';
import { Img } from '../lib/Img';

export function Propuestas() {
  return (
    <section id="propuestas" aria-labelledby="propuestas-title" className="wrap relative pb-[12svh] pt-[16svh]">
      <div className="grid grid-cols-12 gap-x-4">
        <p className="kicker col-span-12 lg:col-span-3">{propuestasIntro.kicker}</p>
        <h2 id="propuestas-title" className="h-section col-span-12 mt-3 max-w-[18ch] lg:col-span-9 lg:mt-0">{propuestasIntro.titulo}</h2>
      </div>

      {/* Clase gratuita: una sola caja */}
      <article id="clase" className="relative mt-[8svh] overflow-hidden rounded-[28px] bg-ink text-paper" aria-labelledby="clase-title">
        <div className="grid lg:grid-cols-12">
          <div className="flex flex-col p-6 sm:p-9 lg:col-span-8 lg:p-12">
            <ClaseCard />
          </div>
          <div className="relative hidden min-h-[420px] overflow-hidden lg:col-span-4 lg:block">
            <Img name="trazo-toro" alt="Trazo de Geometría Sagrada hecho a mano" sizes="34vw" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          </div>
        </div>
        <span id="clase-title" className="sr-only">Clase gratuita</span>
      </article>

      {/* Resto de las propuestas: cajas lado a lado */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {propuestas.map((p) => (
          <article key={p.id} className="group flex flex-col overflow-hidden rounded-[22px] bg-paper shadow-[inset_0_0_0_1px_var(--line-2)]">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Img name={p.img} alt="" sizes="(min-width:1024px) 24vw, (min-width:640px) 48vw, 100vw"
                className={`absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.03] ${p.img === 'libro' ? 'object-contain p-6' : 'object-cover'}`} />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display font-semibold leading-tight tracking-[-0.02em]" style={{ fontSize: 'clamp(22px, 1.8vw, 28px)' }}>{p.titulo}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{p.texto}</p>
              <p className="mono mt-auto pt-5 text-[13px] text-ink-3">{p.meta}</p>
              {/* título y texto a la izquierda; botón centrado con fondo azul */}
              <a href={p.href} className="btn mt-4 self-center bg-[#094372] text-white hover:bg-[#0b5590]">
                {p.cta} <ArrowUpRight size={18} aria-hidden />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
