import { ArrowUpRight } from 'lucide-react';
import type { CollectionData, CollectionItem } from '../types';
import { MediaImg, PageHero } from '../components/site/Bits';
import type { TrazoTipo } from '../components/site/Trazo';

// Grilla editorial: piezas de distinto peso (xl, l, m, s) en 12 columnas, no tarjetas todas iguales.
const SPAN: Record<NonNullable<CollectionItem['size']>, string> = {
  xl: 'md:col-span-12 lg:col-span-7',
  l: 'md:col-span-6 lg:col-span-5',
  m: 'md:col-span-6 lg:col-span-4',
  s: 'md:col-span-6 lg:col-span-4',
};

function Item({ it, i }: { it: CollectionItem; i: number }) {
  const size = it.size ?? 'm';
  const big = size === 'xl';
  return (
    <a href={it.path} className={`group col-span-12 flex min-w-0 flex-col ${SPAN[size]} ${big ? 'lg:row-span-2' : ''}`} data-rv>
      {it.image && (
        <div className={`overflow-hidden rounded-[22px] bg-[var(--paper-2)] ${big ? 'aspect-[4/3] lg:aspect-[5/4]' : size === 'l' ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
          <MediaImg m={it.image} alt="" sizes={big ? '(min-width:1024px) 56vw, 100vw' : '(min-width:1024px) 34vw, (min-width:768px) 50vw, 100vw'} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
        </div>
      )}
      <div className={`flex flex-1 flex-col ${it.image ? 'pt-5' : 'rounded-[22px] p-6 shadow-[inset_0_0_0_1px_var(--line)]'}`}>
        <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1">
          <b>{String(i + 1).padStart(2, '0')}</b><span>{it.kicker}</span>
          {it.status && <span className="rounded-full bg-[var(--paper-2)] px-2.5 py-0.5 normal-case tracking-normal text-ink-2">{it.status}</span>}
        </p>
        <h3 className={`mt-3 font-display font-bold leading-[1.05] tracking-[-0.03em] text-ink ${big ? 'text-[clamp(30px,3.4vw,52px)]' : 'text-h3'}`}>{it.title}</h3>
        {it.text && <p className="mt-3 max-w-[52ch] text-body leading-relaxed text-ink-2">{it.text}</p>}
        <dl className="mt-5 grid gap-3 border-t hairline pt-4">
          {it.facts.map((f) => (
            <div key={f.label} className="grid grid-cols-1 gap-0.5 min-[480px]:grid-cols-[9.5rem_1fr] min-[480px]:gap-3">
              <dt className="kicker pt-1">{f.label}</dt>
              <dd className="text-body leading-snug text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
        <span className="link-arrow mt-auto pt-5 text-ink">{it.cta}<ArrowUpRight size={20} aria-hidden /></span>
      </div>
    </a>
  );
}

export default function Collection({ data }: { data: CollectionData }) {
  let k = 0;
  return (
    <>
      <PageHero kicker={data.kicker} title={data.title} lede={data.lede} trazo={data.trazo as TrazoTipo} />
      {data.groups.map((g, gi) => (
        <section key={g.title} className="rv border-t hairline py-[var(--section-y)]" data-rv>
          <div className="wrap">
            <div className="grid grid-cols-12 gap-x-4 gap-y-4">
              <p className="kicker col-span-12 lg:col-span-2"><b>{String(gi + 1).padStart(2, '0')}</b></p>
              <div className="col-span-12 lg:col-span-8">
                <h2 className="font-display font-bold tracking-[-0.03em]" style={{ fontSize: 'var(--fs-h2)', lineHeight: 1.02 }}>{g.title}</h2>
                {g.text && <p className="mt-4 max-w-[60ch] text-reading text-ink-2">{g.text}</p>}
              </div>
            </div>
            <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-12">
              {g.items.map((it) => <Item key={it.path} it={it} i={k++} />)}
            </div>
          </div>
        </section>
      ))}
      {data.band && (
        <section className="bg-ink py-[var(--section-y)] text-paper">
          <div className="wrap grid grid-cols-12 gap-x-4 gap-y-6">
            <h2 className="col-span-12 font-display font-bold tracking-[-0.03em] lg:col-span-6" style={{ fontSize: 'var(--fs-h2)', lineHeight: 1.02 }}>{data.band.title}</h2>
            <div className="col-span-12 lg:col-span-5 lg:col-start-8">
              <p className="text-reading text-paper/85">{data.band.text}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {data.band.links.map((l, i) => <a key={l.href} href={l.href} className={`btn ${i === 0 ? 'btn-primary' : 'btn-ghost-light'}`}>{l.text}</a>)}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
