import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

type Pedido = {
  id: number;
  fecha: string;
  total: number;
  estado: string;
};

export default function MisPedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const res = await fetch(`http://localhost:5000/api/pedidos/cliente/${user?.id}`);
        const data = await res.json();
        setPedidos(data);
      } catch (err) {
        console.error("Error cargando pedidos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPedidos();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 text-lg font-semibold">
        Cargando pedidos...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Mis pedidos 📦</h1>

      {pedidos.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <div className="space-y-4">
          {pedidos.map((p) => (
            <div key={p.id} className="bg-white shadow-md rounded-lg p-4">
              <p><strong>ID:</strong> {p.id}</p>
              <p><strong>Fecha:</strong> {new Date(p.fecha).toLocaleString()}</p>
              <p><strong>Total:</strong> ${p.total}</p>
              <p><strong>Estado:</strong> {p.estado}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
