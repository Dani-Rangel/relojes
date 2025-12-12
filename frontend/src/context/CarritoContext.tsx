import { createContext, useContext, useState, ReactNode } from "react";

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
};

export type CarritoItem = Producto & {
  cantidad: number;
};

type CarritoContextType = {
  carrito: CarritoItem[];
  agregar: (producto: Producto) => void;
  eliminar: (id: number) => void;
  vaciar: () => void;
  total: number;
  abrirCarrito: () => void;   // 👈 nuevo
  abierto: boolean;           // 👈 nuevo
  cerrarCarrito: () => void;  // 👈 nuevo
};

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);

  const agregar = (producto: Producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminar = (id: number) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const vaciar = () => setCarrito([]);

  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const [abierto, setAbierto] = useState(false);

    const abrirCarrito = () => setAbierto(true);
    const cerrarCarrito = () => setAbierto(false);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregar,
        eliminar,
        vaciar,
        total,
        abrirCarrito,
        abierto,
        cerrarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return context;
};
