import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { format, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import Navbar from '../components/Navbar';

interface Reserva {
  id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  cancha: {
    nombre: string;
    ubicacion: string;
  };
}

export default function ReservasUsuario() {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    axios.get<Reserva[]>('/mis-reservas')
      .then((response) => setReservas(response.data))
      .catch((error) => {
        console.error('Error al obtener reservas:', error);
        setReservas([]);
      });
  }, []);

  const handleCancelar = async (id: number) => {
    if (window.confirm('¿Deseas cancelar esta reserva?')) {
      try {
        await axios.patch(`/reservas/${id}/cancel`);
        setReservas(reservas.map(r =>
          r.id === id ? { ...r, estado: 'canceled' } : r
        ));
      } catch (err) {
        console.error('Error al cancelar:', err);
      }
    }
  };

  const esPasada = (reserva: Reserva): boolean => {
    const hoy = new Date();
    const fechaHoraFin = new Date(`${reserva.fecha}T${reserva.hora_fin}`);
    return isBefore(fechaHoraFin, hoy);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-32 p-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#1D9DB6]">Mis Reservas</h2>

        {reservas.length === 0 ? (
          <p className="text-center text-gray-500">No tienes reservas todavía.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservas.map(reserva => {
              const fechaFormateada = format(new Date(`${reserva.fecha}T00:00:00`), "d 'de' MMMM, yyyy", { locale: es });
              const pasada = esPasada(reserva);

              return (
                <div
                  key={reserva.id}
                  className={`rounded-lg p-4 shadow-md ${
                    pasada ? 'bg-gray-300' : 'bg-gray-100'
                  }`}
                >
                  <p className="text-lg font-semibold text-[#1D9DB6]">
                    Reserva en <span className="text-[#EB752B]">{reserva.cancha.nombre}</span>
                  </p>
                  <p className="text-sm text-gray-600">{fechaFormateada}</p>
                  <p className="text-sm text-gray-700">{reserva.hora_inicio} - {reserva.hora_fin}</p>
                  <p className="text-sm text-gray-600">{reserva.cancha.ubicacion}</p>

                  <div className="mt-4 flex justify-between items-center">
                    {reserva.estado === 'canceled' ? (
                      <span className="text-red-600 font-semibold text-sm">Cancelada</span>
                    ) : !pasada ? (
                      <button
                        onClick={() => handleCancelar(reserva.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded shadow"
                      >
                        Cancelar
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
