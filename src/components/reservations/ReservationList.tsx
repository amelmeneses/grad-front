import { useEffect, useState } from "react";
import { getReservations, deleteReservation } from "../../api/reservations";
import { Reservation } from "../../interfaces/ Reservation";

const ReservationList = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const fetchReservations = async () => {
    const data = await getReservations();
    setReservations(data);
  };

  const handleDelete = async (id: number) => {
    await deleteReservation(id);
    fetchReservations();
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div>
      <h2>Lista de Reservas</h2>
      <ul>
        {reservations.map((res) => (
          <li key={res.id}>
            Usuario {res.user_id}, Cancha {res.court_id} - {res.date} {res.start_time}-{res.end_time} ({res.status})
            <button onClick={() => handleDelete(res.id!)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationList;
