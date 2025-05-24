// src/components/UserForm.tsx

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import AdminNav from './AdminNav'

interface Role {
  id: number
  nombre: string
}

interface EmpresaData {
  id?: number
  nombre: string
  contacto_email: string
  contacto_telefono: string
  direccion: string
}

interface FormState {
  nombre: string
  apellido: string
  email: string
  password: string
  rol_id: number
}

export default function UserForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [roles, setRoles] = useState<Role[]>([])
  const [companyRoleId, setCompanyRoleId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol_id: 2, // “usuarios” por defecto
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [empresa, setEmpresa] = useState<EmpresaData>({
    nombre: '',
    contacto_email: '',
    contacto_telefono: '',
    direccion: '',
  })
  const [empresaId, setEmpresaId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 1) Cargo roles, determino el ID de “empresas”, y si edito cargo datos
  useEffect(() => {
    const token = localStorage.getItem('token')
    axios
      .get<Role[]>('http://localhost:5001/api/roles', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setRoles(res.data)
        // busco el rol cuyo nombre incluye "empresa"
        const comp = res.data.find(r =>
          r.nombre.toLowerCase().includes('empresa')
        )
        setCompanyRoleId(comp?.id ?? null)
        if (isEdit) {
          loadUser(comp?.id ?? null)
        } else {
          setLoading(false)
        }
      })
      .catch(() => {
        setError('No se pudieron cargar los roles.')
        setLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2) Si edito, cargo usuario y (si es empresa) sus datos de empresa
  const loadUser = async (compId: number | null) => {
    try {
      const token = localStorage.getItem('token')
      const { data: u } = await axios.get<any>(
        `http://localhost:5001/api/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setForm({
        nombre: u.nombre,
        apellido: u.apellido,
        email: u.email,
        password: '',
        rol_id: u.rol_id
      })

      // sólo si es rol empresa
      if (compId && u.rol_id === compId) {
        const { data: empresas } = await axios.get<EmpresaData[]>(
          `http://localhost:5001/api/empresas?usuario_id=${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (empresas.length) {
          const e = empresas[0]
          setEmpresa({
            id: e.id,
            nombre: e.nombre,
            contacto_email: e.contacto_email,
            contacto_telefono: e.contacto_telefono,
            direccion: e.direccion,
          })
          setEmpresaId(e.id!)
        }
      }
    } catch {
      setError('No se pudo cargar los datos del usuario.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(f => ({
      ...f,
      [name]: name === 'rol_id' ? Number(value) : value,
    }))
  }

  const handleEmpresa = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmpresa(prev => ({ ...prev, [name]: value }))
  }

  // 3) Al enviar: crea/edita usuario; si rol=empresa crea/edita empresa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // validación de contraseñas
    if (!isEdit || form.password) {
      if (form.password !== confirmPassword) {
        setError('Las contraseñas no coinciden.')
        return
      }
    }

    try {
      const token = localStorage.getItem('token')
      let userId = id!

      // Crear o actualizar usuario
      if (isEdit) {
        await axios.put(
          `http://localhost:5001/api/users/${id}`,
          {
            ...form,
            contrasena: form.password, // backend espera campo contrasena
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        const res = await axios.post(
          'http://localhost:5001/api/register',
          {
            ...form,
            password: form.password, 
            rol_id: form.rol_id
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        userId = String((res.data as any).id)
      }

      // Si rol es empresa, crear o actualizar empresa
      if (companyRoleId && form.rol_id === companyRoleId) {
        const payload = {
          nombre: empresa.nombre,
          contacto_email: empresa.contacto_email,
          contacto_telefono: empresa.contacto_telefono,
          direccion: empresa.direccion,
          usuario_id: Number(userId),
        }
        if (empresaId) {
          await axios.put(
            `http://localhost:5001/api/empresas/${empresaId}`,
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        } else {
          await axios.post(
            'http://localhost:5001/api/empresas',
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        }
      }

      navigate('/admin/users')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar.')
    }
  }

  if (loading) return <div className="p-8">Cargando…</div>

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isEdit ? 'Editar Usuario' : 'Crear Usuario'}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white p-6 rounded-2xl shadow-lg"
        >
          {/* Campos básicos */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">
              Nombre
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">
              Apellido
            </label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          {/* Contraseñas */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">
              Contraseña{' '}
              {isEdit && (
                <span className="text-xs">(vacío = sin cambio)</span>
              )}
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
            <label className="block mb-1 text-sm font-semibold text-gray-900">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">
              Rol
            </label>
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

          {/* Campos de Empresa */}
          {companyRoleId !== null && form.rol_id === companyRoleId && (
            <>
              <hr className="my-4 border-gray-200" />
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Datos de Empresa
              </h2>

              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-900">
                  Nombre Empresa
                </label>
                <input
                  name="nombre"
                  value={empresa.nombre}
                  onChange={handleEmpresa}
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-900">
                  Email de Contacto
                </label>
                <input
                  name="contacto_email"
                  type="email"
                  value={empresa.contacto_email}
                  onChange={handleEmpresa}
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-900">
                  Teléfono de Contacto
                </label>
                <input
                  name="contacto_telefono"
                  value={empresa.contacto_telefono}
                  onChange={handleEmpresa}
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-900">
                  Dirección
                </label>
                <input
                  name="direccion"
                  value={empresa.direccion}
                  onChange={handleEmpresa}
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 text-white font-medium rounded-lg bg-gradient-to-r from-[#0B91C1] to-[#EB752B]"
          >
            {isEdit ? 'Guardar cambios' : 'Crear Usuario'}
          </button>
        </form>
      </main>
    </div>
  )
}
