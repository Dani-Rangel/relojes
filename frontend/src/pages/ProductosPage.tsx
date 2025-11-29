import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from "../context/CartContext";

interface Proveedor {
  nombre: string;
  contacto: string;
  telefono: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  marca: string;
  modelo_reloj: string;
  material_caja: string;
  material_correa: string;
  precio: number;
  stock: number;
  proveedor: Proveedor | null;
}

export default function ProductosPage() {
  const { user } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch('/api/productos');
        const data = await res.json();
        setProductos(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const openModal = (producto: Producto) => setSelectedProducto(producto);
  const closeModal = () => setSelectedProducto(null);
  const { addItem } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Cargando relojes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">⌚ Catálogo de Relojes</h1>
          <div className="text-sm text-gray-600">
            {user?.nombre} • {productos.length} modelos
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map(producto => (
            <div 
              key={producto.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => openModal(producto)}
            >
              <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-5xl">⌚</span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{producto.marca}</h3>
                    <p className="text-gray-600 text-sm">{producto.modelo_reloj}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    producto.stock > 5 ? 'bg-green-100 text-green-800' :
                    producto.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {producto.stock} en stock
                  </span>
                </div>
                <p className="mt-2 text-gray-700 font-medium">
                  ${producto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
                <p className="mt-1 text-gray-500 text-sm line-clamp-2">
                  {producto.descripcion}
                </p>
              </div>
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
                Proveedor: {producto.proveedor?.nombre}
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedProducto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProducto.nombre}</h2>
                  <p className="text-gray-600">{selectedProducto.marca} • {selectedProducto.modelo_reloj}</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-100 h-64 flex items-center justify-center">
                  <span className="text-8xl">⌚</span>
                </div>
                <div>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Precio:</span>
                      <span className="ml-2 text-xl font-bold text-indigo-700">
                        ${selectedProducto.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Stock:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
                        selectedProducto.stock > 5 ? 'bg-green-100 text-green-800' :
                        selectedProducto.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedProducto.stock} unidades
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Material caja:</span>
                      <span className="ml-2 text-gray-900">{selectedProducto.material_caja}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Material correa:</span>
                      <span className="ml-2 text-gray-900">{selectedProducto.material_correa}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Proveedor:</span>
                      <div className="mt-1">
                        <p className="font-medium">{selectedProducto.proveedor?.nombre}</p>
                        <p className="text-sm text-gray-600">Contacto: {selectedProducto.proveedor?.contacto}</p>
                        <p className="text-sm text-gray-600">Tel: {selectedProducto.proveedor?.telefono}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-bold text-gray-900 mb-2">Descripción</h3>
                    <p className="text-gray-700">{selectedProducto.descripcion}</p>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    // En el botón "Agregar al carrito" del modal:
                    <button 
                    onClick={() => {
                        addItem({
                        id: selectedProducto.id,
                        nombre: selectedProducto.nombre,
                        marca: selectedProducto.marca,
                        precio: selectedProducto.precio
                        });
                        alert('Producto añadido al carrito');
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium"
                    >
                    Agregar al carrito
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                      Comprar ahora
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}