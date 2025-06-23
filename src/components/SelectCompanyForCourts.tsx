// // src/components/SelectCompanyForCourts.tsx

// import React, { useEffect, useState } from 'react';
// import { useNavigate }                from 'react-router-dom';
// import axios                          from 'axios';
// import AdminNav                       from './AdminNav';
// import Select, { StylesConfig }       from 'react-select';
// import { Company }                    from '../interfaces/Company';

// interface Option {
//   value: number;
//   label: string;
// }

// export default function SelectCompanyForCourts() {
//   const [options, setOptions]   = useState<Option[]>([]);
//   const [selected, setSelected] = useState<Option | null>(null);
//   const [loading, setLoading]   = useState(true);
//   const [error, setError]       = useState<string | null>(null);
//   const navigate = useNavigate();

//   // Configuración de estilos para react-select
//   const customStyles: StylesConfig<Option, false> = {
//     control: (provided) => ({
//       ...provided,
//       backgroundColor: '#F9FAFB',      // bg-gray-50
//       borderColor: '#E5E7EB',          // border-gray-200
//       padding: '2px',
//     }),
//     singleValue: (provided) => ({
//       ...provided,
//       color: '#1F2937',                // text-gray-900
//     }),
//     menu: (provided) => ({
//       ...provided,
//       backgroundColor: 'white',
//       zIndex: 999,
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isFocused ? '#EFF6FF' : 'white', // bg-blue-50 on hover
//       color: '#1F2937',                // text-gray-900
//     }),
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     axios.get<Company[]>('/api/empresas', {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//     .then(res => {
//       setOptions(res.data.map(c => ({
//         value: c.id,
//         label: c.nombre
//       })));
//     })
//     .catch(() => setError('Could not load companies'))
//     .finally(() => setLoading(false));
//   }, []);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selected) {
//       alert('Please select a company');
//       return;
//     }
//     navigate(`/admin/canchas/${selected.value}`);
//   };

//   if (loading) return <div className="p-8 text-gray-700">Cargando empresas…</div>;
//   if (error)   return <div className="p-8 text-red-500">{error}</div>;

//   return (
//     <div className="flex min-h-screen bg-white">
//       <AdminNav />
//       <main className="flex-1 p-8 max-w-md mx-auto">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Selecciona la Empresa</h1>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">Empresa</label>
//             <Select
//               options={options}
//               value={selected}
//               onChange={setSelected}
//               placeholder="Search by name..."
//               styles={customStyles}
//               isSearchable
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full py-2 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white rounded-lg hover:opacity-90 transition"
//           >
//             Ver Canchas
//           </button>
//         </form>
//       </main>
//     </div>
//   );
// }
