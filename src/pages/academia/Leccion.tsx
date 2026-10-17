// Lección: contenido literal de WordPress (texto + video), temario al costado, marcar como vista y anterior/siguiente.
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, List } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { Aviso, Barra, Cargando, Progreso } from './ui';

type Lec = { id: string; slug: string; titulo: string; orden: number };
type LecDet = Lec & { contenido: string; video_proveedor: 'vimeo' | 'youtube' | null; video_id: string | null };

export default function Leccion() {
  const { curso: cursoSlug, leccion: slug } = useParams();
  const a = useAuth();
  const [cargando, setCargando] = useState(true);
  const [curso, setCurso] = useState<{ id: string; slug: string; titulo: string } | null>(null);
  const [lecs, setLecs] = useState<Lec[]>([]);
  const [lec, setLec] = useState<LecDet | null>(null);
  const [hechas, setHechas] = useState(new Set<string>());
  const [guardando, setGuardando] = useState(false);
  const [temario, setTemario] = useState(false);

  useEffect(() => {
    if (!a.perfil || !cursoSlug || !slug) return;
    let vivo = true;
    setCargando(true); setTemario(false);
    window.scrollTo(0, 0);
    (async () => {
      const { data: c } = await supabase.from('cursos').select('id,slug,titulo').eq('slug', cursoSlug).maybeSingle();
      if (!c) { if (vivo) { setCurso(null); setCargando(false); } return; }
      const [{ data: l }, { data: d }, { data: p }] = await Promise.all([
        supabase.from('lecciones').select('id,slug,titulo,orden').eq('curso_id', c.id).order('orden'),
        supabase.from('lecciones').select('id,slug,titulo,orden,contenido,video_proveedor,video_id').eq('curso_id', c.id).eq('slug', slug).maybeSingle(),
        supabase.from('progreso').select('leccion_id').eq('perfil_id', a.perfil!.id).eq('completada', true),
      ]);
      if (!vivo) return;
      setCurso(c); setLecs((l ?? []) as Lec[]); setLec((d as LecDet | null) ?? null);
      setHechas(new Set((p ?? []).map((x: { leccion_id: string }) => x.leccion_id)));
      setCargando(false);
      if (d) {
        // "Retomar donde dejé" + última vista
        void supabase.from('ultima_leccion').upsert({ perfil_id: a.perfil!.id, curso_id: c.id, leccion_id: d.id, vista_en: new Date().toISOString() });
        void supabase.from('progreso').upsert({ perfil_id: a.perfil!.id, leccion_id: d.id, ultima_vista: new Date().toISOString() }, { onConflict: 'perfil_id,leccion_id' });
      }
    })();
    return () => { vivo = false; };
  }, [a.perfil, cursoSlug, slug]);

  const volverCurso = curso ? { href: `/academia/${curso.slug}/`, texto: curso.titulo } : { href: '/academia/', texto: 'Mis programas' };
  if (cargando) return <><Barra volver={volverCurso} /><Cargando /></>;
  if (!curso || !lec) return (
    <><Barra volver={volverCurso} /><div className="wrap py-16">
      <Aviso titulo="No podés ver esta lección">Puede que todavía no esté liberada o que sea parte de un programa al que no tenés acceso.</Aviso>
    </div></>
  );

  const i = lecs.findIndex((x) => x.id === lec.id);
  const prev = i > 0 ? lecs[i - 1] : null;
  const next = i < lecs.length - 1 ? lecs[i + 1] : null;
  const hecha = hechas.has(lec.id);
  const pct = lecs.length ? Math.round((100 * lecs.filter((x) => hechas.has(x.id)).length) / lecs.length) : 0;
  const html = lec.contenido.replace(/<!--[\s\S]*?-->/g, '');

  const marcar = async () => {
    setGuardando(true);
    const ahora = new Date().toISOString();
    const { error } = await supabase.from('progreso').upsert(
      { perfil_id: a.perfil!.id, leccion_id: lec.id, completada: !hecha, completada_en: !hecha ? ahora : null, ultima_vista: ahora },
      { onConflict: 'perfil_id,leccion_id' });
    if (!error) {
      const s = new Set(hechas);
      if (hecha) s.delete(lec.id); else s.add(lec.id);
      setHechas(s);
    }
    setGuardando(false);
  };

  const Temario = (
    <nav aria-label="Temario del curso">
      <p className="kicker"><b>Temario</b> · {lecs.length} lecciones</p>
      <div className="mt-3"><Progreso valor={pct} /></div>
      <ol className="mt-4">
        {lecs.map((x, n) => {
          const ok = hechas.has(x.id), actual = x.id === lec.id;
          return (
            <li key={x.id}>
              <Link to={`/academia/${curso.slug}/${x.slug}/`} aria-current={actual ? 'page' : undefined}
                className={`flex items-start gap-3 rounded-[14px] px-3 py-2.5 text-[15px] leading-snug ${actual ? 'bg-ink text-paper' : 'hover:bg-ink/5'}`}>
                <span className={`mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full text-[11px] ${ok ? 'bg-accent text-ink' : actual ? 'mono text-paper/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,.4)]' : 'mono text-ink-3 shadow-[inset_0_0_0_1px_var(--line-2)]'}`}>
                  {ok ? <Check size={13} aria-label="Completada" /> : n + 1}
                </span>
                <span>{x.titulo}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );

  return (
    <>
      <Barra volver={volverCurso} />
      <div className="wrap grid grid-cols-12 gap-x-6 gap-y-8 pb-[14svh] pt-8 lg:pt-12">
        <aside className="col-span-12 hidden lg:col-span-4 lg:block xl:col-span-3">
          <div className="sticky top-24 max-h-[calc(100svh-7rem)] overflow-y-auto pr-2" data-lenis-prevent>{Temario}</div>
        </aside>

        <article className="col-span-12 lg:col-span-8 xl:col-span-9 xl:pl-6">
          <div className="flex items-center justify-between gap-4">
            <p className="mono text-[13px] text-ink-3">Lección {i + 1} de {lecs.length}</p>
            <button type="button" onClick={() => setTemario(!temario)} className="btn btn-ghost !min-h-11 !px-4 !text-[15px] lg:hidden" aria-expanded={temario}>
              <List size={16} aria-hidden /> Temario
            </button>
          </div>
          {temario && <div className="mt-4 rounded-[22px] p-4 shadow-[inset_0_0_0_1px_var(--line-2)] lg:hidden">{Temario}</div>}
          <h1 className="mt-3 max-w-[24ch] font-display font-semibold leading-[1.06] tracking-[-0.025em]" style={{ fontSize: 'clamp(30px, 3.4vw, 54px)' }}>{lec.titulo}</h1>

          {lec.video_proveedor && lec.video_id && (
            <div className="mt-8 aspect-video overflow-hidden rounded-[22px] bg-ink">
              <iframe className="h-full w-full" title={lec.titulo} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
                src={lec.video_proveedor === 'vimeo' ? `https://player.vimeo.com/video/${lec.video_id}` : `https://www.youtube-nocookie.com/embed/${lec.video_id}`} />
            </div>
          )}

          {html.trim()
            ? <div className="wp-content prose-egs mt-8 !max-w-[78ch]" dangerouslySetInnerHTML={{ __html: html }} />
            : <p className="mt-8 text-body text-ink-3">Esta lección no tiene texto.</p>}

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t hairline pt-8">
            <button type="button" onClick={marcar} disabled={guardando}
              className={`btn ${hecha ? 'btn-ghost' : 'btn-primary'}`} aria-pressed={hecha}>
              <Check size={18} aria-hidden /> {hecha ? 'Vista · desmarcar' : 'Marcar como vista'}
            </button>
            <div className="flex flex-wrap gap-3">
              {prev && <Link to={`/academia/${curso.slug}/${prev.slug}/`} className="btn btn-ghost"><ArrowLeft size={18} aria-hidden /> Anterior</Link>}
              {next
                ? <Link to={`/academia/${curso.slug}/${next.slug}/`} className="btn btn-ghost">Siguiente <ArrowRight size={18} aria-hidden /></Link>
                : <Link to={`/academia/${curso.slug}/`} className="btn btn-ghost">Volver al curso</Link>}
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
