// src/components/ReservaStep2.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Card from './ReservaInfoCard';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  DollarSign,
  Clock,
  Calendar,
  AlarmClock,
  MapPin,
  Globe,
  Info,
  ChevronLeft,
} from 'lucide-react';

interface Tarifa {
  tarifa: number;
  es_default: boolean;
}

interface Cancha {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  imagen_principal: string | null;
  tarifas?: Tarifa[];
}

interface Horario {
  hora_inicio: string;
  hora_fin: string;
}

const agruparBloquesContinuos = (bloques: string[]): Horario[] => {
  const parseHora = (h: string) => new Date(`1970-01-01T${h}:00`);
  const horarios = bloques.map(b => {
    const [inicio, fin] = b.split(' - ');
    return { hora_inicio: inicio, hora_fin: fin };
  }).sort((a, b) => parseHora(a.hora_inicio).getTime() - parseHora(b.hora_inicio).getTime());

  const grupos: Horario[] = [];
  let actual = horarios[0];

  for (let i = 1; i < horarios.length; i++) {
    const anteriorFin = parseHora(actual.hora_fin).getTime();
    const actualInicio = parseHora(horarios[i].hora_inicio).getTime();

    if (actualInicio === anteriorFin) {
      actual.hora_fin = horarios[i].hora_fin;
    } else {
      grupos.push(actual);
      actual = horarios[i];
    }
  }
  grupos.push(actual);
  return grupos;
};

const ReservaStep2: React.FC = () => {
  const { canchaId, date } = useParams<{ canchaId: string; date: string }>();
  const [cancha, setCancha] = useState<Cancha | null>(null);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`/api/reservas-cancha/${canchaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setCancha(res.data))
      .catch(() => setError('No se pudo cargar la información de la cancha.'));

    axios
      .get(`/api/canchas/${canchaId}/disponibilidad/${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHorarios(Array.isArray(res.data.horarios) ? res.data.horarios : []))
      .catch(() => setError('No se pudo cargar la disponibilidad.'));
  }, [canchaId, date]);

  const tarifa = cancha?.tarifas?.find(t => t.es_default);

  const toggleSeleccion = (bloque: string) => {
    setSeleccionados(prev =>
      prev.includes(bloque) ? prev.filter(b => b !== bloque) : [...prev, bloque]
    );
  };

  const handleReserva = async () => {
    if (!date || !canchaId) return;
    const bloques = agruparBloquesContinuos(seleccionados);
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('/api/reservas', {
        cancha_id: canchaId,
        fecha: date,
        bloques,
        estado: 'pending'
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const reservasCreadas = res.data; // Suponiendo que backend devuelve un array de reservas
      const reservasIds = reservasCreadas.map((r: any) => r.id).join(',');

      localStorage.setItem('reservas_pendientes', JSON.stringify({
        cancha_id: canchaId,
        fecha: date,
        bloques,
        createdAt: new Date().toISOString()
      }));

      // alert('Reserva creada. Redirigir a pago...');
      // navigate('/pago');
      navigate(`/reservar/${canchaId}/pago?ids=${reservasIds}&date=${date}`);
    } catch (err) {
      console.error(err);
      setError('No se pudo crear la reserva.');
    }
  };

  const fechaBonita = date ? format(parseISO(date), "d 'de' MMMM 'de' yyyy", { locale: es }) : '';

  // Calcular duración total de los bloques seleccionados
  const totalMs = seleccionados.reduce((acc, bloque) => {
    const [ini, fin] = bloque.split(' - ');
    const hIni = new Date(`1970-01-01T${ini}:00`);
    const hFin = new Date(`1970-01-01T${fin}:00`);
    return acc + (hFin.getTime() - hIni.getTime());
  }, 0);

  const totalMin = Math.floor(totalMs / (1000 * 60));
  const horas = Math.floor(totalMin / 60);
  const minutos = totalMin % 60;

  const duracion =
    seleccionados.length === 0
      ? 'Seleccionar'
      : minutos === 0
      ? `${horas} hora${horas !== 1 ? 's' : ''}`
      : `${horas}h ${minutos}min`;

  return (
    <>
      <Navbar />
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-4xl mx-auto my-4 text-center">
          <strong>Error:</strong> {error}
        </div>
      )}
      <div className="min-h-screen pt-32 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Izquierda */}
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <div
              className="flex items-center gap-2 text-orange-500 cursor-pointer mb-4"
              onClick={() => navigate(`/reservar/${canchaId}`)}
            >
              <ChevronLeft />
              <span className="font-semibold">{fechaBonita}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {horarios.map((h, i) => {
                const bloque = `${h.hora_inicio} - ${h.hora_fin}`;
                const isActive = seleccionados.includes(bloque);
                return (
                  <button
                    key={i}
                    onClick={() => toggleSeleccion(bloque)}
                    className={`py-4 px-2 rounded-2xl text-sm font-semibold border shadow text-center leading-tight transition-colors duration-150 ${
                      isActive ? 'bg-[#f89e1b] text-black' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    <div>{h.hora_inicio}</div>
                    <div>{h.hora_fin}</div>
                    <div>pm</div>
                  </button>
                );
              })}
            </div>

            {seleccionados.length > 0 && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleReserva}
                  className="bg-[#f89e1b] hover:bg-orange-600 text-black font-semibold py-2 px-6 rounded-lg shadow"
                >
                  Reservar
                </button>
              </div>
            )}
          </div>

          {/* Derecha */}
          {cancha && (
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{cancha.nombre}</h2>
              <p className="text-gray-500 mb-6">{cancha.descripcion}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card icon={DollarSign} title={`$${tarifa?.tarifa ?? 'N/D'}`} subtitle="Costo del alquiler" />
                <Card icon={Clock} title={duracion} subtitle="Duración" />
                <Card icon={Calendar} title={fechaBonita} subtitle="Fecha" />
                <Card
                  icon={AlarmClock}
                  title={
                    <div className="flex flex-col space-y-1">
                      {seleccionados.length === 0 ? (
                        <span>Seleccionar</span>
                      ) : (
                        seleccionados.map((bloque, index) => (
                          <span key={index}>{bloque}</span>
                        ))
                      )}
                    </div>
                  }
                  subtitle="Horarios"
                />
                <Card icon={MapPin} title={cancha.ubicacion} subtitle="Ubicación" />
                <Card icon={Globe} title="Ecuador" subtitle="Zona horaria" />
                <div className="col-span-2 flex justify-center">
                  <div className="w-full md:w-2/3">
                    <Card icon={Info} title="Servicios" subtitle="Chalecos, pelota." />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReservaStep2;
