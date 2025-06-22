// src/components/RegisterPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import singInImage from '../assets/imagen_singIn.svg';

const RegisterPage: React.FC = () => {
  const [nombre, setNombre]         = useState('');
  const [apellido, setApellido]     = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [isCompany, setIsCompany]   = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const navigate = useNavigate();

  // Empresa fields
  const [empresa, setEmpresa] = useState({
    nombre: '',
    contacto_email: '',
    contacto_telefono: '',
    direccion: ''
  });

  const handleEmpresaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmpresa(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPwd) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (isCompany) {
      // all empresa fields required
      for (let key of ['nombre','contacto_email','contacto_telefono','direccion'] as const) {
        if (!empresa[key]) {
          setError('Todos los datos de empresa son obligatorios');
          return;
        }
      }
    }

    try {
      const payload: any = {
        nombre,
        apellido,
        email,
        password,
        rol_id: isCompany ? 3 : undefined  // backend default 3 anyway
      };
      if (isCompany) payload.empresa = empresa;

      const { data } = await axios.post('/api/register-anon-user', payload);
      // redirect to /login carrying the success message
      navigate('/login', { state: { info: data.message } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen w-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center w-full">
          {/* ————— Tarjeta del formulario ————— */}
          <div className="w-full md:w-1/2 max-w-md mx-auto md:mx-0 
                          bg-white bg-opacity-60 backdrop-blur-md p-8 
                          rounded-3xl shadow-xl">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
              Crea tu cuenta
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Completa los datos para registrarte.
            </p>
            {error && (
              <p className="text-red-500 text-center mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombres
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Ingresa tus nombres"
                  required
                  className="w-full p-3 bg-white bg-opacity-90 border border-gray-200 
                             rounded-xl shadow-inner text-gray-800
                             focus:outline-none focus:ring-2 focus:ring-[#0B91C1] transition"
                />
              </div>

              {/* Apellido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellidos
                </label>
                <input
                  type="text"
                  value={apellido}
                  onChange={e => setApellido(e.target.value)}
                  placeholder="Ingresa tus apellidos"
                  required
                  className="w-full p-3 bg-white bg-opacity-90 border border-gray-200 
                             rounded-xl shadow-inner text-gray-800
                             focus:outline-none focus:ring-2 focus:ring-[#0B91C1] transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Ingresa tu email"
                  required
                  className="w-full p-3 bg-white bg-opacity-90 border border-gray-200 
                             rounded-xl shadow-inner text-gray-800
                             focus:outline-none focus:ring-2 focus:ring-[#0B91C1] transition"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  className="w-full p-3 bg-white bg-opacity-90 border border-gray-200 
                             rounded-xl shadow-inner text-gray-800
                             focus:outline-none focus:ring-2 focus:ring-[#0B91C1] transition"
                />
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  placeholder="Repite tu contraseña"
                  required
                  className="w-full p-3 bg-white bg-opacity-90 border border-gray-200 
                             rounded-xl shadow-inner text-gray-800
                             focus:outline-none focus:ring-2 focus:ring-[#0B91C1] transition"
                />
              </div>

              {/* Checkbox “Registrarse como empresa” */}
              <div
                className={`rounded-lg p-1 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] transition 
                            ${isCompany ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
              >
                <div className="flex items-start bg-white rounded-lg p-4 space-x-3">
                  <input
                    type="checkbox"
                    checked={isCompany}
                    onChange={() => setIsCompany(v => !v)}
                    className="h-6 w-6 cursor-pointer text-[#0B91C1] border-gray-300 rounded focus:ring-[#0B91C1]"
                  />
                  <div className="cursor-pointer" onClick={() => setIsCompany(v => !v)}>
                    <label className="text-sm font-medium text-gray-700 select-none">
                      Registrarse como empresa
                    </label>
                    <p className="mt-1 text-xs text-gray-600">
                      Marca este campo si quieres registrarte como empresa para empezar a manejar tus reservas con Playbooker.
                    </p>
                  </div>
                </div>
              </div>

              {/* Campos de Empresa (si toca) */}
              {isCompany && (
                <div className="space-y-4 border-t border-gray-200 pt-4">
                  {(
                    [
                      { name: 'nombre',     label: 'Nombre de la empresa',   type: 'text' },
                      { name: 'contacto_email',     label: 'Email de contacto',     type: 'email' },
                      { name: 'contacto_telefono',  label: 'Teléfono de contacto',   type: 'text' },
                      { name: 'direccion',  label: 'Dirección',              type: 'text' }
                    ] as const
                  ).map(field => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      <input
                        name={field.name}
                        type={field.type}
                        value={(empresa as any)[field.name]}
                        onChange={handleEmpresaChange}
                        required
                        className="w-full p-3 bg-white bg-opacity-90 border border-gray-200 
                                   rounded-xl shadow-inner text-gray-800
                                   focus:outline-none focus:ring-2 focus:ring-[#0B91C1] transition"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Botón gradient */}
              <button
                type="submit"
                className="w-full py-3 font-medium text-white rounded-xl 
                           bg-gradient-to-r from-[#0B91C1] to-[#EB752B] 
                           shadow-lg hover:opacity-90 transition"
              >
                Registrarse
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="text-[#0B91C1] font-medium hover:underline">
                Inicia sesión
              </a>
            </p>
          </div>

          {/* ————— Ilustración ————— */}
          <div className="hidden md:flex md:w-1/2 justify-center items-center">
            <img
              src={singInImage}
              alt="Ilustración deportiva"
              className="max-w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
