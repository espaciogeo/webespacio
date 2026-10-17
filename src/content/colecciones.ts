// Índices editoriales /formaciones/ y /ebooks/, y el mapa de páginas de WordPress que pasan a vivir
// dentro de /formaciones/ (con 301 desde su URL anterior).
import precios from './precios.json';
import { IMG } from './formaciones';

const P = precios as any;

// Páginas de WordPress que son formaciones: su ruta nueva. El prerender genera las 301.
export const MOVES: Record<string, string> = {
  '/formacion-profesional/': '/formaciones/formacion-profesional/',
  '/formacion-profesional/dossier-y-programa/': '/formaciones/formacion-profesional/dossier-y-programa/',
  '/formacion-profesional/entrevista-confirrmada/': '/formaciones/formacion-profesional/entrevista-confirrmada/',
  '/cursos/': '/formaciones/cursos/',
  '/cursos/los-solidos-platonicos-y-la-estrella-madre/': '/formaciones/cursos/los-solidos-platonicos-y-la-estrella-madre/',
  '/cursos/trazos-re-conociendo-tu-campo-energetico/': '/formaciones/cursos/trazos-re-conociendo-tu-campo-energetico/',
  '/mentoria-emprendimientos/': '/formaciones/mentoria-emprendimientos/',
  '/actualizate/': '/formaciones/actualizate/',
  '/workshop-experiencias-geometricas/': '/formaciones/experiencias/workshop-julio-2025/',
  '/seminario/': '/formaciones/seminario-activando-tu-campo-de-potencial/',
  '/seminario-emprender-estudiantes/': '/formaciones/seminario-emprendimiento/',
};
// Páginas que se reemplazan por otra (duplicadas o absorbidas): no se prerenderizan, solo 301.
export const REPLACED: Record<string, string> = {
  '/formacion_profesional/': '/formaciones/formacion-profesional/',
  '/ebook-7-trazos-de-geometria-sagrada/': '/ebooks/7-trazos-de-geometria-sagrada/',
};
// Subdominios y URLs externas → ruta nueva (se activan con el cambio de dominio; ver _contenido/redirecciones-subdominios.md)
export const SUBDOMAIN_REDIRECTS: { host: string; from: string; to: string }[] = [
  { host: 'experiencias.espaciodegeometriasagrada.com', from: '/', to: '/formaciones/experiencias/' },
  { host: 'experiencias.espaciodegeometriasagrada.com', from: '/presentacionlibro', to: '/formaciones/experiencias/presentacion-del-libro/' },
  { host: 'experiencias.espaciodegeometriasagrada.com', from: '/bsas-2811', to: '/formaciones/experiencias/buenos-aires-28-de-noviembre/' },
  { host: 'experiencias.espaciodegeometriasagrada.com', from: '/uruguay-0327-321941', to: '/formaciones/experiencias/retiro-maldonado-uruguay/' },
  { host: 'experiencias.espaciodegeometriasagrada.com', from: '/postula-espacio', to: '/formaciones/experiencias/postula-tu-espacio/' },
  { host: 'experiencias.espaciodegeometriasagrada.com', from: '/productores', to: '/formaciones/experiencias/productores/' },
  { host: 'experiencias.espaciodegeometriasagrada.com', from: '/*', to: '/formaciones/experiencias/' },
  { host: 'formadores.espaciodegeometriasagrada.com', from: '/club-page', to: '/formaciones/club-formadores/' },
  { host: 'formadores.espaciodegeometriasagrada.com', from: '/*', to: '/formaciones/club-formadores/' },
  { host: 'admision.espaciodegeometriasagrada.com', from: '/solicita-tu-entrevista-fpgs', to: '/formaciones/admision/#agenda' },
  { host: 'admision.espaciodegeometriasagrada.com', from: '/*', to: '/formaciones/admision/' },
  { host: 'especializacion.espaciodegeometriasagrada.com', from: '/*', to: '/formaciones/armonizacion-de-espacios/' },
  { host: 'terapias.espaciodegeometriasagrada.com', from: '/*', to: '/formaciones/especializacion-en-terapias/' },
  { host: 'libro.espaciodegeometriasagrada.com', from: '/promo-lanzamiento', to: '/libro/' },
  { host: 'libro.espaciodegeometriasagrada.com', from: '/*', to: '/libro/' },
];
// URLs viejas del sitio principal (adjuntos y producto) que apuntaban a los eBooks
export const EBOOK_REDIRECTS: [string, string][] = [
  ['/ebook7trazosgs/', '/ebooks/7-trazos-de-geometria-sagrada/'],
  ['/ebook-los-secretos-de-los-solidos-platonicos-2/', '/ebooks/los-secretos-de-los-solidos-platonicos/'],
  ['/ebook-circulos-de-cosecha/', '/ebooks/trazos-de-circulos-de-cosecha/'],
  ['/cursos/ebook-7-trazos-de-la-geometria-sagrada/', '/ebooks/7-trazos-de-geometria-sagrada/'],
  ['/cursos/ebook-los-secretos-de-los-solidos-platonicos/', '/ebooks/los-secretos-de-los-solidos-platonicos/'],
  ['/cursos/ebook-trazos-de-circulos-de-cosecha/', '/ebooks/trazos-de-circulos-de-cosecha/'],
  ['/producto/ebook/', '/ebooks/'],
  ['/seminario-emprender/', '/formaciones/seminario-emprendimiento/'],
];

export const formacionesIndex = {
  kicker: 'Formaciones · desde 2014',
  title: 'Todas las formas de aprender.',
  lede: 'Formación profesional, especializaciones, experiencias presenciales, comunidad y cursos online. Elegí por dónde empezar: cada propuesta dice para quién es, cuánto dura y cómo se ingresa.',
  trazo: 'semilla',
  groups: [
    { title: 'Formación y especializaciones', text: 'Recorridos de nueve meses, con acompañamiento personalizado y entrevista de ingreso.', items: [
      { path: '/formaciones/formacion-profesional/', size: 'xl', kicker: 'Formación Profesional', title: 'Formación Profesional en Geometría Sagrada', text: 'Te presentamos la primera Formación Profesional de Geometría Sagrada de habla hispana. 100% Online. Aval Internacional.', image: 'local:equipo-duo',
        facts: [{ label: 'Para quién', value: 'Tu camino hacia la maestría personal y profesional' }, { label: 'Duración', value: '9 meses, con acompañamiento personalizado' }, { label: 'Ingreso', value: 'Entrevista de orientación sin compromiso' }], cta: 'Conocé la Formación' },
      { path: '/formaciones/especializacion-en-terapias/', size: 'l', kicker: 'Especialización', title: 'Especialización en Terapias con Geometría Sagrada', image: 'local:monique-taller',
        facts: [{ label: 'Para quién', value: 'Médicos, psicólogos, psiquiatras y terapeutas' }, { label: 'Duración', value: 'Nueve meses' }, { label: 'Ingreso', value: 'Entrevista de admisión' }], cta: 'Ver la Especialización' },
      { path: '/formaciones/armonizacion-de-espacios/', size: 'l', kicker: 'Especialización · 3 caminos', title: 'Especialización en Armonización de Espacios', image: 'local:construccion-manos',
        facts: [{ label: 'Para quién', value: 'Para tu casa, para sumarlo a tu actividad o para tu estudio' }, { label: 'Duración', value: '9 meses · 7 módulos' }, { label: 'Desde', value: `${P.armonizacion.caminos[0].pagoUnico} (${P.armonizacion.moneda})` }], cta: 'Comparar los 3 caminos' },
    ] },
    { title: 'Presenciales', text: 'Experiencias Geométricas: los eventos presenciales en tu ciudad.', items: [
      { path: '/formaciones/experiencias/', size: 'xl', kicker: 'Experiencias Geométricas', title: 'Los eventos presenciales en tu ciudad', image: IMG.talleres[0],
        facts: [{ label: 'Para quién', value: 'Para quienes nos siguen desde hace años y para quienes nos conocen por primera vez' }, { label: 'Formato', value: 'Workshops de 1 día, retiros de 3 días' }], cta: 'Ver todas las fechas' },
      { path: '/formaciones/experiencias/retiro-maldonado-uruguay/', size: 'm', kicker: 'Retiro · 19 al 21 de marzo', title: 'Activando tu Campo de Potencial · Maldonado', image: IMG.uruguay[0],
        facts: [{ label: 'Duración', value: '2 noches y dos días' }, { label: 'Cupos', value: '30 personas' }, { label: 'Hoy', value: P.experiencias.uruguay.hoy }], cta: 'Reservar mi lugar' },
      { path: '/formaciones/experiencias/buenos-aires-28-de-noviembre/', size: 'm', kicker: 'Workshop · 28 de noviembre', title: 'Experiencias Geométricas · Volumen 3', image: IMG.entrada,
        facts: [{ label: 'Duración', value: '1 día, de 10.45 a 16.30 hs' }, { label: 'Lugar', value: 'Belgrano, Buenos Aires' }, { label: 'Desde', value: P.experiencias.buenosAires.opciones[0].precio }], cta: 'Elegí tu entrada' },
      { path: '/formaciones/experiencias/presentacion-del-libro/', size: 's', kicker: '7 de noviembre', title: 'Presentación del libro', image: IMG.libroMockup,
        facts: [{ label: 'Para quién', value: 'Lectores, Estudiantes y Formadores' }, { label: 'Duración', value: '45 minutos' }], cta: 'Confirmar mi lugar' },
    ] },
    { title: 'Comunidad', items: [
      { path: '/formaciones/club-formadores/', size: 'l', kicker: 'Club', title: 'Club Formadores Geómetras', image: 'local:taller-alumnas',
        facts: [{ label: 'Para quién', value: 'Formadores certificados del Espacio' }, { label: 'Duración', value: 'Plan mensual o anual' }, { label: 'Desde', value: 'USD 0 (validación)' }], cta: 'Ver opciones' },
      { path: '/clase-gratuita/', size: 'm', kicker: 'Gratis · un sábado al mes', title: 'Clase gratuita mensual', image: 'local:vesica-lapiz',
        facts: [{ label: 'Para quién', value: 'Para dar tus primeros pasos' }, { label: 'Duración', value: 'Una clase en vivo por mes' }], cta: 'Inscribite gratis' },
    ] },
    { title: 'Cursos y programas online', items: [
      { path: '/formaciones/cursos/los-solidos-platonicos-y-la-estrella-madre/', size: 'm', kicker: 'Curso grabado', title: 'Los Sólidos Platónicos y la Estrella Madre', image: 'local:octaedros',
        facts: [{ label: 'Para quién', value: 'Toda persona que desee comenzar a estudiar Geometría Sagrada' }, { label: 'Duración', value: 'Módulos grabados, acceso de por vida' }], cta: 'Ver el curso' },
      { path: '/formaciones/cursos/trazos-re-conociendo-tu-campo-energetico/', size: 'm', kicker: 'Curso grabado', title: 'Trazos: Re-Conociendo tu Campo Energético', image: 'local:trazo-compas',
        facts: [{ label: 'Para quién', value: 'Toda persona que desee comenzar a estudiar Geometría Sagrada' }, { label: 'Duración', value: '22 módulos grabados, acceso de por vida' }], cta: 'Ver el curso' },
      { path: '/formaciones/actualizate/', size: 's', kicker: 'Programa', title: 'Actualiza tu "identidad" con Geometría Sagrada',
        facts: [{ label: 'Para quién', value: 'Para vivir una vida más consciente, más plena y más evolucionada' }], cta: 'Ver el programa' },
      { path: '/formaciones/mentoria-emprendimientos/', size: 's', kicker: 'Mentoría con Pablo', title: 'Transforma tu "Don" en un Servicio que Impacte (muchas) Vidas',
        facts: [{ label: 'Para quién', value: 'Si sentís que tu servicio o terapia podría ayudar a más personas' }], cta: 'Ver la mentoría' },
      { path: '/formaciones/cursos/', size: 's', kicker: 'Cursos', title: 'Cursos online',
        facts: [{ label: 'Estado', value: 'Próximamente nuevos cursos disponibles' }], cta: 'Ver cursos' },
    ] },
    { title: 'Ediciones anteriores', text: 'Propuestas que ya se realizaron. Quedan publicadas como registro.', items: [
      { path: '/formaciones/experiencias/workshop-julio-2025/', size: 's', status: 'Realizado', kicker: '26 de julio de 2025', title: 'Workshop Experiencias Geométricas', facts: [{ label: 'Formato', value: 'Presencial, Palermo, Buenos Aires' }], cta: 'Ver la edición' },
      { path: '/formaciones/seminario-activando-tu-campo-de-potencial/', size: 's', status: 'Realizado', kicker: '1 y 2 de abril de 2023', title: 'Seminario Activando tu Campo de Potencial', facts: [{ label: 'Formato', value: 'Online, sala exclusiva de Zoom' }], cta: 'Ver la edición' },
      { path: '/formaciones/seminario-emprendimiento/', size: 's', status: 'Realizado', kicker: '3 y 4 de febrero de 2024', title: 'Geometría Sagrada para Potenciar tu Emprendimiento', facts: [{ label: 'Formato', value: 'Online, sala exclusiva de Zoom' }], cta: 'Ver la edición' },
    ] },
  ],
  band: { title: '¿No sabés por dónde empezar?', text: 'Agendá una Entrevista Informativa de 30 minutos donde podrás realizar todas tus consultas. También podés empezar por el libro o por los eBooks.', links: [{ text: 'Agendá tu entrevista', href: '/formaciones/admision/' }, { text: 'El libro', href: '/libro/' }, { text: 'eBooks', href: '/ebooks/' }] },
};

export const ebooksIndex = {
  kicker: 'eBooks · descargables',
  title: 'eBooks de Geometría Sagrada.',
  lede: `Tres eBooks de Monique Dumoulin para practicar en casa, paso a paso. Se adquieren juntos: el eBook 7 Trazos trae de regalo los otros dos, el set de 6 audios y una MasterClass, por ${P.ebooks.pack.precio} (${P.ebooks.pack.precioArs}).`,
  trazo: 'hexagono',
  groups: [
    { title: 'Los eBooks', items: [
      { path: '/ebooks/7-trazos-de-geometria-sagrada/', size: 'xl', kicker: 'eBook · 45 páginas', title: '7 Trazos de Geometría Sagrada', text: 'Aprende a Crear tus primeros Mandalas usando la Geometría Sagrada, con una guía paso a paso, aunque no tengas experiencia previa ni sepas dibujar.', image: IMG.ebook7,
        facts: [{ label: 'Incluye', value: 'El eBook + 2 eBooks de regalo + 6 audios + MasterClass' }, { label: 'Pack', value: `${P.ebooks.pack.precio} (${P.ebooks.pack.precioArs})` }], cta: 'Ver el eBook' },
      { path: '/ebooks/los-secretos-de-los-solidos-platonicos/', size: 'l', kicker: 'eBook · más de 70 páginas', title: 'Los Secretos de los Sólidos Platónicos', image: IMG.ebookSolidos,
        facts: [{ label: 'Incluye', value: 'Los Sólidos Platónicos en 3era dimensión, paso a paso' }, { label: 'Se obtiene con', value: 'el eBook 7 Trazos' }], cta: 'Ver el eBook' },
      { path: '/ebooks/trazos-de-circulos-de-cosecha/', size: 'l', kicker: 'eBook', title: 'Trazos de Círculos de Cosecha', image: IMG.ebookCirculos,
        facts: [{ label: 'Incluye', value: 'Trazar e interpretar los Círculos de Cosecha' }, { label: 'Se obtiene con', value: 'el eBook 7 Trazos' }], cta: 'Ver el eBook' },
    ] },
  ],
  band: { title: 'Y si querés el libro impreso…', text: '12 años de enseñanza condensados en 228 páginas. Disponible en Argentina y en todo el mundo.', links: [{ text: 'El libro', href: '/libro/' }, { text: 'Comprar el pack de eBooks', href: P.ebooks.pack.href }] },
};
