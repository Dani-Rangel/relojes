import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Pagar() {
  const { carrito, total, vaciar } = useCarrito();
  const { user } = useAuth();
  const navigate = useNavigate();

  async function procesarPago(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      id_cliente: user?.id,
      productos: carrito.map((item) => ({
        id_producto: item.id,
        cantidad: item.cantidad
      }))
    };

    try {
      const res = await fetch("http://localhost:5000/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        vaciar();
        navigate("/mis-pedidos");
      } else {
        alert("Error al procesar el pago");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-3xl font-bold mb-6">Pagar con tarjeta 💳</h1>

      <form onSubmit={procesarPago} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Número de tarjeta</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="1234 5678 9101 1121"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">Expiración</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              placeholder="MM/YY"
              required
            />
          </div>
          <div className="w-32">
            <label className="block mb-1 font-semibold">CVV</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              placeholder="123"
              required
            />
          </div>
        </div>

        <h3 className="text-xl font-bold">Total a pagar: ${total}</h3>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
        >
          Confirmar pago
        </button>
      </form>
    </div>
  );
}
