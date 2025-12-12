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

export default function Dashboard() {
  const { user } = useAuth();
  const { agregar, abrirCarrito } = useCarrito();
  const { toggleFavorito } = useFavoritos();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);


  const roleTitles: Record<string, string> = {
    cliente: "Productos disponibles 🛍️",
    administrador: "Panel administrativo ⚙️",
    empleado: "Dashboard del empleado 🧑‍🔧",
    default: "Dashboard"
  };

  const title = roleTitles[user?.role ?? "default"];

  useEffect(() => {
    async function fetchProductos() {
      try {
        const res = await fetch("http://localhost:5000/api/productos");
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Cargando productos...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8">{title}</h1>

      {/* Productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productos.map((p) => (
          <div
            key={p.id}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition"
          >
            {/* Imagen */}
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
              {p.imagen ? (
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="object-cover h-full w-full"
                />
              ) : (
                <span className="text-gray-500">Sin imagen</span>
              )}
            </div>

            {/* Info */}
            <h2 className="text-xl font-bold mb-1">{p.nombre}</h2>
            <p className="text-gray-600 text-sm mb-2">{p.descripcion}</p>

            <p><strong>Marca:</strong> {p.marca}</p>
            <p><strong>Modelo:</strong> {p.modelo_reloj}</p>
            <p className="font-bold text-lg text-green-700 mt-2">
              ${p.precio}
            </p>

            {/* Botones en fila */}
            <div className="flex justify-between items-center mt-4">

              {/* Ver detalles */}
              <button
                onClick={() => setProductoSeleccionado(p)}
                className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                Ver Detalles
                </button>

              {/* Agregar al carrito */}
              <button
                onClick={() => {
                    agregar(p);
                    abrirCarrito(); // 👈
                    }}
                className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
                title="Agregar al carrito"
              >
                🛒
              </button>

              {/* Favoritos */}
              <button
                onClick={() => toggleFavorito(p)}
                className="p-2 rounded-full bg-pink-600 text-white hover:bg-pink-700 transition"
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
