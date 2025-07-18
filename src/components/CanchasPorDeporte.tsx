// src/components/CanchasPorDeporte.tsx
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
  ubicacion: string;
  imagen_principal: string | null;
  tarifas?: Tarifa[];
}

const CanchasPorDeporte: React.FC = () => {
  const { deporte } = useParams<{ deporte: string }>();
  const navigate = useNavigate();
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [filteredCanchas, setFilteredCanchas] = useState<Cancha[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [nombreFiltro, setNombreFiltro] = useState('');
  const [ubicacionFiltro, setUbicacionFiltro] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', user);
    if (!token || user.rol_id !== 2) {
      navigate('/login', {
        state: {
          info: 'Ingresa con un perfil de cliente para poder ver las canchas.',
        },
      });
      return;
    }

    axios
      .get(`/api/canchas/por-deporte?deporte=${deporte}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCanchas(res.data);
        setFilteredCanchas(res.data);
      })
      .catch(() => setError('No se pudieron cargar las canchas.'));
  }, [deporte, navigate]);

  useEffect(() => {
    const min = parseFloat(precioMin);
    const max = parseFloat(precioMax);

    const filtradas = canchas.filter((cancha) => {
      const tarifaDefault = cancha.tarifas?.find((t) => t.es_default);
      const cumpleNombre = cancha.nombre.toLowerCase().includes(nombreFiltro.toLowerCase());
      const cumpleUbicacion = cancha.ubicacion.toLowerCase().includes(ubicacionFiltro.toLowerCase());
      const cumplePrecio = tarifaDefault
        ? (!precioMin || tarifaDefault.tarifa >= min) && (!precioMax || tarifaDefault.tarifa <= max)
        : false;
      return cumpleNombre && cumpleUbicacion && (!precioMin && !precioMax || cumplePrecio);
    });

    setFilteredCanchas(filtradas);
  }, [nombreFiltro, ubicacionFiltro, precioMin, precioMax, canchas]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-32 px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
          SELECCIONA TU CANCHA FAVORITA
        </h1>

        {/* Filtros con borde gradiente */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { placeholder: 'Buscar por nombre', value: nombreFiltro, setter: setNombreFiltro },
            { placeholder: 'Buscar por ubicación', value: ubicacionFiltro, setter: setUbicacionFiltro },
            { placeholder: 'Precio desde', value: precioMin, setter: setPrecioMin, type: 'number' },
            { placeholder: 'Precio hasta', value: precioMax, setter: setPrecioMax, type: 'number' }
          ].map((input, idx) => (
            <div
              key={idx}
              className="rounded-lg p-[1px] bg-gray-300 focus-within:bg-gradient-to-r focus-within:from-[#0B91C1] focus-within:to-[#EB752B]"
            >
              <input
                type={input.type || 'text'}
                placeholder={input.placeholder}
                value={input.value}
                onChange={(e) => input.setter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white text-gray-800 border border-white w-48 focus:outline-none focus:ring-0"
              />
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {filteredCanchas.length === 0 && !error && (
          <p className="text-center text-gray-500">No hay canchas disponibles para mostrar.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCanchas.map((cancha) => {
            const tarifaDefault = cancha.tarifas?.find((t) => t.es_default);

            return (
              <div
                key={cancha.id}
                onClick={() => navigate(`/cancha/${cancha.id}`)}
                className="cursor-pointer rounded-xl shadow-md overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition"
              >
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                  {cancha.imagen_principal ? (
                    <img
                      src={cancha.imagen_principal}
                      alt={cancha.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';

                        const fallback = document.createElement('div');
                        fallback.className =
                          'absolute inset-0 flex items-center justify-center bg-gray-100 text-sm text-gray-500';
                        fallback.textContent = 'Imagen no disponible';
                        e.currentTarget.parentElement?.appendChild(fallback);
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                      Imagen no disponible
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-1">{cancha.nombre}</h2>
                  <p className="text-gray-600 text-sm">{cancha.ubicacion}</p>
                  {tarifaDefault && typeof tarifaDefault.tarifa === 'number' ? (
                    <p className="text-sm font-semibold text-green-600">
                      Valor por hora: ${tarifaDefault.tarifa.toFixed(2)}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">Tarifa no disponible</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CanchasPorDeporte;
