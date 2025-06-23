import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNav from './AdminNav';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Navbar from './Navbar';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  Role: { nombre: string };
  estado: number; // 1 = activo, 0 = inactivo
  avatarUrl?: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [rolFilter, setRolFilter] = useState('todos');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get<User[]>('/api/users', {
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

  const toggleEstado = async (id: number, currentEstado: number) => {
    const nuevoEstado = currentEstado === 1 ? 0 : 1;
    const confirmacion = window.confirm(
      `¿Está seguro de que desea marcar este usuario como ${
        nuevoEstado === 1 ? 'Activo' : 'Inactivo'
      }?`
    );
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem('token');
      const url =
        nuevoEstado === 1
          ? `/api/users/${id}/activar`
          : `/api/users/${id}/desactivar`;

      await axios.patch(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al cambiar estado';
      alert(msg);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('¿Está seguro que desea eliminar este usuario?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al eliminar el usuario';
      alert(msg);
    }
  };

  const rolesDisponibles = Array.from(new Set(users.map(u => u.Role.nombre)));

  if (loading) return <div className="p-8">Cargando usuarios…</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <>
      <Navbar />

      {/* Layout con margen superior para el navbar */}
      <div className="flex min-h-screen bg-white mt-19">
        <AdminNav />
        <main className="flex-1 p-8">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
              <p className="text-gray-600">Lista de usuarios</p>
            </div>
            <button
              onClick={() => navigate('/admin/user')}
              className="px-5 py-2 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white font-medium rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Añadir Usuario
            </button>
          </header>

          <div className="mb-4 flex flex-wrap gap-4 items-center">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o email"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-black"
            />

            <select
              value={estadoFilter}
              onChange={e => setEstadoFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-gray-600"
            >
              <option value="todos">Todos los estados</option>
              <option value="1">Activos</option>
              <option value="0">Inactivos</option>
            </select>

            <select
              value={rolFilter}
              onChange={e => setRolFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-gray-600"
            >
              <option value="todos">Todos los roles</option>
              {rolesDisponibles.map(r => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-600 uppercase">
                  <th className="p-3">Nombres</th>
                  <th className="p-3">Apellidos</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(u => {
                    const matchesSearch =
                      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
                      u.apellido.toLowerCase().includes(search.toLowerCase()) ||
                      u.email.toLowerCase().includes(search.toLowerCase());

                    const matchesEstado =
                      estadoFilter === 'todos' || String(u.estado) === estadoFilter;

                    const matchesRol =
                      rolFilter === 'todos' || u.Role.nombre === rolFilter;

                    return matchesSearch && matchesEstado && matchesRol;
                  })
                  .map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="flex items-center p-3 space-x-2">
                        {u.avatarUrl ? (
                          <img src={u.avatarUrl} alt={u.nombre} className="w-8 h-8 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                            {u.nombre.charAt(0)}
                          </div>
                        )}
                        <span className="text-gray-800">{u.nombre}</span>
                      </td>
                      <td className="p-3 text-gray-800">{u.apellido}</td>
                      <td className="p-3 text-gray-800">{u.email}</td>
                      <td className="p-3 text-gray-800">{u.Role.nombre}</td>
                      <td className="p-3 text-gray-800">
                        {u.estado === 1 ? (
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center space-x-2">
                        <button
                          title="Editar Usuario"
                          onClick={() => navigate(`/admin/user/${u.id}`)}
                          className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                        >
                          <FaEdit className="text-[#0B91C1]" size={16} />
                        </button>
                        {u.estado === 1 ? (
                          <button
                            title="Desactivar Usuario"
                            onClick={() => toggleEstado(u.id, u.estado)}
                            className="px-3 py-2 bg-red-100 text-red-700 border border-red-700 rounded-lg hover:bg-red-200 transition"
                          >
                            Desactivar
                          </button>
                        ) : (
                          <button
                            title="Activar Usuario"
                            onClick={() => toggleEstado(u.id, u.estado)}
                            className="px-3 py-2 bg-green-100 text-green-700 border border-green-700 rounded-lg hover:bg-green-200 transition"
                          >
                            Activar
                          </button>
                        )}
                        <button
                          title="Eliminar Usuario"
                          onClick={() => handleDelete(u.id)}
                          className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
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
    </>
  );
}
