# Contexto: rediseño + academia — Espacio de Geometría Sagrada

## ⚠️ ESTADO AL 23/10/2026 — LEER PRIMERO
- Último deploy: commit ffb5002 (20/10). En Vercel: https://webespacio.vercel.app
- Hay cambios del 21/10 HECHOS EN LOCAL, SIN REVISAR EN EL NAVEGADOR Y SIN SUBIR (ver lista abajo). `npx tsc` pasa sin errores.
- Próximo paso: Pablo abre `INICIAR-SITIO.bat` → revisar cada cambio en http://localhost:5173 (compu y celular) → corregir lo que haga falta → Pablo corre `npm run build` y sube (git add . / commit / push) desde PowerShell. El build NO corre desde la VM de Claude (falta @rollup/rollup-linux-x64-gnu); git commit tampoco (la VM no puede borrar los .lock).
- Cambios del 23/10 (en local, sin subir; `npx tsc` pasa):
  12. Qué hacemos · 4 pilares: título "Te proponemos descubrir…" a todo el ancho; ícono de Trazos ahora es un compás.
  13. Formación profesional: lista de "La Formación" propia (LISTA_FORMACION; negrita solo en 11 cursos y 24 meses; agregadas clases de acompañamiento 2.º y 4.º sábado); foto del alto del texto (PENDIENTE: Pablo pasa la foto); "Con tu certificado podrás" va antes del Dossier; Dossier en fondo azul; Testimonios antes de Cifras. Secciones compartidas exportadas: SecTestimonios, SecExperiencia, SecFormadores, SecDudas, FlorFondo, h2, CONTACTO.
  14. Especialización en Terapias: página propia src/pages/EspecializacionTerapias.tsx con el modelo de Formación profesional (texto de los docs internos del programa). Clave: "aplicar protocolos de Geometría Sagrada en tus terapias"; para todos los públicos; 7 módulos + curso final + mentoría para vender tu servicio; clases 2.º y 4.º sábado; SIN precios, bonos, cupos ni garantía. PENDIENTES: video de presentación y foto propia.
- Cambios del 21/10 a revisar:
  1. Home · Hero: "Geometría Sagrada" en Playfair Display 400 (clase .hero-playfair, cargada en index.html; ÚNICA excepción a Montserrat), alineado a la izquierda, centrado en vertical con la flor de la vida, que queda a la derecha sin pisarse (texto con lg:max-w-[44vw]). Revisar que la "g" de Sagrada no se corte con la máscara de la animación.
  2. Home · Propuestas: título y texto de cada caja a la izquierda, botón centrado con fondo azul #094372.
  3. Home · Pilares: invertido → kicker "Independientes y complementarios", título "Los 4 pilares".
  4. Home · Sólidos: agregado texto "C · V · A: caras, vértices y aristas…" (content.ts → solidosIntro.cva).
  5. Home · Manifiesto: "Lo que se comparte, se multiplica. Desde 2014 nos propusimos democratizar este *conocimiento ancestral.*" (sin cantidades).
  6. En números (Cifras): cada cifra centrada en su columna (el 12 estaba corrido).
  7. Cierre · videos de YouTube: play chico y discreto, sin velado gris.
  8. Equipo (home y Qué hacemos): título "Monique y Pablo" sin punto; texto "Encabezan un equipo interdisciplinario de personas con pasión por lo que hacen."; debajo de cada foto SOLO el nombre. Sin la línea de Mercè Lobo (Pablo NO la quiere).
  9. Títulos sin punto final en todo el sitio.
  10. Quiénes somos: título "Formadores certificados" 5 px más chico (no tiene que cortar palabras).
  11. Pie: "compartir y multiplicar" más chico y en una sola línea.
  12. Qué hacemos · arriba: primero "En el Espacio enseñamos Geometría Sagrada para que la apliques en tu vida: trazamos, construimos los sólidos, armonizamos espacios y usamos las formas como medicina." y después "La Geometría Sagrada es el lenguaje del universo… la medida es profana… la Proporción es Sagrada." Los párrafos largos de la galaxia quedan COMO ESTÁN.
  13. Qué hacemos · torbellino de la galaxia: viewBox agrandado para que no se corte al girar.
- Esperando fotos/logo de Pablo: Formaciones y eBook (cajas de propuestas), Armonización (Moni con varillas) y Medicina de las formas (Moni con péndulo), foto de Pablo y de Monique de frente, foto de "Conocé al equipo", logo SG para reemplazar la semilla de la vida en Qué hacemos.
- Para después (no tocar por ahora): revisar Formación profesional y Formadores certificados, artículos del blog importados, revisión en celular.
- Pendientes de Formación profesional: el ppt del Dossier (hoy hay una diapositiva de referencia) y el código de la encuesta de precalificación (hoy hay un recuadro). Datos que no coinciden y Pablo tiene que definir: 24 meses (web) vs 9 meses (admisión).
_Actualizado: 20/10/2026_

## Quién y cómo trabajar
- Usuario: Pablo (pablopettinaroli@gmail.com). No es programador: explicarle en español rioplatense, simple, con comandos listos para pegar en PowerShell (Windows).
- Hacer SOLO lo que pide, en la sección que nombra. Si un cambio puede afectar otras partes del sitio, PREGUNTAR antes.
- Nunca mostrar ni pedir la service_role key.
- Separación: WEB = todo lo que vende, muestra y publicita. PLATAFORMA = /ingresar/, /academia/ y todo lo que pasa adentro.
- Los cambios se hacen y se prueban en localhost. NO se sube nada (git push) hasta que Pablo diga "subí".
- Si pide "lo mismo" o "igual a X", copiar exactamente esa estructura, sin reinventar.
- Cuando pide ver archivos o bloques, MOSTRARLOS (abrirlos en el navegador o mandarlos), no solo listarlos.
- Antes de usar cualquier documento del proyecto de claude.ai, preguntarle.
- Si se enoja o insulta: trabajar mejor, sin frenarlo ni discutir.

## Proyecto
- Carpeta: C:\Users\Pablo\Downloads\Telegram Desktop\egs-rediseno\egs-rediseno\
  - app\ → el sitio (repo GitHub: github.com/espaciogeo/webespacio, rama main)
  - supabase\ → 01_base_de_datos.sql (esquema) y 02_academia_importacion.sql (cursos del XML; NO va a GitHub)
  - _contenido, _assets, _capturas, _export → material de trabajo (no se suben)
- Stack: React 19 + Vite 6 + Tailwind 3 + framer-motion + three.js, multipágina prerenderizado (scripts/prerender.mjs REGENERA vercel.json en cada build: las rutas nuevas se agregan ahí, no en vercel.json).
- Correr local: doble clic en egs-rediseno\INICIAR-SITIO.bat (npm run dev --port 5173 --host). Ver en http://localhost:5173.
- Publicar: en app\ → git add . ; git commit -m "..." ; git push → Vercel publica solo en https://webespacio.vercel.app
- CLAUDE.md tiene las reglas de diseño y el mapa de archivos.
- .env.local (no se sube): VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (las mismas están cargadas en Vercel).

## Diseño (decidido, no cambiar sin pedir)
- Fondo blanco puro #FFFFFF en todo el sitio, sin grises, texturas ni grano.
- Colores: azul #094372, verde agua #66CC99, gris #666666 (src/styles/tokens.css).
- Tipografías: Montserrat solo 400 o 600 para títulos (font-bold = 600 en tailwind.config), Roboto texto, Roboto Mono etiquetas. Excepción: "Geometría Sagrada" del hero de la home en Playfair Display 400 (solo ahí).
- Entramado de flor de la vida (.flor-bg) SOLO en la sección Manifiesto de la home. (Formación profesional tiene una flor de la vida propia en trazo blanco de fondo en su primera sección azul, pedida por Pablo.)
- Títulos SIN punto final.
- Ilustraciones como trazos geométricos SVG en línea.
- Sólidos en orden: tetraedro, hexaedro, octaedro, icosaedro, dodecaedro. Título: "5 Mentes, 5 Consciencias".
- Montserrat SIN negrita en nombres y títulos salvo que lo pida (máximo 600). Nada de líneas divisorias visibles (<hr> con borde). Sin emojis en tablas.
- Precios tachados: azul #094372 y negrita. No agregar puntos/formatos a números que Pablo pasa (CI, montos).
- NADA de numeraciones tipo 01, 02, 03 en kickers, tarjetas, FAQ ni sólidos (se sacaron de todo el sitio; quedan solo los #NN de los News Geométricos y los pasos ordenados).
- Secciones azules: clase .sec-azul (fondo #094372, letras blancas; redefine los tokens de color adentro). Usada en "En números", Cierre (YouTube) y el texto de Quiénes somos.

## Home (src/pages/Home.tsx) — orden actual
1. Hero — "Geometría Sagrada" (Playfair) a la izquierda, flor de la vida a la derecha; "desliza" abajo a la derecha.
2. Propuestas — "Propuestas pensadas para todos los niveles". Clase gratuita en una caja ancha; debajo 4 cajas: El libro, eBooks + MasterClass, Experiencias presenciales, Formaciones (textos de Experiencias y Formaciones redactados por Claude, a validar). Botón de cada caja centrado y azul.
3. Pilares ("Los 4 pilares", kicker "Independientes y complementarios") · 4. Sólidos ("5 Mentes, 5 Consciencias" + C·V·A) · 5. Manifiesto (con flor de la vida).
6. En números (fondo azul, componente Cifras, también usado en Formación profesional): +10.000 estudiantes · +12 años · +100.000 seguidores, centradas; foto del workshop + línea de tiempo 2014/2019/2024/2026.
7. Testimonios · 8. Cierre (fondo azul): "Un sábado al mes, trazamos juntos" + "Clases gratuitas en YouTube".
9. Equipo (componente Equipo, igual en Qué hacemos): texto a la izquierda; fotos de Monique y Pablo a la derecha con solo el nombre. · 10. Blog "Para leer despacio" (4 últimos).
11. Preguntas frecuentes (título 6 pts más chico que el original).
- Scroll fluido: Hero 170svh, Manifiesto 150svh, Sólidos 260svh, slider de Pilares 1.8x, Lenis lerp 0.16.

## Página "Formación profesional" (src/pages/FormacionProfesional.tsx, página propia; ruta en App.tsx)
Orden definido por Pablo: Hero (texto izq + video der, "Inscripciones abiertas") → "Te presentamos la primera Formación…" + "Facilitada por Geómetras" (azul, flor de la vida girando de fondo) → La Formación (foto taller-alumnas) + botón entrevista → Dossier (lugar del ppt) + botón entrevista → "Con tu certificado podrás": 6 cajas con foto, 3 y 3 → Cifras (módulo de la home) → Testimonios reales (azul; 6 citas de admisión con bandera + 6 videos cortos de formacion.espaciodegeometriasagrada.com, 4 por fila en damero; cierre texto izq + botón der) → "¿Querés anotarte?…" (semi negrita) + recuadro de la encuesta → "La experiencia, nuestro mayor orgullo" (texto + 4 bloques de la misión con sólidos girando, en escalera que SUBE para no estirar el bloque) → Nuestro equipo de formadores (formadores-equipo.webp) → ¿Dudas o consultas? (abajo de todo, formulario de contacto de WordPress con nombre, email y mensaje: form d050aec / post 32072).
- Botones de entrevista → /formaciones/admision/#agenda. Se sacaron las preguntas frecuentes de esta página.
- Componente Video (Bits.tsx): sin velado gris; props `vertical` (recorta barras negras de videos cortos) y `chico` (botón "Ver testimonio").

## Pie de página (todo el sitio, src/components/Footer.tsx + content.ts → footer)
- "compartir y multiplicar" chico y en una sola línea (no sacarlo).
- "© 2014 – 2026 Espacio de Geometría Sagrada es una marca registrada por Monique Dumoulin" / debajo "Diseño y desarrollo: Share & Multiply Producciones" (sin link por ahora).

## Página "Quiénes somos" (src/pages/QuienesSomos.tsx, página propia; sin título visible ni símbolo)
1. Foto grande del equipo (media 2024-01-grupales-egs; ideal reemplazar por una de más resolución).
2. Texto en fondo azul, en zigzag (izq/der) con sólidos platónicos girando en los huecos (componente SolidoGira), cierre centrado "Juntos, encabezan…". Datos: +10000 personas, +125000 Facebook, +75000 Instagram.
3. Fotos de Monique (monique-taller) y Pablo (pablo-icosaedro) a la misma altura, más chicas y centradas (max 760px), con "Ver más" a /quienes-somos/monique-dumolin/ y /quienes-somos/pablo-pettinaroli/.
4. Nuestro equipo: 8 personas en 1 fila (Nadia, Serena, Maite, Maru, Ceci, Pato, Lucas, Graciela; SIN Pablo Spoto ni Küntur/Patricia Iacovone). Fotos cargadas desde el CDN de FunnelUp (assets.cdn.filesafe.space); entran en cascada y pasan a color al pasar el mouse.
5. "Formadoras y Formadores del equipo": foto collage public/img/formadores-equipo.webp.
6. Formadores certificados (datos en src/content/formadores.ts, 119 personas, 15 países): arranca en blanco, solo banderas; al hacer clic en un país se despliega la lista. Título 4 pts más chico.
7. Propuestas (igual a la home) · 8. Cierre con YouTube (igual a la home).

## Página "Qué hacemos" (src/pages/QueHacemos.tsx, página propia)
- Mismo orden que la original: ¿Qué es la GS? → Geo + Metría + Sagrada (fotos: brote y escuadra en public/img/qh/; Sagrada usa vesica-lapiz PROVISORIO, falta que Pablo elija foto) → torbellino "del átomo a la galaxia" → clase gratuita (form real) → ADN/doble hélice → 4 pilares (octaedro regular en Medicina de las Formas) → propuestas en tabla de una fila con fotos → Redes con fondo azul + fotos → Blog → Equipo.
- Se sacó la frase de Geo sobre "Métrica… sistemas de información" (error del original). Falta confirmación de Pablo.

## Base de datos (Supabase, ya creada y cargada)
- 63 tablas con RLS: perfiles (con ultimo_ingreso e historial), roles (alumno/formador/admin/soporte/editor), programas, cursos, lecciones, cohortes (con whatsapp_url), inscripciones, progreso, ultima_leccion, entregas TP, encuentros, sesiones 1:1, certificados, productos, precios, pedidos, cuotas, suscripciones, pagos, mensajería interna (conversaciones/mensajes: solo el equipo inicia y el alumno responde → cola_emails al email del equipo), notificaciones, cola_emails, equivalencias_legacy.
- Importados del XML de WordPress, tal cual: 45 programas (grupos LearnDash), 50 cursos, 368 lecciones (contenido literal con iframes de Vimeo), 568 relaciones programa-curso.
- Pablo es admin y está inscripto en los 45 programas (origen 'manual') para probar como alumno.
- Pendiente: los emails NO salen todavía (falta una Edge Function + Resend que procese cola_emails). Cobros (Mercado Pago / Stripe / PayPal) no hechos.

## Academia (src/pages/academia/ + src/lib/auth.ts + src/lib/supabase.ts)
- /ingresar/ → SOLO email + contraseña. Sin link mágico y SIN registro (las cuentas las crea Pablo en Supabase → Authentication → Users → Add user, o se crearán al comprar). Registro público desactivado en Supabase.
- /academia/ → saludo con último ingreso, "Retomá donde dejaste", Mis programas (con botón al WhatsApp de la cohorte); el equipo ve además todos los cursos con buscador.
- /academia/:curso/ → temario con avance. /academia/:curso/:leccion/ → contenido, temario lateral, marcar como vista, anterior/siguiente.
- El botón "Acceso estudiantes" del menú lleva a /ingresar/ (local y Vercel).
- Supabase Auth → URL Configuration: Site URL https://webespacio.vercel.app; Redirect URLs: esa misma y http://localhost:5173/**.

## Próximos pasos pensados
- Emails (Resend + Edge Function), checkout y cobros, panel de admin (crear alumnos, inscribir, cohortes), formadores y TP, certificados.
- Pablo debe definir: tabla de equivalencias (qué copias de cursos por cohorte —ETGS, ESPARM, CLUB, NOV25, A26— se unifican), precios y cohortes activas.
