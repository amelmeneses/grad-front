// src/components/CompanyCourtsList.tsx

import { useEffect, useState, useCallback, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import Select, { StylesConfig } from 'react-select';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import AdminNav from './AdminNav';
import Navbar from './Navbar';
import { Court } from '../interfaces/Court';
import { Tariff } from '../interfaces/Tariff';

interface TokenPayload {
  id: number;
  role: number;
  name: string;
  exp: number;
}

interface Empresa {
  id: number;
  nombre: string;
}

interface Option {
  value: number;
  label: string;
}

export default function CompanyCourtsList() {
  const navigate = useNavigate();
  const [roleId, setRoleId] = useState<number | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Option | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [prices, setPrices] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortCol, setSortCol] = useState<keyof Court>('deporte');
  const [asc, setAsc] = useState(true);

  // decode user role
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const { role } = jwtDecode<TokenPayload>(token);
      setRoleId(role);
    } catch {
      setRoleId(null);
    }
  }, []);

  const customStyles: StylesConfig<Option, false> = {
    control: (prov) => ({ ...prov, backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', padding: '2px' }),
    singleValue: (prov) => ({ ...prov, color: '#1F2937' }),
    menu: (prov) => ({ ...prov, backgroundColor: 'white', zIndex: 999 }),
    option: (prov, state) => ({
      ...prov,
      backgroundColor: state.isFocused ? '#EFF6FF' : 'white',
      color: '#1F2937',
    }),
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const { id } = jwtDecode<TokenPayload>(token);
      axios
        .get<Empresa[]>(`/api/empresas?usuario_id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          setEmpresas(res.data);
          if (res.data.length > 0) {
            setSelectedEmpresa({ value: res.data[0].id, label: res.data[0].nombre });
          }
        })
        .catch(() => setError('No se pudieron cargar las empresas del usuario'));
    } catch {
      setError('Token inválido. Por favor inicia sesión nuevamente.');
    }
  }, []);

  const fetchCourts = useCallback(() => {
    if (!selectedEmpresa) return;
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token')!;
    axios
      .get<Court[]>(`/api/canchas?empresa_id=${selectedEmpresa.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setCourts(res.data))
      .catch(() => setError('No se pudieron cargar las canchas'))
      .finally(() => setLoading(false));
  }, [selectedEmpresa]);

  useEffect(() => {
    if (selectedEmpresa) fetchCourts();
  }, [selectedEmpresa, fetchCourts]);

  useEffect(() => {
    const token = localStorage.getItem('token')!;
    const m: Record<number, number> = {};
    Promise.all(
      courts.map(async c => {
        const res = await axios.get<Tariff[]>(`/api/canchas/${c.id}/tarifas`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const def = res.data.find(x => x.es_default);
        if (def) m[c.id!] = Number(def.tarifa);
      })
    ).then(() => setPrices(m));
  }, [courts]);

  const sortedCourts = useMemo(() => {
    return [...courts].sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      if (va! < vb!) return asc ? -1 : 1;
      if (va! > vb!) return asc ? 1 : -1;
      return 0;
    });
  }, [courts, sortCol, asc]);

  const toggleEstado = async (id: number, estado: number) => {
    const nuevo = estado === 1 ? 0 : 1;
    if (!window.confirm(`¿Marcar como ${nuevo ? 'Activo' : 'Inactivo'}?`)) return;
    const token = localStorage.getItem('token')!;
    const url = nuevo === 1
      ? `/api/canchas/${id}/activar`
      : `/api/canchas/${id}/desactivar`;
    await axios.patch(url, {}, { headers: { Authorization: `Bearer ${token}` } });
    fetchCourts();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar esta cancha?')) return;
    const token = localStorage.getItem('token')!;
    await axios.delete(`/api/canchas/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCourts();
  };

  const header = (key: keyof Court, label: string) => (
    <th
      className="p-3 text-left cursor-pointer select-none"
      onClick={() => {
        if (sortCol === key) setAsc(!asc);
        else {
          setSortCol(key);
          setAsc(true);
        }
      }}
    >
      {label} {sortCol === key ? (asc ? '▲' : '▼') : ''}
    </th>
  );

  const empresaOptions: Option[] = empresas.map(e => ({ value: e.id, label: e.nombre }));

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-white mt-19">
        <AdminNav />
        <main className="flex-1 p-8">
          <header className="flex justify-between mb-6 items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedEmpresa ? `Canchas de ${selectedEmpresa.label}` : 'Mis Canchas'}
            </h1>
            <div className="flex gap-4 items-center">
              <Select
                options={empresaOptions}
                value={selectedEmpresa}
                onChange={opt => setSelectedEmpresa(opt)}
                styles={customStyles}
                className="w-64"
                placeholder="Selecciona empresa"
              />
              <button
                disabled={!selectedEmpresa}
                onClick={() => navigate(`/admin/canchas/${selectedEmpresa?.value}/new`)}
                className="px-4 py-2 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white rounded-lg shadow hover:opacity-90 transition disabled:opacity-50"
              >
                Añadir Cancha
              </button>
            </div>
          </header>

          {loading ? (
            <p className="text-gray-700">Cargando canchas…</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-sm text-gray-600 uppercase">
                    {header('id', 'ID')}
                    {header('nombre', 'Nombre')}
                    {header('deporte', 'Deporte')}
                    {header('ubicacion', 'Ubicación')}
                    {header('estado', 'Estado')}
                    <th className="p-3 text-left">Precio/Hora</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCourts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-3 text-center text-gray-500">
                        No hay canchas aún para esta empresa.
                      </td>
                    </tr>
                  ) : (
                    sortedCourts.map(c => (
                      <tr key={c.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-gray-800">{c.id}</td>
                        <td className="p-3 text-gray-800">{c.nombre}</td>
                        <td className="p-3 text-gray-800">{c.deporte}</td>
                        <td className="p-3 text-gray-800">{c.ubicacion || '—'}</td>
                        <td className={`p-3 font-medium ${c.estado ? 'text-green-600' : 'text-red-600'}`}>
                          {c.estado ? 'Activo' : 'Inactivo'}
                        </td>
                        <td className="p-3 text-gray-800">
                          {prices[c.id!] != null ? `$${prices[c.id!].toFixed(2)}` : '—'}
                        </td>
                        <td className="p-3 text-center space-x-2">
                          <button
                            title="Editar"
                            onClick={() => navigate(`/admin/canchas/${c.empresa_id}/${c.id}`)}
                            className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                          >
                            <FaEdit className="text-[#0B91C1]" size={16} />
                          </button>

                          {/* show activate/deactivate only for admin */}
                          {roleId === 1 && (
                            c.estado === 1 ? (
                              <button
                                title="Desactivar"
                                onClick={() => toggleEstado(c.id!, c.estado)}
                                className="px-3 py-2 bg-red-100 text-red-700 border border-red-700 rounded-lg hover:bg-red-200 transition"
                              >
                                Desactivar
                              </button>
                            ) : (
                              <button
                                title="Activar"
                                onClick={() => toggleEstado(c.id!, c.estado)}
                                className="px-3 py-2 bg-green-100 text-green-700 border border-green-700 rounded-lg hover:bg-green-200 transition"
                              >
                                Activar
                              </button>
                            )
                          )}

                          <button
                            title="Eliminar"
                            onClick={() => handleDelete(c.id!)}
                            className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-red-500"
                          >
                            <FaTrash size={16} />
                          </button>
                          <button
                            title="Tarifas"
                            onClick={() => navigate(`/admin/canchas/${c.empresa_id}/${c.id}/tarifas`)}
                            className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                          >
                            <FaMoneyBillWave className="text-green-600" size={16} />
                          </button>
                          <button
                            title="Horarios"
                            onClick={() => navigate(`/admin/canchas/${c.empresa_id}/${c.id}/horarios`)}
                            className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                          >
                            <FaClock className="text-blue-600" size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
