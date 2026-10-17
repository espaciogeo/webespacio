// Lucian UX/UI Prompt #260 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#260
// Lucian UX/UI Prompt #392 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#392
// Párrafo que se llena de tinta con el scroll (#260) + subrayado a mano sobre la palabra clave (#392).
import { useEffect, useMemo, useRef } from 'react';
import { useScroll } from 'framer-motion';
import { manifiesto } from '../content';
import { Img } from '../lib/Img';

const NS = 'http://www.w3.org/2000/svg';
const j = (n: number) => (Math.random() - 0.5) * 2 * n;

export function Manifiesto() {
  const wrap = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const words = useRef<HTMLSpanElement[]>([]);
  const pg = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });

  const tokens = useMemo(() => {
    const out: { w: string; em: boolean }[] = [];
    manifiesto.texto.split('*').forEach((chunk, ci) => chunk.split(' ').forEach((w) => w && out.push({ w, em: ci % 2 === 1 })));
    return out;
  }, []);

  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let drawn = false;
    const markIdx = tokens.findIndex((t) => t.w.replace(/[^\p{L}]/gu, '') === manifiesto.marcada);

    // #392: subrayado en dos pasadas, con temblor de mano
    const draw = (on: boolean) => {
      const s = svg.current, b = box.current, el = words.current[markIdx];
      if (!s || !b || !el) return;
      if (!on) { s.textContent = ''; return; }
      s.textContent = '';
      const br = b.getBoundingClientRect(), rs = el.getBoundingClientRect();
      const x = rs.left - br.left, y = rs.top - br.top + 4, w = rs.width, h = rs.height - 8;
      [0, 1].forEach((pass) => {
        const k = pass ? 1.6 : 1;
        const p = document.createElementNS(NS, 'path');
        p.setAttribute('d', `M${x - 2} ${y + h - 1 + j(1.5)} Q${x + w / 2} ${y + h + 3 * k + 4 + j(2)} ${x + w + 3} ${y + h - 2 + j(1.5)}`);
        if (pass) p.setAttribute('class', 'b');
        s.appendChild(p);
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len} ${len}`;
        if (rm || !p.animate) { p.style.strokeDashoffset = '0'; return; }
        const a = p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 380 + len * 1.4, delay: pass * 200, easing: 'cubic-bezier(.55,.1,.35,1)', fill: 'both' });
        a.onfinish = () => { p.style.strokeDashoffset = '0'; };
      });
    };

    const apply = (t: number) => {
      const n = words.current.length;
      const f = Math.min(1, t * 1.15) * n; // ritmo de #260
      words.current.forEach((w, i) => {
        const v = Math.max(0, Math.min(1, f - i));
        w.style.setProperty('--f', v.toFixed(2));
      });
      if (pg.current) pg.current.style.transform = `scaleY(${Math.min(1, t * 1.15).toFixed(3)})`;
      const on = f - markIdx >= 1;
      if (on !== drawn) { drawn = on; draw(on); }
    };
    apply(scrollYProgress.get());
    const off = scrollYProgress.on('change', apply);
    const ro = new ResizeObserver(() => drawn && draw(true));
    if (box.current) ro.observe(box.current);
    return () => { off(); ro.disconnect(); };
  }, [scrollYProgress, tokens]);

  return (
    <section ref={wrap} aria-label="Manifiesto" className="relative" style={{ height: '150svh' }}>
      <div className="flor-bg sticky top-0 bg-paper flex h-[100svh] items-center overflow-hidden">
        <div className="wrap grid w-full grid-cols-12 items-start gap-x-4 gap-y-8">
          <div className="col-span-12 flex items-center gap-4 lg:col-span-2 lg:flex-col lg:items-start">
            <p className="kicker"><b>02</b> · {manifiesto.kicker}</p>
            <span className="u260-pg hidden lg:mt-6 lg:block" aria-hidden="true"><i ref={pg} /></span>
          </div>
          <div ref={box} className="relative col-span-12 lg:col-span-8">
            <p className="m-0 font-display font-bold tracking-[-0.03em]" style={{ fontSize: 'clamp(30px, 4.3vw, 68px)', lineHeight: 1.1 }}>
              {tokens.map((t, i) => (
                <span key={i}>
                  {i > 0 && ' '}
                  <span ref={(el) => { if (el) words.current[i] = el; }} className={`u260-w${t.em ? ' em' : ''}`}>{t.w}</span>
                </span>
              ))}
            </p>
            <svg ref={svg} className="u392-svg" aria-hidden="true" />
          </div>
          <figure className="col-span-6 col-start-7 -mt-2 hidden sm:block lg:col-span-2 lg:col-start-11 lg:mt-24">
            <div className="aspect-[4/3] overflow-hidden rotate-[1.5deg] shadow-[0_18px_30px_-20px_var(--shadow-strong)]">
              <Img name="vesica-lapiz" alt="Vesica piscis trazada a lápiz sobre papel" sizes="(min-width:1024px) 16vw, 45vw" className="h-full w-full object-cover" />
            </div>
            <figcaption className="kicker mt-3 !normal-case !tracking-normal">{manifiesto.nota}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
