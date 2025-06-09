// src/components/UserForm.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
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
  estado: number; // 1 = activo, 0 = inactivo
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
    rol_id: 2,   // “usuario” por defecto
    estado: 1,   // activo por defecto
  });
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [empresa, setEmpresa] = useState<EmpresaData>({
    nombre: '',
    contacto_email: '',
    contacto_telefono: '',
    direccion: '',
  });
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ID dinámico del rol “empresa”
  let companyRoleId = roles.find(r => r.nombre.toLowerCase() === 'empresa')?.id;

  // 1) Cargar roles y, si es edición, cargar usuario + empresa
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get<Role[]>('http://localhost:5001/api/roles', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const fetchedRoles = res.data;
        setRoles(fetchedRoles);
        const fetchedCompanyRoleId = fetchedRoles.find(r => r.nombre.toLowerCase() === 'empresa')?.id;

        // companyRoleId = roles.find(r => r.nombre.toLowerCase() === 'empresa')?.id;
        if (isEdit && fetchedCompanyRoleId != null) {
          loadUser(fetchedCompanyRoleId);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setError('No se pudieron cargar los roles')
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Si hay id, traer datos del usuario + (si es rol “empresa”) su empresa
  const loadUser = async (fetchedCompanyRoleId: number) => {
    try {
      const token = localStorage.getItem('token');
      // Obtener usuario
      const { data: u } = await axios.get<any>(
        `http://localhost:5001/api/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({
        nombre: u.nombre,
        apellido: u.apellido,
        email: u.email,
        password: '',
        rol_id: u.rol_id,
        estado: u.estado,
      });

      // Si es “empresa”, cargar datos de empresa
      if (u.rol_id === fetchedCompanyRoleId) {
        const { data: empresas } = await axios.get<EmpresaData[]>(
          `http://localhost:5001/api/empresas?usuario_id=${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
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

  // 3) Al enviar, validar contraseñas, crear/actualizar usuario y (si es empresa) empresa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar contraseñas
    if (!isEdit || form.password) {
      if (form.password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      let userId = id;

      // Crear o actualizar usuario
      if (isEdit) {
        await axios.put(
          `http://localhost:5001/api/users/${id}`,
          {
            nombre: form.nombre,
            apellido: form.apellido,
            email: form.email,
            contrasena: form.password,
            rol_id: form.rol_id,
            estado: form.estado,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Nota: el endpoint de registro puede ser /api/register
        const res = await axios.post(
          'http://localhost:5001/api/register',
          {
            nombre: form.nombre,
            apellido: form.apellido,
            email: form.email,
            password: form.password,
            rol_id: form.rol_id,
            estado: form.estado,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        userId = String((res.data as any).id);
      }

      // Solo si el rol es “empresa”, creamos/actualizamos empresa
      if (companyRoleId && form.rol_id === companyRoleId) {
        const payload = {
          nombre: empresa.nombre,
          contacto_email: empresa.contacto_email,
          contacto_telefono: empresa.contacto_telefono,
          direccion: empresa.direccion,
          usuario_id: Number(userId),
        };
        if (empresaId) {
          // Actualizar empresa existente
          await axios.put(
            `http://localhost:5001/api/empresas/${empresaId}`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          // Crear nueva empresa
          await axios.post(
            'http://localhost:5001/api/empresas',
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      navigate('/admin/users');
    } catch {
      setError('Error al guardar.');
    }
  };

  if (loading) return <div className="p-8">Cargando…</div>;

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isEdit ? 'Editar Usuario' : 'Crear Usuario'}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-lg">
          {/* Campos básicos: nombre, apellido, email */}
          {['nombre', 'apellido', 'email'].map(field => (
            <div key={field}>
              <label className="block mb-1 text-sm font-semibold text-gray-900 capitalize">{field}</label>
              <input
                name={field}
                type={field === 'email' ? 'email' : 'text'}
                value={(form as any)[field]}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
              />
            </div>
          ))}

          {/* Contraseña y confirmar */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">
              Contraseña {isEdit && <span className="text-xs">(vacío = sin cambio)</span>}
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          {/* Rol */}
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

          {/* Estado (activo/inactivo) */}
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

          {/* Campos de Empresa (si el rol es “empresa”) */}
          {companyRoleId && form.rol_id === companyRoleId && (
            <>
              <hr className="my-4 border-gray-200" />
              <h2 className="text-lg font-bold text-gray-900 mb-2">Datos de Empresa</h2>
              {( ['nombre', 'contacto_email', 'contacto_telefono', 'direccion'] as (keyof EmpresaData)[] ).map(field => (
                <div key={field}>
                  <label className="block mb-1 text-sm font-semibold text-gray-900">
                    {field.replace('_', ' ')}
                  </label>
                  <input
                    name={field}
                    type={field === 'contacto_email' ? 'email' : 'text'}
                    value={(empresa as any)[field] || ''}
                    onChange={handleEmpresa}
                    required
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
  );
}
