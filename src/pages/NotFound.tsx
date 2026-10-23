import { Trazo } from '../components/site/Trazo';
import { MaskTitle } from '../components/site/Bits';

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[100svh] grid-cols-12 items-center gap-x-4 gap-y-10 pb-16 pt-32">
      <div className="col-span-12 lg:col-span-6">
        <p className="kicker"><b>404</b> · Página no encontrada</p>
        <MaskTitle text="Este trazo no lleva a ningún lado" className="display mt-5" style={{ fontSize: 'var(--fs-hero)' }} />
        <p className="mt-6 max-w-[44ch] text-reading text-ink-2">Puede que la página haya cambiado de lugar. Volvé al inicio o buscá entre los artículos.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/" className="btn btn-primary">Volver al inicio</a>
          <a href="/blog/" className="btn btn-ghost">Ver el blog</a>
        </div>
      </div>
      <div className="col-span-10 col-start-2 sm:col-span-6 sm:col-start-4 lg:col-span-5 lg:col-start-8">
        <Trazo tipo="semilla" className="trazo-slow w-full" />
      </div>
    </section>
  );
}
