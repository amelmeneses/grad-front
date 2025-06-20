// src/components/OpenHoursForm.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaClock } from 'react-icons/fa';
import AdminNav from './AdminNav';
import { OpenHour } from '../interfaces/OpenHour';

const daysOfWeek = [
  { value: '',         label: '— Selecciona día —' },
  { value: 'monday',    label: 'Lunes' },
  { value: 'tuesday',   label: 'Martes' },
  { value: 'wednesday', label: 'Miércoles' },
  { value: 'thursday',  label: 'Jueves' },
  { value: 'friday',    label: 'Viernes' },
  { value: 'saturday',  label: 'Sábado' },
  { value: 'sunday',    label: 'Domingo' },
];

export default function OpenHoursForm() {
  // Note: param name must match your Route (scheduleId)
  const { empresaId, canchaId, scheduleId } = useParams<{
    empresaId: string;
    canchaId: string;
    scheduleId?: string;
  }>();
  const isEdit = Boolean(scheduleId);
  const navigate = useNavigate();

  const [openHour, setOpenHour] = useState<OpenHour>({
    cancha_id: Number(canchaId!),
    dia_semana: null,
    hora_apertura: '',
    hora_cierre: '',
  });
  const [existing, setExisting] = useState<OpenHour[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof OpenHour, string>>>({});
  const [loading, setLoading] = useState(isEdit);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // convert "HH:MM" → minutes
  const toMinutes = (str: string) => {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + m;
  };

  useEffect(() => {
    const token = localStorage.getItem('token')!;
    // always load all for overlap checks
    axios
      .get<OpenHour[]>(`/api/canchas/${canchaId}/horarios`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(r => setExisting(r.data))
      .catch(() => {});

    if (!isEdit) {
      setLoading(false);
      return;
    }

    // load the one we want to edit
    axios
      .get<OpenHour>(`/api/canchas/${canchaId}/horarios/${scheduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(r => {
        setOpenHour(r.data);
        setErrorMsg(null);
      })
      .catch(() => setErrorMsg('No se pudo cargar el horario'))
      .finally(() => setLoading(false));
  }, [canchaId, scheduleId, isEdit]);

  const validate = () => {
    const errs: typeof errors = {};
    if (!openHour.dia_semana) errs.dia_semana = 'Selecciona un día';
    if (!openHour.hora_apertura) errs.hora_apertura = 'Hora apertura requerida';
    if (!openHour.hora_cierre)  errs.hora_cierre  = 'Hora cierre requerida';

    if (openHour.hora_apertura && openHour.hora_cierre) {
      const start = toMinutes(openHour.hora_apertura);
      const end   = toMinutes(openHour.hora_cierre);
      if (end <= start) {
        errs.hora_cierre = 'Debe ser después de apertura';
      } else {
        const others = existing.filter(o =>
          o.dia_semana === openHour.dia_semana &&
          (!isEdit || o.id !== Number(scheduleId))
        );
        for (const o of others) {
          const oStart = toMinutes(o.hora_apertura);
          const oEnd   = toMinutes(o.hora_cierre);
          if (start < oEnd && end > oStart) {
            errs.hora_apertura = 'Se solapa con otro horario';
            errs.hora_cierre  = 'Se solapa con otro horario';
            break;
          }
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...openHour, cancha_id: Number(canchaId!) };
    const token = localStorage.getItem('token')!;
    try {
      if (isEdit) {
        await axios.put(
          `/api/canchas/${canchaId}/horarios/${scheduleId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `/api/canchas/${canchaId}/horarios`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate(`/admin/canchas/${empresaId}/${canchaId}/horarios`);
    } catch {
      alert('Error al guardar horario');
    }
  };

  if (loading)   return <div className="p-8 text-gray-700">Cargando…</div>;
  if (errorMsg)  return <div className="p-8 text-red-500">{errorMsg}</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {isEdit ? 'Editar Horario' : 'Añadir Horario'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Día */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Día de la semana
              </label>
              <select
                value={openHour.dia_semana || ''}
                onChange={e =>
                  setOpenHour({ ...openHour, dia_semana: e.target.value || null })
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0B91C1] text-gray-900"
              >
                {daysOfWeek.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              {errors.dia_semana && (
                <p className="mt-1 text-red-600 text-sm">{errors.dia_semana}</p>
              )}
            </div>

            {/* Apertura */}
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-1">
                Hora apertura
              </label>
              <input
                type="time"
                value={openHour.hora_apertura}
                onChange={e =>
                  setOpenHour({ ...openHour, hora_apertura: e.target.value })
                }
                className={`w-full px-4 py-3 bg-gray-50 border ${
                  errors.hora_apertura ? 'border-red-500' : 'border-gray-200'
                } rounded-lg focus:ring-2 focus:ring-[#0B91C1] text-gray-900`}
              />
              <FaClock className="absolute inset-y-0 right-4 m-auto text-gray-400 pointer-events-none" />
              {errors.hora_apertura && (
                <p className="mt-1 text-red-600 text-sm">{errors.hora_apertura}</p>
              )}
            </div>

            {/* Cierre */}
            <div className="relative">
              <label className="block text-gray-700 font-medium mb-1">
                Hora cierre
              </label>
              <input
                type="time"
                value={openHour.hora_cierre}
                onChange={e =>
                  setOpenHour({ ...openHour, hora_cierre: e.target.value })
                }
                className={`w-full px-4 py-3 bg-gray-50 border ${
                  errors.hora_cierre ? 'border-red-500' : 'border-gray-200'
                } rounded-lg focus:ring-2 focus:ring-[#0B91C1] text-gray-900`}
              />
              <FaClock className="absolute inset-y-0 right-4 m-auto text-gray-400 pointer-events-none" />
              {errors.hora_cierre && (
                <p className="mt-1 text-red-600 text-sm">{errors.hora_cierre}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#075F92] to-[#EB752B] text-white font-semibold rounded-lg hover:opacity-90 transition"
            >
              {isEdit ? 'Guardar Cambios' : 'Crear Horario'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
