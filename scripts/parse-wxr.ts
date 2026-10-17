// Lee la exportación WXR de WordPress y genera _contenido/wp/ (JSON + Markdown) para el sitio nuevo.
// Uso: node scripts/parse-wxr.ts ../_export/<archivo>.xml
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';
import fs from 'node:fs';
import path from 'node:path';

const SRC = process.argv[2];
const OUT = path.resolve('..', '_contenido', 'wp');
const SITE = 'https://espaciodegeometriasagrada.com';

type Meta = { 'wp:meta_key': string; 'wp:meta_value': string };
type Item = Record<string, any> & { 'wp:postmeta'?: Meta[] };

const parser = new XMLParser({
  ignoreAttributes: false, parseTagValue: false, trimValues: false,
  isArray: (n) => ['item', 'wp:postmeta', 'category', 'wp:category', 'wp:term', 'wp:author'].includes(n),
});
const ch = parser.parse(fs.readFileSync(SRC, 'utf8')).rss.channel;
const items: Item[] = ch.item;
const meta = (it: Item, k: string): string | undefined => (it['wp:postmeta'] || []).find((m) => m['wp:meta_key'] === k)?.['wp:meta_value'];
const str = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

/* ---------- clasificación de páginas ---------- */
const MIGRATE: Record<string, 'institucional' | 'legal' | 'producto' | 'confirmacion'> = {
  'que-hacemos': 'institucional', 'quienes-somos': 'institucional', 'monique-dumolin': 'institucional', 'pablo-pettinaroli': 'institucional', contacto: 'institucional',
  'politica-de-privacidad': 'legal', 'descargo-de-responsabilidad': 'legal', 'responsabilidad-empresarial': 'legal',
  cursos: 'producto', 'trazos-re-conociendo-tu-campo-energetico': 'producto', 'los-solidos-platonicos-y-la-estrella-madre': 'producto',
  'ebook-7-trazos-de-geometria-sagrada': 'producto', 'formacion-profesional': 'producto', 'dossier-y-programa': 'producto', formacion_profesional: 'producto',
  'workshop-experiencias-geometricas': 'producto', seminario: 'producto', 'seminario-emprender-estudiantes': 'producto',
  'experiencia-exclusiva': 'producto', 'experiencia-exclusiva-2': 'producto', 'mentoria-emprendimientos': 'producto', actualizate: 'producto', ig: 'producto',
  'entrevista-confirrmada': 'confirmacion', 'pago-confirmado': 'confirmacion', 'experiencia-geometrica-gracias': 'confirmacion',
};
const LEGACY_PAGES = new Set(['tienda', 'carrito', 'finalizar-compra', 'mi-cuenta', 'ayuda', 'tus-datos', 'ingreso-a-la-plataforma', 'acceso', 'mis-cursos', 'registration', 'registration-success', 'registration-2', 'registration-success-2']);
const REPLACED: Record<string, string> = { inicio: '/', 'inicio-nuevo': '/', blog: '/blog/' };

/* ---------- utilidades de contenido ---------- */
const media = new Map<string, { url: string; used: Set<string> }>();
function useImage(url: string, where: string): string {
  if (!url || !/\.(jpe?g|png|webp|gif)(\?|$)/i.test(url)) return url;
  const clean = url.split('?')[0].replace(/^http:/, 'https:');
  const k = clean.replace(/-\d+x\d+(?=\.\w+$)/, '').replace(/-scaled(?=\.\w+$)/, '');
  if (!media.has(k)) media.set(k, { url: clean, used: new Set() });
  media.get(k)!.used.add(where);
  return `media:${k}`;
}
const localLink = (href: string) => {
  if (!href) return href;
  let h = href.trim().replace(/^http:\/\//, 'https://').replace('https://www.espaciodegeometriasagrada', 'https://espaciodegeometriasagrada');
  if (h.startsWith(SITE)) h = h.slice(SITE.length) || '/';
  h = h.replace(/^\/category\/blog\//, '/category/');
  return h;
};
const stripShortcodes = (s: string) => s.replace(/\[\/?[a-z_][\w-]*(?:\s[^\]]*)?\]/gi, '');

// HTML seguro: solo etiquetas de texto, sin estilos ni scripts.
const ALLOWED = new Set(['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'blockquote', 'span']);
function cleanHtml(html: string, where: string): string {
  let s = stripShortcodes(str(html));
  s = s.replace(/<(script|style|iframe|noscript)[\s\S]*?<\/\1>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<img[^>]*src="([^"]+)"[^>]*>/gi, (_, src) => `<img src="${useImage(src, where)}">`);
  s = s.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (tag, name: string, attrs: string) => {
    const n = name.toLowerCase();
    if (n === 'img') return tag;
    if (!ALLOWED.has(n)) return n === 'div' || n === 'h1' ? (tag.startsWith('</') ? '</p>' : '<p>') : '';
    if (n === 'span') return '';
    if (tag.startsWith('</')) return `</${n}>`;
    if (n === 'a') { const m = attrs.match(/href="([^"]*)"/i); return m ? `<a href="${localLink(m[1])}">` : '<a>'; }
    return `<${n}>`;
  });
  s = s.replace(/&nbsp;/g, ' ').replace(/<p>\s*<\/p>/g, '').replace(/\s{2,}/g, ' ').trim();
  return s;
}
const plain = (html: string) => str(html).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8211;/g, '–').replace(/&#8217;/g, '’').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

/* ---------- Elementor ---------- */
type Block =
  | { t: 'heading'; level: number; text: string }
  | { t: 'text'; html: string }
  | { t: 'button'; text: string; href: string }
  | { t: 'image'; src: string; alt?: string; href?: string }
  | { t: 'video'; provider: 'youtube' | 'vimeo' | 'file'; id: string }
  | { t: 'form'; name: string; fields: { label: string; type: string; required: boolean; id: string; options: string[] }[]; submit: string; actions: string[]; formId: string; postId: string; redirect: string }
  | { t: 'testimonial'; text: string; name: string; role?: string; img?: string }
  | { t: 'accordion'; items: { title: string; html: string }[] }
  | { t: 'list'; items: { text: string; href?: string }[] }
  | { t: 'card'; title: string; html: string; img?: string; href?: string }
  | { t: 'counter'; value: string; label: string }
  | { t: 'price'; items: { title: string; price: string; text: string }[] }
  | { t: 'gallery'; images: string[] }
  | { t: 'map'; src: string };
type Section = { blocks: Block[] };
const widgetStats = new Map<string, number>();
const forms: any[] = [];

function ytId(u: string) { const m = str(u).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m?.[1]; }
function vimeoId(u: string) { return str(u).match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1]; }
const linkOf = (l: any) => localLink(str(l?.url));

function widget(w: any, where: string, pageId: string): Block[] {
  const s = w.settings || {};
  const type = str(w.widgetType);
  widgetStats.set(type, (widgetStats.get(type) || 0) + 1);
  switch (type) {
    case 'heading': case 'animated-headline': case 'elementskit-heading': {
      const text = plain(s.title || [s.before_text, s.highlighted_text, s.rotating_text, s.after_text].filter(Boolean).join(' ') || s.ekit_heading_title);
      const lv = Number(str(s.header_size || 'h2').replace('h', '')) || 2;
      return text ? [{ t: 'heading', level: lv, text }] : [];
    }
    case 'text-editor': return s.editor ? [{ t: 'text', html: cleanHtml(s.editor, where) }].filter((b) => b.html) as Block[] : [];
    case 'button': return s.text ? [{ t: 'button', text: plain(s.text), href: linkOf(s.link) }] : [];
    case 'image': return s.image?.url ? [{ t: 'image', src: useImage(s.image.url, where), alt: str(s.image.alt), href: s.link?.url ? linkOf(s.link) : undefined }] : [];
    case 'video': {
      const y = ytId(s.youtube_url); if (y) return [{ t: 'video', provider: 'youtube', id: y }];
      const v = vimeoId(s.vimeo_url); if (v) return [{ t: 'video', provider: 'vimeo', id: v }];
      return [];
    }
    case 'form': {
      const fields = (s.form_fields || []).filter((f: any) => f.field_type !== 'hidden').map((f: any) => ({ label: plain(f.field_label || f.placeholder || f.custom_id), type: str(f.field_type || 'text'), required: f.required === 'true' || f.required === true }));
      const actions = (s.submit_actions || []).map(str);
      const f = { name: str(s.form_name), fields: (s.form_fields || []).filter((x: any) => x.field_type !== 'hidden').map((x: any, k: number) => ({ ...fields[k], id: str(x.custom_id), options: str(x.field_options).split('\n').filter(Boolean) })), submit: plain(s.button_text || 'Enviar'), actions, formId: str(w.id), postId: pageId, redirect: localLink(str(s.redirect_to?.url || s.redirect_to || '')) };
      forms.push({ ...f, page: where, pageId, getresponse_list: s.getresponse_list, mailchimp_list: s.mailchimp_list, activecampaign_list: s.activecampaign_list, webhooks: s.webhooks, email_to: s.email_to, redirect_to: s.redirect_to?.url || s.redirect_to });
      return [{ t: 'form', ...f }];
    }
    case 'testimonial': return s.testimonial_content ? [{ t: 'testimonial', text: plain(s.testimonial_content), name: plain(s.testimonial_name), role: plain(s.testimonial_job), img: s.testimonial_image?.url ? useImage(s.testimonial_image.url, where) : undefined }] : [];
    case 'testimonial-carousel': case 'reviews':
      return (s.slides || []).map((x: any) => ({ t: 'testimonial', text: plain(x.content), name: plain(x.name), role: plain(x.title), img: x.image?.url ? useImage(x.image.url, where) : undefined })).filter((b: any) => b.text);
    case 'accordion': case 'toggle': case 'nested-accordion':
      return s.tabs?.length ? [{ t: 'accordion', items: s.tabs.map((x: any) => ({ title: plain(x.tab_title), html: cleanHtml(x.tab_content, where) })) }] : [];
    case 'icon-list':
      return s.icon_list?.length ? [{ t: 'list', items: s.icon_list.map((x: any) => ({ text: plain(x.text), href: x.link?.url ? linkOf(x.link) : undefined })).filter((x: any) => x.text) }] : [];
    case 'image-box': case 'icon-box': case 'call-to-action': case 'flip-box': {
      const title = plain(s.title_text || s.title || s.title_text_a);
      const html = cleanHtml(s.description_text || s.description || s.description_text_a || '', where);
      const img = (s.image || s.bg_image)?.url;
      const href = s.link?.url ? linkOf(s.link) : undefined;
      const out: Block[] = title || html ? [{ t: 'card', title, html, img: img ? useImage(img, where) : undefined, href }] : [];
      if (type === 'call-to-action' && s.button) out.push({ t: 'button', text: plain(s.button), href: href || '' });
      return out;
    }
    case 'counter': return [{ t: 'counter', value: `${str(s.prefix)}${str(s.ending_number)}${str(s.suffix)}`, label: plain(s.title) }];
    case 'price-list': return s.price_list?.length ? [{ t: 'price', items: s.price_list.map((x: any) => ({ title: plain(x.title), price: plain(x.price), text: plain(x.item_description) })) }] : [];
    case 'price-table': return [{ t: 'price', items: [{ title: plain(s.heading), price: `${str(s.currency_symbol)}${str(s.price)}`, text: (s.features_list || []).map((x: any) => plain(x.item_text)).join(' · ') }] }];
    case 'image-carousel': case 'image-gallery': case 'gallery': {
      const imgs = (s.carousel || s.wp_gallery || s.gallery || []).map((x: any) => x.url).filter(Boolean);
      return imgs.length ? [{ t: 'gallery', images: imgs.map((u: string) => useImage(u, where)) }] : [];
    }
    case 'html': {
      const out: Block[] = [];
      for (const m of str(s.html).matchAll(/<iframe[^>]+src="([^"]+)"/gi)) {
        const u = m[1].replace(/&amp;/g, '&');
        const y = ytId(u), v = vimeoId(u);
        if (y) out.push({ t: 'video', provider: 'youtube', id: y });
        else if (v) out.push({ t: 'video', provider: 'vimeo', id: v + (u.match(/[?&]h=(\w+)/) ? `?h=${u.match(/[?&]h=(\w+)/)![1]}` : '') });
        else if (/google\.com\/maps\/embed/.test(u)) out.push({ t: 'map', src: u });
      }
      return out;
    }
    case 'uael-video': {
      const y = ytId(s.youtube_link); const v = vimeoId(s.vimeo_link);
      return s.video_type === 'vimeo' && v ? [{ t: 'video', provider: 'vimeo', id: v }] : y ? [{ t: 'video', provider: 'youtube', id: y }] : [];
    }
    case 'uael-video-gallery':
      return (s.gallery_items || []).map((g: any) => ytId(g.video_url) ? { t: 'video', provider: 'youtube', id: ytId(g.video_url) } : vimeoId(g.vimeo_url || g.video_url) ? { t: 'video', provider: 'vimeo', id: vimeoId(g.vimeo_url || g.video_url) } : null).filter(Boolean);
    case 'tp-testimonial-listout':
      return (s.testiAllList || []).map((x: any) => ({ t: 'testimonial', text: plain(x.testiAuthor), name: plain(x.testiLabel), role: plain(x.testiDesign), img: x.testiImage?.url ? useImage(x.testiImage.url, where) : undefined })).filter((b: any) => b.text);
    case 'wpforms': case 'global': case 'shortcode': case 'spacer': case 'divider': case 'nav-menu': case 'search-form': case 'theme-site-logo': case 'social-icons': case 'countdown': case 'posts': case 'template': case 'lottie': case 'menu-anchor': case 'google_maps':
      return [];
    default: {
      // Widgets desconocidos (ElementsKit, etc.): rescatar textos y botones.
      const out: Block[] = [];
      const walk = (o: any, k = '') => {
        if (typeof o === 'string') {
          if (/(title|heading)$/i.test(k) && plain(o)) out.push({ t: 'heading', level: 3, text: plain(o) });
          else if (/(description|content|text|editor)$/i.test(k) && plain(o).length > 2) out.push({ t: 'text', html: cleanHtml(o, where) });
        } else if (o && typeof o === 'object') for (const [kk, v] of Object.entries(o)) if (!/^_|color|typography|size|style|css|class|icon|animation|align/i.test(kk)) walk(v, kk);
      };
      walk(s);
      return out;
    }
  }
}

function elementorSections(raw: string, where: string, pageId: string): Section[] {
  let data: any[];
  try { data = JSON.parse(raw); } catch { return []; }
  const sections: Section[] = [];
  const collect = (el: any, acc: Block[]) => {
    if (el.settings?.hide_desktop === 'hidden-desktop') return; // versiones solo-mobile duplicadas
    if (el.elType === 'widget') acc.push(...widget(el, where, pageId));
    for (const c of el.elements || []) collect(c, acc);
  };
  for (const top of data) {
    const blocks: Block[] = [];
    collect(top, blocks);
    // deduplicar textos repetidos (versiones mobile/desktop)
    const seen = new Set<string>();
    const uniq = blocks.filter((b) => { const k = JSON.stringify(b); if (seen.has(k)) return false; seen.add(k); return true; });
    if (uniq.length) sections.push({ blocks: uniq });
  }
  return sections;
}

/* ---------- Markdown de entradas ---------- */
const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced' });
td.remove(['script', 'style', 'noscript']);
td.addRule('youtube', {
  filter: (n) => n.nodeName === 'IFRAME' && /youtube|youtu\.be/.test(n.getAttribute('src') || ''),
  replacement: (_c, n: any) => `\n\n{{youtube:${ytId(n.getAttribute('src'))}}}\n\n`,
});
td.addRule('iframeOther', { filter: ['iframe'], replacement: () => '' });
td.addRule('spanStrip', { filter: ['span', 'div', 'section', 'figure'], replacement: (c) => c });

function postMarkdown(html: string, where: string): string {
  let s = stripShortcodes(str(html)).replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/\s(style|class|id|data-[\w-]+)="[^"]*"/gi, '');
  s = s.replace(/(^|\n)\s*(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}\S*)\s*(?=\n|$)/g, (_m, a, u) => `${a}<iframe src="https://www.youtube.com/embed/${ytId(u)}"></iframe>`);
  s = s.replace(/<img[^>]*?src="([^"]+)"[^>]*?(?:alt="([^"]*)")?[^>]*>/gi, (_m, src, alt) => `<img src="${useImage(src, where)}" alt="${alt || ''}">`);
  s = s.replace(/href="([^"]+)"/g, (_m, h) => `href="${localLink(h)}"`);
  if (!/<p[\s>]/i.test(s)) s = s.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('\n');
  return td.turndown(s).replace(/\n{3,}/g, '\n\n').trim();
}

/* ---------- autores, categorías, menús ---------- */
const authors = Object.fromEntries((ch['wp:author'] as any[]).map((a) => [a['wp:author_login'], { login: a['wp:author_login'], name: a['wp:author_display_name'] }]));
const AUTHOR_SLUG: Record<string, string> = { 'Monique Dumoulin': 'monique-dumoulin', 'merc.lobo@yahoo.com': 'merc-loboyahoo-com', desarrollador: 'desarrollador' };
const AUTHOR_NAME: Record<string, string> = { desarrollador: 'Espacio de Geometría Sagrada' };
const pagesById = new Map(items.filter((i) => i['wp:post_type'] === 'page').map((i) => [str(i['wp:post_id']), i]));
const pagePath = (i: Item): string => {
  const parts: string[] = [];
  let cur: Item | undefined = i;
  while (cur) { parts.unshift(str(cur['wp:post_name'])); const p = str(cur['wp:post_parent']); cur = p !== '0' ? pagesById.get(p) : undefined; }
  return `/${parts.join('/')}/`;
};

const menus: Record<string, any[]> = {};
for (const i of items.filter((x) => x['wp:post_type'] === 'nav_menu_item' && x['wp:status'] === 'publish')) {
  const menu = (i.category || []).map((c: any) => c['@_nicename'])[0] || 'sin-menu';
  const type = meta(i, '_menu_item_type');
  let href = meta(i, '_menu_item_url') || '';
  let label = plain(i.title);
  if (type === 'post_type') { const pg = pagesById.get(str(meta(i, '_menu_item_object_id'))); if (!pg) continue; href = pagePath(pg) === '/inicio/' ? '/' : pagePath(pg); label ||= plain(pg.title); }
  href = localLink(href).replace('https://fomacion.', 'https://formacion.');
  (menus[menu] ||= []).push({ label, href, order: Number(i['wp:menu_order']) });
}
for (const m of Object.values(menus)) m.sort((a, b) => a.order - b.order);

const usedCats = new Set<string>();

/* ---------- páginas ---------- */
for (const d of ['pages', 'posts']) fs.rmSync(path.join(OUT, d), { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'pages'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'posts'), { recursive: true });
const urlMap: { old: string; nuevo: string; tipo: string; estado: string }[] = [];
const pageIndex: any[] = [];

for (const i of items.filter((x) => x['wp:post_type'] === 'page')) {
  const slug = str(i['wp:post_name']);
  const status = str(i['wp:status']);
  const p = pagePath(i);
  if (status !== 'publish') continue;
  if (REPLACED[slug]) { urlMap.push({ old: p, nuevo: REPLACED[slug], tipo: 'página reemplazada', estado: p === REPLACED[slug] ? '200' : '301' }); continue; }
  if (LEGACY_PAGES.has(slug)) { urlMap.push({ old: p, nuevo: p, tipo: 'plataforma (WordPress)', estado: 'proxy' }); continue; }
  const kind = MIGRATE[slug];
  if (!kind) { urlMap.push({ old: p, nuevo: '—', tipo: 'sin clasificar', estado: 'revisar' }); continue; }
  const ed = meta(i, '_elementor_data');
  let sections = ed ? elementorSections(ed, p, str(i['wp:post_id'])) : [];
  if (!sections.length && str(i['content:encoded']).trim()) sections = [{ blocks: [{ t: 'text', html: cleanHtml(i['content:encoded'], p) }] }];
  const thumb = meta(i, '_thumbnail_id');
  const page = {
    id: str(i['wp:post_id']), slug, path: p, kind, title: plain(i.title),
    date: str(i['wp:post_date']).slice(0, 10), modified: str(i['wp:post_modified']).slice(0, 10),
    seo: { title: plain(meta(i, '_yoast_wpseo_title') || '').replace(/%%[a-z_]+%%/g, '').replace(/\s*[-|]\s*$/, '').trim(), description: plain(meta(i, '_yoast_wpseo_metadesc') || '') },
    noindex: kind === 'confirmacion', thumbnailId: thumb, sections,
  };
  fs.writeFileSync(path.join(OUT, 'pages', `${slug}.json`), JSON.stringify(page, null, 1));
  pageIndex.push({ slug, path: p, kind, title: page.title });
  urlMap.push({ old: p, nuevo: p, tipo: `página · ${kind}`, estado: '200' });
}

/* ---------- entradas ---------- */
const attachById = new Map(items.filter((x) => x['wp:post_type'] === 'attachment').map((x) => [str(x['wp:post_id']), str(x['wp:attachment_url'])]));
const postIndex: any[] = [];
for (const i of items.filter((x) => x['wp:post_type'] === 'post' && x['wp:status'] === 'publish')) {
  const slug = decodeURIComponent(str(i['wp:post_name']));
  const p = `/${slug}/`;
  const cats = (i.category || []).filter((c: any) => c['@_domain'] === 'category').map((c: any) => c['@_nicename']).filter((c: string) => !['blog', 'sin-categoria', '1', '4', 'post', 'pablic', 'news', 'cursos'].includes(c));
  cats.forEach((c: string) => usedCats.add(c));
  const login = str(i['dc:creator']);
  const thumb = attachById.get(str(meta(i, '_thumbnail_id')));
  const body = postMarkdown(i['content:encoded'], p);
  const words = body.split(/\s+/).length;
  const post = {
    id: str(i['wp:post_id']), slug, path: p, title: plain(i.title),
    date: str(i['wp:post_date']).slice(0, 10), modified: str(i['wp:post_modified']).slice(0, 10),
    author: { slug: AUTHOR_SLUG[login] || login, name: AUTHOR_NAME[login] || authors[login]?.name || login },
    categories: cats, image: thumb ? useImage(thumb, p) : null,
    excerpt: plain(i['excerpt:encoded']) || plain(body.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/[#*_>\[\]()!]/g, '').replace(/\{\{[^}]+\}\}/g, '')).slice(0, 220).replace(/\s\S*$/, '') + '…',
    seo: { title: plain(meta(i, '_yoast_wpseo_title') || '').replace(/%%[a-z_]+%%/g, '').replace(/\s*[-|]\s*$/, '').trim(), description: plain(meta(i, '_yoast_wpseo_metadesc') || '') },
    readingMinutes: Math.max(1, Math.round(words / 200)),
  };
  fs.writeFileSync(path.join(OUT, 'posts', `${slug}.md`), body + '\n');
  fs.writeFileSync(path.join(OUT, 'posts', `${slug}.json`), JSON.stringify(post, null, 1));
  postIndex.push(post);
  urlMap.push({ old: p, nuevo: p, tipo: 'entrada', estado: '200' });
}
postIndex.sort((a, b) => b.date.localeCompare(a.date));

const categories = (ch['wp:category'] as any[]).filter((c) => usedCats.has(c['wp:category_nicename'])).map((c) => ({
  slug: c['wp:category_nicename'], name: plain(c['wp:cat_name']), description: plain(c['wp:category_description'] || ''),
  count: postIndex.filter((p) => p.categories.includes(c['wp:category_nicename'])).length,
}));
for (const c of categories) {
  urlMap.push({ old: `/category/${c.slug}/`, nuevo: `/category/${c.slug}/`, tipo: 'categoría', estado: '200' });
  urlMap.push({ old: `/category/blog/${c.slug}/`, nuevo: `/category/${c.slug}/`, tipo: 'categoría (ruta vieja)', estado: '301' });
}
const authorList = Object.values(Object.fromEntries(postIndex.map((p) => [p.author.slug, { ...p.author, count: postIndex.filter((x) => x.author.slug === p.author.slug).length }])));
for (const a of authorList) urlMap.push({ old: `/author/${a.slug}/`, nuevo: `/author/${a.slug}/`, tipo: 'autor', estado: '200' });

/* ---------- plataforma y tienda: siguen en WordPress ---------- */
const LEGACY_PREFIXES = ['/courses/', '/lessons/', '/topics/', '/groups/', '/quizzes/', '/producto/', '/wp-admin/', '/wp-login.php', '/wp-json/', '/wp-content/', '/wp-includes/', '/xmlrpc.php'];
const legacyCount: Record<string, number> = {};
for (const i of items.filter((x) => ['sfwd-courses', 'sfwd-lessons', 'sfwd-topic', 'sfwd-quiz', 'groups', 'product'].includes(x['wp:post_type']) && x['wp:status'] === 'publish')) legacyCount[i['wp:post_type']] = (legacyCount[i['wp:post_type']] || 0) + 1;

/* ---------- plugins y funciones dinámicas detectadas ---------- */
const types = items.reduce((a: Record<string, number>, i) => ((a[i['wp:post_type']] = (a[i['wp:post_type']] || 0) + 1), a), {});
const metaKeys = new Set<string>();
items.forEach((i) => (i['wp:postmeta'] || []).forEach((m) => metaKeys.add(m['wp:meta_key'])));
const has = (re: RegExp) => [...metaKeys].some((k) => re.test(k)) || Object.keys(types).some((k) => re.test(k));
const plugins = {
  learndash: has(/sfwd|learndash|^_ld_/), woocommerce: types.product > 0, profileBuilder: has(/wppb/), elementorPro: has(/_elementor_pro_version/),
  modernEventsCalendar: has(/^mec_/), uncannyOwl: has(/uo_restriction/), pixelYourSite: has(/_pys_/), yoast: has(/_yoast_wpseo/), akismet: has(/akismet/),
  mailchimp: has(/mc4wp|mailchimp/i), activecampaign: has(/activecampaign/i), contactForm7: types.wpcf7_contact_form > 0, wpforms: types.wpforms > 0,
};

/* ---------- slugs viejos (WordPress los redirigía solo) ---------- */
const oldSlugs: [string, string][] = [];
const livePaths = new Set(urlMap.filter((u) => u.estado === '200').map((u) => u.nuevo));
for (const i of items.filter((x) => ['post', 'page'].includes(x['wp:post_type']) && x['wp:status'] === 'publish')) {
  const cur = i['wp:post_type'] === 'page' ? pagePath(i) : `/${decodeURIComponent(str(i['wp:post_name']))}/`;
  if (!livePaths.has(cur)) continue;
  for (const m of (i['wp:postmeta'] || []).filter((m) => m['wp:meta_key'] === '_wp_old_slug')) {
    const old = decodeURIComponent(str(m['wp:meta_value']));
    const parent = i['wp:post_type'] === 'page' ? cur.replace(/[^/]+\/$/, '') : '/';
    const from = `${parent}${old}/`;
    if (old && from !== cur && !livePaths.has(from)) oldSlugs.push([from, cur]);
  }
}
oldSlugs.push(['/quienes/monique-dumolin/', '/quienes-somos/monique-dumolin/'], ['/quienes/pablo-pettinaroli/', '/quienes-somos/pablo-pettinaroli/'], ['/seminario-emprender/', '/seminario-emprender-estudiantes/']);
for (const [a, b] of oldSlugs) urlMap.push({ old: a, nuevo: b, tipo: 'slug anterior', estado: '301' });

/* ---------- salida ---------- */
const site = { oldSlugs: [...new Map(oldSlugs).entries()], menus, categories, authors: authorList, pages: pageIndex, legacyPrefixes: LEGACY_PREFIXES, legacyPages: urlMap.filter((u) => u.estado === 'proxy').map((u) => u.old) };
fs.writeFileSync(path.join(OUT, 'site.json'), JSON.stringify(site, null, 1));
fs.writeFileSync(path.join(OUT, 'posts-index.json'), JSON.stringify(postIndex, null, 1));
fs.writeFileSync(path.join(OUT, 'forms.json'), JSON.stringify(forms, null, 1));
fs.writeFileSync(path.join(OUT, 'media.json'), JSON.stringify([...media.entries()].map(([k, v]) => ({ key: k, url: v.url, used: [...v.used] })), null, 1));
fs.writeFileSync(path.join(OUT, 'url-map.json'), JSON.stringify(urlMap, null, 1));
fs.writeFileSync(path.join(OUT, '_analisis.json'), JSON.stringify({ types, plugins, legacyCount, widgets: Object.fromEntries([...widgetStats].sort((a, b) => b[1] - a[1])) }, null, 1));

console.log('páginas migradas', pageIndex.length, '| entradas', postIndex.length, '| categorías', categories.length, '| autores', authorList.length);
console.log('imágenes referenciadas', media.size, '| formularios', forms.length);
console.log('plugins', plugins);
console.log('sin clasificar', urlMap.filter((u) => u.estado === 'revisar'));
