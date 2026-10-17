// Arma una tira de vista previa grande de los archivos pasados (fondo claro para ver logos).
import sharp from 'sharp';
import path from 'node:path';
const [src, out, ...files] = process.argv.slice(2);
const H = 420; const comps = []; let x = 0;
for (const f of files) {
  const b = await sharp(path.join(src, f)).rotate().resize({ height: H }).png().toBuffer();
  const m = await sharp(b).metadata();
  comps.push({ input: b, left: x, top: 0 }); x += m.width + 10;
}
await sharp({ create: { width: x, height: H, channels: 3, background: '#e9e4da' } }).composite(comps).jpeg({ quality: 78 }).toFile(out);
