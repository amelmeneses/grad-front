import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';
import Navbar from './Navbar';
import { FiXCircle } from 'react-icons/fi';
import { parseISO } from 'date-fns';

interface Cancha {
  id: number;
  nombre: string;
}

interface Reserva {
  id: number;
  usuario_id: number;
  cancha: Cancha;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
}

export default function ReservasList() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtroCancha, setFiltroCancha] = useState<number | 'all'>('all');
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservas = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No autenticado');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get<Reserva[]>('/api/reservas', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Arreglo al campo fecha
      const reservasFix = res.data.map(r => ({
        ...r,
        fecha: parseISO(r.fecha).toISOString()
      }));

      setReservas(reservasFix);
      const unique = Array.from(
        new Map(reservasFix.map(r => [r.cancha.id, r.cancha])).values()
      );
      setCanchas(unique);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.status === 401
          ? 'No autorizado. Por favor inicia sesión.'
          : 'Error cargando reservas'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  const cancelReserva = async (id: number, estado: string) => {
    if (estado === 'cancelada') return;
    if (!window.confirm('¿Deseas cancelar esta reserva?')) return;
    const token = localStorage.getItem('token')!;
    try {
      await axios.patch(`/api/reservas/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReservas();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error cancelando reserva');
    }
  };

  const filtered =
    filtroCancha === 'all'
      ? reservas
      : reservas.filter(r => r.cancha.id === filtroCancha);

  if (loading) return <div className="p-8 text-gray-700">Cargando reservas…</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-white mt-16">
        <AdminNav />
        <main className="flex-1 p-8">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Reservas</h1>
          </header>

          {/* Filtro de canchas */}
          <div className="mb-4 w-64">
            <label className="block mb-1 text-gray-700 font-medium">Filtrar por cancha:</label>
            <div className="relative">
              <select
                value={filtroCancha}
                onChange={e =>
                  setFiltroCancha(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                }
                className="block w-full appearance-none bg-white border border-gray-200 rounded px-4 py-2 pr-8 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">— Todas las canchas —</option>
                {canchas.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg
                  className="fill-current h-4 w-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.516 7.548a.5.5 0 0 1 .683-.183l.07.057L10 10.882l3.73-3.46a.5.5 0 0 1 .743.671l-.057.07-4 3.708a.5.5 0 0 1-.647.057l-.07-.057-4-3.708a.5.5 0 0 1-.132-.574l.032-.069z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tabla de reservas */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-sm text-gray-600 uppercase">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Usuario</th>
                  <th className="p-3 text-left">Cancha</th>
                  <th className="p-3 text-left">Fecha</th>
                  <th className="p-3 text-left">Hora</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-3 text-center text-gray-500">
                      No hay reservas.
                    </td>
                  </tr>
                ) : (
                  filtered.map(res => (
                    <tr
                      key={res.id}
                      className="border-b hover:bg-gray-50 text-center"
                    >
                      <td className="p-3 text-gray-800 text-left">{res.id}</td>
                      <td className="p-3 text-gray-800 text-left">{res.usuario_id}</td>
                      <td className="p-3 text-gray-800 text-left">{res.cancha.nombre}</td>
                      <td className="p-3 text-gray-800 text-left">
                        {new Date(res.fecha).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-gray-800 text-left">
                        {`${res.hora_inicio} - ${res.hora_fin}`}
                      </td>
                      <td className="p-3 text-left">
                        {(() => {
                          switch (res.estado) {
                            case 'cancelada':
                              return (
                                <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                                  Cancelada
                                </span>
                              );
                            case 'pending':
                              return (
                                <span className="inline-block px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                                  Pendiente
                                </span>
                              );
                            case 'paid':
                              return (
                                <span className="inline-block px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                                  Pagado
                                </span>
                              );
                            default:
                              return (
                                <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                                  {res.estado}
                                </span>
                              );
                          }
                        })()}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          title={
                            res.estado === 'cancelada'
                              ? 'Reserva cancelada'
                              : 'Cancelar Reserva'
                          }
                          onClick={() => cancelReserva(res.id, res.estado)}
                          disabled={res.estado === 'cancelada'}
                          className={`bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition ${
                            res.estado === 'cancelada'
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                        >
                          <FiXCircle
                            className={`text-red-500 ${
                              res.estado === 'cancelada'
                                ? 'text-red-300'
                                : ''
                            }`}
                            size={18}
                          />
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
    </>
  );
}
