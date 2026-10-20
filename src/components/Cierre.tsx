// Lucian UX/UI Prompt #341 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#341
// Lucian UX/UI Prompt #044 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#044
// Lucian UX/UI Prompt #237 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#237
// Cierre: red de constelación muy sutil que se conecta al cursor (#341), FAQ acordeón (#044) y título con máscara (#237).
import { useEffect, useId, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { rgba } from '../lib/tokens';
import { cierre, faq, clasesYoutube, canalYoutube } from '../content';
import { ArrowUpRight, Play } from 'lucide-react';
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
          cx.strokeStyle = rgba('--c-paper', (1 - d / PL) * 0.5); cx.lineWidth = 1.2;
          cx.beginPath(); cx.moveTo(ptr.x, ptr.y); cx.lineTo(p.x, p.y); cx.stroke();
        }
      }
      cx.fillStyle = rgba('--c-paper', 0.4);
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
            <span className="u044-t">{f.q}</span><span className="u044-pm" aria-hidden="true" />
          </button>
          <div className="u044-body" role="region" id={`${uid}-a${i}`} aria-labelledby={`${uid}-q${i}`}>
            <div><div className="u044-a"><p>{f.a}</p></div></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Saca el ID de un link de YouTube (watch?v=, youtu.be/, /live/, /shorts/, /embed/).
const ytId = (url: string) => url.match(/(?:v=|youtu\.be\/|\/live\/|\/shorts\/|\/embed\/)([\w-]{11})/)?.[1] ?? null;

function VideoLite({ id, titulo }: { id: string; titulo: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-[18px] bg-ink">
      {on ? (
        <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
      ) : (
        <button type="button" onClick={() => setOn(true)} className="group absolute inset-0 h-full w-full" aria-label={`Reproducir: ${titulo}`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-lg transition-transform group-hover:scale-110"><Play size={26} aria-hidden /></span>
        </button>
      )}
    </div>
  );
}

// Clases gratuitas del canal de YouTube. Los videos se cargan en content.ts (clasesYoutube).
function ClasesYoutube() {
  const vids = clasesYoutube.map((v) => ({ ...v, id: ytId(v.url) })).filter((v): v is { url: string; titulo: string; id: string } => !!v.id);
  const [cur, setCur] = useState(0);
  const v = vids[cur];
  return (
    <div>
      <p className="kicker mb-5">Clases gratuitas en YouTube</p>
      {v ? (
        <>
          <VideoLite key={v.id} id={v.id} titulo={v.titulo} />
          <p className="mt-3 text-[17px] font-medium">{v.titulo}</p>
          {vids.length > 1 && (
            <ul className="mt-4 grid grid-cols-3 gap-3">
              {vids.map((x, i) => (
                <li key={x.id}>
                  <button type="button" onClick={() => setCur(i)} aria-label={x.titulo} aria-current={i === cur}
                    className={`block aspect-video w-full overflow-hidden rounded-[10px] ring-offset-2 ${i === cur ? 'ring-2 ring-[var(--accent)]' : 'opacity-70 hover:opacity-100'}`}>
                    <img src={`https://i.ytimg.com/vi/${x.id}/mqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="grid aspect-video place-items-center rounded-[18px] p-6 text-center shadow-[inset_0_0_0_1px_var(--line-2)]">
          <p className="text-[17px] text-ink-2">Mirá las clases gratuitas en nuestro canal.</p>
        </div>
      )}
      <a href={canalYoutube} target="_blank" rel="noopener" className="btn btn-ghost mt-5">Ver el canal <ArrowUpRight size={18} aria-hidden /></a>
    </div>
  );
}

export function Cierre() {
  const h = useRef<HTMLHeadingElement>(null);
  const inView = useInView(h, { once: true, margin: '-20% 0px' });
  return (
    <section aria-labelledby="cierre-title" className="sec-azul relative overflow-hidden">
      <Constelacion />
      <div className="wrap relative grid grid-cols-12 gap-x-4 gap-y-14 py-[16svh]">
        <div className="col-span-12 lg:col-span-7">
          <p className="kicker">{cierre.kicker}</p>
          <h2 ref={h} id="cierre-title" className={`u237 display mt-5 ${inView ? 'is-in' : ''}`} style={{ fontSize: 'clamp(46px, 7.4vw, 128px)', lineHeight: 0.9 }}>
            {cierre.titulo.map((l, i) => <span key={l} className="u237-ln"><span className="u237-in" style={{ ['--i' as string]: i }}>{l}</span></span>)}
          </h2>
          <p className="mt-6 text-[21px] text-ink-2">{cierre.texto}</p>
          <a href="#clase" onClick={(e) => { e.preventDefault(); scrollToId('clase'); }} className="btn btn-primary mt-8">{cierre.cta}</a>
        </div>
        <div className="col-span-12 lg:col-span-5 lg:pt-16">
          <ClasesYoutube />
        </div>
      </div>
    </section>
  );
}

// Preguntas frecuentes: al final de la home, solas. Título a la izquierda, preguntas a la derecha.
export function PreguntasFrecuentes() {
  return (
    <section aria-labelledby="faq-title" className="wrap border-t hairline py-[14svh]">
      <div className="grid grid-cols-12 gap-x-4 gap-y-8">
        <h2 id="faq-title" className="h-section col-span-12 lg:col-span-4" style={{ fontSize: 'clamp(29px, calc(6.4vw - 11px), 93px)' }}>Preguntas frecuentes</h2>
        <div className="col-span-12 lg:col-span-8"><Faq /></div>
      </div>
    </section>
  );
}
