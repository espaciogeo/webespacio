// Página de un curso: temario con el avance del alumno y botón para empezar o continuar.
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { Aviso, Barra, Cargando, Progreso, Semilla } from './ui';

type CursoDet = { id: string; slug: string; titulo: string; descripcion: string | null; estado: string; imagen: { ruta: string } | null };
type Lec = { id: string; slug: string; titulo: string; orden: number };

export default function Curso() {
  const { curso: slug } = useParams();
  const a = useAuth();
  const [cargando, setCargando] = useState(true);
  const [curso, setCurso] = useState<CursoDet | null>(null);
  const [lecs, setLecs] = useState<Lec[]>([]);
  const [hechas, setHechas] = useState(new Set<string>());
  const [ultima, setUltima] = useState<string | null>(null);

  useEffect(() => {
    if (!a.perfil || !slug) return;
    let vivo = true;
    (async () => {
      const { data: c } = await supabase.from('cursos').select('id,slug,titulo,descripcion,estado,imagen:medios(ruta)').eq('slug', slug).maybeSingle();
      if (!c) { if (vivo) { setCurso(null); setCargando(false); } return; }
      const [{ data: l }, { data: p }, { data: u }] = await Promise.all([
        supabase.from('lecciones').select('id,slug,titulo,orden').eq('curso_id', c.id).order('orden'),
        supabase.from('progreso').select('leccion_id').eq('perfil_id', a.perfil!.id).eq('completada', true),
        supabase.from('ultima_leccion').select('leccion_id').eq('perfil_id', a.perfil!.id).eq('curso_id', c.id).maybeSingle(),
      ]);
      if (!vivo) return;
      setCurso(c as unknown as CursoDet);
      setLecs((l ?? []) as Lec[]);
      setHechas(new Set((p ?? []).map((x: { leccion_id: string }) => x.leccion_id)));
      setUltima((u as { leccion_id: string } | null)?.leccion_id ?? null);
      setCargando(false);
    })();
    return () => { vivo = false; };
  }, [a.perfil, slug]);

  const volver = { href: '/academia/', texto: 'Mis programas' };
  if (cargando) return <><Barra volver={volver} /><Cargando /></>;
  if (!curso) return (
    <><Barra volver={volver} /><div className="wrap py-16"><Aviso titulo="No encontramos este curso">Puede que el link esté mal o que todavía no tengas acceso.</Aviso></div></>
  );

  const total = lecs.length;
  const n = lecs.filter((l) => hechas.has(l.id)).length;
  const pct = total ? Math.round((100 * n) / total) : 0;
  const siguiente = lecs.find((l) => l.id === ultima) ?? lecs.find((l) => !hechas.has(l.id)) ?? lecs[0];
  const desc = (curso.descripcion ?? '').replace(/<!--[\s\S]*?-->/g, '').trim();

  return (
    <>
      <Barra volver={volver} />
      <section className="wrap grid grid-cols-12 items-end gap-x-4 gap-y-8 pb-12 pt-10 lg:pt-14">
        <div className="col-span-12 lg:col-span-7">
          <p className="kicker">Curso{curso.estado !== 'publicado' ? ' · borrador' : ''}</p>
          <h1 className="mt-4 font-display font-semibold leading-[1.02] tracking-[-0.03em]" style={{ fontSize: 'clamp(34px, 4.4vw, 72px)' }}>{curso.titulo}</h1>
          <p className="mono mt-5 text-[13px] text-ink-3">{total} lecciones · {n} completadas</p>
          {total > 0 && <div className="mt-4 max-w-[420px]"><Progreso valor={pct} /></div>}
          {siguiente && (
            <Link to={`/academia/${curso.slug}/${siguiente.slug}/`} className="btn btn-primary mt-8">
              {n === 0 ? 'Empezar el curso' : n === total ? 'Repasar desde el inicio' : 'Continuar'} <ArrowRight size={18} aria-hidden />
            </Link>
          )}
        </div>
        <div className="col-span-12 aspect-[16/10] overflow-hidden rounded-[22px] shadow-[inset_0_0_0_1px_var(--line)] lg:col-span-5">
          {curso.imagen?.ruta ? <img src={curso.imagen.ruta} alt="" className="h-full w-full object-cover" /> : <Semilla />}
        </div>
      </section>

      <section className="wrap grid grid-cols-12 gap-x-4 gap-y-10 border-t hairline pb-[14svh] pt-10">
        <div className="col-span-12 lg:col-span-7">
          <h2 className="kicker"><b>Temario</b></h2>
          {total === 0 ? (
            <div className="mt-6"><Aviso titulo="Este curso no tiene lecciones">En WordPress funcionaba como contenedor de acceso a otros cursos.</Aviso></div>
          ) : (
            <ol className="mt-4">
              {lecs.map((l, i) => {
                const ok = hechas.has(l.id);
                return (
                  <li key={l.id} className="border-b hairline">
                    <Link to={`/academia/${curso.slug}/${l.slug}/`} className="group flex min-h-[64px] items-center gap-4 py-3">
                      <span className={`grid h-9 w-9 flex-none place-items-center rounded-full text-[13px] ${ok ? 'bg-accent text-ink' : 'mono text-ink-3 shadow-[inset_0_0_0_1px_var(--line-2)]'}`}>
                        {ok ? <Check size={16} aria-label="Completada" /> : String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-[18px] leading-snug group-hover:text-ink">{l.titulo}</span>
                      {l.id === ultima && <span className="mono hidden text-[12px] text-accent-ink sm:inline">acá te quedaste</span>}
                      <ArrowRight size={18} className="text-ink-3 transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
        {desc && (
          <aside className="col-span-12 lg:col-span-4 lg:col-start-9">
            <h2 className="kicker"><b>Sobre este curso</b></h2>
            <div className="wp-content prose-egs mt-4 !text-[17px]" dangerouslySetInnerHTML={{ __html: desc }} />
          </aside>
        )}
      </section>
    </>
  );
}
