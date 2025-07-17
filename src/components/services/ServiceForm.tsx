// import React, { useState } from "react";
// import { createService } from "../../api/services";
// import { Service } from "../../interfaces/Service";

// const ServiceForm = ({ onServiceAdded }: { onServiceAdded: () => void }) => {
//   const [form, setForm] = useState<Service>({
//     name: "",
//     description: "",
//     price: 0,
//     court_id: 0
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: name === "price" || name === "court_id" ? Number(value) : value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await createService(form);
//     setForm({ name: "", description: "", price: 0, court_id: 0 });
//     onServiceAdded();
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre del servicio" />
//       <input name="description" value={form.description} onChange={handleChange} placeholder="Descripción" />
//       <input name="price" type="number" value={form.price ?? 0} onChange={handleChange} placeholder="Precio (opcional)" />
//       <input name="court_id" type="number" value={form.court_id} onChange={handleChange} placeholder="ID de cancha" />
//       <button type="submit">Crear Servicio</button>
//     </form>
//   );
// };

// export default ServiceForm;
