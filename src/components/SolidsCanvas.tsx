// Canvas único: wireframe color papel que se transforma tetraedro → hexaedro → octaedro → icosaedro → dodecaedro.
// Cada sólido se expresa como 30 segmentos alineados con el anterior; el morph interpola extremos.
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { alignedSolidSegments } from '../lib/geometry';
import { tokenRgb } from '../lib/tokens';

type Prog = { current: number };
const smooth = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };

// Three.js no lee variables CSS: se toma el token --c-paper en tiempo de ejecución.
const lineColor = `rgb(${tokenRgb('--c-paper')})`;

function Wire({ prog, reduced }: { prog: Prog; reduced: boolean }) {
  const shapes = useMemo(alignedSolidSegments, []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(shapes[0]), 3));
    return g;
  }, [shapes]);
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0);

  useFrame((_, dt) => {
    const s = Math.min(shapes.length - 1, Math.max(0, prog.current * (shapes.length - 1)));
    const i = Math.min(shapes.length - 2, Math.floor(s));
    // mesetas: cada sólido se sostiene; el morph ocurre en el tramo central
    const t = smooth((s - i - 0.3) / 0.4);
    const a = shapes[i], b = shapes[i + 1];
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let k = 0; k < arr.length; k++) arr[k] = a[k] + (b[k] - a[k]) * t;
    pos.needsUpdate = true;
    if (group.current) {
      if (!reduced) spin.current += dt * 0.18;
      group.current.rotation.set(0.42 + prog.current * 0.6, spin.current + prog.current * Math.PI * 1.5, 0.08);
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={geo}>
        <lineBasicMaterial color={lineColor} transparent opacity={0.92} />
      </lineSegments>
    </group>
  );
}

export default function SolidsCanvas({ prog, reduced }: { prog: Prog; reduced: boolean }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3.4], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} frameloop="always">
      <Wire prog={prog} reduced={reduced} />
    </Canvas>
  );
}
