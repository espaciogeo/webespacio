// Piezas compartidas de la academia.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, KeyRound, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth, nombreDe } from '../../lib/auth';

export function Cargando({ texto = 'Cargando…' }: { texto?: string }) {
  return (
    <div className="wrap grid min-h-[70svh] place-items-center pt-24" role="status">
      <div className="flex flex-col items-center gap-5">
        <svg viewBox="-2.2 -2.2 4.4 4.4" className="h-16 w-16 animate-[spin_6s_linear_infinite]" aria-hidden="true">
          <g fill="none" stroke="var(--ink)" strokeWidth={0.06}>
            <circle r={1} />
            {[0, 1, 2, 3, 4, 5].map((k) => <circle key={k} r={1} cx={Math.cos((k * Math.PI) / 3)} cy={Math.sin((k * Math.PI) / 3)} opacity={0.45} />)}
          </g>
        </svg>
        <p className="kicker">{texto}</p>
      </div>
    </div>
  );
}

export function Barra({ volver }: { volver?: { href: string; texto: string } }) {
  const a = useAuth();
  const [clave, setClave] = useState(false);
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: pass });
    setMsg(error ? 'No se pudo guardar: ' + error.message : 'Listo. La próxima vez podés entrar con tu email y esta contraseña.');
    if (!error) setPass('');
  };
  return (
    <div className="border-b hairline">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-5 pt-24 lg:pt-28">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {volver ? (
            <Link to={volver.href} className="link-arrow !min-h-0 !no-underline">← {volver.texto}</Link>
          ) : (
            <p className="kicker"><b>Academia</b> · Espacio de Geometría Sagrada</p>
          )}
          {a.esEquipo && <span className="mono rounded-full bg-accent/20 px-3 py-1 text-[12px] text-accent-ink">vista del equipo</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-small text-ink-2 sm:inline">{nombreDe(a.perfil)}</span>
          <button type="button" onClick={() => { setClave(!clave); setMsg(null); }} className="grid h-11 w-11 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--line-2)] hover:bg-ink hover:text-paper" aria-label="Crear o cambiar contraseña" title="Crear o cambiar contraseña">
            <KeyRound size={18} aria-hidden />
          </button>
          <button type="button" onClick={() => a.salir()} className="grid h-11 w-11 place-items-center rounded-full shadow-[inset_0_0_0_1px_var(--line-2)] hover:bg-ink hover:text-paper" aria-label="Salir" title="Salir">
            <LogOut size={18} aria-hidden />
          </button>
        </div>
      </div>
      {clave && (
        <form onSubmit={guardar} className="wrap flex flex-wrap items-end gap-3 pb-6">
          <label className="grid gap-2">
            <span className="text-small text-ink-2">Nueva contraseña (mínimo 8 caracteres)</span>
            <input type="password" required minLength={8} value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="new-password"
              className="h-12 w-[min(360px,80vw)] rounded-[14px] px-4 text-body outline-none ring-1 ring-[var(--line-2)] focus:ring-2 focus:ring-[var(--accent)]" />
          </label>
          <button className="btn btn-primary !min-h-12">Guardar</button>
          {msg && <p className="w-full text-small text-ink-2" role="status">{msg}</p>}
        </form>
      )}
    </div>
  );
}

export function Progreso({ valor, claro = false }: { valor: number; claro?: boolean }) {
  return (
    <div className="flex items-center gap-3" aria-label={`${valor}% completado`}>
      <div className={`h-1.5 flex-1 overflow-hidden rounded-full ${claro ? 'bg-paper/20' : 'bg-[var(--line)]'}`}>
        <i className="block h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${valor}%` }} />
      </div>
      <span className={`mono text-[12px] ${claro ? 'text-paper/70' : 'text-ink-3'}`}>{valor}%</span>
    </div>
  );
}

export type CursoFila = { id: string; slug: string; titulo: string; estado: string; imagen: { ruta: string } | null; total: number; hechas: number };

export function CursoCard({ c }: { c: CursoFila }) {
  const pct = c.total ? Math.round((100 * c.hechas) / c.total) : 0;
  return (
    <Link to={`/academia/${c.slug}/`} className="group flex flex-col overflow-hidden rounded-[22px] shadow-[inset_0_0_0_1px_var(--line-2)] transition-shadow hover:shadow-[inset_0_0_0_1.5px_var(--ink)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-paper">
        {c.imagen?.ruta
          ? <img src={c.imagen.ruta} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          : <Semilla />}
        {c.estado !== 'publicado' && <span className="mono absolute left-3 top-3 rounded-full bg-paper px-3 py-1 text-[11px] text-ink-2 shadow">borrador</span>}
        {c.total > 0 && c.hechas === c.total && <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-accent text-ink"><Check size={16} aria-label="Completado" /></span>}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-[19px] font-semibold leading-snug tracking-[-0.01em]">{c.titulo}</h3>
        <p className="mono text-[12px] text-ink-3">{c.total ? `${c.total} lecciones` : 'Sin lecciones · acceso'}</p>
        <div className="mt-auto">{c.total > 0 && <Progreso valor={pct} />}</div>
      </div>
    </Link>
  );
}

export function Semilla() {
  return (
    <svg viewBox="-3 -2 6 4" className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <g fill="none" stroke="var(--pencil)" strokeWidth={0.02}>
        <circle r={1} />
        {[0, 1, 2, 3, 4, 5].map((k) => <circle key={k} r={1} cx={Math.cos((k * Math.PI) / 3)} cy={Math.sin((k * Math.PI) / 3)} />)}
        <circle r={2} />
      </g>
    </svg>
  );
}

export function Aviso({ titulo, children }: { titulo: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-[22px] p-7 shadow-[inset_0_0_0_1px_var(--line-2)] lg:p-9">
      <h2 className="font-display text-[clamp(22px,2vw,28px)] font-semibold leading-tight">{titulo}</h2>
      {children && <div className="mt-3 max-w-[60ch] text-body text-ink-2">{children}</div>}
    </div>
  );
}

// Avance por curso a partir de las lecciones y el progreso del alumno
export async function avancePorCurso(cursoIds: string[], perfilId: string) {
  if (!cursoIds.length) return new Map<string, { total: number; hechas: number }>();
  const [{ data: lecs }, { data: prog }] = await Promise.all([
    supabase.from('lecciones').select('id,curso_id').in('curso_id', cursoIds),
    supabase.from('progreso').select('leccion_id').eq('perfil_id', perfilId).eq('completada', true),
  ]);
  const hechas = new Set((prog ?? []).map((p: { leccion_id: string }) => p.leccion_id));
  const m = new Map<string, { total: number; hechas: number }>();
  for (const l of (lecs ?? []) as { id: string; curso_id: string }[]) {
    const v = m.get(l.curso_id) ?? { total: 0, hechas: 0 };
    v.total++; if (hechas.has(l.id)) v.hechas++;
    m.set(l.curso_id, v);
  }
  return m;
}

export const fecha = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
