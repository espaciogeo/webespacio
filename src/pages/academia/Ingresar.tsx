// Ingreso a la academia: email + contraseña. Las cuentas las crea el equipo o se crean al comprar.
import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { Trazo } from '../../components/site/Trazo';
import { Cargando } from './ui';

export default function Ingresar() {
  const a = useAuth();
  const [params] = useSearchParams();
  const volver = params.get('volver')?.startsWith('/academia') ? params.get('volver')! : '/academia/';
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  if (a.cargando) return <Cargando />;
  if (a.session) return <Navigate to={volver} replace />;

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true); setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: pass });
    if (err) setError(traducir(err.message));
    setEnviando(false);
  };

  const input = 'h-14 w-full rounded-[16px] px-5 text-body outline-none ring-1 ring-[var(--line-2)] focus:ring-2 focus:ring-[var(--accent)]';
  return (
    <section className="wrap grid min-h-[100svh] grid-cols-12 items-center gap-x-4 gap-y-10 pb-16 pt-28 lg:pt-32">
      <div className="col-span-12 lg:col-span-6">
        <p className="kicker"><b>Academia</b> · Acceso estudiantes</p>
        <h1 className="mt-5 font-display font-semibold leading-[0.98] tracking-[-0.035em]" style={{ fontSize: 'clamp(44px, 6vw, 96px)' }}>
          Tu espacio<br />de estudio.
        </h1>
        <p className="mt-6 max-w-[40ch] text-lead text-ink-2">Entrá con el email y la contraseña de tu cuenta.</p>
        <div className="mt-10 hidden w-[min(380px,80%)] lg:block"><Trazo tipo="vesica" className="w-full" /></div>
      </div>

      <div className="col-span-12 lg:col-span-5 lg:col-start-8">
        <form onSubmit={entrar} className="grid gap-5 rounded-[28px] p-7 shadow-[inset_0_0_0_1px_var(--line-2)] sm:p-10">
          <label className="grid gap-2">
            <span className="text-small font-medium text-ink-2">Email</span>
            <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} placeholder="tu@email.com" />
          </label>
          <label className="grid gap-2">
            <span className="text-small font-medium text-ink-2">Contraseña</span>
            <input type="password" required autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} className={input} />
          </label>
          <button className="btn btn-primary w-full" disabled={enviando}>
            {enviando ? 'Un momento…' : 'Entrar'} <ArrowRight size={18} aria-hidden />
          </button>
          {error && <p role="alert" className="text-small text-error">{error}</p>}
          <p className="text-small text-ink-3">
            ¿No podés entrar? Escribinos a <a className="underline" href="mailto:info@espaciodegeometriasagrada.com">info@espaciodegeometriasagrada.com</a>.
          </p>
        </form>
      </div>
    </section>
  );
}

function traducir(m: string) {
  if (/invalid login credentials/i.test(m)) return 'Email o contraseña incorrectos.';
  if (/rate limit|too many/i.test(m)) return 'Demasiados intentos seguidos. Esperá un minuto y probá de nuevo.';
  if (/email not confirmed/i.test(m)) return 'Tu cuenta todavía no está activada. Escribinos y la activamos.';
  return 'No pudimos procesar el ingreso: ' + m;
}
