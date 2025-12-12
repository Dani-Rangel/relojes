// src/routes/AppRouter.tsx

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Dashboard from "../pages/Dashboard";
import FavoritosPage from "../pages/FavoritosPage";
import ProtectedLayout from "../components/layouts/ProtectedLayout";
import MisPedidos from "../pages/MisPedidos";
import Pagar from "../pages/Pagar";
import ProveedoresPage from "../pages/ProveedoresPage";
import FacturaPage from "../pages/FacturaPage";
import EmpleadosPendientesPage from "../pages/EmpleadosPendientesPage";
import ProductosPage from "../pages/ProductosPage";
import BodegasPage from "../pages/BodegasPage";
import AsignarVendedor from "../pages/AsignarVendedor";


// 🔥 Componente para proteger rutas
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <ProtectedLayout>{children}</ProtectedLayout>;
}


export default function AppRouter() {
  const { user } = useAuth(); // 🔥 Necesario para rutas condicionales

  return (
    <Routes>

      {/* 🔓 RUTAS PÚBLICAS */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />


      {/* 🔒 RUTAS PROTEGIDAS */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mis-pedidos"
        element={
          <ProtectedRoute>
            <MisPedidos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/favoritos"
        element={
          <ProtectedRoute>
            <FavoritosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/proveedores"
        element={
          <ProtectedRoute>
            <ProveedoresPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/factura/:id"
        element={
          <ProtectedRoute>
            <FacturaPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pago/*"
        element={
          <ProtectedRoute>
            <Pagar />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/empleados"
        element={
          <ProtectedRoute>
            <EmpleadosPendientesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/productos"
        element={
          <ProtectedRoute>
            <ProductosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/bodegas"
        element={
          <ProtectedRoute>
            <BodegasPage />
          </ProtectedRoute>
        }
      />

      {/* 🔥 RUTA CONDICIONAL POR ROL / CARGO */}
      {user?.role === "empleado" &&
        ["gerente", "administrador"].includes(user.cargo || "") && (
          <Route
            path="/asignar-pedido"
            element={
              <ProtectedRoute>
                <AsignarVendedor />
              </ProtectedRoute>
            }
          />
        )}

    </Routes>
  );
}
