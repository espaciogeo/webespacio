import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import type { RouteData } from './types';

declare global { interface Window { __EGS__?: RouteData } }

// Cada página llega prerenderizada con sus datos embebidos. En desarrollo se calculan al vuelo.
async function boot() {
  let data = window.__EGS__;
  if (!data && import.meta.env.DEV) {
    const { dataFor } = await import('./server/data');
    data = dataFor(location.pathname);
    document.title = data.head.title;
  }
  if (!data) data = { type: '404', head: { title: 'Página no encontrada', description: '', canonical: '', image: '', noindex: true, type: 'website' } };
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App data={data!} />
      </BrowserRouter>
    </StrictMode>,
  );
}
boot();
