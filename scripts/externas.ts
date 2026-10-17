// Renderiza las páginas externas (GoHighLevel) con Playwright, hace scroll hasta abajo para disparar la
// carga diferida y guarda el HTML renderizado + un volcado estructurado (texto en orden, links, imágenes,
// videos, iframes) en _contenido/externas/<subdominio>/.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('../_contenido/externas');
const PAGES: { key: string; urls: string[] }[] = [
  { key: 'experiencias', urls: ['https://experiencias.espaciodegeometriasagrada.com/'] },
  { key: 'formadores', urls: ['https://formadores.espaciodegeometriasagrada.com/club-page'] },
  { key: 'admision', urls: ['https://admision.espaciodegeometriasagrada.com/'] },
  { key: 'especializacion', urls: ['https://especializacion.espaciodegeometriasagrada.com/', 'https://especializacion.espaciodegometriasagrada.com/'] },
  { key: 'libro', urls: ['https://libro.espaciodegeometriasagrada.com/promo-lanzamiento'] },
  // pasos de embudo a los que llevan los botones (fechas, postulaciones, entrevista)
  ...['presentacionlibro', 'bsas-2811', 'uruguay-0327-321941', 'postula-espacio', 'productores'].map((s) => ({ key: `experiencias/${s}`, urls: [`https://experiencias.espaciodegeometriasagrada.com/${s}`] })),
  { key: 'admision/solicita-tu-entrevista-fpgs', urls: ['https://admision.espaciodegeometriasagrada.com/solicita-tu-entrevista-fpgs'] },
];
const ONLY = process.argv.slice(2);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36' });
const summary: Record<string, unknown> = {};
for (const { key, urls } of PAGES.filter((p) => !ONLY.length || ONLY.some((o) => p.key.startsWith(o)))) {
  let done = false;
  for (const url of urls) {
    const page = await ctx.newPage();
    try {
      const res = await page.goto(url, { waitUntil: 'load', timeout: 90000 }); await page.waitForTimeout(4000);
      const status = res?.status() ?? 0;
      if (status >= 400) throw new Error('HTTP ' + status);
      // scroll progresivo para la carga diferida
      for (let i = 0; i < 60; i++) {
        const end = await page.evaluate(() => { window.scrollBy(0, 700); return window.scrollY + innerHeight >= document.documentElement.scrollHeight - 5; });
        await page.waitForTimeout(250);
        if (end) break;
      }
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(1500);
      const data = await page.evaluate(() => {
        const vis = (e: Element) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
        const abs = (u: string) => { try { return new URL(u, location.href).href; } catch { return u; } };
        const items: unknown[] = [];
        const seen = new Set<Element>();
        const walker = document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,a,button,img,iframe,video,blockquote,summary,[class*="faq"] [class*="title"],[class*="faq"] [class*="content"],span.text-output,div.text-output');
        for (const e of walker) {
          if (seen.has(e) || !vis(e) && !['IMG', 'IFRAME', 'VIDEO'].includes(e.tagName)) continue;
          seen.add(e);
          const tag = e.tagName.toLowerCase();
          const r = e.getBoundingClientRect();
          const y = Math.round(r.top + scrollY);
          if (tag === 'img') { const im = e as HTMLImageElement; const src = im.currentSrc || im.src || im.dataset.src || ''; if (src && !src.startsWith('data:')) items.push({ t: 'img', src: abs(src), alt: im.alt, w: im.naturalWidth, h: im.naturalHeight, y }); continue; }
          if (tag === 'iframe') { items.push({ t: 'iframe', src: abs((e as HTMLIFrameElement).src || e.getAttribute('data-src') || ''), y, h: Math.round(r.height) }); continue; }
          if (tag === 'video') { items.push({ t: 'video', src: abs((e as HTMLVideoElement).currentSrc || (e as HTMLVideoElement).src), y }); continue; }
          const text = (e as HTMLElement).innerText?.trim().replace(/\s+\n/g, '\n');
          if (tag === 'a' || tag === 'button') { const href = (e as HTMLAnchorElement).href || e.closest('a')?.href || ''; items.push({ t: tag, text, href, y }); continue; }
          if (!text) continue;
          // evita duplicar texto de contenedores que ya tienen hijos capturados
          if (e.querySelector('h1,h2,h3,h4,h5,h6,p,li')) continue;
          items.push({ t: tag, text, y });
        }
        // backgrounds de imagen
        const bgs = [...document.querySelectorAll<HTMLElement>('*')].map((e) => getComputedStyle(e).backgroundImage).filter((b) => b && b.includes('url(')).flatMap((b) => [...b.matchAll(/url\(["']?([^"')]+)/g)].map((m) => abs(m[1])));
        const links = [...document.querySelectorAll('a[href]')].map((a) => ({ text: (a as HTMLElement).innerText.trim(), href: (a as HTMLAnchorElement).href }));
        return { title: document.title, description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '', ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '', items, bgs: [...new Set(bgs)], links };
      });
      const dir = path.join(OUT, key);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'renderizado.html'), await page.content());
      fs.writeFileSync(path.join(dir, 'texto.txt'), await page.evaluate(() => document.body.innerText));
      fs.writeFileSync(path.join(dir, 'extraido.json'), JSON.stringify({ url: page.url(), requested: url, status, ...data }, null, 1));
      await page.screenshot({ path: path.join(dir, 'original.png'), fullPage: true }).catch(() => {});
      summary[key] = { url: page.url(), status, items: data.items.length, links: data.links.length };
      done = true;
      await page.close();
      break;
    } catch (e) {
      summary[key + ' ' + url] = { error: String(e) };
      await page.close();
    }
  }
  if (!done) console.warn('no se pudo', key);
}
await browser.close();
console.log(JSON.stringify(summary, null, 1));
