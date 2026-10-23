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

// Nuestro equipo (home y Qué hacemos): texto a la izquierda; a la derecha Monique y Pablo, cada uno con su foto e info. Sin foto repetida.
export function Equipo(_props: { n?: string; compacto?: boolean } = {}) {
  const [monique, pablo] = equipo.personas;
  return (
    <section aria-labelledby="equipo-title" className="wrap py-[14svh]">
      <div className="grid grid-cols-12 gap-x-6 gap-y-12">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="kicker">{equipo.kicker}</p>
            <h2 id="equipo-title" className="h-section mt-3" style={{ fontSize: 'clamp(38px, 4.6vw, 76px)' }}>Monique<br />y Pablo</h2>
            <p className="mt-6 max-w-[36ch] text-[20px] leading-snug text-ink-2">{equipo.intro}</p>
            <a href={links.quienesSomos} className="link-arrow mt-6">Conocé al equipo <ArrowRight size={18} aria-hidden /></a>
          </div>
        </div>
        <div className="col-span-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:col-span-8">
          {[monique, pablo].map((p) => (
            <article key={p.nombre} className="min-w-0">
              <MaskImg name={p.img} alt={p.nombre} sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw" className="aspect-[4/5] w-full rounded-[20px]" />
              {/* debajo de la foto, solo el nombre */}
              <h3 className="mt-4 font-display text-[clamp(26px,2.4vw,34px)] font-medium leading-none tracking-[-0.03em]">{p.nombre}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
