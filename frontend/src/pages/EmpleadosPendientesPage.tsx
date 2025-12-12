// frontend/src/pages/EmpleadosPendientesPage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

type EmpleadoPendiente = {
  id: number;
  nombre: string;
  cargo: string;
  email: string;
  fecha_ingreso: string;
};

export default function EmpleadosPendientesPage() {
  const { user } = useAuth();
  const [empleados, setEmpleados] = useState<EmpleadoPendiente[]>([]);
  const [loading, setLoading] = useState(true);

  // Solo admins
  if (user?.role !== "empleado" || user.cargo !== "administrador") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">⚠️ Acceso denegado</h1>
        <p>Solo los administradores pueden gestionar empleados.</p>
      </div>
    );
  }

  useEffect(() => {
    if (!user || user.role !== "empleado" || user.cargo !== "administrador") {
      return; // no cargamos si no tiene permiso
    }

    fetch("/api/empleados/pendientes")
      .then((res) => res.json())
      .then(setEmpleados)
      .finally(() => setLoading(false));
  }, [user]);

  if (user?.role !== "empleado" || user.cargo !== "administrador") {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-600">⚠️ Acceso denegado</h1>
        <p>Solo los administradores pueden gestionar empleados.</p>
      </div>
    );
  }

  const aprobar = async (id: number) => {
    if (!confirm("¿Aprobar este empleado?")) return;

    try {
      const res = await fetch(`/api/empleados/${id}/aprobar`, { method: "POST" });
      if (res.ok) {
        setEmpleados((prev) => prev.filter((e) => e.id !== id));
        alert("✅ Empleado aprobado");
      } else {
        alert("❌ Error al aprobar");
      }
    } catch (e) {
      console.error(e);
      alert("Error de red");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📝 Empleados Pendientes de Aprobación</h1>

      {loading ? (
        <p>Cargando...</p>
      ) : empleados.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-lg text-gray-600">✅ No hay empleados pendientes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {empleados.map((e) => (
            <div key={e.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{e.nombre}</h3>
                <p className="text-gray-600">{e.email}</p>
                <p className="text-sm text-gray-500">
                  Cargo: {e.cargo} • Ingreso: {new Date(e.fecha_ingreso).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => aprobar(e.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                ✅ Aprobar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}