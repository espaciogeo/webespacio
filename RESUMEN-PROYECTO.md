# Contexto: rediseño + academia — Espacio de Geometría Sagrada
_Actualizado: 17/10/2026_

## Quién y cómo trabajar
- Usuario: Pablo (pablopettinaroli@gmail.com). No es programador: explicarle en español rioplatense, simple, con comandos listos para pegar en PowerShell (Windows).
- Hacer SOLO lo que pide, en la sección que nombra. Si un cambio puede afectar otras partes del sitio, PREGUNTAR antes.
- Nunca mostrar ni pedir la service_role key.

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

## Hecho en la home
- Hero: título "Geometría Sagrada", debajo "Aprendé el lenguaje de la vida codificado en símbolos y patrones. Clases, Cursos y Talleres para aplicar en tu vida y profesión.", botones "Sumate a la clase gratuita" y "Ver propuestas" lado a lado.
- Manifiesto: "Desde 2014, compartimos este conocimiento ancestral. Ya acompañamos a + de 10mil personas en todo el mundo."
- Scroll más fluido: alturas de secciones fijas reducidas (Hero 170svh, Manifiesto 150svh, Sólidos 260svh, slider de Pilares 1.8x, Lenis lerp 0.16).

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
