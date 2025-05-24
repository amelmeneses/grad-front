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
  contrasena: string
  rol_id: number
}

export default function UserForm() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [roles, setRoles] = useState<Role[]>([])
  const [form, setForm] = useState<FormState>({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    rol_id: 2, // por defecto “usuarios”
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

  // ID dinámico del rol “empresas”
  const companyRoleId = roles.find(r => r.nombre.toLowerCase() === 'empresas')?.id

  // Carga inicial: roles → (si edit) usuario + empresa
  useEffect(() => {
    const token = localStorage.getItem('token')
    axios
      .get<Role[]>('http://localhost:5001/api/roles', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setRoles(res.data)
        if (isEdit) {
          loadUser()
        } else {
          setLoading(false)
        }
      })
      .catch(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Obtener usuario + empresa si id existe
  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token')
      // 1) GET usuario
      const { data: u } = await axios.get<any>(
        `http://localhost:5001/api/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setForm({
        nombre: u.nombre,
        apellido: u.apellido,
        email: u.email,
        contrasena: '',
        rol_id: u.rol_id,
      })

      // 2) Si el usuario es de rol “empresas”, GET empresa asociada
      if (u.rol_id === companyRoleId) {
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
      setError('No se pudo cargar el usuario.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // validar contraseñas
    if (!isEdit || form.contrasena) {
      if (form.contrasena !== confirmPassword) {
        setError('Las contraseñas no coinciden.')
        return
      }
    }

    try {
      const token = localStorage.getItem('token')
      let userId = id

      // POST o PUT usuario
      if (isEdit) {
        await axios.put(
          `http://localhost:5001/api/users/${id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        const res = await axios.post(
          'http://localhost:5001/api/users',
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        userId = String((res.data as any).id)
      }

      // sólo si el rol seleccionado es “empresas”
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
    } catch {
      setError('Error al guardar.')
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
        {error && <p className="mb-4 text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-lg">
          {/* Nombre */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">Apellido</label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-900">
              Contraseña {isEdit && <span className="text-xs">(vacío = sin cambio)</span>}
            </label>
            <input
              name="contrasena"
              type="password"
              value={form.contrasena}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
          </div>

          {/* Confirmar Contraseña */}
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
                <option key={r.id} value={r.id} className="text-gray-900">
                  {r.nombre.charAt(0).toUpperCase() + r.nombre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Campos Empresa */}
          {companyRoleId && form.rol_id === companyRoleId && (
            <>
              <hr className="my-4 border-gray-200" />
              <h2 className="text-lg font-bold text-gray-900 mb-2">Datos de Empresa</h2>

              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-900">Nombre Empresa</label>
                <input
                  name="nombre"
                  value={empresa.nombre}
                  onChange={handleEmpresa}
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-900">Email de Contacto</label>
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
                <label className="block mb-1 text-sm font-semibold text-gray-900">Teléfono de Contacto</label>
                <input
                  name="contacto_telefono"
                  value={empresa.contacto_telefono}
                  onChange={handleEmpresa}
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-900">Dirección</label>
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
            {isEdit ? 'Guardar cambios' : 'Crear usuario'}
          </button>
        </form>
      </main>
    </div>
  )
}
