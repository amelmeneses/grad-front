import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Card from './ReservaInfoCard';
import CalendarioReserva from './CalendarioReserva';

import {
  DollarSign,
  Clock,
  Calendar,
  AlarmClock,
  MapPin,
  Globe,
  Info
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

const ReservaStep1: React.FC = () => {
  const { canchaId } = useParams<{ canchaId: string }>();
  const navigate = useNavigate();

  const [cancha, setCancha] = useState<Cancha | null>(null);
  const [fecha, setFecha] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get(`/api/reservas-cancha/${canchaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setCancha(res.data))
      .catch(() => setError('No se pudo cargar la información de la cancha.'));
  }, [canchaId]);

  const tarifa = cancha?.tarifas?.find(t => t.default);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 px-6 md:px-16">
        <h1 className="text-3xl font-bold text-center mb-10">PROGRAME SU RESERVA</h1>

        {error && <p className="text-center text-red-600">{error}</p>}

        {cancha && (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Calendario (lado izquierdo) */}
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Selecciona una fecha:</h2>
              <CalendarioReserva canchaId={canchaId!} onDateSelect={(date) => setFecha(date)} />
            </div>

            {/* Panel derecho */}
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{cancha.nombre}</h2>
              <p className="text-gray-500 mb-6">{cancha.descripcion}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card icon={DollarSign} title={`$${tarifa?.tarifa ?? 'N/D'}`} subtitle="Costo del alquiler" />
                <Card icon={Clock} title="1 hora" subtitle="Duración" />
                <Card icon={Calendar} title={fecha || 'Selecciona'} subtitle="Fecha" />
                <Card icon={AlarmClock} title="Seleccionar horario" subtitle="Tiempo" />
                <Card icon={MapPin} title={cancha.ubicacion} subtitle="Ubicación" />
                <Card icon={Globe} title="Ecuador" subtitle="Zona horaria" />

                {/* Centramos la tarjeta de servicios */}
                <div className="col-span-2 flex justify-center">
                  <div className="w-full md:w-2/3">
                    <Card icon={Info} title="Servicios" subtitle="Chalecos, pelota." />
                  </div>
                </div>
              </div>

              <button
                disabled={!fecha}
                onClick={() => {
                  if (fecha) navigate(`/reservar/${canchaId}/horario?fecha=${fecha}`);
                }}
                className="mt-6 w-full bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white px-6 py-2 rounded-full shadow hover:opacity-90 transition"
              >
                Continuar Reserva
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReservaStep1;
