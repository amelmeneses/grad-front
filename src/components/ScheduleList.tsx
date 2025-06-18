// src/components/ScheduleList.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNav from './AdminNav';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface Schedule { id: number; fecha: string; hora_inicio: string; hora_fin: string; motivo: string; }
interface Court { id: number; nombre: string; }
interface Company { id: number; nombre: string; }

export default function ScheduleList() {
  const { empresaId, courtId } = useParams<{ empresaId: string; courtId: string }>();
  const [companyName, setCompanyName] = useState('');
  const [courtName, setCourtName] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const navigate = useNavigate();

  useEffect(()=>{
    const token = localStorage.getItem('token');
    axios.get<Company>(`/api/empresas/${empresaId}`,{ headers:{ Authorization:`Bearer ${token}` }})
      .then(res=> setCompanyName(res.data.nombre))
      .catch(()=>{});
    axios.get<Court>(`/api/canchas/${courtId}`,{ headers:{ Authorization:`Bearer ${token}` }})
      .then(res=> setCourtName(res.data.nombre))
      .catch(()=>{});
    axios.get<Schedule[]>(`/api/horarios_bloqueados?cancha_id=${courtId}`,{ headers:{ Authorization:`Bearer ${token}` }})
      .then(res=> setSchedules(res.data))
      .catch(()=> setError('No se pudieron cargar horarios'))
      .finally(()=> setLoading(false));
  },[empresaId, courtId]);

  if(loading) return <div className="p-8">Cargando horarios…</div>;
  if(error)   return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Horarios de {courtName} de {companyName}
          </h1>
          <button
            onClick={()=> navigate(`/admin/canchas/${empresaId}/${courtId}/horarios/new`)}
            className="px-4 py-2 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white rounded-lg shadow hover:opacity-90 transition"
          >
            Añadir Horario
          </button>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600 uppercase">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Hora Inicio</th>
                <th className="p-3 text-left">Hora Fin</th>
                <th className="p-3 text-left">Motivo</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length===0 ? (
                <tr><td colSpan={6} className="p-3 text-center text-gray-500">No hay horarios bloqueados.</td></tr>
              ) : (
                schedules.map(s=> (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-800">{s.id}</td>
                    <td className="p-3 text-gray-800">{s.fecha}</td>
                    <td className="p-3 text-gray-800">{s.hora_inicio}</td>
                    <td className="p-3 text-gray-800">{s.hora_fin}</td>
                    <td className="p-3 text-gray-800">{s.motivo}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={()=> navigate(`/admin/canchas/${empresaId}/${courtId}/horarios/${s.id}`)}
                        className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                        title="Editar Horario"
                      ><FaEdit className="text-[#0B91C1]" size={16}/></button>
                      <button
                        onClick={async()=>{
                          if(!window.confirm('¿Eliminar este horario?')) return;
                          try{
                            const token = localStorage.getItem('token');
                            await axios.delete(`/api/horarios_bloqueados/${s.id}`,{ headers:{ Authorization:`Bearer ${token}` } });
                            setSchedules(prev=> prev.filter(x=> x.id!==s.id));
                          }catch{ alert('Error al eliminar horario'); }
                        }}
                        className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                        title="Eliminar Horario"
                      ><FaTrash className="text-red-500" size={16}/></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
