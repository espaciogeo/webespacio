// Capturas de cada tipo de plantilla en 1440 y 390 px → _capturas/ + _capturas/index.html (grilla para revisar).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'http://localhost:4173';
const OUT = path.resolve('..', '_capturas');
// [tipo, url, ancla opcional para la segunda captura]
const TIPOS: [string, string, string?][] = [
  ['home', '/'],
  ['formaciones', '/formaciones/'],
  ['armonizacion-tabla', '/formaciones/armonizacion-de-espacios/', '#caminos'],
  ['experiencias', '/formaciones/experiencias/'],
  ['evento-retiro', '/formaciones/experiencias/retiro-maldonado-uruguay/'],
  ['club-formadores', '/formaciones/club-formadores/', '#planes'],
  ['admision', '/formaciones/admision/', '#agenda'],
  ['libro', '/libro/', '#comprar'],
  ['ebooks', '/ebooks/'],
  ['ebook', '/ebooks/7-trazos-de-geometria-sagrada/'],
  ['institucional', '/que-hacemos/'],
  ['producto', '/formaciones/formacion-profesional/'],
  ['clase-gratuita', '/clase-gratuita/'],
  ['blog', '/blog/'],
  ['articulo-wordpress', '/geometria-sagrada-estrella-madre-el-secreto-de-la-vida/'],
  ['news-substack', '/news-geometrico/aprendiendo-a-reconocer-el-cuerpo/'],
  ['categoria', '/category/news-geometrico/'],
  ['autor', '/author/pablo-pettinaroli/'],
  ['legal', '/politica-de-privacidad/'],
  ['confirmacion', '/pago-confirmado/'],
  ['404', '/404.html'],
];
const VPS = [
  { id: '1440', opts: { viewport: { width: 1440, height: 900 } } },
  { id: '390', opts: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
];
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const shots: { tipo: string; url: string; vp: string; files: string[] }[] = [];
const errors: string[] = [];
for (const vp of VPS) {
  const ctx = await browser.newContext(vp.opts);
  for (const [tipo, url, anchor] of TIPOS) {
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`${url}: ${e.message}`));
    // los embeds de GoHighLevel mantienen la red activa: se espera 'load' y un margen fijo
    await page.goto(BASE + url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});
    if (url === '/') await page.waitForSelector('.u256', { state: 'detached', timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(tipo === 'home' ? 6000 : 2600);
    const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    const files: string[] = [];
    for (const [k, f] of [['1', 0], ['2', 0.4]] as const) {
      if (k === '2' && anchor) await page.evaluate((a) => { const el = document.querySelector(a); if (el) scrollTo(0, el.getBoundingClientRect().top + scrollY + (innerWidth < 600 ? 240 : 200)); }, anchor);
      else await page.evaluate((y) => scrollTo(0, y), Math.round(H * f));
      await page.waitForTimeout(1300);
      const file = `${tipo}-${vp.id}-${k}.png`;
      await page.screenshot({ path: path.join(OUT, file) });
      files.push(file);
    }
    shots.push({ tipo, url, vp: vp.id, files });
    await page.close();
  }
  await ctx.close();
}
await browser.close();

const card = (s: (typeof shots)[number]) => `<figure class="${s.vp === '390' ? 'm' : 'd'}"><figcaption><b>${s.vp} px</b> <a href="${BASE}${s.url}">${s.url}</a></figcaption>${s.files.map((f) => `<a href="${f}"><img src="${f}" loading="lazy" alt="${s.tipo} ${s.vp}px"></a>`).join('')}</figure>`;
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Capturas · Espacio de Geometría Sagrada</title>
<style>
:root{--ink:#094372;--accent:#66CC99;--gray:#666}
body{margin:0;padding:32px clamp(16px,4vw,48px);font-family:Roboto,system-ui,sans-serif;color:var(--ink);background:#fff}
h1{font-family:Montserrat,system-ui,sans-serif;font-size:40px;margin:0 0 6px} p.sub{color:var(--gray);margin:0 0 32px}
section{border-top:1px solid #0943721f;padding:24px 0}
h2{font-family:Montserrat,system-ui,sans-serif;font-size:24px;margin:0 0 14px;text-transform:capitalize}
.row{display:grid;grid-template-columns:3fr 1fr;gap:20px;align-items:start}
figure{margin:0} figcaption{font:13px 'Roboto Mono',monospace;color:var(--gray);margin-bottom:8px} figcaption a{color:var(--ink)}
figure.d{display:grid;grid-template-columns:1fr 1fr;gap:10px} figure.d figcaption{grid-column:1/-1}
figure.m{display:grid;grid-template-columns:1fr 1fr;gap:8px} figure.m figcaption{grid-column:1/-1}
img{width:100%;display:block;border:1px solid #09437226;border-radius:10px}
@media(max-width:900px){.row{grid-template-columns:1fr}}
</style></head><body>
<h1>Capturas por plantilla</h1><p class="sub">${TIPOS.length} tipos · 1440 px y 390 px · arriba y a mitad de página (o en la sección clave: tabla de caminos, planes, agenda, compra) · ${new Date().toLocaleString('es-AR')}. Click en una imagen para verla completa. Chequeos: <a href="check-layout.md">nav/footer</a> · <a href="check-mobile.md">móvil</a> · <a href="check-fonts.md">tipografía</a>.</p>
${TIPOS.map(([tipo]) => `<section><h2>${tipo.replace(/-/g, ' ')}</h2><div class="row">${shots.filter((s) => s.tipo === tipo).map(card).join('')}</div></section>`).join('\n')}
</body></html>`;
fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log(`${shots.length * 2} capturas en _capturas/ · errores de página: ${errors.length}`);
errors.forEach((e) => console.log('  ', e));
