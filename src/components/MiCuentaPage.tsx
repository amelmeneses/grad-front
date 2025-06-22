// src/components/MiCuentaPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

export default function MiCuentaPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get<User>('/api/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setUser(data))
      .catch(() => navigate('/login'));
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPwd) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        '/api/me',
        {
          nombre:   user!.nombre,
          apellido: user!.apellido,
          email:    user!.email,
          contrasena: password || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/dashboard-user');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar cambios');
    }
  };

  if (!user) return <p className="p-8 text-center">Cargando…</p>;

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-white">
        <main className="flex-1 p-8 max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Mi Cuenta</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-lg">
            {/* Nombres */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-900">Nombres</label>
              <input
                value={user.nombre}
                onChange={e => setUser(u => ({ ...u!, nombre: e.target.value }))}
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B91C1]"
              />
            </div>

            {/* Apellidos */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-900">Apellidos</label>
              <input
                value={user.apellido}
                onChange={e => setUser(u => ({ ...u!, apellido: e.target.value }))}
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B91C1]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-900">Correo electrónico</label>
              <input
                type="email"
                value={user.email}
                onChange={e => setUser(u => ({ ...u!, email: e.target.value }))}
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B91C1]"
              />
            </div>

            {/* Nueva Contraseña */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-900">
                Nueva Contraseña <span className="text-xs text-gray-500">(vacío = sin cambio)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="********"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B91C1]"
              />
            </div>

            {/* Confirmar Contraseña */}
            {password && (
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-900">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0B91C1]"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 text-white font-medium rounded-lg bg-gradient-to-r from-[#0B91C1] to-[#EB752B] hover:opacity-90 transition"
            >
              Guardar cambios
            </button>
          </form>
        </main>
      </div>
    </>
  );
}
