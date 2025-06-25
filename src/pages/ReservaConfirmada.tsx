import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/ReservaInfoCard';
import {
  DollarSign,
  Clock,
  Calendar,
  AlarmClock,
  MapPin,
  Globe,
  Info,
} from 'lucide-react';

const ReservaConfirmada: React.FC = () => {
  const [reserva, setReserva] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('reserva_confirmada');
    if (data) {
      setReserva(JSON.parse(data));
      localStorage.removeItem('reserva_confirmada');
      localStorage.removeItem('reservas_pendientes');
    }
  }, []);

  if (!reserva) return <div className="p-8 text-gray-700">Cargando confirmación…</div>;

  const { cancha, pago, horarios, fecha } = reserva;

  // Calcular duración total
  const totalMs = horarios.reduce((acc: number, bloque: string) => {
    const [ini, fin] = bloque.split(' - ');
    const hIni = new Date(`1970-01-01T${ini}:00`);
    const hFin = new Date(`1970-01-01T${fin}:00`);
    return acc + (hFin.getTime() - hIni.getTime());
  }, 0);

  const totalMin = Math.floor(totalMs / (1000 * 60));
  const horas = Math.floor(totalMin / 60);
  const minutos = totalMin % 60;

  const duracion = minutos === 0
    ? `${horas} hora${horas !== 1 ? 's' : ''}`
    : `${horas}h ${minutos}min`;

  return (
    <>
      <Navbar />
      <div className="pt-32 px-6 md:px-16 max-w-6xl mx-auto">
        <h1 className="text-3xl text-gray-800 font-bold mb-10 text-center">RESERVA REALIZADA</h1>
        <div className="bg-white rounded-3xl shadow-lg grid md:grid-cols-2 p-10 gap-10">
          {/* Panel Izquierdo */}
          <div className="text-gray-800 text-md leading-7">
            <p>¡Gracias por elegirnos aquí en PlayBooker!</p>
            <br />
            <p>
              Nos sentimos honrados de ser parte de tu experiencia deportiva. A través de nuestra plataforma,
              estás en el camino hacia disfrutar de los mejores espacios deportivos para baloncesto, pádel, fútbol y tenis.
            </p>
            <br />
            <p>
              Muy pronto, alguien de nuestro equipo se pondrá en contacto contigo para confirmar algunos detalles de tu reserva.
              Estamos ansiosos por ofrecerte una experiencia deportiva sin igual. Si tienes alguna pregunta o necesitas más asistencia,
              no dudes en comunicarte con nosotros.
            </p>
            <br />
            <p>
              ¡Estamos emocionados de verte en acción y de apoyarte en tu pasión deportiva!
            </p>
          </div>

          {/* Panel Derecho */}
          <div className="bg-white text-sm text-gray-800 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{cancha.nombre}</h2>
            <p className="text-gray-500 mb-6">{cancha.descripcion}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card icon={DollarSign} title={`$${pago.total}`} subtitle="Costo del alquiler" />
              <Card icon={Clock} title={duracion} subtitle="Duración" />
              <Card icon={Calendar} title={fecha} subtitle="Fecha" />
              <Card
                icon={AlarmClock}
                title={horarios.join(', ')}
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
        </div>
      </div>
    </>
  );
};

export default ReservaConfirmada;
