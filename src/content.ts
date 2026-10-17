// Todo el copy de la home. Fuente: _contenido/contenido.json (extraído del sitio actual).
// Lo marcado con // [INVENTADO] fue redactado para el rediseño y necesita validación.

// Rutas internas relativas: el sitio nuevo vive en el mismo dominio. Lo que sigue en WordPress se sirve por proxy.
const SITE = '';

export const links = {
  home: '/',
  archivoBlog: '/blog/',
  claseGratuita: '/clase-gratuita/',
  queHacemos: `${SITE}/que-hacemos/`,
  cursos: '/formaciones/cursos/',
  formacion: '/formaciones/',
  formacionInfo: '/formaciones/formacion-profesional/',
  ebook: '/ebooks/7-trazos-de-geometria-sagrada/',
  ebooks: '/ebooks/',
  libro: '/libro/',
  admision: '/formaciones/admision/',
  blog: 'https://espaciodegeometriasagrada.substack.com/',
  contacto: `${SITE}/contacto/`,
  acceso: import.meta.env.DEV ? '/ingresar/' : `${SITE}/acceso/`,
  quienesSomos: `${SITE}/quienes-somos/`,
  monique: `${SITE}/quienes-somos/monique-dumolin/`,
  pablo: `${SITE}/quienes-somos/pablo-pettinaroli/`,
};

export type NavItem = { label: string; href: string; children?: { label: string; href: string; text?: string }[] };
export const nav: NavItem[] = [
  { label: 'Qué hacemos', href: links.queHacemos },
  {
    label: 'Formaciones', href: links.formacion,
    children: [
      { label: 'Formación Profesional', href: '/formaciones/formacion-profesional/', text: '9 meses, con acompañamiento personalizado' },
      { label: 'Especialización en Terapias', href: '/formaciones/especializacion-en-terapias/', text: 'Para médicos, psicólogos y terapeutas' },
      { label: 'Armonización de Espacios', href: '/formaciones/armonizacion-de-espacios/', text: 'Tres caminos de 9 meses' },
      { label: 'Experiencias y retiros', href: '/formaciones/experiencias/', text: 'Eventos presenciales en tu ciudad' },
      { label: 'Club Formadores Geómetras', href: '/formaciones/club-formadores/', text: 'Para Formadores certificados' },
      { label: 'Cursos online', href: '/formaciones/cursos/', text: 'Grabados, acceso de por vida' },
      { label: 'Clase gratuita mensual', href: links.claseGratuita, text: 'Un sábado al mes, en vivo' },
      { label: 'Admisión: agendá tu entrevista', href: links.admision, text: 'Entrevista de 30 minutos' },
    ],
  },
  { label: 'Libro', href: links.libro },
  { label: 'eBooks', href: links.ebooks },
  { label: 'Blog', href: links.archivoBlog },
  { label: 'Contacto', href: links.contacto },
];

export const redes = [
  { label: 'Instagram', href: 'https://www.instagram.com/espaciodegeometriasagrada/' },
  { label: 'Facebook', href: 'https://www.facebook.com/EspaciodeGeometriaSagrada/' },
  { label: 'YouTube', href: 'https://www.youtube.com/c/EspaciodegeometriasagradaxMoniqueDumoulin' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@espaciogeometriasagrada' },
];

export const legales = [
  { label: 'Políticas de privacidad', href: `${SITE}/politica-de-privacidad/` },
  { label: 'Descargo de responsabilidad', href: `${SITE}/descargo-de-responsabilidad/` },
  { label: 'Responsabilidad empresarial', href: `${SITE}/responsabilidad-empresarial/` },
];

// Formulario real de la home actual (Elementor Pro, form "Banner_Clase_gratuita").
// Cross-origin se envía con mode:'no-cors'; servido desde el mismo dominio funciona tal cual.
export const claseForm = {
  endpoint: (import.meta.env.VITE_FORMS_ENDPOINT as string | undefined) || '/wp-admin/admin-ajax.php',
  fields: { action: 'elementor_pro_forms_send_form', post_id: '15', form_id: '2c47b85', queried_id: '15', referer_title: 'Inicio' },
};

export const hero = {
  kicker: 'Espacio de Geometría Sagrada · desde 2014',
  lede: 'Aprendé el lenguaje de la vida codificado en símbolos y patrones. Clases, Cursos y Talleres para aplicar en tu vida y profesión.',
  ctaPrimary: 'Sumate a la clase gratuita', // [INVENTADO] (texto del brief)
  ctaSecondary: 'Ver propuestas',
};

// Armado a partir de /que-hacemos/ y /quienes-somos/. Las frases entre * se destacan.
export const manifiesto = {
  kicker: 'Manifiesto', // [INVENTADO]
  // [INVENTADO] como texto corrido; las ideas y varias frases son del sitio:
  // "comunidad de buscadores", "compartir y multiplicar", "democratizar el conocimiento",
  // "lenguaje del universo, codificado en símbolos y patrones", "la medida es profana y la Proporción es Sagrada".
  texto:
    'Desde 2014, compartimos este conocimiento *ancestral.* Ya acompañamos a + de 10mil personas en todo el mundo.',
  marcada: 'ancestral',
  nota: 'vesica piscis · trazo a lápiz de una alumna', // [INVENTADO] (no sabemos quién hizo el trazo; validar)
};

export const pilaresIntro = {
  kicker: 'Los 4 pilares',
  titulo: 'Independientes y complementarios.', // real: "los cuales son independientes y complementarios"
};

export const pilares = [
  {
    n: '01',
    titulo: 'Trazos',
    texto: 'Los trazos de Geometría Sagrada te permiten hacer consciente lo que está en tu inconsciente. Relajan la mente y re-ordenan tu estructura interna.',
    nota: 'compás · regla · lápiz', // [INVENTADO]
    img: 'trazo-compas',
    href: `${SITE}/category/trazos-de-geometria-sagrada/`,
  },
  {
    n: '02',
    titulo: 'Construcciones',
    texto: 'A medida que construyes herramientas de la Geometría Sagrada te equilibras y armonizas tu geometría interna, para luego aplicarlas en tu vida diaria.',
    nota: 'bio-geometrías en 3D', // [INVENTADO]
    img: 'construccion-manos',
    href: `${SITE}/category/solidos-platonicos/`,
  },
  {
    n: '03',
    titulo: 'Armonización de Espacios',
    texto: 'Hace milenios se creaban espacios basándose en los principios de la Geometría Sagrada. Te proponemos volver a la conciencia de esa relación con tu entorno.',
    nota: 'planta · proporción áurea φ', // [INVENTADO]
    img: null,
    href: `${SITE}/category/armonizacion-de-espacios/`,
  },
  {
    n: '04',
    titulo: 'Medicina de las Formas',
    texto: 'La práctica nacida del pasaje de lo instintivo a lo cuántico, llevada a formas de 2D y 3D para su aplicación.',
    nota: 'formas 2D → 3D', // [INVENTADO]
    img: 'octaedros',
    href: `${SITE}/category/medicina-de-la-forma/`,
  },
];

export const solidosIntro = {
  kicker: 'Los 5 sólidos platónicos',
  // Real (eBook): "Hay siete formas principales dentro de la Geometría Sagrada: los cinco Sólidos Platónicos, el Círculo y la Espiral."
  titulo: '5 Mentes, 5 Consciencias',
  texto: 'Platón decía que la Geometría nos obliga a contemplar la esencia. Cada sólido se relaciona con uno de los 5 elementos.', // real (eBook "Los Secretos de los Sólidos Platónicos")
};

// Datos geométricos (hechos) + elemento según la lámina del sitio ("Los-Seis-Elementos").
export const solidos = [
  { nombre: 'Tetraedro', elemento: 'Fuego', caras: 4, vertices: 4, aristas: 6, cara: 'triángulo' },
  { nombre: 'Hexaedro', elemento: 'Tierra', caras: 6, vertices: 8, aristas: 12, cara: 'cuadrado' },
  { nombre: 'Octaedro', elemento: 'Aire', caras: 8, vertices: 6, aristas: 12, cara: 'triángulo' },
  { nombre: 'Icosaedro', elemento: 'Agua', caras: 20, vertices: 12, aristas: 30, cara: 'triángulo' },
  { nombre: 'Dodecaedro', elemento: 'Éter', caras: 12, vertices: 20, aristas: 30, cara: 'pentágono' },
];

export const propuestasIntro = {
  kicker: 'Propuestas',
  // Real (/que-hacemos/): "Estos pilares puedes aprenderlos a través de diferentes modalidades, según el grado de interés..."
  titulo: 'Según el grado de interés que tengas.',
};

export const clase = {
  tag: 'Un sábado al mes · En vivo',
  titulo: 'Clase gratuita mensual',
  texto: 'Un sábado al mes nos encontramos en vivo y en directo desde nuestra web para compartir y multiplicar este conocimiento con todo el mundo.',
  sub: 'Gratuita · En vivo · Para todo el mundo', // [INVENTADO]
  comunidad: 100000,
  comunidadLabel: 'personas en la comunidad', // real: "+100000 personas en las redes"
  boton: 'Sí, quiero registrarme',
  ok: '¡Listo! Te avisamos por email', // [INVENTADO]
};

export const propuestas = [
  {
    id: 'ebook',
    n: '02',
    titulo: 'eBook · 7 trazos de Geometría Sagrada',
    texto: 'Aprendé a crear tus primeros mandalas usando la Geometría Sagrada, con una guía paso a paso, aunque no tengas experiencia previa ni sepas dibujar.',
    meta: '45 páginas · PDF · Monique Dumoulin',
    lista: ['Tubo toro', 'Triángulo', 'Pentágono', 'Hexágono', 'Octógono', 'Ying-yang', 'Laberinto cretense'],
    cta: 'Conocer el eBook',
    href: links.ebook,
    img: 'trazo-compas-2',
  },
  {
    id: 'cursos',
    n: '03',
    titulo: 'Cursos online',
    texto: 'La Geometría Sagrada se aplica en 4 pilares: Trazos, Construcciones, Armonización de Espacios y Medicina de las Formas. Hay un curso para cada opción.',
    meta: 'A tu ritmo · 100% online', // [INVENTADO] (resumen)
    cta: 'Ver cursos',
    href: links.cursos,
    img: 'trazo-toro',
  },
  {
    id: 'formacion',
    n: '04',
    titulo: 'Formación profesional',
    texto: 'La primera Formación Profesional de Geometría Sagrada de habla hispana. Aprende el lenguaje del universo aplicado a tu vida profesional y personal, en 9 meses y con acompañamiento personalizado.', // fuente: admision.espaciodegeometriasagrada.com
    meta: 'Inscripciones abiertas · entrevista de orientación sin compromiso',
    cta: 'Ver todas las formaciones',
    href: links.formacion,
    img: 'taller-alumnas',
  },
  {
    id: 'libro',
    n: '05',
    titulo: 'El libro',
    texto: '12 años de enseñanza condensados en 228 páginas. No necesitás conocimientos previos, ni saber dibujar. Solo disposición a redescubrirte.',
    meta: 'Puesto #1 en España en su debut · primera edición agotada',
    cta: 'Quiero mi ejemplar',
    href: links.libro,
    img: 'libro',
  },
];

export const cifras = {
  kicker: 'En números', // [INVENTADO]
  items: [
    { valor: 2000, prefijo: '+', label: 'estudiantes en la formación profesional' },
    { valor: 100000, prefijo: '+', label: 'personas en la comunidad en redes' },
    { valor: 2014, prefijo: 'desde ', label: 'compartiendo y multiplicando', esAnio: true },
  ],
  hitos: [
    { anio: '2013', texto: 'Cierra la Escuela de Sagrada Geometría del Sur del Mundo, co-fundada por Monique junto a Dana Tir.' },
    { anio: '2014', texto: 'Monique Dumoulin funda el Espacio de Geometría Sagrada.' },
    { anio: 'Hoy', texto: '12 años de enseñanza condensados en un libro de 228 páginas.' },
  ],
};

export const testimonios = {
  kicker: 'Formadores certificados',
  titulo: 'Lo que dicen quienes se formaron.', // [INVENTADO]
  // Citas textuales (recortadas) de /formacion-profesional/. `marca` es un fragmento literal de la cita.
  lista: [
    { nombre: 'Ma. Laura de Rose', lugar: 'Buenos Aires, Argentina', texto: 'El Espacio de Geometría Sagrada es un lugar donde encuentro familia, mucha información ordenada, y un lugar donde encontrarme conmigo misma.', marca: 'mucha información ordenada' },
    { nombre: 'Cristine Dal Maso', lugar: 'Brasil', texto: 'La percepción del mundo amplificada por la Geometría Sagrada llenó mi corazón con un sentimiento de pertenencia.', marca: 'sentimiento de pertenencia' },
    { nombre: 'Carmen Orellana Puertas', lugar: 'México', texto: 'Me encantó la formación, es muy completa y me dio muchas bases para aplicar la geometría sagrada en mi vida y en mis pacientes y alumnos.', marca: 'es muy completa' },
    { nombre: 'Nancy Pujadas', lugar: 'Argentina', texto: 'Me re-encontré a mí misma, mi mundo interno, mis riquezas y dones para poder desarrollarlos y potenciarlos.', marca: 'mi mundo interno' },
    { nombre: 'Gema Lopez Gorosove', lugar: 'Argentina', texto: 'No había experimentado anteriormente la cálida sensación de haber sido acogida en una familia tan amorosa.', marca: 'una familia tan amorosa' },
    { nombre: 'Ma. Fernanda Aldana', lugar: 'Argentina', texto: 'Aprendí mucho y me llené de herramientas para comprender mejor la vida, el hábitat y a mí misma.', marca: 'me llené de herramientas' },
    { nombre: 'Victor Anibal Coronel', lugar: 'Argentina', texto: 'Uso ahora la Geometría Sagrada en mi profesión y es asombroso ver los resultados que he obtenido.', marca: 'en mi profesión' },
  ],
};

export const equipo = {
  kicker: 'Nuestro equipo',
  intro: 'Monique Dumoulin y Pablo Pettinaroli encabezan un equipo de personas interdisciplinario, con pasión por lo que hacen.',
  personas: [
    {
      nombre: 'Monique Dumoulin',
      rol: 'Fundadora y Facilitadora Geómetra',
      bio: 'Arquitecta egresada de la Universidad de Buenos Aires y Formadora Geómetra. Desde hace más de 20 años trabaja en la misión de compartir y multiplicar.',
      img: 'monique-taller',
      href: links.monique,
    },
    {
      nombre: 'Pablo Pettinaroli',
      rol: 'Director Ejecutivo',
      bio: 'Diseñador Multimedial y autor del podcast “Manual para Sobrevivientes”. Su pasión por la tecnología y su sueño de democratizar el conocimiento confluyeron en su trabajo dentro del Espacio.',
      img: 'pablo-icosaedro',
      href: links.pablo,
    },
  ],
  formadora: 'Con la formadora Mercè Lobo y un staff de Formadores Geómetras certificados.', // [INVENTADO] (redacción; los datos son reales)
};

export const blog = {
  kicker: 'Del blog',
  titulo: 'Para leer despacio.', // [INVENTADO]
  categorias: [
    { nombre: 'Trazos', href: `${SITE}/category/trazos-de-geometria-sagrada/` },
    { nombre: 'Sólidos Platónicos', href: `${SITE}/category/solidos-platonicos/` },
    { nombre: 'Armonización de Espacios', href: `${SITE}/category/armonizacion-de-espacios/` },
    { nombre: 'Medicina de la Forma', href: `${SITE}/category/medicina-de-la-forma/` },
    { nombre: 'Reflexiones', href: `${SITE}/category/reflexiones/` },
    { nombre: 'Centros de Energía', href: `${SITE}/category/centros-de-energia/` },
  ],
  // Los 4 últimos de _contenido/articulos.json (los mismos que muestra la home actual).
  articulos: [
    { titulo: 'El Cubo de Metatrón: la matriz sagrada de la creación universal', fecha: '5 nov 2024', autor: 'Monique Dumoulin', extracto: 'La geometría sagrada nos revela que el universo se comunica a través de patrones y símbolos fundamentales.', href: `${SITE}/geometria-sagrada-estrella-madre-el-secreto-de-la-vida/`, figura: 'metatron' as const },
    { titulo: 'El Tetraedro: relación con los números y los astros', fecha: '27 dic 2023', autor: 'Mercè Lobo Casulleras', extracto: 'Para empezar os invito a localizar el Tetraedro en “El Fruto de la Vida” y trazarlo.', href: `${SITE}/relacionemos-el-tetraedro-con-los-numeros-y-los-astros/`, figura: 'tetraedro' as const },
    { titulo: 'El cubo y su relación con los números y los astros', fecha: '7 dic 2023', autor: 'Mercè Lobo Casulleras', extracto: 'Para empezar os invito a localizar el Cubo o Hexaedro en “El Fruto de la Vida” y trazarlo.', href: `${SITE}/el-cubo-y-su-relacion-con-los-numeros-y-los-astros/`, figura: 'cubo' as const },
    { titulo: 'Geometría Sagrada, números y simbología', fecha: '1 nov 2023', autor: 'Mercè Lobo Casulleras', extracto: 'A partir de ahora saldrán una serie de artículos donde hablaremos de los Sólidos Platónicos.', href: `${SITE}/repasemos-algunos-conceptos-antes-de-continuar/`, figura: 'numeros' as const },
  ],
};

// Preguntas redactadas para el rediseño; respuestas armadas con datos del sitio.
export const faq = [
  { q: '¿Necesito saber dibujar?', a: 'No. Ni el eBook ni el libro requieren conocimientos previos ni saber dibujar: solo compás, regla, lápiz y disposición a redescubrirte.' }, // [INVENTADO] pregunta + redacción
  { q: '¿Cuándo es la clase gratuita?', a: 'Un sábado al mes, en vivo y en directo desde nuestra web. Dejanos tu nombre y email y te avisamos la fecha.' }, // [INVENTADO] pregunta
  { q: '¿Cómo es la Formación Profesional?', a: '11 cursos, 24 meses, 100% online, con Certificado Internacional. Las primeras 6 materias se cursan a tu ritmo y las 5 restantes en vivo.' }, // [INVENTADO] pregunta
  { q: '¿Por dónde empiezo?', a: 'Por la clase gratuita y el eBook “7 trazos de Geometría Sagrada”: aprenderás los principios básicos y tus primeros trazos.' }, // [INVENTADO] pregunta + redacción
];

export const cierre = {
  kicker: 'Clase gratuita', // real
  titulo: ['Un sábado al mes,', 'trazamos juntos.'], // [INVENTADO]
  texto: 'Sigamos democratizando el conocimiento.', // real (banner de la home)
  cta: 'Reservar mi lugar', // [INVENTADO]
};

export const footer = {
  comunidad: 'Somos una comunidad de buscadores con más de 100.000 personas en las redes que estamos compartiendo y multiplicando.',
  copyright: '© 2014 – 2026 Espacio de Geometría Sagrada',
  horario: 'Lunes a viernes de 10.30 a 15.30 hs, hora Argentina.',
  email: 'info@espaciodegeometriasagrada.com',
};
