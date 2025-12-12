import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Dashboard from "../pages/Dashboard";
import FavoritosPage from "../pages/FavoritosPage";
import ProtectedLayout from "../components/layouts/ProtectedLayout";
import MisPedidos from "../pages/MisPedidos"
import Pagar from "../pages/Pagar"


function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/mis-pedidos" element={<MisPedidos />} />
      <Route path="/pago/*" element={<Pagar />} />


      {/* Ruta protegida */}
      <Route
        path="/dashboard"
        element={
            <ProtectedRoute>
            <ProtectedLayout>
                <Dashboard />
            </ProtectedLayout>
            </ProtectedRoute>
        }
        />

        <Route
        path="/favoritos"
        element={
            <ProtectedRoute>
            <ProtectedLayout>
                <FavoritosPage />
            </ProtectedLayout>
            </ProtectedRoute>
        }
        />


    </Routes>
  );
}
