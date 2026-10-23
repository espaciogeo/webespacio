import { ArrowUpRight } from 'lucide-react';
import type { PageData } from '../types';
import { PageHero, Accordion } from '../components/site/Bits';
import { Sections } from '../components/site/Sections';
import { trazoFor, type TrazoTipo } from '../components/site/Trazo';
import { faq } from '../content';

const KICKER: Record<PageData['kind'], string> = {
  institucional: 'Espacio de Geometría Sagrada',
  legal: 'Legales',
  producto: 'Propuesta',
  confirmacion: 'Confirmación',
};
const FAQ_PAGES = new Set(['cursos', 'formacion-profesional']);

// Plantilla de páginas: institucionales, de producto (formaciones, eventos, eBooks, libro), legales y de confirmación.
export default function WpPage({ page }: { page: PageData }) {
  const blocks = page.sections.flatMap((s) => s.blocks);
  const hasForm = blocks.some((b) => b.t === 'form');
  const firstBtn = blocks.find((b) => b.t === 'button' && b.href) as { text: string; href: string } | undefined;
  const cta = page.cta ?? (page.kind === 'producto' ? (hasForm ? { text: 'Quiero inscribirme', href: '#formulario' } : firstBtn) : undefined);
  const legal = page.kind === 'legal';
  const faqItems = page.faq ?? (FAQ_PAGES.has(page.slug) ? faq.map((f) => ({ title: f.q, html: `<p>${f.a}</p>` })) : null);
  const ext = cta && /^https?:/.test(cta.href);
  return (
    <>
      <PageHero
        kicker={page.hero?.kicker ?? `${KICKER[page.kind]}${legal && page.modified ? ` · actualizado ${page.modified}` : ''}`}
        title={page.title}
        lede={page.hero?.lede ?? (page.seo.description || undefined)}
        trazo={(page.hero?.trazo as TrazoTipo) ?? trazoFor(page.slug)}
        facts={page.hero?.facts}
        image={page.hero?.image}
        breadcrumb={page.breadcrumb}
      >
        {cta && (
          <a href={cta.href} {...(ext ? { target: '_blank', rel: 'noopener' } : {})} className="btn btn-primary mt-8 hidden lg:inline-flex">
            {cta.text}{ext && <ArrowUpRight size={18} aria-hidden />}
          </a>
        )}
      </PageHero>

      <Sections sections={page.sections} narrow={legal} sinMargen={page.path === '/formaciones/formacion-profesional/'} />

      {faqItems && faqItems.length > 0 && (
        <section id="preguntas" className="wrap border-t hairline py-[10svh]" data-rv>
          <div className="grid grid-cols-12 gap-x-4 gap-y-8">
            <div className="col-span-12 lg:col-span-4">
              <p className="kicker">Preguntas frecuentes</p>
              <h2 className="h-section mt-3" style={{ fontSize: 'var(--fs-h2)' }}>Antes de empezar</h2>
              {page.faqNote && <p className="mt-6 max-w-[40ch] text-body text-ink-2">{page.faqNote}</p>}
            </div>
            <div className="col-span-12 min-w-0 lg:col-span-7 lg:col-start-6"><Accordion items={faqItems} /></div>
          </div>
        </section>
      )}

      {/* CTA fijo en móvil para páginas de producto */}
      {cta && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t hairline bg-paper/95 p-3 backdrop-blur lg:hidden">
          <a href={cta.href} {...(ext ? { target: '_blank', rel: 'noopener' } : {})} className="btn btn-primary w-full">{cta.text}</a>
        </div>
      )}
      {cta && <div className="h-20 lg:hidden" aria-hidden="true" />}
    </>
  );
}
