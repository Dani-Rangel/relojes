import { createContext, useContext, useState, ReactNode } from "react";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
};

type FavoritosContextType = {
  favoritos: Producto[];
  toggleFavorito: (producto: Producto) => void;
};

const FavoritosContext = createContext<FavoritosContextType | null>(null);

export const FavoritosProvider = ({ children }: { children: ReactNode }) => {
  const [favoritos, setFavoritos] = useState<Producto[]>([]);

  const toggleFavorito = (producto: Producto) => {
    setFavoritos((prev) => {
      const existe = prev.find((f) => f.id === producto.id);
      return existe
        ? prev.filter((f) => f.id !== producto.id)
        : [...prev, producto];
    });
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => useContext(FavoritosContext)!;
