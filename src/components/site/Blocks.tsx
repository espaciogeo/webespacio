// Bloques de las páginas de formaciones, eventos, libro y eBooks. Todo responde sin scroll horizontal:
// las tablas pasan a tarjetas en móvil y nada depende del hover.
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Check, Minus } from 'lucide-react';
import type { Block } from '../../types';
import { MediaImg } from './Bits';

type B<T extends Block['t']> = Extract<Block, { t: T }>;
const ext = (h: string) => /^https?:\/\//.test(h);
const linkProps = (h: string) => (ext(h) ? { target: '_blank', rel: 'noopener' } : {});

export function Cta({ text, href, ghost = false, full = false }: { text: string; href: string; ghost?: boolean; full?: boolean }) {
  return (
    <a href={href} {...linkProps(href)} className={`btn ${ghost ? 'btn-ghost' : 'btn-primary'} ${full ? 'w-full' : ''}`}>
      {text}{ext(href) && <ArrowUpRight size={18} aria-hidden />}
    </a>
  );
}

/* Selector segmentado accesible (radiogroup), usado por la comparativa, los planes y el libro */
export function Segmented({ options, value, onChange, label }: { options: { id: string; label: string }[]; value: string; onChange: (id: string) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="seg">
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} onClick={() => onChange(o.id)} className="seg-btn">{o.label}</button>
      ))}
    </div>
  );
}

/* ---------- Embed (formularios, encuestas y calendarios de GoHighLevel, playlists) ---------- */
export function Embed({ src, title, height, options }: B<'embed'>) {
  const [sel, setSel] = useState(options?.[0]?.id ?? '');
  useEffect(() => {
    if (!options) return;
    const q = new URLSearchParams(location.search).get('programa');
    const hit = options.find((o) => o.id === q || (q === 'terapias' && o.id === 'formacion'));
    if (hit) setSel(hit.id);
  }, [options]);
  const cur = options?.find((o) => o.id === sel);
  const url = cur?.src ?? src;
  return (
    <div className="grid gap-5">
      {options && <Segmented label="Programa" options={options.map((o) => ({ id: o.id, label: o.label }))} value={sel} onChange={setSel} />}
      {cur?.note && <p className="max-w-[62ch] text-body text-ink-2">{cur.note}</p>}
      <div className="embed-box" style={height ? { ['--h' as string]: `${height}px` } : undefined} data-ratio={height ? undefined : 'video'}>
        <iframe key={url} src={url} title={title} loading="lazy" allow="payment; fullscreen" />
      </div>
      <p className="text-small text-ink-3">¿No ves el formulario? <a href={url} {...linkProps(url)} className="underline underline-offset-4">Abrilo en una pestaña nueva</a>.</p>
    </div>
  );
}

/* ---------- Tabla: filas en desktop, tarjetas en móvil ---------- */
export function Table({ head, rows, caption }: B<'table'>) {
  return (
    <figure className="rtable">
      <table>
        <thead><tr>{head.map((h, i) => <th key={i} scope="col">{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} data-label={head[j] || undefined}>{c}</td>)}</tr>)}</tbody>
      </table>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function Stats({ items }: B<'stats'>) {
  return (
    <dl className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
      {items.map((s, i) => (
        <div key={i} className="border-t hairline pt-5">
          <dt className="font-display text-stat font-bold leading-none tracking-[-0.04em] text-ink">{s.value}</dt>
          <dd className="mt-3 text-body text-ink-2">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Steps({ items }: B<'steps'>) {
  return (
    <ol className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      {items.map((s, i) => (
        <li key={i} className="grid grid-cols-[auto_1fr] gap-4">
          <span className="mono mt-1 text-mono text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
          <span>
            <b className="block font-display text-h4 font-bold leading-tight tracking-[-0.02em] text-ink">{s.title}</b>
            <span className="mt-2 block text-body leading-relaxed text-ink-2">{s.text}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Lucian UX/UI Prompt #217 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#217 ----------
   Comparativa de planes: encabezado fijo, columna resaltada al apoyar el puntero (o al tocar), interruptor
   "Solo diferencias" que pliega filas iguales y grupos vacíos. En móvil: 3 tarjetas apiladas con selector arriba. */
function Cell({ v }: { v: string | boolean | string[] }) {
  if (v === true) return <Check className="u217-y" size={20} strokeWidth={2.4} role="img" aria-label="Incluido" />;
  if (v === false) return <Minus className="u217-n" size={20} role="img" aria-label="No incluido" />;
  if (Array.isArray(v)) return <ul className="u217-list">{v.map((x, i) => <li key={i}>{x}</li>)}</ul>;
  return <>{v}</>;
}
export function Compare({ cols, groups, ctas, note, currency }: B<'compare'>) {
  const [only, setOnly] = useState(false);
  const [col, setCol] = useState<number | null>(null);
  const [card, setCard] = useState(cols.findIndex((c) => c.highlight) >= 0 ? cols.findIndex((c) => c.highlight) : 0);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const uid = useId();
  const same = (cells: unknown[]) => cells.every((c) => JSON.stringify(c) === JSON.stringify(cells[0]));
  const visible = useMemo(() => groups.map((g) => ({ ...g, rows: g.rows.map((r) => ({ ...r, off: only && same(r.cells) })) })), [groups, only]);
  // la tarjeta activa del selector sigue al scroll
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setCard(Number((e.target as HTMLElement).dataset.i)); }), { rootMargin: '-45% 0px -50% 0px' });
    cards.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const go = (i: number) => { setCard(i); cards.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const toggle = (
    <button type="button" role="switch" aria-checked={only} onClick={() => setOnly(!only)} className="u217-df">
      Solo diferencias<i aria-hidden="true" />
    </button>
  );
  return (
    <div className="ux u217" data-col={col ?? ''}>
      <div className="u217-tp">
        <p className="kicker">Comparativa · valores en {currency}</p>
        {toggle}
      </div>

      {/* Desktop: tabla */}
      <div className="u217-table" role="table" aria-label="Comparativa de los tres caminos" onPointerLeave={() => setCol(null)}>
        <div className="u217-r u217-hd" role="row">
          <span role="columnheader" className="u217-l"><span className="sr-only">Característica</span></span>
          {cols.map((c, i) => (
            <div key={c.id} role="columnheader" className={`u217-c u217-c${i + 1} ${c.highlight ? 'is-hl' : ''}`} onPointerEnter={() => setCol(i + 1)} onFocus={() => setCol(i + 1)}>
              {c.highlight && <em>Recomendado</em>}
              <span className="kicker">Nivel {i + 1}</span>
              <b>{c.name}</b>
              <a href={`#${uid}-cta${i}`} className="u217-pick">Elegir</a>
            </div>
          ))}
        </div>
        {visible.map((g) => {
          const empty = g.rows.every((r) => r.off);
          return (
            <div key={g.title} className={`u217-gp ${empty ? 'is-off' : ''}`} role="rowgroup" aria-hidden={empty}>
              <div>
                <p className="u217-gh" role="row"><span role="rowheader">{g.title}</span></p>
                {g.rows.map((r) => (
                  <div key={r.label} className={`u217-rw ${r.off ? 'is-off' : ''}`} aria-hidden={r.off}>
                    <div>
                      <div className="u217-r" role="row">
                        <span role="rowheader" className="u217-l">{r.label}</span>
                        {r.cells.map((v, i) => <span key={i} role="cell" className={`u217-c u217-c${i + 1}`} onPointerEnter={() => setCol(i + 1)}><Cell v={v} /></span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div className="u217-r u217-ft" role="row">
          <span role="rowheader" className="u217-l">Enlace</span>
          {ctas.map((cs, i) => (
            <div key={i} id={`${uid}-cta${i}`} role="cell" className={`u217-c u217-c${i + 1}`} onPointerEnter={() => setCol(i + 1)}>
              {cs.map((c, j) => <Cta key={j} text={c.text} href={c.href} ghost={j > 0} full />)}
            </div>
          ))}
        </div>
      </div>

      {/* Móvil: selector + tarjetas apiladas */}
      <div className="u217-mob">
        <div className="u217-sel">
          <Segmented label="Elegí un camino" value={String(card)} onChange={(v) => go(Number(v))} options={cols.map((_c, i) => ({ id: String(i), label: `Nivel ${i + 1}` }))} />
        </div>
        {cols.map((c, i) => (
          <article key={c.id} ref={(el) => { cards.current[i] = el; }} data-i={i} className={`u217-card ${c.highlight ? 'is-hl' : ''}`} aria-labelledby={`${uid}-h${i}`}>
            {c.highlight && <em className="u217-badge">Recomendado</em>}
            <p className="kicker">Nivel {i + 1}</p>
            <h3 id={`${uid}-h${i}`} className="mt-1 font-display text-h3 font-bold leading-tight tracking-[-0.02em]">{c.name}</h3>
            {visible.map((g) => g.rows.some((r) => !r.off) && (
              <div key={g.title} className="mt-5">
                <p className="u217-gh">{g.title}</p>
                <dl>
                  {g.rows.filter((r) => !r.off).map((r) => (
                    <div key={r.label} className="u217-dl"><dt>{r.label}</dt><dd><Cell v={r.cells[i]} /></dd></div>
                  ))}
                </dl>
              </div>
            ))}
            <div className="mt-6 grid gap-3">{ctas[i].map((cta, j) => <Cta key={j} text={cta.text} href={cta.href} ghost={j > 0} full />)}</div>
          </article>
        ))}
      </div>
      {note && <p className="u217-note">{note}</p>}
    </div>
  );
}

/* ---------- Planes por región (Club Formadores) ---------- */
export function Plans({ regions }: B<'plans'>) {
  const [r, setR] = useState(regions[regions.length - 1].id);
  const region = regions.find((x) => x.id === r)!;
  return (
    <div className="grid gap-6">
      <Segmented label="Elegí tu país" value={r} onChange={setR} options={regions.map((x) => ({ id: x.id, label: x.name }))} />
      <div className="grid gap-4 lg:grid-cols-3">
        {region.plans.map((p) => (
          <article key={p.id} className={`plan ${p.badge ? 'is-hl' : ''}`}>
            {p.badge && <em className="plan-badge">{p.badge}</em>}
            <h3 className="font-display text-h4 font-bold">{p.name}</h3>
            <p className="mt-3"><span className="font-display text-stat font-bold leading-none tracking-[-0.04em]">{p.price}</span>{p.per && <span className="ml-2 text-body text-ink-2">{p.per}</span>}</p>
            {p.lead && <p className="mt-2 text-body font-medium text-ink-2">{p.lead}</p>}
            <p className="mono mt-6 text-mono text-ink-3">INCLUYE</p>
            <ul className="mt-3 grid gap-2.5">{p.includes.map((x) => <li key={x} className="flex gap-3 text-body leading-snug"><Check size={20} className="mt-0.5 flex-none text-accent-ink" aria-hidden />{x}</li>)}</ul>
            {p.note && <p className="mt-4 text-small text-ink-3">{p.note}</p>}
            <div className="mt-auto pt-6"><Cta text={p.cta.text} href={p.cta.href} ghost={!p.badge} full /></div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ---------- Entradas / opciones con precio ---------- */
export function Tickets({ items }: B<'tickets'>) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((t, i) => (
        <article key={i} className="plan">
          {t.img && <div className="-mx-6 -mt-6 mb-5 overflow-hidden rounded-t-[22px] sm:-mx-7 sm:-mt-7"><MediaImg m={t.img} alt={t.title} sizes="(min-width:1280px) 30vw, (min-width:768px) 45vw, 100vw" className="aspect-[16/9] w-full object-cover" /></div>}
          <p className="kicker">{t.kicker}</p>
          <h3 className="mt-2 font-display text-h4 font-bold leading-tight">{t.title}</h3>
          <p className="mt-1 text-body text-ink-2">{t.text}</p>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-3">
            {t.before && <s className="text-reading text-ink-3"><span className="sr-only">Antes </span>{t.before}</s>}
            <span className="font-display text-stat font-bold leading-none tracking-[-0.04em]">{t.price}</span>
          </p>
          <ul className="mt-5 grid gap-2.5">{t.items.map((x) => <li key={x} className="flex gap-3 text-body leading-snug"><Check size={20} className="mt-0.5 flex-none text-accent-ink" aria-hidden />{x}</li>)}</ul>
          <div className="mt-auto pt-6"><Cta text={t.cta.text} href={t.cta.href} full /></div>
          {t.note && <p className="mt-3 text-small text-ink-3">{t.note}</p>}
        </article>
      ))}
    </div>
  );
}

/* ---------- Compra del libro: Argentina / resto del mundo ---------- */
export function BookBuy({ ar, stores, world }: B<'bookbuy'>) {
  const [tab, setTab] = useState<'ar' | 'mundo'>('ar');
  const regions = [...new Set(world.countries.map((c) => c.region))];
  return (
    <div className="grid gap-6">
      <Segmented label="¿Dónde vivís?" value={tab} onChange={(v) => setTab(v as 'ar' | 'mundo')} options={[{ id: 'ar', label: 'Vivo en Argentina' }, { id: 'mundo', label: 'Vivo fuera de Argentina' }]} />
      {tab === 'ar' ? (
        <div className="grid gap-6 lg:grid-cols-12">
          <article className="plan is-hl lg:col-span-5">
            <h3 className="font-display text-h3 font-bold">{ar.title}</h3>
            <p className="mt-2 text-body text-ink-2">{ar.pack}</p>
            <p className="mt-4 font-display text-stat font-bold leading-none tracking-[-0.04em]">{ar.price}</p>
            <div className="mt-6"><Cta text="Quiero este pack" href={ar.href} full /></div>
            <p className="mt-3 text-small text-ink-3">{ar.note}</p>
            <p className="mt-4 text-small text-ink-3">{ar.disclaimer}</p>
          </article>
          <div className="lg:col-span-7">
            <h3 className="font-display text-h4 font-bold">¿Dónde prefieres comprar tu libro?</h3>
            <p className="mt-3 text-body leading-relaxed text-ink-2">{stores.intro}</p>
            <ul className="mt-5 divide-y divide-[var(--hair)] border-y hairline">
              {stores.items.map((s) => (
                <li key={s.name} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <span className="min-w-0 flex-1"><b className="block text-reading">{s.name}</b><span className="text-small text-ink-2">{s.text}</span></span>
                  <a href={s.href} target="_blank" rel="noopener" className="btn btn-ghost">{s.cta}<ArrowUpRight size={18} aria-hidden /></a>
                </li>
              ))}
            </ul>
            {stores.notes.map((n) => <p key={n} className="mt-3 text-small text-ink-3">{n}</p>)}
          </div>
        </div>
      ) : (
        <div>
          <h3 className="font-display text-h4 font-bold">Busca el Libro en Tu País</h3>
          <p className="mt-3 max-w-[70ch] text-body leading-relaxed text-ink-2">{world.intro}</p>
          {regions.map((rg) => (
            <div key={rg} className="mt-6">
              <p className="kicker">{rg}</p>
              <ul className="mt-3 grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {world.countries.filter((c) => c.region === rg).map((c) => (
                  <li key={c.name}><a href={c.href} target="_blank" rel="noopener" className="country">{c.name}<ArrowUpRight size={18} aria-hidden /></a></li>
                ))}
              </ul>
            </div>
          ))}
          <p className="mt-6 text-small font-medium text-ink-2">{world.note}</p>
        </div>
      )}
    </div>
  );
}

/* ---------- Calculadora de productores ("Hacé tu cuenta") ---------- */
export function Calculator() {
  const [precio, setPrecio] = useState(225);
  const [alumnos, setAlumnos] = useState(60);
  const inversion = 4750;
  const usd = (n: number) => `USD ${n.toLocaleString('es-AR')}`;
  const id = useId();
  return (
    <div className="plan">
      <h3 className="font-display text-h4 font-bold">Hacé tu cuenta</h3>
      <p className="mt-2 text-body text-ink-2">Mové la barra y elegí el valor de la entrada.</p>
      <div className="mt-5"><Segmented label="Valor de la entrada" value={String(precio)} onChange={(v) => setPrecio(Number(v))} options={[200, 225, 250].map((n) => ({ id: String(n), label: `USD ${n}` }))} /></div>
      <label htmlFor={id} className="mt-6 flex items-baseline justify-between gap-3 text-body font-medium">Alumnos inscriptos <output htmlFor={id} className="font-display text-h3 font-bold">{alumnos}</output></label>
      <input id={id} type="range" min={40} max={90} step={1} value={alumnos} onChange={(e) => setAlumnos(Number(e.target.value))} className="range mt-3 w-full" />
      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div><dt className="text-small text-ink-2">Recaudación</dt><dd className="font-display text-h3 font-bold">{usd(precio * alumnos)}</dd></div>
        <div><dt className="text-small text-ink-2">Inversión total estimada</dt><dd className="font-display text-h3 font-bold">{usd(inversion)}</dd></div>
        <div><dt className="text-small text-ink-2">Margen para la producción</dt><dd className="font-display text-h3 font-bold text-accent-ink">{usd(precio * alumnos - inversion)}</dd></div>
      </dl>
    </div>
  );
}
