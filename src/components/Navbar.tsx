import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { links, nav, redes, type NavItem } from '../content';
import { lockScroll } from '../lib/scroll';
import { useReady } from '../lib/ready';

// Submenú de escritorio: se abre con clic, teclado o foco (y también al apoyar el puntero); nunca depende solo del hover.
function DesktopItem({ n }: { n: NavItem }) {
  const [open, setOpen] = useState(false);
  const id = `sub-${n.label.toLowerCase().replace(/\W+/g, '-')}`;
  if (!n.children) return <li><a href={n.href} className="flex min-h-[48px] items-center rounded-full px-3 text-[16px] font-medium text-ink-2 xl:px-4 transition-colors hover:bg-ink/5 hover:text-ink">{n.label}</a></li>;
  return (
    <li className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} className="flex min-h-[48px] items-center gap-1 rounded-full px-3 font-display text-[16px] xl:px-4 font-medium text-ink-2 transition-colors hover:bg-ink/5 hover:text-ink">
        {n.label}<ChevronDown size={18} aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div id={id} hidden={!open} className="absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-3">
        <div className="grid grid-cols-2 gap-1 rounded-[24px] bg-paper p-3 shadow-[0_0_0_1px_var(--line),0_30px_60px_-30px_var(--shadow-strong)]">
          {n.children.map((c) => (
            <a key={c.href} href={c.href} className="rounded-[16px] px-4 py-3 font-sans transition-colors hover:bg-[var(--paper-2)] focus-visible:bg-[var(--paper-2)]">
              <b className="block font-display text-[16px] font-bold text-ink">{c.label}</b>
              {c.text && <span className="mt-0.5 block font-sans text-[15px] font-normal leading-snug text-ink-2">{c.text}</span>}
            </a>
          ))}
          <a href={n.href} className="col-span-2 mt-1 flex min-h-[48px] items-center justify-between rounded-[16px] bg-ink px-4 font-display text-[16px] font-bold text-paper">Ver todas las formaciones <ArrowUpRight size={18} aria-hidden className="rotate-45" /></a>
        </div>
      </div>
    </li>
  );
}

// Acordeón del menú móvil
function MobileItem({ n, i }: { n: NavItem; i: number }) {
  const [open, setOpen] = useState(false);
  const row = 'flex w-full items-baseline justify-between gap-4 py-4 text-left font-display text-[clamp(30px,9vw,40px)] font-bold leading-tight tracking-[-0.04em]';
  if (!n.children) return <a href={n.href} className={row}>{n.label} <span className="mono text-sm text-ink-3">0{i + 1}</span></a>;
  return (
    <>
      <button type="button" aria-expanded={open} aria-controls={`m-${i}`} onClick={() => setOpen(!open)} className={row}>
        <span className="flex items-center gap-2">{n.label}<ChevronDown size={28} aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`} /></span>
        <span className="mono text-sm text-ink-3">0{i + 1}</span>
      </button>
      <ul id={`m-${i}`} hidden={!open} className="pb-4">
        <li><a href={n.href} className="flex min-h-[48px] items-center font-display text-[18px] font-bold underline underline-offset-4">Ver todas las formaciones</a></li>
        {n.children.map((c) => <li key={c.href}><a href={c.href} className="flex min-h-[48px] items-center text-[18px] font-medium text-ink-2">{c.label}</a></li>)}
      </ul>
    </>
  );
}

export function Navbar() {
  const ready = useReady();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) > 6) { setHidden(y > last && y > 140); last = y; }
      setSolid(y > 40);
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    lockScroll(open);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500"
        style={{
          transform: hidden && !open ? 'translateY(-110%)' : ready ? 'none' : 'translateY(-110%)',
          transitionTimingFunction: 'cubic-bezier(.2,.8,.2,1)',
          background: solid ? '#fff' : 'transparent',
                    boxShadow: solid ? '0 1px 0 var(--line)' : undefined,
        }}
      >
        <nav aria-label="Principal" className="wrap flex h-[72px] items-center justify-between gap-6 lg:h-20">
          <a href={links.home} className="flex shrink-0 items-center" aria-label="Espacio de Geometría Sagrada, inicio">
            <img src="/img/logo.webp" alt="Espacio de Geometría Sagrada" width={220} height={68} className="h-9 w-auto lg:h-10" />
          </a>
          <ul className="hidden items-center gap-0.5 lg:flex">
            {nav.map((n) => <DesktopItem key={n.label} n={n} />)}
          </ul>
          <div className="flex items-center gap-2">
            <a href={links.acceso} className="btn btn-ghost hidden !min-h-[46px] !px-5 !text-[15px] sm:inline-flex"><span className="hidden sm:inline lg:hidden xl:inline">Acceso estudiantes</span><span className="hidden lg:inline xl:hidden">Acceso</span></a>
            <button type="button" onClick={() => setOpen(true)} className="flex min-h-[48px] items-center gap-2 rounded-full px-3 font-bold lg:hidden" aria-expanded={open} aria-controls="menu-movil">
              <Menu size={24} aria-hidden /> Menú
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil" role="dialog" aria-modal="true" aria-label="Menú"
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-paper lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="wrap flex h-[72px] items-center justify-between">
              <img src="/img/logo.webp" alt="" width={220} height={68} className="h-9 w-auto" />
              <button type="button" onClick={() => setOpen(false)} className="flex min-h-[48px] items-center gap-2 rounded-full px-3 font-bold" autoFocus>
                <X size={24} aria-hidden /> Cerrar
              </button>
            </div>
            <ul className="wrap mt-2 flex flex-col overflow-y-auto">
              {nav.map((n, i) => (
                <motion.li key={n.label} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  className="border-b hairline">
                  <MobileItem n={n} i={i} />
                </motion.li>
              ))}
            </ul>
            <div className="wrap mt-auto pb-8 pt-6">
              <a href={links.acceso} className="btn btn-primary w-full">Acceso estudiantes <ArrowUpRight size={18} aria-hidden /></a>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {redes.map((r) => <a key={r.label} href={r.href} className="py-2 font-medium underline underline-offset-4">{r.label}</a>)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
