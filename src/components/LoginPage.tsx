// src/components/LoginPage.tsx
import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Aquí actualizamos la URL para que apunte a tu backend
      const response = await axios.post('http://localhost:5001/api/login', { email, password });

      // Guardar el token en el almacenamiento local
      localStorage.setItem('token', response.data.token);

      // Redirigir a la página principal o dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Bienvenido de nuevo</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              <label className="text-sm text-gray-600">Recordar por 30 días</label>
            </div>
            <a href="#" className="text-sm text-blue-500">Olvidar contraseña?</a>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Iniciar sesión
          </button>
        </form>
        <div className="mt-4 text-center">
          <button className="w-full p-3 bg-white text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100">
            <i className="fab fa-google mr-2"></i> Iniciar sesión con Google
          </button>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm">¿No tienes una cuenta? <a href="/register" className="text-blue-500">Registrarse ahora</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
