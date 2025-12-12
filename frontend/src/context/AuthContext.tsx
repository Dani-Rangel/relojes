// src/context/AuthContext.tsx

import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: 'cliente' | 'empleado';
  cargo?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔥 LOGIN — Maneja login + persistencia + navegación inteligente
  const login = async (email: string, password: string) => {
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Credenciales incorrectas');
      }

      const data = await response.json();
      const { token, user: userData } = data;

      // Persistencia
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      setToken(token);
      setUser(userData);

      // Redirección después de login
      const from = sessionStorage.getItem('from') || '/dashboard';
      sessionStorage.removeItem('from');

      navigate(from, { replace: true });

    } catch (err: any) {
      throw new Error(err.message || 'Error en login');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOGOUT — Limpia todo y redirige
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    navigate('/', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
