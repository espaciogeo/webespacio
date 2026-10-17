// Lucian UX/UI Prompt #241 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#241
// Lucian UX/UI Prompt #390 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#390
// Scroll vertical que mueve un track horizontal (#241) + número de capítulo que gira (#390).
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { pilares, pilaresIntro } from '../content';
import { Img } from '../lib/Img';

const PHI = 1.618;

// Planta con proporción áurea: guías en azul, trazo final en tinta.
function PlantaAurea() {
  const W = 400, H = W / PHI; // rectángulo áureo
  const sq: { x: number; y: number; s: number; a: string }[] = [];
  let x = 0, y = 0, w = W, h = H;
  for (let i = 0; i < 7; i++) {
    const d = i % 4;
    const s = Math.min(w, h);
    if (d === 0) { sq.push({ x, y, s, a: `M${x} ${y + s}A${s} ${s} 0 0 1 ${x + s} ${y}` }); x += s; w -= s; }
    else if (d === 1) { sq.push({ x: x + w - s, y, s, a: `M${x} ${y}A${s} ${s} 0 0 1 ${x + s} ${y + s}` }); y += s; h -= s; }
    else if (d === 2) { sq.push({ x: x + w - s, y: y + h - s, s, a: `M${x + w} ${y}A${s} ${s} 0 0 1 ${x + w - s} ${y + s}` }); w -= s; }
    else { sq.push({ x, y: y + h - s, s, a: `M${x + s} ${y + h}A${s} ${s} 0 0 1 ${x} ${y + h - s}` }); h -= s; }
  }
  return (
    <svg viewBox={`-30 -40 ${W + 60} ${H + 90}`} className="h-full w-full" role="img" aria-label="Planta de un espacio en proporción áurea con su espiral">
      <g fill="none" stroke="var(--pencil)" strokeWidth="1">
        {sq.map((q, i) => <rect key={i} x={q.x} y={q.y} width={q.s} height={q.s} />)}
        <path d={`M0 ${H + 22}H${W}M0 ${H + 16}V${H + 28}M${W} ${H + 16}V${H + 28}`} />
        <path d={`M${W + 18} 0V${H}M${W + 12} 0H${W + 24}M${W + 12} ${H}H${W + 24}`} />
      </g>
      <g fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round">
        <rect x="0" y="0" width={W} height={H} strokeWidth="2.5" />
        <path d={`M${H} 0V${H}`} />
        {sq.map((q, i) => <path key={i} d={q.a} strokeWidth="1.6" />)}
              </g>
      <g fill="var(--pencil-solid)" style={{ fontFamily: 'var(--font-mono)' }} fontSize="13">
        <text x={W / 2} y={H + 40} textAnchor="middle">a + b</text>
        <text x={W + 30} y={H / 2} dominantBaseline="middle">a</text>
        <text x="0" y="-16">planta · φ = 1,618</text>
      </g>
    </svg>
  );
}

export function Pilares() {
  const wrap = useRef<HTMLDivElement>(null);
  const vp = useRef<HTMLDivElement>(null);
  const tr = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const panels = useRef<HTMLElement[]>([]);
  const [cur, setCur] = useState(0);
  const [stripH, setStripH] = useState(88);

  useEffect(() => {
    const C = 2 * Math.PI * 16;
    let dist = 0, raf = 0, last = -1;
    const SPEED = 1.8; // el slider horizontal avanza 1.8 px por cada px de scroll
    const n = pilares.length;
    const measure = () => {
      if (!tr.current || !vp.current || !wrap.current) return;
      dist = Math.max(0, tr.current.scrollWidth - vp.current.clientWidth);
      wrap.current.style.height = `${window.innerHeight + dist / SPEED}px`;
      setStripH(window.innerWidth >= 1024 ? 88 : 44);
      draw();
    };
    const draw = () => {
      raf = 0;
      if (!wrap.current || !tr.current) return;
      const y = Math.min(dist, Math.max(0, -wrap.current.getBoundingClientRect().top * SPEED));
      const p = dist ? y / dist : 0;
      tr.current.style.transform = `translate3d(${(-y).toFixed(1)}px,0,0)`;
      panels.current.forEach((el) => {
        const f = (el.offsetLeft - y) / (el.offsetWidth || 1);
        const num = el.querySelector<HTMLElement>('.u241-n');
        if (num) num.style.transform = `translateX(${(f * 70).toFixed(1)}px)`;
      });
      if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(3)})`;
      // #390: el número rueda en el último cuarto de cada capítulo
      const f = p * (n - 1);
      const i = Math.min(n - 1, Math.floor(f)), inCh = f - i;
      const roll = Math.max(0, Math.min(n - 1, i + Math.max(0, inCh - 0.75) / 0.25));
      if (strip.current) strip.current.style.transform = `translateY(${(-roll * (strip.current.firstElementChild as HTMLElement).offsetHeight).toFixed(1)}px)`;
      if (ring.current) { ring.current.style.strokeDasharray = String(C); ring.current.style.strokeDashoffset = (C * (1 - (i === n - 1 ? 1 : Math.min(1, inCh)))).toFixed(1); }
      const c = Math.round(p * (n - 1));
      if (c !== last) { last = c; setCur(c); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(draw); };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    const t = window.setTimeout(measure, 600); // tras cargar fuentes/imágenes
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', measure); cancelAnimationFrame(raf); clearTimeout(t); };
  }, []);

  return (
    <section ref={wrap} aria-labelledby="pilares-title" className="relative" style={{ height: '400vh' }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pb-6 pt-20 lg:pb-10 lg:pt-28">
        <div className="wrap flex w-full items-end justify-between gap-6">
          <div>
            <p className="kicker"><b>03</b> · {pilaresIntro.kicker}</p>
            <h2 id="pilares-title" className="h-section mt-2 lg:mt-3" style={{ fontSize: 'clamp(28px, 4.6vw, 76px)' }}>{pilaresIntro.titulo}</h2>
          </div>
          {/* #390 */}
          <div className="flex shrink-0 items-center gap-3" aria-hidden="true">
            <svg className="u390-g hidden h-9 w-9 sm:block lg:h-11 lg:w-11" viewBox="0 0 40 40"><circle className="t" cx="20" cy="20" r="16" /><circle ref={ring} className="v" cx="20" cy="20" r="16" /></svg>
            <div className="u390-num" style={{ width: stripH * 1.25, height: stripH }}>
              <div ref={strip} className="u390-strip">
                {pilares.map((p) => <span key={p.n} style={{ height: stripH, lineHeight: `${stripH}px`, fontSize: stripH * 0.86 }}>{p.n}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div ref={vp} className="mt-5 min-h-0 flex-1 overflow-visible pl-[var(--gutter)] lg:mt-8">
          <div ref={tr} className="u241-tr h-full pr-[var(--gutter)]">
            {pilares.map((p, i) => (
              <article key={p.n} ref={(el) => { if (el) panels.current[i] = el; }}
                className="relative flex h-full w-[86vw] flex-none flex-col overflow-hidden rounded-[22px] border hairline bg-paper sm:w-[74vw] lg:w-[min(62vw,1080px)] lg:flex-row"
                aria-label={`${p.n}. ${p.titulo}`}>
                <div className="relative flex min-h-0 flex-col p-5 sm:p-7 lg:w-[52%] lg:p-10">
                  <span className="u241-n mono pointer-events-none absolute -bottom-6 right-2 select-none text-[34vw] leading-none text-ink/[0.06] lg:-bottom-10 lg:text-[15vw]" aria-hidden="true">{p.n}</span>
                  <p className="kicker"><b>{p.n}</b> · {p.nota}</p>
                  <h3 className="mt-2 font-bold tracking-[-0.04em] lg:mt-auto" style={{ fontSize: 'clamp(28px, 3vw, 50px)', lineHeight: 1 }}>{p.titulo}</h3>
                  <p className="relative mt-3 max-w-[42ch] text-[17px] leading-relaxed text-ink-2 lg:mt-5 lg:text-[19px]">{p.texto}</p>
                  <a href={p.href} className="link-arrow relative mt-2 self-start text-[17px] lg:mt-6">
                    Leer sobre {p.titulo.toLowerCase()} <ArrowRight size={18} aria-hidden />
                  </a>
                </div>
                <div className="relative min-h-0 flex-1 overflow-hidden border-t hairline lg:border-l lg:border-t-0">
                  {p.img ? (
                    <Img name={p.img} alt="" sizes="(min-width:1024px) 30vw, 86vw" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0"><div className="absolute inset-5 lg:inset-8"><PlantaAurea /></div></div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="wrap mt-4 flex w-full items-center gap-4 lg:mt-6" aria-hidden="true">
          <div className="u241-bar"><i ref={bar} /></div>
          <div className="u241-dots">{pilares.map((p, i) => <i key={p.n} className={i === cur ? 'on' : ''} />)}</div>
        </div>
      </div>
    </section>
  );
}
