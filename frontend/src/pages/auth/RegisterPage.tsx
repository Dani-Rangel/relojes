import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const API_URL = "http://localhost:5000";

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<"cliente" | "empleado">("cliente");

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
    cargo: "vendedor",
    rol: "cliente",
  });

  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");

  const register = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = activeTab === "cliente" ? `${API_URL}/api/register/cliente` : `${API_URL}/api/register/empleado`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (!response.ok) return setMessage(data.error);

    setMessage("Usuario registrado correctamente.");
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">

        {/* TABS */}
        <div className="flex mb-6 border-b">
          <button
            className={`w-1/2 p-2 font-semibold ${
              activeTab === "cliente"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("cliente");
              setForm({ ...form, rol: "cliente" });
            }}
          >
            Cliente
          </button>

          <button
            className={`w-1/2 p-2 font-semibold ${
              activeTab === "empleado"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("empleado");
              setForm({ ...form, rol: "empleado" });
            }}
          >
            Empleado
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          Crear Cuenta ({activeTab === "cliente" ? "Cliente" : "Empleado"})
        </h2>

        <form onSubmit={register}>

          {/* CAMPOS BASE */}
          <input
            className="w-full p-3 border rounded-lg mb-3"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <input
            className="w-full p-3 border rounded-lg mb-3"
            placeholder="Apellido"
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
          />

          <input
            type="email"
            className="w-full p-3 border rounded-lg mb-3"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* CONTRASEÑA */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="w-full p-3 border rounded-lg mb-3"
              placeholder="Contraseña"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* FORMULARIO CLIENTE */}
          {activeTab === "cliente" && (
            <>
              <input
                className="w-full p-3 border rounded-lg mb-3"
                placeholder="Teléfono"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />

              <input
                className="w-full p-3 border rounded-lg mb-4"
                placeholder="Dirección"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              />
            </>
          )}

          {/* FORMULARIO EMPLEADO */}
          {activeTab === "empleado" && (
            <>
              <select
                className="w-full p-3 border rounded-lg mb-4"
                value={form.cargo}
                onChange={(e) => setForm({ ...form, cargo: e.target.value })}
              >
                <option value="vendedor">Vendedor</option>
                <option value="almacenista">Almacenista</option>
                <option value="gerente">Gerente</option>
                <option value="administrador">Administrador</option>
              </select>
            </>
          )}

          {message && (
            <p className="text-center text-sm text-green-600 mb-2">{message}</p>
          )}

          <button className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition">
            Registrarse
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-green-600 font-semibold hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
