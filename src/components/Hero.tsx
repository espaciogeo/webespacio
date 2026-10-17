// Lucian UX/UI Prompt #237 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#237
// (wordmark: líneas que suben desde una máscara invisible, con subrayado dibujado al final)
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { FlowerOfLife } from './FlowerOfLife';
import { hero } from '../content';
import { useReady } from '../lib/ready';
import { useMedia, useReducedMotionPref } from '../lib/useMedia';
import { scrollToId } from '../lib/scroll';

export function Hero() {
  const wrap = useRef<HTMLDivElement>(null);
  const ready = useReady();
  const reduced = useReducedMotionPref();
  const desktop = useMedia('(min-width: 1024px)', true);
  const touch = useMedia('(hover: none)');
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });

  const textY = useTransform(scrollYProgress, [0.04, 0.34], ['0%', '-18%']);
  const textO = useTransform(scrollYProgress, [0.04, 0.28], [1, 0]);
  const geoX = useTransform(scrollYProgress, [0.06, 0.42], desktop ? ['21vw', '0vw'] : ['0vw', '0vw']);
  const geoY = useTransform(scrollYProgress, [0.06, 0.42], desktop ? ['0svh', '0svh'] : ['-17svh', '0svh']);
  const geoS = useTransform(scrollYProgress, [0.06, 0.42], desktop ? [1, 0.98] : [1, 1.12]);
  const cueO = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const endO = useTransform(scrollYProgress, [0.82, 0.95], [0, 1]);

  return (
    <section ref={wrap} id="inicio" aria-labelledby="hero-title" className="relative" style={{ height: '170svh' }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Geometría */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2"
          style={{ width: desktop ? 'min(86svh, 62vw)' : 'min(94vw, 62svh)' }}>
          <motion.div className="h-full w-full" style={{ x: geoX, y: geoY, scale: geoS }}>
            <div className={`h-full w-full ${touch && !reduced ? 'flower-spin' : ''}`}>
            <FlowerOfLife progress={scrollYProgress} play={ready} reduced={reduced} touch={touch} />
            </div>
          </motion.div>
        </div>

        {/* Texto */}
        <motion.div style={{ y: textY, opacity: textO }} className="wrap relative flex h-full flex-col justify-end pb-[max(20px,4svh)] pt-24 lg:pt-28">
          <h1 id="hero-title" className={`u237 display mb-6 select-none lg:mb-8 ${ready || reduced ? 'is-in is-drawn' : ''}`}
            style={{ fontSize: 'clamp(44px, min(12.4vw, 19svh), 196px)' }}>
            <span className="u237-ln"><span className="u237-in" style={{ ['--i' as string]: 0, ['--d' as string]: '350ms' }}>Geometría</span></span>
            <span className="u237-ln relative pl-[12vw] lg:pl-[26vw]">
              <span className="u237-in" style={{ ['--i' as string]: 1, ['--d' as string]: '350ms' }}>Sagrada</span>
              <svg className="u237-u absolute left-[12vw] h-[0.14em] w-[58vw] lg:left-[26vw] lg:w-[50vw]" style={{ bottom: '-0.02em', transitionDelay: '1.5s' }} viewBox="0 0 210 22" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 14c30-8 62-9 96-5s70 6 108-4" />
              </svg>
            </span>
          </h1>
          <p className="m-0 max-w-[46ch] text-[19px] leading-snug text-ink-2 sm:text-xl lg:text-[22px]">{hero.lede}</p>
          <div className="mt-6 flex flex-wrap gap-3 lg:mt-8">
            <a href="#clase" onClick={(e) => { e.preventDefault(); scrollToId('clase'); }} className="btn btn-primary">
              {hero.ctaPrimary}
            </a>
            <a href="#propuestas" onClick={(e) => { e.preventDefault(); scrollToId('propuestas'); }} className="btn btn-ghost">
              {hero.ctaSecondary} <ArrowUpRight size={18} aria-hidden />
            </a>
          </div>
        </motion.div>

        <motion.div style={{ opacity: cueO }} className="kicker absolute bottom-5 right-[var(--gutter)] hidden items-center gap-2 lg:flex">
          scroll <ArrowDown size={14} aria-hidden />
        </motion.div>
        <motion.p style={{ opacity: endO }} className="kicker absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          de la flor de la vida a los <b>sólidos</b> ↓
        </motion.p>
      </div>
    </section>
  );
}
