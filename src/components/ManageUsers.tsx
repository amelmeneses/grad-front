// src/components/ManageUsers.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  Role: { nombre: string };
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<User[]>('http://localhost:5001/api/users')
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar los usuarios');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Cargando usuarios…</div>;
  if (error)   return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-white">
      {/* -- Aquí podrías extraer el sidebar a un componente -- */}
      <aside className="w-64 border-r p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-6">Playbooker</h2>
        <nav className="space-y-3">
          <a href="/dashboard-admin" className="block text-gray-700 hover:text-blue-500">Dashboard</a>
          <a href="/admin/users" className="block text-blue-500 font-medium">Usuario</a>
          <a href="/admin/courts" className="block text-gray-700 hover:text-blue-500">Canchas</a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Usuarios</h1>
            <p className="text-gray-600">lista de usuarios</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Añadir Usuario
          </button>
        </header>

        <div className="overflow-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600 uppercase">
                <th className="p-3"><input type="checkbox" /></th>
                <th className="p-3">Nombres</th>
                <th className="p-3">Apellidos</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-3"><input type="checkbox" /></td>
                  <td className="p-3">{u.nombre}</td>
                  <td className="p-3">{u.apellido}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.Role.nombre}</td>
                  <td className="p-3 text-center space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
