// Construcciones exactas. Unidad: r = 1.

export type Pt = { x: number; y: number };
const TAU = Math.PI * 2;
const deg = (d: number) => (d * Math.PI) / 180;

export type FlowerCircle = {
  c: Pt;
  ring: 0 | 1 | 2;
  // destino en el Fruto de la Vida (null = se disuelve)
  fruit: Pt | null;
};

// Flor de la Vida: 1 + 6 + 12 = 19 círculos de radio r, contenidos en un círculo de radio 3r.
// Anillo 1: centros sobre la primera circunferencia cada 60°.
// Anillo 2: 6 a distancia 2r (0°, 60°…) y 6 a distancia r·√3 (30°, 90°…).
// El Fruto de la Vida (13 círculos tangentes de radio rf) tiene centros a 0, 2rf y 4rf sobre los 6 ejes.
export const FRUIT_R = 0.6; // 4rf + rf = 3r → rf = 0.6
export function flowerOfLife(): FlowerCircle[] {
  const out: FlowerCircle[] = [{ c: { x: 0, y: 0 }, ring: 0, fruit: { x: 0, y: 0 } }];
  for (let k = 0; k < 6; k++) {
    const a = deg(-90 + k * 60);
    out.push({ c: { x: Math.cos(a), y: Math.sin(a) }, ring: 1, fruit: { x: 2 * FRUIT_R * Math.cos(a), y: 2 * FRUIT_R * Math.sin(a) } });
  }
  for (let k = 0; k < 6; k++) {
    const a = deg(-90 + k * 60);
    out.push({ c: { x: 2 * Math.cos(a), y: 2 * Math.sin(a) }, ring: 2, fruit: { x: 4 * FRUIT_R * Math.cos(a), y: 4 * FRUIT_R * Math.sin(a) } });
    const b = deg(-60 + k * 60);
    out.push({ c: { x: Math.sqrt(3) * Math.cos(b), y: Math.sqrt(3) * Math.sin(b) }, ring: 2, fruit: null });
  }
  return out;
}

export const fruitCenters = (): Pt[] => flowerOfLife().filter((f) => f.fruit).map((f) => f.fruit!) as Pt[];

// Cubo de Metatrón: las 78 líneas que unen los 13 centros del Fruto de la Vida (C(13,2) = 78).
export function metatronLines(): [Pt, Pt][] {
  const c = fruitCenters();
  const lines: [Pt, Pt][] = [];
  for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++) lines.push([c[i], c[j]]);
  return lines;
}

// Path de una circunferencia que empieza en `start` (el punto donde apoya el lápiz) y gira en sentido horario.
export function circlePath(c: Pt, r: number, startAngle: number): string {
  const sx = c.x + r * Math.cos(startAngle);
  const sy = c.y + r * Math.sin(startAngle);
  const ox = c.x - r * Math.cos(startAngle);
  const oy = c.y - r * Math.sin(startAngle);
  return `M${f(sx)} ${f(sy)}A${f(r)} ${f(r)} 0 1 1 ${f(ox)} ${f(oy)}A${f(r)} ${f(r)} 0 1 1 ${f(sx)} ${f(sy)}`;
}

// Ángulo de inicio: el punto de la circunferencia más cercano al centro de la figura
// (para el anillo 1 es exactamente el origen: el compás arranca desde el centro).
export function startAngleFor(c: Pt): number {
  if (c.x === 0 && c.y === 0) return deg(-90);
  return Math.atan2(-c.y, -c.x);
}

export const f = (n: number) => (Math.round(n * 1000) / 1000).toString();

/* ---------- Sólidos platónicos (aristas, radio circunscrito = 1) ---------- */
export type V3 = [number, number, number];
export type Solid = { verts: V3[]; edges: [number, number][] };

function normalize(verts: V3[]): V3[] {
  const r = Math.max(...verts.map((v) => Math.hypot(...v)));
  return verts.map((v) => [v[0] / r, v[1] / r, v[2] / r]);
}
// Aristas = pares de vértices a la distancia mínima.
function edgesByMinDist(verts: V3[]): [number, number][] {
  let min = Infinity;
  for (let i = 0; i < verts.length; i++)
    for (let j = i + 1; j < verts.length; j++) min = Math.min(min, dist(verts[i], verts[j]));
  const e: [number, number][] = [];
  for (let i = 0; i < verts.length; i++)
    for (let j = i + 1; j < verts.length; j++) if (Math.abs(dist(verts[i], verts[j]) - min) < 1e-6) e.push([i, j]);
  return e;
}
const dist = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

const PHI = (1 + Math.sqrt(5)) / 2;
function make(verts: V3[]): Solid {
  const v = normalize(verts);
  return { verts: v, edges: edgesByMinDist(v) };
}
export const SOLIDS: Solid[] = [
  make([[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]]),
  make([-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z] as V3)))),
  make([[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]),
  make([
    ...[-1, 1].flatMap((a) => [-1, 1].map((b) => [0, a, b * PHI] as V3)),
    ...[-1, 1].flatMap((a) => [-1, 1].map((b) => [a, b * PHI, 0] as V3)),
    ...[-1, 1].flatMap((a) => [-1, 1].map((b) => [a * PHI, 0, b] as V3)),
  ]),
  make([
    ...[-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z] as V3))),
    ...[-1, 1].flatMap((a) => [-1, 1].map((b) => [0, a / PHI, b * PHI] as V3)),
    ...[-1, 1].flatMap((a) => [-1, 1].map((b) => [a / PHI, b * PHI, 0] as V3)),
    ...[-1, 1].flatMap((a) => [-1, 1].map((b) => [a * PHI, 0, b / PHI] as V3)),
  ]),
];

// Para el morph: cada sólido se expresa como 30 segmentos (los que tienen menos aristas repiten),
// y cada segmento del sólido B se asigna al segmento más cercano de A.
export const SEGMENTS = 30;
type Seg = [V3, V3];
function segsOf(s: Solid): Seg[] {
  const base = s.edges.map(([a, b]) => [s.verts[a], s.verts[b]] as Seg);
  const out: Seg[] = [];
  for (let i = 0; i < SEGMENTS; i++) out.push(base[i % base.length]);
  return out;
}
const mid = (s: Seg): V3 => [(s[0][0] + s[1][0]) / 2, (s[0][1] + s[1][1]) / 2, (s[0][2] + s[1][2]) / 2];

// Devuelve, para cada sólido, un Float32Array de 30 segmentos (180 floats) alineado con el anterior.
export function alignedSolidSegments(): Float32Array[] {
  const all = SOLIDS.map(segsOf);
  const aligned: Seg[][] = [all[0]];
  for (let k = 1; k < all.length; k++) {
    const prev = aligned[k - 1];
    const pool = [...all[k]];
    const next: Seg[] = [];
    for (const p of prev) {
      let best = 0, bd = Infinity;
      pool.forEach((s, i) => {
        const d = dist(mid(p), mid(s));
        if (d < bd) { bd = d; best = i; }
      });
      let s = pool.splice(best, 1)[0];
      // orientar para que los extremos queden del mismo lado
      if (dist(p[0], s[0]) + dist(p[1], s[1]) > dist(p[0], s[1]) + dist(p[1], s[0])) s = [s[1], s[0]];
      next.push(s);
    }
    aligned.push(next);
  }
  return aligned.map((segs) => new Float32Array(segs.flatMap(([a, b]) => [...a, ...b])));
}

export { TAU };
