// src/components/ActivatePage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const ActivatePage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // this ref ensures we only fire the activation request once
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token || hasFetched.current) return;

    hasFetched.current = true; // mark as fetched
    axios
      .get<{ message: string }>(`/api/activate/${token}`)
      .then(({ data }) => {
        setMessage(data.message);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Error desconocido');
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <>
      <Navbar />
      <h1 className="sr-only">Activar cuenta</h1>
      <div className="min-h-screen w-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl">
          {loading && (
            <p className="text-center text-gray-600">Validando token…</p>
          )}

          {!loading && message && (
            <>
              <h2 className="text-2xl font-semibold text-green-600 mb-4 text-center">
                ¡Éxito!
              </h2>
              <p className="text-center text-gray-800 mb-6">
                {message}{' '}Ahora puedes{' '}
                <Link
                  to="/login"
                  className="text-[#0B91C1] font-medium hover:underline"
                >
                  iniciar sesión
                </Link>.
              </p>
            </>
          )}

          {!loading && error && (
            <>
              <h2 className="text-2xl font-semibold text-red-600 mb-4 text-center">
                Error
              </h2>
              <p className="text-center text-gray-800">{error}</p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ActivatePage;
