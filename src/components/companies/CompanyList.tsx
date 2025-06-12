import { useEffect, useState } from 'react';
import axios from 'axios';
import { Goal, Circle } from 'lucide-react';

interface Court {
  id: number;
  deporte: string;
}

interface Company {
  id: number;
  nombre: string;
  direccion: string;
  contacto_email: string;
  contacto_telefono: string;
  courts?: Court[];
}

export default function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    axios.get('/api/empresas')
      .then(res => setCompanies(res.data))
      .catch(err => console.error(err));
  }, []);

  const renderSportIcons = (courts?: Court[]) => {
    if (!Array.isArray(courts)) return <span>0</span>;

    const map: Record<string, number> = {};

    courts.forEach(c => {
      const key = (c?.deporte || '').toLowerCase();
      if (key) {
        map[key] = (map[key] || 0) + 1;
      }
    });

    const icons = [];

    for (const [deporte, cantidad] of Object.entries(map)) {
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

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Listado de Empresas</h2>
      <table className="min-w-full border">
        <thead className="bg-gray-100 text-left text-sm text-gray-600 uppercase">
          <tr>
            <th className="p-3 border">Nombre</th>
            <th className="p-3 border">Dirección</th>
            <th className="p-3 border">Correo electrónico</th>
            <th className="p-3 border">Teléfono</th>
            <th className="p-3 border">Canchas</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr key={company.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{company.nombre}</td>
              <td className="p-3">{company.direccion}</td>
              <td className="p-3">{company.contacto_email}</td>
              <td className="p-3">{company.contacto_telefono}</td>
              <td className="p-3">{renderSportIcons(company.courts)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
