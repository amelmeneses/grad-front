// src/components/ManageCompanies.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNav from './AdminNav';
import {
  FaEdit,
  FaTrash,
  FaFutbol,
  FaBasketballBall,
  FaTableTennis
} from 'react-icons/fa';
import { GiTennisBall } from 'react-icons/gi';
import { TbSoccerField } from 'react-icons/tb';

interface Court {
  id: number;
  deporte: string;
}

interface Company {
  id: number;
  nombre: string;
  contacto_email: string;
  contacto_telefono: string;
  direccion: string;
  Canchas?: Court[];
}

export default function ManageCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get<Company[]>(
        '/api/empresas',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCompanies(res.data);
      setError(null);
    } catch {
      setError('No se pudieron cargar las empresas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro que desea eliminar esta empresa?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/empresas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCompanies();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar la empresa');
    }
  };

  const renderSportIcons = (courts?: Court[]) => {
    if (!Array.isArray(courts) || courts.length === 0) return <span>0</span>;

    // Count only the four supported sports
    const counts: Record<string, number> = { futbol: 0, basket: 0, tenis: 0, padel: 0 };
    courts.forEach(c => {
      const key = c.deporte.toLowerCase();
      if (key in counts) counts[key]++;
    });

    const icons: React.ReactNode[] = [];
    Object.entries(counts).forEach(([sport, qty]) => {
      let IconComp: React.ComponentType<any>;
      let colorClass = '';
      switch (sport) {
        case 'futbol':
          IconComp = FaFutbol;
          colorClass = ''; // leave default black/white
          break;
        case 'basket':
          IconComp = FaBasketballBall;
          colorClass = 'text-red-700'; // dark tomato
          break;
        case 'tenis':
          IconComp = GiTennisBall;
          colorClass = 'text-yellow-400'; // tennis-ball yellow
          break;
        case 'padel':
          IconComp = FaTableTennis;
          colorClass = 'text-blue-300'; // light blue
          break;
        default:
          return;
      }
      for (let i = 0; i < qty; i++) {
        icons.push(
          <IconComp key={`${sport}-${i}`} className={`text-xl mr-1 ${colorClass}`} />
        );
      }
    });

    return <div className="flex items-center">{icons.length ? icons : <span>0</span>}</div>;
  };

  if (loading) return <div className="p-8">Cargando empresas…</div>;
  if (error)   return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Empresas</h1>
            <p className="text-gray-600">Gestión de empresas</p>
          </div>
          <button
            onClick={() => navigate('/admin/empresa')}
            className="px-5 py-2 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white font-medium rounded-lg shadow-lg hover:opacity-90 transition"
          >
            Añadir Empresa
          </button>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600 uppercase">
                <th className="p-3">Nombre</th>
                <th className="p-3">Email Contacto</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Dirección</th>
                <th className="p-3">Canchas</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(c => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-800">{c.nombre}</td>
                  <td className="p-3 text-gray-800">{c.contacto_email}</td>
                  <td className="p-3 text-gray-800">{c.contacto_telefono}</td>
                  <td className="p-3 text-gray-800">{c.direccion}</td>
                  <td className="p-3 text-gray-800">{renderSportIcons(c.Canchas)}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      title="Editar Empresa"
                      onClick={() => navigate(`/admin/empresa/${c.id}`)}
                      className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                    >
                      <FaEdit className="text-[#0B91C1]" size={16} />
                    </button>
                    <button
                      title="Eliminar Empresa"
                      onClick={() => handleDelete(c.id)}
                      className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                    >
                      <FaTrash className="text-red-500" size={16} />
                    </button>
                    <button
                      title="Detalle Canchas"
                      onClick={() => navigate(`/admin/canchas/${c.id}`)}
                      className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                    >
                      <TbSoccerField className="text-green-600" size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}