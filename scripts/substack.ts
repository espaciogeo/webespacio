// Migra los 26 "News Geométricos" de Substack al blog propio.
// Texto: el .md exportado. Títulos, fechas, portadas e imágenes del cuerpo (con epígrafe): API pública de Substack.
// Uso: node scripts/substack.ts
import fs from 'node:fs';
import path from 'node:path';
import { download, processImage } from './lib/image.ts';

const ROOT = path.resolve('..', '_contenido', 'substack');
const MD = path.join(ROOT, '26-posts-geometria-sagrada (3).md');
const API = path.join(ROOT, 'api');
const OUT = path.join(ROOT, 'news');
const RAW = path.resolve('..', '_assets', 'substack');
const HOST = 'https://espaciodegeometriasagrada.substack.com';
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(RAW, { recursive: true });

/* ---------- API ---------- */
const archive: any[] = [...JSON.parse(fs.readFileSync(path.join(API, 'archive.json'), 'utf8')), ...JSON.parse(fs.readFileSync(path.join(API, 'archive2.json'), 'utf8'))];
const api = archive.map((a) => ({ ...a, ...JSON.parse(fs.readFileSync(path.join(API, 'posts', `${a.slug}.json`), 'utf8')) }));
const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const cleanSlug = (s: string) => s.replace(/^\d{2}-/, '');
const numOf = (a: any) => Number(String(a.title).match(/#\s*(\d+)/)?.[1] ?? a.slug.match(/^(\d{2})-/)?.[1] ?? 0);

/* ---------- .md ---------- */
const md = fs.readFileSync(MD, 'utf8');
const parts = md.split(/^# (?=\d{2}\. )/m).slice(1);
type Src = { n: number; shortTitle: string; slug: string; body: string };
const src: Src[] = parts.map((p) => {
  const [head, ...rest] = p.split('\n');
  const m = head.match(/^(\d{2})\.\s+(.*)$/)!;
  const body = rest.join('\n');
  const slug = body.match(/\*\*Slug:\*\*\s*`([^`]+)`/)?.[1] ?? '';
  return { n: Number(m[1]), shortTitle: m[2].trim(), slug, body: body.replace(/\*\*Slug:\*\*\s*`[^`]+`\s*\n/, '').replace(/\n---\s*$/, '').trim() };
});

/* ---------- limpieza ---------- */
const titleCase = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
function cleanTitle(t: string) {
  return titleCase(t.trim().replace(/\s+/g, ' ').replace(/^#\s*\d+\s*[-–]?\s*/, '').replace(/\.$/, '').trim());
}
function cleanUrl(u: string): string {
  let url = u.replace(/\{\{\s*CONTACT[^}]*\}\}/gi, '');
  try {
    const x = new URL(url);
    [...x.searchParams.keys()].forEach((k) => { if (/^utm_|^r$|^token$|^triedRedirect$|^showWelcome/.test(k)) x.searchParams.delete(k); });
    // links entre news → URL interna
    const m = x.pathname.match(/\/p\/([\w-]+)/);
    if ((x.hostname === 'espaciodegeometriasagrada.substack.com' || x.hostname === 'open.substack.com') && m) return `/news-geometrico/${cleanSlug(m[1])}/`;
    url = x.toString().replace(/\?$/, '');
  } catch { /* url relativa o rota: se deja */ }
  return url;
}
function cleanBody(b: string) {
  let s = b;
  s = s.replace(/^.*Thanks for reading Espacio de Geometr[ií]a Sagrada!.*$/gim, '');
  s = s.replace(/^.*Subscribe for free to receive new posts.*$/gim, '');
  // prefijo de mail ("Respondé este mail y contame:") — se conserva la pregunta que sigue
  s = s.replace(/\*{0,3}Resp[oó]nd[eé] este (?:mail|en los comentarios) y cu[eé]ntame:\*{0,3}\s*/gi, '');
  s = s.replace(/reenviále este mail/gi, 'compartile este artículo');
  s = s.replace(/resp[oó]nd[eé] este mail y contame/gi, 'escribinos a info@espaciodegeometriasagrada.com y contanos');
  s = s.replace(/\{\{\s*CONTACT[^}]*\}\}/gi, '');
  s = s.replace(/\]\(([^)\s]+)\)/g, (_m, u) => `](${cleanUrl(u)})`);
  // énfasis: negrita+cursiva apiladas → un solo énfasis
  s = s.replace(/\*\*\*(.+?)\*\*\*/g, '**$1**').replace(/\*\*_(.+?)_\*\*/g, '**$1**').replace(/_\*\*(.+?)\*\*_/g, '**$1**');
  s = s.replace(/\*\*\s+\*\*/g, ' ').replace(/\*\*\*\*/g, '');
  return s.replace(/\n{3,}/g, '\n\n').trim();
}
function authorsOf(body: string) {
  const tail = body.split('\n').filter((l) => l.trim()).slice(-8).join('\n');
  const sig = [...tail.matchAll(/^\**\s*(Pablo, Monique|Monique, Pablo|Pablo|Monique)\.?\s*\**\s*$/gm)].map((m) => m[1]).pop();
  const MON = { slug: 'monique-dumoulin', name: 'Monique Dumoulin' }, PAB = { slug: 'pablo-pettinaroli', name: 'Pablo Pettinaroli' };
  if (!sig) return [MON];
  if (sig.includes(',')) return sig.startsWith('Pablo') ? [PAB, MON] : [MON, PAB];
  return sig === 'Pablo' ? [PAB] : [MON];
}

/* ---------- imágenes del cuerpo ---------- */
const originalOf = (u: string) => { const m = u.match(/\/(https%3A%2F%2F[^"?\s]+)$/); return m ? decodeURIComponent(m[1]) : u; };
const plain = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#\d+;/g, ' ').replace(/\s+/g, ' ').trim();
type Fig = { url: string; caption: string; anchor: string };
function figures(html: string): Fig[] {
  const out: Fig[] = [];
  const re = /<div class="captioned-image-container">([\s\S]*?)<\/figure><\/div>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const block = m[1];
    const href = block.match(/href="([^"]+)"/)?.[1] || block.match(/<img src="([^"]+)"/)?.[1];
    if (!href) continue;
    const caption = plain(block.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/)?.[1] || '');
    const before = html.slice(0, m.index);
    const paras = [...before.matchAll(/<(p|h[1-6]|li)[^>]*>([\s\S]*?)<\/\1>/g)];
    const last = paras.length ? plain(paras[paras.length - 1][2]) : '';
    out.push({ url: originalOf(href.replace(/&amp;/g, '&')), caption, anchor: last });
  }
  return out;
}
function insertFigures(body: string, figs: { key: string; caption: string; anchor: string }[]) {
  const paras = body.split(/\n\n/);
  const normParas = paras.map((p) => norm(p.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')));
  const placed: { at: number; tag: string }[] = [];
  let missing = 0;
  for (const f of figs) {
    const tag = `{{figure:${f.key}|${f.caption.replace(/[|}]/g, ' ')}}}`;
    const a = norm(f.anchor);
    let at = -1;
    if (a) {
      const probe = a.slice(-60);
      at = normParas.findIndex((p) => p.includes(probe));
      if (at < 0) at = normParas.findIndex((p) => p.length > 10 && a.includes(p.slice(-40)));
    } else at = -2; // imagen al comienzo
    if (at === -1) { missing++; at = paras.length - 1; }
    placed.push({ at, tag });
  }
  const res: string[] = [];
  placed.filter((p) => p.at === -2).forEach((p) => res.push(p.tag));
  paras.forEach((p, i) => { res.push(p); placed.filter((x) => x.at === i).forEach((x) => res.push(x.tag)); });
  return { body: res.join('\n\n'), missing };
}

/* ---------- proceso ---------- */
const manifest: Record<string, { name: string; w: number; h: number }> = {};
const failed: { url: string; news: number; reason: string }[] = [];
let downloaded = 0, unplaced = 0;
const index: any[] = [];
const redirects: [string, string][] = [];

async function img(url: string, name: string, n: number): Promise<string | null> {
  const ext = (url.match(/\.(png|jpe?g|webp|gif)(?:$|\?)/i)?.[1] || 'jpg').toLowerCase();
  const file = path.join(RAW, `${name}.${ext}`);
  try {
    await download(url, file);
    downloaded++;
    const key = `substack:${name}`;
    manifest[key] = { name, ...(await processImage(file, name, /jpe?g/.test(ext))) };
    return key;
  } catch (e: any) {
    failed.push({ url, news: n, reason: e.message });
    return null;
  }
}

for (const s of src) {
  const a = api.find((x) => numOf(x) === s.n) || api.find((x) => cleanSlug(x.slug) === s.slug) || api.find((x) => norm(x.title).includes(norm(s.shortTitle)));
  if (!a) { console.log('sin match en la API:', s.n, s.shortTitle); continue; }
  const slug = cleanSlug(a.slug);
  const nn = String(s.n).padStart(2, '0');
  let body = cleanBody(s.body);
  const figs = figures(a.body_html || '');
  const keyed: { key: string; caption: string; anchor: string }[] = [];
  for (let i = 0; i < figs.length; i++) {
    const k = await img(figs[i].url, `news-${nn}-${i + 1}`, s.n);
    if (k) keyed.push({ key: k, caption: figs[i].caption, anchor: figs[i].anchor });
  }
  const ins = insertFigures(body, keyed);
  body = ins.body; unplaced += ins.missing;
  const cover = a.cover_image ? await img(originalOf(a.cover_image), `news-${nn}-portada`, s.n) : null;
  const authors = authorsOf(s.body);
  const words = body.split(/\s+/).length;
  // resumen: subtítulo de Substack o el primer párrafo con contenido (se saltean saludos)
  const firstPara = body.split(/\n\n/).map((x) => plain(x.replace(/\{\{[^}]+\}\}/g, '').replace(/[#*_>\[\]]/g, '').replace(/\([^)]*\)/g, ''))).find((x) => x.length > 60 && !/^hola\b/i.test(x)) || '';
  const excerpt = a.subtitle ? a.subtitle.trim() : firstPara.slice(0, 200).replace(/\s\S*$/, '') + '…';
  const post = {
    kind: 'news', number: s.n, slug, path: `/news-geometrico/${slug}/`, title: cleanTitle(a.title), subtitle: (a.subtitle || '').trim(),
    date: a.post_date.slice(0, 10), modified: (a.updated_at || a.post_date).slice(0, 10), authors, image: cover,
    categories: ['news-geometrico'], excerpt, readingMinutes: Math.max(1, Math.round(words / 200)),
    substackUrl: `${HOST}/p/${a.slug}`, aboutBook: [16, 17, 19, 20, 22, 25].includes(s.n),
  };
  fs.writeFileSync(path.join(OUT, `${slug}.md`), body + '\n');
  index.push(post);
  if (a.slug !== slug) redirects.push([`/news-geometrico/${a.slug}/`, post.path]);
}
index.sort((x, y) => x.number - y.number);
fs.writeFileSync(path.join(ROOT, 'news-index.json'), JSON.stringify(index, null, 1));
fs.writeFileSync(path.join(ROOT, 'news-redirects.json'), JSON.stringify(redirects, null, 1));
fs.writeFileSync(path.join(ROOT, 'news-imagenes-fallidas.json'), JSON.stringify(failed, null, 1));
fs.writeFileSync(path.resolve('src', 'content', 'news-manifest.json'), JSON.stringify(manifest));
// copia para el build
const dst = path.resolve('src', 'content', 'substack');
fs.rmSync(dst, { recursive: true, force: true });
fs.mkdirSync(path.join(dst, 'news'), { recursive: true });
for (const f of fs.readdirSync(OUT)) fs.copyFileSync(path.join(OUT, f), path.join(dst, 'news', f));
for (const f of ['news-index.json', 'news-redirects.json']) fs.copyFileSync(path.join(ROOT, f), path.join(dst, f));

console.log(`news: ${index.length} · imágenes descargadas: ${downloaded} · fallidas: ${failed.length} · sin ubicar (al final): ${unplaced} · redirecciones: ${redirects.length}`);
console.log('autores:', index.map((p) => `${p.number}:${p.authors.map((x: any) => x.name.split(' ')[0]).join('+')}`).join(' '));
failed.forEach((f) => console.log('  ✗', f.news, f.url, f.reason));
