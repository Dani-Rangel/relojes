// frontend/src/pages/Dashboard.tsx (ACTUALIZADO)
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { useFavoritos } from "../context/FavoritosContext";
import ModalDetalles from "../components/ModalDetalles";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  marca: string;
  modelo_reloj: string;
  material_caja: string;
  material_correa: string;
  precio: number;
  stock: number;
  imagen?: string;
};

type PedidoResumen = {
  id: number;
  fecha_pedido: string;
  estado: string;
  total: number;
};

export default function Dashboard() {
  const { user } = useAuth();
  const { agregar, abrirCarrito } = useCarrito();
  const { toggleFavorito } = useFavoritos();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<PedidoResumen[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Productos para todos
        const resProd = await fetch("/api/productos");
        const dataProd = await resProd.json();
        setProductos(dataProd);

        // Solo empleados: pedidos recientes
        if (user?.role === "empleado") {
          const resPed = await fetch("/api/pedidos");
          const dataPed = await resPed.json();
          setPedidos(dataPed.slice(0, 5)); // últimos 5
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Cargando...
      </div>
    );
  }

  // === CLIENTE ===
  if (user?.role === "cliente") {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">🛍️ Catálogo de Relojes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {p.imagen ? (
                  <img src={p.imagen} alt={p.nombre} className="object-cover h-full w-full" />
                ) : (
                  <span className="text-gray-500">Sin imagen</span>
                )}
              </div>
              <h2 className="text-xl font-bold">{p.nombre}</h2>
              <p className="text-gray-600 text-sm">{p.descripcion}</p>
              <p className="font-bold text-lg text-green-700 mt-2">${p.precio}</p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setProductoSeleccionado(p)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Ver detalles
                </button>
                <button
                  onClick={() => {
                    agregar(p);
                    abrirCarrito();
                  }}
                  className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700"
                  title="Agregar al carrito"
                >
                  🛒
                </button>
                <button
                  onClick={() => toggleFavorito(p)}
                  className="p-2 rounded-full bg-pink-600 text-white hover:bg-pink-700"
                  title="Añadir a favoritos"
                >
                  ❤️
                </button>
              </div>
            </div>
          ))}
        </div>

        {productoSeleccionado && (
          <ModalDetalles
            producto={productoSeleccionado}
            cerrar={() => setProductoSeleccionado(null)}
          />
        )}
      </div>
    );
  }

  // === EMPLEADO ===
  if (user?.role === "empleado") {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">
          👨‍🔧 Dashboard — {user.nombre} ({user.cargo})
        </h1>

        {/* Cards de resumen (solo admins/gerentes) */}
        {["administrador", "gerente"].includes(user.cargo || "") && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-bold text-blue-800">Pedidos hoy</h3>
              <p className="text-2xl">12</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-bold text-green-800">Ingresos</h3>
              <p className="text-2xl">$42,850</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-800">Productos en stock</h3>
              <p className="text-2xl">{productos.reduce((sum, p) => sum + p.stock, 0)}</p>
            </div>
          </div>
        )}

        {/* Sección pedidos */}
        {["administrador", "gerente", "vendedor"].includes(user.cargo || "") && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">📦 Últimos pedidos</h2>
            {pedidos.length === 0 ? (
              <p>No hay pedidos recientes.</p>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Fecha</th>
                      <th className="px-4 py-2 text-left">Estado</th>
                      <th className="px-4 py-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pedidos.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-2 font-mono">#{p.id}</td>
                        <td className="px-4 py-2">
                          {new Date(p.fecha_pedido).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              p.estado === "entregado"
                                ? "bg-green-200 text-green-800"
                                : p.estado === "pendiente"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-gray-200"
                            }`}
                          >
                            {p.estado}
                          </span>
                        </td>
                        <td className="px-4 py-2 font-semibold">${p.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Catálogo (solo vendedores/almacenistas) */}
        {["vendedor", "almacenista"].includes(user.cargo || "") && (
          <>
            <h2 className="text-xl font-bold mb-4">⌚ Catálogo (solo lectura)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos.slice(0, 6).map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="h-32 bg-gray-200 rounded flex items-center justify-center">
                    {p.imagen && <img src={p.imagen} alt={p.nombre} className="h-24 object-contain" />}
                  </div>
                  <h3 className="font-bold">{p.marca} {p.nombre}</h3>
                  <p className="text-green-700">${p.precio}</p>
                  <p className="text-sm text-gray-600">Stock: {p.stock}</p>
                  <button
                    onClick={() => setProductoSeleccionado(p)}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Ver detalles
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return <div>Dashboard no disponible</div>;
}