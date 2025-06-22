// src/components/DashboardUser.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const DashboardUser: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-4">
        <div className="max-w-screen-lg mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-12">Dashboard de Usuario</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Nueva Reserva */}
            <button
              onClick={() => navigate('/reservas')}
              className="py-16 bg-white rounded-2xl shadow-lg hover:shadow-2xl
                         transition flex items-center justify-center"
            >
              <span className="text-xl font-semibold text-gray-800">
                Nueva Reserva
              </span>
            </button>

            {/* Historial de Reservas */}
            <button
              onClick={() => navigate('/reservas-historial')}
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
