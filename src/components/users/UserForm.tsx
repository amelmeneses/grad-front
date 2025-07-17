// import React, { useState } from "react";
// import { createUser } from "../../api/users";
// import { User } from "../../interfaces/User";

// const UserForm = ({ onUserAdded }: { onUserAdded: () => void }) => {
//   const [form, setForm] = useState<User>({
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//     birth_date: "",
//     role: ""
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await createUser(form);
//     setForm({
//       first_name: "",
//       last_name: "",
//       email: "",
//       password: "",
//       birth_date: "",
//       role: ""
//     });
//     onUserAdded();
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="Nombre" />
//       <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Apellido" />
//       <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
//       <input name="password" value={form.password} onChange={handleChange} placeholder="Contraseña" />
//       <input name="birth_date" value={form.birth_date} onChange={handleChange} placeholder="Fecha de nacimiento" />
//       <input name="role" value={form.role} onChange={handleChange} placeholder="Rol" />
//       <button type="submit">Crear Usuario</button>
//     </form>
//   );
// };

// export default UserForm;