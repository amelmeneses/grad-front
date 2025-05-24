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

  // 1) Cargo roles y, si edito, usuario+empresa
  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get<Role[]>('http://localhost:5001/api/roles', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const fetchedRoles = res.data
      setRoles(fetchedRoles)
      if (isEdit) {
        loadUser(fetchedRoles)
      } else {
        setLoading(false)
      }
    })
    .catch(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2) Si edito, traigo usuario y su empresa (sin depender aún de state.roles)
  const loadUser = async (fetchedRoles: Role[]) => {
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

      // calculamos aquí localmente companyRoleId
      const companyRoleId = fetchedRoles.find(r => r.nombre.toLowerCase() === 'empresas')?.id

      // siempre traemos empresa si existe
      const { data: empresas } = await axios.get<EmpresaData[]>(
        `http://localhost:5001/api/empresas?usuario_id=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (empresas.length && u.rol_id === companyRoleId) {
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
    } catch {
      setError('No se pudo cargar el usuario.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: name === 'rol_id' ? Number(value) : value }))
  }

  const handleEmpresa = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmpresa(prev => ({ ...prev, [name]: value }))
  }

  // 3) Al enviar: crea/actualiza usuario, luego empresa solo si rol=empresa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // validar contraseñas
    if (!isEdit || form.password) {
      if (form.password !== confirmPassword) {
        setError('Las contraseñas no coinciden.')
        return
      }
    }

    try {
      const token = localStorage.getItem('token')
      let userId = id

      // companyRoleId dinámico de state
      const companyRoleId = roles.find(r => r.nombre.toLowerCase() === 'empresas')?.id

      // crear o actualizar usuario
      if (isEdit) {
        await axios.put(
          `http://localhost:5001/api/users/${id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        const res = await axios.post(
          'http://localhost:5001/api/register',
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        userId = String((res.data as any).id)
      }

      // empresa: sólo si rol=empresa
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

  // Compute companyRoleId for use in render
  const companyRoleId = roles.find(r => r.nombre.toLowerCase() === 'empresas')?.id

  return (
    <div className="flex min-h-screen bg-white">
      <AdminNav />
      <main className="flex-1 p-8 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isEdit ? 'Editar Usuario' : 'Crear Usuario'}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-lg">
          {/* Datos básicos */}
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

          {/* Contraseña */}
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

          {/* Campos de Empresa */}
          {(roles.length > 0) && form.rol_id === companyRoleId && (
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
                    type={field === 'contacto_email' ? 'email' : 'text'}
                    value={(empresa as any)[field]}
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
            className="w-full py-3 text-white font-medium rounded-lg bg-gradient-to-r from-[#0B91C1] to-[#EB752B]"
          >
            {isEdit ? 'Guardar cambios' : 'Crear Usuario'}
          </button>
        </form>
      </main>
    </div>
  )
}
