import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import singInImage from '../assets/imagen_singIn.svg';

const RegisterPage: React.FC = () => {
  const [nombre, setNombre]           = useState('');
  const [apellido, setApellido]       = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirmPwd, setConfirmPwd]   = useState('');
  const [error, setError]             = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPwd) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await axios.post('/api/register-anon-user', {
        nombre, apellido, email, password
      });
      // tras registro, quizá mostrar mensaje y redirigir a login
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
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
              Crea tu cuenta
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Completa los datos para registrarte.
            </p>
            {error && (
              <p className="text-red-500 text-center mb-4">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombres
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Ingresa tus nombres"
                  required
                  className="w-full p-3 bg-white bg-opacity-90 border border-gray-200 
                             rounded-xl shadow-inner text-gray-800
                             focus:outline-none focus:ring-2 focus:ring-[#0B91C1] transition"
                />
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellidos
                </label>
                <input
                  type="text"
                  value={apellido}
                  onChange={e => setApellido(e.target.value)}
                  placeholder="Ingresa tus apellidos"
                  required
                  className="w-full p-3 bg-white bg-opacity-90 border border-gray-200 
                             rounded-xl shadow-inner text-gray-800
                             focus:outline-none focus:ring-2 focus:ring-[#0B91C1] transition"
                />
              </div>

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

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  placeholder="Repite tu contraseña"
                  required
                  className="w-full p-3 bg-white bg-opacity-90 border border-gray-200 
                             rounded-xl shadow-inner text-gray-800
                             focus:outline-none focus:ring-2 focus:ring-[#0B91C1] transition"
                />
              </div>

              {/* Botón gradient */}
              <button
                type="submit"
                className="w-full py-3 font-medium text-white rounded-xl 
                           bg-gradient-to-r from-[#0B91C1] to-[#EB752B] 
                           shadow-lg hover:opacity-90 transition"
              >
                Registrarse
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="text-[#0B91C1] font-medium hover:underline">
                Inicia sesión
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

export default RegisterPage;
