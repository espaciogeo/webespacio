import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { PostCard, TocItem } from '../types';
import { MaskTitle, MediaImg } from '../components/site/Bits';
import { Toc } from '../components/site/Toc';
import { Figura } from '../components/Blog';
import { Trazo } from '../components/site/Trazo';
import { clase, links } from '../content';

const fecha = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });

type Full = PostCard & { html: string; toc: TocItem[]; modified: string; subtitle?: string; aboutBook?: boolean; substackUrl?: string };
const nn = (n?: number) => String(n ?? 0).padStart(2, '0');

export default function Article({ post, related, prev, next }: { post: Full; related: PostCard[]; prev?: PostCard | null; next?: PostCard | null }) {
  const bar = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);

  // Barra de progreso de lectura
  useEffect(() => {
    let raf = 0;
    const draw = () => {
      raf = 0;
      const el = body.current;
      if (!el || !bar.current) return;
      const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (window.innerHeight * 0.4 - r.top) / Math.max(1, r.height - window.innerHeight * 0.4)));
      bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(draw); };
    window.addEventListener('scroll', on, { passive: true });
    draw();
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, []);

  // Videos de YouTube livianos dentro del cuerpo
  useEffect(() => {
    const els = body.current?.querySelectorAll<HTMLElement>('.yt-lite') ?? [];
    const off: (() => void)[] = [];
    els.forEach((el) => {
      const go = () => { el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${el.dataset.yt}?autoplay=1&rel=0" title="Video" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`; };
      el.addEventListener('click', go, { once: true });
      off.push(() => el.removeEventListener('click', go));
    });
    return () => off.forEach((f) => f());
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[55] h-[3px]" aria-hidden="true"><div ref={bar} className="h-full origin-left scale-x-0 bg-[var(--ochre)]" /></div>
      <article>
        <header className="wrap relative grid grid-cols-12 gap-x-4 pb-10 pt-32 lg:pt-40">
          <Trazo tipo={post.kind === 'news' ? 'vesica' : 'semilla'} className="pointer-events-none absolute right-[var(--gutter)] top-28 hidden w-56 opacity-90 lg:block xl:w-64" />
          <div className="col-span-12 lg:col-span-8 lg:col-start-2">
            {post.number != null && <p className="mono mb-3 text-small text-ink"><span className="rounded-full bg-ink px-3 py-1 text-paper">News Geométrico #{nn(post.number)}</span></p>}
            <p className="kicker">
              {post.categories.map((c, i) => <span key={c.slug}>{i > 0 && ' · '}<a href={`/category/${c.slug}/`} className="underline-offset-4 hover:underline">{c.name}</a></span>)}
              {post.categories.length > 0 && ' · '}{post.readingMinutes} min de lectura
            </p>
            <MaskTitle text={post.title} className="display mt-5" style={{ fontSize: 'var(--fs-article)', lineHeight: 1 }} />
            {post.subtitle && <p className="mt-5 max-w-[46ch] text-lead leading-snug text-ink-2">{post.subtitle}</p>}
            <p className="mt-7 text-body text-ink-2">
              Por {post.authors.map((a, i) => <span key={a.slug}>{i > 0 && ' y '}<a href={`/author/${a.slug}/`} className="font-medium text-ink underline underline-offset-4">{a.name}</a></span>)} · <time dateTime={post.date}>{fecha(post.date)}</time>
            </p>
          </div>
        </header>

        <div className="wrap">
          <div className="relative mx-auto aspect-[4/3] sm:aspect-[21/9] overflow-hidden rounded-[24px] border hairline bg-[var(--ux-surface)] lg:w-10/12">
            {post.image ? <MediaImg m={post.image} eager sizes="(min-width:1024px) 80vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
              : <Figura tipo="metatron" className="absolute inset-y-[8%] left-1/2 aspect-square -translate-x-1/2" />}
          </div>
        </div>

        <div className="wrap grid grid-cols-12 gap-x-4 py-14">
          <div ref={body} className="prose-egs prose-article col-span-12 lg:col-span-7 lg:col-start-2" dangerouslySetInnerHTML={{ __html: post.html }} />
          {post.toc.length > 1 && (
            <aside className="col-span-3 col-start-10 hidden lg:block">
              <div className="sticky top-28"><Toc items={post.toc} /></div>
            </aside>
          )}
          <div data-article-end />
        </div>

        {post.kind === 'news' && (
          <div className="wrap grid grid-cols-12 gap-x-4 gap-y-6 pb-14">
            <div className="col-span-12 flex flex-col gap-4 lg:col-span-7 lg:col-start-2">
              {/* CTA Clase Gratuita */}
              <aside className="relative overflow-hidden rounded-[24px] bg-ink p-7 text-paper sm:p-9">
                <Trazo tipo="vesica" className="pointer-events-none absolute -right-10 -top-6 w-56 opacity-30 [&_.tz-ink]:!stroke-paper" />
                <p className="mono text-mono uppercase tracking-[0.08em] text-paper/70">{clase.tag}</p>
                <h2 className="mt-2 font-display text-h3 font-bold leading-tight">{clase.titulo}</h2>
                <p className="mt-3 max-w-[44ch] text-body text-paper/80">{clase.texto}</p>
                <a href={links.claseGratuita} className="btn btn-primary mt-6">Sumate a la clase gratuita</a>
              </aside>
              {post.aboutBook && (
                <aside className="flex flex-col gap-5 rounded-[24px] border hairline bg-[var(--paper-2)] p-7 sm:flex-row sm:items-center sm:p-9">
                  <div className="flex-1">
                    <p className="mono text-mono uppercase tracking-[0.08em] text-ink-3">El libro</p>
                    <h2 className="mt-2 font-display text-h3 font-bold leading-tight">Geometría Sagrada: un camino de re-descubrimiento personal</h2>
                    <p className="mt-3 text-body text-ink-2">12 años de enseñanza condensados en 228 páginas. No necesitás conocimientos previos, ni saber dibujar.</p>
                  </div>
                  <a href={links.libro} className="btn btn-ghost shrink-0">Quiero mi ejemplar</a>
                </aside>
              )}
              <p className="text-body text-ink-2">
                ¿Querés recibir el próximo news en tu correo? <a href={links.blog} className="font-medium text-ink underline decoration-[var(--ochre)] decoration-2 underline-offset-4">Suscribite al newsletter</a>.
              </p>
            </div>
          </div>
        )}

        {(prev || next) && (
          <nav aria-label="News anterior y siguiente" className="wrap grid gap-4 border-t hairline py-10 sm:grid-cols-2">
            {prev ? (
              <a href={prev.path} className="group flex flex-col gap-2 rounded-[20px] p-5 transition-colors hover:bg-[var(--paper-2)]">
                <span className="mono inline-flex items-center gap-2 text-mono text-ink-3"><ArrowLeft size={16} aria-hidden /> Anterior · #{nn(prev.number)}</span>
                <span className="font-display text-h4 font-bold leading-tight">{prev.title}</span>
              </a>
            ) : <span />}
            {next && (
              <a href={next.path} className="group flex flex-col items-end gap-2 rounded-[20px] p-5 text-right transition-colors hover:bg-[var(--paper-2)]">
                <span className="mono inline-flex items-center gap-2 text-mono text-ink-3">Siguiente · #{nn(next.number)} <ArrowRight size={16} aria-hidden /></span>
                <span className="font-display text-h4 font-bold leading-tight">{next.title}</span>
              </a>
            )}
          </nav>
        )}
      </article>

      {related.length > 0 && (
        <section className="wrap border-t hairline py-[10svh]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="h-section" style={{ fontSize: 'var(--fs-h2)' }}>Seguí leyendo.</h2>
            <a href="/blog/" className="link-arrow">Todos los artículos <ArrowRight size={18} aria-hidden /></a>
          </div>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {related.map((p, i) => (
              <li key={p.slug} className={i === 1 ? 'md:mt-16' : ''}>
                <a href={p.path} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] border hairline bg-[var(--ux-surface)]">
                    {p.image ? <MediaImg m={p.image} sizes="(min-width:768px) 30vw, 100vw" className="absolute inset-0 h-full w-full object-cover" /> : <Figura tipo={(['tetraedro', 'cubo', 'numeros'] as const)[i % 3]} className="absolute inset-[10%]" />}
                  </div>
                  <p className="mono mt-4 text-mono text-ink-3">{fecha(p.date)}</p>
                  <h3 className="mt-1 font-display text-h4 font-bold leading-tight group-hover:underline group-hover:underline-offset-4">{p.title}</h3>
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
