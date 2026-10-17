// Verificación: tabla URL vieja → nueva contra el preview + links internos rotos en todo el HTML generado.
import fs from 'node:fs';
import path from 'node:path';
const BASE = process.argv[2] || 'http://localhost:4173';
const map = JSON.parse(fs.readFileSync('src/content/wp/url-map.json', 'utf8'));
const site = JSON.parse(fs.readFileSync('src/content/wp/site.json', 'utf8'));
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
// redirecciones del propio dominio (las de subdominio dependen del host y se verifican aparte)
const redirects = Object.fromEntries(vercel.redirects.filter((r) => !r.has).map((r) => [r.source, r.destination]));
const follow = (p) => { let t = p; for (let i = 0; i < 5 && redirects[t]; i++) t = redirects[t]; return t; };
const legacy = [...site.legacyPrefixes, ...site.legacyPages];
const isLegacy = (p) => legacy.some((l) => p === l || p.startsWith(l));
const status = async (p) => (await fetch(BASE + p, { redirect: 'manual' })).status;

let ok = 0; const bad = [];
for (const u of map) {
  if (u.estado === 'proxy') { ok++; continue; }
  const target = follow(u.estado === '301' ? redirects[u.old] : u.nuevo);
  if (!target) { bad.push(`${u.old}: sin regla de redirección`); continue; }
  const s = await status(target);
  if (s === 200) ok++; else bad.push(`${u.old} → ${target}: ${s}`);
}
console.log(`Tabla URL vieja → nueva: ${ok}/${map.length} OK`);
bad.forEach((b) => console.log('  ✗', b));

// links internos
const files = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') && files.push(path.join(d, e.name))));
walk('dist');
const links = new Map();
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8').replace(/<script>window\.__EGS__[\s\S]*?<\/script>/, '');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const u = m[1];
    if (u.startsWith('//')) continue;
    if (!links.has(u)) links.set(u, new Set());
    links.get(u).add(f.replace(/^dist/, '').replace(/index\.html$/, ''));
  }
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(',')) { const u = part.trim().split(' ')[0]; if (u.startsWith('/')) { if (!links.has(u)) links.set(u, new Set()); links.get(u).add(f); } }
}
const broken = [];
let checked = 0, skipped = 0;
for (const [u, from] of links) {
  if (isLegacy(u)) { skipped++; continue; }
  const target = follow(u);
  const s = await status(target);
  checked++;
  if (s !== 200 && s !== 304) broken.push(`${u} (${s}) ← ${[...from].slice(0, 3).join(', ')}`);
}
console.log(`Links y recursos internos: ${checked} revisados, ${broken.length} rotos, ${skipped} apuntan a WordPress (proxy)`);
broken.forEach((b) => console.log('  ✗', b));
// subdominios: cada destino tiene que existir
const hostRules = vercel.redirects.filter((r) => r.has);
let hostOk = 0; const hostBad = [];
for (const r of hostRules) { const p = new URL(r.destination).pathname; const s = await status(p); if (s === 200) hostOk++; else hostBad.push(`${r.has[0].value}${r.source} → ${p}: ${s}`); }
console.log(`Redirecciones de subdominio: ${hostOk}/${hostRules.length} destinos OK`);
hostBad.forEach((b) => console.log('  ✗', b));
process.exit(bad.length || broken.length || hostBad.length ? 1 : 0);
