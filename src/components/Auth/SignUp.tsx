import React, { useState } from 'react';
import { registerUser } from '../../api/authService';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      const response = await registerUser({ nombre, apellido, email, password });
      console.log('SignUp success:', response);
      navigate('/login'); // Redirect to login after successful sign up
    } catch (error) {
      console.error('SignUp failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-3xl text-center mb-6">Crea una cuenta</h2>
      <form onSubmit={handleSignUp}>
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombres</label>
          <input
            type="text"
            id="nombre"
            placeholder="Ingresa tus nombres"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellidos</label>
          <input
            type="text"
            id="apellido"
            placeholder="Ingresa tus apellidos"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="flex items-center mb-4">
          <input type="checkbox" id="acceptTerms" className="mr-2" />
          <label htmlFor="acceptTerms" className="text-sm">
            Acepto los <span className="text-blue-500">Términos y Condiciones de Privacidad</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-teal-500 to-teal-300 text-white rounded-md"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default SignUp;
