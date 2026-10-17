// Capturas de plantillas internas en 1440 y 390 px (arriba, medio y abajo de cada página).
import { chromium } from 'playwright';
import fs from 'node:fs';
const [OUT, ...urls] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const errs = [];
for (const [vn, opts] of [['d', { viewport: { width: 1440, height: 900 } }], ['m', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
  const ctx = await b.newContext(opts);
  for (const u of urls) {
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errs.push(`${u}: ${e.message}`));
    p.on('console', (m) => m.type() === 'error' && errs.push(`${u}: ${m.text()}`));
    await p.goto('http://localhost:4173' + u, { waitUntil: 'networkidle' });
    await p.waitForTimeout(2200);
    const name = u.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home';
    const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (const [k, f] of [['a', 0], ['b', 0.33], ['c', 0.66]]) {
      await p.evaluate((y) => scrollTo(0, y), Math.round(H * f));
      await p.waitForTimeout(900);
      await p.screenshot({ path: `${OUT}/${vn}-${name}-${k}.png` });
    }
    await p.close();
  }
  await ctx.close();
}
await b.close();
console.log('errores:', errs.length); errs.slice(0, 15).forEach((e) => console.log(' ', e));
