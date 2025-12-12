import { useCarrito } from "../context/CarritoContext";

export default function CarritoSidebar() {
  const { carrito, eliminar, total, abierto, cerrarCarrito } = useCarrito();

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-5 transition-transform duration-300 ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tu carrito</h2>

          <button
            onClick={cerrarCarrito}
            className="text-red-500 font-bold text-xl"
          >
            ✖
          </button>
        </div>

        {carrito.length === 0 ? (
          <p className="text-gray-600">Tu carrito está vacío</p>
        ) : (
          <div className="space-y-4">
            {carrito.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
              >
                <div>
                  <p className="font-bold">{item.nombre}</p>
                  <p className="text-sm text-gray-600">
                    Cantidad: {item.cantidad}
                  </p>
                </div>

                <button
                  onClick={() => eliminar(item.id)}
                  className="text-red-600 font-bold text-xl"
                >
                  ✖
                </button>
              </div>
            ))}

            <h3 className="text-lg font-bold mt-3">Total: ${total}</h3>

            <button
              onClick={() => {
                cerrarCarrito();
                window.location.href = "/pago";
              }}
              className="w-full bg-green-600 text-white py-2 mt-3 rounded-lg hover:bg-green-700"
            >
              Finalizar compra
            </button>
          </div>
        )}
      </div>
    </>
  );
}
