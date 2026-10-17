// Ingreso a la academia: link mágico al email (por defecto) o email + contraseña.
import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { Trazo } from '../../components/site/Trazo';
import { Cargando } from './ui';

export default function Ingresar() {
  const a = useAuth();
  const [params] = useSearchParams();
  const volver = params.get('volver')?.startsWith('/academia') ? params.get('volver')! : '/academia/';
  const [modo, setModo] = useState<'link' | 'clave'>('link');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'enviado' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  if (a.cargando) return <Cargando />;
  if (a.session) return <Navigate to={volver} replace />;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado('enviando'); setMsg('');
    if (modo === 'link') {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: `${location.origin}${volver}` },
      });
      if (error) { setEstado('error'); setMsg(traducir(error.message)); } else setEstado('enviado');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password: pass });
      if (error) { setEstado('error'); setMsg(traducir(error.message)); } else setEstado('idle');
    }
  };

  const input = 'h-14 w-full rounded-[16px] px-5 text-body outline-none ring-1 ring-[var(--line-2)] focus:ring-2 focus:ring-[var(--accent)]';
  return (
    <section className="wrap grid min-h-[100svh] grid-cols-12 items-center gap-x-4 gap-y-10 pb-16 pt-28 lg:pt-32">
      <div className="col-span-12 lg:col-span-6">
        <p className="kicker"><b>Academia</b> · Acceso estudiantes</p>
        <h1 className="mt-5 font-display font-semibold leading-[0.98] tracking-[-0.035em]" style={{ fontSize: 'clamp(44px, 6vw, 96px)' }}>
          Tu espacio<br />de estudio.
        </h1>
        <p className="mt-6 max-w-[40ch] text-lead text-ink-2">
          Entrá con tu email: te mandamos un link y listo, sin contraseñas que recordar.
        </p>
        <div className="mt-10 hidden w-[min(380px,80%)] lg:block"><Trazo tipo="vesica" className="w-full" /></div>
      </div>

      <div className="col-span-12 lg:col-span-5 lg:col-start-8">
        <div className="rounded-[28px] p-7 shadow-[inset_0_0_0_1px_var(--line-2)] sm:p-10">
          {estado === 'enviado' ? (
            <div role="status">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-accent text-ink"><Mail size={24} aria-hidden /></span>
              <h2 className="mt-6 font-display text-[28px] font-semibold leading-tight">Revisá tu correo</h2>
              <p className="mt-3 text-body text-ink-2">
                Te enviamos un link a <b className="text-ink">{email}</b>. Abrilo desde este mismo dispositivo para entrar.
                Si no lo ves en unos minutos, mirá en Spam o Promociones.
              </p>
              <button type="button" onClick={() => setEstado('idle')} className="link-arrow mt-6">Usar otro email</button>
            </div>
          ) : (
            <form onSubmit={enviar} className="grid gap-5">
              <div className="seg w-full" role="radiogroup" aria-label="Forma de ingreso">
                <button type="button" role="radio" aria-checked={modo === 'link'} onClick={() => setModo('link')} className="seg-btn flex-1">Link por email</button>
                <button type="button" role="radio" aria-checked={modo === 'clave'} onClick={() => setModo('clave')} className="seg-btn flex-1">Con contraseña</button>
              </div>
              <label className="grid gap-2">
                <span className="text-small font-medium text-ink-2">Email</span>
                <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} placeholder="tu@email.com" />
              </label>
              {modo === 'clave' && (
                <label className="grid gap-2">
                  <span className="text-small font-medium text-ink-2">Contraseña</span>
                  <input type="password" required autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} className={input} />
                </label>
              )}
              <button className="btn btn-primary w-full" disabled={estado === 'enviando'}>
                {estado === 'enviando' ? 'Un momento…' : modo === 'link' ? 'Enviarme el link' : 'Entrar'} <ArrowRight size={18} aria-hidden />
              </button>
              {estado === 'error' && <p role="alert" className="text-small text-error">{msg}</p>}
              <p className="text-small text-ink-3">
                {modo === 'link'
                  ? '¿Es tu primera vez? Usá el mismo email con el que te inscribiste.'
                  : 'Si todavía no creaste una contraseña, entrá con el link por email y creala desde tu academia.'}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function traducir(m: string) {
  if (/invalid login credentials/i.test(m)) return 'Email o contraseña incorrectos.';
  if (/rate limit|security purposes|seconds/i.test(m)) return 'Pediste varios links seguidos. Esperá un minuto y probá de nuevo.';
  if (/email not confirmed/i.test(m)) return 'Todavía no confirmaste tu email. Entrá con el link por email.';
  if (/signups not allowed/i.test(m)) return 'Ese email no tiene una cuenta en la academia.';
  return 'No pudimos procesar el ingreso: ' + m;
}
