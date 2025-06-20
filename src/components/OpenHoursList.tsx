// src/components/OpenHoursList.tsx

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { OpenHour } from '../interfaces/OpenHour';

interface Company   { id: number; nombre: string }
interface CourtInfo { id: number; nombre: string }

const daysOfWeek = [
  { value: 'monday',    label: 'Lunes' },
  { value: 'tuesday',   label: 'Martes' },
  { value: 'wednesday', label: 'Miércoles' },
  { value: 'thursday',  label: 'Jueves' },
  { value: 'friday',    label: 'Viernes' },
  { value: 'saturday',  label: 'Sábado' },
  { value: 'sunday',    label: 'Domingo' },
];

type SortKey = keyof Pick<OpenHour,'id'|'dia_semana'|'hora_apertura'|'hora_cierre'>;

export default function OpenHoursList() {
  const { empresaId, canchaId } = useParams<{ empresaId:string; canchaId:string }>();
  const canchaNum = Number(canchaId);
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [courtName,   setCourtName]   = useState('');
  const [hours,       setHours]       = useState<OpenHour[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string|null>(null);

  // sorting
  const [sortKey, setSortKey] = useState<SortKey>('dia_semana');
  const [asc,     setAsc]     = useState(true);

  const fetchAll = () => {
    setLoading(true);
    const token = localStorage.getItem('token')!;
    Promise.all([
      axios.get<Company>(`/api/empresas/${empresaId}`,         { headers:{ Authorization:`Bearer ${token}` }}),
      axios.get<CourtInfo>(`/api/canchas/${canchaNum}`,        { headers:{ Authorization:`Bearer ${token}` }}),
      axios.get<OpenHour[]>(`/api/canchas/${canchaNum}/horarios`, { headers:{ Authorization:`Bearer ${token}` }}),
    ])
    .then(([ce, cc, hh]) => {
      setCompanyName(ce.data.nombre);
      setCourtName(  cc.data.nombre);
      setHours(hh.data);
      setError(null);
    })
    .catch(() => setError('Error cargando datos'))
    .finally(() => setLoading(false));
  };

  useEffect(fetchAll, [empresaId, canchaNum]);

  const handleDelete = async (id:number) => {
    if (!confirm('¿Eliminar este horario?')) return;
    const token = localStorage.getItem('token')!;
    await axios.delete(
      `/api/canchas/${canchaNum}/horarios/${id}`,
      { headers:{ Authorization:`Bearer ${token}` }}
    );
    fetchAll();
  };

  // sorted array
  const sorted = useMemo(()=>{
    const arr = [...hours];
    arr.sort((a,b)=>{
      let cmp=0;
      switch(sortKey){
        case 'dia_semana':
          const ia = a.dia_semana
            ? daysOfWeek.findIndex(d=>d.value===a.dia_semana)
            : daysOfWeek.length;
          const ib = b.dia_semana
            ? daysOfWeek.findIndex(d=>d.value===b.dia_semana)
            : daysOfWeek.length;
          cmp = ia - ib;
          break;
        case 'hora_apertura':
        case 'hora_cierre':
          cmp = a[sortKey].localeCompare(b[sortKey]);
          break;
        case 'id':
        default:
          cmp = (a.id||0) - (b.id||0);
      }
      return asc ? cmp : -cmp;
    });
    return arr;
  },[hours,sortKey,asc]);

  const header = (key:SortKey,label:string)=>( 
    <th
      className="p-3 text-left cursor-pointer select-none"
      onClick={()=>{
        if(sortKey===key) setAsc(!asc);
        else{ setSortKey(key); setAsc(true); }
      }}
    >
      {label} {sortKey===key?(asc?'▲':'▼'):''}
    </th>
  );

  if (loading) return <div className="p-8 text-gray-700">Cargando horarios…</div>;
  if (error)   return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav/>
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
            Horarios de {courtName} de {companyName}
          </h1>
          <button
            onClick={()=>navigate(`/admin/canchas/${empresaId}/${canchaNum}/horarios/new`)}
            className="px-4 py-2 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white rounded-lg hover:opacity-90 transition"
          >
            Añadir Horario
          </button>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600 uppercase">
                {header('id','ID')}
                {header('dia_semana','Día')}
                {header('hora_apertura','Apertura')}
                {header('hora_cierre','Cierre')}
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length===0 
                ? (
                  <tr>
                    <td colSpan={5} className="p-3 text-center text-gray-500">
                      No hay horarios registrados.
                    </td>
                  </tr>
                ) : sorted.map(h=>(
                  <tr key={h.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-800">{h.id}</td>
                    <td className="p-3 text-gray-800">
                      {h.dia_semana
                        ? daysOfWeek.find(d => d.value === h.dia_semana)?.label
                        : '—'}
                    </td>
                    <td className="p-3 text-gray-800">{h.hora_apertura}</td>
                    <td className="p-3 text-gray-800">{h.hora_cierre}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        title="Editar"
                        onClick={()=>navigate(
                          `/admin/canchas/${empresaId}/${canchaNum}/horarios/${h.id}`
                        )}
                        className="bg-white p-2 rounded-lg border hover:bg-gray-100 transition"
                      >
                        <FaEdit className="text-[#0B91C1]" size={16}/>
                      </button>
                      <button
                        title="Eliminar"
                        onClick={()=>handleDelete(h.id!)}
                        className="bg-white p-2 rounded-lg border hover:bg-red-50 transition"
                      >
                        <FaTrash className="text-red-500" size={16}/>
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
