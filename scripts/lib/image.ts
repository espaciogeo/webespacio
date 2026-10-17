// Procesamiento de imágenes compartido (WordPress y Substack): AVIF + WebP en 800/1600 px.
// Fotos: tratamiento unificado (desaturación leve, curva neutra apenas fría, grano). Gráficos: solo redimensionado.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

export const MEDIA_OUT = path.resolve('public', 'media');

function grain(w: number, h: number, amount: number) {
  const buf = Buffer.alloc(w * h);
  for (let i = 0; i < buf.length; i++) buf[i] = 128 + Math.round((Math.random() - 0.5) * 2 * amount);
  return sharp(buf, { raw: { width: w, height: h, channels: 1 } }).toColourspace('srgb').png().toBuffer();
}

export async function processImage(src: string, name: string, isPhoto: boolean): Promise<{ w: number; h: number }> {
  fs.mkdirSync(MEDIA_OUT, { recursive: true });
  const done1600 = path.join(MEDIA_OUT, `${name}-1600.webp`);
  if (fs.existsSync(done1600) && fs.existsSync(path.join(MEDIA_OUT, `${name}-800.avif`))) {
    const d = await sharp(done1600).metadata();
    return { w: d.width || 0, h: d.height || 0 };
  }
  const base = sharp(src, { animated: false }).rotate();
  const meta = await base.metadata();
  let out = { w: meta.width || 0, h: meta.height || 0 };
  for (const w of [1600, 800]) {
    let pipe = base.clone().resize({ width: Math.min(w, meta.width || w), withoutEnlargement: true });
    if (isPhoto) {
      const r = await pipe.modulate({ saturation: 0.86 }).recomb([[0.98, 0.01, 0.01], [0, 1, 0.02], [0, 0.02, 1.04]]).linear([1.03, 1.03, 1.03], [-3, -2, 2]).toBuffer({ resolveWithObject: true });
      pipe = sharp(r.data).composite([{ input: await grain(r.info.width, r.info.height, w > 1000 ? 14 : 10), blend: 'overlay' }]);
    }
    const d = await pipe.clone().webp({ quality: isPhoto ? 72 : 82 }).toFile(path.join(MEDIA_OUT, `${name}-${w}.webp`));
    await pipe.clone().avif({ quality: isPhoto ? 52 : 60, effort: 2 }).toFile(path.join(MEDIA_OUT, `${name}-${w}.avif`));
    if (w === 1600) out = { w: d.width, h: d.height };
  }
  return out;
}

export async function download(url: string, file: string) {
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return;
  const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(String(r.status));
  const ct = r.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw new Error(ct || 'sin content-type');
  fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
}
