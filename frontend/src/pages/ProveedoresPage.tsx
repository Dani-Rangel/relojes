// frontend/src/pages/ProveedoresPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Proveedor = {
  id: number;
  nombre_empresa: string;
  contacto: string;
  email: string;
  telefono: string;
  direccion: string;
  sitio_web: string;
};

type ProductoResumen = {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
};

type ProveedorConProductos = Proveedor & {
  productos: ProductoResumen[];
};

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<ProveedorConProductos[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProveedores() {
      try {
        const res = await fetch("/api/productos");
        const productos: any[] = await res.json();
        const mapa = new Map<number, ProveedorConProductos>();

        productos.forEach((p) => {
          const prov = p.proveedor;
          if (!prov) return;

          if (!mapa.has(prov.id)) {
            mapa.set(prov.id, {
              id: prov.id,
              nombre_empresa: prov.nombre,
              contacto: prov.contacto,
              email: prov.email || "",
              telefono: prov.telefono || "",
              direccion: "—",
              sitio_web: "—",
              productos: [],
            });
          }

          const proveedor = mapa.get(prov.id)!;
          proveedor.productos.push({
            id: p.id,
            nombre: p.nombre,
            marca: p.marca,
            precio: p.precio,
          });
        });

        setProveedores(Array.from(mapa.values()));
      } catch (e) {
        console.error("Error cargando proveedores:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProveedores();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Proveedores 🏭</h1>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">🏭 Proveedores</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proveedores.map((prov) => (
          <div key={prov.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
            <h2 className="text-xl font-bold text-gray-800">{prov.nombre_empresa}</h2>
            <p className="text-sm text-gray-600 mt-1">Contacto: {prov.contacto}</p>
            <p className="text-sm text-gray-600">Tel: {prov.telefono}</p>
            <p className="text-sm text-gray-600">Email: {prov.email}</p>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-700">Productos ({prov.productos.length})</h3>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                {prov.productos.slice(0, 3).map((p) => (
                  <li key={p.id} className="truncate">
                    • {p.marca} {p.nombre} — ${p.precio}
                  </li>
                ))}
                {prov.productos.length > 3 && (
                  <li className="text-xs text-blue-600">
                    +{prov.productos.length - 3} más →
                  </li>
                )}
              </ul>
            </div>

            <Link
              to={`/productos?proveedor=${prov.id}`}
              className="mt-4 inline-block text-blue-600 hover:underline text-sm font-medium"
            >
              Ver todos los productos →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}