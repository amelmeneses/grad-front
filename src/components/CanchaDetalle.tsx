// src/components/CanchaDetalle.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

interface Tarifa {
  id: number;
  tarifa: number;
  es_default: boolean;
}

interface Cancha {
  id: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  imagen_principal: string | null;
  tarifas?: Tarifa[];
}

const CanchaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cancha, setCancha] = useState<Cancha | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.rol_id !== 2) {
      navigate('/login', {
        state: { info: 'Ingresa con un perfil de cliente para continuar.' }
      });
      return;
    }

    axios
      .get(`/api/reservas-cancha/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setCancha(res.data))
      .catch(() => setError('No se pudo cargar la información de la cancha.'));
  }, [id, navigate]);

  const tarifa = cancha?.tarifas?.find(t => t.es_default);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 px-6 md:px-16">
        {error ? (
          <p className="text-center text-red-600 text-lg">{error}</p>
        ) : cancha ? (
          <div className="max-w-6xl mx-auto flex flex-col gap-8">
            <h1 className="text-4xl font-bold text-center text-gray-900">{cancha.nombre}</h1>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 shadow-xl rounded-xl overflow-hidden">
                {cancha.imagen_principal ? (
                  <img
                    src={cancha.imagen_principal}
                    alt={cancha.nombre}
                    className="w-full object-cover h-[350px]"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-[350px] bg-gray-100 flex items-center justify-center text-gray-500">
                    Imagen no disponible
                  </div>
                )}
              </div>
              <div className="w-full md:w-1/2">
                <p className="text-gray-600 mb-4 whitespace-pre-line">{cancha.descripcion}</p>
                <p className="text-gray-700 mb-4">Ubicación: {cancha.ubicacion}</p>
                {tarifa ? (
                  <p className="text-green-600 font-semibold mb-6">
                    Valor por hora: ${tarifa.tarifa.toFixed(2)}
                  </p>
                ) : (
                  <p className="text-gray-400 mb-6">Tarifa no disponible</p>
                )}
                <button
                  onClick={() => navigate(`/reservar/${cancha.id}`)}
                  className="px-6 py-2 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white rounded-full shadow hover:opacity-90 transition"
                >
                  Reservar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Cargando...</p>
        )}
      </div>
    </>
  );
};

export default CanchaDetalle;
