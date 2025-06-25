import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import AdminNav from './AdminNav';
import Navbar from './Navbar';
import { FaEdit, FaTrash, FaFutbol, FaBasketballBall, FaTableTennis } from 'react-icons/fa';
import { GiTennisBall } from 'react-icons/gi';
import { TbSoccerField } from 'react-icons/tb';

interface TokenPayload {
  id: number;
  role: number;
  name: string;
  exp: number;
}

interface Court {
  id: number;
  deporte: string;
}

interface Empresa {
  id: number;
  nombre: string;
  contacto_email?: string;
  contacto_telefono?: string;
  direccion?: string;
  Canchas?: Court[];
}

export default function ManageUserCompanies() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const { id } = jwtDecode<TokenPayload>(token);
      setUserId(id);

      axios.get<Empresa[]>(`/api/empresas?usuario_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        console.log('Empresas del usuario:', res.data);
        setEmpresas(res.data);
        setError(null);
      })
      .catch(() => setError('No se pudieron cargar las empresas del usuario'))
      .finally(() => setLoading(false));
    } catch (e) {
      setError('Token inválido. Por favor inicia sesión nuevamente.');
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro que desea eliminar esta empresa?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/empresas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpresas(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar la empresa');
    }
  };

  const renderSportIcons = (courts?: Court[]) => {
    if (!Array.isArray(courts) || courts.length === 0) return <span>0</span>;

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
          break;
        case 'basket':
          IconComp = FaBasketballBall;
          colorClass = 'text-red-700';
          break;
        case 'tenis':
          IconComp = GiTennisBall;
          colorClass = 'text-yellow-400';
          break;
        case 'padel':
          IconComp = FaTableTennis;
          colorClass = 'text-blue-300';
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

  if (loading) return <div className="p-8">Cargando tus empresas…</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-white mt-19">
        <AdminNav />
        <main className="flex-1 p-8">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mis Empresas</h1>
              <p className="text-gray-600">Gestiona las empresas que administras</p>
            </div>
            <button
              onClick={() => navigate('/admin/empresa')}
              className="px-5 py-2 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white font-medium rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Añadir Empresa
            </button>
          </header>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
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
                {empresas.map((empresa) => (
                  <tr key={empresa.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-800">{empresa.nombre}</td>
                    <td className="p-3 text-gray-800">{empresa.contacto_email || '—'}</td>
                    <td className="p-3 text-gray-800">{empresa.contacto_telefono || '—'}</td>
                    <td className="p-3 text-gray-800">{empresa.direccion || '—'}</td>
                    <td className="p-3 text-gray-800">{renderSportIcons(empresa.Canchas)}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        title="Editar Empresa"
                        onClick={() => navigate(`/admin/empresa/${empresa.id}`)}
                        className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                      >
                        <FaEdit className="text-[#0B91C1]" size={16} />
                      </button>
                      <button
                        title="Eliminar Empresa"
                        onClick={() => handleDelete(empresa.id)}
                        className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                      >
                        <FaTrash className="text-red-500" size={16} />
                      </button>
                      <button
                        title="Ver Canchas"
                        onClick={() => navigate(`/admin/canchas/${empresa.id}`)}
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
    </>
  );
}
