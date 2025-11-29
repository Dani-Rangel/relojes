import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext.tsx';
import AuthPage from './pages/AuthPage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import ProductosPage from './pages/ProductosPage.tsx';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Cargando...</div>;
  if (!user) return window.location.href = '/'; // Redirección segura
  
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
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
    </Routes>
  );
}