// Prerender estático: genera un HTML real por ruta (con head SEO y datos embebidos), 404, sitemap,
// robots y las reglas de redirección/proxy para Vercel y Netlify.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = path.resolve('dist');
const ORIGIN = 'https://espaciodegeometriasagrada.com';
// WordPress sigue atendiendo plataforma, tienda y formularios. Cuando el dominio apunte al sitio nuevo,
// WordPress tiene que quedar accesible en este origen (configurable).
const LEGACY = process.env.LEGACY_ORIGIN || 'https://wp.espaciodegeometriasagrada.com';

const { routes, render, notFoundData, movedRedirects, subdomainRedirects } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

function page(url, data) {
  const { html } = render(url, data);
  const h = data.head;
  const head = [
    `<title>${esc(h.title)}</title>`,
    `<meta name="description" content="${esc(h.description)}" />`,
    `<link rel="canonical" href="${esc(h.canonical)}" />`,
    h.noindex ? '<meta name="robots" content="noindex, follow" />' : '',
    `<meta property="og:type" content="${h.type}" />`,
    `<meta property="og:site_name" content="Espacio de Geometría Sagrada" />`,
    `<meta property="og:locale" content="es_AR" />`,
    `<meta property="og:title" content="${esc(h.title)}" />`,
    `<meta property="og:description" content="${esc(h.description)}" />`,
    `<meta property="og:url" content="${esc(h.canonical)}" />`,
    `<meta property="og:image" content="${esc(h.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    h.jsonld ? `<script type="application/ld+json">${json(h.jsonld)}</script>` : '',
  ].filter(Boolean).join('\n    ');
  return template
    .replace('<!--egs-head-->', head)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>\n    <script>window.__EGS__=${json(data)}</script>`);
}

const all = routes();
const written = [];
for (const r of all) {
  const data = r.data();
  const file = path.join(DIST, r.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page(r.path, data));
  written.push({ path: r.path, type: data.type, noindex: data.head.noindex });
}
fs.writeFileSync(path.join(DIST, '404.html'), page('/404/', notFoundData()));

// sitemap + robots
const today = new Date().toISOString().slice(0, 10);
const urls = written.filter((w) => !w.noindex && !/\/page\/\d+\/$/.test(w.path));
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${ORIGIN}${u.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /wp-admin/\nDisallow: /mi-cuenta/\nDisallow: /carrito/\nDisallow: /finalizar-compra/\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

// redirecciones 301 y proxy hacia WordPress
const site = JSON.parse(fs.readFileSync(path.resolve('src/content/wp/site.json'), 'utf8'));
const redirects = [
  ['/inicio/', '/'], ['/inicio-nuevo/', '/'], ['/clase-gratuita-1/', '/clase-gratuita/'],
  ...site.categories.map((c) => [`/category/blog/${c.slug}/`, `/category/${c.slug}/`]),
  ...site.oldSlugs,
  ...JSON.parse(fs.readFileSync(path.resolve('src/content/substack/news-redirects.json'), 'utf8')),
  ...movedRedirects,
];
// sin cadenas: si un destino también fue mudado, se apunta directo a la ruta final
const finalOf = Object.fromEntries(movedRedirects);
for (const r of redirects) { let d = r[1]; for (let i = 0; i < 5 && finalOf[d]; i++) d = finalOf[d]; r[1] = d; }
const seen = new Set();
for (let i = redirects.length - 1; i >= 0; i--) { if (seen.has(redirects[i][0])) redirects.splice(i, 1); else seen.add(redirects[i][0]); }
const prerendered = new Set(written.map((w) => w.path));
const clash = redirects.filter(([a]) => prerendered.has(a));
if (clash.length) console.warn('redirecciones que pisan rutas prerenderizadas:', clash);
const proxyPrefixes = site.legacyPrefixes.map((p) => p.replace(/\/$/, ''));
const proxyPages = site.legacyPages.map((p) => p.replace(/\/$/, ''));
// Subdominios traídos al sitio: solo actúan cuando ese host apunte a este deploy (cambio de dominio).
const hostRules = subdomainRedirects.map((r) => ({ ...r, source: r.from === '/*' ? '/:path*' : r.from === '/' ? '/' : r.from, destination: ORIGIN + r.to }));
const vercel = {
  trailingSlash: true,
  cleanUrls: false,
  redirects: [
    ...hostRules.map((r) => ({ source: r.source, has: [{ type: 'host', value: r.host }], destination: r.destination, permanent: true })),
    ...redirects.map(([source, destination]) => ({ source, destination, permanent: true })),
  ],
  rewrites: [
    // checkout directo de WooCommerce (?compra_directa=ID): lo sigue atendiendo WordPress
    { source: '/', has: [{ type: 'query', key: 'compra_directa' }], destination: `${LEGACY}/` },
    ...proxyPrefixes.map((p) => ({ source: p.endsWith('.php') ? p : `${p}/:path*`, destination: p.endsWith('.php') ? `${LEGACY}${p}` : `${LEGACY}${p}/:path*` })),
    ...proxyPages.map((p) => ({ source: `${p}/:path*`, destination: `${LEGACY}${p}/:path*` })),
  ],
};
fs.writeFileSync(path.resolve('vercel.json'), JSON.stringify(vercel, null, 2) + '\n');
fs.writeFileSync(path.join(DIST, '_redirects'), [
  '# 301: subdominios traídos al sitio (activos cuando el host apunte a este deploy)',
  ...hostRules.map((r) => `https://${r.host}${r.from === '/*' ? '/*' : r.from}  ${r.destination}  301!`),
  '',
  '# Checkout directo de WooCommerce',
  `/ compra_directa=:id  ${LEGACY}/?compra_directa=:id  200`,
  '',
  '# 301: rutas viejas',
  ...redirects.map(([a, b]) => `${a}  ${b}  301`),
  '',
  '# Proxy (200): plataforma de estudiantes, cursos, tienda y formularios siguen en WordPress',
  ...proxyPrefixes.map((p) => (p.endsWith('.php') ? `${p}  ${LEGACY}${p}  200` : `${p}/*  ${LEGACY}${p}/:splat  200`)),
  ...proxyPages.map((p) => `${p}/*  ${LEGACY}${p}/:splat  200`),
  '',
].join('\n'));
fs.writeFileSync(path.resolve('dist-ssr/routes.json'), JSON.stringify(written, null, 1));

const byType = written.reduce((a, w) => ((a[w.type] = (a[w.type] || 0) + 1), a), {});
console.log('prerenderizadas', written.length, 'rutas', byType, '· sitemap', urls.length, '· redirecciones', redirects.length, '+', hostRules.length, 'de subdominio · proxy', proxyPrefixes.length + proxyPages.length + 1);
