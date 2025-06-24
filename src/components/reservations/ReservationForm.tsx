// import React, { useState } from "react";
// import { createReservation } from "../../api/reservations";
// import { Reservation } from "../../interfaces/ Reservation";

// const ReservationForm = ({ onReservationAdded }: { onReservationAdded: () => void }) => {
//   const [form, setForm] = useState<Reservation>({
//     user_id: 0,
//     court_id: 0,
//     date: "",
//     start_time: "",
//     end_time: "",
//     status: ""
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: name === "user_id" || name === "court_id" ? Number(value) : value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await createReservation(form);
//     setForm({ user_id: 0, court_id: 0, date: "", start_time: "", end_time: "", status: "" });
//     onReservationAdded();
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="user_id" type="number" value={form.user_id} onChange={handleChange} placeholder="ID de usuario" />
//       <input name="court_id" type="number" value={form.court_id} onChange={handleChange} placeholder="ID de cancha" />
//       <input name="date" value={form.date} onChange={handleChange} placeholder="Fecha" />
//       <input name="start_time" value={form.start_time} onChange={handleChange} placeholder="Hora inicio" />
//       <input name="end_time" value={form.end_time} onChange={handleChange} placeholder="Hora fin" />
//       <input name="status" value={form.status} onChange={handleChange} placeholder="Estado" />
//       <button type="submit">Crear Reserva</button>
//     </form>
//   );
// };

// export default ReservationForm;
