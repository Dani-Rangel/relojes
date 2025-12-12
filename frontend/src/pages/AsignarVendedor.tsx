// frontend/src/pages/AsignarVendedor.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type Cliente = { id: number; nombre: string; apellido: string };
type Vendedor = { id: number; nombre: string; apellido: string };
type Producto = { id: number; nombre: string; precio: number };

export default function AsignarVendedor() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id_cliente: "",
    id_vendedor: "",
    productos: [] as { id: number; cantidad: number }[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resClientes, resVendedores, resProductos] = await Promise.all([
          fetch("http://localhost:5000/api/clientes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/empleados/vendedores", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/productos"),
        ]);

        const clientesData = await resClientes.json();
        const vendedoresData = await resVendedores.json();
        const productosData = await resProductos.json();

        setClientes(clientesData);
        setVendedores(vendedoresData);
        setProductos(productosData);
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleAddProducto = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      productos: [...prev.productos, { id, cantidad: 1 }],
    }));
  };

  const handleRemoveProducto = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      productos: prev.productos.filter((p) => p.id !== id),
    }));
  };

  const handleCantidadChange = (id: number, cantidad: number) => {
    setFormData((prev) => ({
      ...prev,
      productos: prev.productos.map((p) =>
        p.id === id ? { ...p, cantidad } : p
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id_cliente) {
      alert("Selecciona un cliente");
      return;
    }

    if (formData.productos.length === 0) {
      alert("Agrega al menos un producto");
      return;
    }

    const payload = {
      id_cliente: parseInt(formData.id_cliente),
      id_vendedor: formData.id_vendedor ? parseInt(formData.id_vendedor) : undefined,
      productos: formData.productos,
    };

    try {
      const res = await fetch("http://localhost:5000/api/pedido/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token!}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Pedido creado: ${data.message}\nVendedor: ${data.vendedor}`);
        navigate("/dashboard");
      } else {
        alert(data.error || "Error al crear pedido");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error de conexión");
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📝 Asignar Pedido Manual</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cliente */}
        <div>
          <label className="block font-semibold mb-2">Cliente *</label>
          <select
            value={formData.id_cliente}
            onChange={(e) => setFormData({ ...formData, id_cliente: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} {c.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* Vendedor (opcional) */}
        <div>
          <label className="block font-semibold mb-2">Vendedor (opcional)</label>
          <select
            value={formData.id_vendedor}
            onChange={(e) => setFormData({ ...formData, id_vendedor: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Asignar automáticamente</option>
            {vendedores.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nombre} {v.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* Productos */}
        <div>
          <label className="block font-semibold mb-2">Productos *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos.map((p) => {
              const selected = formData.productos.find((item) => item.id === p.id);
              return (
                <div key={p.id} className="border p-3 rounded">
                  <h3 className="font-bold">{p.nombre}</h3>
                  <p className="text-green-700">${p.precio}</p>
                  {selected ? (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={selected.cantidad}
                        onChange={(e) =>
                          handleCantidadChange(p.id, parseInt(e.target.value) || 1)
                        }
                        className="w-16 p-1 border rounded text-center"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveProducto(p.id)}
                        className="text-red-600 font-bold"
                      >
                        ✖
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddProducto(p.id)}
                      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      + Agregar
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumen */}
        {formData.productos.length > 0 && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-2">Resumen:</h3>
            <ul className="space-y-1">
              {formData.productos.map((item) => {
                const p = productos.find((x) => x.id === item.id);
                return (
                  <li key={item.id}>
                    {p?.nombre} × {item.cantidad}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
        >
          Crear Pedido Manual
        </button>
      </form>
    </div>
  );
}