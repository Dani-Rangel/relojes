// src/pages/FacturaPage.tsx — versión estable con jspdf
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generarPDF } from "../types/generarPDF";

type Factura = {
  id: number;
  serie: string;
  folio: number;
  cliente_nombre: string;
  cliente_email: string;
  empleado_nombre: string;
  fecha_emision: string;
  subtotal: number;
  impuestos: number;
  total: number;
  metodo_pago: string;
  estado: string;
};

export default function FacturaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [factura, setFactura] = useState<Factura | null>(null);
  const [loading, setLoading] = useState(true);
  const facturaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/facturas/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No encontrada");
        return res.json();
      })
      .then(setFactura)
      .catch(() => {
        alert("Factura no encontrada");
        navigate("/dashboard");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const descargarPDF = () => {
    if (facturaRef.current) {
      generarPDF('factura-container', `factura-${factura?.serie}-${factura?.folio}.pdf`);
    }
  };

  if (loading) return <div className="p-6">Cargando factura...</div>;
  if (!factura) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Contenedor para capturar */}
      <div id="factura-container" ref={facturaRef} className="bg-white p-8 rounded-lg shadow">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Factura</h1>
          <p className="font-mono text-lg">{factura.serie}-{String(factura.folio).padStart(4, "0")}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-semibold">Cliente:</p>
            <p>{factura.cliente_nombre}</p>
            <p className="text-sm text-gray-600">{factura.cliente_email}</p>
          </div>
          <div>
            <p className="font-semibold">Atendido por:</p>
            <p>{factura.empleado_nombre}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <p><strong>Fecha emisión:</strong> {new Date(factura.fecha_emision).toLocaleString("es-MX")}</p>
          <p><strong>Subtotal:</strong> ${factura.subtotal.toFixed(2)}</p>
          <p><strong>Impuestos:</strong> ${factura.impuestos.toFixed(2)}</p>
          <p className="text-xl font-bold"><strong>Total:</strong> ${factura.total.toFixed(2)}</p>
          <p><strong>Método de pago:</strong> {factura.metodo_pago}</p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className={`px-2 py-1 rounded text-sm ${
              factura.estado === "pagada" ? "bg-green-200 text-green-800" :
              factura.estado === "emitida" ? "bg-yellow-200 text-yellow-800" :
              "bg-gray-200"
            }`}>
              {factura.estado}
            </span>
          </p>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Gracias por su compra — Relojes Store © {new Date().getFullYear()}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={descargarPDF}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          📥 Descargar PDF
        </button>
      </div>
    </div>
  );
}