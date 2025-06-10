import React, { useEffect, useState } from "react";
import Select from "react-select";
import { createCompany } from "../../api/companies";
import { Company } from "../../interfaces/Company";
import axios from "axios";

interface UserOption {
  value: number;
  label: string;
}

const CompanyForm = ({ onCompanyAdded }: { onCompanyAdded: () => void }) => {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);

  const [form, setForm] = useState<Omit<Company, 'usuario_id'>>({
    name: "",
    email: "",
    phone: "",
    location: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("/api/users", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const options = res.data.map((u: any) => ({
        value: u.id,
        label: `${u.nombre} ${u.apellido}`
      }));
      setUsers(options);
    }).catch(err => {
      console.error("Error cargando usuarios:", err);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return alert("Debes seleccionar un usuario");

    await createCompany({
      ...form,
      usuario_id: selectedUser.value
    });

    setForm({ name: "", email: "", phone: "", location: "" });
    setSelectedUser(null);
    onCompanyAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
        <Select
          options={users}
          value={selectedUser}
          onChange={setSelectedUser}
          placeholder="Buscar por nombre o apellido..."
          isSearchable
        />
      </div>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nombre"
        className="w-full px-4 py-2 border rounded"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full px-4 py-2 border rounded"
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Teléfono"
        className="w-full px-4 py-2 border rounded"
      />
      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Ubicación"
        className="w-full px-4 py-2 border rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Crear Empresa
      </button>
    </form>
  );
};

export default CompanyForm;
