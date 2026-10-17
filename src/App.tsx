import { Route, Routes } from 'react-router-dom';
import type { RouteData } from './types';
import { SiteLayout } from './components/site/SiteLayout';
import Home from './pages/Home';
import WpPage from './pages/WpPage';
import QueHacemos from './pages/QueHacemos';
import ClaseGratuita from './pages/ClaseGratuita';
import Archive from './pages/Archive';
import Article from './pages/Article';
import NotFound from './pages/NotFound';
import Collection from './pages/Collection';

// Cada HTML prerenderizado trae sus datos; React Router resuelve la ruta y el tipo elige la plantilla.
function View({ data }: { data: RouteData }) {
  switch (data.type) {
    case 'home': return <Home />;
    case 'clase': return <ClaseGratuita />;
    case 'page': return data.page.slug === 'que-hacemos' ? <QueHacemos page={data.page} /> : <WpPage page={data.page} />;
    case 'archive': return <Archive data={data} />;
    case 'collection': return <Collection data={data.collection} />;
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
