# Espacio de Geometría Sagrada — sitio y plataforma

Rediseño del sitio espaciodegeometriasagrada.com. Hablá siempre en español (rioplatense), simple y sin tecnicismos: quien pide los cambios no es programador.

## Reglas de trabajo (importantes)
- Hacé SOLO lo que se pide, en la sección o página que se nombra. Si un cambio podría aplicarse también en otras partes del sitio, PREGUNTÁ antes de extenderlo.
- Antes de cambios grandes (rehacer una página, cambiar algo global), contá en 2–3 líneas qué vas a hacer y esperá el OK.
- Al terminar, decí en pocas líneas qué cambió y en qué URL verlo (http://localhost:5173/...).
- No toques `.env.local` ni muestres claves.
- Antes de subir, corré `npm run build` y asegurate de que termine sin errores.
- "Subí los cambios" = `git add .` + commit con mensaje claro en español + `git push`. Vercel publica solo desde `main`.

## Diseño (decisiones ya tomadas)
- Fondo: blanco puro #FFFFFF en todo el sitio. Nada de grises, sombras de fondo, texturas ni grano.
- Colores: azul #094372 (tinta), verde agua #66CC99 (acento), gris #666666 (texto secundario). Tokens en `src/styles/tokens.css`.
- Tipografías: Montserrat solo en normal (400) o semi negrita (600) para títulos; Roboto para texto; Roboto Mono para etiquetas chicas.
- El entramado de flor de la vida de fondo va SOLO en la sección Manifiesto de la home (clase `.flor-bg`).
- Ilustraciones: trazos geométricos en SVG (líneas azules, guías verdes, anotaciones en mono), no imágenes genéricas.
- Orden de los sólidos: tetraedro, hexaedro (cubo), octaedro, icosaedro, dodecaedro.

## Dónde está cada cosa
- Textos de la home: `src/content.ts` · Secciones de la home: `src/components/*.tsx` · Home: `src/pages/Home.tsx`
- Página "Qué hacemos": `src/pages/QueHacemos.tsx` (página propia, no usa la plantilla genérica)
- Páginas migradas de WordPress: `src/content/wp/pages/*.json` + plantilla `src/pages/WpPage.tsx`
- Formaciones y precios: `src/content/formaciones.ts`, `src/content/colecciones.ts`, `src/content/precios.json`
- Estilos globales: `src/index.css`, `src/styles/`
- Imágenes del sitio: `public/img/` (usar el componente `Img` de `src/lib/Img.tsx`)

## Técnica
- React 19 + Vite 6 + Tailwind 3 + framer-motion + three.js. Sitio multipágina prerenderizado.
- Comandos: `npm run dev` (local en :5173), `npm run build` (lo mismo que corre Vercel).
- Base de datos: Supabase. Cliente en `src/lib/supabase.ts` (lee `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`). Las reglas de seguridad (RLS) están en la base; nunca usar la service_role key en el sitio.
