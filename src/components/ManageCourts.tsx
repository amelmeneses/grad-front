import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Court } from '../interfaces/Court';

interface Company {
  id: number;
  nombre: string;
}

export default function ManageCourts() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const [companyName, setCompanyName] = useState('');
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // 1) Nombre de la empresa
    axios
      .get<Company>(`/api/empresas/${empresaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setCompanyName(res.data.nombre))
      .catch(() => setCompanyName(`Empresa #${empresaId}`));

    // 2) Lista de canchas
    axios
      .get<Court[]>(`/api/canchas?company_id=${empresaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setCourts(res.data);
        setError(null);
      })
      .catch(() => setError('No se pudieron cargar las canchas'))
      .finally(() => setLoading(false));
  }, [empresaId]);

  if (loading) return <div className="p-8 text-gray-700">Cargando canchas…</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8">
        {/* Encabezado */}
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Canchas de {companyName}
          </h1>
          <button
            onClick={() => navigate(`/admin/canchas/${empresaId}/new`)}
            className="px-4 py-2 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white rounded-lg shadow hover:opacity-90 transition"
          >
            Añadir Cancha
          </button>
        </header>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600 uppercase">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Descripción</th>
                <th className="p-3 text-left">Precio/Hora</th>
                <th className="p-3 text-left">Tipo Deporte</th>
                <th className="p-3 text-left">Deporte</th>
                <th className="p-3 text-left">Ubicación</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {courts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-3 text-center text-gray-500">
                    No hay canchas registradas.
                  </td>
                </tr>
              ) : (
                courts.map(court => (
                  <tr key={court.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-800">{court.id}</td>
                    <td className="p-3 text-gray-800">{court.name}</td>
                    <td className="p-3 text-gray-800">{court.description}</td>
                    <td className="p-3 text-gray-800">{court.price_per_hour}</td>
                    <td className="p-3 text-gray-800">{court.sport_type}</td>
                    <td className="p-3 text-gray-800">{court.deporte}</td>
                    <td className="p-3 text-gray-800">{court.location}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        title="Editar Cancha"
                        onClick={() => navigate(`/admin/canchas/${empresaId}/${court.id}`)}
                        className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                      >
                        <FaEdit className="text-[#0B91C1]" size={16} />
                      </button>
                      <button
                        title="Eliminar Cancha"
                        onClick={async () => {
                          if (!window.confirm('¿Eliminar esta cancha?')) return;
                          try {
                            const token = localStorage.getItem('token');
                            await axios.delete(
                              `/api/canchas/${court.id}`,
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            setCourts(prev => prev.filter(c => c.id !== court.id));
                          } catch {
                            alert('Error al eliminar cancha');
                          }
                        }}
                        className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                      >
                        <FaTrash className="text-red-500" size={16} />
                      </button>
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
