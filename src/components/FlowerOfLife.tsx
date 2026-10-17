import { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { flowerOfLife, metatronLines, startAngleFor, FRUIT_R } from '../lib/geometry';
import { compassPose } from '../lib/compass';

// La Flor de la Vida trazada con compás. Unidad r = 1, viewBox de ±3.7r.
// Intro (~5.7 s): ejes y guías en azul lápiz con anotaciones → el compás traza el círculo central,
// el primer anillo y el contenedor → la tinta repasa todo encima.
// Scroll (progress 0→1): las guías se van, 13 círculos migran al Fruto de la Vida y se trazan
// las 78 líneas que unen sus centros: el Cubo de Metatrón.

const V = 3.7;
const circ = (r: number) => `M${r} 0A${r} ${r} 0 1 1 ${-r} 0A${r} ${r} 0 1 1 ${r} 0`;
const UNIT = circ(1);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (k: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(k)); // inOutSine: mano que arranca y frena
const smooth = (k: number) => { const x = clamp(k); return x * x * (3 - 2 * x); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Entry = { el: () => Element | null; start: number; dur: number; compass?: { cx: number; cy: number; r: number; a0: number } };

export function FlowerOfLife({ progress, play, reduced, touch }: { progress: MotionValue<number>; play: boolean; reduced: boolean; touch: boolean }) {
  const circles = useMemo(flowerOfLife, []);
  const lines = useMemo(() => metatronLines().map((l) => ({ l, len: Math.hypot(l[0].x - l[1].x, l[0].y - l[1].y) })).sort((a, b) => a.len - b.len), []);
  const svg = useRef<SVGSVGElement>(null);
  const pencil = useRef<(SVGPathElement | null)[]>([]);
  const ink = useRef<(SVGPathElement | null)[]>([]);
  const lineEls = useRef<(SVGLineElement | null)[]>([]);
  const q = (s: string) => () => svg.current?.querySelector(s) ?? null;
  const [u, setU] = useState(0.01); // unidades de viewBox por px (para tipografía de anotaciones)
  const introDone = useRef(false);
  const introT = useRef(0);

  // Tamaño de texto de anotaciones constante en px.
  useEffect(() => {
    const el = svg.current!;
    const ro = new ResizeObserver(() => setU((2 * V) / Math.max(1, el.clientWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Línea de tiempo de la intro.
  const schedule = useMemo<Entry[]>(() => {
    const s: Entry[] = [];
    s.push({ el: q('[data-axis="h"]'), start: 0, dur: 0.55 });
    s.push({ el: q('[data-axis="v"]'), start: 0.15, dur: 0.55 });
    s.push({ el: q('[data-guide="radius"]'), start: 0.45, dur: 0.3 });
    // compás: centro + primer anillo
    circles.forEach((c, i) => {
      if (c.ring === 2) return;
      const start = i === 0 ? 0.35 : 1.05 + (i - 1) * 0.36;
      const dur = i === 0 ? 0.7 : 0.36;
      s.push({ el: () => pencil.current[i], start, dur, compass: { cx: c.c.x, cy: c.c.y, r: 1, a0: startAngleFor(c.c) } });
    });
    // segundo anillo en lápiz, sin compás
    circles.forEach((c, i) => { if (c.ring === 2) s.push({ el: () => pencil.current[i], start: 2.9 + (i - 7) * 0.07, dur: 0.5 }); });
    s.push({ el: q('[data-guide="arc60"]'), start: 1.5, dur: 0.35 });
    // contenedor de radio 3r con el compás bien abierto
    s.push({ el: q('[data-pencil="container"]'), start: 3.25, dur: 0.8, compass: { cx: 0, cy: 0, r: 3, a0: -Math.PI / 2 } });
    s.push({ el: q('[data-guide="dim"]'), start: 3.5, dur: 0.45 });
    // tinta encima
    circles.forEach((_, i) => s.push({ el: () => ink.current[i], start: 1.35 + i * 0.19, dur: 0.55 }));
    s.push({ el: q('[data-ink="container"]'), start: 4.9, dur: 0.75 });
    s.push({ el: q('[data-ink="outer"]'), start: 5.05, dur: 0.7 });
    return s;
  }, [circles]);
  const INTRO_END = 5.8;
  const labelsAt: [string, number][] = [['r', 0.6], ['a60', 1.7], ['vesica', 2.2], ['dim', 3.8], ['R3', 3.6]];

  const applyIntro = (t: number) => {
    const root = svg.current;
    if (!root) return;
    for (const e of schedule) {
      const el = e.el() as SVGGeometryElement | null;
      if (!el) continue;
      const k = ease((t - e.start) / e.dur);
      el.style.strokeDashoffset = String(1 - k);
    }
    labelsAt.forEach(([id, at]) => {
      const el = root.querySelector<SVGElement>(`[data-label="${id}"]`);
      if (el) el.style.opacity = String(clamp((t - at) / 0.35));
    });
    // compás
    const comp = root.querySelector<SVGGElement>('[data-compass]');
    const active = schedule.find((e) => e.compass && t >= e.start && t < e.start + e.dur);
    if (comp) {
      if (active && active.compass) {
        const { cx, cy, r, a0 } = active.compass;
        const k = ease((t - active.start) / active.dur);
        const pose = compassPose(cx, cy, r, a0 + k * Math.PI * 2, r * 1.18);
        comp.style.opacity = '1';
        const [needle, lead, handle] = Array.from(comp.querySelectorAll('line'));
        needle.setAttribute('x1', String(cx)); needle.setAttribute('y1', String(cy));
        needle.setAttribute('x2', String(pose.hx)); needle.setAttribute('y2', String(pose.hy));
        lead.setAttribute('x1', String(pose.hx)); lead.setAttribute('y1', String(pose.hy));
        lead.setAttribute('x2', String(pose.px)); lead.setAttribute('y2', String(pose.py));
        handle.setAttribute('x1', String(pose.hx)); handle.setAttribute('y1', String(pose.hy));
        handle.setAttribute('x2', String(pose.handle.x)); handle.setAttribute('y2', String(pose.handle.y));
        const [hinge, tip] = Array.from(comp.querySelectorAll('circle'));
        hinge.setAttribute('cx', String(pose.hx)); hinge.setAttribute('cy', String(pose.hy));
        tip.setAttribute('cx', String(pose.px)); tip.setAttribute('cy', String(pose.py));
      } else comp.style.opacity = '0';
    }
  };

  // Intro
  useEffect(() => {
    if (reduced) { introDone.current = true; applyIntro(99); return; }
    applyIntro(0);
    if (!play) return;
    let raf = 0;
    const t0 = performance.now() - introT.current * 1000;
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      introT.current = t;
      if (introDone.current) { applyIntro(99); return; }
      applyIntro(t);
      if (t < INTRO_END) raf = requestAnimationFrame(tick);
      else introDone.current = true;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play, reduced]);

  // Morph por scroll → Fruto de la Vida → Cubo de Metatrón
  useEffect(() => {
    const apply = (p: number) => {
      const root = svg.current;
      if (!root) return;
      if (p > 0.02 && !introDone.current) { introDone.current = true; applyIntro(99); }
      const m = smooth((p - 0.12) / 0.33);
      const guides = 1 - smooth((p - 0.04) / 0.2);
      root.querySelector<SVGGElement>('[data-layer="guides"]')!.style.opacity = String(guides);
      circles.forEach((c, i) => {
        const el = ink.current[i];
        if (!el) return;
        const a = (startAngleFor(c.c) * 180) / Math.PI;
        const to = c.fruit ?? c.c;
        const x = lerp(c.c.x, to.x, m), y = lerp(c.c.y, to.y, m);
        const r = lerp(1, c.fruit ? FRUIT_R : 0.9, m);
        el.setAttribute('transform', `translate(${x} ${y}) rotate(${a})`);
        el.setAttribute('d', circ(r));
        el.style.opacity = c.fruit ? String(lerp(1, 0.55, smooth((p - 0.55) / 0.3))) : String(clamp(1 - m * 1.4));
      });
      const L = clamp((p - 0.42) / 0.45);
      lineEls.current.forEach((el, i) => {
        if (!el) return;
        const k = smooth(L * 1.7 - (i / lines.length) * 0.7);
        el.style.strokeDashoffset = String(1 - k);
      });
      const lab = root.querySelector<SVGGElement>('[data-label="metatron"]');
      if (lab) lab.style.opacity = String(smooth((p - 0.8) / 0.12));
    };
    apply(progress.get());
    return progress.on('change', apply);
  }, [progress, circles, lines]);

  // Parallax por capas con el cursor (desktop) / rotación lenta (móvil)
  useEffect(() => {
    if (reduced) return;
    const root = svg.current!;
    const gGuides = root.querySelector<SVGGElement>('[data-layer="guides"]')!;
    const gInk = root.querySelector<SVGGElement>('[data-layer="ink-wrap"]')!;
    if (touch) return; // en táctil la rotación lenta la hace CSS sobre el contenedor (compuesta en GPU)
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, k = (2 * V) / Math.max(1, root.clientWidth);
    const onResize = () => { k = (2 * V) / Math.max(1, root.clientWidth); };
    const onMove = (e: PointerEvent) => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; };
    const tick = () => {
      const nx = x + (tx - x) * 0.06, ny = y + (ty - y) * 0.06;
      if (Math.abs(nx - x) + Math.abs(ny - y) > 0.0005) {
        x = nx; y = ny;
        gGuides.setAttribute('transform', `translate(${(x * 3 * k).toFixed(4)} ${(y * 3 * k).toFixed(4)})`);
        gInk.setAttribute('transform', `translate(${(-x * 2 * k).toFixed(4)} ${(-y * 2 * k).toFixed(4)})`);
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize);
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', onResize); };
  }, [reduced, touch]);

  const fs = 12.5 * u;
  const sw = {};
  const r60a = -Math.PI / 2, r60b = -Math.PI / 6, ar = 0.42;

  return (
    <svg ref={svg} viewBox={`${-V} ${-V} ${2 * V} ${2 * V}`} className="block h-full w-full overflow-visible" role="img"
      aria-label="Flor de la Vida trazada con compás: 19 círculos de radio r dentro de un círculo de radio 3r. Al avanzar se transforma en el Cubo de Metatrón.">
      <g data-layer="all">
        {/* Guías en azul lápiz */}
        <g data-layer="guides" fill="none" stroke="var(--pencil)" strokeWidth={1 * u}>
          <line data-axis="h" x1={-3.55} y1={0} x2={3.55} y2={0} pathLength={1} strokeDasharray="1" {...sw} />
          <line data-axis="v" x1={0} y1={-3.55} x2={0} y2={3.55} pathLength={1} strokeDasharray="1" {...sw} />
          <line data-guide="radius" x1={0} y1={0} x2={0} y2={-1} pathLength={1} strokeDasharray="1" strokeWidth={1.4 * u} />
          <path data-guide="arc60" d={`M${ar * Math.cos(r60a)} ${ar * Math.sin(r60a)}A${ar} ${ar} 0 0 1 ${ar * Math.cos(r60b)} ${ar * Math.sin(r60b)}`} pathLength={1} strokeDasharray="1" {...sw} />
          <line x1={0} y1={0} x2={Math.cos(r60b)} y2={Math.sin(r60b)} strokeDasharray={`${4 * u} ${5 * u}`} opacity={0.7} />
          {circles.map((c, i) => (
            <path key={i} ref={(el) => { pencil.current[i] = el; }} d={UNIT} pathLength={1} strokeDasharray="1" strokeDashoffset={1}
              transform={`translate(${c.c.x} ${c.c.y}) rotate(${(startAngleFor(c.c) * 180) / Math.PI})`} {...sw} />
          ))}
          <path data-pencil="container" d={circ(3)} pathLength={1} strokeDasharray="1" transform="rotate(-90)" />
          {/* cota: diámetro del contenedor */}
          <g data-guide="dim-wrap">
            <path data-guide="dim" d="M-3 3.32H3M-3 3.22V3.42M3 3.22V3.42" pathLength={1} strokeDasharray="1" {...sw} />
          </g>
          {circles.slice(1, 7).map((c, i) => (
            <path key={`x${i}`} d={`M${c.c.x - 0.05} ${c.c.y}H${c.c.x + 0.05}M${c.c.x} ${c.c.y - 0.05}V${c.c.y + 0.05}`} strokeWidth={1.2 * u} />
          ))}
          <g fill="var(--pencil-solid)" stroke="none" style={{ fontFamily: 'var(--font-mono)' }} fontSize={fs}>
            <text data-label="r" x={-0.08} y={-0.62} textAnchor="end" opacity={0}>r = 1</text>
            <text data-label="a60" x={0.36} y={-0.56} opacity={0}>60°</text>
            <g data-label="vesica" opacity={0}>
              <path d="M0.12 -0.55L1.3 -2.62H2.75" fill="none" stroke="var(--pencil)" strokeWidth={u} />
              <text x={1.35} y={-2.68}>vesica piscis</text>
            </g>
            <text data-label="dim" x={0} y={3.32} dy={-0.08} textAnchor="middle" opacity={0}>Ø 6r</text>
            <g data-label="R3" opacity={0}>
              <path d="M0 0L-2.121 -2.121" fill="none" stroke="var(--pencil)" strokeWidth={u} strokeDasharray={`${4 * u} ${5 * u}`} />
              <text x={-2.05} y={-2.2} textAnchor="end">R = 3r</text>
            </g>
          </g>
        </g>

        {/* Tinta */}
        <g data-layer="ink-wrap">
          <g fill="none" stroke="var(--ink)" strokeWidth={1.25 * u} strokeLinecap="round">
            {circles.map((c, i) => (
              <path key={i} ref={(el) => { ink.current[i] = el; }} d={UNIT} pathLength={1} strokeDasharray="1" strokeDashoffset={1}
                transform={`translate(${c.c.x} ${c.c.y}) rotate(${(startAngleFor(c.c) * 180) / Math.PI})`} {...sw} />
            ))}
            <path data-ink="container" d={circ(3)} pathLength={1} strokeDasharray="1" strokeDashoffset={1} transform="rotate(-90)" strokeWidth={1.5 * u} />
            <path data-ink="outer" d={circ(3.09)} pathLength={1} strokeDasharray="1" strokeDashoffset={1} transform="rotate(90)" strokeWidth={0.8 * u} />
            {lines.map(({ l }, i) => (
              <line key={`m${i}`} ref={(el) => { lineEls.current[i] = el; }} x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y}
                pathLength={1} strokeDasharray="1" strokeDashoffset={1} strokeWidth={1 * u} />
            ))}
          </g>
          <g data-label="metatron" opacity={0} fill="var(--ink-2)" style={{ fontFamily: 'var(--font-mono)' }} fontSize={fs}>
            <text x={0} y={3.62} textAnchor="middle">cubo de metatrón · 13 centros · 78 líneas</text>
          </g>
        </g>

        {/* Compás */}
        <g data-compass opacity={0} stroke="var(--ink)" strokeLinecap="round" fill="none">
          <line strokeWidth={1.4 * u} />
          <line strokeWidth={1.4 * u} />
          <line strokeWidth={4.5 * u} />
          <circle r={4.5 * u} fill="var(--paper)" strokeWidth={1.4 * u} />
          <circle r={4 * u} fill="var(--ochre)" stroke="none" />
        </g>
      </g>
    </svg>
  );
}
