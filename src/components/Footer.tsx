// Lucian UX/UI Prompt #236 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#236
// Footer que se revela por debajo del contenido: crece de .94 a 1 y gana opacidad a medida que se descubre.
import { forwardRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { footer, legales, links, nav, redes } from '../content';

const CREDITO = 'Diseño y desarrollo: Share & Multiply Producciones';

export const Footer = forwardRef<HTMLElement, { reveal: boolean }>(function Footer({ reveal }, ref) {
  return (
    <footer ref={ref} className={`${reveal ? 'fixed inset-x-0 bottom-0 z-0' : 'relative'} bg-ink text-paper`}>
      <div className="u236-ft wrap relative overflow-hidden pb-6 pt-16 lg:pt-20">
        <div className="grid grid-cols-12 gap-x-4 gap-y-10">
          <div className="col-span-12 lg:col-span-5">
            <img src="/img/logo.webp" alt="Espacio de Geometría Sagrada" width={220} height={68} className="h-11 w-auto brightness-0 invert" />
            <p className="mt-6 max-w-[38ch] text-[18px] leading-relaxed text-paper/70">{footer.comunidad}</p>
            <a href={links.acceso} className="btn btn-primary mt-7">Acceso estudiantes <ArrowUpRight size={18} aria-hidden /></a>
          </div>
          <nav aria-label="Secciones" className="col-span-6 sm:col-span-4 lg:col-span-2 lg:col-start-7">
            <p className="mono text-[13px] uppercase tracking-[0.08em] text-paper/50">Espacio</p>
            <ul className="mt-3 space-y-1">
              <li><a href={links.quienesSomos} className="inline-block py-1.5 text-[17px] hover:underline">Nosotros</a></li>
              {nav.map((n) => <li key={n.label}><a href={n.href} className="inline-block py-1.5 text-[17px] hover:underline">{n.label}</a></li>)}
              <li><a href={links.blog} className="inline-block py-1.5 text-[17px] hover:underline">Suscribite al newsletter ↗</a></li>
            </ul>
          </nav>
          <nav aria-label="Propuestas" className="col-span-6 sm:col-span-4 lg:col-span-2">
            <p className="mono text-[13px] uppercase tracking-[0.08em] text-paper/50">Propuestas</p>
            <ul className="mt-3 space-y-1">
              <li><a href={links.claseGratuita} className="inline-block py-1.5 text-[17px] hover:underline">Clase gratuita</a></li>
              <li><a href={links.formacionInfo} className="inline-block py-1.5 text-[17px] hover:underline">Formación profesional</a></li>
              <li><a href="/formaciones/armonizacion-de-espacios/" className="inline-block py-1.5 text-[17px] hover:underline">Armonización de Espacios</a></li>
              <li><a href="/formaciones/experiencias/" className="inline-block py-1.5 text-[17px] hover:underline">Experiencias presenciales</a></li>
              <li><a href={links.cursos} className="inline-block py-1.5 text-[17px] hover:underline">Cursos online</a></li>
              <li><a href={links.ebooks} className="inline-block py-1.5 text-[17px] hover:underline">eBooks</a></li>
              <li><a href={links.admision} className="inline-block py-1.5 text-[17px] hover:underline">Admisión</a></li>
            </ul>
          </nav>
          <nav aria-label="Redes" className="col-span-12 sm:col-span-4 lg:col-span-2">
            <p className="mono text-[13px] uppercase tracking-[0.08em] text-paper/50">Redes</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 sm:block sm:space-y-1">
              {redes.map((r) => <li key={r.label}><a href={r.href} className="inline-block py-1.5 text-[17px] hover:underline">{r.label}</a></li>)}
            </ul>
            <p className="mt-4 text-[15px] text-paper/60"><span className="break-all">{footer.email}</span><br />{footer.horario}</p>
          </nav>
        </div>

        <p className="u236-wm mt-12 select-none font-display font-bold leading-[0.92] tracking-[-0.04em]" style={{ fontSize: 'clamp(44px, 10.6vw, 176px)' }} aria-hidden="true">
          compartir y multiplicar
        </p>

        <div className="mt-6 flex flex-col gap-3 border-t border-paper/15 pt-5 text-[14px] text-paper/55 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {legales.map((l) => <li key={l.label}><a href={l.href} className="hover:underline">{l.label}</a></li>)}
          </ul>
          <p>{footer.copyright}<br />{CREDITO}</p>
        </div>
      </div>
    </footer>
  );
});
