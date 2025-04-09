import React, { useState } from "react";
import { createCompany } from "../../api/companies";
import { Company } from "../../interfaces/Company";

const CompanyForm = ({ onCompanyAdded }: { onCompanyAdded: () => void }) => {
  const [form, setForm] = useState<Company>({
    name: "",
    email: "",
    phone: "",
    location: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCompany(form);
    setForm({ name: "", email: "", phone: "", location: "" });
    onCompanyAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Teléfono" />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Ubicación" />
      <button type="submit">Crear Empresa</button>
    </form>
  );
};

export default CompanyForm;
