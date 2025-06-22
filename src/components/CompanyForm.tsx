import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
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

// 1) Definimos la interfaz de props
interface CompanyFormProps {
  onCompanyAdded?: () => void;
}

export default function CompanyForm({ onCompanyAdded }: CompanyFormProps) {
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
    axios.get<User[]>('/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      // Filtrar solo rol empresa (en tu DB, rol_id=3)
      setUsers(res.data.filter(u => u.rol_id === 3));
    })
    .catch(() => setError('No se pudieron cargar usuarios'));

    if (isEdit) {
      // 2) Cargar empresa existente
      axios.get<EmpresaData[]>(`/api/empresas`, {
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
          `/api/empresas/${id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          '/api/empresas',
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate('/admin/empresas');
      // 2) Si pasaron onCompanyAdded, lo llamamos para refrescar el Dashboard
      if (onCompanyAdded) {
        onCompanyAdded();
        // opcional: limpiar form aquí
      } else {
        navigate('/admin/empresas');
      }
    } catch {
      setError('Error al guardar la empresa');
    }
  };

  if (loading) return <div className="p-8">Cargando…</div>;

  return (
    <>
      {/* Navbar superior */}
      <Navbar />

      {/* Layout con margen para navbar fijo */}
      <div className="flex min-h-screen bg-white mt-16">
        <AdminNav />

        <main className="flex-1 p-8 max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isEdit ? 'Editar Empresa' : 'Crear Empresa'}
          </h1>
          {error && <p className="mb-4 text-red-500">{error}</p>}

          <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-white p-6 rounded-2xl shadow-lg"
          >
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

            {/* Email */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-900">Correo de Contacto</label>
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

            {/* Usuario dueño */}
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
              className="w-full py-3 text-white font-medium rounded-lg bg-gradient-to-r from-[#0B91C1] to-[#EB752B]"
            >
              {isEdit ? 'Guardar Cambios' : 'Crear Empresa'}
            </button>
          </form>
        </main>
      </div>
    </>
  );
}
