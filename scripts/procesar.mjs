// Tratamiento unificado de fotos: leve desaturación, curva cálida, grano fino. Salida AVIF + WebP en 1600 y 800 px.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const ORIG = path.resolve('..', '_assets', 'originales');
const OUT = path.resolve('public', 'img');
fs.mkdirSync(OUT, { recursive: true });
const MAP = {
  '2024-01_GRUPALES-24-scaled-1.jpg': 'equipo-duo',
  '2024-07_DSC09092-scaled-1.jpg': 'equipo-retrato',
  '2024-10_DSC_1846-scaled.jpg': 'monique-taller',
  '2024-12_Pablo.png': 'pablo-icosaedro',
  '2024-10_DSC_1949-scaled.jpg': 'trazo-compas',
  '2024-10_DSC_1926-scaled.jpg': 'trazo-compas-2',
  '2024-10_DSC_1423-scaled.jpg': 'construccion-manos',
  '2024-10_DSC_1797-scaled.jpg': 'octaedros',
  '2024-10_DSC_2033-scaled.jpg': 'trazo-toro',
  '2024-10_DSC_1334-scaled.jpg': 'taller-alumnas',
  '2024-10_DSC_2073-scaled.jpg': 'taller-grupo',
  '2025-03_IMG_1603-2-scaled.jpg': 'vesica-lapiz',
  '2026-06_GS-TAPA-LIBRO-MOCKUP.png': 'libro',
};
function grain(w, h, amount = 14) {
  const buf = Buffer.alloc(w * h);
  for (let i = 0; i < buf.length; i++) buf[i] = 128 + Math.round((Math.random() - 0.5) * 2 * amount);
  return sharp(buf, { raw: { width: w, height: h, channels: 1 } }).toColourspace('srgb').png().toBuffer();
}
const manifest = {};
for (const [src, name] of Object.entries(MAP)) {
  const base = sharp(path.join(ORIG, src)).rotate().flatten({ background: '#F4F7F9' });
  const meta = await base.clone().metadata();
  for (const w of [1600, 800]) {
    const resized = await base.clone().resize({ width: Math.min(w, meta.width), withoutEnlargement: true })
      .modulate({ saturation: 0.78, brightness: 1.01 })
      // curva neutra, apenas fría (acompaña la paleta azul marino / verde agua)
      .recomb([[0.98, 0.01, 0.01], [0.0, 1.0, 0.02], [0.0, 0.02, 1.04]])
      .linear([1.03, 1.03, 1.03], [-3, -2, 2])
      .toBuffer({ resolveWithObject: true });
    const { width, height } = resized.info;
    const g = await grain(width, height, w > 1000 ? 16 : 11);
    const final = sharp(resized.data).composite([{ input: g, blend: 'overlay' }]);
    await final.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(OUT, `${name}-${w}.avif`));
    await final.clone().webp({ quality: 72 }).toFile(path.join(OUT, `${name}-${w}.webp`));
    if (w === 1600) manifest[name] = { w: width, h: height };
  }
}
// Logo: sin tratamiento, recortado.
await sharp(path.join(ORIG, '2024-07_espacio-geometriasagrada-logo-01.png')).trim().webp({ quality: 90 }).toFile(path.join(OUT, 'logo.webp'));
await sharp(path.join(ORIG, '2024-07_espacio-geometriasagrada-logo-01.png')).trim().png().toFile(path.join(OUT, 'logo.png'));
fs.writeFileSync(path.resolve('src', 'img-manifest.json'), JSON.stringify(manifest, null, 2));
console.log(manifest);
