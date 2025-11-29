import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type UserType = 'cliente' | 'empleado';

const CARGOS = [
  { value: 'vendedor', label: 'Vendedor' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'gerente', label: 'Gerente' },
  { value: 'administrador', label: 'Administrador' },
  { value: 'almacenista', label: 'Almacenista' },
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<UserType>('cliente');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    cargo: '',
    salario: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) navigate('/dashboard');
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        let endpoint = '/api/register';
        const body: any = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
        };

        if (userType === 'cliente') {
          body.telefono = formData.telefono;
          body.direccion = formData.direccion;
        } else {
          endpoint = '/api/register/empleado';
          body.cargo = formData.cargo;
          body.salario = formData.salario || '0';
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Error al registrar');
        }

        await login(formData.email, formData.password);
      }
    } catch (err: any) {
      setError(err.message || 'Error en la operación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="bg-indigo-800 py-6 px-8 text-center">
          <div className="text-4xl mb-2">⌚</div>
          <h1 className="text-2xl font-bold text-white">
            {isLogin ? 'Iniciar Sesión' : 
             userType === 'cliente' ? 'Registro de Cliente' : 'Registro de Empleado'}
          </h1>
          {!isLogin && (
            <div className="mt-3 flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setUserType('cliente')}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  userType === 'cliente' 
                    ? 'bg-white text-indigo-800' 
                    : 'bg-indigo-700 text-white'
                }`}
              >
                Cliente
              </button>
              <button
                type="button"
                onClick={() => setUserType('empleado')}
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  userType === 'empleado' 
                    ? 'bg-white text-indigo-800' 
                    : 'bg-indigo-700 text-white'
                }`}
              >
                Empleado
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/20 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-white font-medium mb-2">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Daniel"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="apellido" className="block text-white font-medium mb-2">
                    Apellido
                  </label>
                  <input
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Rangel"
                    required
                  />
                </div>
              </div>

              {userType === 'cliente' ? (
                <>
                  <div>
                    <label htmlFor="telefono" className="block text-white font-medium mb-2">
                      Teléfono
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="555-1234"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="direccion" className="block text-white font-medium mb-2">
                      Dirección
                    </label>
                    <input
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="Calle Principal 123"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label htmlFor="cargo" className="block text-white font-medium mb-2">
                      Cargo
                    </label>
                    <select
                      id="cargo"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      required
                    >
                      <option value="">Selecciona un cargo</option>
                      {CARGOS.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="salario" className="block text-white font-medium mb-2">
                      Salario (opcional)
                    </label>
                    <input
                      id="salario"
                      name="salario"
                      type="number"
                      value={formData.salario}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="15000"
                    />
                  </div>
                </>
              )}
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="ej: tu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white font-medium mb-2">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-75 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? 'Ingresando...' : `Registrando ${userType}...`}
              </>
            ) : isLogin ? (
              'Iniciar Sesión'
            ) : (
              `Registrar ${userType}`
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-300 hover:text-white text-sm font-medium"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>

          {isLogin && (
            <div className="text-center text-indigo-200 text-xs mt-4">
              <p>Prueba con:</p>
              <p className="font-mono">admin@relojes.com / admin123</p>
              <p className="font-mono">carlos@example.com / cliente123</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}