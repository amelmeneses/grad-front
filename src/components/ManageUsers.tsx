// src/components/ManageUsers.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNav from './AdminNav';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  Role: { nombre: string };
  avatarUrl?: string;
}

export default function ManageUsers() {
  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const navigate = useNavigate();

  // carga la lista de usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get<User[]>('http://localhost:5001/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setError(null);
    } catch {
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // elimina un usuario con confirmación y muestra solo el mensaje limpio
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro que desea eliminar este usuario?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/users/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err: any) {
      const data = err.response?.data;
      let msg = 'Error al eliminar el usuario';

      if (data?.message) {
        // caso JSON { message: '...' }
        msg = data.message;
      } else if (typeof data === 'string') {
        // vino como HTML o string con stack, limpiamos etiquetas y entidades
        let text = data.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
        // arrancamos después de "Error:"
        const idx = text.indexOf('Error:');
        if (idx !== -1) {
          text = text.slice(idx + 'Error:'.length);
        }
        // quitamos todo después de " at "
        msg = text.split(/\bat\b/)[0].trim();
      }

      alert(msg);
    }
  };

  if (loading) return <div className="p-8">Cargando usuarios…</div>;
  if (error)   return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Usuarios</h1>
            <p className="text-gray-600">Lista de usuarios</p>
          </div>
          <button
            onClick={() => navigate('/admin/user')}
            className="px-5 py-2 bg-gradient-to-r from-[#0B91C1] to-[#EB752B]
                       text-white font-medium rounded-lg shadow-lg
                       hover:opacity-90 transition"
          >
            Añadir Usuario
          </button>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600 uppercase">
                <th className="p-3">Nombres</th>
                <th className="p-3">Apellidos</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="flex items-center p-3 space-x-2">
                    {u.avatarUrl ? (
                      <img
                        src={u.avatarUrl}
                        alt={u.nombre}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200
                                      flex items-center justify-center text-gray-600">
                        {u.nombre.charAt(0)}
                      </div>
                    )}
                    <span className="text-gray-800">{u.nombre}</span>
                  </td>
                  <td className="p-3 text-gray-800">{u.apellido}</td>
                  <td className="p-3 text-gray-800">{u.email}</td>
                  <td className="p-3 text-gray-800">{u.Role.nombre}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => navigate(`/admin/user/${u.id}`)}
                      className="bg-white p-2 rounded-lg border border-gray-200
                                 hover:bg-gray-100 transition"
                    >
                      <FaEdit className="text-[#0B91C1]" size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="bg-white p-2 rounded-lg border border-gray-200
                                 hover:bg-gray-100 transition"
                    >
                      <FaTrash className="text-red-500" size={16} />
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
