// Inicio de la academia: retomar, mis programas (con el WhatsApp de la cohorte) y, para el equipo, todos los cursos.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth, nombreDe } from '../../lib/auth';
import { Aviso, Barra, Cargando, CursoCard, avancePorCurso, fecha, type CursoFila } from './ui';

type Inscripcion = {
  id: string; estado: string; fecha_fin: string | null;
  programa: { id: string; nombre: string; programa_cursos: { orden: number; curso: Omit<CursoFila, 'total' | 'hechas'> | null }[] } | null;
  cohorte: { codigo: string; nombre: string; whatsapp_url: string | null; whatsapp_nombre: string | null } | null;
};
type Ultima = { vista_en: string; leccion: { slug: string; titulo: string } | null; curso: { slug: string; titulo: string } | null };

export default function Inicio() {
  const a = useAuth();
  const [cargando, setCargando] = useState(true);
  const [insc, setInsc] = useState<Inscripcion[]>([]);
  const [todos, setTodos] = useState<Omit<CursoFila, 'total' | 'hechas'>[]>([]);
  const [avance, setAvance] = useState(new Map<string, { total: number; hechas: number }>());
  const [ultima, setUltima] = useState<Ultima | null>(null);
  const [q, setQ] = useState('');
  const [verBorradores, setVerBorradores] = useState(false);

  useEffect(() => {
    if (!a.perfil) return;
    let vivo = true;
    (async () => {
      const cursoSel = 'id,slug,titulo,estado,imagen:medios(ruta)';
      const [i, u, t] = await Promise.all([
        supabase.from('inscripciones')
          .select(`id,estado,fecha_fin,programa:programas(id,nombre,programa_cursos(orden,curso:cursos(${cursoSel}))),cohorte:cohortes(codigo,nombre,whatsapp_url,whatsapp_nombre)`)
          .eq('perfil_id', a.perfil!.id).in('estado', ['activa', 'completada', 'pausada']),
        supabase.from('ultima_leccion').select('vista_en,leccion:lecciones(slug,titulo),curso:cursos(slug,titulo)')
          .eq('perfil_id', a.perfil!.id).order('vista_en', { ascending: false }).limit(1).maybeSingle(),
        a.esEquipo ? supabase.from('cursos').select(cursoSel).order('titulo') : Promise.resolve({ data: [] }),
      ]);
      const ins = (i.data ?? []) as unknown as Inscripcion[];
      const tod = (t.data ?? []) as unknown as Omit<CursoFila, 'total' | 'hechas'>[];
      const ids = new Set<string>(tod.map((c) => c.id));
      ins.forEach((x) => x.programa?.programa_cursos.forEach((pc) => pc.curso && ids.add(pc.curso.id)));
      const av = await avancePorCurso([...ids], a.perfil!.id);
      if (!vivo) return;
      setInsc(ins); setTodos(tod); setAvance(av); setUltima((u.data as unknown as Ultima) ?? null); setCargando(false);
    })();
    return () => { vivo = false; };
  }, [a.perfil, a.esEquipo]);

  const fila = (c: Omit<CursoFila, 'total' | 'hechas'>): CursoFila => ({ ...c, total: avance.get(c.id)?.total ?? 0, hechas: avance.get(c.id)?.hechas ?? 0 });
  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    return todos.filter((c) => (verBorradores || c.estado === 'publicado') && (!t || c.titulo.toLowerCase().includes(t)));
  }, [todos, q, verBorradores]);

  if (cargando) return <><Barra /><Cargando texto="Preparando tu academia…" /></>;

  return (
    <>
      <Barra />
      <section className="wrap pb-10 pt-10 lg:pt-14">
        <h1 className="font-display font-semibold leading-[1] tracking-[-0.03em]" style={{ fontSize: 'clamp(38px, 5vw, 80px)' }}>
          Hola, {nombreDe(a.perfil)}.
        </h1>
        {a.perfil?.ultimo_ingreso && (
          <p className="mono mt-4 text-[13px] text-ink-3">Último ingreso: {fecha(a.perfil.ultimo_ingreso)} · {a.perfil.cantidad_ingresos} ingresos</p>
        )}
      </section>

      {ultima?.leccion && ultima.curso && (
        <section className="wrap pb-12">
          <Link to={`/academia/${ultima.curso.slug}/${ultima.leccion.slug}/`}
            className="group flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-ink p-7 text-paper sm:p-10">
            <div>
              <p className="kicker !text-paper/60">Retomá donde dejaste</p>
              <p className="mt-3 font-display text-[clamp(22px,2.4vw,34px)] font-semibold leading-tight">{ultima.leccion.titulo}</p>
              <p className="mt-2 text-paper/70">{ultima.curso.titulo}</p>
            </div>
            <span className="btn btn-primary">Continuar <ArrowRight size={18} aria-hidden /></span>
          </Link>
        </section>
      )}

      <section className="wrap pb-[10svh]">
        <h2 className="kicker"><b>01</b> · Mis programas</h2>
        {insc.length === 0 ? (
          <div className="mt-6">
            <Aviso titulo={a.esEquipo ? 'No tenés programas asignados como alumno' : 'Todavía no tenés programas activos'}>
              {a.esEquipo
                ? 'Como sos parte del equipo, abajo ves todos los cursos de la plataforma.'
                : <>Si ya te inscribiste y no ves tu programa, escribinos a <a className="underline" href="mailto:info@espaciodegeometriasagrada.com">info@espaciodegeometriasagrada.com</a>.</>}
            </Aviso>
          </div>
        ) : insc.map((x) => (
          <div key={x.id} className="mt-8 border-t hairline pt-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="font-display text-[clamp(24px,2.4vw,36px)] font-semibold leading-tight">{x.programa?.nombre}</h3>
                <p className="mono mt-2 text-[13px] text-ink-3">
                  {x.cohorte ? `Cohorte ${x.cohorte.nombre} · ` : ''}
                  {x.estado === 'pausada' ? 'acceso pausado' : x.fecha_fin ? `acceso hasta el ${fecha(x.fecha_fin)}` : 'acceso de por vida'}
                </p>
              </div>
              {x.cohorte?.whatsapp_url && (
                <a href={x.cohorte.whatsapp_url} target="_blank" rel="noopener" className="btn btn-ghost">
                  <MessageCircle size={18} aria-hidden /> {x.cohorte.whatsapp_nombre || 'Grupo de WhatsApp'}
                </a>
              )}
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(x.programa?.programa_cursos ?? []).slice().sort((p, q2) => p.orden - q2.orden)
                .filter((pc) => pc.curso).map((pc) => <CursoCard key={pc.curso!.id} c={fila(pc.curso!)} />)}
            </div>
          </div>
        ))}
      </section>

      {a.esEquipo && (
        <section className="wrap border-t hairline pb-[14svh] pt-[8svh]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="kicker"><b>02</b> · Todos los cursos</h2>
              <p className="mt-3 font-display text-[clamp(24px,2.4vw,36px)] font-semibold leading-tight">
                {filtrados.length} cursos <span className="text-ink-3">· importados de WordPress</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="relative">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-3" aria-hidden />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar curso" aria-label="Buscar curso"
                  className="h-12 w-[min(300px,80vw)] rounded-full pl-11 pr-5 text-body outline-none ring-1 ring-[var(--line-2)] focus:ring-2 focus:ring-[var(--accent)]" />
              </label>
              <label className="flex min-h-12 items-center gap-2 text-small text-ink-2">
                <input type="checkbox" checked={verBorradores} onChange={(e) => setVerBorradores(e.target.checked)} className="h-5 w-5 accent-[#094372]" />
                Ver borradores
              </label>
            </div>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtrados.map((c) => <CursoCard key={c.id} c={fila(c)} />)}
          </div>
          {todos.length === 0 && (
            <div className="mt-6"><Aviso titulo="Todavía no hay cursos cargados">Corré el script de importación en Supabase (SQL Editor) y recargá esta página.</Aviso></div>
          )}
        </section>
      )}
    </>
  );
}
