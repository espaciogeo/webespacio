// Verifica las fuentes efectivas en el preview y saca capturas del hero.
import { chromium } from 'playwright';
const OUT = process.argv[2];
const b = await chromium.launch();
for (const [name, opts] of [['1440', { viewport: { width: 1440, height: 900 } }], ['390', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
  const p = await (await b.newContext(opts)).newPage();
  await p.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await p.waitForSelector('.u256', { state: 'detached', timeout: 20000 });
  await p.waitForTimeout(6500);
  const r = await p.evaluate(async () => {
    await document.fonts.ready;
    const ff = (el) => getComputedStyle(el).fontFamily.split(',')[0];
    const real = (el, fam) => document.fonts.check(`16px "${fam}"`) ? 'cargada' : 'NO cargada';
    const h1 = document.querySelector('#hero-title'), p = document.querySelector('#inicio p.text-ink-2'), ann = document.querySelector('[data-label="a60"]'), kick = document.querySelector('.kicker');
    return {
      h1: ff(h1) + ' (' + real(h1, 'Montserrat') + ')',
      parrafo: ff(p) + ' (' + real(p, 'Roboto') + ')',
      anotacion_svg: ann.getAttribute('font-family') + ' → ' + getComputedStyle(ann).fontFamily.split(',')[0] + ' (' + real(ann, 'Roboto Mono') + ')',
      kicker: ff(kick),
      fuentes_cargadas: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight}`).filter((v, i, a) => a.indexOf(v) === i).join(', '),
    };
  });
  console.log(name, JSON.stringify(r, null, 1));
  await p.screenshot({ path: `${OUT}/hero-${name}.png` });
}
await b.close();
