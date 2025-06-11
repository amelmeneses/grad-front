// src/components/Features.tsx

import { useNavigate } from 'react-router-dom';
import {
  FaFutbol,
  FaHandHoldingMedical,
  FaCalendarCheck,
  FaBuilding,
  FaLifeRing
} from 'react-icons/fa';

const features = [
  {
    title: 'Reserva Canchas con Facilidad',
    desc: 'Selecciona la mejor cancha en tu ubicación con horarios y precios flexibles.',
    icon: <FaFutbol className="text-3xl text-[#0B91C1]" />,
    path: '/login'
  },
  {
    title: 'Añade Servicios Personalizados',
    desc: 'Agrega arbitraje, chalecos o iluminación extra para tu partido.',
    icon: <FaHandHoldingMedical className="text-3xl text-[#EB752B]" />,
    path: '/login'
  },
  {
    title: 'Gestiona tus Reservas',
    desc: 'Modifica o cancela tus reservas desde tu perfil en un solo click.',
    icon: <FaCalendarCheck className="text-3xl text-[#075F92]" />,
    path: '/login'
  },
  {
    title: 'Crea tu Empresa Deportiva',
    desc: 'Administra tus canchas y reservas con herramientas avanzadas.',
    icon: <FaBuilding className="text-3xl text-[#DB864F]" />,
    path: '/login'
  },
  {
    title: 'Soporte y Ayuda',
    desc: 'Contáctanos para resolver cualquier duda o inconveniente.',
    icon: <FaLifeRing className="text-3xl text-[#22C55E]" />,
    path: '/contactanos'
  }
];

export default function Features() {
  const navigate = useNavigate();


  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Nuestros Servicios</h2>
        <div className="grid md:grid-cols-2 gap-6 px-8">
          {features.map((f, idx) => (
            <div key={idx} className="p-6 bg-white rounded-lg shadow flex items-start">
              <div className="mr-4">{f.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">{f.title}</h4>
                <p className="text-gray-600 mb-4">{f.desc}</p>
                <button
                  onClick={() => {
                    // El segundo ítem (Servicios Personalizados) debe ir a "/servicios"
                    if (f.title === 'Añade Servicios Personalizados') {
                      navigate('/servicios');
                    } else {
                      navigate(f.path);
                    }
                  }}
                  className="text-[#0B91C1] font-medium hover:underline"
                >
                  {f.title === 'Añade Servicios Personalizados' ? 'Servicios' : f.title === 'Soporte y Ayuda' ? 'Contactar Soporte' : f.title === 'Reserva Canchas con Facilidad' ? 'Explorar Canchas' : f.title === 'Gestiona tus Reservas' ? 'Ir a Perfil' : f.title === 'Crea tu Empresa Deportiva' ? 'Crear Empresa' : ''}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
