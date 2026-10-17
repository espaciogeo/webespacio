import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  // Sitio multipágina prerenderizado: sin fallback SPA (las rutas inexistentes dan 404).
  // En desarrollo (npm run dev) todas las rutas sirven index.html y la app arma la página al vuelo.
  appType: command === 'serve' && !isPreview ? 'spa' : 'mpa',
  // permite abrir el preview desde un túnel público (cloudflared)
  preview: { allowedHosts: true },
  server: { allowedHosts: true },
}));
