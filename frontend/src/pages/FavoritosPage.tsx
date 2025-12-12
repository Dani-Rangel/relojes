import { useFavoritos } from "../context/FavoritosContext";
import { useCarrito } from "../context/CarritoContext";
import { useState } from "react";
import ModalDetalles from "../components/ModalDetalles";
import { Producto } from "../types/Producto";

export default function FavoritosPage() {
  const { favoritos, toggleFavorito } = useFavoritos();
  const { agregar } = useCarrito();

  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">❤️ Mis Favoritos</h1>

      {favoritos.length === 0 ? (
        <p className="text-gray-600 text-lg">No tienes productos en favoritos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritos.map((p) => (
            <div
              key={p.id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition relative"
            >
              {/* Imagen */}
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                {p.imagen ? (
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <p className="text-gray-500 text-center mt-16">Sin imagen</p>
                )}
              </div>

              {/* Nombre y precio */}
              <h2 className="text-xl font-bold">{p.nombre}</h2>
              <p className="text-lg font-semibold text-green-700 mt-2">
                ${p.precio}
              </p>

              {/* Botones */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setProductoSeleccionado(p)}
                  className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Ver detalles
                </button>

                <button
                  onClick={() => agregar(p)}
                  className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  🛒
                </button>

                <button
                  onClick={() => toggleFavorito(p)}
                  className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  ✖
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {productoSeleccionado && (
        <ModalDetalles
            producto={productoSeleccionado}
            cerrar={() => setProductoSeleccionado(null)}
        />
        )}

    </div>
  );
}
