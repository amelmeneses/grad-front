import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const sports = [
  { label: 'Fútbol', path: 'futbol' },
  { label: 'Basket', path: 'basket' },
  { label: 'Tenis',  path: 'tenis' },
  { label: 'Pádel',  path: 'padel' },
];

// Decode JWT and pull out role (or role_id)
function getUserRoleFromToken(): number | null {
  const tok = localStorage.getItem('token');
  if (!tok) return null;
  try {
    const payload = JSON.parse(atob(tok.split('.')[1]));
    // adjust if your key is payload.role_id instead
    return (payload.role ?? payload.role_id) as number;
  } catch {
    return null;
  }
}

export default function ReservasPage() {
  const navigate = useNavigate();

  // guard: only role_id === 2 can stay
  useEffect(() => {
    const role = getUserRoleFromToken();
    if (role !== 2) {
      navigate('/login', {
        state: {
          info: 'Ingresa con un perfil de cliente para poder realizar reservas.',
        },
      });
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-32 pb-16 px-4">
        <div className="max-w-screen-lg mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-12">
            SELECCIONA EL DEPORTE
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {sports.map(s => (
              <button
                key={s.path}
                onClick={() => navigate(`/reservas/${s.path}`)}
                className="py-16 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition flex items-center justify-center"
              >
                <span className="text-2xl font-semibold text-gray-800">
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
