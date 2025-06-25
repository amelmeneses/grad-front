// src/components/CalendarioReserva.tsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import type { CalendarProps } from 'react-calendar';
import { format, isBefore, startOfDay, endOfMonth, addMonths } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import './CalendarioReserva.css';
import axios from 'axios';

interface CalendarioReservaProps {
  onDateSelect: (fecha: string) => void;
  canchaId: string;
}

const CalendarioReserva: React.FC<CalendarioReservaProps> = ({ onDateSelect, canchaId }) => {
  const [value, setValue] = useState<Date>(new Date());
  const [disponibilidad, setDisponibilidad] = useState<Record<string, { disponibles: string[]; no_disponibles: string[] }>>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`/api/canchas/${canchaId}/disponibilidad`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setDisponibilidad(res.data))
      .catch(err => console.error('Error al cargar disponibilidad:', err));
  }, [canchaId]);

  // Rango: desde hoy hasta FIN del mes siguiente
  const hoy = startOfDay(new Date());
  const finMesSiguiente = endOfMonth(addMonths(hoy, 1));

  const handleChange: CalendarProps['onChange'] = (date) => {
    if (date instanceof Date) {
      setValue(date);
      onDateSelect(format(date, 'yyyy-MM-dd'));
    }
  };

  const tileClassName: CalendarProps['tileClassName'] = ({ date, view }) => {
    if (view !== 'month') return '';

    const fechaStr = format(date, 'yyyy-MM-dd');
    const datosMes = disponibilidad[fechaStr.slice(0,7)];

    if (isBefore(date, hoy)) return 'vencido';
    if (datosMes?.disponibles.includes(fechaStr)) return 'disponible';
    if (datosMes?.no_disponibles.includes(fechaStr)) return 'no-disponible';
    return '';
  };

  const tileDisabled: CalendarProps['tileDisabled'] = ({ date, view }) => {
    if (view !== 'month') return false;
    const fechaStr = format(date, 'yyyy-MM-dd');
    const datosMes = disponibilidad[fechaStr.slice(0,7)];

    // deshabilita: pasados, fuera de rango, o explícitamente no disponibles
    return (
      isBefore(date, hoy) ||
      date > finMesSiguiente ||
      !!datosMes?.no_disponibles.includes(fechaStr)
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl">
      <p className="text-gray-800 mb-4 font-semibold">Selecciona una fecha:</p>
      <Calendar
        onChange={handleChange}
        value={value}
        locale="es"
        className="w-full"
        tileClassName={tileClassName}
        tileDisabled={tileDisabled}
        minDate={hoy}
        maxDate={finMesSiguiente}
        // quita saltos rápidos de año
        prev2Label={null}
        next2Label={null}
      />
      <div className="mt-4 flex justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-300 inline-block" />
          Horarios disponibles
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-300 inline-block" />
          Horarios no disponibles
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-gray-300 inline-block" />
          Horas vencidas
        </div>
      </div>
    </div>
  );
};

export default CalendarioReserva;
