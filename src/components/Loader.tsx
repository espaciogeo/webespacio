// Lucian UX/UI Prompt #256 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#256
// Adaptado: el contador sube mientras un compás traza una circunferencia; al 100 % traza la segunda
// (vesica piscis) y el papel se abre en cortina de dos paneles cortando por el eje de la vesica.
import { useEffect, useRef, useState } from 'react';
import { setReady } from '../lib/ready';
import { lockScroll } from '../lib/scroll';
import { compassPose } from '../lib/compass';

const R = 15; // radio en unidades del viewBox
const A = { x: -R / 2, y: 0 }; // primer centro
const B = { x: R / 2, y: 0 }; // segundo centro (sobre la primera circunferencia)
const C = 2 * Math.PI * R;

function shouldSkip() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  try { return sessionStorage.getItem('egs-loader') === '1'; } catch { return false; }
}

function Drawing({ p1, p2 }: { p1: number; p2: number }) {
  // Compás activo: primero sobre A (0→1), después sobre B.
  const onB = p1 >= 1;
  const t = onB ? p2 : p1;
  const c = onB ? B : A;
  const a0 = onB ? Math.PI : 0; // A arranca en B; B arranca en A (cada uno pasa por el centro del otro)
  const pose = compassPose(c.x, c.y, R, a0 + t * Math.PI * 2, R * 1.15);
  const showCompass = t > 0 && t < 1;
  return (
    <svg viewBox="-50 -32 100 64" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g stroke="var(--pencil-solid)" strokeOpacity={0.6} fill="none" vectorEffect="non-scaling-stroke">
        <line x1={-46} y1={0} x2={46} y2={0} strokeWidth={0.12} />
        <line x1={0} y1={-28} x2={0} y2={28} strokeWidth={0.12} strokeDasharray="0.8 0.8" opacity={p2 > 0 ? 1 : 0} />
        <line x1={A.x} y1={A.y} x2={A.x + R * Math.cos(-0.9)} y2={A.y + R * Math.sin(-0.9)} strokeWidth={0.14} opacity={p1 > 0.15 ? 1 : 0} />
      </g>
      <g fill="var(--pencil-solid)" fillOpacity={0.85} style={{ fontFamily: 'var(--font-mono)' }} fontSize={1.7}>
        <text x={A.x + 3.4} y={A.y - 6.8} opacity={p1 > 0.15 ? 1 : 0}>r</text>
        <text x={A.x - 1} y={A.y + 3.2}>A</text>
        <text x={B.x + 0.6} y={B.y + 3.2} opacity={p1 > 0.98 ? 1 : 0}>B</text>
        <text x={1.2} y={-25} opacity={p2 > 0.6 ? 1 : 0}>vesica piscis</text>
      </g>
      <circle cx={A.x} cy={A.y} r={0.45} fill="var(--ink)" />
      {p1 > 0.98 && <circle cx={B.x} cy={B.y} r={0.45} fill="var(--ink)" />}
      <g fill="none" stroke="var(--ink)" strokeWidth={0.22} strokeLinecap="round">
        <circle cx={A.x} cy={A.y} r={R} strokeDasharray={C} strokeDashoffset={C * (1 - p1)} transform={`rotate(0 ${A.x} ${A.y})`} />
        <circle cx={B.x} cy={B.y} r={R} strokeDasharray={C} strokeDashoffset={C * (1 - p2)} transform={`rotate(180 ${B.x} ${B.y})`} />
      </g>
      {showCompass && (
        <g stroke="var(--ink)" strokeWidth={0.2} strokeLinecap="round" fill="none">
          <line x1={c.x} y1={c.y} x2={pose.hx} y2={pose.hy} />
          <line x1={pose.hx} y1={pose.hy} x2={pose.px} y2={pose.py} />
          <line x1={pose.hx} y1={pose.hy} x2={pose.handle.x} y2={pose.handle.y} strokeWidth={0.5} />
          <circle cx={pose.hx} cy={pose.hy} r={0.55} fill="var(--paper)" />
          <circle cx={pose.px} cy={pose.py} r={0.5} fill="var(--ochre)" stroke="none" />
        </g>
      )}
    </svg>
  );
}

export function Loader() {
  const [skip] = useState(shouldSkip);
  const [pct, setPct] = useState(0);
  const [p2, setP2] = useState(0);
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(skip);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (skip) { setReady(); return; }
    lockScroll(true);
    let fontsReady = false;
    document.fonts?.ready.then(() => { fontsReady = true; });
    let v = 0, t = 0, raf = 0, alive = true;
    const timers: number[] = [];
    const step = () => {
      if (!alive) return;
      // ritmo del #256: pasos irregulares con pequeñas dudas
      v = Math.min(100, v + (Math.random() < 0.18 ? 0 : 2 + Math.floor(Math.random() * (v > 80 ? 4 : 9))));
      if (!fontsReady && v > 92) v = 92;
      setPct(v);
      if (v < 100) { t = window.setTimeout(step, Math.random() < 0.12 ? 260 : 45); return; }
      // segunda circunferencia → vesica
      const t0 = performance.now(), D = 750;
      const draw = (now: number) => {
        const k = Math.min(1, (now - t0) / D);
        setP2(1 - Math.pow(1 - k, 2.2));
        if (k < 1) raf = requestAnimationFrame(draw);
        else timers.push(window.setTimeout(() => {
          setOpen(true); setReady(); lockScroll(false);
          try { sessionStorage.setItem('egs-loader', '1'); } catch { /* sin storage */ }
          timers.push(window.setTimeout(() => setGone(true), 1300));
        }, 300));
      };
      raf = requestAnimationFrame(draw);
    };
    t = window.setTimeout(step, 250);
    return () => { alive = false; clearTimeout(t); cancelAnimationFrame(raf); timers.forEach(clearTimeout); lockScroll(false); };
  }, [skip]);

  if (gone) return null;
  const p1 = pct / 100;
  return (
    <div ref={root} className={`u256 ${open ? 'is-open' : ''}`} role="progressbar" aria-label="Cargando" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
      <div className="u256-hf u256-a"><Drawing p1={p1} p2={p2} /></div>
      <div className="u256-hf u256-b"><Drawing p1={p1} p2={p2} /></div>
      <div className="u256-bn kicker"><b>Espacio de Geometría Sagrada</b> · desde 2014</div>
      <div className="u256-ct">
        <div className="relative">
          <div className="u256-n"><span>{pct}</span><i>%</i></div>
          <div className="u256-br"><i style={{ width: `${pct}%` }} /></div>
        </div>
        <p className="kicker text-right hidden sm:block">trazando · compás · r = 1</p>
      </div>
    </div>
  );
}
