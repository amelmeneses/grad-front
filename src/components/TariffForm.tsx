// src/components/TariffForm.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNav from './AdminNav';
import { Tariff } from '../interfaces/Tariff';

const daysOfWeek = [
  { value: 'monday',    label: 'Lunes' },
  { value: 'tuesday',   label: 'Martes' },
  { value: 'wednesday', label: 'Miércoles' },
  { value: 'thursday',  label: 'Jueves' },
  { value: 'friday',    label: 'Viernes' },
  { value: 'saturday',  label: 'Sábado' },
  { value: 'sunday',    label: 'Domingo' },
];

export default function TariffForm() {
  const { empresaId, canchaId, tariffId } = useParams<{
    empresaId: string;
    canchaId: string;
    tariffId?: string;
  }>();
  const isEdit = Boolean(tariffId);
  const navigate = useNavigate();

  const [tariff, setTariff] = useState<Tariff>({
    cancha_id: Number(canchaId!),
    dia_semana: null,
    default: false,
    hora_inicio: '',
    hora_fin: '',
    tarifa: 0,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Tariff, string>>>({});
  const [loading, setLoading] = useState(isEdit);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('token');
    axios.get<Tariff>(
      `/api/canchas/${canchaId}/tarifas/${tariffId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(res => {
      setTariff({ 
        ...res.data, 
        tarifa: Number(res.data.tarifa) 
      });
      setErrorMsg(null);
    })
    .catch(() => setErrorMsg('No se pudo cargar la tarifa'))
    .finally(() => setLoading(false));
  }, [canchaId, tariffId, isEdit]);

  const validate = () => {
    const errs: typeof errors = {};
    if (!tariff.dia_semana)   errs.dia_semana = 'Selecciona un día';
    if (!tariff.hora_inicio)  errs.hora_inicio = 'Hora de inicio requerida';
    if (!tariff.hora_fin)     errs.hora_fin    = 'Hora de fin requerida';
    if (!(tariff.tarifa > 0)) errs.tarifa      = 'Tarifa válida requerida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: Tariff = {
      ...tariff,
      cancha_id: Number(canchaId!),
      tarifa: Number(tariff.tarifa),
    };

    const token = localStorage.getItem('token');
    try {
      if (isEdit) {
        await axios.put(
          `/api/canchas/${canchaId}/tarifas/${tariffId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `/api/canchas/${canchaId}/tarifas`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate(`/admin/canchas/${empresaId}/${canchaId}/tarifas`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar tarifa');
    }
  };

  if (loading) return <div className="p-8 text-gray-700">Cargando tarifa…</div>;
  if (errorMsg) return <div className="p-8 text-red-500">{errorMsg}</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {isEdit ? 'Editar Tarifa' : 'Añadir Tarifa'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Día de la semana */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Día de la semana
              </label>
              <select
                value={tariff.dia_semana || ''}
                onChange={e =>
                  setTariff({ 
                    ...tariff, 
                    dia_semana: e.target.value || null 
                  })
                }
                className={`w-full px-4 py-3 border ${
                  errors.dia_semana ? 'border-red-500' : 'border-gray-200'
                } rounded-lg focus:ring-2 focus:ring-[#0B91C1] text-gray-900`}
              >
                <option value="">— Selecciona un día —</option>
                {daysOfWeek.map(d => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              {errors.dia_semana && (
                <p className="mt-1 text-red-600 text-sm">{errors.dia_semana}</p>
              )}
            </div>

            {/* Default */}
            <div className="flex items-center">
              <input
                id="default"
                type="checkbox"
                checked={tariff.default}
                onChange={e =>
                  setTariff({ 
                    ...tariff, 
                    default: e.currentTarget.checked 
                  })
                }
                className="h-4 w-4 text-[#0B91C1] border-gray-300 rounded"
              />
              <label htmlFor="default" className="ml-2 text-gray-700 font-medium">
                Tarifa por defecto
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
                className={`w-full px-4 py-3 border ${
                  errors.hora_inicio ? 'border-red-500' : 'border-gray-200'
                } rounded-lg focus:ring-2 focus:ring-[#0B91C1] text-gray-900`}
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
                className={`w-full px-4 py-3 border ${
                  errors.hora_fin ? 'border-red-500' : 'border-gray-200'
                } rounded-lg focus:ring-2 focus:ring-[#0B91C1] text-gray-900`}
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
                value={tariff.tarifa.toString()}
                onChange={e => {
                  const v = parseFloat(e.target.value);
                  setTariff({ 
                    ...tariff, 
                    tarifa: isNaN(v) ? 0 : v 
                  });
                }}
                className={`w-full px-4 py-3 border ${
                  errors.tarifa ? 'border-red-500' : 'border-gray-200'
                } rounded-lg focus:ring-2 focus:ring-[#0B91C1] text-gray-900`}
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
