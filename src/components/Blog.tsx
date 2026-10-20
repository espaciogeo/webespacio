import { ArrowRight } from 'lucide-react';
import { blog, links } from '../content';
import type { PostCard } from '../types';
import { MediaImg } from './site/Bits';
import { fruitCenters, metatronLines } from '../lib/geometry';

// Figuras de línea propias (las portadas originales del blog tienen texto incrustado y se descartaron).
export function Figura({ tipo, className }: { tipo: 'metatron' | 'tetraedro' | 'cubo' | 'numeros'; className?: string }) {
  const sw = { vectorEffect: 'non-scaling-stroke' as const };
  const c = fruitCenters();
  const R = 0.6;
  const ring = (idx: number[]) => idx.map((i) => `${c[i].x},${c[i].y}`).join(' ');
  return (
    <svg viewBox="-3.4 -3.4 6.8 6.8" className={className} aria-hidden="true">
      <g fill="none" stroke="var(--pencil)" strokeWidth="1">
        {c.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={R} {...sw} />)}
      </g>
      <g fill="none" stroke="var(--ink)" strokeWidth="1.3" strokeLinejoin="round">
        {tipo === 'metatron' && metatronLines().map(([a, b], i) => <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth="0.9" {...sw} />)}
        {tipo === 'tetraedro' && (<>
          <polygon points={ring([7, 9, 11])} {...sw} />
          <polyline points={`${c[7].x},${c[7].y} 0,0 ${c[9].x},${c[9].y}`} {...sw} />
          <line x1={0} y1={0} x2={c[11].x} y2={c[11].y} {...sw} />
        </>)}
        {tipo === 'cubo' && (<>
          <polygon points={ring([1, 2, 3, 4, 5, 6])} {...sw} />
          <polyline points={`${c[1].x},${c[1].y} 0,0 ${c[3].x},${c[3].y}`} {...sw} />
          <line x1={0} y1={0} x2={c[5].x} y2={c[5].y} {...sw} />
          <polygon points={ring([7, 8, 9, 10, 11, 12])} strokeDasharray="4 5" {...sw} />
        </>)}
        {tipo === 'numeros' && (<>
          <circle cx={0} cy={0} r={0.08} fill="var(--ink)" />
          <line x1={-2.4} y1={0} x2={2.4} y2={0} {...sw} />
          <polygon points={ring([7, 9, 11])} {...sw} />
          <polygon points={ring([8, 10, 12])} {...sw} />
        </>)}
      </g>
    </svg>
  );
}

type Tipo = 'metatron' | 'tetraedro' | 'cubo' | 'numeros';
const FIGS: Tipo[] = ['metatron', 'tetraedro', 'cubo', 'numeros'];
const figFor = (slug: string) => FIGS[[...slug].reduce((a, c) => a + c.charCodeAt(0), 0) % FIGS.length];
const fecha = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });
type Item = { href: string; titulo: string; fecha: string; autor: string; extracto: string; figura: Tipo; image?: PostCard['image'] };

// "Para leer despacio": toma solos los últimos artículos del blog (llegan desde el build). Si no llegan, usa la lista fija de content.ts.
export function Blog({ posts }: { n?: string; posts?: PostCard[] } = {}) {
  const items: Item[] = posts?.length
    ? posts.slice(0, 4).map((p) => ({ href: p.path, titulo: p.title, fecha: fecha(p.date), autor: p.authors.map((a) => a.name).join(' y '), extracto: p.excerpt, figura: figFor(p.slug), image: p.image }))
    : blog.articulos.map((a) => ({ ...a, image: null }));
  const [main, ...rest] = items;
  return (
    <section aria-labelledby="blog-title" className="wrap border-t hairline py-[14svh]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="kicker">{blog.kicker}</p>
          <h2 id="blog-title" className="h-section mt-3">{blog.titulo}</h2>
        </div>
        <a href={links.archivoBlog} className="btn btn-ghost">Ver todos los artículos <ArrowRight size={18} aria-hidden /></a>
      </div>

      <div className="mt-[8svh] grid grid-cols-12 gap-x-4 gap-y-12">
        <a href={main.href} className="group col-span-12 block lg:col-span-7">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[22px] border hairline bg-paper">
            {main.image
              ? <MediaImg m={main.image} sizes="(min-width:1024px) 56vw, 100vw" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              : <Figura tipo={main.figura} className="absolute inset-[8%] transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:rotate-[30deg]" />}
          </div>
          <p className="mono mt-6 text-[14px] text-ink-3">{main.fecha} · {main.autor}</p>
          <h3 className="mt-2 max-w-[22ch] font-bold tracking-[-0.035em] group-hover:underline group-hover:decoration-2 group-hover:underline-offset-8" style={{ fontSize: 'clamp(30px, 3.4vw, 54px)', lineHeight: 1 }}>{main.titulo}</h3>
          <p className="mt-4 max-w-[50ch] text-[18px] leading-relaxed text-ink-2">{main.extracto}</p>
        </a>

        <ol className="col-span-12 lg:col-span-5">
          {rest.map((a) => (
            <li key={a.href} className="border-t hairline first:border-t-0 lg:first:border-t">
              <a href={a.href} className="group grid grid-cols-[88px_1fr] items-start gap-5 py-7 sm:grid-cols-[120px_1fr]">
                <div className="relative aspect-square overflow-hidden rounded-[14px] border hairline bg-paper">
                  {a.image
                    ? <MediaImg m={a.image} sizes="120px" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    : <Figura tipo={a.figura} className="h-full w-full p-2 transition-transform duration-700 group-hover:scale-110" />}
                </div>
                <div>
                  <p className="mono text-[13px] text-ink-3">{a.fecha}</p>
                  <h3 className="mt-1 text-[23px] font-bold leading-tight tracking-[-0.02em] group-hover:underline group-hover:underline-offset-4">{a.titulo}</h3>
                  <p className="mt-1 text-[15px] text-ink-3">{a.autor}</p>
                </div>
              </a>
            </li>
          ))}
          <li className="border-t hairline pt-7">
            <p className="kicker">Por dónde empezar</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {blog.categorias.map((c) => (
                <li key={c.nombre}><a href={c.href} className="inline-flex min-h-[44px] items-center rounded-full px-4 text-[16px] font-medium shadow-[inset_0_0_0_1px_var(--hair)] hover:bg-ink hover:text-paper">{c.nombre}</a></li>
              ))}
            </ul>
          </li>
        </ol>
      </div>
    </section>
  );
}
