import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";
import { FavoritosProvider } from "./context/FavoritosContext";
import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <FavoritosProvider>
            <AppRouter />
          </FavoritosProvider>
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

