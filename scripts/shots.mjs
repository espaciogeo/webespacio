// Capturas por sección en 1440 y 390 px contra el preview (http://localhost:4173).
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = process.argv[2] ?? 'shots';
const ONLY = process.argv[3]; // filtro opcional por nombre
fs.mkdirSync(OUT, { recursive: true });
const S = (l) => `[aria-labelledby="${l}"]`;
const PLAN = [
  ['00-loader', '#inicio', 0, 900],
  ['01-hero', '#inicio', 0, 6500],
  ['01b-hero-morph', '#inicio', 0.32, 900],
  ['01c-hero-metatron', '#inicio', 1, 900],
  ['02-manifiesto-mid', 'section[aria-label="Manifiesto"]', 0.45, 900],
  ['02b-manifiesto-end', 'section[aria-label="Manifiesto"]', 1, 1600],
  ['03-pilares-0', S('pilares-title'), 0, 900],
  ['03b-pilares-mid', S('pilares-title'), 0.55, 900],
  ['03c-pilares-end', S('pilares-title'), 1, 900],
  ['04-solidos-0', S('solidos-title'), 0, 2500],
  ['04b-solidos-mid', S('solidos-title'), 0.5, 1500],
  ['04c-solidos-end', S('solidos-title'), 1, 1500],
  ['05-propuestas-top', S('propuestas-title'), 0, 900],
  ['05b-clase', '#clase', -1, 2600],
  ['05c-propuestas-mid', S('propuestas-title'), 0.55, 900],
  ['05d-propuestas-end', S('propuestas-title'), 0.86, 900],
  ['06-cifras', S('cifras-title'), 0.05, 2600],
  ['06b-timeline', S('cifras-title'), 0.75, 1200],
  ['07-testimonios', S('testimonios-title'), 0.1, 900],
  ['08-equipo', S('equipo-title'), 0.05, 1800],
  ['08b-equipo-2', S('equipo-title'), 0.6, 1800],
  ['09-blog', S('blog-title'), 0.1, 900],
  ['10-cierre', S('cierre-title'), 0.1, 1800],
  ['11-footer', 'body', 1, 1200],
];
const VPS = [
  { name: 'd', viewport: { width: 1440, height: 900 } },
  { name: 'm', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const vp of VPS) {
  const ctx = await browser.newContext({ ...vp, deviceScaleFactor: vp.deviceScaleFactor ?? 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  for (const [name, sel, frac, wait] of PLAN) {
    if (ONLY && !name.includes(ONLY)) continue;
    if (name !== '00-loader') await page.waitForSelector('.u256', { state: 'detached', timeout: 20000 });
    if (name !== '00-loader') {
      await page.evaluate(([sel, frac]) => {
        const el = document.querySelector(sel);
        const top = el.getBoundingClientRect().top + window.scrollY;
        const range = Math.max(0, el.offsetHeight - window.innerHeight);
        const y = sel === 'body' ? document.documentElement.scrollHeight : frac < 0 ? top - 100 : top + frac * range;
        window.scrollTo(0, y);
      }, [sel, frac]);
    }
    await page.waitForTimeout(wait);
    await page.screenshot({ path: `${OUT}/${vp.name}-${name}.png` });
  }
  fs.writeFileSync(`${OUT}/${vp.name}-console.txt`, errors.join('\n'));
  console.log(vp.name, 'errores de consola:', errors.length);
  await ctx.close();
}
await browser.close();
