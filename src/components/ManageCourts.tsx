// src/components/ManageCourts.tsx

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';
import { FaEdit, FaTrash, FaMoneyBillWave, FaClock } from 'react-icons/fa';
import { Court } from '../interfaces/Court';
import { Tariff } from '../interfaces/Tariff';

interface Company { id: number; nombre: string; }

export default function ManageCourts() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const [companyName, setCompanyName]   = useState('');
  const [courts,       setCourts]       = useState<Court[]>([]);
  const [defaultPrice, setDefaultPrice] = useState<Record<number, number>>({});
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCourts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token')!;
      // 1) Nombre empresa
      const [{ data: comp }, { data: courtList }] = await Promise.all([
        axios.get<Company>(`/api/empresas/${empresaId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get<Court[]>(`/api/canchas?empresa_id=${empresaId}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setCompanyName(comp.nombre);
      setCourts(courtList);

      // 2) Obtener tarifa por defecto de cada cancha
      const map: Record<number, number> = {};
      await Promise.all(
        courtList.map(async c => {
          const tr = await axios.get<Tariff[]>(
            `/api/canchas/${c.id}/tarifas`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const def = tr.data.find(x => x.default);
          if (def) map[c.id!] = Number(def.tarifa);
        })
      );
      setDefaultPrice(map);
      setError(null);
    } catch {
      setError('No se pudieron cargar las canchas');
    } finally {
      setLoading(false);
    }
  }, [empresaId]);

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  const toggleEstado = async (id: number, currentEstado: number) => {
    const nuevoEstado = currentEstado === 1 ? 0 : 1;
    const confirmMsg = `¿Está seguro de que desea marcar esta cancha como ${
      nuevoEstado === 1 ? 'Activo' : 'Inactivo'
    }?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const token = localStorage.getItem('token')!;
      const url =
        nuevoEstado === 1
          ? `/api/canchas/${id}/activar`
          : `/api/canchas/${id}/desactivar`;

      await axios.patch(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchCourts();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al cambiar estado';
      alert(msg);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro que desea eliminar esta cancha?')) return;
    try {
      const token = localStorage.getItem('token')!;
      await axios.delete(`/api/canchas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCourts();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error al eliminar cancha';
      alert(msg);
    }
  };

  if (loading) return <div className="p-8 text-gray-700">Cargando canchas…</div>;
  if (error)   return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Canchas de {companyName}</h1>
          </div>
          <button
            onClick={() => navigate(`/admin/canchas/${empresaId}/new`)}
            className="px-4 py-2 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white font-medium rounded-lg shadow hover:opacity-90 transition"
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
                <th className="p-3 text-left">Deporte</th>
                <th className="p-3 text-left">Ubicación</th>
                <th className="p-3 text-left">Estado</th>
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
                courts.map(court => {
                  const price = defaultPrice[court.id!] ?? null;
                  return (
                    <tr key={court.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-800">{court.id}</td>
                      <td className="p-3 text-gray-800">{court.nombre}</td>
                      <td className="p-3 text-gray-800">{court.descripcion || '—'}</td>
                      <td className="p-3 text-gray-800">
                        {price != null ? `$${price.toFixed(2)}` : '—'}
                      </td>
                      <td className="p-3 text-gray-800">{court.deporte}</td>
                      <td className="p-3 text-gray-800">{court.ubicacion || '—'}</td>
                      <td className="p-3">
                        {court.estado === 1 ? (
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center space-x-2">
                        {/* Edit */}
                        <button
                          title="Editar Cancha"
                          onClick={() => navigate(`/admin/canchas/${empresaId}/${court.id}`)}
                          className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                        >
                          <FaEdit className="text-[#0B91C1]" size={16} />
                        </button>

                        {/* Toggle Estado */}
                        {court.estado === 1 ? (
                          <button
                            title="Desactivar Cancha"
                            onClick={() => toggleEstado(court.id!, court.estado)}
                            className="px-3 py-2 bg-red-100 text-red-700 border border-red-700 rounded-lg hover:bg-red-200 transition"
                          >
                            Desactivar
                          </button>
                        ) : (
                          <button
                            title="Activar Cancha"
                            onClick={() => toggleEstado(court.id!, court.estado)}
                            className="px-3 py-2 bg-green-100 text-green-700 border border-green-700 rounded-lg hover:bg-green-200 transition"
                          >
                            Activar
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          title="Eliminar Cancha"
                          onClick={() => handleDelete(court.id!)}
                          className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-red-500"
                        >
                          <FaTrash size={16} />
                        </button>

                        {/* Manage Tariffs */}
                        <button
                          title="Manejar Tarifas"
                          onClick={() =>
                            navigate(`/admin/canchas/${empresaId}/${court.id}/tarifas`)
                          }
                          className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                        >
                          <FaMoneyBillWave className="text-green-600" size={16} />
                        </button>

                        {/* Schedule */}
                        <button
                          title="Horarios de Funcionamiento"
                          onClick={() =>
                            navigate(`/admin/canchas/${empresaId}/${court.id}/horarios`)
                          }
                          className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                        >
                          <FaClock className="text-blue-600" size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
