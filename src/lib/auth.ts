// Sesión del alumno: un único estado compartido por toda la academia.
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type Perfil = { id: string; email: string; nombre: string; apellido: string; ultimo_ingreso: string | null; cantidad_ingresos: number };
type Estado = { cargando: boolean; session: Session | null; perfil: Perfil | null; roles: string[] };

let estado: Estado = { cargando: true, session: null, perfil: null, roles: [] };
const subs = new Set<(e: Estado) => void>();
const set = (p: Partial<Estado>) => { estado = { ...estado, ...p }; subs.forEach((f) => f(estado)); };

async function cargar(s: Session | null) {
  if (!s) { set({ cargando: false, session: null, perfil: null, roles: [] }); return; }
  const [{ data: perfil }, { data: roles }] = await Promise.all([
    supabase.from('perfiles').select('id,email,nombre,apellido,ultimo_ingreso,cantidad_ingresos').eq('id', s.user.id).maybeSingle(),
    supabase.from('usuario_roles').select('rol').eq('perfil_id', s.user.id),
  ]);
  set({ cargando: false, session: s, perfil: (perfil as Perfil | null) ?? null, roles: (roles ?? []).map((r: { rol: string }) => r.rol) });
  void supabase.rpc('registrar_actividad');
}

let iniciado = false;
function iniciar() {
  if (iniciado) return;
  iniciado = true;
  // No se llama a Supabase dentro del callback (puede trabar la sesión): se difiere un instante.
  supabase.auth.onAuthStateChange((_evento, s) => {
    if (s?.access_token === estado.session?.access_token && !estado.cargando) return;
    setTimeout(() => { void cargar(s); }, 0);
  });
}

export function useAuth() {
  const [e, setE] = useState(estado);
  useEffect(() => {
    iniciar();
    subs.add(setE);
    setE(estado);
    return () => { subs.delete(setE); };
  }, []);
  const esEquipo = e.roles.some((r) => r === 'admin' || r === 'soporte' || r === 'editor');
  const esFormador = e.roles.includes('formador');
  return { ...e, esEquipo, esFormador, salir: () => supabase.auth.signOut() };
}

export const nombreDe = (p: Perfil | null) => (p ? (p.nombre || p.email.split('@')[0]) : '');
