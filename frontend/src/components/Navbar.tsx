// frontend/src/components/Navbar.tsx (ACTUALIZADO)
import { useCarrito } from "../context/CarritoContext";
import { useFavoritos } from "../context/FavoritosContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { carrito, abrirCarrito } = useCarrito();
  const { favoritos } = useFavoritos();
  const { user, logout } = useAuth();

  // Determinar enlaces según rol
  const links = [];

  if (user) {
    links.push({ label: "Inicio", href: "/dashboard", icon: "🏠" });

    if (user.role === "cliente") {
      links.push({ label: "Mis pedidos", href: "/mis-pedidos", icon: "📦" });
      links.push({ label: "Favoritos", href: "/favoritos", icon: "❤️" });
    }

    if (user.role === "empleado") {
      if (["administrador", "gerente"].includes(user.cargo || "")) {
        links.push({ label: "Empleados", href: "/admin/empleados", icon: "👥" });
      }
      if (["administrador", "gerente", "almacenista"].includes(user.cargo || "")) {
        links.push({ label: "Bodegas", href: "/bodegas", icon: "📦" });
        links.push({ label: "Proveedores", href: "/proveedores", icon: "🏭" });
      }
    }

    links.push({ label: "Facturas", href: "/facturas", icon: "🧾" }); // opcional global
  }

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex flex-wrap justify-between items-center gap-4">
      <h1 className="text-xl font-bold flex items-center">
        🕒 Relojes Store{" "}
        {user && (
          <span className="ml-2 text-sm bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
            {user.role === "empleado" ? `${user.cargo}` : "cliente"}
          </span>
        )}
      </h1>

      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        {/* Links dinámicos */}
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="flex items-center gap-1 text-gray-700 hover:text-black font-medium"
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
        {user?.role === "empleado" && ["gerente", "administrador"].includes(user.cargo || "") && (
          <Link to="/asignar-pedido" className="text-gray-700 hover:text-black">
            ✍️ Asignar Pedido
          </Link>
        )}

        {/* Carrito */}
        {user?.role === "cliente" && (
          <button
            onClick={abrirCarrito}
            className="text-gray-700 hover:text-black relative"
          >
            🛒
            {carrito.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {carrito.length}
              </span>
            )}
          </button>
        )}

        {/* Favoritos */}
        {user?.role === "cliente" && (
          <Link to="/favoritos" className="text-gray-700 hover:text-black relative">
            ❤️
            {favoritos.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {favoritos.length}
              </span>
            )}
          </Link>
        )}

        {/* Usuario y logout */}
        {user && (
          <>
            <span className="hidden md:inline font-medium">{user.nombre}</span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
            >
              Salir
            </button>
          </>
        )}
      </div>
    </nav>
  );
}