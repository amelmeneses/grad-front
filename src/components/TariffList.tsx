// src/components/TariffList.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Tariff } from '../interfaces/Tariff';

interface CourtInfo { id: number; nombre: string }
interface Company   { id: number; nombre: string }

const daysOfWeek = [
  { value: 'monday',    label: 'Lunes' },
  { value: 'tuesday',   label: 'Martes' },
  { value: 'wednesday', label: 'Miércoles' },
  { value: 'thursday',  label: 'Jueves' },
  { value: 'friday',    label: 'Viernes' },
  { value: 'saturday',  label: 'Sábado' },
  { value: 'sunday',    label: 'Domingo' },
];

export default function TariffList() {
  const { empresaId, canchaId } = useParams<{
    empresaId: string;
    canchaId: string;
  }>();
  const [companyName, setCompanyName] = useState('');
  const [courtName,   setCourtName]   = useState('');
  const [tariffs,     setTariffs]     = useState<Tariff[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token')!;
    // 1) Empresa
    axios.get<Company>(`/api/empresas/${empresaId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setCompanyName(r.data.nombre))
      .catch(() => setCompanyName(`Empresa #${empresaId}`));
    // 2) Cancha
    axios.get<CourtInfo>(`/api/canchas/${canchaId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setCourtName(r.data.nombre))
      .catch(() => setCourtName(`Cancha #${canchaId}`));
    // 3) Tarifas
    axios.get<Tariff[]>(`/api/canchas/${canchaId}/tarifas`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { setTariffs(r.data); setError(null) })
      .catch(() => setError('No se pudieron cargar las tarifas'))
      .finally(() => setLoading(false));
  }, [empresaId, canchaId]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta tarifa?')) return;
    try {
      const token = localStorage.getItem('token')!;
      await axios.delete(`/api/canchas/${canchaId}/tarifas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTariffs(ts => ts.filter(t => t.id !== id));
    } catch {
      alert('Error al eliminar tarifa');
    }
  };

  if (loading) return <div className="p-8 text-gray-700">Cargando tarifas…</div>;
  if (error)   return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Tarifas de {courtName} de {companyName}
          </h1>
          <button
            onClick={() => navigate(`/admin/canchas/${empresaId}/${canchaId}/tarifas/new`)}
            className="px-4 py-2 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white rounded-lg shadow hover:opacity-90 transition"
          >
            Añadir Tarifa
          </button>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600 uppercase">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Día Semana</th>
                <th className="p-3 text-left">Por Defecto</th>
                <th className="p-3 text-left">Hora Inicio</th>
                <th className="p-3 text-left">Hora Fin</th>
                <th className="p-3 text-left">Tarifa</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tariffs.length === 0
                ? <tr>
                    <td colSpan={7} className="p-3 text-center text-gray-500">
                      No hay tarifas registradas.
                    </td>
                  </tr>
                : tariffs.map(t => {
                    const label = t.dia_semana
                      ? daysOfWeek.find(d => d.value === t.dia_semana)?.label
                      : '-';
                    return (
                      <tr key={t.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-800">{t.id}</td>
                        <td className="p-3 text-gray-800">{label}</td>
                        <td className="p-3 text-gray-800">{t.default ? 'Sí' : 'No'}</td>
                        <td className="p-3 text-gray-800">{t.hora_inicio}</td>
                        <td className="p-3 text-gray-800">{t.hora_fin}</td>
                        <td className="p-3 text-gray-800">{t.tarifa.toFixed(2)}</td>
                        <td className="p-3 text-center space-x-2">
                          <button
                            title="Editar Tarifa"
                            onClick={() =>
                              navigate(`/admin/canchas/${empresaId}/${canchaId}/tarifas/${t.id}`)
                            }
                            className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                          >
                            <FaEdit className="text-[#0B91C1]" size={16} />
                          </button>
                          <button
                            title="Eliminar Tarifa"
                            onClick={() => t.id !== undefined && handleDelete(t.id)}
                            className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                          >
                            <FaTrash className="text-red-500" size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
