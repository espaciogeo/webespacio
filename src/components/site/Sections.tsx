// Reinterpreta las secciones de Elementor con el sistema de diseño de la home:
// grilla de 12 columnas, numeración en mono, medios y texto en composición asimétrica alternada.
import { ArrowUpRight } from 'lucide-react';
import type { Block, MediaRef } from '../../types';
import { Accordion, MediaImg, Video, WpForm } from './Bits';
import { BookBuy, Calculator, Compare, Embed, Plans, Stats, Steps, Table, Tickets } from './Blocks';

type Group =
  | Block
  | { t: 'cards'; items: Extract<Block, { t: 'card' }>[] }
  | { t: 'quotes'; items: Extract<Block, { t: 'testimonial' }>[] }
  | { t: 'buttons'; items: Extract<Block, { t: 'button' }>[] }
  | { t: 'images'; items: MediaRef[] }
  | { t: 'videos'; items: Extract<Block, { t: 'video' }>[] };

function group(blocks: Block[]): Group[] {
  const out: Group[] = [];
  for (const b of blocks) {
    const last = out[out.length - 1] as any;
    if (b.t === 'card') { if (last?.t === 'cards') last.items.push(b); else out.push({ t: 'cards', items: [b] }); }
    else if (b.t === 'testimonial') { if (last?.t === 'quotes') last.items.push(b); else out.push({ t: 'quotes', items: [b] }); }
    else if (b.t === 'button') { if (last?.t === 'buttons') last.items.push(b); else out.push({ t: 'buttons', items: [b] }); }
    else if (b.t === 'image' && !b.href) { if (last?.t === 'images') last.items.push(b.src); else out.push({ t: 'images', items: [b.src] }); }
    else if (b.t === 'video') { if (last?.t === 'videos') last.items.push(b); else if (last?.t === 'video') out[out.length - 1] = { t: 'videos', items: [last, b] }; else out.push(b); }
    else out.push(b);
  }
  return out;
}

const isExternal = (h: string) => /^https?:\/\//.test(h);

function Buttons({ items }: { items: { text: string; href: string }[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((b, i) => (
        <a key={i} href={b.href || '#formulario'} className={`btn ${i === 0 ? 'btn-primary' : 'btn-ghost'}`}>
          {b.text}{isExternal(b.href) && <ArrowUpRight size={18} aria-hidden />}
        </a>
      ))}
    </div>
  );
}

function Images({ items }: { items: MediaRef[] }) {
  if (items.length === 1) {
    const m = items[0];
    const tall = m.h > m.w * 1.15;
    return <div className={`overflow-hidden rounded-[22px] ${tall ? 'mx-auto max-w-[520px]' : ''}`}><MediaImg m={m} className="h-auto w-full" /></div>;
  }
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {items.map((m, i) => (
        <div key={i} className={`overflow-hidden rounded-[18px] ${i === 0 && items.length % 2 === 1 ? 'col-span-2 lg:col-span-1' : ''}`}>
          <MediaImg m={m} sizes="(min-width:1024px) 30vw, 50vw" className="aspect-[4/5] h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

function Piece({ g, dark }: { g: Group; dark?: boolean }) {
  switch (g.t) {
    case 'heading':
      return g.level <= 2
        ? <h2 className="font-display font-bold tracking-[-0.03em]" style={{ fontSize: 'var(--fs-h2)', lineHeight: 1.02 }}>{g.text}</h2>
        : <h3 className="font-display text-h4 font-bold leading-tight tracking-[-0.02em] lg:text-h3">{g.text}</h3>;
    case 'text': return <div className="prose-egs" dangerouslySetInnerHTML={{ __html: g.html }} />;
    case 'buttons': return <Buttons items={g.items} />;
    case 'button': return <Buttons items={[g]} />;
    case 'images': return <Images items={g.items} />;
    case 'image': return g.href ? <a href={g.href} className="block overflow-hidden rounded-[22px]"><MediaImg m={g.src} alt={g.alt} className="h-auto w-full" /></a> : <Images items={[g.src]} />;
    case 'gallery': return <Images items={g.images} />;
    case 'video': return <Video provider={g.provider} id={g.id} />;
    case 'videos': return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{g.items.map((v) => <Video key={v.id} provider={v.provider} id={v.id} />)}</div>;
    case 'embed': return <Embed {...g} />;
    case 'table': return <Table {...g} />;
    case 'stats': return <Stats {...g} />;
    case 'steps': return <Steps {...g} />;
    case 'compare': return <Compare {...g} />;
    case 'plans': return <Plans {...g} />;
    case 'tickets': return <Tickets {...g} />;
    case 'bookbuy': return <BookBuy {...g} />;
    case 'calculator': return <Calculator />;
    case 'map': return <iframe src={g.src} title="Mapa" loading="lazy" className="aspect-[16/10] w-full rounded-[18px] border-0" referrerPolicy="no-referrer-when-downgrade" />;
    case 'form': return <div className={`rounded-[24px] p-6 sm:p-8 ${dark ? 'bg-ink' : 'bg-[var(--paper-2)]'}`}><WpForm {...g} dark={dark} /></div>;
    case 'accordion': return <Accordion items={g.items} />;
    case 'list':
      return (
        <ul className="grid gap-3">
          {g.items.map((x, i) => (
            <li key={i} className="flex gap-4 text-body leading-snug">
              <svg viewBox="0 0 20 20" className="mt-1 h-5 w-5 flex-none" aria-hidden="true"><circle cx="7.5" cy="10" r="5.5" fill="none" stroke="var(--ochre)" strokeWidth="1.6" /><circle cx="12.5" cy="10" r="5.5" fill="none" stroke="var(--ink)" strokeWidth="1.6" /></svg>
              {x.href ? <a href={x.href} className="underline underline-offset-4">{x.text}</a> : <span>{x.text}</span>}
            </li>
          ))}
        </ul>
      );
    case 'cards':
      return (
        <div className={`grid gap-4 sm:grid-cols-2 ${g.items.length >= 3 ? 'xl:grid-cols-3' : ''}`}>
          {g.items.map((c, i) => {
            const inner = (
              <>
                {c.img && <div className="mb-5 overflow-hidden rounded-[14px]"><MediaImg m={c.img} sizes="(min-width:1024px) 30vw, 90vw" className="aspect-[4/3] w-full object-cover" /></div>}
                <p className="mono text-mono text-ink-3">{String(i + 1).padStart(2, '0')}</p>
                {c.title && <h3 className="mt-1 flex items-start justify-between gap-3 font-display text-h4 font-bold leading-tight tracking-[-0.02em]">{c.title}{c.href && <ArrowUpRight size={22} className="mt-0.5 flex-none" aria-hidden />}</h3>}
                {c.html && <div className="prose-egs mt-3 !text-body" dangerouslySetInnerHTML={{ __html: c.html }} />}
              </>
            );
            const cls = `block min-w-0 rounded-[22px] border hairline bg-[var(--ux-surface)] p-6 text-ink ${i % 2 === 1 && g.items.length < 3 ? 'sm:mt-10' : ''}`;
            return c.href ? <a key={i} href={c.href} className={`${cls} transition-colors hover:bg-[var(--paper-2)]`}>{inner}</a> : <article key={i} className={cls}>{inner}</article>;
          })}
        </div>
      );
    case 'quotes':
      return (
        <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
          {g.items.map((q, i) => (
            <figure key={i} className="mb-4 break-inside-avoid rounded-[20px] bg-[var(--paper-2)] p-6">
              <blockquote className="text-body leading-relaxed text-ink-2">“{q.text}”</blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                {q.img ? <span className="h-11 w-11 overflow-hidden rounded-full"><MediaImg m={q.img} sizes="44px" className="h-full w-full object-cover" /></span>
                  : <span className="grid h-11 w-11 place-items-center rounded-full bg-ink font-display text-small font-bold text-paper" aria-hidden="true">{q.name.replace('Ma. ', '').charAt(0)}</span>}
                <span><b className="block text-small">{q.name}</b>{q.role && <small className="mono block text-mono text-ink-3">{q.role}</small>}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      );
    case 'counter': return <p><span className="font-display text-stat font-bold leading-none">{g.value}</span><span className="mono mt-2 block text-small text-ink-3">{g.label}</span></p>;
    case 'price':
      return (
        <dl className="divide-y divide-[var(--hair)] rounded-[20px] border hairline">
          {g.items.map((p, i) => <div key={i} className="flex flex-wrap items-baseline justify-between gap-2 p-5"><dt className="font-display text-reading font-bold">{p.title}<span className="block font-sans text-small font-normal text-ink-3">{p.text}</span></dt><dd className="font-display text-h3 font-bold">{p.price}</dd></div>)}
        </dl>
      );
    default: return null;
  }
}

const MEDIA = new Set(['images', 'image', 'gallery', 'video', 'map']);
const WIDE = new Set(['compare', 'plans', 'tickets', 'table', 'embed', 'bookbuy', 'calculator', 'stats', 'videos', 'cards', 'steps', 'quotes']);

type Sec = { blocks: Block[]; kicker?: string; id?: string; tone?: 'dark' | 'soft' };
export function Sections({ sections, narrow = false }: { sections: Sec[]; narrow?: boolean }) {
  return (
    <>
      {sections.map((s, si) => {
        const groups = group(s.blocks);
        const titleIdx = groups[0]?.t === 'heading' ? 0 : -1;
        const title = titleIdx === 0 ? (groups[0] as Extract<Block, { t: 'heading' }>) : null;
        const rest = groups.slice(titleIdx + 1);
        const media = rest.filter((g) => MEDIA.has(g.t));
        const text = rest.filter((g) => !MEDIA.has(g.t));
        const wide = rest.some((g) => WIDE.has(g.t));
        const split = !narrow && !wide && media.length === 1 && text.length > 0;
        const flip = si % 2 === 1;
        const n = String(si + 1).padStart(2, '0');
        const dark = s.tone === 'dark';
        const tone = dark ? 'bg-ink text-paper [&_.text-ink-2]:text-paper/80 [&_.prose-egs]:text-paper/85 [&_.prose-egs_strong]:text-paper [&_.kicker]:text-paper/70 [&_.kicker_b]:text-paper' : s.tone === 'soft' ? 'bg-[var(--paper-2)]' : '';
        return (
          <section key={si} id={s.id} data-rv className={`rv border-t hairline py-[var(--section-y)] scroll-mt-24 ${tone}`}>
            <div className="wrap grid grid-cols-12 gap-x-4 gap-y-8">
              <p className={`kicker col-span-12 ${wide ? '' : 'lg:col-span-2'}`}><b>{n}</b>{s.kicker && <> · {s.kicker}</>}</p>
              {split ? (
                <>
                  <div className={`col-span-12 flex min-w-0 flex-col gap-6 lg:col-span-5 ${flip ? 'lg:order-3 lg:col-start-8' : ''}`}>
                    {title && <Piece g={title} />}
                    {text.map((g, i) => <Piece key={i} g={g} />)}
                  </div>
                  <div className={`col-span-12 min-w-0 lg:col-span-5 lg:self-center ${flip ? 'lg:order-2 lg:col-start-3' : 'lg:col-start-8'}`}>
                    <Piece g={media[0]} />
                  </div>
                </>
              ) : (
                <div className={`col-span-12 flex min-w-0 flex-col gap-6 ${narrow ? 'lg:col-span-7 lg:col-start-3' : wide ? '' : 'lg:col-span-9'}`}>
                  {title && <Piece g={title} />}
                  {rest.map((g, i) => <Piece key={i} g={g} />)}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
