import { useCarrito } from "../context/CarritoContext";
import { useFavoritos } from "../context/FavoritosContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";


export default function Navbar() {
  const { carrito, abrirCarrito } = useCarrito();
  const { favoritos } = useFavoritos();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">🕒 Relojes Store</h1>

      <div className="flex items-center gap-6">

        {/* Pedidos */}
        <Link
          to="/mis-pedidos"
          className="text-gray-700 hover:text-black"
        >
          Mis pedidos 📦
        </Link>

        {/* Favoritos */}
        <Link to="/favoritos" className="text-gray-700 hover:text-black relative">
        Favoritos ❤️
        {favoritos.length > 0 && (
            <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs rounded-full px-2">
            {favoritos.length}
            </span>
        )}
        </Link>


        {/* Carrito */}
        <button
        onClick={abrirCarrito}
        className="text-gray-700 hover:text-black relative"
        >
        Carrito 🛒
        {carrito.length > 0 && (
            <span className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs rounded-full px-2">
            {carrito.length}
            </span>
        )}
        </button>

        {/* usuario */}
        <span className="font-semibold">{user?.nombre}</span>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
