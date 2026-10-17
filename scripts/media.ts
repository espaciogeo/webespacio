// Descarga (o reutiliza) las imágenes referenciadas por el contenido migrado y genera AVIF + WebP en 800/1600 px.
// Fotos (JPG): mismo tratamiento unificado que la home. Gráficos (PNG): solo redimensionado, sin tocar color.
import { processImage } from './lib/image.ts';
import fs from 'node:fs';
import path from 'node:path';

const WP = path.resolve('..', '_contenido', 'wp');
const ASSETS = path.resolve('..', '_assets');
const EXTRA = path.join(ASSETS, 'wp-extra');
const OUT = path.resolve('public', 'media');
fs.mkdirSync(EXTRA, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

type M = { key: string; url: string; used: string[] };
const list: M[] = JSON.parse(fs.readFileSync(path.join(WP, 'media.json'), 'utf8'));
const local = new Map<string, string>();
for (const dir of ['originales', 'descartadas', 'wp-extra']) {
  const d = path.join(ASSETS, dir);
  if (fs.existsSync(d)) for (const f of fs.readdirSync(d)) local.set(f.toLowerCase(), path.join(d, f));
}

const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);

function candidates(m: M) {
  const u = m.key.match(/uploads\/(\d{4})\/(\d{2})\/(.+)$/);
  if (!u) return { files: [] as string[], urls: [m.url] };
  const [, y, mo, base] = u;
  const ext = path.extname(base), stem = base.slice(0, -ext.length);
  const files = [`${y}-${mo}_${stem}-scaled${ext}`, `${y}-${mo}_${base}`].map((f) => f.toLowerCase());
  const urls = [m.key.replace(ext, `-scaled${ext}`), m.key, m.url];
  return { files, urls };
}

async function fetchTo(url: string, file: string) {
  const r = await fetch(encodeURI(decodeURI(url)), { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(String(r.status));
  const ct = r.headers.get('content-type') || '';
  if (!ct.startsWith('image/')) throw new Error(ct);
  fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
}

const manifest: Record<string, { name: string; w: number; h: number }> = {};
const failed: { url: string; reason: string; used: string[] }[] = [];

async function one(m: M) {
  const { files, urls } = candidates(m);
  let src = files.map((f) => local.get(f)).find(Boolean);
  if (!src) {
    const file = path.join(EXTRA, `${slug(path.basename(m.key, path.extname(m.key)))}${path.extname(m.key).toLowerCase()}`);
    let last = '';
    for (const u of urls) { try { await fetchTo(u, file); src = file; break; } catch (e: any) { last = e.message; } }
    if (!src) { failed.push({ url: m.url, reason: last, used: m.used }); return; }
  }
  const ym = m.key.match(/uploads\/(\d{4})\/(\d{2})\//);
  const name = slug(`${ym ? ym[1] + '-' + ym[2] + '-' : ''}${path.basename(m.key, path.extname(m.key))}`);
  const isPhoto = /\.jpe?g$/i.test(src);
  try {
    const out = await processImage(src, name, isPhoto);
    manifest[m.key] = { name, ...out };
  } catch (e: any) {
    failed.push({ url: m.url, reason: `procesamiento: ${e.message}`, used: m.used });
  }
}

const queue = [...list];
await Promise.all(Array.from({ length: 6 }, async () => { while (queue.length) await one(queue.shift()!); }));
fs.writeFileSync(path.resolve('src', 'content', 'media-manifest.json'), JSON.stringify(manifest));
fs.writeFileSync(path.join(WP, 'media-fallidas.json'), JSON.stringify(failed, null, 1));
console.log('procesadas', Object.keys(manifest).length, '/', list.length, '· fallidas', failed.length);
for (const f of failed) console.log('  ✗', f.url, '→', f.reason);
