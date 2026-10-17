// Lucian UX/UI Prompt #341 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#341
// Lucian UX/UI Prompt #044 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#044
// Lucian UX/UI Prompt #237 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#237
// Cierre: red de constelación muy sutil que se conecta al cursor (#341), FAQ acordeón (#044) y título con máscara (#237).
import { useEffect, useId, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { rgba } from '../lib/tokens';
import { cierre, faq } from '../content';
import { scrollToId } from '../lib/scroll';

function Constelacion() {
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = cv.current!;
    const cx = canvas.getContext('2d')!;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0, LINK = 96;
    const PL = 160;
    type P = { x: number; y: number; vx: number; vy: number };
    let P: P[] = [];
    let ptr: { x: number; y: number } | null = null;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(110, (W * H) / 14000));
      LINK = W < 640 ? 74 : 96;
      P = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 16, vy: (Math.random() - 0.5) * 16 }));
      draw();
    };
    function draw() {
      cx.clearRect(0, 0, W, H);
      for (let a = 0; a < P.length; a++) for (let b = a + 1; b < P.length; b++) {
        const dx = P[a].x - P[b].x, dy = P[a].y - P[b].y;
        if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue;
        const d = Math.hypot(dx, dy);
        if (d > LINK) continue;
        cx.strokeStyle = rgba('--c-accent', (1 - d / LINK) * 0.28); cx.lineWidth = 1;
        cx.beginPath(); cx.moveTo(P[a].x, P[a].y); cx.lineTo(P[b].x, P[b].y); cx.stroke();
      }
      if (ptr) {
        for (const p of P) {
          const d = Math.hypot(p.x - ptr.x, p.y - ptr.y);
          if (d > PL) continue;
          cx.strokeStyle = rgba('--c-ink', (1 - d / PL) * 0.5); cx.lineWidth = 1.2;
          cx.beginPath(); cx.moveTo(ptr.x, ptr.y); cx.lineTo(p.x, p.y); cx.stroke();
        }
      }
      cx.fillStyle = rgba('--c-ink', 0.32);
      for (const p of P) { cx.beginPath(); cx.arc(p.x, p.y, 1.5, 0, 6.2832); cx.fill(); }
    }
    let vis = false, raf = 0, last = 0;
    const frame = (now: number) => {
      raf = 0;
      if (!vis) return;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
      for (const p of P) {
        if (ptr) { const dx = ptr.x - p.x, dy = ptr.y - p.y, d = Math.hypot(dx, dy); if (d < PL && d > 12) { p.vx += (dx / d) * 22 * dt; p.vy += (dy / d) * 22 * dt; } }
        const sp = Math.hypot(p.vx, p.vy); if (sp > 24) { p.vx *= 1 - 1.5 * dt; p.vy *= 1 - 1.5 * dt; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < 0 || p.x > W) { p.vx *= -1; p.x = Math.max(0, Math.min(W, p.x)); }
        if (p.y < 0 || p.y > H) { p.vy *= -1; p.y = Math.max(0, Math.min(H, p.y)); }
      }
      draw();
      raf = requestAnimationFrame(frame);
    };
    const run = () => { if (rm) { draw(); return; } if (!raf && vis) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; run(); });
    io.observe(canvas);
    const sec = canvas.parentElement!;
    const move = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); ptr = { x: e.clientX - r.left, y: e.clientY - r.top }; if (rm) draw(); };
    const leave = () => { ptr = null; if (rm) draw(); };
    sec.addEventListener('pointermove', move); sec.addEventListener('pointerleave', leave);
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    return () => { io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); sec.removeEventListener('pointermove', move); sec.removeEventListener('pointerleave', leave); };
  }, []);
  return <canvas ref={cv} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}

function Faq() {
  const [open, setOpen] = useState(0);
  const uid = useId();
  const qs = useRef<HTMLButtonElement[]>([]);
  return (
    <div className="ux u044 flex flex-col gap-3">
      {faq.map((f, i) => (
        <div key={f.q} className={`u044-it ${open === i ? 'open' : ''}`}>
          <button ref={(el) => { if (el) qs.current[i] = el; }} id={`${uid}-q${i}`} className="u044-q" type="button" aria-expanded={open === i} aria-controls={`${uid}-a${i}`}
            onClick={() => setOpen(open === i ? -1 : i)}
            onKeyDown={(e) => {
              const n = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? faq.length - 1 : -2;
              if (n === -2) return;
              e.preventDefault();
              qs.current[(n + faq.length) % faq.length]?.focus();
            }}>
            <span className="u044-n">0{i + 1}</span><span className="u044-t">{f.q}</span><span className="u044-pm" aria-hidden="true" />
          </button>
          <div className="u044-body" role="region" id={`${uid}-a${i}`} aria-labelledby={`${uid}-q${i}`}>
            <div><div className="u044-a"><p>{f.a}</p></div></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Cierre() {
  const h = useRef<HTMLHeadingElement>(null);
  const inView = useInView(h, { once: true, margin: '-20% 0px' });
  return (
    <section aria-labelledby="cierre-title" className="relative overflow-hidden bg-paper">
      <Constelacion />
      <div className="wrap relative grid grid-cols-12 gap-x-4 gap-y-14 py-[16svh]">
        <div className="col-span-12 lg:col-span-7">
          <p className="kicker"><b>09</b> · {cierre.kicker}</p>
          <h2 ref={h} id="cierre-title" className={`u237 display mt-5 ${inView ? 'is-in' : ''}`} style={{ fontSize: 'clamp(46px, 7.4vw, 128px)', lineHeight: 0.9 }}>
            {cierre.titulo.map((l, i) => <span key={l} className="u237-ln"><span className="u237-in" style={{ ['--i' as string]: i }}>{l}</span></span>)}
          </h2>
          <p className="mt-6 text-[21px] text-ink-2">{cierre.texto}</p>
          <a href="#clase" onClick={(e) => { e.preventDefault(); scrollToId('clase'); }} className="btn btn-primary mt-8">{cierre.cta}</a>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:pt-16">
          <p className="kicker mb-5">Preguntas frecuentes</p>
          <Faq />
        </div>
      </div>
    </section>
  );
}
