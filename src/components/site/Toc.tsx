// Lucian UX/UI Prompt #275 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#275
// Índice que sigue el scroll: oscurece el capítulo que se está leyendo y un marcador cubre lo visible.
import { useEffect, useRef, useState } from 'react';
import type { TocItem } from '../../types';
import { scrollToId } from '../../lib/scroll';

export function Toc({ items }: { items: TocItem[] }) {
  const ul = useRef<HTMLUListElement>(null);
  const mk = useRef<HTMLSpanElement>(null);
  const [best, setBest] = useState(0);

  useEffect(() => {
    let raf = 0;
    const draw = () => {
      raf = 0;
      const secs = items.map((it, i) => {
        const h = document.getElementById(it.id);
        const next = items[i + 1] ? document.getElementById(items[i + 1].id) : document.querySelector('[data-article-end]');
        if (!h) return { a: 0, b: 0 };
        return { a: h.getBoundingClientRect().top, b: next ? next.getBoundingClientRect().top : h.getBoundingClientRect().bottom + 400 };
      });
      const top = 80, bot = window.innerHeight;
      let first = -1, last = -1, bi = 0, bv = 0;
      secs.forEach((s, i) => {
        const vis = Math.max(0, Math.min(s.b, bot) - Math.max(s.a, top)) / Math.max(1, s.b - s.a);
        if (vis > 0.12) { if (first < 0) first = i; last = i; }
        if (vis > bv) { bv = vis; bi = i; }
      });
      if (first < 0) first = last = bi;
      setBest(bi);
      const lis = ul.current?.querySelectorAll('li');
      if (lis && mk.current && lis[first]) {
        const y0 = (lis[first] as HTMLElement).offsetTop, y1 = (lis[last] as HTMLElement).offsetTop + (lis[last] as HTMLElement).offsetHeight;
        mk.current.style.transform = `translateY(${y0}px)`;
        mk.current.style.height = `${y1 - y0}px`;
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(draw); };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    draw();
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, [items]);

  return (
    <nav aria-label="En este artículo" className="u275-toc">
      <p className="kicker mb-4">En este artículo</p>
      <ul ref={ul} className="relative border-l-2 border-[var(--hair)] pl-4">
        <span ref={mk} className="absolute -left-[2px] top-0 w-[2px] rounded bg-[var(--ochre)] transition-[transform,height] duration-300 [transition-timing-function:var(--ux-spring)]" aria-hidden="true" />
        {items.map((it, i) => (
          <li key={it.id} className={it.level === 3 ? 'pl-3' : ''}>
            <a href={`#${it.id}`} onClick={(e) => { e.preventDefault(); scrollToId(it.id); }} aria-current={i === best ? 'true' : undefined}
              className={`block py-1.5 text-small leading-snug transition-colors ${i === best ? 'font-medium text-ink' : 'text-ink-3 hover:text-ink'}`}>{it.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
