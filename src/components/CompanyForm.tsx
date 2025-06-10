import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNav from './AdminNav';

interface EmpresaData {
  id?: number;
  nombre: string;
  contacto_email: string;
  contacto_telefono: string;
  direccion: string;
  usuario_id: number;
}

interface User {
  id: number;
  nombre: string;
  apellido: string;
  rol_id: number;
}

export default function CompanyForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<EmpresaData>({
    nombre: '',
    contacto_email: '',
    contacto_telefono: '',
    direccion: '',
    usuario_id: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // 1) Cargar lista de usuarios con rol “empresa”
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get<User[]>('http://localhost:5001/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      // Filtrar solo rol empresa (en tu DB, rol_id=3)
      setUsers(res.data.filter(u => u.rol_id === 3));
    })
    .catch(() => setError('No se pudieron cargar usuarios'));

    if (isEdit) {
      // 2) Cargar empresa existente
      axios.get<EmpresaData[]>(`http://localhost:5001/api/empresas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const empresa = res.data.find(e => String(e.id) === id);
        if (!empresa) throw new Error();
        setForm(empresa);
      })
      .catch(() => setError('No se pudo cargar la empresa'))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'usuario_id' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (isEdit) {
        await axios.put(
          `http://localhost:5001/api/empresas/${id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5001/api/empresas',
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate('/admin/empresas');
    } catch {
      setError('Error al guardar la empresa');
    }
  };

  if (loading) return <div className="p-8">Cargando…</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isEdit ? 'Editar Empresa' : 'Crear Empresa'}
        </h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-lg">
          {/* Nombre */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          {/* Email contacto */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">Email de Contacto</label>
            <input
              name="contacto_email"
              type="email"
              value={form.contacto_email}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">Teléfono</label>
            <input
              name="contacto_telefono"
              value={form.contacto_telefono}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">Dirección</label>
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          {/* Usuario propietario */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">Usuario (propietario)</label>
            <select
              name="usuario_id"
              value={form.usuario_id}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            >
              <option value="">Selecciona un usuario</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.nombre} {u.apellido} (ID: {u.id})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white font-medium rounded-lg text-gray-900 bg-gradient-to-r from-[#0B91C1] to-[#EB752B]"
          >
            {isEdit ? 'Guardar Cambios' : 'Crear Empresa'}
          </button>
        </form>
      </main>
    </div>
  );
}
