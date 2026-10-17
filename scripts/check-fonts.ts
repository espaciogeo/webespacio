// Mide la tipografía real en cada tipo de plantilla, en 1440 y 390 px.
// Por elemento: familia computada (getComputedStyle), document.fonts.check() con su peso, y que el
// FontFace de esa familia+peso esté efectivamente en estado "loaded".
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4173';
const TEMPLATES: [string, string][] = [
  ['home', '/'],
  ['formaciones', '/formaciones/'],
  ['producto', '/formaciones/armonizacion-de-espacios/'],
  ['producto WP', '/formaciones/formacion-profesional/'],
  ['ebooks', '/ebooks/'],
  ['blog', '/blog/'],
  ['artículo', '/geometria-sagrada-estrella-madre-el-secreto-de-la-vida/'],
  ['news', '/news-geometrico/el-libro-que-tardo-casi-12-anos/'],
  ['legal', '/politica-de-privacidad/'],
  ['404', '/404.html'],
];
// selector → familia esperada
const PROBES: [string, string, string][] = [
  ['h1', 'main h1', 'Montserrat'],
  ['h2', 'main h2', 'Montserrat'],
  ['párrafo', 'main p:not(.kicker):not(.mono)', 'Roboto'],
  ['botón', 'main .btn, main button', 'Montserrat'],
  ['navbar', 'header nav a, header button', 'Montserrat'],
  ['footer', 'footer p:not(.mono):not(.kicker), footer li a', 'Roboto'],
  ['anotación', 'main .kicker, main .mono', 'Roboto Mono'],
];

type Cell = { fam: string; check: boolean; loaded: boolean; ok: boolean } | null;
const browser = await chromium.launch();
const rows: { tpl: string; vw: number; cells: Record<string, Cell> }[] = [];
for (const vw of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vw > 500 ? 900 : 844 }, ...(vw < 500 ? { isMobile: true, hasTouch: true } : {}) });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('egs-loader', '1'); } catch { /* */ } });
  const page = await ctx.newPage();
  for (const [tpl, path] of TEMPLATES) {
    const res = await page.goto(BASE + path, { waitUntil: 'networkidle' });
    if (!res || (res.status() >= 400 && path !== '/404.html')) { console.warn('sin ruta', path); continue; }
    await page.evaluate(async () => { window.scrollTo(0, document.body.scrollHeight); await new Promise((r) => setTimeout(r, 500)); window.scrollTo(0, 0); });
    const cells = await page.evaluate(async (probes) => {
      await document.fonts.ready;
      const out: Record<string, unknown> = {};
      for (const [name, sel, want] of probes) {
        const el = [...document.querySelectorAll<HTMLElement>(sel)].find((e) => e.textContent!.trim() && e.getClientRects().length);
        if (!el) { out[name] = null; continue; }
        const cs = getComputedStyle(el);
        const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
        const w = cs.fontWeight;
        const check = document.fonts.check(`${w} 16px "${fam}"`);
        const loaded = [...document.fonts].some((f) => f.family.replace(/["']/g, '') === fam && f.status === 'loaded' && String(f.weight).split(' ').some((x) => x === w || x === 'normal' && w === '400'));
        out[name] = { fam: `${fam} ${w}`, check, loaded, ok: fam === want && check && loaded };
      }
      return out;
    }, PROBES);
    rows.push({ tpl, vw, cells: cells as Record<string, Cell> });
  }
  await ctx.close();
}
await browser.close();

const head = ['plantilla', 'ancho', ...PROBES.map((p) => `${p[0]} (${p[2]})`)];
const md = [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`,
  ...rows.map((r) => `| ${r.tpl} | ${r.vw} | ${PROBES.map(([n]) => { const c = r.cells[n]; return c ? `${c.ok ? '✓' : '✗'} ${c.fam}${c.check && c.loaded ? '' : ' (no cargada)'}` : '—'; }).join(' | ')} |`)];
const bad = rows.flatMap((r) => PROBES.filter(([n]) => r.cells[n] && !r.cells[n]!.ok).map(([n]) => `${r.tpl}@${r.vw} ${n}: ${r.cells[n]!.fam}`));
fs.writeFileSync('../_capturas/check-fonts.md', `# Tipografía medida\n\n${md.join('\n')}\n\nFallas: ${bad.length}\n${bad.join('\n')}\n`);
console.log(md.join('\n'));
console.log(`\nFallas: ${bad.length}`, bad.join('\n'));
process.exit(bad.length ? 1 : 0);
