import { Loader } from '../components/Loader';
import { Hero } from '../components/Hero';
import { Manifiesto } from '../components/Manifiesto';
import { Pilares } from '../components/Pilares';
import { Solidos } from '../components/Solidos';
import { Propuestas } from '../components/Propuestas';
import { Cifras } from '../components/Cifras';
import { Testimonios } from '../components/Testimonios';
import { Equipo } from '../components/Equipo';
import { Blog } from '../components/Blog';
import { Cierre, PreguntasFrecuentes } from '../components/Cierre';
import type { PostCard } from '../types';

export default function Home({ latest }: { latest?: PostCard[] }) {
  return (
    <div className="home-white">
      <Loader />
      <Hero />
      <Propuestas />
      <Pilares />
      <Solidos />
      <Manifiesto />
      <Cifras />
      <Testimonios />
      <Cierre />
      <Equipo />
      <Blog posts={latest} />
      <PreguntasFrecuentes />
    </div>
  );
}
