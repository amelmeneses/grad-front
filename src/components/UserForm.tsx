import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import AdminNav from './AdminNav';

interface Role {
  id: number;
  nombre: string;
}

interface EmpresaData {
  id?: number;
  nombre: string;
  contacto_email: string;
  contacto_telefono: string;
  direccion: string;
}

interface FormState {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol_id: number;
  estado: number;
}

export default function UserForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState<FormState>({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol_id: 2,
    estado: 1,
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(!isEdit);
  const [empresa, setEmpresa] = useState<EmpresaData>({
    nombre: '',
    contacto_email: '',
    contacto_telefono: '',
    direccion: '',
  });
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const companyRoleId = roles.find(r => r.nombre.toLowerCase() === 'empresa')?.id;

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get<Role[]>('/api/roles', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setRoles(res.data);
      const fetchedCompanyRoleId = res.data.find(r => r.nombre.toLowerCase() === 'empresa')?.id;
      if (isEdit && fetchedCompanyRoleId != null) {
        loadUser(fetchedCompanyRoleId);
      } else {
        setLoading(false);
      }
    }).catch(() => {
      setError('No se pudieron cargar los roles');
      setLoading(false);
    });
  }, [id, isEdit]);

  useEffect(() => {
    if (error) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [error]);

  const loadUser = async (fetchedCompanyRoleId: number) => {
    try {
      const token = localStorage.getItem('token');
      const { data: u } = await axios.get(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setForm({
        nombre: u.nombre,
        apellido: u.apellido,
        email: u.email,
        password: '',
        rol_id: u.rol_id,
        estado: u.estado,
      });

      if (u.rol_id === fetchedCompanyRoleId) {
        const { data: empresas } = await axios.get(`/api/empresas?usuario_id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (empresas.length) {
          const e = empresas[0];
          setEmpresa({
            id: e.id,
            nombre: e.nombre,
            contacto_email: e.contacto_email,
            contacto_telefono: e.contacto_telefono,
            direccion: e.direccion,
          });
          setEmpresaId(e.id!);
        }
      }
    } catch {
      setError('No se pudo cargar el usuario.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'rol_id' || name === 'estado' ? Number(value) : value,
    }));
  };

  const handleEmpresa = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmpresa(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const soloLetras = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{3,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefonoRegex = /^[0-9]{10,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/;

    if (!form.nombre.trim() || !soloLetras.test(form.nombre)) {
      setError('El nombre debe tener al menos 3 letras y solo contener texto.');
      return;
    }

    if (!form.apellido.trim() || !soloLetras.test(form.apellido)) {
      setError('El apellido debe tener al menos 3 letras y solo contener texto.');
      return;
    }

    if (!form.email.trim() || !emailRegex.test(form.email)) {
      setError('El correo electrónico no es válido.');
      return;
    }

    if (!isEdit || form.password) {
      if (!passwordRegex.test(form.password)) {
        setError('La contraseña debe tener al menos 6 caracteres, una letra, un número y un carácter especial.');
        return;
      }
      if (form.password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
    }

    if (!form.rol_id && form.rol_id !== 0) {
      setError('El rol es obligatorio.');
      return;
    }

    if (!form.estado && form.estado !== 0) {
      setError('El estado es obligatorio.');
      return;
    }

    if (companyRoleId && form.rol_id === companyRoleId) {
      const { nombre, contacto_email, contacto_telefono, direccion } = empresa;
      if (!nombre.trim()) {
        setError('El nombre de la empresa es obligatorio.');
        return;
      }
      if (!direccion.trim()) {
        setError('La dirección de la empresa es obligatoria.');
        return;
      }
      if (!emailRegex.test(contacto_email)) {
        setError('El correo de contacto de la empresa no es válido.');
        return;
      }
      if (!telefonoRegex.test(contacto_telefono)) {
        setError('El teléfono de la empresa debe tener al menos 10 dígitos numéricos.');
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      let userId = id;

      if (isEdit) {
        await axios.put(`/api/users/${id}`, {
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          contrasena: form.password,
          rol_id: form.rol_id,
          estado: form.estado,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        const res = await axios.post('/api/register', {
          nombre: form.nombre,
          apellido: form.apellido,
          email: form.email,
          password: form.password,
          rol_id: form.rol_id,
          estado: form.estado,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        userId = String(res.data.id);
      }

      if (companyRoleId && form.rol_id === companyRoleId) {
        const payload = {
          nombre: empresa.nombre,
          contacto_email: empresa.contacto_email,
          contacto_telefono: empresa.contacto_telefono,
          direccion: empresa.direccion,
          usuario_id: Number(userId),
        };

        if (empresaId) {
          await axios.put(`/api/empresas/${empresaId}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await axios.post('/api/empresas', payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      navigate('/admin/users');
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError('Ya existe un usuario con este correo.');
      } else {
        setError('Error al guardar.');
      }
    }
  };

  if (loading) return <div className="p-8">Cargando…</div>;

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-white mt-16">
        <AdminNav />
        <main className="flex-1 p-8 max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isEdit ? 'Editar Usuario' : 'Crear Usuario'}
          </h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-lg">
            {['nombre', 'apellido', 'email'].map(field => (
              <div key={field}>
                <label className="block mb-1 text-sm font-semibold text-gray-900 capitalize">{field}</label>
                <input
                  name={field}
                  type="text"
                  value={(form as any)[field]}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>
            ))}

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-900">Contraseña</label>
              {isEdit && (
                <span className="block text-xs text-gray-500 mb-1">
                  Deja este campo vacío si no deseas cambiar la contraseña.
                </span>
              )}
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={(e) => {
                  handleChange(e);
                  if (isEdit && !showConfirmPassword) setShowConfirmPassword(true);
                }}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </div>

            {showConfirmPassword && (
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-900">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>
            )}

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-900">Rol</label>
              <select
                name="rol_id"
                value={form.rol_id}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.nombre.charAt(0).toUpperCase() + r.nombre.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-900">Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
            </div>

            {roles.length > 0 && companyRoleId && form.rol_id === companyRoleId && (
              <>
                <hr className="my-4 border-gray-200" />
                <h2 className="text-lg font-bold text-gray-900 mb-2">Datos de Empresa</h2>
                {(['nombre', 'contacto_email', 'contacto_telefono', 'direccion'] as (keyof EmpresaData)[]).map(field => (
                  <div key={field}>
                    <label className="block mb-1 text-sm font-semibold text-gray-900">
                      {field.replace('_', ' ')}
                    </label>
                    <input
                      name={field}
                      type="text"
                      value={(empresa as any)[field] || ''}
                      onChange={handleEmpresa}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                    />
                  </div>
                ))}
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 text-white font-medium rounded-lg bg-gradient-to-r from-[#0B91C1] to-[#EB752B] hover:opacity-90 transition"
            >
              {isEdit ? 'Guardar cambios' : 'Crear Usuario'}
            </button>
          </form>
        </main>
      </div>
    </>
  );
}
