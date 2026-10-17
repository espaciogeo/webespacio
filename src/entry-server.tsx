import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { routes, notFound, movedRedirects, subdomainRedirects } from './server/data';
import type { RouteData } from './types';

export { routes, movedRedirects, subdomainRedirects };
export function render(url: string, data: RouteData = notFound()) {
  const html = renderToString(
    <StaticRouter location={url}>
      <App data={data} />
    </StaticRouter>,
  );
  return { html, data };
}
export const notFoundData = notFound;
