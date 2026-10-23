// Elementos de Lucian UX/UI portados a React para la página de Experiencias (23/10/2026).
// Lucian UX/UI Prompt #389 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#389
// Lucian UX/UI Prompt #213 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#213
// Lucian UX/UI Prompt #394 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#394
// Lucian UX/UI Prompt #014 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#014
// Estilos en src/styles/lucian.css (clases .u389, .u213, .u394, .u014).
import { useEffect, useId, useRef, useState } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* #389 · Paneles de fotos que se abren */
export function PanelesFotos({ fotos }: { fotos: { src: string; titulo: string; texto: string }[] }) {
  const [cur, setCur] = useState(0);
  const refs = useRef<HTMLButtonElement[]>([]);
  return (
    <div className="ux u389" role="group" aria-label="Fotos de Experiencias anteriores">
      {fotos.map((f, i) => (
        <button key={f.src} ref={(el) => { if (el) refs.current[i] = el; }} type="button" aria-expanded={cur === i}
          className={`u389-p ${cur === i ? 'on' : ''}`}
          onPointerEnter={() => setCur(i)} onFocus={() => setCur(i)} onClick={() => setCur(i)}
          onKeyDown={(e) => {
            const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
            if (!d) return;
            e.preventDefault();
            const n = Math.max(0, Math.min(fotos.length - 1, cur + d));
            setCur(n); refs.current[n]?.focus();
          }}>
          <img src={f.src} alt="" loading={i < 2 ? 'eager' : 'lazy'} />
          <span className="u389-lb">{f.titulo}</span>
          <span className="u389-ds"><span>{f.texto}</span></span>
        </button>
      ))}
    </div>
  );
}

/* #213 · Pestañas que avanzan solas */
export function PestanasVivir({ items }: { items: { t: string; x: string; img: string; icono: React.ReactNode }[] }) {
  const DUR = 4200;
  const [cur, setCur] = useState(0);
  const [play, setPlay] = useState(-1);
  const root = useRef<HTMLDivElement>(null);
  const bars = useRef<HTMLElement[]>([]);
  const tabs = useRef<HTMLButtonElement[]>([]);
  const st = useRef({ acc: 0, last: 0, hold: false, vis: true, raf: 0, cur: 0 });
  const uid = useId();

  useEffect(() => { // relanza la escena de la pestaña activa
    setPlay(-1);
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setPlay(cur)));
    st.current.cur = cur; st.current.acc = 0;
    bars.current.forEach((b, k) => { if (b) b.style.transform = `scaleX(${k === cur && reduced() ? 1 : 0})`; });
    return () => cancelAnimationFrame(r);
  }, [cur]);

  useEffect(() => {
    if (reduced()) return;
    const s = st.current;
    const tick = (now: number) => {
      s.raf = 0;
      if (!s.hold && s.vis) s.acc += Math.min(64, now - s.last);
      s.last = now;
      const p = Math.min(1, s.acc / DUR);
      const b = bars.current[s.cur]; if (b) b.style.transform = `scaleX(${p.toFixed(3)})`;
      if (p >= 1) { s.acc = 0; setCur((c) => (c + 1) % items.length); }
      if (s.vis) s.raf = requestAnimationFrame(tick);
    };
    const run = () => { if (!s.raf) { s.last = performance.now(); s.raf = requestAnimationFrame(tick); } };
    const io = new IntersectionObserver((es) => { s.vis = es[0].isIntersecting; if (s.vis) run(); });
    if (root.current) io.observe(root.current);
    run();
    return () => { io.disconnect(); if (s.raf) cancelAnimationFrame(s.raf); s.raf = 0; };
  }, [items.length]);

  const hold = (v: boolean) => { st.current.hold = v; };
  return (
    <div ref={root} className="ux u213" onFocus={() => hold(true)} onBlur={() => hold(false)}>
      <div className="u213-tl" role="tablist" aria-label="Lo que vas a vivir">
        {items.map((it, i) => (
          <button key={it.t} ref={(el) => { if (el) tabs.current[i] = el; }} type="button" role="tab" id={`${uid}t${i}`} aria-controls={`${uid}p${i}`}
            aria-selected={cur === i} tabIndex={cur === i ? 0 : -1} className={`u213-tb ${cur === i ? 'is-on' : ''}`}
            onClick={() => setCur(i)}
            onKeyDown={(e) => {
              const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
              if (d) { e.preventDefault(); const n = (i + d + items.length) % items.length; setCur(n); tabs.current[n]?.focus(); }
            }}>
            {it.icono}{it.t}<i><b ref={(el) => { if (el) bars.current[i] = el; }} /></i>
          </button>
        ))}
      </div>
      <div className="u213-pv" onPointerEnter={() => hold(true)} onPointerLeave={() => hold(false)}>
        {items.map((it, i) => (
          <div key={it.t} id={`${uid}p${i}`} role="tabpanel" aria-labelledby={`${uid}t${i}`} aria-hidden={cur !== i}
            className={`u213-pn ${cur === i ? 'is-on' : ''} ${play === i ? 'is-play' : ''}`}>
            <div className="u213-ph"><img src={it.img} alt="" loading="lazy" /></div>
            <div className="u213-tx">
              {it.icono}
              <h3>{it.t}</h3>
              <p>{it.x}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* #394 · Filas de texto que corren con el scroll */
export function FilasMarquee({ filas, etiqueta }: { filas: string[]; etiqueta: string }) {
  const root = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    const el = root.current; if (!el) return;
    const rm = reduced();
    const rows = rowRefs.current.map((r, i) => ({ el: r, x: -Math.random() * 200, dir: i % 2 ? 1 : -1, w: 0 }));
    let lastY = window.scrollY, boost = 0, sign = 1, last = 0, vis = true, skew = 0, raf = 0;
    const onScroll = () => {
      const dy = window.scrollY - lastY; lastY = window.scrollY;
      boost = Math.min(40, boost + Math.abs(dy) * 0.25);
      if (dy) sign = dy > 0 ? 1 : -1;
    };
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.max(0, Math.min(50, now - (last || now))) / 16.7; last = now;
      boost *= Math.pow(0.92, dt);
      skew += ((boost > 1 ? sign * Math.min(8, boost * 0.35) : 0) - skew) * 0.15 * dt;
      rows.forEach((r) => {
        if (!r.w) r.w = (r.el.firstChild as HTMLElement).offsetWidth;
        r.x += r.dir * sign * (0.5 + boost) * dt;
        if (r.x < -r.w) r.x += r.w;
        if (r.x > 0) r.x -= r.w;
        r.el.style.transform = `translateX(${r.x.toFixed(1)}px) skewX(${(-skew * r.dir).toFixed(2)}deg)`;
      });
      if (vis && !rm) raf = requestAnimationFrame(frame);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver((en) => { const was = vis; vis = en[0].isIntersecting; if (vis && !was && !raf) raf = requestAnimationFrame(frame); });
    io.observe(el);
    raf = requestAnimationFrame(frame);
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={root} className="ux u394" role="img" aria-label={etiqueta}>
      <div className="u394-st" aria-hidden="true">
        {filas.map((t, i) => (
          <div key={t} ref={(el) => { if (el) rowRefs.current[i] = el; }} className="u394-row">
            {[0, 1, 2, 3, 4, 5].map((k) => <span key={k}>{t}</span>)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* #014 · Checklist con anillo de progreso */
export function ChecklistAntes({ titulo, sub, listo, items }: { titulo: string; sub: string; listo: string; items: { t: string; tag: string }[] }) {
  const [hechos, setHechos] = useState<boolean[]>(() => items.map(() => false));
  const n = hechos.filter(Boolean).length;
  const all = n === items.length;
  return (
    <div className={`ux u014 ${all ? 'is-all' : ''}`} style={{ ['--p' as string]: (n / items.length).toFixed(3) }}>
      <div className="u014-head">
        <div>
          <b>{titulo}</b>
          <span className="u014-sub" aria-live="polite"><span>{sub}</span><span>{listo}</span></span>
        </div>
        <div className="u014-ring" aria-hidden="true">
          <svg viewBox="0 0 48 48"><circle className="bg" cx="24" cy="24" r="20" /><circle className="fg" cx="24" cy="24" r="20" /></svg>
          <span className="u014-num">{n}/{items.length}</span>
          <span className="u014-done"><svg viewBox="0 0 16 16"><path d="M3.5 8.4l3 3 6-6.4" /></svg></span>
        </div>
      </div>
      <ul className="u014-list">
        {items.map((it, i) => (
          <li key={it.t}>
            <label className="u014-row">
              <input className="u014-in" type="checkbox" checked={hechos[i]} onChange={() => setHechos((h) => h.map((v, k) => (k === i ? !v : v)))} />
              <span className="u014-box" aria-hidden="true"><svg viewBox="0 0 26 26"><path d="M7.5 13.5l3.8 3.8 7.4-8" /></svg></span>
              <span className="u014-t">{it.t}</span>
              <span className="u014-tag">{it.tag}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
