// Especialización en Terapias (/formaciones/especializacion-en-terapias/): página propia con el mismo modelo
// que Formación Profesional (pedido de Pablo, 23/10/2026). Textos de los documentos internos del programa:
// "Especialización Terapias – Geómetra Avanzado", "Cliente ideal" y el resumen curricular.
// Sin precios, links de pago, bonos ni cupos. Clases en vivo: 2.º y 4.º sábado. Sin garantía.
import { ArrowRight } from 'lucide-react';
import type { PageData } from '../types';
import { MaskTitle } from '../components/site/Bits';
import { Cifras } from '../components/Cifras';
import { Img } from '../lib/Img';
import { links } from '../content';
import { FlorFondo, h2, SecTestimonios, SecExperiencia, SecFormadores, SecDudas } from './FormacionProfesional';

const ENTREVISTA = links.admision + '?programa=terapias#agenda';

function BtnEntrevista({ texto = 'Solicitá tu entrevista' }: { texto?: string }) {
  return <a href={ENTREVISTA} className="btn btn-primary mt-8 inline-flex">{texto} <ArrowRight size={18} aria-hidden /></a>;
}

// La Especialización: negrita solo en las cifras, como en Formación Profesional
const LISTA = '<ul>'
  + '<li>Compuesta por <strong>7 módulos</strong> y un curso final.</li>'
  + '<li>Duración total: <strong>9 meses</strong>, más 3 meses de prórroga sin costo.</li>'
  + '<li>100% online. Clases pregrabadas disponibles las 24 horas y material descargable, para que avances a tu ritmo.</li>'
  + '<li>Clases de acompañamiento el 2.º y 4.º sábado de cada mes, a las 11 h de Argentina, a cargo de formadores del equipo.</li>'
  + '<li>2 sesiones individuales con un mentor, para adaptar lo aprendido a tu especialidad.</li>'
  + '<li>2 sesiones como consultante, para vivir la terapia desde el otro lado de la camilla.</li>'
  + '<li>Prácticas de prueba para ganar confianza antes de trabajar con tus consultantes.</li>'
  + '<li>Al terminar, una mentoría para vender tu servicio.</li>'
  + '</ul>';

const SALIDAS = [
  { t: 'Aplicar protocolos de Geometría Sagrada en tus terapias', x: 'E integrarlos a la modalidad que ya practicás, sin abandonarla ni empezar de cero.', img: 'trazo-compas' },
  { t: 'Acompañar procesos más profundos y duraderos', x: 'Trabajando con los Sólidos Platónicos, los trazos y los símbolos sagrados en cada sesión.', img: 'octaedros' },
  { t: 'Trabajar desde la coherencia', x: 'Para sostener cada sesión sin cargarte con la energía de tus consultantes.', img: 'vesica-lapiz' },
  { t: 'Armonizar tu consultorio', x: 'Y transformar tu lugar de trabajo en un espacio que acompañe cada terapia.', img: 'trazo-toro' },
  { t: 'Diferenciarte en tu comunidad', x: 'Ofreciendo algo propio, con la certificación del Espacio de Geometría Sagrada.', img: 'equipo-retrato' },
  { t: 'Ofrecer y vender tu servicio', x: 'Con la mentoría final para comunicar y ofrecer tus terapias con Geometría Sagrada.', img: 'pablo-icosaedro' },
];

const MODULOS = [
  { t: 'Trazos: re-conociendo tu campo energético', x: 'De la Vesica Piscis a la Flor de la Vida. Lectura de trazos, los 9 sectores y el significado de los colores.' },
  { t: 'Los Sólidos Platónicos y la Estrella Madre', x: 'El Cubo de Metatrón, los 5 sólidos y su anidación en la Estrella Madre, construidos paso a paso.' },
  { t: 'Trazos de símbolos sagrados', x: 'Los laberintos cretense, de Chartres y Hopi, la Chakana y los 7 chakras, con una meditación guiada.' },
  { t: 'El Vector de Equilibrio', x: 'La construcción del vector con sus 64 tetraedros, el tetraedro elevado y el cubo elevado.' },
  { t: 'Armonización de tu consultorio', x: 'Los elementos, su relación con los Sólidos Platónicos y plantillas para armonizar tu lugar de trabajo.' },
  { t: 'Aplicaciones de terapias con Geometría Sagrada', x: 'Medicina de las Formas: péndulo, sonidos y vibraciones, biogeometrías, terapias con sólidos y limpieza del cuerpo físico.' },
  { t: 'Profundización de terapias con Geometría Sagrada', x: 'El nivel avanzado de la Medicina de las Formas, con práctica de sesión.' },
];

const INCLUYE = [
  'Acceso completo a la plataforma de estudios',
  'Grupo privado de estudiantes',
  'Acceso permanente al Club de Geómetras',
  '3 entrevistas individuales con formadores',
  'Una entrevista final con Monique o Pablo',
  'Soporte por correo, con respuesta en menos de 48 horas hábiles',
  'Clase especial “Geometría Sagrada para potenciar tu emprendimiento”',
  'Newsletter semanal exclusivo e invitaciones a MasterClass',
  'Invitaciones a experiencias exclusivas en congresos',
  'Invitación al seminario “Activando tu Campo de Potencial”',
];

const EXPERIENCIA = 'El <strong>Espacio de Geometría Sagrada</strong> cuenta ya con más de 12 años difundiendo este conocimiento en todo el mundo a través de sus Cursos, Talleres y Seminarios presenciales y online.';
const DUDAS = '<p>Completá el formulario para que podamos enviarte el programa de la Especialización y los medios de pago habilitados en tu país. También podés escribirnos a <strong><a href="mailto:info@espaciodegeometriasagrada.com">info@espaciodegeometriasagrada.com</a>. Te respondemos en menos de 48 hs.</strong></p>';

export default function EspecializacionTerapias(_: { page: PageData }) {
  return (
    <>
      {/* Hero: texto a la izquierda, foto a la derecha (no hay video de presentación) */}
      <section className="wrap grid grid-cols-12 items-center gap-x-6 gap-y-10 pb-[8svh] pt-28 sm:pt-32 lg:min-h-[78svh] lg:pt-36">
        <div className="col-span-12 min-w-0 lg:col-span-6">
          <nav aria-label="Ruta" className="mb-5 text-small text-ink-2"><a href="/formaciones/" className="inline-flex min-h-[44px] items-center underline underline-offset-4">Formaciones</a> <span aria-hidden>/</span></nav>
          <p className="kicker"><span className="rounded-full bg-[#66cc99] px-3 py-1 text-[#094372]">Pilar Medicina de las Formas</span></p>
          <MaskTitle text="Especialización en Terapias" className="display mt-6" style={{ fontSize: 'min(var(--fs-hero), clamp(40px, 4.6vw, 80px))', lineHeight: 0.98 }} />
          <p className="mt-6 max-w-[44ch] text-reading leading-relaxed text-ink-2">Aplicá protocolos de Geometría Sagrada en tus terapias. 100% Online. 9 meses. Certificación.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#programa" className="btn btn-primary mt-8">Ver el programa</a>
            <a href={ENTREVISTA} className="btn btn-ghost mt-8">Solicitá tu entrevista</a>
          </div>
        </div>
        {/* PENDIENTE: video de presentación de la Especialización, si lo hay */}
        <div className="col-span-12 min-w-0 lg:col-span-6">
          <div className="aspect-[4/3] overflow-hidden rounded-[22px]">
            <Img name="monique-taller" alt="Monique Dumoulin en un taller del Espacio" eager sizes="(min-width:1024px) 56vw, 100vw" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Fondo azul con flor de la vida: la clave de la Especialización */}
      <section className="sec-azul relative overflow-hidden py-[var(--section-y)]">
        <FlorFondo />
        <div className="wrap relative grid grid-cols-12 gap-x-6 gap-y-8" data-rv>
          <h2 className="col-span-12 font-display font-medium tracking-[-0.03em] lg:col-span-6" style={h2}>Protocolos de Geometría Sagrada para tus terapias</h2>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:self-end">
            <p className="kicker">Para todas las personas que quieran aprender</p>
            <p className="mt-4 text-reading leading-relaxed text-ink-2">La Especialización en Terapias Complementarias con Geometría Sagrada te enseña a aplicar los protocolos de la Medicina de las Formas e integrarlos a lo que ya hacés, sin dejarlo. Está pensada para médicos, psicólogos, psiquiatras, terapeutas de Reiki, flores de Bach, biodescodificación o péndulo hebreo, y para todas las personas que quieran aprender.</p>
            <p className="mt-4 text-reading leading-relaxed text-ink-2">No se trata de diagnosticar, sino de acompañar al consultante para que encuentre sus propias respuestas.</p>
          </div>
        </div>
      </section>

      {/* La Especialización + botón entrevista; la foto toma el alto del texto */}
      <section className="wrap grid grid-cols-12 gap-x-6 gap-y-10 py-[var(--section-y)]" data-rv>
        <div className="col-span-12 min-w-0 lg:col-span-6">
          <h2 className="font-display font-medium tracking-[-0.03em]" style={h2}>La Especialización</h2>
          <div className="prose-egs mt-6" dangerouslySetInnerHTML={{ __html: LISTA }} />
          <BtnEntrevista />
        </div>
        {/* PENDIENTE: Pablo pasa la foto de la Especialización */}
        <div className="col-span-12 min-w-0 lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] lg:aspect-auto lg:h-full lg:[&_img]:absolute lg:[&_img]:inset-0">
            <Img name="construccion-manos" alt="Manos construyendo un sólido platónico" sizes="(min-width:1024px) 46vw, 100vw" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Con tu certificación podrás: 6 cajas con imagen, 3 y 3 */}
      <section className="bg-[var(--paper-2)] py-[var(--section-y)]">
        <div className="wrap">
          <h2 className="max-w-[24ch] font-display font-medium tracking-[-0.03em]" style={h2} data-rv>Con tu certificación en Terapias con Geometría Sagrada, podrás</h2>
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

      {/* El programa, en azul (el lugar del Dossier en Formación Profesional) */}
      <section id="programa" className="sec-azul relative scroll-mt-24 overflow-hidden py-[var(--section-y)]">
        <div className="wrap grid grid-cols-12 gap-x-6 gap-y-10" data-rv>
          <div className="col-span-12 min-w-0 lg:col-span-4">
            <h2 className="font-display font-medium tracking-[-0.03em]" style={{ fontSize: 'clamp(30px, 3.4vw, 52px)', lineHeight: 1.05 }}>El programa: 7 módulos y un curso final</h2>
            <p className="mt-5 text-reading leading-relaxed text-ink-2">Cada módulo se aprueba con un trabajo práctico que entregás en la plataforma. Al completarlos, recibís tu certificación.</p>
            <BtnEntrevista />
          </div>
          <ol className="col-span-12 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:col-span-8">
            {MODULOS.map((m, i) => (
              <li key={m.t} data-rv className="rv" style={{ ['--d' as string]: `${(i % 2) * 90}ms` }}>
                <p className="mono text-[13px] text-[#66cc99]">Módulo {i + 1}</p>
                <h3 className="mt-1 font-display text-[20px] font-medium leading-tight">{m.t}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{m.x}</p>
              </li>
            ))}
            <li data-rv className="rv">
              <p className="mono text-[13px] text-[#66cc99]">Cierre</p>
              <h3 className="mt-1 font-display text-[20px] font-medium leading-tight">Curso final y mentoría para vender tu servicio</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-ink-2">Integrás todo lo aprendido y salís con un plan para ofrecer tus terapias con Geometría Sagrada.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* También incluye */}
      <section className="wrap grid grid-cols-12 gap-x-6 gap-y-8 py-[var(--section-y)]" data-rv>
        <h2 className="col-span-12 font-display font-medium tracking-[-0.03em] lg:col-span-5" style={h2}>También incluye</h2>
        <ul className="col-span-12 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:col-span-7">
          {INCLUYE.map((x) => (
            <li key={x} className="flex gap-3 text-[17px] leading-relaxed text-ink-2"><span aria-hidden className="mt-[0.55em] h-2 w-2 flex-none rounded-full bg-[#66cc99]" />{x}</li>
          ))}
        </ul>
      </section>

      <SecTestimonios entrevista={ENTREVISTA} />

      {/* El Espacio en números */}
      <Cifras />

      {/* Inscripción: entrevista de admisión */}
      <section id="inscripcion" className="wrap grid scroll-mt-24 grid-cols-12 gap-x-6 gap-y-8 py-[var(--section-y)]" data-rv>
        <div className="col-span-12 lg:col-span-5">
          <h2 className="font-display font-semibold tracking-[-0.03em]" style={h2}>¿Querés anotarte? ¿Conocer los medios de pago disponibles?</h2>
          <p className="mt-5 text-reading text-ink-2">Solicitá tu entrevista de admisión.</p>
        </div>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:self-end">
          <p className="text-reading leading-relaxed text-ink-2">Abrimos la Especialización dos veces al año, con plazas limitadas, para garantizar el acompañamiento personalizado que cada proceso necesita.</p>
          <p className="mt-4 text-reading leading-relaxed text-ink-2">La entrevista no es un filtro para excluir: es una conversación para conocerte, entender desde dónde venís y hacia dónde querés ir, y despejar todas tus dudas antes de empezar.</p>
          <BtnEntrevista texto="Solicitá tu entrevista de admisión" />
        </div>
      </section>

      <SecExperiencia html={EXPERIENCIA} />
      <SecFormadores />
      <SecDudas html={DUDAS} />
    </>
  );
}
