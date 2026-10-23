// Páginas traídas al sitio desde fuera de WordPress: subdominios de GoHighLevel, el PDF del programa de
// Armonización de Espacios, los eBooks y el libro. Los textos son los de cada fuente (ver `source`);
// precios, cupos y links de pago viven aparte, en _contenido/precios.json.
// Las imágenes se referencian por su URL original (manifest) o como `local:<nombre>` (public/img).
import precios from './precios.json';

const GHL = 'https://assets.cdn.filesafe.space/WGytKrOBaLvxQONqxC4s/media/';
const WPU = 'https://espaciodegeometriasagrada.com/wp-content/uploads/';
const AI = 'https://storage.googleapis.com/funnel-ai-production/image-generation/WGytKrOBaLvxQONqxC4s/';
export const IMG = {
  duoSolidos: GHL + '68d417befc3ef80644402822.png',
  libroMockup: GHL + '6a30e4fe58a961c20a09d6c5.png',
  libroPortada: GHL + '6a29fdf2944ae1c947cb5e99.png',
  libroAurora: GHL + 'f7daa4c5-6c87-41b3-95f2-c1a06a9aeedf.png',
  entrada: GHL + '6a3c9b89817563b473e930bb.png',
  entradaLibro: GHL + '6a4473adc9f77cd680a1c586.png',
  uruguay: ['6aa06bb1fcce077c443e5491', '6aa06bb44d38c898d51a439f', '6aa06bb2d63e08439cce8fa7', '6aa06bb1fb76acb4a936810c', '6aa06bb1a08d19d9275894fc', '6aa06bb116ed327815b0e6e2'].map((h) => `${GHL}${h}.jpg`),
  trazoPapel: AI + '3192b0d8-e37b-4575-b71a-fc32e180a818.png',
  bonosMockup: AI + '2e1a963a-93ae-4d3e-914b-617f102cfb28.png',
  talleres: ['1846', '1338', '1926', '1797', '2063', '1766'].map((n) => `${WPU}2024/10/DSC_${n}.jpg`),
  ebook7: WPU + '2024/01/ebook-7-trazos-de-la-geometria-sagrada.png',
  ebookSolidos: WPU + '2024/01/ebook-los-secretos-de-los-solidos-platonicos.png',
  ebookCirculos: WPU + '2024/01/ebook-trazos-de-circulos-de-cosecha.png',
  ebookTemario: WPU + '2024/01/unnamed-13.png',
  ebookAudios: WPU + '2024/01/unnamed-17.png',
  ebookMasterclass: WPU + '2024/01/unnamed-9.png',
};

const P = precios as any;
const INFO = 'info@espaciodegeometriasagrada.com';
const mail = (asunto: string) => `mailto:${INFO}?subject=${encodeURIComponent(asunto)}`;
const mailLink = `<a href="mailto:${INFO}">${INFO}</a>`;

type Raw = Record<string, any>;
const page = (p: Raw): Raw => ({ id: p.slug, kind: 'producto', date: '2026-10-16', modified: '2026-10-16', noindex: false, seo: { title: '', description: '' }, ...p });
const ul = (items: string[]) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const ps = (...t: string[]) => t.map((x) => `<p>${x}</p>`).join('');

/* ------------------------------------------------------------------ */
/* Especialización en Armonización de Espacios (PDF del programa)      */
/* ------------------------------------------------------------------ */
const A = P.armonizacion;
const yes = true, no = false;
export const armonizacion = page({
  slug: 'armonizacion-de-espacios',
  path: '/formaciones/armonizacion-de-espacios/',
  title: 'Especialización en Armonización de Espacios con Geometría Sagrada',
  source: 'PDF «Programa: Especialización en Armonización de Espacios con Geometría Sagrada» (assets.cdn.filesafe.space/…/6a8c8aaead59e6cfed73e7ae.pdf)',
  seo: { title: 'Especialización en Armonización de Espacios con Geometría Sagrada', description: '12 años formando Especialistas en Armonización de Espacios con Geometría Sagrada. Tres caminos de 9 meses: para tu casa, para tu práctica profesional o para tu estudio de arquitectura.' },
  hero: {
    kicker: 'Formaciones · 12 años formando Especialistas',
    lede: 'Hola! Bienvenido, bienvenida!. No estás aquí por casualidad. Ya sea que sientas que necesitas cambiar algo en tu hogar, o que este conocimiento te resuena para sumarlo a tu actividad, este programa es lo que estabas buscando.',
    trazo: 'hexagono',
    facts: [
      { label: 'Duración', value: '9 meses' },
      { label: 'Módulos', value: '7' },
      { label: 'Caminos', value: '3' },
      { label: 'Garantía', value: '15 días' },
    ],
  },
  cta: { text: 'Elegí tu camino', href: '#caminos' },
  sections: [
    { kicker: 'El programa', blocks: [
      { t: 'heading', level: 2, text: 'Hace más de 12 años enseñamos a leer y armonizar espacios.' },
      { t: 'text', html: ps('Hace más de 12 años enseñamos a leer y armonizar espacios a partir de la Geometría Sagrada, aplicando conocimientos de feng shui y la geobiología. En este tiempo formamos a miles de personas en más de 30 países, muchas de las cuales hoy reinventaron su profesión.') },
      { t: 'image', src: 'local:construccion-manos', alt: 'Manos construyendo un sólido platónico' },
    ] },
    { kicker: 'Objetivo del programa', blocks: [
      { t: 'heading', level: 2, text: 'Al finalizar cualquiera de los tres caminos, vas a poder:' },
      { t: 'steps', items: [
        { title: 'Leer cualquier plano', text: 'Leer cualquier plano y detectar qué zona está desequilibrada, y como restablecerla utilizando Geometría Sagrada' },
        { title: 'Construir en tercera dimensión', text: 'Construir en tercera dimensión Sólidos Platónicos, la Estrella Madre y el Vector de Equilibrio, para activar o neutralizar energéticamente cualquier ambiente.' },
        { title: 'Detectar líneas geopatógenas', text: 'Detectar líneas geopatógenas y telúricas con varillas, para encontrar la causa real de lo que la casa no explica: síntomas físicos en los habitantes de un hogar, o una “mala racha” que no afloja.' },
        { title: 'Aplicar Feng Shui y Arquitectura Consciente', text: 'Aplicar conocimientos de Feng Shui, ambientación energética, urbanismo y Arquitectura Consciente para convertir un proyecto propio o de un cliente en un espacio que funciona, se vive distinto (y aumenta el valor de tu servicio).' },
      ] },
    ] },
    { kicker: 'Temario', blocks: [
      { t: 'heading', level: 2, text: 'Temario del programa completo (7 módulos)' },
      { t: 'accordion', items: [
        { title: 'Fundamentos de Geometría Sagrada', html: ps('Significado de los trazos y su realización paso a paso, proporción y simbolismo aplicado a planos. Estos símbolos son parte de las herramientas que podrás utilizar para activar y armonizar un espacio. Conocerás las culturas que usaron simbología y como está era aplicada en sus construcciones.') },
        { title: 'Construcción de Sólidos Platónicos en 2d y 3d', html: ps('Aplicación práctica en la Armonización de Espacios.') },
        { title: 'Construcción de la Estrella madre y Vector de equilibrio', html: ps('Construcción de la Estrella madre y Vector de equilibrio.') },
        { title: 'Ambientes Geométricos, Geobiología', html: ps('Líneas de Hartmann, Curry y fallas geológicas, detección mediante uso de varillas, péndulo y testeo muscular.') },
        { title: 'Geometría Sagrada aplicada a la vivienda y al espacio del trabajo', html: ps('Mediante principios del Feng Shui y la neuroarquitectura.') },
        { title: 'Ambientación energética de espacios', html: ps('Del diagnóstico a la intervención.') },
        { title: 'Urbanismo, paisajismos y Arquitectura consciente', html: ps('Aplicación a proyectos reales.') },
      ] },
    ] },
    { kicker: 'Elegí tu camino', id: 'caminos', blocks: [
      { t: 'heading', level: 2, text: 'A continuación te contamos los tres caminos posibles.' },
      {
        t: 'compare', currency: A.moneda,
        cols: A.caminos.map((c: any) => ({ id: c.id, name: c.nombre, highlight: !!c.destacado })),
        groups: [
          { title: 'El camino', rows: [
            { label: 'Para quién es', cells: ['Sentís que tu casa no tiene la energía que te gustaría: no dormís bien, algo no fluye, y ya probaste de todo sin encontrar respuesta.', 'Arquitectos, Interioristas, decoradores, cansados de competir por precio y con ganas de ampliar sus conocimientos.', 'Tenés estudio y cartera de clientes. No te falta teoría, te falta un servicio que nadie más ofrece y una forma de venderlo sin devaluar tu marca.'] },
            { label: 'Qué vas a lograr', cells: ['Leer, diagnosticar y armonizar tu propia casa con geometría sagrada, sin depender de que alguien más te diga qué está pasando.', 'Certificarte como Especialista y salir con un plan y mentoría en grupo para conseguir tus primeros clientes pagos, sin tener que resolver sola cómo venderlo.', 'Sumar un servicio premium a tu estudio, con mentoría 1:1 diseñada para tu negocio, para dejar de competir por precio y subir tu ticket.'] },
            { label: 'Alcance del programa', cells: ['Para armonizar tu propia casa u oficina', 'Para intervenir en proyectos propios y de terceros.', 'Para intervenir en proyectos propios y de terceros, con urbanismo y arquitectura consciente.'] },
          ] },
          { title: 'Contenido y cursada', rows: [
            { label: 'Duración', cells: ['9 meses', '9 meses', '9 meses'] },
            { label: 'Módulos', cells: ['Primeros 5 (de 7)', '7 completos', '7 completos + Clases especiales'] },
            { label: 'Trabajos prácticos con devolución', cells: ['Por escrito, devolución en 10 días hábiles.', 'Por escrito, devolución en 5 días hábiles', 'Personalizado en mentorías 1-1'] },
            { label: 'Soporte', cells: ['Por correo electrónico, en 48 hs hábiles.', 'Por correo electrónico, en 24 hs hábiles.', 'Por correo electrónico, en 24 hs hábiles.'] },
            { label: 'Comunidad de estudiantes (WhatsApp)', cells: [yes, yes, yes] },
            { label: 'Plataforma', cells: ['Videos pre-grabados + cuadernillos', 'Videos pre-grabados + cuadernillos y plantillas', 'Videos pre-grabados + cuadernillos y plantillas'] },
            { label: 'Encuentros en vivo', cells: [no, 'Por zoom, 2do y 4to sábado de cada mes, 11 horas de Argentina', 'Por zoom, 2do y 4to sábado de cada mes, 11 horas de Argentina'] },
          ] },
          { title: 'Acompañamiento', rows: [
            { label: 'Refuerzo académico exclusivo', cells: [no, '3 sesiones 1:1 con Formador/a asignado.', '8 sesiones 1:1 (6 con Formador/a + 2 con Monique)'] },
            { label: 'Mentoría de monetización', cells: ['No aplica', '6 sesiones grupales con Pablo para comprender cómo monetizar tu aprendizaje.', '6 sesiones 1:1 con Pablo, para sumar una propuesta de valor aplicada a tu profesión.'] },
            { label: 'Certificación', cells: ['No otorga certificación', 'Especialista en Armonización de Espacios con Geometría Sagrada', 'Especialista en Armonización de Espacios con Geometría Sagrada'] },
            { label: 'Libro de regalo en tu casa', cells: [no, yes, yes] },
            { label: 'Acceso al campus', cells: ['1 año. Si lo terminas dentro del año, de por vida.', '1 año. Si lo terminas dentro del año, de por vida.', '1 año. Si lo terminas dentro del año, de por vida.'] },
            { label: 'Garantía', cells: ['15 días para probar la plataforma', '15 días para probar la plataforma', '15 días para probar la plataforma'] },
          ] },
          { title: 'Inversión', rows: [
            { label: 'Cupos de esta cohorte', cells: A.caminos.map((c: any) => c.cupos) },
            { label: 'Bonos incluidos', cells: A.caminos.map((c: any) => c.bonos) },
            { label: 'Valor total de todo el programa', cells: A.caminos.map((c: any) => c.valorTotal) },
            { label: 'Inversión real (En un solo pago)', cells: A.caminos.map((c: any) => `${c.pagoUnico} (${A.moneda})`) },
            { label: 'Inversión real (Pago financiado)', cells: A.caminos.map((c: any) => `${c.pagoFinanciado} (${A.moneda})`) },
            { label: 'Modalidad de ingreso', cells: A.caminos.map((c: any) => c.ingreso) },
          ] },
        ],
        ctas: A.caminos.map((c: any) => c.links.map((l: any) => ({ text: l.texto, href: l.href }))),
        note: 'Nota: varillas, péndulo y demás materiales de práctica se adquieren por separado en los tres niveles.',
      },
      { t: 'text', html: `<p><strong>¿Tienes dudas?</strong> Contacta con nuestro equipo aquí. Te ayudaremos a elegir la mejor opción según tu interés! <a href="${mail('Consulta por Armonización de Espacios')}">${INFO}</a></p>` },
    ] },
  ],
  faqNote: 'Nota: varillas, péndulo y demás materiales de práctica se adquieren por separado en los tres niveles.',
  faq: [
    { title: '¿Necesito ser arquitecto/a o interiorista para hacerlo?', html: ps('No. El programa está pensado tanto para quien quiere armonizar su propia casa como para profesionales que quieran sumar esta especialidad. No se requiere formación previa.') },
    { title: '¿Qué pasa si no puedo completarlo en 9 meses?', html: ps('Tenés 3 meses adicionales sin costo para terminar, con el mismo acompañamiento garantizado. Pasado ese plazo, se cobra una cuota mensual equivalente al valor de la financiación hasta completar el programa.') },
    { title: '¿Cuál es la diferencia real entre Nivel 2 y Nivel 3 si el contenido es el mismo?', html: ps('La diferencia es de contenido y de acompañamiento:') + ul(['en Nivel 2, tienes 3 sesiones de acompañamiento con un Formador/a asignado, y la mentoría de monetización con Pablo, es grupal,', 'en Nivel 3, tienes: clases especiales con el equipo + 8 sesiones de acompañamiento (6 con un Formador/a + 2 individuales con Monique). La mentoría de monetización con Pablo es individual.']) },
    { title: '¿Qué pasa si me arrepiento después de empezar?', html: ps('Tenés 15 días desde que accedés a la plataforma para probarla. Si no es para vos, dentro de ese plazo te devolvemos tu inversión sin demoras ni preguntas incómodas.') },
    { title: '¿Los materiales (varillas, péndulo) están incluidos?', html: ps('No, se compran aparte en los tres niveles. Nivel 2 y 3 además reciben el Libro “Geometría Sagrada, un camino de reconocimiento” de regalo enviado a tu casa. Generalmente llega entre 30 a 40 días después de haber ingresado.') },
  ],
});

/* ------------------------------------------------------------------ */
/* Especialización en Terapias (texto del News Geométrico #… de Monique) */
/* ------------------------------------------------------------------ */
export const terapias = page({
  slug: 'especializacion-en-terapias',
  path: '/formaciones/especializacion-en-terapias/',
  title: 'Especialización en Terapias con Geometría Sagrada',
  source: 'News Geométrico «Lo que no se aprende en un fin de semana» y «El terapeuta que ya no vuelve» (el subdominio terapias.espaciodegeometriasagrada.com hoy responde 404)',
  seo: { title: 'Especialización en Terapias con Geometría Sagrada', description: 'Aplicá protocolos de Geometría Sagrada en tus terapias: 7 módulos y un curso final en 9 meses, 100% online, con acompañamiento personalizado y certificación.' },
  hero: {
    kicker: 'Formaciones · Especialización',
    lede: 'La Especialización en Terapias fue creada para médicos, psicólogos, psiquiatras y terapeutas que quieren pasar por el cuerpo la experiencia completa: conocer los protocolos de trabajo, entender cómo se adapta a cada tipo de profesional y a cada consulta, y salir con las herramientas para acompañar con responsabilidad real.',
    trazo: 'triangulo',
    facts: [
      { label: 'Duración', value: 'Nueve meses' },
      { label: 'Para', value: 'Médicos, psicólogos, psiquiatras y terapeutas' },
      { label: 'Ingreso', value: 'Entrevista de admisión' },
      { label: 'Aperturas', value: 'Dos veces al año' },
    ],
  },
  cta: { text: 'Solicitá tu entrevista de admisión', href: '/formaciones/admision/?programa=terapias' },
  sections: [
    { kicker: 'El recorrido', blocks: [
      { t: 'heading', level: 2, text: 'Nueve meses, no nueve días.' },
      { t: 'text', html: ps('Es un recorrido de nueve meses. Y leíste bien: <strong>nueve meses,</strong> no nueve días.', 'Porque la diferencia entre probar algo y dominarlo es precisamente <strong>el tiempo que le dedicas.</strong>', 'A lo largo de ese camino vas a recorrer en profundidad lo que en estos meses apenas asomamos en los news: <strong>los Sólidos Platónicos como herramienta terapéutica</strong>, el <strong>protocolo de la sesión en camilla</strong>, cómo trabajar desde la coherencia para no cargarte con la energía del otro, <strong>cómo leer y aplicar las formas</strong>.', 'Todo lo que aprendí, ordenado y actualizado, <strong>con acompañamiento personalizado de nuestro equipo de formadores.</strong>') },
      { t: 'image', src: 'local:monique-taller', alt: 'Monique Dumoulin en un taller del Espacio' },
    ] },
    { kicker: 'Lo que vas a recorrer', blocks: [
      { t: 'heading', level: 2, text: 'El conocimiento sin proceso es solo vocabulario.' },
      { t: 'steps', items: [
        { title: 'Los Sólidos Platónicos como herramienta terapéutica', text: 'Cómo incorporar geometrías o frecuencias adecuadas donde ocurrió el desequilibrio.' },
        { title: 'El protocolo de la sesión en camilla', text: 'Conocer los protocolos de trabajo y cómo se adapta a cada tipo de profesional y a cada consulta.' },
        { title: 'Trabajar desde la coherencia', text: 'Cómo trabajar desde la coherencia para no cargarte con la energía del otro.' },
        { title: 'Leer y aplicar las formas', text: 'Cómo leer y aplicar las formas, con acompañamiento personalizado de nuestro equipo de formadores.' },
      ] },
      { t: 'text', html: ps('La Especialización es el lugar donde <strong>esa búsqueda termina.</strong> No porque sea “la última técnica”, sino porque te <strong>devuelve la autonomía</strong>: dejas de depender de que otro te diga qué hacer, y te convertís en quien sostiene el proceso.', 'La búsqueda se vuelve oficio. <strong>El que acompaña sale entero.</strong> Y vos dejas de coleccionar herramientas para empezar a tener un lenguaje propio.') },
    ] },
    { kicker: 'Cómo es el ingreso', tone: 'soft', blocks: [
      { t: 'heading', level: 2, text: 'Cómo es el ingreso' },
      { t: 'text', html: ps('Abrimos la Especialización solo dos veces al año, y con plazas limitadas. No es una estrategia: <strong>es la única manera de garantizar el acompañamiento personalizado que cada proceso necesita.</strong>', 'Por eso, antes de confirmar tu lugar, <strong>hacemos una entrevista de admisión</strong>. No es un filtro para excluir. <strong>Es una conversación para conocerte, entender desde dónde venís y hacia dónde queres ir, y para que despejes todas tus dudas antes de comprometerte con un camino de nueve meses.</strong>') },
      { t: 'button', text: 'Solicitá tu entrevista de admisión', href: '/formaciones/admision/?programa=terapias' },
    ] },
  ],
});

/* ------------------------------------------------------------------ */
/* Admisión (admision.espaciodegeometriasagrada.com + paso de entrevista) */
/* ------------------------------------------------------------------ */
export const admision = page({
  slug: 'admision',
  path: '/formaciones/admision/',
  title: 'Agenda tu Entrevista de información y admisión.',
  source: 'admision.espaciodegeometriasagrada.com y /solicita-tu-entrevista-fpgs; calendario de Armonización del PDF del programa',
  seo: { title: 'Admisión: agendá tu entrevista', description: 'Todos los detalles como valores de inversión, medios de pago, días y horarios de cursada te serán dados en una Entrevista Informativa de 30 minutos.' },
  hero: {
    kicker: 'Formaciones · Admisión',
    lede: 'Todos los detalles como valores de inversión, medios de pago, días y horarios de cursada te serán dados en una Entrevista Informativa de 30 minutos donde podrás realizar todas tus consultas y evaluar si esta Especialización es para ti.',
    trazo: 'vesica',
    facts: [
      { label: 'Duración', value: '30 minutos' },
      { label: 'Modalidad', value: 'Videollamada (Google Meet)' },
      { label: 'Costo', value: 'Sin compromiso' },
    ],
  },
  cta: { text: 'Elegí tu programa y agendá', href: '#agenda' },
  sections: [
    { kicker: 'Agenda', id: 'agenda', blocks: [
      { t: 'heading', level: 2, text: 'Elegí el programa y reservá tu horario.' },
      { t: 'text', html: ps('Por favor, completa el formulario de manera honesta y sincera. Nuestro equipo se tomará el tiempo de leerla y darte una respuesta acorde a tus requerimientos.', 'La llamada se realizará por videollamada (Google Meet) y te enviaremos todos los detalles por correo.') },
      { t: 'embed', id: 'admision', title: 'Calendario de entrevistas de admisión', height: 900, src: P.admision.formacionProfesional.calendario, options: [
        { id: 'formacion', label: 'Formación Profesional / Especialización en Terapias', src: P.admision.formacionProfesional.calendario, note: 'La inversión total de la Formación, por los 9 meses de estudio, es de U$D 2477.- La inversión mínima requerida para comenzar la Formación es de U$D 500.- Te compartiremos los planes de financiación y bonos por inscripción temprana en la entrevista.' },
        { id: 'armonizacion', label: 'Especialización en Armonización de Espacios', src: P.admision.armonizacion.calendario },
      ] },
      { t: 'text', html: `<p class="text-small">Al brindar tus datos en nuestros formulario, aceptas que te enviemos correos y mensajes relacionados con la información solicitada. Escribe a ${mailLink} si deseas conocer nuestra política de privacidad, y términos y condiciones de uso de nuestras plataformas.</p>` },
    ] },
    { kicker: 'Nuestra Misión: Compartir y Multiplicar', blocks: [
      { t: 'heading', level: 2, text: 'Formación en Geometría Sagrada' },
      { t: 'text', html: ps('Aprende el lenguaje del universo aplicado a tu vida profesional y personal, en 9 meses y con acompañamiento personalizado.', 'Planes de financiación disponibles. Bonos incluidos por pago anticipado.') },
      { t: 'card', title: 'Democratizar el conocimiento', html: ps('Nuestra misión es expandir la Geometría Sagrada al mayor número de personas posible. Estas clases tienen un valor símbolico, para que cualquiera pueda dar sus primeros pasos y beneficiarse de este conocimiento ancestral.') },
      { t: 'card', title: 'Una Trayectoria de 12 Años', html: ps('Llevamos más de once años compartiendo y multiplicando esta enseñanza. A lo largo de este camino hemos acompañado a miles de personas en su proceso de transformación, siempre con honestidad y respeto por cada estudiante.') },
      { t: 'card', title: 'Experiencias Transformadoras', html: ps('Estas clases son el primer contacto con un conocimiento ancestral que puede aplicarse en tu vida diaria. No es solo teoría: son experiencias que te permiten sentir la geometría en tu cuerpo, tus emociones y tu entorno.') },
      { t: 'card', title: 'El Camino a la Maestría', html: ps('Para quienes buscan ir más allá, tenemos propuestas de aprendizaje profesional. No prometemos soluciones rápidas: se trata de un viaje de práctica y compromiso, diseñado para quienes quieren integrar esta sabiduría en profundidad.') },
    ] },
    { kicker: 'La experiencia, nuestro mayor orgullo', blocks: [
      { t: 'heading', level: 2, text: 'Donde Sabiduría y Práctica se Encuentran.' },
      { t: 'text', html: ps('Fundados en la pasión por llevar la Geometría Sagrada a la vida diaria, nos especializamos en ofrecer experiencias de aprendizaje que combinan claridad, práctica y transformación real. Con un equipo formador con más de una década de experiencia, garantizamos que cada clase sea reveladora, aplicable y memorable.') },
      { t: 'video', provider: 'vimeo', id: '1182276162' },
      { t: 'stats', items: [
        { value: '12 años', label: 'Compartiendo y Multiplicando el conocimiento que le hace bien al mundo' },
        { value: '+ 10000', label: 'Estudiantes en más de 30 paises.' },
        { value: '+85%', label: 'De nuestros estudiantes continua estudiando con nosotros con alguna proopuesta.' },
      ] },
    ] },
    { kicker: '¿Que Dicen Nuestros Estudiantes?', blocks: [
      { t: 'heading', level: 2, text: 'testimonios reales... de personas reales!' },
      { t: 'testimonial', text: 'Cada trazo generó un cambio real en mí: claridad mental, movimiento energético y un impacto positivo que sigo sintiendo en mi vida diaria después de cada práctica.', name: 'María Luciana C.', role: 'Estudiante de nuestra Formación en Argentina' },
      { t: 'testimonial', text: 'Nunca imaginé descubrir tanto de mí misma con los trazos. Me mostraron mis luces y sombras, ayudándome a crecer con más conciencia y reconocer mis fortalezas internas', name: 'Karen Hernández F.', role: 'Estudiante de la MasterClass, en España' },
      { t: 'testimonial', text: 'Mientras armaba los sólidos encontré valentía para cambios profundos. Mi vida y mi entorno se transformaron por completo, dándome un nuevo sentido y dirección real.', name: 'Adriana Mabel M.', role: 'Lectora de nuestros eBooks, en U.S.A' },
      { t: 'testimonial', text: 'Los trazos me dieron paciencia y foco. Pinté un espiral y lo puse en el área del dinero: cada vez que lo miro me inspira abundancia y me recuerda que todo fluye naturalmente.', name: 'María Valeria G.', role: 'Estudiante de nuestra Mentoria en Chile' },
      { t: 'testimonial', text: 'Hice muchas capacitaciones. Nunca me sentí tan acompañada ni contenida. Monique y Pablo son generosos en lo que comparten. La mejor inversión que hice en mi vida', name: 'Angelica L.', role: 'Estudiante de la MasterClass, en México' },
      { t: 'testimonial', text: 'Es una medicina. Al respirar y recorrer los trazos siento ajustes internos, claridad y hasta mensajes de mis ancestros que me ayudan a sanar y encontrar verdadero sentido.', name: 'Gracia B.', role: 'Estudiante de nuestra Formación, en Colombia' },
      { t: 'heading', level: 3, text: 'Podriamos poner cientos y cientos de testimonios... pero el que mas nos importa es el próximo: el tuyo!' },
      { t: 'video', provider: 'youtube', id: '4T45fasMl3c' },
      { t: 'video', provider: 'youtube', id: 'foohKfmeD7M' },
      { t: 'video', provider: 'youtube', id: 'OChXAUjjsas' },
      { t: 'video', provider: 'youtube', id: 'JZGZVp04obw' },
      { t: 'video', provider: 'youtube', id: 'MCqYnVsQ5Do' },
      { t: 'video', provider: 'youtube', id: '6Sz_iQ3Al1g' },
    ] },
  ],
});

/* ------------------------------------------------------------------ */
/* Club Formadores Geómetras (formadores.espaciodegeometriasagrada.com/club-page) */
/* ------------------------------------------------------------------ */
const C = P.club;
const planCopy: Record<string, { name: string; per?: string; badge?: string; lead: string; includes: string[]; note?: string; cta: string }> = {
  gratis: { name: 'Gratis', lead: 'Solo validación del certificado', includes: ['Validación anual del certificado completando un cuestionario y tres trabajos', 'Tu lugar en el Registro de Formadores'], note: 'No incluye los encuentros de los jueves ni la clase con Monique.', cta: 'Quiero validar gratis' },
  mensual: { name: 'Mensual', per: 'por mes', lead: '', includes: ['Encuentros de los jueves', 'Clase con Monique el cuarto sábado de cada mes, solo para Formadores', 'Un trazo inédito por mes, trazado junto a Monique', 'Biblioteca de trazos inéditos', 'Tu lugar en el Registro de Formadores', 'Validación del certificado al completar el tercer mes'], cta: 'Sumarme mensual' },
  anual: { name: 'Anual', per: 'por año', badge: 'INCLUYE MENTORÍA', lead: 'Dos meses de regalo', includes: ['Todo lo del plan mensual', 'Mentoría grupal con Pablo por Zoom, cada 15 días, durante 3 meses', 'Validación inmediata del certificado', 'Lugar destacado en el Registro de Formadores'], cta: 'Sumarme anual' },
};
export const club = page({
  slug: 'club-formadores',
  path: '/formaciones/club-formadores/',
  title: 'Club Formadores Geómetras',
  source: 'formadores.espaciodegeometriasagrada.com/club-page',
  seo: { title: 'Club Formadores Geómetras', description: 'El espacio exclusivo para Formadores certificados. Los encuentros de los jueves, una clase por mes con Monique y tu certificado actualizado.' },
  hero: {
    kicker: 'Formaciones · Para Formadores certificados',
    lede: 'El espacio exclusivo para Formadores certificados. Los encuentros de los jueves, una clase por mes con Monique y tu certificado actualizado.',
    trazo: 'semilla',
    facts: [
      { label: 'Para', value: 'Formadores certificados' },
      { label: 'Planes', value: 'Gratis · Mensual · Anual' },
      { label: 'Primera clase', value: 'Sábado 24 de octubre de 2026, de 13:30 a 15 hs' },
    ],
  },
  cta: { text: 'Ver opciones', href: '#planes' },
  sections: [
    { kicker: 'Lo que no cambia y lo que cambia', blocks: [
      { t: 'heading', level: 2, text: 'Lo que no cambia y lo que cambia' },
      { t: 'card', title: 'Lo que no cambia', html: ps('Tu acceso a la plataforma y a los videos de tu formación sigue siendo de por vida, como te lo prometimos.') },
      { t: 'card', title: 'Lo que cambia', html: ps('Los encuentros de los jueves, que tenías sin costo, ahora forman parte del Club Formadores Geómetras. Al sumarte, los seguís teniendo y además accedés a todo lo que armamos solo para Formadores.', 'Un miembro del Club de Geómetras paga USD 57 por mes. Como Formador, pagás USD 47 y tenés los encuentros de los jueves más todo lo exclusivo.') },
    ] },
    { kicker: 'Qué es', blocks: [
      { t: 'heading', level: 2, text: 'Qué es el Club Formadores Geómetras' },
      { t: 'text', html: ps('El espacio para quienes completaron su certificación en el Espacio de Geometría Sagrada. Incluye los encuentros de los jueves y todo lo nuevo que armamos para Formadores.') },
      { t: 'steps', items: [
        { title: 'Encuentros de los jueves.', text: 'Seguís participando de los encuentros en vivo de todas las semanas.' },
        { title: 'Clase con Monique.', text: 'El cuarto sábado de cada mes, solo para Formadores. Tema del mes, respuestas a tus preguntas y casos reales.' },
        { title: 'Trazás con Monique.', text: 'Ese día trazás junto a ella un trazo inédito que no está en la plataforma. En un año tenés una biblioteca de 12.' },
        { title: 'Validación anual de tu certificado.', text: 'Para presentarte como Formador vigente.' },
        { title: 'Registro de Formadores.', text: 'Alumnos y consultantes pueden encontrarte y verificar tu certificación.' },
      ] },
      { t: 'text', html: ps('<strong>Primera clase con Monique: sábado 24 de octubre de 2026, de 13:30 a 15 hs.</strong>') },
      { t: 'image', src: IMG.trazoPapel, alt: 'Trazo de geometría sagrada terminado sobre papel, con regla y compás (ilustración)' },
    ] },
    { kicker: 'Para quién es', blocks: [
      { t: 'heading', level: 2, text: 'Para quién es' },
      { t: 'text', html: ps('Para Formadores certificados del Espacio de Geometría Sagrada. No está abierto a miembros del Club de Geómetras ni a estudiantes en formación.') + ul(['Formadores que se certificaron pero hoy no ejercen, y quieren retomar la práctica.', 'Formadores que quieren profesionalizar cómo comunican y venden lo que hacen.', 'Formadores que dan clases, talleres o armonizaciones y quieren seguir creciendo con el respaldo del Espacio.']) },
      { t: 'image', src: 'local:taller-alumnas', alt: 'Alumnas trazando en un taller del Espacio' },
    ] },
    { kicker: 'Por qué existe', blocks: [
      { t: 'heading', level: 2, text: 'Por qué existe' },
      { t: 'text', html: ps('Para que el certificado de Formador siga significando algo: que quien figura como Formador vigente esté activo, actualizado y en contacto con el Espacio.') },
      { t: 'steps', items: [
        { title: 'Cuidar el valor del certificado.', text: 'Un certificado vigente muestra práctica sostenida, no solo una formación terminada.' },
        { title: 'No ejercer en soledad.', text: 'Llevás tus casos reales y tus dudas a Monique, y los resolvés con respaldo.' },
        { title: 'Seguir aprendiendo.', text: 'Cada mes profundizamos en un tema nuevo.' },
        { title: 'Visibilidad.', text: 'El registro muestra quiénes están vigentes para que te encuentren.' },
      ] },
    ] },
    { kicker: 'Elegí tu opción', id: 'planes', blocks: [
      { t: 'heading', level: 2, text: 'Elegí tu opción' },
      { t: 'plans', regions: C.regiones.map((r: any) => ({
        id: r.id, name: r.nombre,
        plans: r.planes.map((pl: any) => {
          const c = planCopy[pl.id];
          return { id: pl.id, name: c.name, price: pl.precio, per: c.per, badge: c.badge, lead: c.lead, includes: c.includes, note: c.note, cta: { text: c.cta, href: pl.href || mail(`Club Formadores Geómetras — plan ${c.name.toLowerCase()} (${r.nombre})`) } };
        }),
      })) },
    ] },
    { kicker: 'Bonos de lanzamiento', blocks: [
      { t: 'heading', level: 2, text: 'Bonos de lanzamiento' },
      { t: 'text', html: ps('Para quienes se suman con el plan mensual o anual hasta el domingo 11 de octubre.') },
      { t: 'image', src: IMG.bonosMockup, alt: 'Mockup de bonos de lanzamiento: kit de plantillas, guía y textos' },
    ] },
    { kicker: 'Acompañamiento estratégico', blocks: [
      { t: 'heading', level: 2, text: 'Mentoría grupal con Pablo' },
      { t: 'text', html: ps('Incluida en el plan anual. Durante 3 meses, encuentros por Zoom cada 15 días para trabajar cómo comunicás, posicionás y vendés tus talleres, clases o armonizaciones. Pablo Pettinaroli es diseñador multimedial y dirige el Espacio de Geometría Sagrada junto a Monique.') },
      { t: 'image', src: 'local:pablo-icosaedro', alt: 'Pablo Pettinaroli con un icosaedro' },
    ] },
  ],
  faq: [
    { title: '¿Pierdo el acceso a la plataforma y a los videos de mi formación?', html: ps('No. Tu acceso a la plataforma y a los videos es de por vida, como te lo prometimos.') },
    { title: '¿Qué pasa con los encuentros de los jueves?', html: ps('Ahora forman parte del Club Formadores Geómetras. Para seguir participando, elegís el plan mensual o anual. La opción gratis no los incluye.') },
    { title: '¿Cuándo son las clases con Monique?', html: ps('El cuarto sábado de cada mes. Ese día trazás con ella el trazo inédito del mes. La primera es el sábado 24 de octubre de 2026, de 13:30 a 15 hs.') },
    { title: '¿Cuánto dura la mentoría del plan anual?', html: ps('3 meses, con encuentros por Zoom cada 15 días.') },
    { title: '¿Por qué ahora tiene costo?', html: ps('Los encuentros de los jueves fueron un regalo que sostuvimos durante años. El Espacio creció y sostenerlos tiene un costo real. Igual, un miembro del Club de Geómetras paga USD 57 por mes, y vos como Formador pagás USD 47 y tenés más.') },
    { title: 'En el plan mensual, ¿cuándo queda validado mi certificado?', html: ps('Al completar el tercer mes pago. Desde el primer mes ya accedés a todo lo demás.') },
    { title: '¿Puedo cancelar?', html: ps('Sí, cuando quieras. No hay reembolsos.') },
    { title: '¿Y si cancelo antes del tercer mes?', html: ps('Tu certificado no queda validado por esa vía, pero podés validarlo con la opción gratuita.') },
    { title: '¿Qué pasa si no valido mi certificado?', html: ps('Figurás en el Registro de Formadores como certificado no vigente.') },
    { title: '¿Hasta cuándo puedo entregar los trabajos de la opción gratuita?', html: ps('Podés entregarlos en cualquier momento del año.') },
    { title: '¿En qué moneda pago?', html: ps('Desde Argentina, en pesos. Desde el resto del mundo, en dólares. Elegí tu país arriba de los planes.') },
  ],
});

/* ------------------------------------------------------------------ */
/* Experiencias Geométricas (experiencias.espaciodegeometriasagrada.com) */
/* ------------------------------------------------------------------ */
const E = P.experiencias;
export const experienciasEventos = [
  { path: '/formaciones/experiencias/presentacion-del-libro/', title: '7 de Noviembre - Buenos Aires', sub: 'Presentación Libro - Exclusiva Comunidad' },
  { path: '/formaciones/experiencias/buenos-aires-28-de-noviembre/', title: '28 de Noviembre - Buenos Aires', sub: 'Fecha confirmada - Etapa Preventa 1' },
  { path: '/formaciones/experiencias/retiro-maldonado-uruguay/', title: '19 al 21 de Marzo - Maldonado (Uruguay)', sub: 'Fecha confirmada - Etapa Preventa Abierta' },
];
export const experiencias = page({
  slug: 'experiencias',
  path: '/formaciones/experiencias/',
  title: 'Experiencias Geométricas',
  source: 'experiencias.espaciodegeometriasagrada.com',
  seo: { title: 'Experiencias Geométricas: eventos presenciales en tu ciudad', description: 'Eventos presenciales en tu ciudad. Hace click en la fecha que te interesa para conocer todos los detalles. Muy pronto nuevas fechas disponibles.' },
  hero: { kicker: 'Formaciones · Presenciales', lede: 'Los eventos presenciales en tu ciudad.', trazo: 'espiral', image: IMG.talleres[0] },
  cta: { text: 'Ver fechas', href: '#fechas' },
  sections: [
    { kicker: 'Fechas', id: 'fechas', blocks: [
      { t: 'heading', level: 2, text: '12 años escribiendo una historia.' },
      { t: 'text', html: ps('Hace click en la fecha que te interesa para conocer todos los detalles. Muy pronto nuevas fechas disponibles.') },
      ...experienciasEventos.map((e) => ({ t: 'card', title: e.title, html: ps(e.sub), href: e.path })),
    ] },
    { kicker: 'Llevalas a tu ciudad', blocks: [
      { t: 'heading', level: 2, text: '¿Querés que viajemos a tu Ciudad?' },
      { t: 'card', title: 'Postula tu Espacio', html: ps('¿Tenes un Espacio y queres que viajemos a tu Ciudad? Postulalo acá'), href: '/formaciones/experiencias/postula-tu-espacio/' },
      { t: 'card', title: 'Postulate como Productor', html: ps('¿Sos productor o tenes una escuela y queres que viajemos a tu Ciudad? Postulalo acá'), href: '/formaciones/experiencias/productores/' },
    ] },
    { kicker: 'Así se viven', blocks: [
      { t: 'video', provider: 'vimeo', id: '1021827689' },
      ...IMG.talleres.slice(1, 6).map((src) => ({ t: 'image', src, alt: 'Experiencias Geométricas' })),
    ] },
  ],
});

const faqItems = (pairs: [string, string][]) => pairs.map(([title, a]) => ({ title, html: ps(a) }));

export const eventoBsAs = page({
  slug: 'buenos-aires-28-de-noviembre',
  path: '/formaciones/experiencias/buenos-aires-28-de-noviembre/',
  title: 'Experiencias Geométricas · Volumen 3',
  source: 'experiencias.espaciodegeometriasagrada.com/bsas-2811',
  seo: { title: 'Experiencias Geométricas · Volumen 3 · Buenos Aires', description: 'Vení a pasar un dia jugando con la Geometría Sagrada. Sábado 28 de noviembre, Belgrano, Buenos Aires.' },
  breadcrumb: [{ label: 'Experiencias', href: '/formaciones/experiencias/' }],
  hero: {
    kicker: 'Sábado 28 de noviembre · Belgrano · Buenos Aires',
    lede: 'Volumen 3 · Nuevas Experiencias + Laberinto de Chartres',
    trazo: 'espiral',
    facts: [{ label: 'Fecha', value: 'Sábado 28 de noviembre, 10.45 hs' }, { label: 'Lugar', value: '“Consciencia sin Barreras”, Av. Cabildo 2720, Belgrano' }, { label: 'Desde', value: E.buenosAires.opciones[0].precio }],
  },
  cta: { text: 'Elegí tu entrada', href: '#entradas' },
  sections: [
    { kicker: '¡Una propuesta presencial e inmersiva!', blocks: [
      { t: 'heading', level: 2, text: 'Un nuevo workshop para caminar juntos el Laberinto de Chartres' },
      { t: 'text', html: ps('Seguimos llevando experiencias presenciales para continuar creando comunidad mientras experimentamos cómo la Geometría Sagrada te ayuda a transformar tu vida.', 'La energía de nuestras "clases gratuitas" en vivo, junto a Monique, Pablo y todo el equipo que lo hace posible.') },
      { t: 'video', provider: 'vimeo', id: '1021827689' },
    ] },
    { kicker: 'Lo que vamos a hacer', blocks: [
      { t: 'steps', items: [
        { title: 'Vamos a trazar', text: 'El símbolo geométrico con el cuál iniciamos nuestro camino.' },
        { title: 'Jugar con los mandalas', text: 'Y estaremos creando "masa crítica", un inmenso tubo toroide lleno de amor para enviar al mundo.' },
        { title: 'Construir figuras', text: 'Construiremos una figura geométrica y experimentaremos el significado de dar y recibir.' },
        { title: 'Meditar en vivo', text: 'Meditaremos con las formas, en un viaje que irá más allá de nuestros 5 sentidos.' },
      ] },
      ...IMG.talleres.slice(0, 3).map((src) => ({ t: 'image', src, alt: 'Experiencias Geométricas' })),
    ] },
    { kicker: 'Cronograma', blocks: [
      { t: 'heading', level: 2, text: 'Cronograma' },
      { t: 'table', head: ['Horario', 'Actividad'], rows: [
        ['10.45 a 12.30', 'Experiencias Geométricas corporales. Juegos y desafíos. Clase de Monique y Pablo.'],
        ['13.10 a 14.30 hs', 'Almuerzo libre. No incluido dentro del evento.'],
        ['14.30 hs', 'Meditación con Sólidos. Espacio de Silencio. Recorrido del Laberinto de Chartres.'],
        ['16.30 hs', 'Cierre del evento.'],
      ], caption: 'Los horarios son estimativos. Reserva una hora adicional en tu agenda.' },
      { t: 'map', src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.869549756537!2d-58.46434512557779!3d-34.55685815502265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb42a3fd26f1f%3A0xdb9a3914f666e2a1!2sAv.%20Cabildo%202720%2C%20C1428%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1790445291183!5m2!1ses-419!2sar' },
    ] },
    { kicker: 'Entradas', id: 'entradas', blocks: [
      { t: 'heading', level: 2, text: 'Elegí la opción que mejor te acompañe.' },
      { t: 'tickets', items: [
        { img: IMG.entrada, kicker: 'SOLO ENTRADA', title: 'Workshop Laberinto de Chartres', text: 'La entrada a la experiencia', before: E.buenosAires.opciones[0].antes, price: E.buenosAires.opciones[0].precio, items: ['Acceso al evento presencial — sáb. 28 de noviembre, 10.45 hs', 'Experiencias Geométricas corporales, juegos y desafíos', 'Clase con Monique y Pablo', 'Meditación con Sólidos y recorrido del Laberinto'], cta: { text: 'Quiero esta opción', href: E.buenosAires.opciones[0].href }, note: 'El almuerzo no está incluido.' },
        { img: IMG.entradaLibro, kicker: 'ENTRADA + LIBRO', title: 'Workshop + Libro', text: 'La entrada + el libro firmado', before: E.buenosAires.opciones[1].antes, price: E.buenosAires.opciones[1].precio, items: ['Todo lo de la entrada al Workshop', 'Libro "Geometría Sagrada" firmado y dedicado', 'Retirás el libro el día del evento'], cta: { text: 'Quiero esta opción', href: E.buenosAires.opciones[1].href }, note: 'El almuerzo no está incluido.' },
        { img: IMG.libroMockup, kicker: 'PACK COMPLETO', title: 'Workshop + Libro + Club', text: 'La entrada, el libro y 3 meses gratis en el Club de Geómetras', before: E.buenosAires.opciones[2].antes, price: E.buenosAires.opciones[2].precio, items: ['Todo lo de la entrada al Workshop', 'Libro "Geometría Sagrada" firmado y dedicado', '3 meses gratis en el Club de Geómetras (cada mes vale $57.000)'], cta: { text: 'Quiero esta opción', href: E.buenosAires.opciones[2].href }, note: 'El almuerzo no está incluido.' },
      ] },
      { t: 'list', items: [
        { text: 'Luego de tu pago, recibirás un correo con confirmación de compra.' },
        { text: 'Durante los días previos al evento, te enviaremos material a tu correo electrónico para que puedas prepararte.' },
        { text: 'El 28 de Noviembre, te esperaremos en "Consciencia sin Barreras" para vivir el evento!' },
        { text: 'La ubicación dentro del lugar de trabajo será asignada por orden de compra. Te indicaremos tu lugar el día del evento.' },
      ] },
      { t: 'text', html: ps('Hemos diseñado una experiencia inmersiva en la cual podrás experimentar todo lo aprendido en tu Formación, acompañado por Pablo, Monique y el equipo de Formadores y Formadoras. Te esperamos!') },
    ] },
  ],
  faqNote: `¿Tienes otra duda? Escríbenos a ${INFO} con el asunto "Consulta por Experiencias Geométricas"`,
  faq: faqItems([
    ['¿Cuáles son los medios de pago?', 'Puedes abonar con tu tarjeta de crédito, o débito. O a nuestro alias "GEOMETRIA-SAGRADA".'],
    ['¿Qué materiales necesito?', 'Debes tener un compás, un lápiz negro, lápices de colores, una boligoma y una regla o escuadra. Todo lo demás que necesitas para aprender, será brindado por nosotros!'],
    ['¿Está incluido el almuerzo?', 'No. Entre las 13.10 y las 14.30 hs hay un espacio de almuerzo libre, que no está incluido dentro del evento.'],
    ['¿Este workshop cuenta con certificado?', 'No. Las propuestas presenciales son experiencias para divertirse y disfrutar de la magia de la Geometría Sagrada.'],
    ['¿Este es uno de los talleres habituales que ofrece el Espacio de Geometría Sagrada?', '"Experiencias Geométricas" es un evento diseñado para transmitir con todo el mundo lo que la Geometría Sagrada puede hacer en la vida de las personas. Cada evento es diferente y este tiene la particularidad de que caminaremos juntos el Laberinto de Chartres para experimentar en comunidad los beneficios de esta herramienta.'],
    // En el original dice «…hasta el [FECHA]»: el marcador quedó sin completar y no se publica.
    ['¿Qué pasa si adquiero mi entrada y luego no puedo asistir?', `Si no puedes asistir, deberás escribir a nuestro email ${INFO}. Podrás cambiar la entrada por cualquiera de nuestros ebooks o cursos de similar valor. No emitiremos reembolsos.`],
  ]),
});

export const eventoPresentacion = page({
  slug: 'presentacion-del-libro',
  path: '/formaciones/experiencias/presentacion-del-libro/',
  title: 'Presentación del libro Geometría Sagrada',
  source: 'experiencias.espaciodegeometriasagrada.com/presentacionlibro',
  seo: { title: 'Presentación del libro Geometría Sagrada · Buenos Aires', description: 'Vení a pasar un momento íntimo con Monique y Equipo. Sábado 7 de noviembre, 15.30 hs, Belgrano. Acceso prioritario para Lectores, Estudiantes y Formadores.' },
  breadcrumb: [{ label: 'Experiencias', href: '/formaciones/experiencias/' }],
  hero: {
    kicker: 'Sábado 7 de noviembre · 15.30 hs · Belgrano · Buenos Aires',
    lede: 'Acceso prioritario · Lectores, Estudiantes y Formadores',
    trazo: 'vesica',
    image: IMG.libroMockup,
    facts: [{ label: 'Entrada', value: 'Sin costo' }, { label: 'Duración', value: '45 minutos' }, { label: 'Confirmación', value: 'Por encuesta + WhatsApp' }],
  },
  cta: { text: 'Confirmar mi lugar', href: '#confirmar' },
  sections: [
    { kicker: 'Antes de abrirla al público, la abrimos para vos.', blocks: [
      { t: 'heading', level: 2, text: 'Una tarde para celebrar el libro con quienes lo hicieron posible' },
      { t: 'text', html: ps('Fueron 12 años de trabajo hasta llegar a este libro. Y vos fuiste parte de ese camino. Por eso, queremos que estés en primera fila el día que lo presentamos. Tu entrada y la de tus invitados no tienen costo.', '45 minutos junto a Monique, Pablo y la comunidad que, durante todos estos años, eligió caminar la Geometría Sagrada con nosotros.') },
      { t: 'steps', items: [
        { title: 'La historia detrás del libro', text: 'Cómo nació, qué lo hizo esperar 12 años y lo que nunca se contó, de boca de quienes lo escribieron.' },
        { title: 'Foto con los autores', text: 'Un momento para llevarte el recuerdo del día en que el libro se presentó en persona.' },
        { title: 'Encuentro con la comunidad', text: 'Lectores, estudiantes y formadores en un mismo lugar. Las caras detrás de cada clase y cada mensaje.' },
        { title: 'Tu lugar, antes que nadie', text: 'Confirmás antes de que la presentación se abra al público general. Tu entrada y la de tus invitados son sin costo.' },
      ] },
    ] },
    { kicker: 'Prioridad', blocks: [
      { t: 'heading', level: 2, text: 'Los lugares se asignan por orden de prioridad: Formadores, Estudiantes y Lectores.' },
      { t: 'tickets', items: [
        { kicker: 'FORMADOR/A CERTIFICADO/A', title: 'Formadores', text: 'Ya enseñás Geometría Sagrada. Este día también es tuyo.', price: 'Sin costo', items: ['Entrada sin costo', 'Hasta 2 invitados, también sin costo', 'Lugar reservado adelante', 'Foto grupal de Formadores con los autores'], cta: { text: 'Confirmar mi lugar', href: '#confirmar' } },
        { kicker: 'ESTUDIANTE', title: 'Estudiantes', text: 'Estás haciendo el camino con nosotros.', price: 'Sin costo', items: ['Entrada sin costo', 'Hasta 2 invitados, también sin costo'], cta: { text: 'Confirmar mi lugar', href: '#confirmar' } },
        { kicker: 'LECTOR/A', title: 'Lectores', text: 'Ya tenés el libro en tus manos. Ahora conocé a sus autores.', price: 'Sin costo', items: ['Entrada sin costo', '1 invitado, también sin costo'], cta: { text: 'Confirmar mi lugar', href: '#confirmar' } },
      ] },
      { t: 'table', head: ['Horario', ''], rows: [['15.30 hs', 'Presentación del libro con Monique y Pablo.'], ['16.15 hs (aprox.)', 'Foto con los autores y cierre.']], caption: 'Te pedimos llegar 15 minutos antes para empezar puntuales.' },
    ] },
    { kicker: 'Confirmá tu lugar', id: 'confirmar', blocks: [
      { t: 'heading', level: 2, text: 'Completá la encuesta y te confirmamos tu lugar por WhatsApp.' },
      { t: 'text', html: ps('La entrada es sin costo, para vos y tus invitados. Los lugares se asignan por orden de prioridad: primero Formadores, luego Estudiantes y luego Lectores. Completá la encuesta y te confirmamos tu lugar por WhatsApp.') },
      { t: 'embed', title: 'Encuesta de confirmación: Presentación del libro', src: E.presentacionLibro.encuesta, height: 900 },
      { t: 'text', html: `<h3>¿Venís con alguien?</h3>${ps(`En la encuesta podés sumarle su libro y regalárselo ese día: ${E.presentacionLibro.libroInvitado}. Lo retirás en la presentación, sin esperar envío.`)}${ul(['Al enviar la encuesta, recibirás un correo con la confirmación de tu lugar.', 'Te escribimos por WhatsApp para confirmar tu lugar y pasarte la dirección exacta.', 'El sábado 7 de noviembre te esperamos en Belgrano a las 15.15 hs.'])}` },
    ] },
  ],
  faqNote: `¿Tienes otra duda? Escríbenos a ${INFO} con el asunto "Consulta por Presentación del libro"`,
  faq: faqItems([
    ['¿La entrada tiene costo?', 'No. Para lectores, estudiantes, formadores y sus invitados la entrada es sin costo. Solo tenés que confirmar tu lugar en la encuesta.'],
    ['¿Mi invitado tiene que ser parte de la comunidad?', 'No. Puede ser cualquier persona que quieras que conozca la Geometría Sagrada. Solo necesitamos su nombre en la encuesta.'],
    ['¿Habrá libros a la venta ese día?', 'Sí. Podés comprar ejemplares en la presentación, para vos o para regalar.'],
    ['¿Cuánto dura?', 'Unos 45 minutos, de 15.30 a 16.15 hs. Aunque si las preguntas se ponen buenas, Monique y Pablo se entusiasman y puede extenderse un rato más. Venite sin apuro.'],
    ['¿Qué pasa si confirmo y después no puedo ir?', `Avisanos a ${INFO} o respondé el WhatsApp de reconfirmación. Así tu lugar lo puede ocupar otra persona de la comunidad.`],
  ]),
});

const U = E.uruguay;
export const eventoUruguay = page({
  slug: 'retiro-maldonado-uruguay',
  path: '/formaciones/experiencias/retiro-maldonado-uruguay/',
  title: 'Activando tu Campo de Potencial',
  source: 'experiencias.espaciodegeometriasagrada.com/uruguay-0327-321941',
  seo: { title: 'Retiro en Maldonado, Uruguay · Activando tu Campo de Potencial', description: 'Vení a pasar dos noches con Monique, Pablo y equipo. 19 al 21 de marzo, La Federica Eventos, Aiguá, Maldonado.' },
  breadcrumb: [{ label: 'Experiencias', href: '/formaciones/experiencias/' }],
  hero: {
    kicker: '19 al 21 de marzo · Maldonado · Uruguay · Retiro · Seminario',
    lede: 'Una propuesta intensiva en el medio de la naturaleza. Te invitamos a pasar 2 noches y dos días con Pablo, Monique y equipo.',
    trazo: 'semilla',
    image: IMG.uruguay[0],
    facts: [{ label: 'Fechas', value: '19 al 21 de marzo' }, { label: 'Lugar', value: 'La Federica Eventos, Aiguá, Maldonado' }, { label: 'Cupos', value: '30 personas' }, { label: 'Hoy', value: U.hoy }],
  },
  cta: { text: 'Reservar mi lugar', href: U.reserva },
  sections: [
    { kicker: 'Un seminario intensivo', blocks: [
      { t: 'heading', level: 2, text: 'Un seminario intensivo para experimentar el poder de la Geometría Sagrada, en convivencia, con un grupo reducido de personas.' },
      { t: 'text', html: ps('En un fin de semana, vas a nombrar el patrón que te frena y salir con una práctica concreta para romperlo — no solo con una intención.') },
      { t: 'video', provider: 'vimeo', id: '1021827689' },
    ] },
    { kicker: '¿Qué aprenderás en este Seminario?', blocks: [
      { t: 'steps', items: [
        { title: 'Observarte observando', text: 'La manera en que observas el mundo define lo que piensas, haces y los resultados que obtienes. Descubrí cómo ser el observador de tu propia obra de teatro.' },
        { title: 'Equilibrar tu vida', text: 'Hay una fuerza que impulsa cada área de tu vida. Aprendé a identificarla y equilibrarla, generando espacios de pausa, foco y reflexión.' },
        { title: 'Activar tu potencial', text: 'Sos mucho más que un cuerpo físico. Reconocé tus cuerpos de energía y utilizá la información que contienen para activar todo tu potencial.' },
        { title: 'Soltar el estrés y la sobrecarga', text: 'Creá una visión clara y aprendé a alinear tus acciones diarias con el resultado que realmente querés lograr.' },
        { title: 'Conectar con energía ilimitada', text: 'Alcanzá un estado de máximo rendimiento entrenando tu cuerpo y tu energía a un nivel más profundo.' },
        { title: 'Sostener el impulso en el tiempo', text: 'Descubrí cómo seguir empujando los límites de tu crecimiento en cada área de tu vida, mucho después de terminado el retiro.' },
      ] },
      { t: 'gallery', images: IMG.uruguay.slice(1) },
    ] },
    { kicker: 'En experiencias anteriores', blocks: [
      { t: 'heading', level: 2, text: 'En experiencias anteriores de Geometría Sagrada, las y los participantes reportaron:' },
      { t: 'stats', items: [
        { value: '+ Foco', label: 'Una dirección clara de los pasos a seguir en sus desafíos' },
        { value: '+ Confianza', label: 'Aumento en la sensación de conexión con su intuición, incluso meses después del evento' },
        { value: '+ Plenitud', label: 'Una sensación de confianza en relación con el entorno' },
      ] },
    ] },
    { kicker: 'Ponentes', blocks: [
      { t: 'heading', level: 2, text: 'Monique y Pablo' },
      { t: 'text', html: ps('Desde hace más de 12 años, tenemos la misión de compartir y multiplicar este conocimiento ancestral. Hemos acompañado a miles de personas en más de 30 países con nuestras propuestas presenciales y nuestra Formación Online.', 'Monique es arquitecta y fundadora del Espacio de Geometría Sagrada; Pablo es Diseñador Multimedial.', 'Juntos, encabezamos un equipo interdisciplinario de personas que aman lo que hacen y lo ponen al servicio.') },
      { t: 'image', src: IMG.duoSolidos, alt: 'Monique Dumoulin y Pablo Pettinaroli con sólidos platónicos' },
    ] },
    { kicker: 'Cronograma', blocks: [
      { t: 'heading', level: 2, text: 'Cronograma' },
      { t: 'card', title: 'Viernes 19 · Noche de Encuentro', html: ul(['Acceso al predio desde las 17 hs', 'Recepción de estudiantes al complejo', 'Asignación de habitaciones y reconocimiento del lugar', '20.30 hs Cena de bienvenida con Monique, Pablo y equipo', '22.10 hs Ritual de apertura']) },
      { t: 'card', title: 'Sábado 20 · Día 1: Reconocimiento', html: ul(['Desayuno libre', 'Inicio de actividades: 10.30 hs', 'Caminata y meditación al aire libre', 'Reconociendo tus Cuerpos de energía', 'Trazos de Geometría Sagrada', 'Almuerzo en comunidad', 'Descanso o actividad libre', 'Re inicio de actividades: 15.30 hs', 'Reconocer la brecha', 'Merienda libre', 'Herramientas para sostener el cambio', 'Uso aplicado de los Sólidos Platónicos', 'Cierre 19 hs', 'Cena']) },
      { t: 'card', title: 'Domingo 21 · Día 2: Activación', html: ul(['Desayuno libre', 'Inicio de actividades: 10.00 hs', 'De la célula a la tribu', 'Las 5 postas', 'Caminata por el laberinto', 'Almuerzo de celebración', 'Actividad de despedida', 'Ritual de cierre', 'Cierre del evento: 16.30 hs']) },
    ] },
    { kicker: '¿Qué incluye tu entrada?', blocks: [
      { t: 'heading', level: 2, text: '¿Qué incluye tu entrada?' },
      { t: 'steps', items: [
        { title: 'Materiales', text: 'Cuadernillos del retiro y materiales de trabajo para cada actividad' },
        { title: 'Hospedaje', text: '2 noches en habitación compartida, con cama cucheta' },
        { title: 'Pensión completa', text: 'Cena de viernes y sábado, más desayuno, almuerzo y merienda de sábado y domingo' },
      ] },
      { t: 'heading', level: 3, text: 'Y además, estos bonos' },
      { t: 'table', head: ['Bono', 'Detalle', 'Valor'], rows: [
        ['Libro "Geometría Sagrada – Un camino de redescubrimiento"', 'De Pablo y Monique.', 'Valorado en U$D 37, será de regalo'],
        ['Zoom en vivo con Pablo y Monique', 'Unos días antes del retiro, para conocernos e ir llegando conectados.', 'Valorado en U$D 67, será de regalo'],
        ['Taller de preparación', 'Para llegar con bases sólidas al evento.', 'Valorado en U$D 97, será de regalo'],
        ['Clase "Los 4 pilares de la Geometría Sagrada"', '', 'Valorada en U$D 27, será de regalo'],
        ['Clase "Construcción del Cuerpo de Luz"', '', 'Valorado en U$D 47, será de regalo'],
        ['Comunidad exclusiva de WhatsApp', 'Para seguir en contacto con el grupo después del retiro.', 'Valorado en U$D 47, será de regalo'],
      ], caption: '¡Más de U$D 100.- en regalos y el libro entregado personalmente!' },
    ] },
    { kicker: 'Ubicación', blocks: [
      { t: 'heading', level: 2, text: 'La Federica Eventos' },
      { t: 'text', html: ps('★★★★★ 4.9 en Google', 'La Federica, 20500 Aiguá, Departamento de Maldonado, Uruguay', 'La Federica Eventos está en Aiguá, Maldonado. Al confirmar tu inscripción te compartimos indicaciones de acceso y la posibilidad de coordinar traslado compartido con otros participantes.') },
      { t: 'button', text: 'Cómo llegar en Google Maps', href: 'https://maps.app.goo.gl/C96HkzZPPE6AP8n9A' },
      { t: 'map', src: 'https://maps.google.com/maps?q=-34.3547337,-54.7098809+(La+Federica+Eventos)&z=10&output=embed' },
    ] },
    { kicker: 'Antes de reservar, tené en cuenta', blocks: [
      { t: 'list', items: [
        { text: 'Las actividades centrales son los Día 1 y 2: te sugerimos revisar los horarios de acceso al predio del día viernes, e inicio y cierre de las actividades del sábado y domingo, para coordinar tu viaje.' },
        { text: 'Las camas son cuchetas, en habitaciones compartidas de 4 personas. No hay habitaciones individuales.' },
        { text: 'Las camas se asignan por orden de inscripción.' },
        { text: 'El clima no afecta la realización del evento: se hace llueva o truene.' },
        { text: 'No recomendado para personas con dificultades de movilidad: puede haber caminatas y actividades al aire libre si el clima así lo permite.' },
        { text: 'Los cupos son limitados para 30 personas.' },
        { text: 'Al finalizar, recibís un regalo de asistencia (no se entrega certificado).' },
        { text: 'Contarás con un formulario para solicitar tu menú días previos al evento.' },
      ] },
      { t: 'text', html: `<h3>Garantía de compromiso</h3>${ps('Si en las primeras 2 horas del viernes sentís que este espacio no es para vos, avisás al equipo y te ofrecemos pasar tu entrada a la próxima fecha, sin cargo. Vení sin el miedo a "¿y si no me sirve?".')}` },
    ] },
    { kicker: 'Preventa', tone: 'soft', blocks: [
      { t: 'heading', level: 2, text: `Valor de tu entrada hoy: ${U.hoy}` },
      { t: 'text', html: ps(`Valor general: ${U.valorGeneral}`, U.validoHasta) },
      { t: 'table', head: ['Etapa', 'Vigencia', 'Precio', 'Cupos'], rows: U.etapas.map((e: any) => [e.nombre + (e.actual ? ' · PRECIO HOY' : ''), e.hasta, e.precio, e.cupos]), caption: 'Cada etapa de preventa vale hasta la fecha indicada o hasta agotar los lugares de esa etapa — lo que ocurra primero.' },
      { t: 'table', head: ['País', 'Precio en U$D', 'Valor en moneda local', 'Se abona a'], rows: U.paises, caption: U.cotizacion },
      { t: 'button', text: 'Reservar mi lugar', href: U.reserva },
      { t: 'text', html: ps('¿Necesitás financiar tu pago? Podés abonar en 3 pagos, con tarjeta o transferencia (10% recargo).', 'Si pagás en cuotas, el valor de la próxima cuota se actualiza según la cotización del dólar del día.', 'Descuento grupal para 4 o más personas: 5%. Los pagos e inscripciones se gestionan por una única persona.') },
    ] },
    { kicker: 'Testimonios', blocks: [
      { t: 'heading', level: 2, text: 'Mirá lo que vivieron los participantes de la edición anterior.' },
      { t: 'embed', title: 'Testimonios del retiro en YouTube', src: 'https://www.youtube-nocookie.com/embed/videoseries?list=PLIcp2laFUjhc', height: 0 },
      { t: 'button', text: 'Ver testimonios completos en YouTube', href: 'https://www.youtube.com/playlist?list=PLIcp2laFUjhc' },
      { t: 'testimonial', text: 'Llegué sin saber qué esperar y me fui con una decisión que venía postergando hace 2 años: dejar un trabajo que no me representaba.', name: 'María F.', role: 'Buenos Aires, participante edición 2025' },
      { t: 'testimonial', text: 'En un fin de semana entendí un patrón que arrastraba hace 10 años. Los ejercicios de geometría lo hicieron tangible, no solo teórico.', name: 'Sebastián R.', role: 'Montevideo' },
    ] },
    { kicker: 'Es hora de activarlo', tone: 'dark', blocks: [
      { t: 'heading', level: 2, text: 'Tenés el potencial dentro tuyo. Es hora de activarlo.' },
      { t: 'button', text: 'Reservar mi lugar', href: U.reserva },
    ] },
  ],
  faqNote: `¿Tienes otra duda? Escríbenos a ${INFO} con el asunto "Consulta por Activando tu Campo de Potencial"`,
  faq: faqItems([
    ['¿Vale la pena hacer este retiro?', 'Es una inversión de tiempo y dinero, sí. Pero son 3 días diseñados para que salgas con herramientas concretas, en convivencia con un grupo reducido y acompañado en todo momento por Pablo, Monique y el equipo. La transformación ocurre en la práctica, no solo en la teoría.'],
    ['¿Por qué presencial y no online?', 'Porque la convivencia, el contacto directo y la energía grupal generan un tipo de aprendizaje que no se replica en un curso online. Vivir el proceso en comunidad, durante varios días seguidos, es parte esencial de la transformación.'],
    ['¿Cuáles son los medios de pago?', 'Según el país donde vivas, puedes abonar en pesos o en dólares. Mirá la tabla de precios más arriba para ver el detalle según tu país.'],
    ['¿Qué materiales necesito?', 'Debes tener un compás, un lápiz negro, lápices de colores, una boligoma y una regla o escuadra. Todo lo demás que necesitas para aprender será brindado por nosotros.'],
    ['¿Necesito conocimientos previos?', 'No. Solo necesitas tener muchas ganas de aprender y vivir una experiencia única, en un ambiente preparado especialmente para eso.'],
    ['¿Este retiro cuenta con certificado?', 'No entregamos certificado. Al finalizar el retiro, sí recibís un regalo de asistencia.'],
    ['¿Qué pasa si adquiero mi entrada y luego no puedo asistir?', 'Si no podés asistir, escribinos y transferimos tu entrada a la próxima fecha del retiro o la cambiamos por cualquiera de nuestros ebooks o cursos de valor equivalente. No realizamos reembolsos en efectivo, pero tu inversión nunca se pierde.'],
    ['¿Puedo ir solo/a?', 'Sí. La mayoría llega sin conocer a nadie; las actividades están diseñadas para generar comunidad desde el primer momento.'],
    ['¿Hay opciones para alimentación especial (vegetariana, vegana, sin gluten, celíaca)?', 'Sí, unos días antes del evento te enviamos un formulario para indicar tu menú y cualquier restricción alimentaria.'],
    ['¿Cómo llego hasta el predio?', 'La Federica Eventos está en Aiguá, Maldonado. Al confirmar tu inscripción te compartimos indicaciones de acceso y la posibilidad de coordinar traslado compartido con otros participantes.'],
    ['¿Qué pasa si el clima está muy malo?', 'El retiro se realiza igual, llueva o truene: las actividades al aire libre tienen alternativa bajo techo.'],
    ['¿Qué pasa si el evento se cancela o se pospone por parte de la organización?', 'Si por algún motivo debemos cancelar o reprogramar el retiro, te ofrecemos pasar tu entrada a la nueva fecha sin cargo, o cambiarla por un ebook o curso de valor equivalente.'],
    ['¿Hay edad mínima o restricciones de salud para participar?', `Recomendamos el retiro para mayores de 18 años. Si estás embarazada, tenés una condición de salud, una lesión o cualquier limitación física, escribinos antes de inscribirte a ${INFO} para evaluar juntos si el retiro es compatible con tu situación.`],
    ['¿Qué debo llevar? (ropa, calzado, abrigo)', 'Marzo en Maldonado tiene clima variable: te recomendamos ropa cómoda en capas, calzado cerrado para caminatas, algo de abrigo para la noche, y elementos personales de higiene. El formulario de confirmación incluye la lista completa de qué traer.'],
    ['¿Puedo elegir con quién comparto habitación?', 'Si vas con amigos, pareja o familia, indicalo en el formulario de inscripción y hacemos lo posible por ubicarlos juntos en la misma habitación de 4 personas. Las habitaciones son mixtas o separadas por género según disponibilidad al momento de la asignación.'],
    ['¿Puedo pagar en cuotas?', 'Sí, podés abonar en hasta 3 pagos con tarjeta o transferencia, con un recargo del 10%. El valor de cada cuota se actualiza según la cotización del dólar del día del pago.'],
    ['Vivo en un país que no está en la tabla de precios, ¿puedo participar?', `Sí. Si tu país no aparece en la tabla, escribinos a ${INFO} y te confirmamos el valor en dólares y la mejor forma de pago para vos.`],
    ['¿El retiro es exigente físicamente?', 'Hay caminatas al aire libre, una caminata por el laberinto y actividades dinámicas en grupo ("Las 5 postas"), pero no requiere entrenamiento previo. El ritmo se adapta al grupo.'],
    ['Después de pagar, ¿qué pasa?', 'Recibís un email de confirmación con el formulario de inscripción, donde completás tus datos, menú y preferencias de habitación. Unos días antes del retiro te sumamos a la comunidad de WhatsApp y coordinamos el Zoom en vivo con Pablo y Monique.'],
    ['¿Hay señal de wifi o celular en el predio?', 'La señal puede ser limitada en algunas zonas del predio. Te recomendamos avisar a tu entorno que estarás parcialmente desconectado — es parte de la experiencia de estar presente.'],
    ['¿El retiro es solo en español?', 'Sí, todas las actividades se desarrollan en español.'],
    ['¿Se toman fotos o videos durante el retiro?', 'Sí, el equipo registra momentos del retiro para redes y futuras comunicaciones. Si preferís no aparecer, avisanos al llegar y lo respetamos.'],
  ]),
});

export const postulaEspacio = page({
  slug: 'postula-tu-espacio',
  path: '/formaciones/experiencias/postula-tu-espacio/',
  title: '¿Tenes un espacio para cursos y talleres?',
  source: 'experiencias.espaciodegeometriasagrada.com/postula-espacio',
  seo: { title: 'Postulá tu espacio', description: 'Si queres que llevemos nuestras propuestas a tu ciudad, propone tu espacio.' },
  breadcrumb: [{ label: 'Experiencias', href: '/formaciones/experiencias/' }],
  hero: { kicker: 'Experiencias · Postulá tu espacio', lede: 'Contános de él para que lo evalueemos.', trazo: 'hexagono' },
  cta: { text: 'Completar el formulario', href: '#formulario-postulacion' },
  sections: [
    { kicker: 'Propuestas', blocks: [
      { t: 'heading', level: 2, text: 'Espacio de Geometría Sagrada tiene diferentes propuestas posibles para realizar:' },
      { t: 'steps', items: [
        { title: 'Presentación de libro', text: '90 minutos' },
        { title: 'Masterclass', text: 'De 90 a 120 minutos.' },
        { title: 'Workshop de 1 día', text: 'De 10 a 17 + 5 hs extras para preparar salón' },
        { title: 'Seminario de 2 días', text: 'Jornadas de 9 a 19 + día extra para preparar salón' },
      ] },
    ] },
    { kicker: 'Formulario', id: 'formulario-postulacion', blocks: [
      { t: 'heading', level: 2, text: 'Contános de tu espacio.' },
      { t: 'embed', title: 'Formulario: Postula tu lugar', src: E.postulaEspacio.formulario, height: 1100 },
    ] },
  ],
});

export const productores = page({
  slug: 'productores',
  path: '/formaciones/experiencias/productores/',
  title: 'Llevá Experiencias Geométricas a tu ciudad',
  source: 'experiencias.espaciodegeometriasagrada.com/productores',
  seo: { title: 'Productores: llevá Experiencias Geométricas a tu ciudad', description: 'Un seminario presencial de 2 días con Monique y Pablo, para 40 a 90 alumnos, con toda nuestra comunidad empujando la venta.' },
  breadcrumb: [{ label: 'Experiencias', href: '/formaciones/experiencias/' }],
  hero: {
    kicker: 'Para productores, escuelas y espacios',
    lede: 'Un seminario presencial de 2 días con Monique y Pablo, para 40 a 90 alumnos, con toda nuestra comunidad empujando la venta.',
    trazo: 'espiral',
    facts: [{ label: 'Valor de la entrada', value: 'USD 200–250' }, { label: 'Alumnos por edición', value: '40 a 90' }, { label: 'Inscriptos para cubrir costos', value: '~22' }],
  },
  cta: { text: 'Quiero producirlo', href: '#postula' },
  sections: [
    { kicker: 'Qué es', blocks: [
      { t: 'heading', level: 2, text: 'Qué es Experiencias Geométricas' },
      { t: 'text', html: ps('Es el seminario presencial del Espacio de Geometría Sagrada. Durante dos días, Monique y Pablo llevan la geometría sagrada al cuerpo y a la vida cotidiana: experiencias corporales, juegos y desafíos en grupo, clases, meditación con sólidos y el recorrido del Laberinto de Chartres.', 'Está pensado para quienes nos siguen desde hace años y para quienes nos conocen por primera vez. Los alumnos se van con herramientas para aplicar en su vida y con una comunidad para seguir creciendo.', 'Después de 12 años, 6 ediciones y más de 500 personas en nuestras experiencias presenciales, ahora lo llevamos a otras ciudades de la mano de productores locales.') },
      { t: 'image', src: 'local:taller-grupo', alt: 'Grupo de estudiantes en un taller presencial' },
    ] },
    { kicker: 'Los números del seminario', blocks: [
      { t: 'heading', level: 2, text: 'Así se ve el negocio para vos antes de hablar de nada más.' },
      { t: 'stats', items: [
        { value: 'USD 200–250', label: 'valor de la entrada' },
        { value: '40 a 90', label: 'alumnos por edición' },
        { value: '~22', label: 'inscriptos para cubrir costos' },
        { value: '~USD 13.500', label: 'recaudación con 60 alumnos' },
      ] },
      { t: 'calculator' },
      { t: 'text', html: `<p class="text-small">Estimación con una inversión total de producción de USD 4.500 a 5.000 (honorarios, viajes, alojamiento, sala y publicidad). Los valores finales se definen en el acuerdo.</p>` },
    ] },
    { kicker: 'Quién pone qué', blocks: [
      { t: 'heading', level: 2, text: 'Vos conocés tu ciudad. Nosotros traemos el seminario y a nuestra comunidad.' },
      { t: 'card', title: 'Nosotros', html: ul(['El seminario completo, dictado por Monique y Pablo.', 'Comunicación a nuestra comunidad: mails, redes y vivos anunciando tu fecha.', 'Piezas gráficas y videos para que promociones en tu ciudad.', 'Atención de consultas de los interesados.']) },
      { t: 'card', title: 'Vos, como productor', html: ul(['El espacio y la logística del día.', 'Viajes y alojamiento de Monique y Pablo.', 'La venta local y el cobro de las entradas.', 'La publicidad en tu ciudad y tu comunidad.']) },
    ] },
    { kicker: 'Lo que ya pasó', blocks: [
      { t: 'heading', level: 2, text: 'Lo que construimos con nuestras experiencias presenciales.' },
      { t: 'stats', items: [
        { value: '+500', label: 'personas pasaron por nuestras experiencias presenciales' },
        { value: '6', label: 'ediciones con propuestas diferentes' },
        { value: '12', label: 'años enseñando geometría sagrada' },
      ] },
    ] },
    { kicker: 'Cómo funciona', blocks: [
      { t: 'heading', level: 2, text: 'Cuatro pasos desde que te postulás hasta el seminario.' },
      { t: 'steps', items: [
        { title: 'Te postulás', text: 'Completás el formulario de abajo en 5 minutos.' },
        { title: 'Te contactamos', text: 'Si tu ciudad encaja, te escribimos por WhatsApp con las condiciones completas.' },
        { title: 'Firmamos y anunciamos', text: 'Cerramos fecha y lanzamos la venta juntos, con toda nuestra comunidad.' },
        { title: 'Seminario', text: 'Monique y Pablo llegan a tu ciudad y lo vivimos con tus alumnos.' },
      ] },
    ] },
    { kicker: 'Postulá tu ciudad', id: 'postula', blocks: [
      { t: 'heading', level: 2, text: 'Postulá tu ciudad' },
      { t: 'text', html: ps('Completá el formulario y te respondemos por WhatsApp. Las condiciones completas las compartimos en privado con cada productor.') },
      { t: 'embed', title: 'Formulario de postulación para productores', src: E.productores.formulario, height: 1100 },
      { t: 'text', html: `<h3>Tu ciudad puede ser la próxima</h3>${ps('Cada año elegimos pocas ciudades para poder acompañar bien cada edición. Si sentís que Experiencias Geométricas tiene que llegar a tu gente, postulate.')}` },
    ] },
  ],
  faq: faqItems([
    ['¿Quién cobra las entradas?', 'Vos, como productor. Nosotros derivamos a nuestra comunidad a tu link de pago y te avisamos de cada consulta que nos llegue.'],
    ['¿Qué pasa si no se llega al cupo mínimo?', 'Fijamos juntos una fecha de corte unas semanas antes del seminario. Si a esa fecha no se llegó al mínimo acordado, evaluamos reprogramar o reforzar la difusión. Los detalles quedan por escrito en el acuerdo.'],
    ['¿Se puede combinar con otra ciudad?', 'Sí. Si hay otra ciudad cercana interesada, armamos una gira y se comparten los gastos de viaje. Contanos en el formulario si tenés contactos en otra ciudad.'],
    ['¿Qué espacio necesito?', 'Una sala amplia y despejada para trabajar en movimiento, con capacidad para el cupo que acordemos. Si el lugar tiene espacio al aire libre, mejor para el Laberinto. Antes de firmar te pasamos la lista técnica completa.'],
    ['¿Tengo que tener experiencia produciendo eventos?', 'Suma mucho, pero no es excluyente. Lo más importante es que tengas comunidad o alumnos en tu ciudad y ganas de mover la venta local.'],
  ]),
});

/* ------------------------------------------------------------------ */
/* Libro (libro.espaciodegeometriasagrada.com/promo-lanzamiento)       */
/* ------------------------------------------------------------------ */
const MUNDO: [string, string, string][] = [
  ['Brasil', 'América', 'https://www.bookdelivery.com/br-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Canadá', 'América', 'https://www.bookdelivery.com/ca-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Chile', 'América', 'https://www.buscalibre.cl/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Colombia', 'América', 'https://www.buscalibre.com.co/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Costa Rica', 'América', 'https://www.buscalibre.cr/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Ecuador', 'América', 'https://www.buscalibre.ec/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['El Salvador', 'América', 'https://www.buscalibre.com/sv-es/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Estados Unidos', 'América', 'https://www.bookdelivery.com/us-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['México', 'América', 'https://www.buscalibre.com.mx/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Perú', 'América', 'https://www.buscalibre.pe/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['República Dominicana', 'América', 'https://www.buscalibre.com/do-es/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Uruguay', 'América', 'https://www.buscalibre.uy/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Alemania', 'Europa', 'https://www.bookdelivery.com/de-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Austria', 'Europa', 'https://www.bookdelivery.at/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Bélgica', 'Europa', 'https://www.bookdelivery.com/be-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Croacia', 'Europa', 'https://www.bookdelivery.com/hr-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Dinamarca', 'Europa', 'https://www.bookdelivery.com/dk-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['España', 'Europa', 'https://www.buscalibre.es/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Francia', 'Europa', 'https://www.bookdelivery.com/fr-fr/livre-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Grecia', 'Europa', 'https://www.bookdelivery.com/gr-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Inglaterra', 'Europa', 'https://www.bookdelivery.com/gb-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Irlanda', 'Europa', 'https://www.bookdelivery.com/ie-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Italia', 'Europa', 'https://www.bookdelivery.com/it-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Noruega', 'Europa', 'https://www.bookdelivery.com/no-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Países Bajos', 'Europa', 'https://www.bookdelivery.nl/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Portugal', 'Europa', 'https://www.bookdelivery.com/pt-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['República Checa', 'Europa', 'https://www.bookdelivery.com/cz-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Suecia', 'Europa', 'https://www.bookdelivery.com/se-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Emiratos Árabes', 'Asia', 'https://www.bookdelivery.com/ae-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Egipto', 'África', 'https://www.bookdelivery.com/eg-en/book-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Sudáfrica', 'África', 'https://www.bookdelivery.co.za/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Nueva Zelanda', 'Oceanía', 'https://www.bookdelivery.co.nz/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
  ['Otros Países', 'Otros', 'https://www.buscalibre.com/int-es/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b'],
];
export const libro = page({
  slug: 'libro',
  path: '/libro/',
  title: 'Geometría Sagrada. Un camino de re-descubrimiento personal',
  source: 'libro.espaciodegeometriasagrada.com/promo-lanzamiento',
  seo: { title: 'El libro: Geometría Sagrada, un camino de re-descubrimiento personal', description: '12 años de enseñanza condensados en 228 páginas. Un libro sobre Geometría Sagrada escrito para todo el mundo. Disponible en Argentina y en todo el mundo.' },
  hero: {
    kicker: 'El libro · Monique Dumoulin con la colaboración de Pablo Pettinaroli',
    lede: '12 años escribiendo una historia. Hoy, toma una nueva forma.',
    trazo: 'semilla',
    image: IMG.libroPortada,
    facts: [{ label: 'Páginas', value: '228' }, { label: 'Disponible', value: 'En todo el mundo' }, { label: 'Debut', value: 'Puesto #1 en España' }],
  },
  cta: { text: 'Adquirir tu ejemplar', href: '#comprar' },
  sections: [
    { kicker: '12 años de enseñanza', blocks: [
      { t: 'heading', level: 2, text: '12 años de enseñanza condensados en 228 páginas.' },
      { t: 'text', html: ps('Un libro sobre Geometría Sagrada escrito para todo el mundo: no necesitás conocimientos previos, ni saber dibujar. Solo disposición a redescubrirte. Incluye los 4 pilares del EGS — Trazos, Construcciones 3D, Armonización de Espacios y Medicina de las Formas. Con ejercicios, láminas y acceso a micrositio con material complementario.') },
      { t: 'image', src: IMG.libroAurora, alt: 'Libro Geometría Sagrada, un camino de redescubrimiento personal' },
    ] },
    { kicker: 'Debut histórico', blocks: [
      { t: 'heading', level: 2, text: 'Debut histórico: entre los 10 más vendidos en la editorial. Puesto #1 en España. Gracias a tod@s!' },
    ] },
    { kicker: 'Libros disponibles en todo el mundo!', id: 'comprar', blocks: [
      { t: 'heading', level: 2, text: 'Hace click en el boton para adquirir tu ejemplar.' },
      {
        t: 'bookbuy',
        ar: { title: 'El Libro', pack: P.libro.argentina.pack, price: P.libro.argentina.precio, href: P.libro.argentina.href, note: 'Envío por Andreani a cargo del comprador', disclaimer: 'Por razones de ética comercial y convivencia con los distintos canales de distribución del libro, no contamos ni contaremos con puntos de retiro. Puedes adquirir el libro con las opciones arriba indicadas, o en las librerías abajo mencionadas. Gracias por comprender.' },
        stores: {
          intro: 'Queremos que puedas elegir la opción que mejor se adapte a vos. Si comprás el libro directamente en Espacio de Geometría Sagrada, además de apoyar nuestro trabajo y permitirnos seguir creando contenido gratuito para miles de personas, recibirás beneficios exclusivos que no están disponibles en librerías ni en otras plataformas: Regalos y materiales exclusivos. Beneficios y promociones especiales de nuestra comunidad. Si preferís adquirirlo por otros medios, también podés encontrarlo en:',
          items: [
            { name: 'Buscalibre', text: '(generalmente ofrece precios muy competitivos y envíos a todo el país).', href: 'https://www.buscalibre.com.ar/libro-geometria-sagrada/9789878380483/p/67594643?afiliado=de917514529683c42f4b', cta: 'Ver aquí' },
            { name: 'Yenny / El Ateneo', text: '(disponible en sus sucursales y tienda online).', href: 'https://www.yenny-elateneo.com/sucursales/?srsltid=AfmBOooW4cGvFRWEwOVKTHjh-C-mw4oQBn0uu2974xaIyjacQ7IeARMe', cta: 'Ver aquí' },
            { name: 'Cúspide', text: '(disponible en sus sucursales y tienda online).', href: 'https://cuspide.com/locales/', cta: 'Ver aquí' },
            { name: 'SBS Librerías', text: '(disponible en sucursales y tienda online).', href: 'https://www.sbs.com.ar/buscador-de-librerias', cta: 'Ver aquí' },
          ],
          notes: ['Importante: Te sugerimos consultar con la sucursal stock disponible.', 'Importante: Las compras realizadas en plataformas o comercios de terceros son completamente independientes de Espacio de Geometría Sagrada. Por ese motivo, no incluyen dedicatorias, firmas, regalos, promociones ni beneficios exclusivos ofrecidos en nuestra tienda, y cualquier consulta relacionada con el envío, stock, cambios, devoluciones o garantía deberá gestionarse directamente con el comercio donde se realizó la compra.', '¡Gracias por elegir la opción que mejor te acompañe!'],
        },
        world: {
          intro: 'Hace click en la bandera de tu país, te dejamos el link para que puedas adquirir el libro. Hemos acordado con Buscalibre para que puedas hacer tu compra y el envío llegue más rápido. A medida que sumemos más opciones, las incluiremos en este listado.',
          countries: MUNDO.map(([name, region, href]) => ({ name, region, href })),
          note: 'IMPORTANTE: Los libros no están firmados ni incluyen regalos adicionales.',
        },
      },
    ] },
    { kicker: 'Seguí leyendo', blocks: [
      { t: 'heading', level: 2, text: 'El libro, también en los News Geométricos.' },
      { t: 'card', title: 'El libro que tardó casi 12 años', html: ps('El News Geométrico donde contamos la historia del libro.'), href: '/news-geometrico/el-libro-que-tardo-casi-12-anos/' },
      { t: 'card', title: 'Presentación del libro en Buenos Aires', html: ps('Sábado 7 de noviembre · 15.30 hs · Belgrano. Entrada sin costo para la comunidad.'), href: '/formaciones/experiencias/presentacion-del-libro/' },
      { t: 'card', title: 'Formaciones', html: ps('El libro reúne los 4 pilares que enseñamos en nuestras formaciones.'), href: '/formaciones/' },
    ] },
  ],
});

/* ------------------------------------------------------------------ */
/* eBooks (página de WordPress /ebook-7-trazos-de-geometria-sagrada/ + producto 34989) */
/* ------------------------------------------------------------------ */
const EB = P.ebooks.pack;
const packCta = { text: 'Adquiere tus eBooks + tus regalos', href: EB.href };
const ebookFaq = [
  { title: '¿Cuándo y cómo recibiré mi eBook?', html: ps('Una vez realizada tu compra, recibirás en tu email el eBook para descargar a tu pc y leerlo.') },
  { title: '¿Qué necesito para ver el eBook?', html: ps('Sólo necesitas de una Pc, y conexión a Internet para descargar el mismo a tu maquina. El eBook se entregará en formato pdf.') },
  { title: '¿Cómo accedo a los regalos?', html: ps('Junto con la compra de tu eBook te enviaremos un correo con los enlaces de acceso a los regalos prometidos.') },
  { title: '¿Cómo realizo mi compra?', html: ps('Podrás abonar con tarjeta de crédito o en efectivo según el país donde vivas. Una vez que realices tu pago, el sistema nos avisará y te enviaremos un email de confirmación.', `Si tienés más dudas, escríbenos a ${mailLink}`) },
];
const packBlock = (lead: string) => ({ kicker: 'El pack', tone: 'soft', blocks: [
  { t: 'heading', level: 2, text: lead },
  { t: 'text', html: ps(`Si súmaramos el eBook junto a todos los bonos abonarías ${EB.antes}`, `Podrás acceder al mismo a sólo <strong>${EB.precio} (${EB.precioArs})</strong>`) },
  { t: 'button', text: packCta.text, href: packCta.href },
] });
export const ebooks = [
  page({
    slug: '7-trazos-de-geometria-sagrada',
    path: '/ebooks/7-trazos-de-geometria-sagrada/',
    title: 'eBook 7 Trazos de Geometría Sagrada',
    source: 'WordPress /ebook-7-trazos-de-geometria-sagrada/ y producto WooCommerce 34989',
    seo: { title: 'eBook 7 Trazos de Geometría Sagrada', description: 'Aprende a Crear tus primeros Mandalas usando la Geometría Sagrada, con una guía paso a paso, aunque no tengas experiencia previa ni sepas dibujar.' },
    breadcrumb: [{ label: 'eBooks', href: '/ebooks/' }],
    hero: {
      kicker: 'eBook · Monique Dumoulin',
      lede: 'Aprende a Crear tus primeros Mandalas usando la Geometría Sagrada, con una guía paso a paso, aunque no tengas experiencia previa ni sepas dibujar.',
      trazo: 'semilla', image: IMG.ebook7,
      facts: [{ label: 'Formato', value: 'pdf' }, { label: 'Páginas', value: '45' }, { label: 'Pack', value: `${EB.precio} (${EB.precioArs})` }],
    },
    cta: packCta,
    sections: [
      { kicker: 'Con este ebook, aprenderás a:', blocks: [
        { t: 'steps', items: [
          { title: 'Equilibrio y armonía', text: 'Realizar trazos que te permitirán lograr equilibrio y armonía en tu vida y tus relaciones.' },
          { title: 'De la segunda a la tercera dimensión', text: 'Pasar tus trazos de segunda a tercera dimensión, para trabajar tus emociones a través de la glándula pineal.' },
          { title: 'Leer tu trazo', text: 'Leer tu trazo con un simple método que te permitira re-ordenar las áreas de tu vida que precises.' },
        ] },
      ] },
      { kicker: 'La autora', blocks: [
        { t: 'testimonial', text: 'Este, que es mi primer eBook, lo escribí incentivada por aquellos que, encuentro tras encuentro siempre esperan el momento del trazo, me envían sus mandalas y trazos que a veces comparten con otros, como ser sus estudiantes a cargo en los colegios. Por ese compartir y multiplicar, doy infinitas gracias!!! La idea central es compartir contigo diversas figuras que al trazarlas pueden aportar valiosa información a cada una de las aéreas de tu vida, como por ejemplo el trabajo, la pareja, la familia, amistades y tu intimidad personal. Quizás hayas adquirido un libro de mandalas para colorear, pero un trazo realizado por ti tiene información personal que no tiene un madala impreso, y te puede hacer llegar información útil para redescubrir situaciones que aun están ocultas a simple vista y que podrás ver con mayor claridad aprendiendo a leerlos, como te enseño en este libro', name: 'Monique Dumoulin', role: 'Fundadora del Espacio de Geometría Sagrada' },
        { t: 'heading', level: 2, text: 'Sobre la Autora' },
        { t: 'text', html: ps('Nació un 18 de Julio de 1953 en Bs. As., Argentina. Estudio Arquitectura en la UBA y se recibio en 1979. En 2001, ingresa en el mundo de la Geometría Sagrada.', 'En cierto momento su Maestra, le sugiere metabolizar lo aprendido, es así que encontro que la forma más acertada para hacerlo era trasmitir sus conocimientos y disfrutar así de lo que ama hacer, compartir con el fin de multiplicar.', '<em>"Practicando lo aprendido se construye y alimenta la Maestría interna; por lo cual voy creando talleres donde se combina la teoría, la práctica y lo vivencial. Mi agradecimiento a los Maestros que me capacitaron. A la vida por darme opciones y enseñarme a elegir caminos."</em>') },
      ] },
      { kicker: 'Temario', blocks: [
        { t: 'heading', level: 2, text: '¿Cuál es el temario del eBook "7 Trazos de Geometría Sagrada"?' },
        { t: 'text', html: ul(['Los materiales que necesitas', 'Qué es estereografiar y como puedes hacerlo,', '¿Cómo leer un trazo?', 'Ejercicio de reconocimiento,', 'El origen, el vació y la vuelta a la esencia,', 'Los números y los trazos,', 'Primer Trazo, el Tubo Toro;', 'Segundo Trazo, el triángulo;', 'Tercer Trazo, el pentágono;', 'Cuarto Trazo, el hexágono;', 'Quinto Trazo, el octógono;', 'Sexto Trazo, el ying-yang;', 'Séptimo Trazo, el laberinto cretense;', '¿Qué dicen los colores de un trazo?', 'Un viaje de re-descubrimiento']) + ps('Este fabuloso eBook contiene 45 hojas a todo color con excelente definición explicado paso-a-paso como realizar cada uno de los 7 trazos propuestos!', 'Formato: pdf. Cant. Paginas: 45. Autora: Monique Dumoulin. Edición: Pablo Pettinaroli y Sebastián Storni. Diseño de tapa e interior: Nadia Presberg. Editorial: Shared &amp; Multiply LLC. Idea Orginal y Copyright: Espacio de Geometría Sagrada. Este producto es descargable.') },
        { t: 'image', src: IMG.ebookTemario, alt: 'Páginas interiores del eBook 7 Trazos de Geometría Sagrada' },
      ] },
      { kicker: 'Regalos', blocks: [
        { t: 'heading', level: 2, text: 'Además, con la compra de tu eBook, tendrás estos regalos adicionales!' },
        { t: 'card', title: 'REGALO #1: el eBook "Los Secretos de los Sólidos Platónicos"', html: ps('(Valorado en U$D 47, gratis para ti) Este eBook explica paso-a-paso como realizar los Sólidos Platónicos en 3era dimensión. PRODUCTO DESCARGABLE'), img: IMG.ebookSolidos, href: '/ebooks/los-secretos-de-los-solidos-platonicos/' },
        { t: 'card', title: 'REGALO #2: el eBook "Trazos de Círculos de Cosecha"', html: ps('(Valorado en U$D 47, gratis para ti) Este eBook te enseña como observar los círculos de cosecha y convertirlos en mandalas con una guía paso a paso.! PRODUCTO DESCARGABLE'), img: IMG.ebookCirculos, href: '/ebooks/trazos-de-circulos-de-cosecha/' },
        { t: 'card', title: 'REGALO #3: el Set de 6 Audios: "Meditando con los Sólidos Platónicos"', html: ps('(Valorado en U$D 27, gratis para ti)') + ul(['Este set tiene como fin darte herramientas para ayudarte a Re-conocer ciertos aspectos que a veces quedan ocultos y así poder ocuparte de ellos.', 'Aprenderás que trabajando con cada una de las formas, estarás reordenando tu estructura Geométrica, para retornar al equilibrio que necesitas.', 'Te permitirá mayor conciencia de ti, de los aspectos a trabajar y lograras mayor armonía.', 'Aprenderás a recreár virtualmente los Sólidos Platónicos a tu alrededor y recibir toda la información que estas estructuras contienen.', 'Los audios están listos para descargar a tu computadora, celular o tablet y llevarlos contigo, para escuchar cuantas veces desees.', 'Además, tendrás una guia online para facilitar el proceso de meditación!']), img: IMG.ebookAudios },
        { t: 'card', title: 'REGALO #4: MasterClass "Geometría Sagrada aplicada"', html: ps('(Valorado en U$D 67, gratis para ti)', 'En esta MasterClass, aprenderás:') + ul(['A comprender y reconocer tus cuerpos de energía desde la activación de la Glándula Pineal,', 'Realizaremos un trazo que permitirá enfocarte en tus objetivos mas cercanos,', 'Leer tu trazo a través de un simple método que te permitirá re-ordenar las áreas de tu vida que precises equilibrar,']), img: IMG.ebookMasterclass },
      ] },
      packBlock('Los 3 eBooks, los audios y la MasterClass, juntos.'),
    ],
    faq: ebookFaq,
  }),
  page({
    slug: 'los-secretos-de-los-solidos-platonicos',
    path: '/ebooks/los-secretos-de-los-solidos-platonicos/',
    title: 'eBook Los Secretos de los Sólidos Platónicos',
    source: 'WordPress /ebook-7-trazos-de-geometria-sagrada/ (REGALO #1) y producto WooCommerce 34989',
    seo: { title: 'eBook Los Secretos de los Sólidos Platónicos', description: 'Este eBook explica paso-a-paso como realizar los Sólidos Platónicos en 3era dimensión. Incluido en el pack de eBooks del Espacio de Geometría Sagrada.' },
    breadcrumb: [{ label: 'eBooks', href: '/ebooks/' }],
    hero: {
      kicker: 'eBook · Incluido en el pack',
      lede: 'Platón decía que la Geometría nos obliga a contemplar la esencia. Es una ciencia del conocimiento del Ser, no de lo que está sujeto al cambio o desaparición.',
      trazo: 'hexagono', image: IMG.ebookSolidos,
      facts: [{ label: 'Páginas', value: 'Más de 70' }, { label: 'Valor', value: 'U$D 47' }, { label: 'Se obtiene con', value: 'eBook 7 Trazos' }],
    },
    cta: packCta,
    sections: [
      { kicker: 'Qué incluye', blocks: [
        { t: 'heading', level: 2, text: 'Los Sólidos Platónicos en 3era dimensión, paso a paso.' },
        { t: 'text', html: ps('Platón decía que <strong>la Geometría nos obliga a contemplar la esencia</strong>. Es una ciencia del conocimiento del Ser, no de lo que está sujeto al cambio o desaparición. Conducirá al alma hacia la verdad y dispondrá la mente del filósofo para que eleve su mirada.', 'Hay siete formas principales dentro de la Geometría Sagrada: los cinco Sólidos Platónicos, el Círculo y la Espiral.', 'En este eBook, <strong>aprenderás todos los secretos que esconden los Sólidos Platónicos</strong>, su relación con los chakras y los 5 elementos, <strong>a trazarlos partiendo de la Flor de la Vida</strong>, y como meditar con ellos, y redescubrirlos dentro de tus campos de energía, <strong>para equilibrar la información que contienen.</strong>', 'Este fabuloso eBook contiene más de 70 hojas a todo color con excelente definición explicado paso-a-paso como realizar cada uno de los trazos propuestos!', 'Este eBook explica paso-a-paso como realizar los Sólidos Platónicos en 3era dimensión. PRODUCTO DESCARGABLE', 'Viene de regalo con el eBook "7 Trazos de Geometría Sagrada" (Valorado en U$D 47, gratis para ti).') },
        { t: 'image', src: 'local:octaedros', alt: 'Octaedros construidos en un taller' },
      ] },
      packBlock('Se obtiene junto al eBook 7 Trazos de Geometría Sagrada.'),
    ],
    faq: ebookFaq,
  }),
  page({
    slug: 'trazos-de-circulos-de-cosecha',
    path: '/ebooks/trazos-de-circulos-de-cosecha/',
    title: 'eBook Trazos de Círculos de Cosecha',
    source: 'WordPress /ebook-7-trazos-de-geometria-sagrada/ (REGALO #2) y producto WooCommerce 34989',
    seo: { title: 'eBook Trazos de Círculos de Cosecha', description: 'Este eBook te enseña como observar los círculos de cosecha y convertirlos en mandalas con una guía paso a paso. Incluido en el pack de eBooks.' },
    breadcrumb: [{ label: 'eBooks', href: '/ebooks/' }],
    hero: {
      kicker: 'eBook · Incluido en el pack',
      lede: 'En este e-Book Monique Dumoulin vuelca sus conocimientos fruto de la investigación y su experiencia personal de conectar con símbolos y códigos sagrados.',
      trazo: 'espiral', image: IMG.ebookCirculos,
      facts: [{ label: 'Valor', value: 'U$D 47' }, { label: 'Formato', value: 'Producto descargable' }, { label: 'Se obtiene con', value: 'eBook 7 Trazos' }],
    },
    cta: packCta,
    sections: [
      { kicker: 'Qué incluye', blocks: [
        { t: 'heading', level: 2, text: 'De los círculos de cosecha a tus mandalas.' },
        { t: 'text', html: ps('En este e-Book <strong>Monique Dumoulin vuelca sus conocimientos fruto de la investigación y su experiencia personal de conectar con símbolos y códigos sagrados</strong>, y te invita a despertar las memorias que te conectan con un linaje, aquel que te une a las estrellas.', 'Con este ebook, <strong>aprenderas a trazar e interpretar los Círculos de Cosecha desde la información que contiene la Geometría Sagrada</strong>, y te contaremos cuál es el origen, y las principales características de los auténticos Círculos de las Cosechas,', 'Un eBook diseñado para que sigas practicando tus trazos, <strong>y experimentando como la Geometría Sagrada habita en todo lo que te rodea!</strong>', 'Este eBook te enseña como observar los círculos de cosecha y convertirlos en mandalas con una guía paso a paso.! PRODUCTO DESCARGABLE', 'Viene de regalo con el eBook "7 Trazos de Geometría Sagrada" (Valorado en U$D 47, gratis para ti).') },
        { t: 'image', src: 'local:trazo-toro', alt: 'Trazo a lápiz de un tubo toro' },
      ] },
      packBlock('Se obtiene junto al eBook 7 Trazos de Geometría Sagrada.'),
    ],
    faq: ebookFaq,
  }),
];

export const externas = [armonizacion, terapias, admision, club, experiencias, eventoBsAs, eventoPresentacion, eventoUruguay, postulaEspacio, productores, libro, ...ebooks];
