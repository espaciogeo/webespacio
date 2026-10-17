// Descarga y procesa las imágenes de las páginas externas (GoHighLevel + WordPress referenciadas desde ahí).
// Mismo pipeline que el resto del sitio (lib/image.ts). Manifest: src/content/externas-manifest.json, por URL original.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { processImage, download } from './lib/image.ts';

const ROOT = path.resolve('../_contenido/externas');
const ORIG = path.resolve('../_assets/externas');
fs.mkdirSync(ORIG, { recursive: true });

// leadconnector sirve las imágenes por un proxy de redimensionado: nos quedamos con el original (u_<url>)
export const unwrap = (u: string) => { const m = u.match(/\/u_(https?:\/\/.+)$/); return m ? m[1] : u; };
const skip = (u: string) => /flagcdn\.com|img\.youtube\.com|i\.vimeocdn\.com|stcdn\.leadconnectorhq|widget-logo/.test(u);

const urls = new Set<string>();
const walk = (d: string) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else if (f.name === 'extraido.json') { const j = JSON.parse(fs.readFileSync(p, 'utf8')); if (!j.items) continue; for (const i of j.items) if (i.t === 'img' && !(i.w === 908 && i.h === 307)) urls.add(unwrap(i.src)); for (const b of j.bgs) urls.add(unwrap(b)); if (j.ogImage) urls.add(unwrap(j.ogImage)); } else if (/^custom-code-.*\.html$/.test(f.name)) { for (const m of fs.readFileSync(p, 'utf8').matchAll(/<img[^>]*src="([^"]+)"/g)) urls.add(unwrap(m[1])); } } };
walk(ROOT);

const manifestFile = path.resolve('src/content/externas-manifest.json');
const manifest: Record<string, { name: string; w: number; h: number }> = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : {};
const failed: { url: string; error: string }[] = [];
let n = 0;
for (const url of [...urls].filter((u) => u && !skip(u))) {
  if (manifest[url]) continue;
  const base = decodeURIComponent(url.split('/').pop()!.split('?')[0]).replace(/\.[a-z0-9]+$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  const name = `ext-${base}-${crypto.createHash('md5').update(url).digest('hex').slice(0, 6)}`;
  const ext = (url.match(/\.(png|jpe?g|webp|gif)(\?|$)/i)?.[1] || 'png').toLowerCase();
  const file = path.join(ORIG, `${name}.${ext}`);
  try {
    await download(url, file);
    const isPhoto = /jpe?g/.test(ext);
    manifest[url] = { name, ...(await processImage(file, name, isPhoto)) };
    n++;
  } catch (e) { failed.push({ url, error: String(e) }); }
}
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 1));
fs.writeFileSync(path.join(ROOT, 'imagenes-fallidas.json'), JSON.stringify(failed, null, 1));
console.log(`imágenes externas: ${Object.keys(manifest).length} en manifest (${n} nuevas), fallidas ${failed.length}`);
for (const f of failed) console.log('  ✗', f.url, f.error);
