// Chequeo móvil de TODAS las rutas prerenderizadas en 320, 360, 375, 390 y 414 px.
// Por ruta y ancho:
//  - scroll horizontal: documentElement.scrollWidth > innerWidth
//  - desbordes: elementos visibles con rect.right > innerWidth o rect.left < 0 que no estén recortados por
//    un ancestro con overflow oculto (selector, ancho, ruta)
//  - texto cortado (overflow oculto con contenido más ancho) y textos superpuestos
//  - botones de menos de 44 px de alto
//  - texto de cuerpo por debajo de 17 px
// Salida: tabla en consola y _capturas/check-mobile.md (+ detalle en check-mobile.json).
import { chromium, type Page } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4173';
const WIDTHS = [320, 360, 375, 390, 414];
const only = process.argv[3];
let routes: string[] = JSON.parse(fs.readFileSync('dist-ssr/routes.json', 'utf8')).map((r: { path: string }) => r.path);
routes.push('/404.html');
if (only) routes = routes.filter((r) => r.includes(only));

type Issue = { kind: 'overflow' | 'cut' | 'overlap' | 'button' | 'small-text'; sel: string; detail: string };
type Res = { path: string; w: number; scroll: boolean; issues: Issue[] };

async function audit(page: Page, path: string, w: number): Promise<Res> {
  try { await page.goto(BASE + path, { waitUntil: 'load', timeout: 45000 }); }
  catch { await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 60000 }); }
  await page.waitForTimeout(250);
  // recorre la página para disparar reveals y carga diferida, y vuelve arriba
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += innerHeight * 0.9) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 900));
  });
  return page.evaluate(({ path, w }) => {
    const vw = window.innerWidth;
    // body tiene overflow-x: clip como red de seguridad: para medir de verdad se desactiva durante el chequeo
    document.body.style.overflowX = 'visible'; document.documentElement.style.overflowX = 'visible';
    const issues: { kind: string; sel: string; detail: string }[] = [];
    const sel = (e: Element) => {
      let s = e.tagName.toLowerCase();
      if (e.id) s += '#' + e.id;
      const c = (e.getAttribute('class') || '').split(/\s+/).filter((x) => x && !x.includes(':') && !x.includes('[')).slice(0, 3);
      if (c.length) s += '.' + c.join('.');
      const p = e.parentElement;
      return (p && p !== document.body ? (p.tagName.toLowerCase() + (p.getAttribute('class') ? '.' + (p.getAttribute('class') || '').split(/\s+/)[0] : '') + ' > ') : '') + s;
    };
    const visible = (e: Element) => {
      const st = getComputedStyle(e);
      if (st.display === 'none' || st.visibility === 'hidden' || Number(st.opacity) === 0) return false;
      if (e.closest('[hidden],[aria-hidden="true"] *,#menu-movil')) return false;
      const r = e.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    // ¿algún ancestro recorta horizontalmente este elemento dentro del viewport?
    const clipped = (e: Element) => {
      for (let p = e.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
        const st = getComputedStyle(p);
        if (/(hidden|clip|auto|scroll)/.test(st.overflowX) || /(hidden|clip)/.test(st.overflow)) {
          const r = p.getBoundingClientRect();
          if (r.right <= vw + 1 && r.left >= -1) return true;
        }
        if (st.clipPath && st.clipPath !== 'none') return true;
      }
      return false;
    };
    const scroll = document.documentElement.scrollWidth > vw;
    const all = [...document.body.querySelectorAll('*')].filter((e) => !(e instanceof SVGElement && e.tagName !== 'svg'));
    const seen = new Set<Element>();
    for (const e of all) {
      if (!visible(e)) continue;
      const r = e.getBoundingClientRect();
      if ((r.right > vw + 1 || r.left < -1) && !clipped(e)) {
        // reportar solo el elemento más externo que desborda
        let p = e.parentElement, inner = false;
        while (p) { if (seen.has(p)) { inner = true; break; } p = p.parentElement; }
        seen.add(e);
        if (!inner) issues.push({ kind: 'overflow', sel: sel(e), detail: `left ${Math.round(r.left)} right ${Math.round(r.right)} ancho ${Math.round(r.width)}` });
      }
    }
    // texto cortado: contenedor de texto con overflow oculto y contenido más ancho
    for (const e of document.querySelectorAll('main h1, main h2, main h3, main p, main a, main button, main li, main dd, main td, header a, header button, footer a, footer p, main section > h2')) {
      if (!visible(e) || e.classList.contains('sr-only')) continue;
      const st = getComputedStyle(e);
      if (/(hidden|clip)/.test(st.overflowX) && e.scrollWidth > e.clientWidth + 2 && st.textOverflow !== 'ellipsis') issues.push({ kind: 'cut', sel: sel(e), detail: `scroll ${e.scrollWidth} > ${e.clientWidth}` });
    }
    // textos superpuestos (cajas de texto que se pisan sin contenerse). Se descartan: elementos dentro de capas
    // fijas/sticky (barra CTA, navbar), texto recortado por un ancestro (acordeón cerrado, máscara) y pares de
    // regiones distintas (el footer se revela por debajo del contenido a propósito).
    const layered = (e: Element) => { for (let p: Element | null = e; p; p = p.parentElement) { const ps = getComputedStyle(p).position; if (ps === 'fixed' || ps === 'sticky') return true; } return false; };
    const shown = (e: Element) => {
      let r = e.getBoundingClientRect();
      const area = r.width * r.height;
      let x0 = r.left, y0 = r.top, x1 = r.right, y1 = r.bottom;
      for (let p = e.parentElement; p; p = p.parentElement) {
        const st = getComputedStyle(p);
        if (/(hidden|clip)/.test(st.overflowY) || /(hidden|clip)/.test(st.overflowX)) { const q = p.getBoundingClientRect(); x0 = Math.max(x0, q.left); y0 = Math.max(y0, q.top); x1 = Math.min(x1, q.right); y1 = Math.min(y1, q.bottom); }
      }
      return Math.max(0, x1 - x0) * Math.max(0, y1 - y0) > area * 0.6;
    };
    const region = (e: Element) => e.closest('main, footer, header');
    const texts = [...document.querySelectorAll('main h1, main h2, main h3, main h4, main p, main li, main .btn, main dt, main dd, footer p, footer li')]
      .filter((e) => visible(e) && !e.closest('.u237-ln') && !layered(e) && shown(e) && getComputedStyle(e).position !== 'absolute')
      .map((e) => ({ e, r: e.getBoundingClientRect(), g: region(e) }));
    for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i], b = texts[j];
      if (a.g !== b.g || a.e.contains(b.e) || b.e.contains(a.e)) continue;
      const x = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
      const y = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (x > 6 && y > 6) issues.push({ kind: 'overlap', sel: `${sel(a.e)}  ×  ${sel(b.e)}`, detail: `${Math.round(x)}×${Math.round(y)} px` });
    }
    // botones < 44 px
    for (const e of document.querySelectorAll('.btn, button, [role="button"], input[type="submit"], .seg-btn, .link-arrow, .u217-pick, .country')) {
      if (!visible(e) || e.closest('.u044-pm')) continue;
      const r = e.getBoundingClientRect();
      if (r.height < 44) issues.push({ kind: 'button', sel: sel(e), detail: `alto ${Math.round(r.height)} px · "${(e.textContent || '').trim().slice(0, 30)}"` });
    }
    // cuerpo de texto ≥ 17 px (párrafos y listas del contenido; se excluyen rótulos mono, notas legales y pies)
    for (const e of document.querySelectorAll('main p, main li')) {
      if (!visible(e) || e.closest('.kicker, .mono, figcaption, .text-small, small, nav, .u217-dl dt')) continue;
      if ((e as HTMLElement).classList.contains('kicker') || (e as HTMLElement).classList.contains('mono')) continue;
      if (!(e.textContent || '').trim() || (e.textContent || '').trim().length < 40) continue;
      const fs = parseFloat(getComputedStyle(e).fontSize);
      if (fs < 17) issues.push({ kind: 'small-text', sel: sel(e), detail: `${fs}px · "${(e.textContent || '').trim().slice(0, 30)}"` });
    }
    return { path, w, scroll, issues };
  }, { path, w }) as Promise<Res>;
}

const browser = await chromium.launch();
const jobs = routes.flatMap((p) => WIDTHS.map((w) => ({ p, w })));
const results: Res[] = [];
const contexts = new Map<number, ReturnType<typeof browser.newContext>>();
await Promise.all(Array.from({ length: 6 }, async (_, k) => {
  const pages = new Map<number, Page>();
  while (jobs.length) {
    const { p, w } = jobs.shift()!;
    if (!pages.has(w)) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 760 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
      await ctx.addInitScript(() => { try { sessionStorage.setItem('egs-loader', '1'); } catch { /* */ } });
      pages.set(w, await ctx.newPage());
    }
    try { results.push(await audit(pages.get(w)!, p, w)); }
    catch (e) { results.push({ path: p, w, scroll: true, issues: [{ kind: 'overflow', sel: 'ERROR', detail: String(e).slice(0, 120) }] }); }
  }
  void k; void contexts;
}));
await browser.close();

results.sort((a, b) => a.path.localeCompare(b.path) || a.w - b.w);
const count = (r: Res, k: Issue['kind']) => r.issues.filter((i) => i.kind === k).length;
const byPath = new Map<string, Res[]>();
for (const r of results) byPath.set(r.path, [...(byPath.get(r.path) || []), r]);
const head = `| ruta | ${WIDTHS.map((w) => `${w}`).join(' | ')} | botones <44 | texto <17px | superpuestos | cortados |`;
const rows = [...byPath].map(([p, rs]) => `| ${p} | ${rs.map((r) => (r.scroll || count(r, 'overflow') ? `✗ ${count(r, 'overflow')}${r.scroll ? ' +scroll' : ''}` : '✓ 0')).join(' | ')} | ${rs.reduce((a, r) => a + count(r, 'button'), 0)} | ${rs.reduce((a, r) => a + count(r, 'small-text'), 0)} | ${rs.reduce((a, r) => a + count(r, 'overlap'), 0)} | ${rs.reduce((a, r) => a + count(r, 'cut'), 0)} |`);
const total = (k: Issue['kind']) => results.reduce((a, r) => a + count(r, k), 0);
const withScroll = results.filter((r) => r.scroll).length;
const summary = `Rutas: ${byPath.size} · anchos: ${WIDTHS.join(', ')} · combinaciones: ${results.length}\nScroll horizontal: ${withScroll} · elementos desbordados: ${total('overflow')} · botones <44 px: ${total('button')} · texto <17 px: ${total('small-text')} · superpuestos: ${total('overlap')} · cortados: ${total('cut')}`;
fs.mkdirSync('../_capturas', { recursive: true });
fs.writeFileSync('../_capturas/check-mobile.md', `# Chequeo móvil\n\n${summary}\n\n${head}\n|${'---|'.repeat(WIDTHS.length + 5)}\n${rows.join('\n')}\n`);
fs.writeFileSync('../_capturas/check-mobile.json', JSON.stringify(results.filter((r) => r.issues.length || r.scroll), null, 1));
// detalle agrupado por selector para corregir
const agg = new Map<string, { n: number; ex: string; paths: Set<string> }>();
for (const r of results) for (const i of r.issues) { const k = `${i.kind} ${i.sel}`; const a = agg.get(k) || { n: 0, ex: `${r.path}@${r.w}: ${i.detail}`, paths: new Set() }; a.n++; a.paths.add(r.path); agg.set(k, a); }
console.log(head); console.log(rows.join('\n'));
console.log('\n' + summary);
console.log('\nDetalle por selector:');
for (const [k, a] of [...agg].sort((x, y) => y[1].n - x[1].n).slice(0, 60)) console.log(`${String(a.n).padStart(4)}  ${k}  (${a.paths.size} rutas) ej: ${a.ex}`);
process.exit(withScroll + total('overflow') + total('button') + total('small-text') + total('overlap') + total('cut') === 0 ? 0 : 1);
