// src/components/LoginPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';               // Ajusta la ruta si tu estructura es distinta
import singInImage from '../assets/imagen_singIn.svg';

interface TokenPayload {
  id: number;
  role: number;
  exp: number;
}

const LoginPage: React.FC = () => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await axios.post('/api/login', { email, password });
      const payload = jwtDecode<TokenPayload>(data.token);
      localStorage.setItem('token', data.token);

      switch (payload.role) {
        case 1:
          navigate('/dashboard-admin');
          break;
        case 2:
          navigate('/dashboard-company');
          break;
        case 3:
          navigate('/dashboard-user');
          break;
        default:
          setError('Rol no reconocido');
      }
    } catch {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen w-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center w-full">
          {/* ————— Tarjeta del formulario ————— */}
          <div className="w-full md:w-1/2 max-w-md mx-auto md:mx-0 
                          bg-white bg-opacity-60 backdrop-blur-md p-8 
                          rounded-3xl shadow-xl">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
              Bienvenido de nuevo
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Por favor, introduzca sus datos.
            </p>
            {error && (
              <p className="text-red-500 text-center mb-4">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Ingresa tu email"
                  required
                  className="w-full p-3 bg-white bg-opacity-90 border border-gray-200 
                             rounded-xl shadow-inner text-gray-800
                             focus:outline-none focus:ring-2 focus:ring-[#0B91C1] transition"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="w-full p-3 bg-white bg-opacity-90 border border-gray-200 
                             rounded-xl shadow-inner text-gray-800
                             focus:outline-none focus:ring-2 focus:ring-[#0B91C1] transition"
                />
              </div>

              {/* Recordar / Olvidar */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 text-[#0B91C1] border-gray-300 rounded 
                               focus:ring-[#0B91C1]"
                  />
                  <span className="ml-2">Recordar por 30 días</span>
                </label>
                <a href="#" className="text-[#0B91C1] hover:underline">
                  Olvidar contraseña?
                </a>
              </div>

              {/* Botón gradient */}
              <button
                type="submit"
                className="w-full py-3 font-medium text-white rounded-xl 
                           bg-gradient-to-r from-[#0B91C1] to-[#EB752B] 
                           shadow-lg hover:opacity-90 transition"
              >
                Iniciar sesión
              </button>
            </form>

            {/* Registrarse */}
            <p className="mt-6 text-center text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <a href="/register" className="text-[#0B91C1] font-medium hover:underline">
                Registrarse ahora
              </a>
            </p>
          </div>

          {/* ————— Ilustración ————— */}
          <div className="hidden md:flex md:w-1/2 justify-center items-center">
            <img
              src={singInImage}
              alt="Ilustración deportiva"
              className="max-w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
