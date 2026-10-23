import { ClaseCard } from '../components/ClaseCard';
import { Accordion, PageHero } from '../components/site/Bits';
import { MediaImgLocal } from './shared';
import { clase, faq } from '../content';

// /clase-gratuita/ no existe en el sitio actual (devuelve 404 aunque los botones apuntan ahí):
// se arma con los textos reales de la clase y el formulario real de la home.
export default function ClaseGratuita() {
  return (
    <>
      <PageHero kicker="Propuesta · gratuita" title="Clase gratuita mensual" lede={clase.texto} trazo="vesica" />
      <section className="wrap pb-[8svh]">
        <div className="grid overflow-hidden rounded-[28px] bg-ink lg:grid-cols-12">
          <div className="p-6 sm:p-9 lg:col-span-8 lg:p-12"><ClaseCard /></div>
          <div className="relative hidden lg:col-span-4 lg:block">
            <MediaImgLocal name="taller-grupo" alt="Grupo de estudiantes en un taller presencial" />
          </div>
        </div>
      </section>
      <section className="wrap border-t hairline py-[10svh]">
        <div className="grid grid-cols-12 gap-x-4 gap-y-8">
          <div className="col-span-12 lg:col-span-4">
            <p className="kicker">Preguntas frecuentes</p>
            <h2 className="h-section mt-3" style={{ fontSize: 'var(--fs-h2)' }}>Antes de empezar</h2>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6"><Accordion items={faq.map((f) => ({ title: f.q, text: f.a }))} /></div>
        </div>
      </section>
    </>
  );
}
