// "Quiénes somos": página propia. Orden pedido por Pablo:
// 0) foto grande del equipo · 1) texto en zigzag sobre azul con sólidos girando · 2) fotos de Monique y Pablo · 3) Nuestro equipo (pendiente) · 4) foto de Formadoras y Formadores del equipo
// 5) Formadores certificados · 6) Propuestas (igual a la home) · 7) YouTube (igual al cierre de la home)
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import type { PageData } from '../types';
import { Img } from '../lib/Img';
import { MediaImg } from '../components/site/Bits';
import { SOLIDS } from '../lib/geometry';
import { Propuestas } from '../components/Propuestas';
import { Cierre } from '../components/Cierre';
import { canalYoutube } from '../content';
import { formadores, codigosPais } from '../content/formadores';

const flag = (pais: string) => (codigosPais[pais] ? `https://flagcdn.com/w40/${codigosPais[pais]}.png` : '');

const personas = [
  { nombre: 'Monique Dumoulin', rol: 'Fundadora y Facilitadora Geómetra', img: 'monique-taller', href: '/quienes-somos/monique-dumolin/' },
  { nombre: 'Pablo Pettinaroli', rol: 'Director Ejecutivo', img: 'pablo-icosaedro', href: '/quienes-somos/pablo-pettinaroli/' },
];

function Formadores() {
  const paises = Object.keys(codigosPais);
  const [pais, setPais] = useState<string | null>(null);
  const lista = useMemo(
    () => (pais ? formadores.filter((f) => f.pais === pais) : []).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')),
    [pais],
  );
  return (
    <section aria-labelledby="formadores-title" className="wrap border-t hairline py-[14svh]">
      <div className="grid grid-cols-12 gap-x-4 gap-y-8">
        <div className="col-span-12 lg:col-span-4">
          <h2 id="formadores-title" className="h-section" style={{ fontSize: 'clamp(27px, calc(6.4vw - 14px), 90px)' }}>Formadores certificados</h2>
          <p className="mt-5 max-w-[34ch] text-[18px] leading-relaxed text-ink-2">{formadores.length} Formadores Geómetras en {paises.length} países. Elegí un país para ver quiénes están cerca tuyo.</p>
        </div>
        <div className="col-span-12 lg:col-span-8">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por país">
            {paises.map((p) => (
              <button key={p} type="button" onClick={() => setPais(pais === p ? null : p)} aria-pressed={pais === p} title={p}
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-full px-3 text-[14px] transition ${pais === p ? 'bg-ink text-paper' : 'shadow-[inset_0_0_0_1px_var(--line-2)] hover:bg-[rgb(var(--c-ink)/0.06)]'}`}>
                <img src={flag(p)} alt="" width={20} height={14} className="h-[14px] w-[20px] rounded-[2px] object-cover" loading="lazy" />
                {p}
              </button>
            ))}
          </div>
          {pais && <ul key={pais} className="fc-abre mt-8">
            {lista.map((f) => (
              <li key={f.nombre} className="grid grid-cols-[2fr_1.5fr_1fr] gap-4 border-b hairline py-3 text-[16px] last:border-b-0">
                <span className="text-ink">{f.nombre}</span>
                <span className="text-ink-2">{f.ciudad || '—'}</span>
                <span className="flex items-center gap-2 text-ink-3">
                  <img src={flag(f.pais)} alt="" width={18} height={13} className="h-[13px] w-[18px] rounded-[2px] object-cover" loading="lazy" />
                  {f.pais}
                </span>
              </li>
            ))}
          </ul>}
        </div>
      </div>
    </section>
  );
}

// Fotos desde la biblioteca de medios de FunnelUp.
const FU = 'https://assets.cdn.filesafe.space/WGytKrOBaLvxQONqxC4s/media/';
const equipoEgs = [
  { nombre: 'Nadia Presberg', rol: 'Ilustración y diseño gráfico', img: FU + '6a3b07b7ae7d47683929aae0.png' },
  { nombre: 'Serena Dradi', rol: 'Secretaría académica', img: FU + '6a3b07ba659bec99fcc3af71.png' },
  { nombre: 'Maite Carrizo', rol: 'Filmación y edición de videos', img: FU + '6a3b07b7967e20d627cda980.png' },
  { nombre: 'Maru Fernandez', rol: 'Asistente de comunicación', img: FU + '6a3b07b7724990971235fec7.png' },
  { nombre: 'Ceci Redivo', rol: 'Coordinación de redes', img: FU + '6a3b079f659bec99fcc3ad1b.png' },
  { nombre: 'Pato Hurden', rol: 'Departamento administrativo', img: FU + '6a3b07baee187be689697a5e.png' },
  { nombre: 'Lucas Palarino', rol: 'Atención general al público', img: FU + '6a3b07b7724990971235fecc.png' },
  { nombre: 'Graciela Castro', rol: 'Admisión de nuevos estudiantes', img: FU + '6a3b07b7724990971235fec2.png' },
];

const lnk = 'text-[#fff] underline underline-offset-4 hover:text-[var(--accent)]';

// Sólido platónico en alambre que gira despacio (se pausa fuera de pantalla y con "reducir movimiento").
export function SolidoGira({ idx, className }: { idx: number; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current!;
    const lines = Array.from(svg.querySelectorAll('line'));
    const { verts, edges } = SOLIDS[idx];
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, vis = false, t = idx * 1.3;
    const draw = () => {
      const a = t * 0.35, b = t * 0.22 + 0.6, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
      const P = verts.map(([x, y, z]) => { const x1 = x * ca + z * sa, z1 = -x * sa + z * ca; const y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb; return [x1, y1, z2]; });
      edges.forEach(([i, j], k) => {
        const l = lines[k]; if (!l) return;
        l.setAttribute('x1', P[i][0].toFixed(3)); l.setAttribute('y1', P[i][1].toFixed(3));
        l.setAttribute('x2', P[j][0].toFixed(3)); l.setAttribute('y2', P[j][1].toFixed(3));
        l.setAttribute('opacity', (0.45 + 0.55 * ((P[i][2] + P[j][2]) / 4 + 0.5)).toFixed(2));
      });
    };
    const loop = (now: number) => { t = now / 1000 + idx * 1.3; draw(); raf = vis ? requestAnimationFrame(loop) : 0; };
    draw();
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !rm && !raf) raf = requestAnimationFrame(loop); });
    io.observe(svg);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [idx]);
  return (
    <svg ref={ref} viewBox="-1.25 -1.25 2.5 2.5" className={className} aria-hidden="true">
      <g fill="none" stroke="var(--accent)" strokeWidth="0.022" strokeLinecap="round">
        {SOLIDS[idx].edges.map((_, k) => <line key={k} />)}
      </g>
    </svg>
  );
}

// Una fila del zigzag: el texto de un lado y un sólido girando del otro.
function Fila({ lado, solido, children }: { lado: 'izq' | 'der'; solido: number; children: React.ReactNode }) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div className={lado === 'der' ? 'lg:order-2' : ''}>{children}</div>
      <div className={`hidden justify-center lg:flex ${lado === 'der' ? 'lg:order-1' : ''}`}>
        <SolidoGira idx={solido} className="h-44 w-44 xl:h-52 xl:w-52" />
      </div>
    </div>
  );
}

export default function QuienesSomos(_props: { page?: PageData }) {
  return (
    <div className="home-white">
      <h1 className="sr-only">Quiénes somos</h1>

      {/* 0 · Foto grande del equipo */}
      <section className="wrap pt-28 lg:pt-32" aria-label="El equipo del Espacio de Geometría Sagrada">
        <div className="aspect-[3/2] overflow-hidden rounded-[28px] lg:aspect-[21/10]">
          <MediaImg m={{ name: '2024-01-grupales-egs', w: 1024, h: 683 }} eager alt="Monique, Pablo y el equipo del Espacio de Geometría Sagrada" sizes="100vw" className="h-full w-full object-cover object-[50%_35%]" />
        </div>
      </section>

      {/* 1 · Texto en zigzag sobre azul, con sólidos girando en los espacios vacíos */}
      <section className="sec-azul relative mt-[10svh] overflow-hidden">
        <div className="wrap py-[14svh]">
          <div className="flex flex-col gap-10 text-[21px] leading-relaxed lg:gap-4 [&_strong]:font-medium [&_strong]:text-[#fff]" style={{ color: 'rgb(214 228 240)' }}>
            <Fila lado="izq" solido={0}>
              <p>El <strong>Espacio de Geometría Sagrada</strong> fue fundado en el año 2014 por <strong>Monique Dumoulin</strong>, con la misión de <strong>compartir y multiplicar</strong> este conocimiento ancestral que es la Geometría Sagrada en todo el mundo, a través de Cursos, Talleres y Seminarios, tanto presenciales como por internet.</p>
            </Fila>
            <Fila lado="der" solido={1}>
              <p><strong>Cada mes brindamos clases online y gratuitas</strong> que son emitidas desde nuestra web para todo el mundo, con el fin de democratizar el conocimiento y que este llegue a quienes resuenen.</p>
            </Fila>
            <Fila lado="izq" solido={2}>
              <p><strong>Más de 10000 personas de todas partes del mundo son parte de nuestra comunidad de estudiantes</strong>, que acceden regularmente a nuestra plataforma de estudios con el fin de aprender cómo aplicar esta maravillosa filosofía en sus vidas.</p>
            </Fila>
            <Fila lado="der" solido={3}>
              <div className="space-y-6">
                <p>En las redes, el Espacio de Geometría Sagrada cuenta con más de 125000 seguidores en <a className={lnk} href="https://www.facebook.com/EspaciodeGeometriaSagrada" target="_blank" rel="noopener">Facebook</a>, más de 75000 en <a className={lnk} href="https://www.instagram.com/espaciodegeometriasagrada/" target="_blank" rel="noopener">Instagram</a> y decenas de miles de vistas en nuestro Canal de <a className={lnk} href={canalYoutube} target="_blank" rel="noopener">YouTube</a>.</p>
                <p><strong>Monique Dumoulin</strong> es Arquitecta egresada de la U.B.A. y Formadora Geómetra. Lleva ya más de 20 años difundiendo este conocimiento. Actualmente este Espacio es dirigido por <strong>Pablo Pettinaroli</strong>, Diseñador Multimedial y autor del podcast “Manual para Sobrevivientes”.</p>
              </div>
            </Fila>
            <div className="flex flex-col items-center pt-10 text-center">
              <SolidoGira idx={4} className="h-24 w-24" />
              <p className="mt-6 max-w-[40ch] font-display text-[clamp(24px,2.4vw,34px)] leading-snug text-[#fff]">Juntos, encabezan un equipo de profesionales interdisciplinario, con pasión por lo que hacen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Monique y Pablo, fotos grandes a la misma altura */}
      <section className="wrap py-[12svh]" aria-label="Monique Dumoulin y Pablo Pettinaroli">
        <div className="mx-auto grid max-w-[760px] gap-6 sm:grid-cols-2">
          {personas.map((p) => (
            <a key={p.nombre} href={p.href} className="group block">
              <div className="aspect-[4/5] overflow-hidden rounded-[22px]">
                <Img name={p.img} alt={p.nombre} eager sizes="(min-width:640px) 380px, 100vw"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <p className="mono mt-5 text-[14px] text-ink-3">{p.rol}</p>
              <h2 className="mt-1 font-display text-[clamp(28px,3vw,44px)] font-semibold leading-none tracking-[-0.03em]">{p.nombre}</h2>
              <span className="link-arrow mt-3 text-[17px]">Ver más <ArrowRight size={18} aria-hidden /></span>
            </a>
          ))}
        </div>
      </section>

      {/* 3 · Nuestro equipo (del bloque "bienvenida" del libro, sin Pablo Spoto ni Küntur Agency) */}
      <section aria-labelledby="equipo-title" className="wrap border-t hairline py-[14svh]">
        <h2 id="equipo-title" className="h-section" style={{ fontSize: 'clamp(31px, calc(6.4vw - 9px), 95px)' }}>Nuestro equipo</h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-8">
          {equipoEgs.map((p, i) => (
            <li key={p.nombre} data-rv className="rv eq-card group" style={{ ['--d' as string]: `${i * 70}ms` }}>
              <div className="aspect-[4/5] overflow-hidden rounded-[16px] bg-[#eee]">
                <img src={p.img} alt={p.nombre} loading="lazy" className="h-full w-full object-cover grayscale transition duration-700 ease-out group-hover:scale-[1.06] group-hover:grayscale-0" />
              </div>
              <p className="mt-3 font-display text-[16px] font-semibold leading-tight text-ink">{p.nombre}</p>
              <p className="mt-1 text-[13px] leading-snug text-ink-2">{p.rol}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 · Formadoras y Formadores del equipo */}
      <section aria-labelledby="formadores-equipo-title" className="wrap border-t hairline py-[14svh]">
        <h2 id="formadores-equipo-title" className="h-section" style={{ fontSize: 'clamp(31px, calc(6.4vw - 9px), 95px)' }}>Formadoras y Formadores del equipo</h2>
        <img src="/img/formadores-equipo.webp" alt="Formadoras y Formadores del equipo: Patricia, Javier, Nancy, Sandra, Silvia, Lili, Marisa, Natividad, Zulay, Zunilda, Marcela, Romina, Silvia, Alodia y Lorena"
          width={1200} height={675} loading="lazy" className="mx-auto mt-10 w-full max-w-[1100px]" />
      </section>

      {/* 5 · Formadores certificados */}
      <Formadores />

      {/* 6 · Propuestas, igual a la home */}
      <Propuestas />

      {/* 7 · YouTube, igual al cierre de la home */}
      <Cierre />
    </div>
  );
}
