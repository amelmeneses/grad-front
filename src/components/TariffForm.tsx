// src/components/TariffForm.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNav from './AdminNav';
import { Tariff } from '../interfaces/Tariff';

export default function TariffForm() {
  const { empresaId, canchaId, tariffId } = useParams<{
    empresaId: string;
    canchaId: string;
    tariffId?: string;
  }>();
  const isEdit = Boolean(tariffId);
  const navigate = useNavigate();

  const [tariff, setTariff] = useState<Tariff>({
    cancha_id: Number(canchaId),
    dia_semana: null,
    default: false,
    hora_inicio: '',
    hora_fin: '',
    tarifa: 0,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Tariff, string>>>({});
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  // Si estamos en modo edición, cargamos la tarifa existente
  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }
    console.log('Cargando tarifa con ID:', tariffId);
    console.log('Cargando cancha con ID:', canchaId);
    const token = localStorage.getItem('token');
    axios
      .get<Tariff>(`/api/canchas/${canchaId}/tarifas/${tariffId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setTariff(res.data);
        setError(null);
      })
      .catch(() => setError('No se pudo cargar la tarifa'))
      .finally(() => setLoading(false));
  }, [canchaId, tariffId, isEdit]);

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!tariff.hora_inicio) errs.hora_inicio = 'Hora de inicio requerida';
    if (!tariff.hora_fin)    errs.hora_fin    = 'Hora de fin requerida';
    if (!(tariff.tarifa > 0)) errs.tarifa      = 'Tarifa válida requerida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem('token');
      if (isEdit) {
        await axios.put(
          `/api/canchas/${canchaId}/tarifas/${tariffId}`,
          tariff,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `/api/canchas/${canchaId}/tarifas`,
          tariff,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate(`/admin/canchas/${empresaId}/${canchaId}/tarifas`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar tarifa');
    }
  };

  if (loading) return <div className="p-8 text-gray-700">Cargando tarifa…</div>;
  if (error)   return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {isEdit ? 'Editar Tarifa' : 'Añadir Tarifa'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Día de la semana */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Día de la semana (opcional)
              </label>
              <input
                type="text"
                value={tariff.dia_semana || ''}
                onChange={e =>
                  setTariff({ ...tariff, dia_semana: e.target.value || null })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B91C1] text-gray-900"
              />
            </div>

            {/* Default */}
            <div className="flex items-center">
              <input
                id="default"
                type="checkbox"
                checked={tariff.default}
                onChange={e =>
                  setTariff({ ...tariff, default: e.currentTarget.checked })
                }
                className="h-4 w-4 text-[#0B91C1] border-gray-300 rounded"
              />
              <label htmlFor="default" className="ml-2 text-gray-700 font-medium">
                Marcar como tarifa por defecto
              </label>
            </div>

            {/* Hora de inicio */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Hora de inicio
              </label>
              <input
                type="time"
                value={tariff.hora_inicio}
                onChange={e =>
                  setTariff({ ...tariff, hora_inicio: e.target.value })
                }
                className={`w-full px-4 py-2 border ${
                  errors.hora_inicio ? 'border-red-500' : 'border-gray-200'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B91C1] text-gray-900`}
              />
              {errors.hora_inicio && (
                <p className="mt-1 text-red-600 text-sm">{errors.hora_inicio}</p>
              )}
            </div>

            {/* Hora de fin */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Hora de fin
              </label>
              <input
                type="time"
                value={tariff.hora_fin}
                onChange={e =>
                  setTariff({ ...tariff, hora_fin: e.target.value })
                }
                className={`w-full px-4 py-2 border ${
                  errors.hora_fin ? 'border-red-500' : 'border-gray-200'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B91C1] text-gray-900`}
              />
              {errors.hora_fin && (
                <p className="mt-1 text-red-600 text-sm">{errors.hora_fin}</p>
              )}
            </div>

            {/* Tarifa */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tarifa (USD)
              </label>
              <input
                type="number"
                step="0.01"
                value={tariff.tarifa}
                onChange={e =>
                  setTariff({ ...tariff, tarifa: parseFloat(e.target.value) })
                }
                className={`w-full px-4 py-2 border ${
                  errors.tarifa ? 'border-red-500' : 'border-gray-200'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B91C1] text-gray-900`}
              />
              {errors.tarifa && (
                <p className="mt-1 text-red-600 text-sm">{errors.tarifa}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#075F92] to-[#EB752B] text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              {isEdit ? 'Guardar Cambios' : 'Guardar Tarifa'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
