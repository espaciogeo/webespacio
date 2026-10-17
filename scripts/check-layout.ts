// Recorre todas las rutas prerenderizadas y confirma que cada una muestra <nav> (arriba) y <footer> (al final).
// "Visible" = dentro del viewport y efectivamente pintado (elementFromPoint cae dentro del elemento).
import { chromium, type Page } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4173';
const routes: string[] = JSON.parse(fs.readFileSync('dist-ssr/routes.json', 'utf8')).map((r: { path: string }) => r.path);
routes.push('/404.html');

async function check(page: Page, path: string) {
  await page.goto(BASE + path, { waitUntil: 'load' });
  if (path === '/') await page.waitForSelector('.u256', { state: 'detached', timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(700);
  const nav = await page.evaluate(() => {
    const n = document.querySelector('header nav');
    if (!n) return false;
    const r = n.getBoundingClientRect();
    if (r.bottom <= 0 || r.height === 0) return false;
    const hit = document.elementFromPoint(Math.min(innerWidth - 2, r.left + 30), r.top + r.height / 2);
    return !!hit && !!hit.closest('header');
  });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(900);
  const footer = await page.evaluate(() => {
    const f = document.querySelector('footer');
    if (!f) return false;
    const r = f.getBoundingClientRect();
    const y = Math.min(innerHeight - 4, Math.max(4, r.top + 40));
    if (r.top >= innerHeight || r.bottom <= 0) return false;
    const hit = document.elementFromPoint(innerWidth / 2, y);
    return !!hit && !!hit.closest('footer');
  });
  return { path, nav, footer };
}

const browser = await chromium.launch();
const results: { path: string; nav: boolean; footer: boolean }[] = [];
const queue = [...routes];
await Promise.all(Array.from({ length: 4 }, async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('egs-loader', '1'); } catch { /* */ } });
  const page = await ctx.newPage();
  while (queue.length) { const p = queue.shift()!; results.push(await check(page, p).catch(() => ({ path: p, nav: false, footer: false }))); }
  await ctx.close();
}));
await browser.close();

results.sort((a, b) => a.path.localeCompare(b.path));
const ok = results.filter((r) => r.nav && r.footer).length;
const rows = ['| ruta | nav | footer |', '|---|---|---|', ...results.map((r) => `| ${r.path} | ${r.nav ? '✓' : '✗'} | ${r.footer ? '✓' : '✗'} |`)];
fs.mkdirSync('../_capturas', { recursive: true });
fs.writeFileSync('../_capturas/check-layout.md', `# nav/footer: ${ok}/${results.length} rutas\n\n${rows.join('\n')}\n`);
console.log(rows.join('\n'));
console.log(`\nResultado: ${ok}/${results.length} rutas con nav y footer visibles (${((ok / results.length) * 100).toFixed(0)}%)`);
process.exit(ok === results.length ? 0 : 1);
