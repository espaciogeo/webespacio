// Clasifica las imágenes originales, mueve las descartables y escribe _assets/inventario.md
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('..', '_assets');
const ORIG = path.join(root, 'originales'), DESC = path.join(root, 'descartadas');
const USADAS = {
  '2024-01_GRUPALES-24-scaled-1.jpg': ['Monique y Pablo saludando, fondo claro', 'equipo-duo', '07 Equipo (principal)'],
  '2024-07_DSC09092-scaled-1.jpg': ['Retrato de Pablo y Monique juntos', 'equipo-retrato', '07 Equipo'],
  '2024-10_DSC_1846-scaled.jpg': ['Monique mostrando una construcción en un taller', 'monique-taller', '07 Equipo · Monique'],
  '2024-12_Pablo.png': ['Pablo sostiene un icosaedro', 'pablo-icosaedro', '07 Equipo · Pablo'],
  '2024-10_DSC_1949-scaled.jpg': ['Mano trazando con compás sobre papel', 'trazo-compas', '03 Pilar Trazos / Hero móvil'],
  '2024-10_DSC_1926-scaled.jpg': ['Compás trazando circunferencias concéntricas', 'trazo-compas-2', '05 Propuestas · eBook'],
  '2024-10_DSC_1423-scaled.jpg': ['Manos armando una construcción de varillas', 'construccion-manos', '03 Pilar Construcciones'],
  '2024-10_DSC_1797-scaled.jpg': ['Dos octaedros amarillos sostenidos en el aire', 'octaedros', '03 Pilar Medicina de las Formas'],
  '2024-10_DSC_2033-scaled.jpg': ['Hoja con trazo de toro sostenida en el taller', 'trazo-toro', '05 Propuestas · Cursos'],
  '2024-10_DSC_1334-scaled.jpg': ['Alumnas armando un sólido con imanes', 'taller-alumnas', '05 Propuestas · Formación'],
  '2024-10_DSC_2073-scaled.jpg': ['Foto grupal del workshop', 'taller-grupo', '06 Cifras'],
  '2025-03_IMG_1603-2-scaled.jpg': ['Vesica piscis trazada a lápiz', 'vesica-lapiz', '02 Manifiesto (detalle)'],
  '2026-06_GS-TAPA-LIBRO-MOCKUP.png': ['Tapa del libro "Geometría Sagrada"', 'libro', '05 Propuestas · Libro'],
  '2024-07_espacio-geometriasagrada-logo-01.png': ['Logo horizontal, texto oscuro, PNG transparente', 'logo', 'Navbar / Footer'],
};
const DESCARTE = [
  [/banner|promo|portada|miniatura|story|youtube|YOUTUBE|slider|bg-|semana-geometrica|workshop|experiencia|packcom|pack-|PRESENTACION|clase-|CLASE|seminario|actualizate|club|mentoria|Testimonio|testimonio|12-anos|transmision|Mesa-de-trabajo|news-|meditacion|REPASEMOS|Relacionemos|curso|ebook-|formacion|trazos-reconociendo|trazos-expandiendo|profundizacion|descubriendo|construyendo|armonizacion|medicina|solidos-platonicos-estrella|masterclass|mockup|2025\.png|tapa|flyer|post-|reel|REEL/i, 'Pieza gráfica con texto incrustado (banner/promo/portada)'],
  [/icono|icon|geo\.png|metria\.png|medusa|adn\.png|trazo-1|trazos-1|construcciones\.png|logo_chico|destino|\.gif$|satisfaccion|images-?\d*\.jpe?g/i, 'Ícono / clipart / recurso viejo de Elementor'],
  [/pexels|growth-hacking|2_Home_Online|unsplash|stock|shutterstock|freepik|gym|fitness/i, 'Foto de stock genérica'],
];
const files = fs.readdirSync(ORIG).filter(f => /\.(png|jpe?g|webp|gif|svg)$/i.test(f)).sort();
const rows = [];
for (const f of files) {
  let m = {}; try { m = await sharp(path.join(ORIG, f)).metadata(); } catch {}
  const kb = Math.round(fs.statSync(path.join(ORIG, f)).size / 1024);
  const size = `${m.width ?? '?'}×${m.height ?? '?'} · ${kb} KB`;
  if (USADAS[f]) { const [que, , donde] = USADAS[f]; rows.push([f, que, size, 'sí', donde]); continue; }
  const hit = DESCARTE.find(([re]) => re.test(f));
  if (hit) { fs.renameSync(path.join(ORIG, f), path.join(DESC, f)); rows.push([`descartadas/${f}`, hit[1], size, 'no', '—']); continue; }
  const small = (m.width ?? 0) < 600 && (m.height ?? 0) < 600;
  rows.push([f, small ? 'Foto/gráfico de baja resolución (retrato de comunidad, ilustración de blog o recurso chico)' : 'Foto de la comunidad, alumnos o formadores / ilustración de artículo', size, 'no', small ? '— (resolución insuficiente)' : '— (no es del equipo ni del taller; se conserva)']);
}
const md = `# Inventario de imágenes

Fuente: WP REST API \`/wp-json/wp/v2/media\` (504 imágenes en la biblioteca, 500 legibles; 3 GIF corruptos en origen).
Revisadas visualmente con hojas de contacto en \`_assets/_contactsheets/\` (índice en \`index.txt\`).

- **Usadas:** ${rows.filter(r => r[3] === 'sí').length}
- **Movidas a descartadas/:** ${rows.filter(r => r[0].startsWith('descartadas/')).length}
- **Conservadas sin usar:** ${rows.filter(r => r[3] === 'no' && !r[0].startsWith('descartadas/')).length}

Las retratos de alumnos/formadores/testimonios se conservan pero no se usan: son de personas de la comunidad y no hay autorización explícita para la home.

| archivo | qué muestra | tamaño | usar | dónde |
|---|---|---|---|---|
${rows.sort((a, b) => (a[3] === b[3] ? 0 : a[3] === 'sí' ? -1 : 1)).map(r => `| ${r.join(' | ')} |`).join('\n')}
`;
fs.writeFileSync(path.join(root, 'inventario.md'), md);
console.log(md.split('\n').slice(0, 9).join('\n'));
