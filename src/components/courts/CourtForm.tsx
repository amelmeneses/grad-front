import React, { useEffect, useState } from 'react';
import { useParams, useNavigate }        from 'react-router-dom';
import axios                              from 'axios';
import AdminNav                           from '../AdminNav';
import { Court }                          from '../../interfaces/Court'; // <- ruta corregida

interface CourtFormProps {
  onCourtAdded?: () => void;
}

const CourtForm: React.FC<CourtFormProps> = ({ onCourtAdded }) => {
  const { empresaId, id } = useParams<{ empresaId: string; id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<Omit<Court, 'id'>>({
    name: '',
    description: '',
    price_per_hour: 0,
    sport_type: '',
    location: '',
    deporte: '',
    company_id: Number(empresaId),
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
      .then(res => setForm(res.data as Omit<Court, 'id'>))
      .catch(() => setError('No se pudo cargar la cancha'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        name === 'price_per_hour' || name === 'company_id'
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
      if (onCourtAdded) onCourtAdded();
      else navigate(`/admin/canchas/${empresaId}`);
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
          <div>
            <label className="block mb-1 font-medium">Nombre</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Descripción</label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Precio por hora</label>
            <input
              type="number"
              name="price_per_hour"
              value={form.price_per_hour}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
              min={0}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Tipo de deporte</label>
            <input
              type="text"
              name="sport_type"
              value={form.sport_type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Ubicación</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Deporte</label>
            <input
              type="text"
              name="deporte"
              value={form.deporte}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isEdit ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CourtForm;
