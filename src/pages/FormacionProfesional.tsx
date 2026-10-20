// Formación profesional (/formaciones/formacion-profesional/): página propia, orden definido por Pablo (20/10/2026).
// Textos tomados de la página vieja de WordPress y de admision.espaciodegeometriasagrada.com.
import { ArrowRight } from 'lucide-react';
import type { Block, PageData } from '../types';
import { MaskTitle, Video, WpForm } from '../components/site/Bits';
import { Trazo } from '../components/site/Trazo';
import { Cifras } from '../components/Cifras';
import { Img } from '../lib/Img';
import { SolidoGira } from './QuienesSomos';
import { links } from '../content';

const ENTREVISTA = links.admision + '#agenda';

// Busca en la página vieja el bloque que corresponde (por texto), así los datos vienen del contenido real.
function useBloques(page: PageData) {
  const all = page.sections.flatMap((s) => s.blocks);
  const find = <T extends Block['t']>(t: T, has?: string) =>
    all.find((b) => b.t === t && (!has || JSON.stringify(b).includes(has))) as Extract<Block, { t: T }> | undefined;
  return { all, find };
}

function BtnEntrevista({ texto = 'Solicitá tu entrevista', claro = false }: { texto?: string; claro?: boolean }) {
  return <a href={ENTREVISTA} className={`btn ${claro ? 'btn-primary' : 'btn-primary'} mt-8 inline-flex`}>{texto} <ArrowRight size={18} aria-hidden /></a>;
}

const h2 = { fontSize: 'var(--fs-h2)', lineHeight: 1.02 } as const;

// Testimonios de admision (F) + 6 testimonios en video de formacion.espaciodegeometriasagrada.com
const TESTIMONIOS = [
  { texto: 'Cada trazo generó un cambio real en mí: claridad mental, movimiento energético y un impacto positivo que sigo sintiendo en mi vida diaria después de cada práctica.', nombre: 'María Luciana C.', lugar: 'Estudiante de nuestra Formación en Argentina', pais: 'ar' },
  { texto: 'Nunca imaginé descubrir tanto de mí misma con los trazos. Me mostraron mis luces y sombras, ayudándome a crecer con más conciencia y reconocer mis fortalezas internas.', nombre: 'Karen Hernández F.', lugar: 'Estudiante de la MasterClass, en España', pais: 'es' },
  { texto: 'Mientras armaba los sólidos encontré valentía para cambios profundos. Mi vida y mi entorno se transformaron por completo, dándome un nuevo sentido y dirección real.', nombre: 'Adriana Mabel M.', lugar: 'Lectora de nuestros eBooks, en U.S.A', pais: 'us' },
  { texto: 'Los trazos me dieron paciencia y foco. Pinté un espiral y lo puse en el área del dinero: cada vez que lo miro me inspira abundancia y me recuerda que todo fluye naturalmente.', nombre: 'María Valeria G.', lugar: 'Estudiante de nuestra Mentoría en Chile', pais: 'cl' },
  { texto: 'Hice muchas capacitaciones. Nunca me sentí tan acompañada ni contenida. Monique y Pablo son generosos en lo que comparten. La mejor inversión que hice en mi vida.', nombre: 'Angelica L.', lugar: 'Estudiante de la MasterClass, en México', pais: 'mx' },
  { texto: 'Es una medicina. Al respirar y recorrer los trazos siento ajustes internos, claridad y hasta mensajes de mis ancestros que me ayudan a sanar y encontrar verdadero sentido.', nombre: 'Gracia B.', lugar: 'Estudiante de nuestra Formación, en Colombia', pais: 'co' },
];
const SALIDAS = [
  { t: 'Brindar asesoramiento en armonización y limpieza de ambientes', x: 'Para limpiar, cuidar y proteger la energía de las casas y oficinas de tu comunidad.', img: 'trazo-toro' },
  { t: 'Ofrecer tus servicios como Terapista Geómetra', x: 'O complementarlos con tu actividad, y ayudar a las personas a reordenarse energética y geométricamente.', img: 'monique-taller' },
  { t: 'Ofrecer tus propios cursos y talleres en tu ciudad', x: 'Y viajar por el mundo compartiendo y multiplicando, con el aval y promoción del Espacio de Geometría Sagrada.', img: 'taller-grupo' },
  { t: 'Aplicar en tu propia vida', x: 'Cada una de las herramientas que este conocimiento ofrece, con absoluta Maestría, alcanzando un profundo nivel de conocimiento acerca de ti.', img: 'trazo-compas' },
  { t: 'Formar parte del staff de Formadores Geómetras', x: 'Lo que te ayudará a ganar visibilidad internacional al mismo tiempo que te posicionará como referente en tu localidad.', img: 'equipo-retrato' },
  { t: 'Acceder a programas de formación continua', x: 'Para sumar más saberes y experiencias, con los líderes más influyentes en el campo del desarrollo del potencial humano.', img: 'construccion-manos' },
];
// Formulario de contacto con mensaje (el de la página del Dossier en WordPress: nombre, email y mensaje)
const CONTACTO = { name: 'Contacto', formId: 'd050aec', postId: '32072', submit: 'Enviar consulta', fields: [
  { label: 'Nombre', type: 'text', required: true, id: 'name', options: [] as string[] },
  { label: 'Email', type: 'email', required: true, id: 'email', options: [] as string[] },
  { label: 'Tu mensaje', type: 'textarea', required: false, id: 'message', options: [] as string[] },
] };
// Fondo de la sección azul: flor de la vida en trazo fino
function FlorFondo() {
  const r = 1; const pts: [number, number][] = [[0, 0]];
  for (let k = 1; k <= 2; k++) for (let i = 0; i < 6 * k; i++) {
    const side = Math.floor(i / k), step = i % k;
    const a0 = (Math.PI / 3) * side, a1 = (Math.PI / 3) * (side + 1);
    pts.push([k * Math.cos(a0) + step * (Math.cos(a1) - Math.cos(a0)), k * Math.sin(a0) + step * (Math.sin(a1) - Math.sin(a0))]);
  }
  return (
    <svg viewBox="-3.4 -3.4 6.8 6.8" className="fp-flor pointer-events-none absolute -right-[12%] top-1/2 h-[150%] -translate-y-1/2 opacity-[0.22] lg:-right-[4%]" aria-hidden="true">
      <g className="fp-flor-g" fill="none" stroke="#fff" strokeWidth="0.018">
        <circle r={3.05} /><circle r={3.12} />
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} />)}
      </g>
    </svg>
  );
}
const VIDEOS = ['6Sz_iQ3Al1g', 'AoXVntT4J5k', 'OChXAUjjsas', 'MCqYnVsQ5Do', 'foohKfmeD7M', 'JZGZVp04obw'];

function Cita({ t, d }: { t: (typeof TESTIMONIOS)[number]; d: number }) {
  return (
    <figure data-rv className="rv fp-card m-0 flex h-full flex-col rounded-[16px] bg-white p-5 text-[#094372] shadow-[0_18px_40px_-28px_rgb(0_0_0/0.55)]" style={{ ['--d' as string]: `${d}ms` }}>
      <span aria-hidden className="block font-display text-[40px] leading-[0.6] text-[#66cc99]">“</span>
      <blockquote className="m-0 mt-1 text-[15px] leading-relaxed">{t.texto}</blockquote>
      <figcaption className="mt-auto flex items-center gap-2.5 pt-4">
        {/* PENDIENTE: si llegan las fotos de cada persona, van acá en lugar de la bandera */}
        <span className="grid h-9 w-9 flex-none place-items-center overflow-hidden rounded-full bg-[#eef4f9] ring-2 ring-[#66cc99]/60">
          <img src={`https://flagcdn.com/w80/${t.pais}.png`} alt="" width={48} height={32} loading="lazy" className="h-full w-full object-cover" />
        </span>
        <span>
          <b className="block font-display text-[15px] font-medium">{t.nombre}</b>
          <small className="block text-[12.5px] leading-snug italic text-[#094372]/70">{t.lugar}</small>
        </span>
      </figcaption>
    </figure>
  );
}
function VideoCaja({ id, d }: { id: string; d: number }) {
  return (
    <div data-rv className="rv fp-card rounded-[16px] bg-white p-1.5 shadow-[0_18px_40px_-28px_rgb(0_0_0/0.55)]" style={{ ['--d' as string]: `${d}ms` }}>
      <Video provider="youtube" id={id} title="Testimonio en video" vertical chico />
    </div>
  );
}

export default function FormacionProfesional({ page }: { page: PageData }) {
  const { find } = useBloques(page);
  const video = find('video');
  const listaFormacion = find('text', 'Compuesta por 11 cursos');
  const quienes = find('text', 'cuenta ya con');
  const dudas = find('text', 'Completa el formulario');
  const quienesHtml = quienes?.html.replace('cuenta ya con 8 años', 'cuenta ya con más de 12 años');

  // Columnas de testimonios: cita y video intercalados; la columna del medio arranca más abajo.
  const piezas = TESTIMONIOS.flatMap((t, i) => {
    const c = { k: 'c' as const, t, i }, v = { k: 'v' as const, id: VIDEOS[i], i };
    return Math.floor(i / 2) % 2 === 0 ? [c, v] : [v, c];
  });

  return (
    <>
      {/* 1 · Hero: texto a la izquierda, video a la derecha */}
      <section className="wrap grid grid-cols-12 items-center gap-x-6 gap-y-10 pb-[8svh] pt-28 sm:pt-32 lg:min-h-[78svh] lg:pt-36">
        <div className="col-span-12 min-w-0 lg:col-span-5">
          <nav aria-label="Ruta" className="mb-5 text-small text-ink-2"><a href="/formaciones/" className="inline-flex min-h-[44px] items-center underline underline-offset-4">Formaciones</a> <span aria-hidden>/</span></nav>
          <p className="kicker"><span className="rounded-full bg-[#66cc99] px-3 py-1 text-[#094372]">Inscripciones abiertas</span></p>
          <MaskTitle text="Formación Profesional" className="display mt-6" style={{ fontSize: 'var(--fs-hero)', lineHeight: 0.98 }} />
          <p className="mt-6 max-w-[44ch] text-reading leading-relaxed text-ink-2">100% Online. Aval Internacional. Salida Laboral.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#inscripcion" className="btn btn-primary mt-8">Quiero inscribirme</a>
            <a href={ENTREVISTA} className="btn btn-ghost mt-8">Solicitá tu entrevista</a>
          </div>
        </div>
        <div className="col-span-12 min-w-0 lg:col-span-7">
          {video && <Video provider={video.provider} id={video.id} title="Presentación de la Formación Profesional" />}
        </div>
      </section>

      {/* 3 + 2 · fondo azul con flor de la vida */}
      <section className="sec-azul relative overflow-hidden py-[var(--section-y)]">
        <FlorFondo />
        <div className="wrap relative grid grid-cols-12 gap-x-6 gap-y-8" data-rv>
          <h2 className="col-span-12 font-display font-medium tracking-[-0.03em] lg:col-span-6" style={h2}>Te presentamos la primera Formación Profesional de Geometría Sagrada de habla hispana.</h2>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:self-end">
            <p className="kicker">Facilitada por Geómetras, para todo el mundo</p>
            <p className="mt-4 text-reading leading-relaxed text-ink-2">La Formación Profesional en Geometría Sagrada está diseñada para que la realices desde la comodidad de tu hogar. Está compuesta por 11 cursos, tiene una duración de 24 meses, y entrega un Certificado Internacional con aval del Espacio de Geometría Sagrada.</p>
          </div>
        </div>
      </section>

      {/* 12 · La Formación + botón entrevista */}
      <section className="wrap grid grid-cols-12 gap-x-6 gap-y-10 py-[var(--section-y)]" data-rv>
        <div className="col-span-12 min-w-0 lg:col-span-6">
          <h2 className="font-display font-medium tracking-[-0.03em]" style={h2}>La Formación</h2>
          {listaFormacion && <div className="prose-egs mt-6" dangerouslySetInnerHTML={{ __html: listaFormacion.html }} />}
          <BtnEntrevista />
        </div>
        <div className="col-span-12 min-w-0 lg:col-span-6 lg:self-center">
          <div className="aspect-[4/5] overflow-hidden rounded-[22px] lg:aspect-[5/6]">
            <Img name="taller-alumnas" alt="Alumnas de la Formación trazando Geometría Sagrada" sizes="(min-width:1024px) 46vw, 100vw" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* 6 · Dossier: a la derecha va la presentación (PENDIENTE: reemplazar la imagen de referencia por el ppt) */}
      <section className="wrap grid grid-cols-12 gap-x-6 gap-y-10 pb-[var(--section-y)]" data-rv>
        <div className="col-span-12 min-w-0 lg:col-span-5 lg:self-center">
          <h2 className="font-display font-medium tracking-[-0.03em]" style={{ fontSize: 'clamp(30px, 3.4vw, 52px)', lineHeight: 1.05 }}>Descargá el Dossier y el Programa de Estudios</h2>
          <div className="flex flex-wrap gap-3">
            <BtnEntrevista />
          </div>
        </div>
        <div className="col-span-12 min-w-0 lg:col-span-7">
          <div className="fp-ppt relative aspect-video overflow-hidden rounded-[18px] bg-[#094372] text-white shadow-[0_30px_60px_-40px_rgb(0_0_0/0.6)]" role="img" aria-label="Imagen de referencia: acá va la presentación del Dossier">
            <Trazo tipo="semilla" className="absolute -right-[8%] top-1/2 w-[55%] -translate-y-1/2 opacity-30 [&_*]:!stroke-white" />
            <div className="absolute inset-0 flex flex-col justify-between p-[6%]">
              <p className="text-[12px] uppercase tracking-[0.2em] text-white/70">Espacio de Geometría Sagrada</p>
              <div>
                <p className="font-display text-[clamp(22px,3vw,40px)] font-medium leading-tight">Dossier y Programa<br />de Estudios</p>
                <p className="mt-2 text-[14px] text-white/70">Formación Profesional en Geometría Sagrada</p>
              </div>
              <div className="flex items-center justify-between text-[12px] text-white/60"><span>1 / 12</span><span>‹ ›</span></div>
            </div>
          </div>
          <p className="mt-3 text-[14px] text-ink-3">Imagen de referencia. Acá va la presentación.</p>
        </div>
      </section>

      {/* 7 + 8 · Con tu certificado podrás: 6 cajas con imagen, 3 y 3 */}
      <section className="bg-[var(--paper-2)] py-[var(--section-y)]">
        <div className="wrap">
          <h2 className="max-w-[24ch] font-display font-medium tracking-[-0.03em]" style={h2} data-rv>Con tu certificado de Formador Geómetra, podrás</h2>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SALIDAS.map((x, i) => (
              <li key={x.t} data-rv className="rv fp-card group overflow-hidden rounded-[22px] bg-paper shadow-[0_20px_44px_-34px_rgb(9_67_114/0.5)]" style={{ ['--d' as string]: `${(i % 3) * 110}ms` }}>
                <div className="aspect-[16/10] overflow-hidden">
                  <Img name={x.img} alt="" sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-[21px] font-medium leading-tight text-ink">{x.t}</h3>
                  <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{x.x}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cifras: el mismo módulo de la home */}
      <Cifras />

      {/* F · Testimonios reales: fondo azul, citas en cajas blancas intercaladas con 6 videos */}
      <section className="sec-azul overflow-hidden border-t border-white/10 py-[var(--section-y)]" aria-labelledby="fp-testimonios">
        <div className="wrap">
          <div className="mx-auto max-w-[860px] text-center" data-rv>
            <p className="kicker">¿Qué dicen nuestros estudiantes?</p>
            <h2 id="fp-testimonios" className="mt-4 font-display font-medium tracking-[-0.03em]" style={h2}>Testimonios reales de personas reales</h2>
            <p className="mt-5 text-reading text-ink-2">Luego de 12 años compartiendo y multiplicando este conocimiento, podemos decir con orgullo y alegría que tenemos testimonios reales… de personas reales.</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-[1180px] grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {piezas.map((p, j) => p.k === 'c' ? <Cita key={'c' + p.i} t={p.t} d={(j % 4) * 90} /> : <VideoCaja key={'v' + p.i} id={p.id} d={(j % 4) * 90} />)}
          </div>
          <div className="mt-16 grid items-center gap-6 lg:grid-cols-12" data-rv>
            <p className="font-display text-[clamp(22px,2.2vw,32px)] leading-snug lg:col-span-7">Podríamos poner cientos y cientos de testimonios…<br />pero el que más nos importa es el próximo: <b className="font-semibold">el tuyo</b>.</p>
            <div className="lg:col-span-4 lg:col-start-9 lg:text-right">
              <a href={ENTREVISTA} className="btn btn-primary inline-flex">Solicitá tu entrevista de admisión <ArrowRight size={18} aria-hidden /></a>
            </div>
          </div>
        </div>
      </section>

      {/* 13 · Inscripción: acá va la encuesta de precalificación (PENDIENTE: embeber la encuesta de GHL) */}
      <section id="inscripcion" className="wrap grid scroll-mt-24 grid-cols-12 gap-x-6 gap-y-8 py-[var(--section-y)]" data-rv>
        <div className="col-span-12 lg:col-span-5">
          <h2 className="font-display font-semibold tracking-[-0.03em]" style={h2}>¿Querés anotarte? ¿Conocer los medios de pago disponibles?</h2>
          <p className="mt-5 text-reading text-ink-2">Solicitá tu entrevista de admisión.</p>
        </div>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <div className="grid min-h-[320px] place-items-center rounded-[22px] border-2 border-dashed border-[#094372]/30 bg-[var(--paper-2)] p-8 text-center">
            <div>
              <p className="font-display text-[22px] font-medium text-ink">Encuesta de precalificación</p>
              <p className="mt-2 text-ink-3">Acá va la encuesta.</p>
              <BtnEntrevista texto="Solicitá tu entrevista de admisión" />
            </div>
          </div>
        </div>
      </section>

      {/* 4 + B · título de C: misión con sólidos platónicos girando, en escalera */}
      <section className="sec-azul relative overflow-hidden py-[var(--section-y)]">
        <div className="wrap" data-rv>
          <div className="grid grid-cols-12 gap-x-6 gap-y-6">
            <h2 className="col-span-12 font-display font-medium tracking-[-0.03em] lg:col-span-6" style={h2}>La experiencia, nuestro mayor orgullo</h2>
            {quienesHtml && <div className="prose-egs col-span-12 text-reading lg:col-span-5 lg:col-start-8 lg:self-end" dangerouslySetInnerHTML={{ __html: quienesHtml }} />}
          </div>
          <p className="kicker mt-10">Nuestra Misión: Compartir y Multiplicar</p>
          <ol className="mt-6 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Democratizar el conocimiento', 'Nuestra misión es expandir la Geometría Sagrada al mayor número de personas posible. Estas clases tienen un valor simbólico, para que cualquiera pueda dar sus primeros pasos y beneficiarse de este conocimiento ancestral.'],
              ['Una Trayectoria de 12 Años', 'Llevamos más de once años compartiendo y multiplicando esta enseñanza. A lo largo de este camino hemos acompañado a miles de personas en su proceso de transformación, siempre con honestidad y respeto por cada estudiante.'],
              ['Experiencias Transformadoras', 'Estas clases son el primer contacto con un conocimiento ancestral que puede aplicarse en tu vida diaria. No es solo teoría: son experiencias que te permiten sentir la geometría en tu cuerpo, tus emociones y tu entorno.'],
              ['El Camino a la Maestría', 'Para quienes buscan ir más allá, tenemos propuestas de aprendizaje profesional. No prometemos soluciones rápidas: se trata de un viaje de práctica y compromiso, diseñado para quienes quieren integrar esta sabiduría en profundidad.'],
            ].map(([t, x], i) => (
              <li key={t} data-rv className={`rv fp-mision ${['', '', 'lg:-mt-10', 'lg:-mt-20'][i]}`} style={{ ['--d' as string]: `${i * 140}ms` }}>
                <div className="relative grid h-36 w-36 place-items-center">
                  <span className="absolute inset-3 rounded-full bg-white/[0.06]" aria-hidden />
                  <SolidoGira idx={i} className="relative h-32 w-32" />
                </div>
                <h3 className="mt-5 font-display text-[24px] font-medium leading-tight">{t}</h3>
                <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{x}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 16 · Nuestro equipo de formadores */}
      <section aria-labelledby="fp-formadores" className="wrap py-[var(--section-y)]" data-rv>
        <h2 id="fp-formadores" className="font-display font-medium tracking-[-0.03em]" style={h2}>Nuestro equipo de formadores</h2>
        <img src="/img/formadores-equipo.webp" alt="Formadoras y Formadores del equipo: Patricia, Javier, Nancy, Sandra, Silvia, Lili, Marisa, Natividad, Zulay, Zunilda, Marcela, Romina, Silvia, Alodia y Lorena"
          width={1200} height={675} loading="lazy" className="mx-auto mt-10 w-full max-w-[1100px]" />
      </section>

      {/* 15 · Dudas o consultas, abajo de todo, con formulario que incluye mensaje */}
      <section id="formulario" className="bg-[var(--paper-2)] scroll-mt-24 py-[var(--section-y)]">
        <div className="wrap grid grid-cols-12 gap-x-6 gap-y-8" data-rv>
          <div className="col-span-12 lg:col-span-5">
            <h2 className="font-display font-medium tracking-[-0.03em]" style={h2}>¿Dudas o consultas?</h2>
            {dudas && <div className="prose-egs mt-5" dangerouslySetInnerHTML={{ __html: dudas.html }} />}
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7"><div className="rounded-[24px] bg-paper p-6 sm:p-8"><WpForm {...CONTACTO} /></div></div>
        </div>
      </section>
    </>
  );
}
