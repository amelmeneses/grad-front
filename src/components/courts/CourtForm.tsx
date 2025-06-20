import React, { useEffect, useState } from 'react';
import { useParams, useNavigate }        from 'react-router-dom';
import axios                              from 'axios';
import AdminNav                           from '../AdminNav';
import { Court }                         from '../../interfaces/Court';

interface CourtFormProps {
  onCourtAdded?: () => void;
}

const CourtForm: React.FC<CourtFormProps> = ({ }) => {
  const { empresaId, id } = useParams<{ empresaId: string; id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<Omit<Court, 'id'>>({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    deporte: '',
    estado: 1,              // <— inicial activo
    empresa_id: Number(empresaId),
  });
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('token');
    axios
      .get<Court>(`/api/canchas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setForm({
          nombre:      res.data.nombre,
          descripcion: res.data.descripcion!,
          ubicacion:   res.data.ubicacion!,
          deporte:     res.data.deporte,
          estado:      res.data.estado,     // <— recuperamos estado
          empresa_id:  res.data.empresa_id
        });
      })
      .catch(() => setError('No se pudo cargar la cancha'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? Number((e.target as HTMLInputElement).checked)
        : name === 'estado'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (isEdit) {
        await axios.put(
          `/api/canchas/${id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          '/api/canchas',
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate(`/admin/canchas/${empresaId}`);
    } catch {
      setError('Error al guardar la cancha');
    }
  };

  if (loading) return <div className="p-8">Cargando…</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isEdit ? 'Editar Cancha' : 'Crear Cancha'}
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

          {/* Descripción */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">Descripción</label>
            <input
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          {/* Ubicación */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">
              Ubicación y referencia
            </label>
            <input
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          {/* Deporte */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">Deporte</label>
            <select
              name="deporte"
              value={form.deporte}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            >
              <option value="">Selecciona un deporte</option>
              <option value="futbol">Fútbol</option>
              <option value="basket">Básquet</option>
              <option value="tenis">Tenis</option>
              <option value="padel">Pádel</option>
            </select>
          </div>

          {/* Estado */}
          <div className="flex items-center space-x-2">
            <input
              id="estado"
              name="estado"
              type="checkbox"
              checked={form.estado === 1}
              onChange={handleChange}
              className="h-4 w-4 text-[#0B91C1] border-gray-300 rounded"
            />
            <label htmlFor="estado" className="text-gray-700 font-medium">
              Activa
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white font-medium rounded-lg bg-gradient-to-r from-[#0B91C1] to-[#EB752B] hover:opacity-90 transition"
          >
            {isEdit ? 'Guardar Cambios' : 'Crear Cancha'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CourtForm;
