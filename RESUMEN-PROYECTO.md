# Contexto: rediseño + academia — Espacio de Geometría Sagrada
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
- Tipografías: Montserrat solo 400 o 600 para títulos (font-bold = 600 en tailwind.config), Roboto texto, Roboto Mono etiquetas.
- Entramado de flor de la vida (.flor-bg) SOLO en la sección Manifiesto de la home.
- Ilustraciones como trazos geométricos SVG en línea.
- Sólidos en orden: tetraedro, hexaedro, octaedro, icosaedro, dodecaedro. Título: "5 Mentes, 5 Consciencias".
- Montserrat SIN negrita en nombres y títulos salvo que lo pida (máximo 600). Nada de líneas divisorias visibles (<hr> con borde). Sin emojis en tablas.
- Precios tachados: azul #094372 y negrita. No agregar puntos/formatos a números que Pablo pasa (CI, montos).
- NADA de numeraciones tipo 01, 02, 03 en kickers, tarjetas, FAQ ni sólidos (se sacaron de todo el sitio; quedan solo los #NN de los News Geométricos y los pasos ordenados).
- Secciones azules: clase .sec-azul (fondo #094372, letras blancas; redefine los tokens de color adentro). Usada en "En números", Cierre (YouTube) y el texto de Quiénes somos.

## Home (src/pages/Home.tsx) — orden actual
1. Hero — "Aprendé el lenguaje de la vida…", botones "Sumate a la clase gratuita" / "Ver propuestas".
2. Propuestas — título "Propuestas pensadas para todos los niveles". Clase gratuita en UNA caja ancha; debajo 4 cajas lado a lado: El libro, eBooks + MasterClass, Experiencias presenciales, Formaciones (textos de Experiencias y Formaciones redactados por Claude, a validar).
3. Pilares · 4. Sólidos · 5. Manifiesto ("Desde 2014… + de 10mil personas…", con flor de la vida).
6. En números (fondo azul): +10.000 estudiantes · +12 años compartiendo y multiplicando · +100.000 seguidores en nuestras redes, en 1 fila y 3 columnas. Debajo foto del workshop + línea de tiempo 2014 / 2019 / 2024 / 2026 (2013 se sacó).
7. Testimonios.
8. Cierre (fondo azul): "Un sábado al mes, trazamos juntos" + bloque "Clases gratuitas en YouTube" (videos en content.ts → clasesYoutube; hoy: oHpd3qcFAIc). Canal: https://www.youtube.com/channel/UCOziyLMsnP2cumt1ZUr1wpA
9. Equipo · 10. Blog "Para leer despacio" (toma solo los 4 últimos artículos, vienen del build: data.latest).
11. Preguntas frecuentes (sola, al final; título a la izquierda 5 pts más chico; faltan más preguntas).
- Scroll fluido: Hero 170svh, Manifiesto 150svh, Sólidos 260svh, slider de Pilares 1.8x, Lenis lerp 0.16.

## Pie de página (todo el sitio, src/components/Footer.tsx + content.ts → footer)
- "© 2014 – 2026 Espacio de Geometría Sagrada es una marca registrada por Monique Dumoulin" / debajo "Diseño y desarrollo: Share & Multiply Producciones" (sin link por ahora).

## Página "Quiénes somos" (src/pages/QuienesSomos.tsx, página propia; sin título visible ni símbolo)
1. Foto grande del equipo (media 2024-01-grupales-egs; ideal reemplazar por una de más resolución).
2. Texto en fondo azul, en zigzag (izq/der) con sólidos platónicos girando en los huecos (componente SolidoGira), cierre centrado "Juntos, encabezan…". Datos: +10000 personas, +125000 Facebook, +75000 Instagram.
3. Fotos de Monique (monique-taller) y Pablo (pablo-icosaedro) a la misma altura, con "Ver más" a /quienes-somos/monique-dumolin/ y /quienes-somos/pablo-pettinaroli/.
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
