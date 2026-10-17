// Pose de un compás: aguja en el centro c, mina sobre la circunferencia en el ángulo a.
// Las dos patas miden L; la bisagra queda sobre la mediatriz entre aguja y mina.
export function compassPose(cx: number, cy: number, r: number, a: number, L: number) {
  const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a);
  const mx = (cx + px) / 2, my = (cy + py) / 2;
  const h = Math.sqrt(Math.max(0.0001, L * L - (r / 2) * (r / 2)));
  // normal hacia "afuera" de la figura (rotada -90° respecto de aguja→mina)
  const nx = Math.sin(a), ny = -Math.cos(a);
  const hx = mx + nx * h, hy = my + ny * h;
  return { px, py, hx, hy, handle: { x: hx + nx * L * 0.22, y: hy + ny * L * 0.22 } };
}
