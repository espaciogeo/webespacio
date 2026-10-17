// Área privada: inicio de sesión y academia del alumno.
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Cargando } from './ui';
import Ingresar from './Ingresar';
import Inicio from './Inicio';
import Curso from './Curso';
import Leccion from './Leccion';

function Protegida({ children }: { children: React.ReactNode }) {
  const a = useAuth();
  const loc = useLocation();
  if (a.cargando) return <Cargando />;
  if (!a.session) return <Navigate to={`/ingresar/?volver=${encodeURIComponent(loc.pathname)}`} replace />;
  return <>{children}</>;
}

export default function AppArea() {
  return (
    <Routes>
      <Route path="ingresar" element={<Ingresar />} />
      <Route path="academia" element={<Protegida><Inicio /></Protegida>} />
      <Route path="academia/:curso" element={<Protegida><Curso /></Protegida>} />
      <Route path="academia/:curso/:leccion" element={<Protegida><Leccion /></Protegida>} />
      <Route path="*" element={<Navigate to="/academia/" replace />} />
    </Routes>
  );
}
