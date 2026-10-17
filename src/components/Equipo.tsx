import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { equipo, links } from '../content';
import { Img } from '../lib/Img';

const curtain = [0.76, 0, 0.24, 1] as const;

// El observer mira el contenedor (sin clip-path); el recorte se anima en el hijo.
function MaskImg({ name, alt, className, sizes }: { name: string; alt: string; className: string; sizes: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.1 });
  return (
    <div ref={ref} className={className}>
      <motion.div className="mask-img h-full w-full rounded-[inherit]" initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={seen ? { clipPath: 'inset(0% 0 0 0)' } : undefined}
        transition={{ duration: 1.2, ease: curtain }}>
        <motion.div className="h-full w-full" initial={{ scale: 1.15 }} animate={seen ? { scale: 1 } : undefined} transition={{ duration: 1.6, ease: curtain }}>
          <Img name={name} alt={alt} sizes={sizes} className="h-full w-full object-cover" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Equipo({ n = '07' }: { n?: string } = {}) {
  const [monique, pablo] = equipo.personas;
  return (
    <section aria-labelledby="equipo-title" className="wrap py-[14svh]">
      <div className="grid grid-cols-12 gap-x-4 gap-y-10">
        <div className="col-span-12 lg:col-span-5">
          <p className="kicker"><b>{n}</b> · {equipo.kicker}</p>
          <h2 id="equipo-title" className="h-section mt-3" style={{ fontSize: 'clamp(38px, 5vw, 84px)' }}>Monique<br />y Pablo.</h2>
          <p className="mt-6 max-w-[36ch] text-[20px] leading-snug text-ink-2">{equipo.intro}</p>
          <p className="mono mt-4 max-w-[40ch] text-[14px] text-ink-3">{equipo.formadora}</p>
          <a href={links.quienesSomos} className="link-arrow mt-6">Conocé al equipo <ArrowRight size={18} aria-hidden /></a>
        </div>
        <MaskImg name="equipo-duo" alt="Monique Dumoulin y Pablo Pettinaroli saludando" sizes="(min-width:1024px) 58vw, 100vw"
          className="col-span-12 aspect-[3/2] rounded-[22px] lg:col-span-7" />
      </div>

      <div className="mt-[10svh] grid grid-cols-12 gap-x-4 gap-y-14">
        {[monique, pablo].map((p, i) => (
          <article key={p.nombre} className={`col-span-12 grid grid-cols-12 gap-x-4 sm:col-span-6 ${i === 1 ? 'lg:col-span-5 lg:col-start-8 lg:mt-32' : 'lg:col-span-5'}`}>
            <MaskImg name={p.img} alt={p.nombre} sizes="(min-width:1024px) 28vw, 50vw" className={`col-span-12 rounded-[18px] ${i === 0 ? 'aspect-[4/5]' : 'aspect-square'}`} />
            <div className="col-span-12 mt-5">
              <p className="mono text-[14px] text-ink-3">{p.rol}</p>
              <h3 className="mt-1 text-[34px] font-bold leading-none tracking-[-0.035em]">{p.nombre}</h3>
              <p className="mt-3 max-w-[42ch] text-[18px] leading-relaxed text-ink-2">{p.bio}</p>
              <a href={p.href} className="link-arrow mt-2 text-[17px]">Ver más <ArrowRight size={18} aria-hidden /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
