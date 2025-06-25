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
  default: boolean;
}

interface Cancha {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  imagen_principal: string | null;
  tarifas?: Tarifa[];
}

const ReservaStep2: React.FC = () => {
  const { canchaId, date } = useParams<{ canchaId: string; date: string }>();
  const [cancha, setCancha] = useState<Cancha | null>(null);
  const [horarios, setHorarios] = useState<{ hora_inicio: string; hora_fin: string }[]>([]);
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

  const tarifa = cancha?.tarifas?.find(t => t.default);

  const toggleSeleccion = (bloque: string) => {
    setSeleccionados(prev =>
      prev.includes(bloque)
        ? prev.filter(b => b !== bloque)
        : [...prev, bloque]
    );
  };

  const handleReserva = () => {
    console.log('Reservando bloques:', seleccionados);
    alert('Reemplazar alert por reserva process');
  };

  const fechaBonita = date ? format(parseISO(date), "d 'de' MMMM 'de' yyyy", { locale: es }) : '';

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
                      isActive
                        ? 'bg-[#f89e1b] text-black'
                        : 'bg-green-100 text-green-800'
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
                <Card icon={Clock} title="1 hora" subtitle="Duración" />
                <Card icon={Calendar} title={fechaBonita} subtitle="Fecha" />
                <Card icon={AlarmClock} title={seleccionados.join(', ') || 'Seleccionar'} subtitle="Horarios" />
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
