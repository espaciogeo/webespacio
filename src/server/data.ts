// Capa de datos del build: lista de rutas y datos de cada una. Solo se ejecuta en el prerender (y en dev).
import { marked } from 'marked';
import site from '../content/wp/site.json';
import postsIndex from '../content/wp/posts-index.json';
import mediaManifest from '../content/media-manifest.json';
import newsManifest from '../content/news-manifest.json';
import newsIndex from '../content/substack/news-index.json';
import newsRedirects from '../content/substack/news-redirects.json';
import externasManifest from '../content/externas-manifest.json';
import localManifest from '../content/local-manifest.json';
import { externas } from '../content/formaciones';
import { MOVES, REPLACED, SUBDOMAIN_REDIRECTS, EBOOK_REDIRECTS, formacionesIndex, ebooksIndex } from '../content/colecciones';
import type { MediaRef, RouteData, PostCard, Head, Block, PageData, TocItem, Author, CollectionData } from '../types';

const ORIGIN = 'https://espaciodegeometriasagrada.com';
const pageFiles = import.meta.glob('../content/wp/pages/*.json', { eager: true, import: 'default' }) as Record<string, any>;
const postMd = import.meta.glob('../content/wp/posts/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const newsMd = import.meta.glob('../content/substack/news/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const manifest = { ...mediaManifest, ...newsManifest, ...externasManifest } as Record<string, { name: string; w: number; h: number }>;
const local = localManifest as Record<string, MediaRef>;

export const PER_PAGE = 12;
const posts = postsIndex as any[];

/* ---------- media ---------- */
export function media(ref?: string | null): MediaRef | null {
  if (!ref) return null;
  if (ref.startsWith('local:')) return local[ref.slice(6)] ?? null;
  const k = ref.startsWith('media:') ? ref.slice(6) : ref;
  const m = manifest[k];
  return m ? { name: m.name, w: m.w, h: m.h } : null;
}
const pictureHtml = (m: MediaRef, alt: string) =>
  `<picture><source type="image/avif" srcset="/media/${m.name}-800.avif 800w, /media/${m.name}-1600.avif ${m.w}w" sizes="(min-width: 1024px) 720px, 100vw"><img src="/media/${m.name}-800.webp" srcset="/media/${m.name}-800.webp 800w, /media/${m.name}-1600.webp ${m.w}w" sizes="(min-width: 1024px) 720px, 100vw" width="${m.w}" height="${m.h}" alt="${alt.replace(/"/g, '&quot;')}" loading="lazy" decoding="async"></picture>`;
function resolveHtml(html: string): string {
  return html.replace(/<img[^>]*src="media:([^"]+)"[^>]*?(?:alt="([^"]*)")?[^>]*>/g, (_m, k, alt) => {
    const m = media(k);
    return m ? pictureHtml(m, alt || '') : '';
  });
}
const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const ytLite = (id: string) =>
  `<div class="yt-lite" data-yt="${id}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360"><button type="button" aria-label="Reproducir video"><span></span></button></div>`;

/* ---------- entradas: WordPress + News Geométricos de Substack ---------- */
const NEWS_CAT = { slug: 'news-geometrico', name: 'News Geométrico', description: 'Los News Geométricos de Monique Dumoulin y Pablo Pettinaroli: historias, trazos y la vida del Espacio, numerados del 01 al 26.' };
const allCategories = [{ ...NEWS_CAT, count: (newsIndex as any[]).length }, ...site.categories];
const catName = (slug: string) => allCategories.find((c) => c.slug === slug)?.name ?? slug;
type Entry = { kind: 'wp' | 'news'; raw: any; number?: number; slug: string; path: string; title: string; date: string; modified: string; excerpt: string; authors: Author[]; categories: string[]; image: string | null; readingMinutes: number; seo: { title: string; description: string }; subtitle?: string; aboutBook?: boolean; substackUrl?: string };
const entries: Entry[] = [
  ...posts.map((p): Entry => ({ kind: 'wp', raw: p, slug: p.slug, path: p.path, title: p.title, date: p.date, modified: p.modified, excerpt: p.excerpt, authors: [p.author], categories: p.categories, image: p.image, readingMinutes: p.readingMinutes, seo: p.seo })),
  ...(newsIndex as any[]).map((n): Entry => ({ kind: 'news', raw: n, number: n.number, slug: n.slug, path: n.path, title: n.title, date: n.date, modified: n.modified, excerpt: n.excerpt, authors: n.authors, categories: n.categories, image: n.image, readingMinutes: n.readingMinutes, seo: { title: '', description: n.subtitle || n.excerpt }, subtitle: n.subtitle, aboutBook: n.aboutBook, substackUrl: n.substackUrl })),
].sort((a, b) => b.date.localeCompare(a.date) || (b.number ?? 0) - (a.number ?? 0));
const news = entries.filter((e) => e.kind === 'news').sort((a, b) => a.number! - b.number!);
const authorsAll: Author[] = [...new Map(entries.flatMap((e) => e.authors).map((a) => [a.slug, a])).values()];

const card = (p: Entry): PostCard => ({
  kind: p.kind, number: p.number, slug: p.slug, path: p.path, title: p.title, date: p.date, excerpt: p.excerpt, authors: p.authors,
  categories: p.categories.map((c) => ({ slug: c, name: catName(c) })), image: media(p.image), readingMinutes: p.readingMinutes,
});

const figureHtml = (key: string, caption: string, alt: string) => {
  const m = media(key);
  if (!m) return '';
  return `<figure class="fig">${pictureHtml(m, caption || alt)}${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
};
function entryHtml(e: Entry): { html: string; toc: TocItem[] } {
  const md = e.kind === 'news' ? newsMd[`../content/substack/news/${e.slug}.md`] ?? '' : postMd[`../content/wp/posts/${e.slug}.md`] ?? '';
  const pre = md
    .replace(/\{\{youtube:([\w-]{11})\}\}/g, (_m, id) => `\n\n<!--YT:${id}-->\n\n`)
    .replace(/\{\{figure:([^|}]+)\|([^}]*)\}\}/g, (_m, k, cap) => `\n\n<!--FIG:${k}|${cap.trim()}-->\n\n`);
  let html = marked.parse(pre, { async: false }) as string;
  html = html.replace(/<!--YT:([\w-]{11})-->/g, (_m, id) => ytLite(id));
  html = html.replace(/<!--FIG:([^|]+)\|([^>]*?)-->/g, (_m, k, cap) => figureHtml(k, cap, e.number ? `Imagen del News Geométrico #${String(e.number).padStart(2, '0')}` : ''));
  html = html.replace(/<img src="media:([^"]+)" alt="([^"]*)"\s*\/?>/g, (_m, k, alt) => { const m = media(k); return m ? pictureHtml(m, alt) : ''; });
  // un solo estilo de énfasis: sin negrita y cursiva apiladas
  html = html.replace(/<em>\s*<strong>([\s\S]*?)<\/strong>\s*<\/em>/g, '<strong>$1</strong>').replace(/<strong>\s*<em>([\s\S]*?)<\/em>\s*<\/strong>/g, '<strong>$1</strong>');
  html = html.replace(/<p>\s*<\/p>/g, '');
  const toc: TocItem[] = [];
  const used = new Set<string>();
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, lv, inner) => {
    let id = slugify(inner) || 'seccion';
    while (used.has(id)) id += '-2';
    used.add(id);
    toc.push({ id, text: inner.replace(/<[^>]+>/g, ''), level: Number(lv) });
    return `<h${lv} id="${id}">${inner}</h${lv}>`;
  });
  // los news casi no tienen subtítulos: el índice se arma con los párrafos destacados en negrita que funcionan como intertítulo
  if (e.kind === 'news' && toc.length < 2) {
    html = html.replace(/<p><strong>([^<]{4,70})<\/strong><\/p>/g, (m, inner) => {
      if (/^["“«¿¡(]|abrazo|^(Monique|Pablo)\b|^PD/i.test(inner.trim())) return m;
      let id = slugify(inner) || 'seccion';
      while (used.has(id)) id += '-2';
      used.add(id);
      toc.push({ id, text: inner, level: 2 });
      return `<h2 id="${id}" class="news-h">${inner}</h2>`;
    });
  }
  return { html: relinkHtml(html), toc };
}

/* ---------- links internos: rutas mudadas y subdominios traídos al sitio ---------- */
const OLD_TO_NEW: Record<string, string> = { ...MOVES, ...REPLACED, ...Object.fromEntries(EBOOK_REDIRECTS) };
const SUB_TO_NEW = SUBDOMAIN_REDIRECTS.filter((r) => r.from !== '/*').map((r) => [`https://${r.host}${r.from}`, r.to] as const);
const SUB_HOME = Object.fromEntries(SUBDOMAIN_REDIRECTS.filter((r) => r.from === '/*').map((r) => [r.host, r.to]));
export function relink(href: string): string {
  if (!href) return href;
  const [path, hash = ''] = href.split('#');
  const abs = path.replace(/^https?:\/\/(www\.)?espaciodegeometriasagrada\.com/, '');
  const withSlash = abs.startsWith('/') && !abs.includes('?') && !abs.endsWith('/') ? abs + '/' : abs;
  if (OLD_TO_NEW[withSlash]) return OLD_TO_NEW[withSlash] + (hash ? '#' + hash : '');
  for (const [from, to] of SUB_TO_NEW) if (path.replace(/\/$/, '') === from.replace(/\/$/, '')) return to;
  const host = path.match(/^https?:\/\/([^/]+)/)?.[1];
  if (host && SUB_HOME[host]) return SUB_HOME[host];
  return href;
}
const relinkHtml = (html: string) => html.replace(/href="([^"]+)"/g, (_m, h) => `href="${relink(h)}"`);

/* ---------- páginas ---------- */
function resolveBlock(b: any): Block | null {
  switch (b.t) {
    case 'image': { const m = media(b.src); return m ? { ...b, src: m, href: b.href && relink(b.href) } : null; }
    case 'text': { const html = relinkHtml(resolveHtml(b.html)); return html.trim() ? { ...b, html } : null; }
    case 'button': return { ...b, href: relink(b.href) };
    case 'list': return { ...b, items: b.items.map((i: any) => ({ ...i, href: i.href && relink(i.href) })) };
    case 'card': return { ...b, html: relinkHtml(resolveHtml(b.html || '')), img: media(b.img), href: b.href && relink(b.href) };
    case 'testimonial': return { ...b, img: media(b.img) };
    case 'gallery': { const images = b.images.map(media).filter(Boolean); return images.length ? { ...b, images } : null; }
    case 'accordion': return { ...b, items: b.items.map((i: any) => ({ ...i, html: relinkHtml(resolveHtml(i.html)) })) };
    case 'tickets': return { ...b, items: b.items.map((i: any) => ({ ...i, img: media(i.img) })) };
    default: return b;
  }
}
function pageData(raw: any): PageData {
  const path = MOVES[raw.path] ?? raw.path;
  const moved = path !== raw.path && path.startsWith('/formaciones/');
  const parent = path.replace(/[^/]+\/$/, '');
  return {
    ...raw,
    path,
    breadcrumb: raw.breadcrumb ?? (moved ? [{ label: 'Formaciones', href: '/formaciones/' }, ...(parent !== '/formaciones/' && parent.split('/').length > 3 ? [{ label: (externasByPath[parent]?.title ?? pagesByPath[parent]?.title ?? 'Volver'), href: parent }] : [])] : undefined),
    hero: raw.hero ? { ...raw.hero, image: media(raw.hero.image) } : undefined,
    cta: raw.cta ? { ...raw.cta, href: relink(raw.cta.href) } : undefined,
    faq: raw.faq?.map((f: any) => ({ ...f, html: relinkHtml(f.html) })),
    sections: raw.sections.map((s: any) => ({ ...s, blocks: s.blocks.map(resolveBlock).filter(Boolean) })).filter((s: any) => s.blocks.length),
  };
}
const externasByPath = Object.fromEntries(externas.map((p) => [p.path, p]));
const wpRaw = Object.values(pageFiles).filter((p: any) => !REPLACED[p.path]);
const pagesByPath = Object.fromEntries(wpRaw.map((p: any) => [MOVES[p.path] ?? p.path, p]));
const pages = [...wpRaw, ...externas].map(pageData);

function collection(raw: any): CollectionData {
  return { ...raw, groups: raw.groups.map((g: any) => ({ ...g, items: g.items.map((i: any) => ({ ...i, image: media(i.image) })) })) };
}

/* ---------- head ---------- */
const SITE_NAME = 'Espacio de Geometría Sagrada';
const OG_DEFAULT = '/img/equipo-duo-1600.webp';
function head(h: Partial<Head> & { path: string; title: string }): Head {
  return {
    title: h.title.includes(SITE_NAME) ? h.title : `${h.title} · ${SITE_NAME}`,
    description: h.description || 'Formación online en Geometría Sagrada desde 2014: clase gratuita mensual, cursos, eBooks y la primera Formación Profesional de habla hispana.',
    canonical: ORIGIN + h.path,
    image: ORIGIN + (h.image || OG_DEFAULT),
    noindex: !!h.noindex,
    type: h.type || 'website',
    jsonld: h.jsonld,
  };
}
const ogImg = (m: MediaRef | null) => (m ? `/${m.dir || 'media'}/${m.name}-1600.webp` : undefined);

/* ---------- rutas ---------- */
type R = { path: string; data: () => RouteData };
function archiveRoutes(base: string, list: Entry[], meta: { kicker: string; title: string; description: string; active?: string; author?: string }): R[] {
  const pagesN = Math.max(1, Math.ceil(list.length / PER_PAGE));
  return Array.from({ length: pagesN }, (_, i) => {
    const n = i + 1;
    const path = n === 1 ? base : `${base}page/${n}/`;
    return {
      path,
      data: (): RouteData => ({
        type: 'archive', ...meta, page: n, pages: pagesN, basePath: base,
        posts: list.slice(i * PER_PAGE, n * PER_PAGE).map(card),
        categories: allCategories.map((c) => ({ slug: c.slug, name: c.name, count: c.count })),
        head: head({ path, title: n > 1 ? `${meta.title} — página ${n}` : meta.title, description: meta.description }),
      }),
    };
  });
}

export function routes(): R[] {
  const r: R[] = [];
  r.push({ path: '/', data: () => ({ type: 'home', head: head({ path: '/', title: `${SITE_NAME} · Formación online desde 2014` }) }) });
  r.push({
    path: '/clase-gratuita/',
    data: () => ({ type: 'clase', head: head({ path: '/clase-gratuita/', title: 'Clase gratuita mensual', description: 'Un sábado al mes nos encontramos en vivo para compartir y multiplicar la Geometría Sagrada. Inscribite gratis.' }) }),
  });
  for (const p of pages) {
    r.push({
      path: p.path,
      data: () => {
        const firstImg = p.sections.flatMap((s) => s.blocks).find((b) => b.t === 'image') as any;
        const isCourse = p.path.startsWith('/formaciones/') && !p.path.includes('/experiencias/') && p.kind === 'producto';
        const isEvent = p.path.startsWith('/formaciones/experiencias/') && p.path !== '/formaciones/experiencias/';
        const jsonld = p.faq?.length
          ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.title, acceptedAnswer: { '@type': 'Answer', text: f.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() } })) }
          : isCourse ? { '@context': 'https://schema.org', '@type': 'Course', name: p.title, description: p.seo.description || p.hero?.lede, provider: { '@type': 'Organization', name: SITE_NAME, sameAs: ORIGIN } }
          : isEvent ? undefined : undefined;
        return { type: 'page', page: p, head: head({ path: p.path, title: p.seo.title || p.title, description: p.seo.description || p.hero?.lede, noindex: p.noindex, image: ogImg(p.hero?.image ?? firstImg?.src ?? null), jsonld }) };
      },
    });
  }
  const fi = collection(formacionesIndex);
  r.push({ path: '/formaciones/', data: () => ({ type: 'collection', collection: fi, head: head({ path: '/formaciones/', title: 'Formaciones', description: fi.lede, jsonld: { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: fi.groups.flatMap((g) => g.items).map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: ORIGIN + it.path, name: it.title })) } }) }) });
  const ei = collection(ebooksIndex);
  r.push({ path: '/ebooks/', data: () => ({ type: 'collection', collection: ei, head: head({ path: '/ebooks/', title: 'eBooks', description: ei.lede, image: ogImg(ei.groups[0].items[0].image ?? null) }) }) });
  r.push(...archiveRoutes('/blog/', entries, { kicker: 'Blog', title: 'Artículos', description: 'News Geométricos, trazos, sólidos platónicos, armonización de espacios, medicina de la forma y reflexiones del Espacio de Geometría Sagrada.' }));
  for (const c of allCategories) {
    const list = c.slug === NEWS_CAT.slug ? [...news].reverse() : entries.filter((p) => p.categories.includes(c.slug));
    r.push(...archiveRoutes(`/category/${c.slug}/`, list, { kicker: 'Categoría', title: c.name, description: c.description || `Artículos sobre ${c.name}.`, active: c.slug }));
  }
  for (const a of authorsAll) {
    r.push(...archiveRoutes(`/author/${a.slug}/`, entries.filter((p) => p.authors.some((x) => x.slug === a.slug)), { kicker: 'Autor', title: a.name, description: `Artículos de ${a.name} en el Espacio de Geometría Sagrada.`, author: a.slug }));
  }
  for (const p of entries) {
    r.push({
      path: p.path,
      data: () => {
        const { html, toc } = entryHtml(p);
        const c = card(p);
        const pool = entries.filter((x) => x.slug !== p.slug);
        const related = pool.filter((x) => x.categories.some((k) => p.categories.includes(k)) && x.kind === p.kind).slice(0, 3);
        const fill = pool.filter((x) => !related.includes(x)).slice(0, 3 - related.length);
        const i = p.kind === 'news' ? news.indexOf(p) : -1;
        return {
          type: 'post',
          post: { ...c, html, toc, modified: p.modified, subtitle: p.subtitle, aboutBook: p.aboutBook, substackUrl: p.substackUrl },
          related: [...related, ...fill].map(card),
          prev: i > 0 ? card(news[i - 1]) : null,
          next: i >= 0 && i < news.length - 1 ? card(news[i + 1]) : null,
          head: head({
            path: p.path, title: p.seo.title || (p.number ? `News Geométrico #${String(p.number).padStart(2, '0')}: ${p.title}` : p.title), description: p.seo.description || p.excerpt, image: ogImg(c.image), type: 'article',
            jsonld: {
              '@context': 'https://schema.org', '@type': 'Article', headline: p.title, datePublished: p.date, dateModified: p.modified,
              author: p.authors.map((a) => ({ '@type': 'Person', name: a.name, url: `${ORIGIN}/author/${a.slug}/` })),
              publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: `${ORIGIN}/img/logo.png` } },
              image: c.image ? `${ORIGIN}/media/${c.image.name}-1600.webp` : undefined, mainEntityOfPage: ORIGIN + p.path, description: p.excerpt,
              ...(p.number ? { isPartOf: { '@type': 'CreativeWorkSeries', name: 'News Geométrico' }, position: p.number } : {}),
            },
          }),
        };
      },
    });
  }
  return r;
}

export function notFound(): RouteData {
  return { type: '404', head: head({ path: '/404/', title: 'Página no encontrada', noindex: true }) };
}

export function dataFor(path: string): RouteData {
  const p = path.endsWith('/') ? path : path + '/';
  return routes().find((r) => r.path === p)?.data() ?? notFound();
}

export const siteMenus = site.menus;
export const newsRedirectList = newsRedirects as [string, string][];
// 301 de las páginas mudadas a /formaciones/ y /ebooks/, y de los subdominios traídos al sitio
export const movedRedirects: [string, string][] = [...Object.entries(MOVES), ...Object.entries(REPLACED), ...EBOOK_REDIRECTS];
export const subdomainRedirects = SUBDOMAIN_REDIRECTS;
