

type Producto = {
  id: number;
  nombre: string;
  descripcion?: string;
  marca?: string;
  modelo_reloj?: string;
  material_caja?: string;
  material_correa?: string;
  precio: number;
  stock?: number;
  imagen?: string;
};

type Props = {
  producto: Producto | null;
  cerrar: () => void;
};

export default function ModalDetalles({ producto, cerrar }: Props) {

  if (!producto) return null;  // 👈 SOLUCIÓN CLAVE

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96 shadow-xl relative">

        {/* Imagen */}
        <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
          {producto.imagen ? (
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="object-cover w-full h-full"
            />
          ) : (
            <p className="text-gray-500 text-center mt-16">Sin imagen</p>
          )}
        </div>

        <h2 className="text-2xl font-bold mt-4">{producto.nombre}</h2>

        <p className="text-gray-700 mt-2">{producto.descripcion}</p>

        <p className="text-gray-800 mt-2">
          <strong>Precio:</strong> ${producto.precio}
        </p>

        <button
          onClick={cerrar}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
