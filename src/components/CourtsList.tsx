// src/components/CourtsList.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import AdminNav from './AdminNav';
import Select, { StylesConfig } from 'react-select';
import { FaEdit, FaTrash, FaMoneyBillWave, FaClock } from 'react-icons/fa';
import { Court } from '../interfaces/Court';
import { Tariff } from '../interfaces/Tariff';
import { Company } from '../interfaces/Company';

interface Option {
  value: number | 'all';
  label: string;
}

export default function CourtsList() {
  const { empresaId: empresaIdParam } = useParams<{ empresaId?: string }>();
  const navigate = useNavigate();

  // Empresas para el select
  const [companies, setCompanies]             = useState<Option[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Option>({ value: 'all', label: '— Todas las empresas —' });
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const [courts,  setCourts]    = useState<Court[]>([]);
  const [prices,  setPrices]    = useState<Record<number, number>>({});
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState<string | null>(null);

  // sort defaults
  const [sortCol, setSortCol] = useState<keyof Court>('deporte');
  const [asc,     setAsc]     = useState(true);

  // estilos para el Select
  const customStyles: StylesConfig<Option, false> = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#F9FAFB',
      borderColor: '#E5E7EB',
      padding: '2px',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1F2937',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      zIndex: 999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#EFF6FF' : 'white',
      color: '#1F2937',
    }),
  };

  // carga de empresas
  useEffect(() => {
    const token = localStorage.getItem('token')!;
    axios.get<Company[]>('/api/empresas', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const opts: Option[] = [
          { value: 'all', label: '— Todas las empresas —' },
          ...res.data.map(c => ({ value: c.id, label: c.nombre }))
        ];
        setCompanies(opts);
        if (empresaIdParam) {
          const num = Number(empresaIdParam);
          const found = opts.find(o => o.value === num);
          if (found) setSelectedCompany(found);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingCompanies(false));
  }, [empresaIdParam]);

  // carga canchas
  const fetchCourts = useCallback(() => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token')!;
    const val = selectedCompany.value;
    const url = val !== 'all'
      ? `/api/canchas?empresa_id=${val}`
      : `/api/canchas`;
    axios.get<Court[]>(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setCourts(r.data))
      .catch(() => setError('No se pudieron cargar las canchas'))
      .finally(() => setLoading(false));
  }, [selectedCompany]);

  useEffect(() => {
    if (!loadingCompanies) fetchCourts();
  }, [selectedCompany, loadingCompanies, fetchCourts]);

  // carga tarifas por defecto
  useEffect(() => {
    const token = localStorage.getItem('token')!;
    const m: Record<number, number> = {};
    Promise.all(courts.map(async c => {
      const tr = await axios.get<Tariff[]>(
        `/api/canchas/${c.id}/tarifas`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const def = tr.data.find(x => x.default);
      if (def) m[c.id!] = Number(def.tarifa);
    })).then(() => setPrices(m));
  }, [courts]);

  // Sorting memoizado
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

  // Toggle estado cancha
  const toggleEstado = async (id: number, currentEstado: number) => {
    const nuevoEstado = currentEstado === 1 ? 0 : 1;
    const confirmMsg = `¿Está seguro que desea marcar esta cancha como ${
      nuevoEstado === 1 ? 'Activo' : 'Inactivo'
    }?`;
    if (!window.confirm(confirmMsg)) return;
    try {
      const token = localStorage.getItem('token')!;
      const url =
        nuevoEstado === 1
          ? `/api/canchas/${id}/activar`
          : `/api/canchas/${id}/desactivar`;
      await axios.patch(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchCourts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al cambiar estado');
    }
  };

  // Eliminar cancha
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar esta cancha?')) return;
    try {
      const token = localStorage.getItem('token')!;
      await axios.delete(`/api/canchas/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchCourts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar cancha');
    }
  };

  // TH clickeable
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

  if (loading) return <div className="p-8 text-gray-700">Cargando canchas…</div>;
  if (error)   return <div className="p-8 text-red-500">{error}</div>;

  const empresaIdNum = selectedCompany.value !== 'all' ? selectedCompany.value : undefined;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8">
        <header className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Listado de Canchas</h1>
            <button
              disabled={!empresaIdNum}
              onClick={() => navigate(`/admin/canchas/${empresaIdNum}/new`)}
              className="px-4 py-2 bg-gradient-to-r from-[#0B91C1] to-[#EB752B]
                         text-white rounded-lg shadow hover:opacity-90 transition disabled:opacity-50"
            >
              Añadir Cancha
            </button>
          </div>
          <div className="mt-4 max-w-sm">
            <Select<Option, false>
              options={companies}
              value={selectedCompany}
              onChange={opt => opt && setSelectedCompany(opt)}
              isSearchable
              styles={customStyles}
            />
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-sm text-gray-600 uppercase">
                {header('id',        'ID')}
                {header('nombre',    'Nombre')}
                {header('deporte',   'Deporte')}
                {header('ubicacion', 'Ubicación')}
                {header('estado',    'Estado')}
                <th className="p-3 text-gray-600 text-left">Precio/Hora</th>
                <th className="p-3 text-gray-600 text-left">Empresa</th>
                <th className="p-3 text-gray-600 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedCourts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-3 text-center text-gray-500">
                    Esta empresa no tiene canchas aún.
                  </td>
                </tr>
              ) : (
                sortedCourts.map(c => {
                  const comp = companies.find(o => o.value === c.empresa_id);
                  return (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-800">{c.id}</td>
                      <td className="p-3 text-gray-800">{c.nombre}</td>
                      <td className="p-3 text-gray-800">{c.deporte}</td>
                      <td className="p-3 text-gray-800">{c.ubicacion || '—'}</td>
                      <td className={`p-3 font-medium ${
                          c.estado ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {c.estado ? 'Activo' : 'Inactivo'}
                      </td>
                      <td className="p-3 text-gray-800">
                        {prices[c.id!] != null ? `$${prices[c.id!].toFixed(2)}` : '—'}
                      </td>
                      <td className="p-3 text-gray-800">{comp?.label || '—'}</td>
                      <td className="p-3 text-center space-x-2">
                        <button
                          title="Editar"
                          disabled={!c.empresa_id}
                          onClick={() => navigate(`/admin/canchas/${c.empresa_id}/${c.id}`)}
                          className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition disabled:opacity-50"
                        >
                          <FaEdit className="text-[#0B91C1]" size={16} />
                        </button>

                        {c.estado === 1 ? (
                          <button
                            title="Desactivar Cancha"
                            onClick={() => toggleEstado(c.id!, c.estado)}
                            className="px-3 py-2 bg-red-100 text-red-700 border border-red-700 rounded-lg hover:bg-red-200 transition"
                          >
                            Desactivar
                          </button>
                        ) : (
                          <button
                            title="Activar Cancha"
                            onClick={() => toggleEstado(c.id!, c.estado)}
                            className="px-3 py-2 bg-green-100 text-green-700 border border-green-700 rounded-lg hover:bg-green-200 transition"
                          >
                            Activar
                          </button>
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
                          disabled={!c.empresa_id}
                          onClick={() => navigate(`/admin/canchas/${c.empresa_id}/${c.id}/tarifas`)}
                          className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition disabled:opacity-50"
                        >
                          <FaMoneyBillWave className="text-green-600" size={16} />
                        </button>
                        <button
                          title="Horarios"
                          disabled={!c.empresa_id}
                          onClick={() => navigate(`/admin/canchas/${c.empresa_id}/${c.id}/horarios`)}
                          className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition disabled:opacity-50"
                        >
                          <FaClock className="text-blue-600" size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
