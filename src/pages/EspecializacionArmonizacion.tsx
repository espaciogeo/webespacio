// Especialización en Armonización de Espacios (/formaciones/armonizacion-de-espacios/): mismo modelo que
// Formación profesional (pedido de Pablo, 23/10/2026). Muestra solo el camino 2 o el 3 con un selector:
// arquitectos → camino 3, el resto → camino 2. Textos del PDF del programa (formaciones.ts). Sin valores,
// cupos, bonos ni garantía. El camino 1 (compra directa) no se muestra acá.
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { PageData } from '../types';
import { MaskTitle, Video } from '../components/site/Bits';
import { Cifras } from '../components/Cifras';
import { Img } from '../lib/Img';
import { links } from '../content';
import { FlorFondo, h2, SecTestimonios, SecExperiencia, SecFormadores, SecDudas } from './FormacionProfesional';

const ENTREVISTA = links.admision + '?programa=armonizacion#agenda';

function BtnEntrevista({ texto = 'Solicitá tu entrevista' }: { texto?: string }) {
  return <a href={ENTREVISTA} className="btn btn-primary mt-8 inline-flex">{texto} <ArrowRight size={18} aria-hidden /></a>;
}

type Camino = 'especialista' | 'arquitectos';
// Negrita solo en las cifras, como en Formación profesional
const CAMINOS: Record<Camino, { nombre: string; para: string; logro: string; lista: string }> = {
  especialista: {
    nombre: 'Especialización en Armonización de Espacios',
    para: 'Interioristas, decoradores y todas las personas con ganas de ampliar sus conocimientos y sumar la Armonización de Espacios a su actividad, en proyectos propios y de terceros.',
    logro: 'Certificarte como Especialista y salir con un plan y mentoría en grupo para conseguir tus primeros clientes pagos, sin tener que resolver sola o solo cómo venderlo.',
    lista: '<ul>'
      + '<li>Compuesta por <strong>7 módulos</strong> completos.</li>'
      + '<li>Duración total: <strong>9 meses</strong>.</li>'
      + '<li>100% online. Videos pregrabados, cuadernillos y plantillas.</li>'
      + '<li>Clases de acompañamiento el 2.º y 4.º sábado de cada mes, a las 11 h de Argentina, por Zoom.</li>'
      + '<li>3 sesiones 1:1 de refuerzo académico con un Formador o Formadora asignado.</li>'
      + '<li>6 sesiones grupales con Pablo para entender cómo monetizar tu aprendizaje.</li>'
      + '<li>Trabajos prácticos por escrito, con devolución en 5 días hábiles.</li>'
      + '<li>Soporte por correo en 24 horas hábiles y comunidad de estudiantes por WhatsApp.</li>'
      + '<li>Certificación como Especialista en Armonización de Espacios con Geometría Sagrada.</li>'
      + '<li>El libro “Geometría Sagrada” de regalo en tu casa.</li>'
      + '</ul>',
  },
  arquitectos: {
    nombre: 'Especialización en Armonización de Espacios, ideal para arquitectos',
    para: 'Tenés estudio y cartera de clientes. No te falta teoría: te falta un servicio que nadie más ofrece y una forma de venderlo sin devaluar tu marca.',
    logro: 'Sumar un servicio premium a tu estudio, con mentoría 1:1 diseñada para tu negocio, para dejar de competir por precio y subir tu ticket.',
    lista: '<ul>'
      + '<li>Compuesta por <strong>7 módulos</strong> completos y clases especiales.</li>'
      + '<li>Duración total: <strong>9 meses</strong>.</li>'
      + '<li>100% online. Videos pregrabados, cuadernillos y plantillas.</li>'
      + '<li>Clases de acompañamiento el 2.º y 4.º sábado de cada mes, a las 11 h de Argentina, por Zoom.</li>'
      + '<li>8 sesiones 1:1 de refuerzo académico: 6 con un Formador o Formadora y 2 con Monique.</li>'
      + '<li>6 sesiones 1:1 con Pablo para sumar una propuesta de valor aplicada a tu profesión.</li>'
      + '<li>Trabajos prácticos con devolución personalizada en las mentorías 1:1.</li>'
      + '<li>Soporte por correo en 24 horas hábiles y comunidad de estudiantes por WhatsApp.</li>'
      + '<li>Urbanismo, paisajismo y Arquitectura Consciente aplicados a proyectos reales.</li>'
      + '<li>Certificación como Especialista en Armonización de Espacios con Geometría Sagrada.</li>'
      + '<li>El libro “Geometría Sagrada” de regalo en tu casa.</li>'
      + '</ul>',
  },
};

const LOGROS = [
  { t: 'Leer cualquier plano', x: 'Y detectar qué zona está desequilibrada y cómo restablecerla con Geometría Sagrada.', img: 'trazo-compas' },
  { t: 'Construir en tercera dimensión', x: 'Sólidos Platónicos, la Estrella Madre y el Vector de Equilibrio, para activar o neutralizar energéticamente cualquier ambiente.', img: 'construccion-manos' },
  { t: 'Detectar líneas geopatógenas', x: 'Y telúricas con varillas, para encontrar la causa real de lo que la casa no explica.', img: 'vesica-lapiz' },
  { t: 'Aplicar Feng Shui y Arquitectura Consciente', x: 'Para convertir un proyecto propio o de un cliente en un espacio que funciona y se vive distinto.', img: 'trazo-toro' },
];

const MODULOS = [
  { t: 'Fundamentos de Geometría Sagrada', x: 'Los trazos paso a paso, proporción y simbolismo aplicados a planos, y las culturas que los usaron en sus construcciones.' },
  { t: 'Sólidos Platónicos en 2D y 3D', x: 'Su construcción y aplicación práctica en la Armonización de Espacios.' },
  { t: 'Estrella Madre y Vector de Equilibrio', x: 'La construcción de las dos herramientas para activar y equilibrar un espacio.' },
  { t: 'Ambientes geométricos y Geobiología', x: 'Líneas de Hartmann, Curry y fallas geológicas, detectadas con varillas, péndulo y testeo muscular.' },
  { t: 'Vivienda y espacio de trabajo', x: 'La Geometría Sagrada aplicada mediante principios del Feng Shui y la neuroarquitectura.' },
  { t: 'Ambientación energética de espacios', x: 'Del diagnóstico a la intervención.' },
  { t: 'Urbanismo, paisajismo y Arquitectura Consciente', x: 'Aplicados a proyectos reales.' },
];

const EXPERIENCIA = 'El <strong>Espacio de Geometría Sagrada</strong> cuenta ya con más de 12 años enseñando a leer y armonizar espacios, y formó a miles de personas en más de 30 países a través de sus Cursos, Talleres y Seminarios presenciales y online.';
const DUDAS = '<p>Completá el formulario y te ayudamos a elegir el camino que mejor se ajusta a vos, con el programa y los medios de pago habilitados en tu país. También podés escribirnos a <strong><a href="mailto:info@espaciodegeometriasagrada.com">info@espaciodegeometriasagrada.com</a>. Te respondemos en menos de 48 hs.</strong></p>';

export default function EspecializacionArmonizacion(_: { page: PageData }) {
  const [camino, setCamino] = useState<Camino>('especialista');
  const c = CAMINOS[camino];
  const opcion = (id: Camino, texto: string) => (
    <button type="button" role="radio" aria-checked={camino === id} onClick={() => setCamino(id)}
      className={`min-h-[48px] rounded-full px-6 text-[16px] font-medium transition-colors ${camino === id ? 'bg-[#094372] text-white' : 'bg-white text-[#094372] shadow-[inset_0_0_0_1.5px_#094372]'}`}>{texto}</button>
  );

  return (
    <>
      {/* Hero */}
      <section className="wrap grid grid-cols-12 items-center gap-x-6 gap-y-10 pb-[8svh] pt-28 sm:pt-32 lg:min-h-[78svh] lg:pt-36">
        <div className="col-span-12 min-w-0 lg:col-span-6">
          <nav aria-label="Ruta" className="mb-5 text-small text-ink-2"><a href="/formaciones/" className="inline-flex min-h-[44px] items-center underline underline-offset-4">Formaciones</a> <span aria-hidden>/</span></nav>
          <p className="kicker"><span className="rounded-full bg-[#66cc99] px-3 py-1 text-[#094372]">12 años formando Especialistas</span></p>
          <MaskTitle text="Armonización de Espacios" className="display mt-6" style={{ fontSize: 'min(var(--fs-hero), clamp(40px, 4.6vw, 80px))', lineHeight: 0.98 }} />
          <p className="mt-6 max-w-[44ch] text-reading leading-relaxed text-ink-2">Leé, diagnosticá y armonizá espacios con Geometría Sagrada, Feng Shui y Geobiología. 100% Online. 9 meses. Certificación.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#camino" className="btn btn-primary mt-8">Elegí tu camino</a>
            <a href={ENTREVISTA} className="btn btn-ghost mt-8">Solicitá tu entrevista</a>
          </div>
        </div>
        {/* Video de presentación de la Formación (pedido de Pablo, 23/10) */}
        <div className="col-span-12 min-w-0 lg:col-span-6">
          <Video provider="youtube" id="BiBSGnFBoNY" title="Presentación de la Especialización en Armonización de Espacios" />
        </div>
      </section>

      {/* Fondo azul */}
      <section className="sec-azul relative overflow-hidden py-[var(--section-y)]">
        <FlorFondo />
        <div className="wrap relative grid grid-cols-12 gap-x-6 gap-y-8" data-rv>
          <h2 className="col-span-12 font-display font-medium tracking-[-0.03em] lg:col-span-6" style={h2}>Hace más de 12 años enseñamos a leer y armonizar espacios</h2>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:self-end">
            <p className="kicker">Geometría Sagrada, Feng Shui y Geobiología</p>
            <p className="mt-4 text-reading leading-relaxed text-ink-2">Enseñamos a leer y armonizar espacios a partir de la Geometría Sagrada, aplicando conocimientos de Feng Shui y Geobiología. En este tiempo formamos a miles de personas en más de 30 países, muchas de las cuales hoy reinventaron su profesión.</p>
          </div>
        </div>
      </section>

      {/* Selector de camino + La Especialización */}
      <section id="camino" className="wrap scroll-mt-24 py-[var(--section-y)]" data-rv>
        <h2 className="font-display font-medium tracking-[-0.03em]" style={h2}>Elegí tu camino</h2>
        <p className="mt-4 text-reading text-ink-2">¿Sos arquitecto o arquitecta?</p>
        <div role="radiogroup" aria-label="¿Sos arquitecto o arquitecta?" className="mt-4 flex flex-wrap gap-3">
          {opcion('arquitectos', 'Sí, soy arquitecto/a')}
          {opcion('especialista', 'No')}
        </div>
        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-10">
          <div className="col-span-12 min-w-0 lg:col-span-6" aria-live="polite">
            <p className="kicker">Tu camino</p>
            <h3 className="mt-3 font-display text-[clamp(26px,2.6vw,38px)] font-medium leading-tight tracking-[-0.02em]">{c.nombre}</h3>
            <p className="mt-4 text-reading leading-relaxed text-ink-2"><b className="font-semibold text-ink">Para quién es:</b> {c.para}</p>
            <p className="mt-3 text-reading leading-relaxed text-ink-2"><b className="font-semibold text-ink">Qué vas a lograr:</b> {c.logro}</p>
            <div className="prose-egs mt-6" dangerouslySetInnerHTML={{ __html: c.lista }} />
            <p className="mt-4 text-[15px] text-ink-3">Varillas, péndulo y demás materiales de práctica se adquieren por separado.</p>
            <BtnEntrevista texto="Solicitá tu entrevista de admisión" />
          </div>
          {/* PENDIENTE: Pablo pasa la foto de la Especialización */}
          <div className="col-span-12 min-w-0 lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] lg:aspect-auto lg:h-full lg:[&_img]:absolute lg:[&_img]:inset-0">
              <Img name={camino === 'arquitectos' ? 'monique-taller' : 'construccion-manos'} alt={camino === 'arquitectos' ? 'Monique Dumoulin, arquitecta, en un taller' : 'Manos construyendo un sólido platónico'} sizes="(min-width:1024px) 46vw, 100vw" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Al finalizar vas a poder */}
      <section className="bg-[var(--paper-2)] py-[var(--section-y)]">
        <div className="wrap">
          <h2 className="max-w-[24ch] font-display font-medium tracking-[-0.03em]" style={h2} data-rv>Al finalizar, vas a poder</h2>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LOGROS.map((x, i) => (
              <li key={x.t} data-rv className="rv fp-card group overflow-hidden rounded-[22px] bg-paper shadow-[0_20px_44px_-34px_rgb(9_67_114/0.5)]" style={{ ['--d' as string]: `${i * 110}ms` }}>
                <div className="aspect-[16/10] overflow-hidden">
                  <Img name={x.img} alt="" sizes="(min-width:1024px) 24vw, (min-width:640px) 50vw, 100vw" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
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

      {/* El programa, en azul */}
      <section id="programa" className="sec-azul relative scroll-mt-24 overflow-hidden py-[var(--section-y)]">
        <div className="wrap grid grid-cols-12 gap-x-6 gap-y-10" data-rv>
          <div className="col-span-12 min-w-0 lg:col-span-4">
            <h2 className="font-display font-medium tracking-[-0.03em]" style={{ fontSize: 'clamp(30px, 3.4vw, 52px)', lineHeight: 1.05 }}>El programa: 7 módulos</h2>
            <p className="mt-5 text-reading leading-relaxed text-ink-2">{camino === 'arquitectos' ? 'En tu camino se suman clases especiales con el equipo.' : 'Los 7 módulos completos, con trabajos prácticos y devolución.'}</p>
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
            {camino === 'arquitectos' && (
              <li className="rv">
                <p className="mono text-[13px] text-[#66cc99]">Para arquitectos</p>
                <h3 className="mt-1 font-display text-[20px] font-medium leading-tight">Clases especiales y mentoría 1:1</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-ink-2">Clases especiales con el equipo y 6 sesiones 1:1 con Pablo para sumar el servicio a tu estudio.</p>
              </li>
            )}
          </ol>
        </div>
      </section>

      <SecTestimonios entrevista={ENTREVISTA} />

      {/* El Espacio en números */}
      <Cifras />

      {/* Inscripción */}
      <section id="inscripcion" className="wrap grid scroll-mt-24 grid-cols-12 gap-x-6 gap-y-8 py-[var(--section-y)]" data-rv>
        <div className="col-span-12 lg:col-span-5">
          <h2 className="font-display font-semibold tracking-[-0.03em]" style={h2}>¿Querés anotarte? ¿Conocer los medios de pago disponibles?</h2>
          <p className="mt-5 text-reading text-ink-2">Solicitá tu entrevista de admisión.</p>
        </div>
        <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:self-end">
          <p className="text-reading leading-relaxed text-ink-2">El ingreso es personalizado: completás el formulario y tenemos una reunión para conocerte y despejar todas tus dudas antes de empezar.</p>
          <BtnEntrevista texto="Solicitá tu entrevista de admisión" />
        </div>
      </section>

      <SecExperiencia html={EXPERIENCIA} />
      <SecFormadores />
      <SecDudas html={DUDAS} />
    </>
  );
}
