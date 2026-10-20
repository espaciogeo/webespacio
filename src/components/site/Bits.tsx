// Piezas chicas reutilizadas por las plantillas internas.
import { useEffect, useId, useRef, useState } from 'react';
import type { MediaRef } from '../../types';
import { Trazo, type TrazoTipo } from './Trazo';

export function MediaImg({ m, alt = '', sizes = '(min-width: 1024px) 50vw, 100vw', className, eager = false }: { m: MediaRef; alt?: string; sizes?: string; className?: string; eager?: boolean }) {
  const d = `/${m.dir || 'media'}/${m.name}`;
  const set = (ext: string) => `${d}-800.${ext} 800w, ${d}-1600.${ext} ${m.w}w`;
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img src={`${d}-800.webp`} alt={alt} width={m.w} height={m.h} loading={eager ? 'eager' : 'lazy'} decoding="async" className={className} />
    </picture>
  );
}

// Lucian UX/UI Prompt #237 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#237
// Título que sube línea por línea desde una máscara. Las líneas se arman por largo aproximado.
export function MaskTitle({ text, className = '', style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(t); }, []);
  const words = text.split(/\s+/);
  const lines: string[] = [];
  for (const w of words) {
    const last = lines[lines.length - 1];
    if (last && (last + ' ' + w).length <= 16) lines[lines.length - 1] = last + ' ' + w;
    else lines.push(w);
  }
  return (
    <h1 className={`u237 ${on ? 'is-in' : ''} ${className}`} style={style} aria-label={text}>
      {lines.map((l, i) => (
        <span key={i} className="u237-ln" aria-hidden="true"><span className="u237-in" style={{ ['--i' as string]: i }}>{l}</span></span>
      ))}
    </h1>
  );
}

export function PageHero({ kicker, title, lede, trazo, children, facts, image, breadcrumb }: { kicker: string; title: string; lede?: string; trazo: TrazoTipo; children?: React.ReactNode; facts?: { label: string; value: string }[]; image?: MediaRef | null; breadcrumb?: { label: string; href: string }[] }) {
  return (
    <section className="wrap relative grid grid-cols-12 items-end gap-x-4 gap-y-8 pb-[7svh] pt-28 sm:pt-32 lg:min-h-[64svh] lg:pt-36">
      <div className="col-span-12 min-w-0 lg:col-span-8">
        {breadcrumb && (
          <nav aria-label="Ruta" className="mb-5">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-ink-2">
              {breadcrumb.map((b) => <li key={b.href} className="flex items-center gap-2"><a href={b.href} className="inline-flex min-h-[44px] items-center underline underline-offset-4">{b.label}</a><span aria-hidden="true">/</span></li>)}
            </ol>
          </nav>
        )}
        <p className="kicker">{kicker}</p>
        <MaskTitle text={title} className="display mt-5" style={{ fontSize: title.length > 48 ? 'var(--fs-article)' : 'var(--fs-hero)', lineHeight: 0.98 }} />
        {lede && <p className="mt-7 max-w-[56ch] text-reading leading-relaxed text-ink-2">{lede}</p>}
        {facts && facts.length > 0 && (
          <dl className="mt-8 grid max-w-[880px] grid-cols-1 gap-x-6 gap-y-4 border-t hairline pt-6 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="min-w-0">
                <dt className="kicker">{f.label}</dt>
                <dd className="mt-1.5 font-display text-reading font-bold leading-snug text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {children}
      </div>
      <div className={`pointer-events-none relative col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-4 lg:col-start-9 lg:self-center ${image ? '' : 'col-span-8 col-start-3 sm:col-span-6 sm:col-start-4'}`}>
        {image ? (
          <div className="relative">
            <Trazo tipo={trazo} className="absolute inset-0 w-full opacity-60 lg:-inset-[12%] lg:w-[124%]" />
            <div className="relative mx-auto max-w-[420px] overflow-hidden rounded-[24px] shadow-[0_30px_60px_-40px_var(--shadow-strong)]">
              <MediaImg m={image} alt="" eager sizes="(min-width:1024px) 30vw, 80vw" className="h-auto w-full" />
            </div>
          </div>
        ) : <Trazo tipo={trazo} className="w-full" />}
      </div>
    </section>
  );
}

// Video liviano: muestra la miniatura y carga el reproductor recién al hacer clic.
// vertical: para videos cortos (formato celular); recorta las barras negras de la miniatura. chico: botón de play más amable.
export function Video({ provider, id, title = 'Video', vertical = false, chico = false }: { provider: string; id: string; title?: string; vertical?: boolean; chico?: boolean }) {
  const [on, setOn] = useState(false);
  const [vid, hash] = id.split('?h=');
  const src = provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0`
    : `https://player.vimeo.com/video/${vid}?autoplay=1${hash ? `&h=${hash}` : ''}`;
  return (
    <div className={`relative overflow-hidden rounded-[18px] bg-ink ${vertical ? 'aspect-[3/4]' : 'aspect-video'}`}>
      {on ? (
        <iframe src={src} title={title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen className="absolute inset-0 h-full w-full" />
      ) : (
        <button type="button" onClick={() => setOn(true)} className="group absolute inset-0 grid place-items-center" aria-label={`Reproducir ${title}`}>
          {provider === 'youtube'
            ? (vertical
              ? <img src={`https://i.ytimg.com/vi/${vid}/maxresdefault.jpg`} alt="" loading="lazy" className="absolute left-1/2 top-1/2 w-[316%] max-w-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-[1.04]" />
              : <img src={`https://i.ytimg.com/vi/${vid}/maxresdefault.jpg`} onError={(e) => { const i = e.currentTarget; if (!i.src.includes('hqdefault')) i.src = `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`; }} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />)
            : <Trazo tipo="semilla" className="absolute inset-[12%] opacity-25 [&_*]:!stroke-paper" />}
          {chico ? (
            <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/95 py-1.5 pl-1.5 pr-3.5 text-[13px] font-medium text-[#094372] shadow-md transition-transform group-hover:scale-105">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#66cc99]"><svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5 fill-[#094372]"><path d="M7 4.5v15l13-7.5z" /></svg></span>
              Ver testimonio
            </span>
          ) : (
            <span className="relative grid h-20 w-20 place-items-center rounded-full bg-[var(--ochre)] shadow-xl transition-transform group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-ink"><path d="M7 4.5v15l13-7.5z" /></svg>
            </span>
          )}
        </button>
      )}
    </div>
  );
}

// Lucian UX/UI Prompt #044 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#044
export function Accordion({ items }: { items: { title: string; html?: string; text?: string }[] }) {
  const [open, setOpen] = useState(0);
  const uid = useId();
  const qs = useRef<HTMLButtonElement[]>([]);
  return (
    <div className="ux u044 flex flex-col gap-3">
      {items.map((f, i) => (
        <div key={i} className={`u044-it ${open === i ? 'open' : ''}`}>
          <button ref={(el) => { if (el) qs.current[i] = el; }} id={`${uid}-q${i}`} className="u044-q" type="button" aria-expanded={open === i} aria-controls={`${uid}-a${i}`}
            onClick={() => setOpen(open === i ? -1 : i)}
            onKeyDown={(e) => {
              const n = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : -2;
              if (n === -2) return;
              e.preventDefault();
              qs.current[(n + items.length) % items.length]?.focus();
            }}>
            <span className="u044-t">{f.title}</span><span className="u044-pm" aria-hidden="true" />
          </button>
          <div className="u044-body" role="region" id={`${uid}-a${i}`} aria-labelledby={`${uid}-q${i}`}>
            <div><div className="u044-a prose-egs">{f.html ? <div dangerouslySetInnerHTML={{ __html: f.html }} /> : <p>{f.text}</p>}</div></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Formulario conectado al mismo Elementor Form del sitio actual (conserva GetResponse, email y redirecciones).
const ENDPOINT = (import.meta.env.VITE_FORMS_ENDPOINT as string | undefined) || '/wp-admin/admin-ajax.php';
type Field = { label: string; type: string; required: boolean; id: string; options: string[] };
export function WpForm({ name, fields, submit, formId, postId, redirect, dark = false }: { name: string; fields: Field[]; submit: string; formId: string; postId: string; redirect?: string; dark?: boolean }) {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'error'>('idle');
  const uid = useId();
  const input = `w-full rounded-[16px] border-0 px-5 text-body outline-none ring-1 focus:ring-2 focus:ring-[var(--ochre)] ${dark ? 'bg-paper/10 text-paper ring-paper/25 placeholder:text-paper/50' : 'bg-[var(--paper-2)] text-ink ring-[var(--hair)] placeholder:text-ink-3'}`;
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = new FormData();
    Object.entries({ action: 'elementor_pro_forms_send_form', post_id: postId, form_id: formId, queried_id: postId, referer_title: document.title }).forEach(([k, v]) => body.append(k, v));
    fields.forEach((f) => body.append(`form_fields[${f.id}]`, String(fd.get(f.id) ?? '')));
    setState('busy');
    try {
      const same = new URL(ENDPOINT, location.href).origin === location.origin;
      const res = await fetch(ENDPOINT, { method: 'POST', body, mode: same ? 'same-origin' : 'no-cors' });
      if (same) {
        const j = await res.json().catch(() => null);
        if (!res.ok || (j && j.success === false)) throw new Error('rechazado');
        const go = j?.data?.data?.redirect_url || redirect;
        if (go) { location.href = go; return; }
      }
      setState('ok');
    } catch { setState('error'); }
  };
  return (
    <form id="formulario" onSubmit={onSubmit} aria-label={name || 'Formulario'} className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => {
        const id = `${uid}-${f.id}`;
        const full = f.type === 'textarea' || fields.length % 2 === 1;
        return (
          <label key={f.id} htmlFor={id} className={`grid gap-2 ${full ? 'sm:col-span-2' : ''}`}>
            <span className={`text-small font-medium ${dark ? 'text-paper/80' : 'text-ink-2'}`}>{f.label}{f.required && ' *'}</span>
            {f.type === 'textarea' ? <textarea id={id} name={f.id} required={f.required} rows={5} className={`${input} py-4`} />
              : f.type === 'select' ? <select id={id} name={f.id} required={f.required} className={`${input} h-14`}>{f.options.map((o) => <option key={o} value={o.split('|').pop()}>{o.split('|')[0]}</option>)}</select>
              : <input id={id} name={f.id} required={f.required} type={['email', 'tel', 'number', 'date', 'url'].includes(f.type) ? f.type : 'text'} autoComplete={f.type === 'email' ? 'email' : f.id === 'name' ? 'name' : undefined} className={`${input} h-14`} />}
          </label>
        );
      })}
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={state === 'busy' || state === 'ok'} className="btn btn-primary">{state === 'busy' ? 'Enviando…' : state === 'ok' ? '¡Recibido! Te escribimos pronto' : submit || 'Enviar'}</button>
        {state === 'error' && <p role="alert" className="text-small text-error">No pudimos enviar el formulario. Probá de nuevo o escribinos a info@espaciodegeometriasagrada.com.</p>}
      </div>
    </form>
  );
}

export function TrazoInline({ tipo, className }: { tipo: TrazoTipo; className?: string }) {
  return <Trazo tipo={tipo} className={className} />;
}
