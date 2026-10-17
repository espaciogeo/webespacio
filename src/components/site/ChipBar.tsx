// Lucian UX/UI Prompt #242 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#242
// Barra de categorías que queda fija al scrollear, con una pastilla que marca la categoría activa.
import { useEffect, useRef, useState } from 'react';

export function ChipBar({ items, active }: { items: { href: string; label: string; key: string; count?: number }[]; active: string }) {
  const bar = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const place = () => {
      const a = row.current?.querySelector<HTMLAnchorElement>('[aria-current="page"]');
      if (!a || !pill.current || !row.current) return;
      pill.current.style.width = `${a.offsetWidth}px`;
      pill.current.style.transform = `translateX(${a.offsetLeft}px)`;
      row.current.scrollLeft = Math.max(0, a.offsetLeft - (row.current.clientWidth - a.offsetWidth) / 2);
    };
    place();
    document.fonts?.ready.then(place);
    const onScroll = () => setStuck((bar.current?.getBoundingClientRect().top ?? 1) <= 0.5);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', place);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', place); };
  }, [active]);

  return (
    <div ref={bar} className={`u242-cb sticky top-0 z-30 bg-paper transition-shadow ${stuck ? 'is-stuck shadow-[0_8px_16px_-12px_var(--shadow-strong)]' : ''}`}>
      <nav ref={row} aria-label="Categorías del blog" className="wrap relative flex gap-1 overflow-x-auto border-b hairline py-3 [scrollbar-width:none]">
        <span ref={pill} className="u242-ul absolute bottom-3 left-0 h-11 rounded-full bg-ink" aria-hidden="true" />
        {items.map((c) => (
          <a key={c.key} href={c.href} aria-current={c.key === active ? 'page' : undefined}
            className={`relative z-[1] inline-flex h-11 flex-none items-center gap-2 whitespace-nowrap rounded-full px-5 text-small font-medium transition-colors ${c.key === active ? 'text-paper' : 'text-ink-2 hover:text-ink'}`}>
            {c.label}{c.count != null && <span className="mono text-mono opacity-60">{c.count}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
}
