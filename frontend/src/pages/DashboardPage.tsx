import { useAuth } from '../context/AuthContext.tsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartContext";


export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [productosDestacados, setProductosDestacados] = useState<any[]>([]);
  const { totalItems } = useCart();

  useEffect(() => {
    if (!user || loading) return;

    const cargarProductos = async () => {
      try {
        const res = await fetch('/api/productos');
        const data = await res.json();
        const destacados = user.role === 'empleado' 
          ? data.slice(-4).reverse() 
          : data
              .filter((p: any) => p.precio < 1000)
              .sort(() => 0.5 - Math.random())
              .slice(0, 4);
        setProductosDestacados(destacados);
      } catch (err) {
        console.error("Error al cargar productos", err);
      }
    };

    cargarProductos();
  }, [user, loading]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              👋 Bienvenido, <span className="text-indigo-700">{user.nombre}</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {user.role === 'empleado' 
                ? `Empleado • ${user.cargo}` 
                : 'Cliente registrado'}
            </p>
          </div>
            {totalItems > 0 && (
            <div className="relative">
                <button 
                onClick={() => navigate('/carrito')}
                className="ml-4 text-gray-600 hover:text-gray-900"
                >
                🛒
                </button>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
                </span>
            </div>
            )}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 font-medium"
          >
            <span>Cerrar sesión</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {user.role === 'empleado' ? (
            <>
              <StatCard title="Ventas hoy" value="$24,500" change="+12%" icon="💰" color="bg-green-100" />
              <StatCard title="Pedidos" value="14" change="+3" icon="📦" color="bg-blue-100" />
              <StatCard title="Stock bajo" value="7" change="-2" icon="⚠️" color="bg-yellow-100" />
              <StatCard title="Clientes" value="328" change="+5" icon="👥" color="bg-purple-100" />
            </>
          ) : (
            <>
              <StatCard title="Mis pedidos" value="2" change="" icon="📦" color="bg-blue-100" />
              <StatCard title="En tránsito" value="1" change="" icon="🚚" color="bg-indigo-100" />
              <StatCard title="Favoritos" value="5" change="" icon="⭐" color="bg-amber-100" />
              <StatCard title="Soporte" value="24/7" change="" icon="💬" color="bg-green-100" />
            </>
          )}
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {user.role === 'empleado' ? 'Nuevos productos' : 'Recomendados para ti'}
            </h2>
            <button 
              onClick={() => navigate('/productos')}
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            >
              Ver todos →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {productosDestacados.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-400"></div>
                <p className="text-gray-500 mt-2">Cargando relojes...</p>
              </div>
            ) : (
              productosDestacados.map((p) => (
                <ProductCard 
                  key={p.id} 
                  producto={p} 
                  onClick={() => navigate('/productos')}
                />
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {user.role === 'empleado' ? (
            <>
              <QuickAction 
                title="Registrar pedido" 
                description="Nuevo cliente o venta presencial"
                icon="📝"
                color="bg-blue-500"
                onClick={() => navigate('/pedidos/nuevo')}
              />
              <QuickAction 
                title="Generar factura" 
                description="Para pedidos confirmados"
                icon="📄"
                color="bg-green-500"
                onClick={() => navigate('/facturas/nueva')}
              />
            </>
          ) : (
            <>
              <QuickAction 
                title="Explorar catálogo" 
                description="Descubre nuevos relojes"
                icon="⌚"
                color="bg-indigo-500"
                onClick={() => navigate('/productos')}
              />
              <QuickAction 
                title="Contactar soporte" 
                description="¿Tienes dudas? Estamos aquí"
                icon="📞"
                color="bg-amber-500"
                onClick={() => alert("Soporte: soporte@relojes.com • Tel: 555-1234")}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, change, icon, color }: { 
  title: string; 
  value: string; 
  change: string; 
  icon: string; 
  color: string; 
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <div className="flex items-center">
        <div className={`${color} w-10 h-10 rounded-lg flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ producto, onClick }: { 
  producto: any; 
  onClick: () => void; 
}) {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <span className="text-4xl">⌚</span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900">{producto.marca}</h3>
        <p className="text-gray-600 text-sm truncate">{producto.modelo_reloj}</p>
        <p className="mt-2 font-medium text-indigo-700">
          ${producto.precio.toLocaleString('es-MX')}
        </p>
        <div className="mt-2 flex justify-between items-center">
          <span className={`px-2 py-1 text-xs rounded-full ${
            producto.stock > 5 ? 'bg-green-100 text-green-800' :
            producto.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {producto.stock} en stock
          </span>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ title, description, icon, color, onClick }: { 
  title: string; 
  description: string; 
  icon: string; 
  color: string; 
  onClick: () => void; 
}) {
  return (
    <div 
      className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-1 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}