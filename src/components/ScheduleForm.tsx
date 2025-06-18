// src/components/ScheduleForm.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Schedule {
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  motivo: string;
}

export default function ScheduleForm() {
  const { empresaId, courtId } = useParams<{ empresaId: string; courtId: string }>();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState<Schedule>({
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    motivo: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Schedule, string>>>({});

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!schedule.fecha)      errs.fecha      = 'Fecha requerida';
    if (!schedule.hora_inicio) errs.hora_inicio = 'Hora de inicio requerida';
    if (!schedule.hora_fin)    errs.hora_fin    = 'Hora de fin requerida';
    if (!schedule.motivo)      errs.motivo      = 'Motivo requerido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/canchas/${courtId}/horarios-bloqueados`,
        { ...schedule, cancha_id: courtId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/admin/canchas/${empresaId}/${courtId}/horarios`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar horario bloqueado');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Si usas AdminNav */}
      {/* <AdminNav /> */}
      <main className="flex-1 p-8 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          Añadir Horario Bloqueado
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fecha */}
          <div>
            <label className="block font-medium mb-1">Fecha</label>
            <input
              type="date"
              value={schedule.fecha}
              onChange={e => setSchedule({ ...schedule, fecha: e.target.value })}
              className={`w-full border rounded px-3 py-2 ${errors.fecha ? 'border-red-500' : ''}`}
            />
            {errors.fecha && <p className="text-red-600 text-sm">{errors.fecha}</p>}
          </div>

          {/* Hora Inicio */}
          <div>
            <label className="block font-medium mb-1">Hora de inicio</label>
            <input
              type="time"
              value={schedule.hora_inicio}
              onChange={e => setSchedule({ ...schedule, hora_inicio: e.target.value })}
              className={`w-full border rounded px-3 py-2 ${errors.hora_inicio ? 'border-red-500' : ''}`}
            />
            {errors.hora_inicio && <p className="text-red-600 text-sm">{errors.hora_inicio}</p>}
          </div>

          {/* Hora Fin */}
          <div>
            <label className="block font-medium mb-1">Hora de fin</label>
            <input
              type="time"
              value={schedule.hora_fin}
              onChange={e => setSchedule({ ...schedule, hora_fin: e.target.value })}
              className={`w-full border rounded px-3 py-2 ${errors.hora_fin ? 'border-red-500' : ''}`}
            />
            {errors.hora_fin && <p className="text-red-600 text-sm">{errors.hora_fin}</p>}
          </div>

          {/* Motivo */}
          <div>
            <label className="block font-medium mb-1">Motivo</label>
            <textarea
              value={schedule.motivo}
              onChange={e => setSchedule({ ...schedule, motivo: e.target.value })}
              className={`w-full border rounded px-3 py-2 ${errors.motivo ? 'border-red-500' : ''}`}
              rows={3}
            />
            {errors.motivo && <p className="text-red-600 text-sm">{errors.motivo}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#075F92] to-[#EB752B] text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Guardar Horario
          </button>
        </form>
      </main>
    </div>
  );
}
