import React, { useState } from "react";
import { createCourt } from "../../api/courts";
import { Court } from "../../interfaces/Court";

const CourtForm = ({ onCourtAdded }: { onCourtAdded: () => void }) => {
  const [form, setForm] = useState<Court>({
    name: "",
    description: "",
    price_per_hour: 0,
    sport_type: "",
    location: "",
    company_id: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "price_per_hour" || name === "company_id" ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCourt(form);
    setForm({ name: "", description: "", price_per_hour: 0, sport_type: "", location: "", company_id: 0 });
    onCourtAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" />
      <input name="description" value={form.description} onChange={handleChange} placeholder="Descripción" />
      <input name="price_per_hour" type="number" value={form.price_per_hour} onChange={handleChange} placeholder="Precio por hora" />
      <input name="sport_type" value={form.sport_type} onChange={handleChange} placeholder="Deporte" />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Ubicación" />
      <input name="company_id" type="number" value={form.company_id} onChange={handleChange} placeholder="ID de empresa" />
      <button type="submit">Crear Cancha</button>
    </form>
  );
};

export default CourtForm;
