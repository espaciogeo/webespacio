// Experiencias Geométricas (/formaciones/experiencias/): rediseño 23/10/2026 con el modelo de Formación
// profesional. Video a la derecha, fotos arriba, lugar para los flyers de los próximos eventos y una oferta
// general armada con la información común de cada evento (workshop de Buenos Aires, presentación del libro y
// retiro en Uruguay). Sin precios: cada evento tiene su página con entradas.
import { ArrowRight } from 'lucide-react';
import type { PageData } from '../types';
import { MaskTitle, Video } from '../components/site/Bits';
import { experienciasEventos, IMG } from '../content/formaciones';
import { FlorFondo, h2, SecFormadores, SecDudas } from './FormacionProfesional';
import { PanelesFotos, PestanasVivir, ChecklistAntes } from '../components/site/ExperienciasUx';

const FORMATOS = [
  { t: 'Workshops de un día', x: 'Una jornada en tu ciudad para trazar, construir y meditar con las formas, junto a Monique, Pablo y el equipo.' },
  { t: 'Retiros intensivos', x: 'Dos noches en la naturaleza, en convivencia y con un grupo reducido, para vivir la Geometría Sagrada a fondo.' },
  { t: 'Encuentros con la comunidad', x: 'Presentaciones y celebraciones para lectores, estudiantes y formadores, cara a cara.' },
];
const ic = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const VIVIRAS = [
  { t: 'Trazar', x: 'El símbolo geométrico con el que iniciamos nuestro camino, con compás y lápiz, junto a Monique y Pablo.', img: IMG.talleres[2],
    icono: <svg viewBox="0 0 48 48" aria-hidden="true"><circle {...ic} cx={19} cy={24} r={12} /><circle {...ic} cx={29} cy={24} r={12} /></svg> },
  { t: 'Jugar con los mandalas', x: 'Y crear en comunidad un gran toroide lleno de amor para enviar al mundo.', img: IMG.talleres[1],
    icono: <svg viewBox="0 0 48 48" aria-hidden="true"><circle {...ic} cx={24} cy={24} r={18} /><circle {...ic} cx={24} cy={24} r={9} /><path {...ic} d="M24 6v36M6 24h36" /></svg> },
  { t: 'Construir figuras', x: 'Una figura geométrica, para experimentar el significado de dar y recibir.', img: IMG.talleres[3],
    icono: <svg viewBox="0 0 48 48" aria-hidden="true"><path {...ic} d="M24 6l16 30H8z" /><path {...ic} d="M24 6v30M8 36l16-10 16 10" /></svg> },
  { t: 'Meditar con las formas', x: 'Con los Sólidos Platónicos y recorriendo laberintos, en un viaje que va más allá de los 5 sentidos.', img: IMG.talleres[4],
    icono: <svg viewBox="0 0 48 48" aria-hidden="true"><circle {...ic} cx={24} cy={24} r={18} /><path {...ic} d="M24 12a12 12 0 1 1-12 12M24 18a6 6 0 1 1-6 6" /></svg> },
];
const FOTOS = [
  { src: IMG.talleres[0], titulo: 'Con Monique y Pablo', texto: 'La energía de nuestras clases en vivo, en persona.' },
  { src: IMG.talleres[2], titulo: 'Trazar', texto: 'Compás, lápiz y el primer símbolo del camino.' },
  { src: IMG.talleres[3], titulo: 'Construir', texto: 'Figuras geométricas armadas entre todos.' },
  { src: IMG.talleres[1], titulo: 'Compartir', texto: 'Una comunidad que se encuentra cara a cara.' },
  { src: IMG.talleres[4], titulo: 'Meditar', texto: 'Con las formas, más allá de los 5 sentidos.' },
  { src: IMG.talleres[5], titulo: 'Celebrar', texto: '12 años escribiendo una historia juntos.' },
];
const REPORTES = [
  { v: '+ Foco', x: 'Una dirección clara de los pasos a seguir en sus desafíos.' },
  { v: '+ Confianza', x: 'Más conexión con su intuición, incluso meses después del evento.' },
  { v: '+ Plenitud', x: 'Una sensación de confianza en relación con el entorno.' },
];
const ANTES = [
  { t: 'Ganas de aprender y vivir una experiencia única', tag: 'Sin experiencia previa' },
  { t: 'Venir solo, sola o con quien quieras', tag: 'Comunidad' },
  { t: 'Compás, lápiz negro, lápices de colores, boligoma y regla', tag: 'Materiales' },
  { t: 'Saber que es para disfrutar: no se entrega certificado', tag: 'Experiencia' },
  { t: 'Si no podés ir, cambiás tu entrada por un ebook o curso', tag: 'Tranquilidad' },
];
const DUDAS = '<p>Escribinos y te contamos las próximas fechas, cómo son las entradas y los medios de pago. También podés escribirnos a <strong><a href="mailto:info@espaciodegeometriasagrada.com?subject=Consulta%20por%20Experiencias%20Geom%C3%A9tricas">info@espaciodegeometriasagrada.com</a>. Te respondemos en menos de 48 hs.</strong></p>';

function Flyer({ e }: { e: (typeof experienciasEventos)[number] }) {
  return (
    <a href={e.path} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-[#094372] text-white shadow-[0_24px_50px_-34px_rgb(9_67_114/0.7)]">
        {e.flyer
          ? <img src={e.flyer} alt={`Flyer: ${e.nombre}, ${e.fecha}, ${e.lugar}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          : (
            // PENDIENTE: flyer del evento (cargar la imagen en experienciasEventos[].flyer)
            <div className="flex h-full flex-col justify-between p-7">
              <FlorFondo />
              <p className="relative text-[12px] uppercase tracking-[0.2em] text-white/70">Experiencias Geométricas</p>
              <div className="relative">
                <p className="font-display text-[clamp(26px,2.4vw,34px)] font-medium leading-tight">{e.fecha}</p>
                <p className="mt-2 text-[17px] text-white/80">{e.lugar}</p>
                <p className="mt-6 inline-block rounded-full bg-[#66cc99] px-3 py-1 text-[13px] text-[#094372]">{e.nombre}</p>
              </div>
            </div>
          )}
      </div>
      <h3 className="mt-4 font-display text-[20px] font-medium leading-tight text-ink">{e.nombre}</h3>
      <p className="mt-1 text-[16px] text-ink-2">{e.fecha} · {e.lugar}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-[16px] font-medium text-[#094372] underline underline-offset-4">Ver detalles y entradas <ArrowRight size={16} aria-hidden /></span>
    </a>
  );
}

export default function Experiencias(_: { page: PageData }) {
  return (
    <>
      {/* Hero: texto a la izquierda, video a la derecha */}
      <section className="wrap grid grid-cols-12 items-center gap-x-6 gap-y-10 pb-[6svh] pt-28 sm:pt-32 lg:min-h-[72svh] lg:pt-36">
        <div className="col-span-12 min-w-0 lg:col-span-5">
          <nav aria-label="Ruta" className="mb-5 text-small text-ink-2"><a href="/formaciones/" className="inline-flex min-h-[44px] items-center underline underline-offset-4">Formaciones</a> <span aria-hidden>/</span></nav>
          <p className="kicker"><span className="rounded-full bg-[#66cc99] px-3 py-1 text-[#094372]">Presenciales</span></p>
          <MaskTitle text="Experiencias Geométricas" className="display mt-6" style={{ fontSize: 'min(var(--fs-hero), clamp(40px, 4.4vw, 76px))', lineHeight: 0.98 }} />
          <p className="mt-6 max-w-[44ch] text-reading leading-relaxed text-ink-2">La energía de nuestras clases en vivo, en persona: eventos presenciales en tu ciudad junto a Monique, Pablo y todo el equipo.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#fechas" className="btn btn-primary mt-8">Ver próximas fechas</a>
            <a href="#tu-ciudad" className="btn btn-ghost mt-8">Llevalas a tu ciudad</a>
          </div>
        </div>
        <div className="col-span-12 min-w-0 lg:col-span-7">
          <Video provider="vimeo" id="1021827689" title="Así se viven las Experiencias Geométricas" />
        </div>
      </section>

      {/* Fotos, arriba: paneles que se abren (Lucian #389) */}
      <section aria-label="Fotos de Experiencias anteriores" className="wrap pb-[var(--section-y)]">
        <PanelesFotos fotos={FOTOS} />
      </section>

      {/* Próximas fechas: flyers */}
      <section id="fechas" className="bg-[var(--paper-2)] scroll-mt-24 py-[var(--section-y)]">
        <div className="wrap">
          <div className="grid grid-cols-12 gap-x-6 gap-y-4" data-rv>
            <h2 className="col-span-12 font-display font-medium tracking-[-0.03em] lg:col-span-6" style={h2}>Próximas fechas</h2>
            <p className="col-span-12 text-reading text-ink-2 lg:col-span-5 lg:col-start-8 lg:self-end">Hacé clic en la fecha que te interesa para conocer todos los detalles. Muy pronto, nuevas fechas.</p>
          </div>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {experienciasEventos.map((e, i) => (
              <li key={e.path} data-rv className="rv" style={{ ['--d' as string]: `${i * 110}ms` }}><Flyer e={e} /></li>
            ))}
          </ul>
        </div>
      </section>

      {/* Oferta general, en azul */}
      <section className="sec-azul relative overflow-hidden py-[var(--section-y)]">
        <FlorFondo />
        <div className="wrap relative" data-rv>
          <div className="grid grid-cols-12 gap-x-6 gap-y-8">
            <h2 className="col-span-12 font-display font-medium tracking-[-0.03em] lg:col-span-6" style={h2}>12 años escribiendo una historia, en persona</h2>
            <p className="col-span-12 text-reading leading-relaxed text-ink-2 lg:col-span-5 lg:col-start-8 lg:self-end">Experiencias Geométricas son eventos pensados para mostrar lo que la Geometría Sagrada puede hacer en la vida de las personas. Cada uno es diferente, y en todos creamos comunidad mientras experimentamos cómo este conocimiento te ayuda a transformar tu vida.</p>
          </div>
          <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-3">
            {FORMATOS.map((f) => (
              <li key={f.t}>
                <h3 className="font-display text-[24px] font-medium leading-tight">{f.t}</h3>
                <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{f.x}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Lo que vas a vivir: pestañas que avanzan solas (Lucian #213) */}
      <section className="wrap py-[var(--section-y)]" data-rv>
        <div className="grid grid-cols-12 gap-x-6 gap-y-4">
          <h2 className="col-span-12 font-display font-medium tracking-[-0.03em] lg:col-span-6" style={h2}>Lo que vas a vivir</h2>
          <p className="col-span-12 text-reading font-semibold text-ink lg:col-span-5 lg:col-start-8 lg:self-end">Cada evento es diferente, y en todos jugamos, construimos y meditamos con la Geometría Sagrada.</p>
        </div>
        <div className="mt-10"><PestanasVivir items={VIVIRAS} /></div>
      </section>

      {/* + Foco · + Confianza · + Plenitud, destacado en azul */}
      <section aria-labelledby="exp-reportes" className="bg-[#094372] py-[var(--section-y)] text-white">
        <div className="wrap" data-rv>
          <h2 id="exp-reportes" className="max-w-[28ch] font-display font-medium tracking-[-0.03em]" style={h2}>En experiencias anteriores, las y los participantes reportaron</h2>
          <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-3">
            {REPORTES.map((r, i) => (
              <li key={r.v} data-rv className="rv border-t border-white/25 pt-6" style={{ ['--d' as string]: `${i * 120}ms` }}>
                <p className="font-display text-[clamp(44px,5vw,72px)] font-medium leading-none tracking-[-0.03em] text-[#66cc99]">{r.v}</p>
                <p className="mt-4 text-[18px] leading-relaxed text-white/85">{r.x}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Monique y Pablo */}
      <section className="sec-azul py-[var(--section-y)]">
        <div className="wrap grid grid-cols-12 items-center gap-x-6 gap-y-10" data-rv>
          <div className="col-span-12 min-w-0 lg:col-span-6">
            <img src={IMG.duoSolidos} alt="Monique Dumoulin y Pablo Pettinaroli con sólidos platónicos" loading="lazy" className="mx-auto w-full max-w-[560px]" />
          </div>
          <div className="col-span-12 min-w-0 lg:col-span-5 lg:col-start-8">
            <h2 className="font-display font-medium tracking-[-0.03em]" style={h2}>Monique y Pablo</h2>
            <p className="mt-5 text-reading leading-relaxed text-ink-2">Desde hace más de 12 años tienen la misión de compartir y multiplicar este conocimiento ancestral. Acompañaron a miles de personas en más de 30 países con las propuestas presenciales y la Formación online.</p>
            <p className="mt-4 text-reading leading-relaxed text-ink-2">Monique es arquitecta y fundadora del Espacio de Geometría Sagrada; Pablo es Diseñador Multimedial.</p>
          </div>
        </div>
      </section>

      {/* Antes de venir: checklist con anillo (Lucian #014) */}
      <section className="wrap grid grid-cols-12 items-center gap-x-6 gap-y-8 py-[var(--section-y)]" data-rv>
        <div className="col-span-12 lg:col-span-5">
          <h2 className="font-display font-medium tracking-[-0.03em]" style={h2}>Antes de venir</h2>
          <p className="mt-5 text-reading leading-relaxed text-ink-2">Repasá tu lista y marcá lo que ya tenés. Si te queda alguna duda, escribinos y te ayudamos.</p>
        </div>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <ChecklistAntes titulo="Tu lista" sub="Marcá lo que ya tenés" listo="¡Ya estás para vivirla!" items={ANTES} />
        </div>
      </section>

      {/* Propuestas vigentes para anotarse */}
      <section id="anotate" className="wrap scroll-mt-24 pb-[var(--section-y)]" data-rv>
        <div className="text-center">
          <a href="#vigentes" className="btn btn-primary inline-flex">Anotate en la próxima o volvé a repetir <ArrowRight size={18} aria-hidden /></a>
        </div>
        <div id="vigentes" className="mt-10 scroll-mt-28 rounded-[28px] bg-[var(--paper-2)] p-6 sm:p-10">
          <p className="kicker">Propuestas vigentes</p>
          <ul className="mt-6 grid gap-4">
            {experienciasEventos.map((e) => (
              <li key={e.path}>
                <a href={e.path} className="group flex flex-col gap-3 rounded-[20px] bg-paper p-6 shadow-[0_20px_44px_-34px_rgb(9_67_114/0.5)] sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    <b className="block font-display text-[22px] font-medium leading-tight text-ink">{e.nombre}</b>
                    <span className="mt-1 block text-[17px] text-ink-2">{e.fecha} · {e.lugar}</span>
                  </span>
                  <span className="btn btn-primary inline-flex flex-none self-start sm:self-auto">Anotarme <ArrowRight size={18} aria-hidden /></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Llevalas a tu ciudad */}
      <section id="tu-ciudad" className="bg-[var(--paper-2)] scroll-mt-24 py-[var(--section-y)]">
        <div className="wrap" data-rv>
          <h2 className="font-display font-medium tracking-[-0.03em]" style={h2}>¿Querés que viajemos a tu ciudad?</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {[
              { t: 'Postulá tu espacio', x: '¿Tenés un espacio y querés que viajemos a tu ciudad? Postulalo acá.', href: '/formaciones/experiencias/postula-tu-espacio/' },
              { t: 'Postulate como productor', x: '¿Sos productor o tenés una escuela y querés que viajemos a tu ciudad? Postulate acá.', href: '/formaciones/experiencias/productores/' },
            ].map((c) => (
              <li key={c.t}>
                <a href={c.href} className="group flex h-full flex-col rounded-[22px] bg-paper p-8 shadow-[0_20px_44px_-34px_rgb(9_67_114/0.5)]">
                  <h3 className="font-display text-[24px] font-medium leading-tight text-ink">{c.t}</h3>
                  <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{c.x}</p>
                  <span className="mt-6 inline-flex items-center gap-1 font-medium text-[#094372] underline underline-offset-4">Postularme <ArrowRight size={16} aria-hidden /></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SecFormadores />
      <SecDudas html={DUDAS} />
    </>
  );
}
