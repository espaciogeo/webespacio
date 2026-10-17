// Trazos de construcción que se dibujan al entrar: guías en verde agua y trazo final en tinta azul.
// Cada página interna recibe una figura distinta para sostener el concepto de "mesa del geómetra".
export type TrazoTipo = 'vesica' | 'semilla' | 'triangulo' | 'hexagono' | 'espiral';
const TIPOS: TrazoTipo[] = ['vesica', 'semilla', 'triangulo', 'hexagono', 'espiral'];

export function trazoFor(seed: string): TrazoTipo {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TIPOS[h % TIPOS.length];
}

const P = (cx: number, cy: number, r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
const pts = (n: number, r: number, rot = -Math.PI / 2) => Array.from({ length: n }, (_, k) => P(0, 0, r, rot + (k * 2 * Math.PI) / n));

export function Trazo({ tipo, className = '' }: { tipo: TrazoTipo; className?: string }) {
  let i = 0;
  const d = () => ({ pathLength: 1, style: { ['--i' as string]: i++ } as React.CSSProperties });
  const guide = 'tz-guide';
  const ink = 'tz-ink';
  let body: React.ReactNode = null;
  let notes: [number, number, string][] = [];

  if (tipo === 'vesica') {
    body = (<>
      <line {...d()} className={guide} x1={-2.4} y1={0} x2={2.4} y2={0} />
      <line {...d()} className={guide} x1={0} y1={-1.9} x2={0} y2={1.9} />
      <circle {...d()} className={ink} cx={-0.5} cy={0} r={1} />
      <circle {...d()} className={ink} cx={0.5} cy={0} r={1} />
      <path {...d()} className={ink} d={`M0 ${-Math.sqrt(3) / 2}L0 ${Math.sqrt(3) / 2}`} strokeWidth={0.034} />
    </>);
    notes = [[-0.5, 0.28, 'A'], [0.5, 0.28, 'B'], [0.08, -1.05, 'vesica piscis'], [-2.3, -0.12, 'r = 1']];
  } else if (tipo === 'semilla') {
    const c = [[0, 0], ...pts(6, 1)];
    body = (<>
      <circle {...d()} className={guide} cx={0} cy={0} r={2} />
      {c.map(([x, y], k) => <circle key={k} {...d()} className={ink} cx={x} cy={y} r={1} />)}
    </>);
    notes = [[1.45, -1.75, 'semilla de la vida'], [0.06, -0.5, 'r'], [-2.3, 2.15, 'Ø 4r']];
  } else if (tipo === 'triangulo') {
    const t = pts(3, 1.6);
    body = (<>
      <circle {...d()} className={guide} cx={0} cy={0} r={1.6} />
      <line {...d()} className={guide} x1={0} y1={-1.9} x2={0} y2={1.9} />
      {t.map(([x, y], k) => <line key={k} {...d()} className={guide} x1={0} y1={0} x2={x} y2={y} />)}
      <path {...d()} className={ink} d={`M${t.map(([x, y]) => `${x} ${y}`).join('L')}Z`} strokeWidth={0.034} />
      <circle {...d()} className={ink} cx={0} cy={0} r={0.8} />
    </>);
    notes = [[0.1, -1.7, '120°'], [1.5, 1.2, 'R = 2r'], [0.1, 0.3, 'r']];
  } else if (tipo === 'hexagono') {
    const h = pts(6, 1.6, 0);
    body = (<>
      <circle {...d()} className={guide} cx={0} cy={0} r={1.6} />
      {h.map(([x, y], k) => <line key={k} {...d()} className={guide} x1={0} y1={0} x2={x} y2={y} />)}
      <path {...d()} className={ink} d={`M${h.map(([x, y]) => `${x} ${y}`).join('L')}Z`} strokeWidth={0.034} />
      <path {...d()} className={ink} d={`M${[0, 2, 4].map((k) => `${h[k][0]} ${h[k][1]}`).join('L')}Z`} />
      <path {...d()} className={ink} d={`M${[1, 3, 5].map((k) => `${h[k][0]} ${h[k][1]}`).join('L')}Z`} />
    </>);
    notes = [[0.85, -0.1, '60°'], [1.7, 0.08, 'r'], [-1.4, -1.6, 'hexágono']];
  } else {
    // espiral áurea dentro del rectángulo áureo
    const PHI = 1.618, W = 3.6, H = W / PHI;
    let x = -W / 2, y = -H / 2, w = W, h = H;
    const sq: { r: [number, number, number]; a: string }[] = [];
    for (let k = 0; k < 6; k++) {
      const s = Math.min(w, h), dir = k % 4;
      if (dir === 0) { sq.push({ r: [x, y, s], a: `M${x} ${y + s}A${s} ${s} 0 0 1 ${x + s} ${y}` }); x += s; w -= s; }
      else if (dir === 1) { sq.push({ r: [x + w - s, y, s], a: `M${x} ${y}A${s} ${s} 0 0 1 ${x + s} ${y + s}` }); y += s; h -= s; }
      else if (dir === 2) { sq.push({ r: [x + w - s, y + h - s, s], a: `M${x + w} ${y}A${s} ${s} 0 0 1 ${x + w - s} ${y + s}` }); w -= s; }
      else { sq.push({ r: [x, y + h - s, s], a: `M${x + s} ${y + h}A${s} ${s} 0 0 1 ${x} ${y + h - s}` }); h -= s; }
    }
    body = (<>
      {sq.map((q, k) => <rect key={k} {...d()} className={guide} x={q.r[0]} y={q.r[1]} width={q.r[2]} height={q.r[2]} />)}
      <rect {...d()} className={ink} x={-W / 2} y={-H / 2} width={W} height={H} strokeWidth={0.034} />
      {sq.map((q, k) => <path key={`a${k}`} {...d()} className={ink} d={q.a} />)}
    </>);
    notes = [[-1.8, -1.3, 'φ = 1,618'], [-0.2, 1.42, 'a + b']];
  }

  return (
    <svg viewBox="-2.6 -2.3 5.2 4.6" className={`trazo ${className}`} aria-hidden="true">
      <g fill="none" strokeWidth={0.02} strokeLinecap="round" strokeLinejoin="round">{body}</g>
      <g className="trazo-notes" fill="var(--pencil-solid)" style={{ fontFamily: 'var(--font-mono)' }} fontSize={0.17}>
        {notes.map(([x, y, t]) => <text key={t} x={x} y={y}>{t}</text>)}
      </g>
    </svg>
  );
}
