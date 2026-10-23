import type { PostCard } from '../types';
// "Qué hacemos": página propia con el mismo orden de contenido que la original
// (https://espaciodegeometriasagrada.com/que-hacemos/), dibujada con el lenguaje de la home:
// tipografía grande, trazos geométricos en línea, blanco puro y acentos en verde agua.
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { PageData } from '../types';
import { MaskTitle, WpForm } from '../components/site/Bits';
import { Img } from '../lib/Img';
import { Trazo } from '../components/site/Trazo';
import { Blog } from '../components/Blog';
import { Equipo } from '../components/Equipo';
import { clase, links, redes } from '../content';

const S3 = Math.sqrt(3);
const hex = (r: number) => Array.from({ length: 6 }, (_, k) => [r * Math.cos((k * Math.PI) / 3), r * Math.sin((k * Math.PI) / 3)]);

/* ---------- Trazos propios de la página ---------- */
function Torbellino() {
  // torbellino: círculos que crecen sobre espirales logarítmicas, del átomo (centro) a la galaxia (borde)
  const ARMS = 6, STEPS = 15;
  const arms = Array.from({ length: ARMS }, (_, a) => Array.from({ length: STEPS }, (_, i) => {
    const th = (a * 2 * Math.PI) / ARMS + i * 0.42, rho = 0.1 * Math.pow(1.27, i);
    return { x: rho * Math.cos(th), y: rho * Math.sin(th), r: rho * 0.34, i };
  }));
  const spiral = (a: number) => Array.from({ length: 141 }, (_, k) => { const i = k / 10, th = (a * 2 * Math.PI) / ARMS + i * 0.42, rho = 0.1 * Math.pow(1.27, i); return `${(rho * Math.cos(th)).toFixed(3)},${(rho * Math.sin(th)).toFixed(3)}`; }).join(' ');
  return (
    <svg viewBox="-4.2 -4.2 8.4 8.4" className="h-full w-full overflow-visible" role="img" aria-label="Torbellino: el mismo patrón desde el átomo hasta la galaxia">
      <g className="qh-spin">
        <g fill="none" stroke="var(--pencil)" strokeWidth={0.012}>
          {Array.from({ length: ARMS }, (_, a) => <polyline key={a} points={spiral(a)} />)}
        </g>
        {arms.map((arm, a) => (
          <g key={a} fill="none" stroke="var(--ink)">
            {arm.map((c) => <circle key={c.i} cx={c.x} cy={c.y} r={c.r} strokeWidth={0.008 + c.r * 0.03} opacity={0.35 + (c.i / STEPS) * 0.65} />)}
          </g>
        ))}
        <circle r={0.05} fill="var(--accent)" />
      </g>
      <g fill="var(--accent-ink)" style={{ fontFamily: 'var(--font-mono)' }} fontSize={0.17}>
        <text x={0.16} y={0.42}>átomo</text>
        <text x={2.2} y={-3.25}>galaxia</text>
      </g>
    </svg>
  );
}

function Helice() {
  const pts = (ph: number) => Array.from({ length: 81 }, (_, i) => { const y = i * 0.1 - 4; return `${(Math.sin(y * 1.25 + ph) * 1.1).toFixed(3)},${y.toFixed(2)}`; });
  return (
    <svg viewBox="-2.4 -4.3 5.9 8.6" className="h-full w-full" role="img" aria-label="Doble hélice del ADN">
      <g stroke="var(--pencil)" strokeWidth={0.02}>
        {Array.from({ length: 21 }, (_, i) => { const y = i * 0.4 - 4; return <line key={i} x1={Math.sin(y * 1.25) * 1.1} y1={y} x2={Math.sin(y * 1.25 + Math.PI) * 1.1} y2={y} />; })}
      </g>
      <polyline points={pts(0).join(' ')} fill="none" stroke="var(--ink)" strokeWidth={0.05} strokeLinecap="round" />
      <polyline points={pts(Math.PI).join(' ')} fill="none" stroke="var(--ink)" strokeWidth={0.05} strokeLinecap="round" />
      <g stroke="var(--pencil)" strokeWidth={0.015} fill="none">
        <path d="M1.55 -2.0V0.52" /><path d="M1.45 -2.0H1.65M1.45 0.52H1.65" />
      </g>
      <g fill="var(--accent-ink)" style={{ fontFamily: 'var(--font-mono)' }} fontSize={0.2}>
        <text x={1.72} y={-0.66}>34 : 21</text>
        <text x={1.72} y={-0.36}>≈ φ</text>
      </g>
    </svg>
  );
}

function Glifo({ n }: { n: number }) {
  const ink = { fill: 'none', stroke: 'var(--ink)', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const gd = { fill: 'none', stroke: 'var(--pencil)', strokeWidth: 1 };
  return (
    <svg viewBox="0 0 96 96" className="h-20 w-20" aria-hidden="true">
      {n === 0 && (<>
        {/* Compás: los trazos se hacen con compás */}
        <path {...gd} d="M18 82 A38 38 0 0 1 78 82" strokeDasharray="3 3" />
        <line {...ink} x1={48} y1={6} x2={48} y2={14} />
        <circle {...ink} cx={48} cy={19} r={5} />
        <path {...ink} d="M45 23 L26 82 M51 23 L70 82" />
        <path {...ink} d="M36 52 L60 52" strokeWidth={1.2} />
        <path {...ink} d="M70 82 L73 90" strokeWidth={2.4} />
        <circle cx={26} cy={84} r={2.6} fill="var(--accent)" />
      </>)}
      {n === 1 && (<>
        <circle {...gd} cx={48} cy={50} r={38} />
        <path {...ink} d="M48 14 L80 32 L80 68 L48 86 L16 68 L16 32 Z" />
        <path {...ink} d="M48 14 L48 50 M48 50 L80 68 M48 50 L16 68" strokeWidth={1.2} />
        <path {...gd} d="M48 86 L48 50 M48 50 L80 32 M48 50 L16 32" strokeDasharray="3 3" />
      </>)}
      {n === 2 && (<>
        <rect {...ink} x={10} y={22} width={76} height={47} />
        <path {...ink} d="M57 22 V69 M57 40 H86" strokeWidth={1.2} />
        <path {...gd} d="M57 69 A47 47 0 0 1 10 22" />
        <path stroke="var(--accent)" strokeWidth={1.8} fill="none" d="M10 69 A47 47 0 0 1 57 22 A29 29 0 0 1 86 51" />
      </>)}
      {n === 3 && (<>
        <circle {...gd} cx={48} cy={48} r={40} />
        <path {...ink} d="M48 8 L88 48 L48 88 L8 48 Z" />
        <path {...ink} d="M48 8 L56 56 L48 88 M8 48 L56 56 L88 48" strokeWidth={1.2} />
        <path {...gd} d="M48 8 L40 40 L48 88 M8 48 L40 40 L88 48" strokeDasharray="3 3" />
        <circle cx={56} cy={56} r={2.4} fill="var(--accent)" />
      </>)}
    </svg>
  );
}

/* ---------- Contenido (textos de la página original) ---------- */
const etimologia = [
  { palabra: 'Geo', foto: '/img/qh/geo-brote.png', raiz: 'γῆ · tierra', texto: 'Tierra, de la tierra conocido por los griegos donde ésta desarrolla lo que está en ella.' },
  { palabra: 'Metría', foto: '/img/qh/metria-escuadra.png', raiz: 'μέτρον · medida', texto: 'Medida, pero en todo lo que nos rodea, en la naturaleza y en el cosmos observamos que si bien es medible obedece a proporciones, patrones, sistemas, códigos y símbolos que surgen como fuente de vida de la materia y del espíritu.' },
  { palabra: 'Sagrada', foto: null, raiz: 'sacrum · lo sagrado', texto: 'Lo Sagrado es una noción que, permite a un grupo o una sociedad humana creer en una separación binaria, es lo opuesto a lo profano, es el respeto a la vida. La espiritualidad es el respeto de lo esencial: amar la vida. Lo Sagrado está asociado a lo sustentable. Un proceso sustentable o sostenible es aquel que puede mantenerse en el tiempo por sí mismo, sin ayuda exterior y sin que se produzca la escasez de los recursos existentes.' },
];

const pilaresQH = [
  { titulo: 'Trazos de Geometría Sagrada', texto: 'Los trazos de Geometría Sagrada te permiten hacer consciente lo que está en tu inconsciente. A través de los trazos comprenderás el lenguaje de la vida y su importancia en todo lo que existe. Cuando te pones en contacto con los códigos Sagrados y los trazas, estos relajan la mente, te hacen más consciente, re-ordenan tu estructura interna y trabajan sobre tu campo emocional. Re-cordando quien eres.' },
  { titulo: 'Construcciones de Bio-Geometrías', texto: 'A medida que construyes Herramientas de la Geometría Sagrada te equilibras y armonizas tu Geometría interna. Luego estas herramientas las puedes aplicar en tu vida diaria, para armonizar tu espacio, dándole mayor sustentabilidad y mayor vitalidad, para utilizar en la consulta y en Medicina de la forma.' },
  { titulo: 'Armonización de Espacios Físicos', texto: 'Hace milenios se creaban espacios basándose en los principios de la Geometría Sagrada, vivíamos en armonía y equilibrio con la naturaleza, la observación de la misma y su interacción con el ser humano. Te proponemos volver a la conciencia de esa relación con tu entorno, tu espacio diario, Re-creando vida y sustentabilidad en los espacios.' },
  { titulo: 'Medicina de las Formas', texto: 'Medicina de la Forma es la práctica nacida del pasaje de lo Instintivo a lo Cuántico llevada a formas de 2D y 3D para su aplicación. Es un Camino hacia lo Sagrado, al Campo Fractal, Geometría Perfecta que reordena nuestra Geometría desajustada y define a la Vida en distribución eficiente e irradiación de energía.' },
];

const propuestasQH = [
  { titulo: 'Clases gratuitas', img: 'monique-taller', texto: 'Un sábado al mes, nos encontramos en vivo y en directo desde nuestra web para compartir y multiplicar este conocimiento con todo el mundo. ¡Registrate y sumate a nuestras clases!', href: links.claseGratuita },
  { titulo: 'Nuestros eBooks', img: 'trazo-compas-2', texto: '¿Quieres comenzar a aprender Geometría Sagrada? Nuestros eBooks son ideales entonces. Aprenderás los principios básicos y tus primeros trazos… ¡y además tendrás regalos sorpresa!', href: links.ebook },
  { titulo: 'Nuestros cursos', img: 'trazo-toro', texto: 'La Geometría Sagrada se aplica en 4 pilares: Trazos, Construcciones, Armonización de Espacios y Medicina de las Formas. Hay un curso para cada opción. ¡Conoce nuestras propuestas!', href: links.cursos },
  { titulo: 'Formación profesional', img: 'taller-alumnas', texto: 'Más de 2000 estudiantes en todo el mundo están aprendiendo de manera profesional este conocimiento ancestral, y todo desde sus casas. ¡Hace click para conocer más!', href: links.formacionInfo },
];

type FormBlock = { t: 'form'; name: string; fields: any[]; submit: string; formId: string; postId: string; redirect?: string };

export default function QueHacemos({ page, latest }: { page: PageData; latest?: PostCard[] }) {
  const form = page.sections.flatMap((s) => s.blocks).find((b) => b.t === 'form') as FormBlock | undefined;
  const k = (_n: string, t: string) => <p className="kicker">{t}</p>;

  return (
    <>
      {/* 1 · ¿Qué es la Geometría Sagrada? */}
      <section aria-labelledby="qh-title" className="wrap relative pb-[10svh] pt-32 lg:pt-40">
        <div className="grid grid-cols-12 items-center gap-x-4 gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            <p className="kicker">Qué hacemos</p>
            <MaskTitle text="¿Qué es la Geometría Sagrada?" className="display mt-5" style={{ fontSize: 'clamp(46px, 6.6vw, 112px)' }} />
            <p className="mt-8 max-w-[34ch] font-display text-[clamp(22px,2vw,30px)] leading-snug text-ink">
              En el Espacio enseñamos Geometría Sagrada para que la apliques en tu vida: trazamos, construimos los sólidos, armonizamos espacios y usamos las formas como medicina.
            </p>
            <p className="mt-6 max-w-[52ch] text-body text-ink-2">
              La Geometría Sagrada es el lenguaje del universo, codificado en símbolos y patrones, donde <span className="text-ink">la medida es profana</span> y <span className="font-medium text-accent-ink">la Proporción es Sagrada</span>.
            </p>
          </div>
          <div className="col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-5 lg:col-start-8">
            <Trazo tipo="semilla" className="w-full" />
          </div>
        </div>
      </section>

      {/* 2 · Descubramos juntos qué significa */}
      <section aria-labelledby="qh-etim" data-rv className="rv wrap border-t hairline py-[12svh]">
        {k('01', 'La palabra')}
        <h2 id="qh-etim" className="h-section mt-3 max-w-[18ch]" style={{ fontSize: 'var(--fs-h2)' }}>Descubramos juntos qué significa la Geometría Sagrada</h2>
        <div className="mt-14 grid gap-x-10 gap-y-12 lg:grid-cols-3">
          {etimologia.map((e, i) => (
            <article key={e.palabra} className="relative">
              <div className="flex items-end gap-4">
                <span className="grid h-[clamp(56px,6vw,96px)] w-[clamp(70px,7.4vw,118px)] flex-none place-items-end">
                  {e.foto ? <img src={e.foto} alt="" className="max-h-full max-w-full object-contain" loading="lazy" />
                    : <Img name="vesica-lapiz" alt="" sizes="120px" className="h-full w-full rounded-[12px] object-cover" />}
                </span>
                <span className="font-display font-semibold leading-none tracking-[-0.04em] text-ink" style={{ fontSize: 'clamp(56px, 6.4vw, 108px)' }}>{e.palabra}</span>
                {i < 2 && <span className="font-display text-[clamp(32px,3vw,48px)] text-accent" aria-hidden="true">+</span>}
              </div>
              <p className="mono mt-3 text-[14px] text-accent-ink">{e.raiz}</p>
              <p className="mt-5 max-w-[48ch] text-body leading-relaxed text-ink-2">{e.texto}</p>
            </article>
          ))}
        </div>
        <blockquote className="mx-auto mt-[12svh] max-w-[30ch] text-center font-display font-normal leading-[1.18] tracking-[-0.02em] text-ink" style={{ fontSize: 'clamp(28px, 3.4vw, 54px)' }}>
          La Geometría Sagrada es el estudio de las medidas y proporciones de la materia y la energía en relación con el principio de <span className="font-semibold text-accent-ink">sustentabilidad</span> que crea la <span className="font-semibold">Vida</span>.
        </blockquote>
      </section>

      {/* 3 · Un mismo patrón, del átomo a la galaxia */}
      <section aria-labelledby="qh-patron" data-rv className="rv wrap py-[12svh]">
        <div className="grid grid-cols-12 items-center gap-x-4 gap-y-10">
          <div className="col-span-12 aspect-square sm:col-span-8 sm:col-start-3 lg:col-span-5 lg:col-start-1">
            <Torbellino />
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            {k('02', 'Un mismo patrón')}
            <h2 id="qh-patron" className="mt-4 font-display text-[clamp(26px,2.6vw,40px)] font-semibold leading-tight tracking-[-0.02em]">
              Desde un simple átomo hasta una inmensa galaxia
            </h2>
            <p className="mt-6 max-w-[54ch] text-body leading-relaxed text-ink-2">Redescubrirla nos permite observar una planificación, desarrollo y mantenimiento en base a patrones, un lenguaje simbólico de las fuerzas de la creación del universo que nos ayuda a entender mentalmente lo que ya intuitivamente conocemos.</p>
            <p className="mt-5 max-w-[54ch] text-body leading-relaxed text-ink-2">Todo en el universo proviene de una misma fuente o Inteligencia Universal, podrás llamarlo, Madre Naturaleza, Espíritu. La Geometría Sagrada nos demuestra, como todo lo que existe fue creado por medio de los mismos principios básicos, como desde un simple átomo hasta una inmensa galaxia siguen un mismo patrón Geométrico idéntico.</p>
          </div>
        </div>
      </section>

      {/* 4 · Clase gratuita */}
      {form && (
        <section aria-labelledby="qh-clase" data-rv className="rv wrap pb-[12svh]">
          <div className="relative overflow-hidden rounded-[28px] bg-ink p-7 text-paper sm:p-10 lg:p-14">
            <svg className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] opacity-[0.14]" viewBox="-3.2 -3.2 6.4 6.4" aria-hidden="true">
              <g fill="none" stroke="var(--paper)" strokeWidth={0.012}><circle r={1} />{hex(1).map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1} />)}{hex(S3).map(([x, y], i) => <circle key={`b${i}`} cx={x * Math.cos(Math.PI / 6) - y * Math.sin(Math.PI / 6)} cy={x * Math.sin(Math.PI / 6) + y * Math.cos(Math.PI / 6)} r={1} />)}<circle r={3} /></g>
            </svg>
            <div className="relative grid grid-cols-12 gap-x-6 gap-y-8">
              <div className="col-span-12 lg:col-span-5">
                <p className="kicker !text-paper/60">{clase.tag}</p>
                <h2 id="qh-clase" className="mt-4 font-display text-[clamp(32px,3.6vw,56px)] font-semibold leading-[1.02] tracking-[-0.03em]">{clase.titulo}</h2>
                <p className="mt-5 max-w-[40ch] text-body text-paper/75">{clase.texto}</p>
              </div>
              <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:self-end">
                <WpForm name={form.name} fields={form.fields} submit={form.submit} formId={form.formId} postId={form.postId} redirect={form.redirect} dark />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5 · Observá: tu ADN es Geometría Sagrada */}
      <section aria-labelledby="qh-adn" data-rv className="rv wrap border-t hairline py-[12svh]">
        <div className="grid grid-cols-12 items-center gap-x-4 gap-y-10">
          <div className="col-span-12 lg:col-span-7">
            {k('03', 'Observá')}
            <p id="qh-adn" className="mt-5 max-w-[40ch] font-display text-[clamp(22px,2.2vw,32px)] leading-snug text-ink">
              Tú puedes aplicar la observación y verás que tu ADN es Geometría Sagrada, forma y proporción.
            </p>
            <p className="mt-6 max-w-[56ch] text-body leading-relaxed text-ink-2">Los espacios verdes te hablan en secuencias binarias y fibonacci en un orden poco común y mágico. Todas las formas de la vida como lo sabemos emergen de códigos geométricos. El recordarlo te transforma, recuerdas que eres proporción y que eres parte de una maravillosa creación, la cual se organiza a sí misma. El alma se nutre de la información.</p>
          </div>
          <div className="col-span-6 col-start-4 h-[min(60svh,520px)] lg:col-span-3 lg:col-start-10">
            <Helice />
          </div>
        </div>

        <div className="mt-[12svh] grid gap-10 lg:grid-cols-2">
          <h3 className="font-display text-[clamp(28px,3vw,48px)] font-normal leading-[1.12] tracking-[-0.02em] text-ink">En el arte y la música, en los diseños arquitectónicos, encontrarás estos patrones de organización</h3>
          <h3 className="font-display text-[clamp(28px,3vw,48px)] font-semibold leading-[1.12] tracking-[-0.02em] text-accent-ink">Recordarlos es parte de tu evolución consciente. ¡Te estás re-descubriendo!</h3>
        </div>

        <div className="mt-[8svh] grid grid-cols-12 gap-x-4 gap-y-8">
          <div className="col-span-12 lg:col-span-6">
            <p className="max-w-[56ch] text-body leading-relaxed text-ink-2">Siendo testigo consciente comprenderás que las leyes matemáticas no son meras ecuaciones humanas, existen independientemente del intelecto. Lo que un hombre puede hacer es descubrir que están allí y tomar consciencia de ello.</p>
            <p className="mt-5 max-w-[56ch] text-body leading-relaxed text-ink-2">Los patrones Geométricos Sagrados de la creación se están volviendo a descubrir, es menester que lo hagamos en un contexto de comprensión espiritual.</p>
          </div>
          <blockquote className="col-span-12 border-l-2 border-accent pl-6 font-display text-[clamp(21px,1.8vw,27px)] leading-snug text-ink lg:col-span-5 lg:col-start-8">
            A través de la Geometría Sagrada podemos descubrir el equilibrio y la armonía existente en todos los aspectos de la vida y de nuestras relaciones.
          </blockquote>
        </div>
      </section>

      {/* 6 · Los 4 pilares */}
      <section aria-labelledby="qh-pilares" data-rv className="rv wrap border-t hairline py-[12svh]">
        {k('04', 'Los 4 pilares')}
        <h2 id="qh-pilares" className="h-section mt-3" style={{ fontSize: 'var(--fs-h2)' }}>Te proponemos descubrir y comprender la Geometría Sagrada basándonos en 4 pilares, independientes y complementarios</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {pilaresQH.map((p, i) => (
            <article key={p.titulo} className="flex flex-col rounded-[22px] p-7 shadow-[inset_0_0_0_1px_var(--line-2)] lg:p-9">
              <div className="flex items-start justify-between gap-6">
                <Glifo n={i} />
                <span className="mono text-[13px] text-ink-3">0{i + 1} / 04</span>
              </div>
              <h3 className="mt-6 font-display text-[clamp(23px,2vw,30px)] font-semibold leading-tight tracking-[-0.02em]">{p.titulo}</h3>
              <p className="mt-4 text-body leading-relaxed text-ink-2">{p.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 7 · Propuestas, según el grado de interés */}
      <section aria-labelledby="qh-prop" data-rv className="rv wrap border-t hairline py-[12svh]">
        <div className="grid grid-cols-12 gap-x-4 gap-y-6">
          <div className="col-span-12 lg:col-span-5">
            {k('05', 'Propuestas')}
            <h2 id="qh-prop" className="h-section mt-3" style={{ fontSize: 'var(--fs-h2)' }}>Estas son nuestras propuestas</h2>
          </div>
          <p className="col-span-12 max-w-[46ch] text-lead text-ink-2 lg:col-span-6 lg:col-start-7 lg:self-end">Estos pilares puedes aprenderlos a través de diferentes modalidades, según el grado de interés que tengas en la involucración de los mismos.</p>
        </div>
        <div className="-mx-[var(--gutter)] mt-12 overflow-x-auto px-[var(--gutter)] [scrollbar-width:none]">
          <ol className="grid min-w-[1040px] grid-cols-4 border-y hairline">
            {propuestasQH.map((p, i) => (
              <li key={p.titulo} className={`flex flex-col px-5 py-7 lg:px-7 ${i > 0 ? 'border-l hairline' : ''}`}>
                <a href={p.href} className="group flex h-full flex-col">
                  <div className="aspect-[4/5] overflow-hidden rounded-[18px]">
                    <Img name={p.img} alt="" sizes="(min-width:1024px) 22vw, 260px" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="mono text-[13px] text-ink-3">0{i + 1}</span>
                    <span className="flex gap-1.5" aria-label={`Nivel de involucración ${i + 1} de 4`}>
                      {[0, 1, 2, 3].map((d) => <i key={d} className={`block h-2.5 w-2.5 rounded-full ${d <= i ? 'bg-accent' : 'bg-transparent shadow-[inset_0_0_0_1.5px_var(--line-2)]'}`} />)}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-[clamp(22px,1.8vw,28px)] font-semibold leading-tight tracking-[-0.02em]">{p.titulo}</h3>
                  <p className="mt-3 flex-1 text-[17px] leading-relaxed text-ink-2">{p.texto}</p>
                  <span className="link-arrow mt-5 self-start">Ver más <ArrowRight size={18} aria-hidden /></span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8 · Redes */}
      <section aria-labelledby="qh-redes" className="bg-ink py-[12svh] text-paper">
        <div className="wrap grid grid-cols-12 items-center gap-x-4 gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <p className="kicker !text-paper/60"><b className="!text-paper">06</b> · Redes</p>
            <h2 id="qh-redes" className="mt-4 font-display text-[clamp(28px,3vw,48px)] font-semibold leading-[1.08] tracking-[-0.02em]">Somos una comunidad de buscadores con más de 100.000 personas en las redes</h2>
            <p className="mt-5 max-w-[42ch] text-body text-paper/75">Estamos compartiendo y multiplicando este conocimiento. Seguinos y sumate.</p>
            <ul className="mt-8 flex flex-wrap gap-3">
              {redes.map((r) => (
                <li key={r.label}><a href={r.href} target="_blank" rel="noopener" className="btn btn-ghost-light">{r.label} <ArrowUpRight size={16} aria-hidden /></a></li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-6 lg:col-start-7">
            {['taller-grupo', 'octaedros', 'construccion-manos', 'pablo-icosaedro'].map((n, i) => (
              <div key={n} className={`overflow-hidden rounded-[18px] ${i % 2 ? 'mt-8 aspect-[4/5]' : 'aspect-[4/5]'}`}>
                <Img name={n} alt="" sizes="(min-width:1024px) 24vw, 45vw" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 · Últimos artículos · 10 · Equipo */}
      <Blog posts={latest} />
      <Equipo />
    </>
  );
}
