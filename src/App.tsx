import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import type { RouteData } from './types';
import { SiteLayout } from './components/site/SiteLayout';
import Home from './pages/Home';
import WpPage from './pages/WpPage';
import QueHacemos from './pages/QueHacemos';
import QuienesSomos from './pages/QuienesSomos';
import FormacionProfesional from './pages/FormacionProfesional';
import EspecializacionTerapias from './pages/EspecializacionTerapias';
import EspecializacionArmonizacion from './pages/EspecializacionArmonizacion';
import Experiencias from './pages/Experiencias';
import ClaseGratuita from './pages/ClaseGratuita';
import Archive from './pages/Archive';
import Article from './pages/Article';
import NotFound from './pages/NotFound';
import Collection from './pages/Collection';

// La academia (con Supabase) se descarga solo cuando se entra a /ingresar o /academia.
const AppArea = lazy(() => import('./pages/academia/AppArea'));

// Cada HTML prerenderizado trae sus datos; React Router resuelve la ruta y el tipo elige la plantilla.
function View({ data }: { data: RouteData }) {
  switch (data.type) {
    case 'home': return <Home latest={data.latest} />;
    case 'clase': return <ClaseGratuita />;
    case 'page': return data.page.slug === 'que-hacemos' ? <QueHacemos page={data.page} latest={data.latest} /> : data.page.path === '/quienes-somos/' ? <QuienesSomos page={data.page} /> : data.page.path === '/formaciones/formacion-profesional/' ? <FormacionProfesional page={data.page} /> : data.page.path === '/formaciones/especializacion-en-terapias/' ? <EspecializacionTerapias page={data.page} /> : data.page.path === '/formaciones/armonizacion-de-espacios/' ? <EspecializacionArmonizacion page={data.page} /> : data.page.path === '/formaciones/experiencias/' ? <Experiencias page={data.page} /> : <WpPage page={data.page} />;
    case 'archive': return <Archive data={data} />;
    case 'collection': return <Collection data={data.collection} />;
    case 'app': return <Suspense fallback={<div className="min-h-[70svh]" />}><AppArea /></Suspense>;
    case 'post': return <Article post={data.post} related={data.related} prev={data.prev} next={data.next} />;
    default: return <NotFound />;
  }
}

export default function App({ data }: { data: RouteData }) {
  return (
    <Routes>
      <Route element={<SiteLayout isHome={data.type === 'home'} />}>
        <Route path="*" element={<View data={data} />} />
      </Route>
    </Routes>
  );
}
