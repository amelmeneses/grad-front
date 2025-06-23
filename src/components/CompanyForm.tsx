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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get<User[]>('/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      setUsers(res.data.filter(u => u.rol_id === 3));
    })
    .catch(() => setError('No se pudieron cargar los usuarios.'));

    if (isEdit) {
      axios.get<EmpresaData[]>('/api/empresas', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const empresa = res.data.find(e => String(e.id) === id);
        if (!empresa) throw new Error();
        setForm(empresa);
      })
      .catch(() => setError('No se pudo cargar la empresa.'))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, isEdit]);

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

    const soloLetras = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoRegex = /^[0-9]{10}$/;
    const contieneLetras = /[A-Za-zÁÉÍÓÚÑáéíóúñ]/;

    if (!soloLetras.test(form.nombre.trim())) {
      setError('El nombre debe contener solo letras y al menos 2 caracteres.');
      return;
    }

    if (!emailRegex.test(form.contacto_email.trim())) {
      setError('El correo electrónico no tiene un formato válido.');
      return;
    }

    if (!telefonoRegex.test(form.contacto_telefono.trim())) {
      setError('El teléfono debe contener exactamente 10 dígitos numéricos.');
      return;
    }

    if (!contieneLetras.test(form.direccion.trim())) {
      setError('La dirección debe contener texto, no solo números.');
      return;
    }

    if (!form.usuario_id) {
      setError('Debe seleccionar un usuario propietario.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (isEdit) {
        await axios.put(`/api/empresas/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/empresas', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (onCompanyAdded) onCompanyAdded();
      navigate('/admin/empresas');
    } catch {
      setError('Error al guardar la empresa. Intenta nuevamente.');
    }
  };

  if (loading) return <div className="p-8">Cargando…</div>;

  return (
    <>
      <Navbar />

      {/* Layout con margen para navbar fijo */}
      <div className="flex min-h-screen bg-white mt-19">
        <AdminNav />
        <main className="flex-1 p-8 max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isEdit ? 'Editar Empresa' : 'Crear Empresa'}
          </h1>

          {error && <p className="mb-4 text-red-500">{error}</p>}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5 bg-white p-6 rounded-2xl shadow-lg"
          >
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-900">Nombre</label>
              <input
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-900">Correo de Contacto</label>
              <input
                name="contacto_email"
                type="text"
                value={form.contacto_email}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-900">Teléfono</label>
              <input
                name="contacto_telefono"
                type="text"
                value={form.contacto_telefono}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-900">Dirección</label>
              <input
                name="direccion"
                type="text"
                value={form.direccion}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-900">Usuario (propietario)</label>
              <select
                name="usuario_id"
                value={form.usuario_id}
                onChange={handleChange}
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
