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
import { Cierre } from '../components/Cierre';

export default function Home() {
  return (
    <div className="home-white">
      <Loader />
      <Hero />
      <Manifiesto />
      <Pilares />
      <Solidos />
      <Propuestas />
      <Cifras />
      <Testimonios />
      <Equipo />
      <Blog />
      <Cierre />
    </div>
  );
}
