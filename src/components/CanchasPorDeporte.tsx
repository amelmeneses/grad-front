// src/components/CanchasPorDeporte.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

interface Cancha {
  id: number;
  nombre: string;
  ubicacion: string;
  imagen_principal: string | null;
}

const CanchasPorDeporte: React.FC = () => {
  const { deporte } = useParams<{ deporte: string }>();
  const navigate = useNavigate();
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.rol_id !== 2) {
      navigate('/login', {
        state: {
          info: 'Ingresa con un perfil de cliente para poder ver las canchas.'
        }
      });
      return;
    }

    axios
      .get(`/api/canchas/por-deporte?deporte=${deporte}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setCanchas(res.data))
      .catch(() => setError('No se pudieron cargar las canchas.'));
  }, [deporte, navigate]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-32 px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          SELECCIONA TU CANCHA FAVORITA
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {canchas.length === 0 && !error && (
          <p className="text-center text-gray-500">Cargando canchas....</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {canchas.map(cancha => (
            <div
              key={cancha.id}
              className="rounded-xl shadow-md overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition"
            >
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {cancha.imagen_principal ? (
                  <img
                    src={cancha.imagen_principal}
                    alt={cancha.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = ''; // Clear image src
                      e.currentTarget.style.display = 'none';
                      const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallbackDiv) fallbackDiv.style.display = 'flex';
                    }}
                  />
                ) : null}
                {/* Placeholder oculto si hay imagen válida */}
                {!cancha.imagen_principal && (
                  <div className="text-gray-500 text-sm">Imagen no disponible</div>
                )}
              </div>

              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-1">{cancha.nombre}</h2>
                <p className="text-gray-600 text-sm">{cancha.ubicacion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CanchasPorDeporte;
