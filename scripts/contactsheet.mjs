// Genera hojas de contacto numeradas para revisar las imágenes originales.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const [src, out] = process.argv.slice(2);
const files = fs.readdirSync(src).filter(f => /\.(png|jpe?g|webp|gif)$/i.test(f)).sort();
fs.writeFileSync(path.join(out, 'index.txt'), files.map((f, i) => `${i}\t${f}`).join('\n'));
const T = 220, PER = 30, COLS = 6;
for (let s = 0; s * PER < files.length; s++) {
  const chunk = files.slice(s * PER, s * PER + PER);
  const comps = [];
  for (let i = 0; i < chunk.length; i++) {
    const idx = s * PER + i;
    let buf;
    try {
      const img = sharp(path.join(src, chunk[i]), { animated: false, limitInputPixels: false });
      const m = await img.metadata();
      buf = await img.resize(T, T - 30, { fit: 'contain', background: '#808080' }).png().toBuffer();
      const label = Buffer.from(`<svg width="${T}" height="30"><rect width="100%" height="100%" fill="#000"/><text x="4" y="20" font-size="15" fill="#ff0" font-family="Arial">#${idx} ${m.width}x${m.height}</text></svg>`);
      comps.push({ input: buf, left: (i % COLS) * T, top: Math.floor(i / COLS) * T + 30 });
      comps.push({ input: label, left: (i % COLS) * T, top: Math.floor(i / COLS) * T });
    } catch (e) { console.error('fail', chunk[i], e.message); }
  }
  await sharp({ create: { width: COLS * T, height: Math.ceil(chunk.length / COLS) * T, channels: 3, background: '#222' } })
    .composite(comps).jpeg({ quality: 70 }).toFile(path.join(out, `sheet-${String(s).padStart(2, '0')}.jpg`));
}
console.log(files.length, 'files');
