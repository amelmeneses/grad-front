import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNav from './AdminNav';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Goal, Circle } from 'lucide-react';
import { TbSoccerField } from 'react-icons/tb'; // Ícono para ver canchas

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
  courts?: Court[];
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
        'http://localhost:5001/api/empresas',
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
      await axios.delete(
        `http://localhost:5001/api/empresas/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCompanies();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar la empresa');
    }
  };

  const renderSportIcons = (courts?: Court[]) => {
    if (!Array.isArray(courts)) return <span>0</span>;

    const sportsMap: Record<string, number> = {};

    courts.forEach(court => {
      const key = (court?.deporte || '').toLowerCase();
      if (key) {
        sportsMap[key] = (sportsMap[key] || 0) + 1;
      }
    });

    const icons = [];

    for (const [deporte, cantidad] of Object.entries(sportsMap)) {
      let IconComponent;

      switch (deporte) {
        case 'fútbol':
        case 'futbol':
          IconComponent = Goal;
          break;
        case 'básquet':
        case 'basket':
        case 'tenis':
        case 'pádel':
        case 'padel':
        case 'voley':
        case 'voleibol':
          IconComponent = Circle;
          break;
        default:
          IconComponent = Circle;
      }

      icons.push(
        <span key={deporte} className="flex items-center gap-1 mr-2">
          {Array.from({ length: cantidad }).map((_, i) => (
            <IconComponent key={i} size={18} />
          ))}
        </span>
      );
    }

    return icons.length > 0 ? <div className="flex flex-wrap gap-1">{icons}</div> : <span>0</span>;
  };

  if (loading) return <div className="p-8">Cargando empresas…</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

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
                  <td className="p-3 text-gray-800">{renderSportIcons(c.courts)}</td>
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
                      title="Manejar Canchas"
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
