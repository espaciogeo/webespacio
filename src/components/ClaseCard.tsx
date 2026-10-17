// Lucian UX/UI Prompt #210 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#210
// Adaptado: la "multitud" son glifos geométricos (no se inventan nombres ni cantidades de inscriptos);
// el contador muestra la cifra real de la comunidad. El formulario postea al form real de Elementor.
import { useEffect, useRef, useState } from 'react';
import { clase, claseForm } from '../content';

const GLYPHS = [
  '<circle cx="11" cy="11" r="6.5"/>',
  '<path d="M11 4.5 17.5 16h-13z"/>',
  '<rect x="5" y="5" width="12" height="12"/>',
  '<path d="M11 4 17.7 8.9 15.1 16.8H6.9L4.3 8.9z"/>',
  '<path d="M11 4.5 16.6 7.75v6.5L11 17.5 5.4 14.25v-6.5z"/>',
  '<circle cx="8.5" cy="11" r="5"/><circle cx="13.5" cy="11" r="5"/>',
];
const BG = ['var(--ink-soft)', 'var(--accent)', 'var(--ink-light)', 'var(--paper)', 'var(--accent)', 'var(--ink-2)'];
const FG = ['var(--paper)', 'var(--ink)', 'var(--paper)', 'var(--ink)', 'var(--paper)', 'var(--paper)'];
const MAX = 6;

export function ClaseCard() {
  const st = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const k = useRef(MAX);

  const av = (i: number, me = false) => {
    const a = document.createElement('span');
    a.className = 'u210-av' + (me ? ' is-me' : '');
    a.setAttribute('aria-hidden', 'true');
    a.style.background = me ? 'var(--ochre)' : BG[i % BG.length];
    a.style.color = me ? 'var(--ink)' : FG[i % FG.length];
    a.innerHTML = `<svg viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.6">${me ? '<path d="M6 11.5l3.2 3.2L16 8"/>' : GLYPHS[i % GLYPHS.length]}</svg>`;
    return a;
  };
  const push = (a: HTMLElement) => {
    const s = st.current!;
    a.classList.add('is-new');
    s.insertBefore(a, s.firstChild);
    void a.offsetWidth;
    a.classList.remove('is-new');
    const L = Array.from(s.querySelectorAll('.u210-av:not(.is-gone)'));
    if (L.length > MAX) { const z = L[L.length - 1]; z.classList.add('is-gone'); setTimeout(() => z.remove(), 460); }
  };

  useEffect(() => {
    const s = st.current!;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    s.querySelectorAll('.u210-av').forEach((n) => n.remove());
    for (let i = MAX - 1; i >= 0; i--) s.insertBefore(av(i), s.firstChild);
    let vis = false, hover = false, timer = 0, rolled = false;

    // Contador con dígitos que ruedan (ported de #210)
    const cells: { el: HTMLSpanElement; ch: string }[] = [];
    const draw = (v: number) => {
      const str = v.toLocaleString('es-AR');
      const n = num.current!;
      while (cells.length < str.length) { const d = document.createElement('span'); d.className = 'u210-dg'; d.innerHTML = '<span></span>'; n.appendChild(d); cells.push({ el: d, ch: '' }); }
      str.split('').forEach((ch, i) => {
        const c = cells[i]; if (c.ch === ch) return;
        const inner = c.el.firstChild as HTMLSpanElement;
        if (/\d/.test(ch)) { if (!/\d/.test(c.ch)) inner.innerHTML = '0<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9'; inner.style.transform = `translateY(${-+ch * 1.1}em)`; }
        else { inner.textContent = ch; inner.style.transform = 'none'; }
        c.ch = ch;
      });
    };
    draw(0);
    const loop = () => { if (vis && !hover && !rm) push(av(k.current++)); timer = window.setTimeout(loop, 2400); };
    timer = window.setTimeout(loop, 2400);
    const io = new IntersectionObserver(([e]) => {
      vis = e.isIntersecting;
      if (vis && !rolled) { rolled = true; window.setTimeout(() => draw(clase.comunidad), rm ? 0 : 250); }
    });
    io.observe(root.current!);
    const enter = () => { hover = true; }, leave = () => { hover = false; };
    s.addEventListener('pointerenter', enter); s.addEventListener('pointerleave', leave);
    return () => { clearTimeout(timer); io.disconnect(); s.removeEventListener('pointerenter', enter); s.removeEventListener('pointerleave', leave); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === 'busy' || state === 'done') return;
    const fd = new FormData(e.currentTarget);
    const body = new FormData();
    Object.entries(claseForm.fields).forEach(([k2, v]) => body.append(k2, v));
    body.append('form_fields[name]', String(fd.get('name') ?? ''));
    body.append('form_fields[email]', String(fd.get('email') ?? ''));
    setState('busy');
    try {
      const sameOrigin = new URL(claseForm.endpoint, window.location.href).origin === window.location.origin;
      const res = await fetch(claseForm.endpoint, { method: 'POST', body, mode: sameOrigin ? 'same-origin' : 'no-cors' });
      if (sameOrigin && !res.ok) throw new Error(String(res.status));
      setState('done');
      push(av(0, true));
    } catch {
      setState('error');
    }
  };

  return (
    <div ref={root} className="ux u210 flex h-full flex-col">
      <span className="u210-tg mono text-[13px] uppercase tracking-[0.08em] text-paper/80"><i aria-hidden="true" />{clase.tag}</span>
      <h3 className="mt-4 font-bold tracking-[-0.04em] text-paper" style={{ fontSize: 'clamp(34px, 4.2vw, 68px)', lineHeight: 0.95 }}>{clase.titulo}</h3>
      <p className="mt-4 max-w-[46ch] text-[18px] leading-relaxed text-paper/75">{clase.texto}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1">
        <div ref={st} className="u210-st" aria-hidden="true" />
        <p className="text-[17px] text-paper/75 sm:text-[16px]"><b ref={num} className="inline-flex font-display font-bold text-paper" style={{ fontVariantNumeric: 'tabular-nums' }} aria-label="100.000">+</b> {clase.comunidadLabel}</p>
      </div>

      <form onSubmit={submit} className="mt-auto grid gap-3 pt-6 sm:grid-cols-[1fr_1fr_auto]" aria-label="Inscripción a la clase gratuita">
        <label className="sr-only" htmlFor="cg-name">Nombre</label>
        <input id="cg-name" name="name" required autoComplete="given-name" placeholder="Nombre" disabled={state === 'done'}
          className="h-14 rounded-full border-0 bg-paper/10 px-5 text-[17px] text-paper placeholder:text-paper/50 outline-none ring-1 ring-paper/20 focus:ring-2 focus:ring-[var(--ochre)]" />
        <label className="sr-only" htmlFor="cg-email">Email</label>
        <input id="cg-email" name="email" type="email" required autoComplete="email" placeholder="Email" disabled={state === 'done'}
          className="h-14 rounded-full border-0 bg-paper/10 px-5 text-[17px] text-paper placeholder:text-paper/50 outline-none ring-1 ring-paper/20 focus:ring-2 focus:ring-[var(--ochre)]" />
        <button type="submit" className={`u210-jn btn btn-primary ${state === 'busy' ? 'is-busy' : ''} ${state === 'done' ? 'is-done' : ''}`} aria-live="polite">
          <i aria-hidden="true" />
          {state === 'busy' ? 'Enviando…' : state === 'done' ? clase.ok : clase.boton}
        </button>
        {state === 'error' && <p className="text-[15px] text-paper sm:col-span-3" role="alert">No pudimos enviar el formulario. Probá de nuevo en un momento.</p>}
      </form>
    </div>
  );
}
