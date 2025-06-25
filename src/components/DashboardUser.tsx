// src/components/DashboardUser.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function getUserRoleFromToken(): number | null {
  const tok = localStorage.getItem('token');
  if (!tok) return null;
  try {
    const payload = JSON.parse(atob(tok.split('.')[1]));
    return payload.role || payload.role_id || null;
  } catch {
    return null;
  }
}

const DashboardUser: React.FC = () => {
  const navigate = useNavigate();

  const handleNewReserva = () => {
    const role = getUserRoleFromToken();
    if (role === 2) {
      navigate('/reservas');
    } else {
      navigate('/login', {
        state: { info: 'Ingresa con un perfil de cliente para poder realizar reservas.' }
      });
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-4">
        <div className="max-w-screen-lg mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-12">Dashboard de Usuario</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Nueva Reserva */}
            <button
              onClick={handleNewReserva}
              className="py-16 bg-white rounded-2xl shadow-lg hover:shadow-2xl
                         transition flex items-center justify-center"
            >
              <span className="text-xl font-semibold text-gray-800">
                Nueva Reserva
              </span>
            </button>

            {/* Historial de Reservas */}
            <button
              onClick={() => navigate('/mis-reservas')}
              className="py-16 bg-white rounded-2xl shadow-lg hover:shadow-2xl
                         transition flex items-center justify-center"
            >
              <span className="text-xl font-semibold text-gray-800">
                Historial de Reservas
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardUser;
