// frontend/src/pages/BodegasPage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

type Bodega = {
  id: number;
  nombre: string;
  ubicacion: string;
  capacidad_max: number;
  productos_actuales: number;
  encargado: string;
};

export default function BodegasPage() {
  const { user } = useAuth();
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [loading, setLoading] = useState(true);

  // Solo empleados con rol de admin, gerente o almacenista
  const allowed = user?.role === "empleado" && ["administrador", "gerente", "almacenista"].includes(user.cargo || "");
  if (!allowed) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">⚠️ Acceso denegado</h1>
        <p>Solo empleados autorizados pueden ver el inventario.</p>
      </div>
    );
  }

  useEffect(() => {
    fetch("/api/bodegas")
      .then((res) => res.json())
      .then(setBodegas)
      .finally(() => setLoading(false));
  }, []);

  const porcentaje = (actual: number, max: number) => Math.min(100, Math.round((actual / max) * 100));

  if (loading) return <div className="p-6">Cargando bodegas...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📦 Bodegas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bodegas.map((b) => {
          const pct = porcentaje(b.productos_actuales, b.capacidad_max);
          const color = pct < 50 ? "bg-green-500" : pct < 85 ? "bg-yellow-500" : "bg-red-500";
          return (
            <div key={b.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800">{b.nombre}</h2>
                <p className="text-sm text-gray-600">{b.ubicacion}</p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Stock actual: {b.productos_actuales}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${color}`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Capacidad: {b.productos_actuales} / {b.capacidad_max}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-sm">
                    <span className="font-semibold">Encargado:</span>{" "}
                    {b.encargado || "Sin asignar"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}