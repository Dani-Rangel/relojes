// frontend/src/pages/ProductosPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useFavoritos } from "../context/FavoritosContext";
import ModalDetalles from "../components/ModalDetalles";

type Proveedor = { id: number; nombre: string };
type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  marca: string;
  precio: number;
  stock: number;
  imagen?: string;
  proveedor: { nombre: string; contacto: string; telefono: string };
};

export default function ProductosPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { agregar } = useCarrito();
  const { toggleFavorito } = useFavoritos();
  
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const proveedorFiltro = searchParams.get("proveedor");

  useEffect(() => {
    const fetchProductos = async () => {
      const res = await fetch("/api/productos");
      const data: Producto[] = await res.json();
      setProductos(data);

      // Extraer proveedores únicos
      const map = new Map<number, Proveedor>();
      data.forEach((p) => {
        if (p.proveedor) {
          map.set(p.proveedor.nombre.length, {
            id: p.proveedor.nombre.length,
            nombre: p.proveedor.nombre,
          });
        }
      });
      // Pero mejor: agrupar por nombre_empresa (sabemos que backend ya trae nombre)
      const uniqs = Array.from(
        new Map(
          data
            .filter((p) => p.proveedor)
            .map((p) => [p.proveedor.nombre, { id: p.id, nombre: p.proveedor.nombre }])
        ).values()
      );
      setProveedores(uniqs);
    };
    fetchProductos();
  }, []);

  const productosFiltrados = proveedorFiltro
    ? productos.filter((p) => p.proveedor?.nombre === proveedorFiltro)
    : productos;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">⌚ Catálogo</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 hover:underline"
        >
          ← Volver a dashboard
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <label className="font-semibold mr-4">Proveedor:</label>
        <select
          value={proveedorFiltro || ""}
          onChange={(e) => {
            const val = e.target.value;
            navigate(val ? `/productos?proveedor=${val}` : "/productos");
          }}
          className="border rounded px-3 py-1"
        >
          <option value="">Todos</option>
          {proveedores.map((prov) => (
            <option key={prov.id} value={prov.nombre}>
              {prov.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Productos */}
      {productosFiltrados.length === 0 ? (
        <p className="text-gray-600">No hay productos para este filtro.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productosFiltrados.map((p) => (
            <div
              key={p.id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="h-40 flex items-center justify-center bg-gray-100 rounded mb-3">
                {p.imagen ? (
                  <img src={p.imagen} alt={p.nombre} className="h-32 object-contain" />
                ) : (
                  <span className="text-gray-500">Sin imagen</span>
                )}
              </div>
              <h3 className="font-bold">{p.marca}</h3>
              <p className="text-sm text-gray-600">{p.nombre}</p>
              <p className="font-bold text-lg text-green-700">${p.precio}</p>
              <p className="text-sm text-gray-500">
                Proveedor: <span className="font-medium">{p.proveedor?.nombre}</span>
              </p>
              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={() => setProductoSeleccionado(p)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Detalles
                </button>
                <button onClick={() => agregar(p)} className="text-lg">🛒</button>
                <button onClick={() => toggleFavorito(p)} className="text-lg">❤️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {productoSeleccionado && (
        <ModalDetalles
          producto={productoSeleccionado}
          cerrar={() => setProductoSeleccionado(null)}
        />
      )}
    </div>
  );
}