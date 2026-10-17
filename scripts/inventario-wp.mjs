// Genera _contenido/wp/inventario.md a partir de los datos parseados y del build.
import fs from 'node:fs';
const W = '../_contenido/wp';
const site = JSON.parse(fs.readFileSync(`${W}/site.json`, 'utf8'));
const posts = JSON.parse(fs.readFileSync(`${W}/posts-index.json`, 'utf8'));
const media = JSON.parse(fs.readFileSync(`${W}/media.json`, 'utf8'));
const failed = JSON.parse(fs.readFileSync(`${W}/media-fallidas.json`, 'utf8'));
const map = JSON.parse(fs.readFileSync(`${W}/url-map.json`, 'utf8'));
const an = JSON.parse(fs.readFileSync(`${W}/_analisis.json`, 'utf8'));
const routes = fs.existsSync('dist-ssr/routes.json') ? JSON.parse(fs.readFileSync('dist-ssr/routes.json', 'utf8')) : [];
const md = `# Inventario de la migración

Fuente: \`_export/espaciodegeometrasagrada.WordPress.2026-10-16.xml\` (WXR 1.2, 1.038 ítems).

| | cantidad |
|---|---|
| Páginas migradas | ${site.pages.length} (+ /clase-gratuita/ nueva y la home) |
| Entradas del blog | ${posts.length} |
| Categorías / autores | ${site.categories.length} / ${site.authors.length} |
| Rutas prerenderizadas | ${routes.length} |
| Imágenes referenciadas por el contenido | ${media.length} |
| Imágenes descargadas y procesadas (AVIF+WebP, 800/1600) | ${media.length - failed.length} |
| Imágenes que no se pudieron descargar | ${failed.length} (404 en el servidor actual) |

## Lo que sigue en WordPress (proxy, misma URL)
LearnDash: ${an.legacyCount['sfwd-courses']} cursos, ${an.legacyCount['sfwd-lessons']} lecciones, ${an.legacyCount['sfwd-topic']} temas, ${an.legacyCount.groups} grupos, ${an.legacyCount['sfwd-quiz']} quiz · WooCommerce: ${an.legacyCount.product} productos publicados · Profile Builder (registro/login).
Prefijos: ${site.legacyPrefixes.map((p) => `\`${p}\``).join(', ')}
Páginas: ${site.legacyPages.map((p) => `\`${p}\``).join(', ')}

## URL vieja → URL nueva
| URL vieja | URL nueva | tipo | estado |
|---|---|---|---|
${map.map((u) => `| ${u.old} | ${u.nuevo} | ${u.tipo} | ${u.estado} |`).join('\n')}

## Imágenes que no se pudieron descargar
${failed.map((f) => `- ${f.url} (${f.reason}) — usada en ${f.used.join(', ')}`).join('\n')}
`;
fs.writeFileSync(`${W}/inventario.md`, md);
console.log('inventario.md:', map.length, 'URLs');
