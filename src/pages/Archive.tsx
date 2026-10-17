import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { PostCard, RouteData } from '../types';
import { MaskTitle, MediaImg } from '../components/site/Bits';
import { ChipBar } from '../components/site/ChipBar';
import { Figura } from '../components/Blog';
import { Trazo, trazoFor } from '../components/site/Trazo';
import { links } from '../content';

type Data = Extract<RouteData, { type: 'archive' }>;
const FIG = ['metatron', 'tetraedro', 'cubo', 'numeros'] as const;
const fig = (s: string) => FIG[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % FIG.length];
const fecha = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' });

function Thumb({ p, className, sizes }: { p: PostCard; className: string; sizes: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[20px] border hairline bg-[var(--ux-surface)] ${className}`}>
      {p.number != null && <span className="mono absolute left-4 top-4 z-[1] rounded-full bg-paper/95 px-3 py-1 text-mono text-ink">News #{String(p.number).padStart(2, '0')}</span>}
      {p.image ? <MediaImg m={p.image} sizes={sizes} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        : <Figura tipo={fig(p.slug)} className="absolute inset-[10%] transition-transform duration-1000 group-hover:rotate-[20deg]" />}
    </div>
  );
}
export const authorNames = (p: PostCard) => p.authors.map((a) => a.name).join(' y ');
function Meta({ p }: { p: PostCard }) {
  return (
    <p className="mono text-mono text-ink-3">
      {p.number != null && <span className="mr-2 inline-block rounded-full bg-ink px-2 py-0.5 text-paper">#{String(p.number).padStart(2, '0')}</span>}
      {fecha(p.date)} · {authorNames(p)}{p.categories[0] && ` · ${p.categories[0].name}`}
    </p>
  );
}

// Archivo del blog, categorías y autores: composición editorial asimétrica, no grilla de iguales.
export default function Archive({ data }: { data: Data }) {
  const [lead, ...rest] = data.posts;
  const chips = [{ key: 'todos', href: '/blog/', label: 'Todos' }, ...data.categories.map((c) => ({ key: c.slug, href: `/category/${c.slug}/`, label: c.name, count: c.count }))];
  const pageHref = (n: number) => (n === 1 ? data.basePath : `${data.basePath}page/${n}/`);
  return (
    <>
      <section className="wrap grid grid-cols-12 items-end gap-x-4 gap-y-6 pb-10 pt-32 lg:pt-40">
        <div className="col-span-12 lg:col-span-8">
          <p className="kicker">{data.kicker}{data.page > 1 && ` · página ${data.page} de ${data.pages}`}</p>
          <MaskTitle text={data.title} className="display mt-4" style={{ fontSize: 'var(--fs-hero)', lineHeight: 0.95 }} />
          <p className="mt-6 max-w-[54ch] text-reading text-ink-2">{data.description}</p>
        </div>
        <div className="col-span-12 flex flex-col items-start gap-6 lg:col-span-3 lg:col-start-10 lg:items-end">
          <Trazo tipo={trazoFor(data.basePath)} className="hidden w-48 lg:block" />
          <a href={links.blog} className="btn btn-ghost">Suscribite al newsletter <ArrowUpRight size={18} aria-hidden /></a>
        </div>
      </section>

      {!data.author && <ChipBar items={chips} active={data.active ?? 'todos'} />}

      <section className="wrap py-12">
        {lead && (
          <a href={lead.path} className="group grid grid-cols-12 gap-x-4 gap-y-6">
            <Thumb p={lead} className="col-span-12 aspect-[16/10] lg:col-span-7" sizes="(min-width:1024px) 56vw, 100vw" />
            <div className="col-span-12 flex flex-col justify-end lg:col-span-5">
              <Meta p={lead} />
              <h2 className="mt-3 font-display font-bold tracking-[-0.03em] group-hover:underline group-hover:decoration-2 group-hover:underline-offset-8" style={{ fontSize: 'var(--fs-h2)', lineHeight: 1.02 }}>{lead.title}</h2>
              <p className="mt-4 text-body leading-relaxed text-ink-2">{lead.excerpt}</p>
              <span className="link-arrow mt-4">Leer artículo <ArrowRight size={18} aria-hidden /></span>
            </div>
          </a>
        )}

        <ol className="mt-16 grid grid-cols-12 gap-x-4 gap-y-14">
          {rest.map((p, i) => {
            const wide = i % 5 === 0;
            return (
              <li key={p.slug} data-rv className={'rv ' + (wide ? 'col-span-12 lg:col-span-6' : `col-span-12 sm:col-span-6 lg:col-span-3 ${i % 5 === 2 ? 'lg:mt-24' : ''}`)}>
                <a href={p.path} className="group block">
                  <Thumb p={p} className={wide ? 'aspect-[16/10]' : 'aspect-[4/5]'} sizes={wide ? '(min-width:1024px) 46vw, 100vw' : '(min-width:1024px) 23vw, 50vw'} />
                  <div className="mt-4"><Meta p={p} /></div>
                  <h3 className={`mt-2 font-display font-bold leading-tight tracking-[-0.02em] group-hover:underline group-hover:underline-offset-4 ${wide ? 'text-h3' : 'text-lead'}`}>{p.title}</h3>
                  {wide && <p className="mt-2 text-body text-ink-2">{p.excerpt}</p>}
                </a>
              </li>
            );
          })}
        </ol>

        {data.pages > 1 && (
          <nav aria-label="Paginación" className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t hairline pt-8">
            {data.page > 1 ? <a href={pageHref(data.page - 1)} className="btn btn-ghost"><ArrowLeft size={18} aria-hidden /> Anteriores</a> : <span />}
            <ol className="flex gap-2">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
                <li key={n}><a href={pageHref(n)} aria-current={n === data.page ? 'page' : undefined} className={`grid h-12 w-12 place-items-center rounded-full font-display font-bold ${n === data.page ? 'bg-ink text-paper' : 'shadow-[inset_0_0_0_1px_var(--hair)]'}`}>{n}</a></li>
              ))}
            </ol>
            {data.page < data.pages ? <a href={pageHref(data.page + 1)} className="btn btn-ghost">Siguientes <ArrowRight size={18} aria-hidden /></a> : <span />}
          </nav>
        )}
      </section>
    </>
  );
}
