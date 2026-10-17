// Conexión a la base de datos (Supabase).
// Las claves se leen de .env.local (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY); nunca se escriben acá.
// Solo se usa la clave pública: la seguridad la ponen las reglas (RLS) de cada tabla.
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !key) {
  console.warn('[supabase] Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local');
}

export const supabase = createClient(url ?? '', key ?? '', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
