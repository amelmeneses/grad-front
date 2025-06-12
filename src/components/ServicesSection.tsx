// src/components/ServicesSection.tsx

import AdminNav from './Navbar';
import Footer from './Footer';
import {
  TbArrowRightCircle,
  TbSoccerField,
  TbUserPlus,
  TbHeadset
} from 'react-icons/tb';
import { FaBasketballBall } from 'react-icons/fa';

interface Service {
  title: string;
  text: string;
  cta: string;
  icon: JSX.Element;
}

const services: Service[] = [
  {
    title: 'Reserva Canchas con Facilidad',
    text: 'Selecciona la mejor cancha de baloncesto, pádel, fútbol o tenis en tu ubicación, con horarios flexibles y precios accesibles.',
    cta: 'Explorar Canchas',
    icon: <TbSoccerField size={32} className="text-white" />
  },
  {
    title: 'Gestiona Tus Reservas al Instante',
    text: 'Consulta, modifica o cancela tus reservas desde tu perfil. Maximiza el uso de tus canchas con herramientas de gestión.',
    cta: 'Ir a Perfil',
    icon: <FaBasketballBall size={32} className="text-white" />
  },
  {
    title: 'Crea tu Empresa Deportiva',
    text: 'Administra tu club o instalaciones, publica tus canchas y controla tus reservas con total autonomía.',
    cta: 'Crear Empresa',
    icon: <TbUserPlus size={32} className="text-white" />
  },
  {
    title: 'Soporte y Ayuda',
    text: '¿Tienes dudas? Nuestro equipo está listo para ayudarte en todo lo que necesites.',
    cta: 'Contactar Soporte',
    icon: <TbHeadset size={32} className="text-white" />
  }
];

export default function ServicesSection() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <AdminNav />

      {/* Hero */}
      <section
        className="h-48 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(90deg, #075F92 0%, #0B91C1 50%, #EB752B 100%)'
        }}
      >
        <h1 className="text-4xl font-bold text-white">Servicios</h1>
      </section>

      {/* Contenido principal */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map(svc => (
              <div
                key={svc.title}
                className="flex flex-col justify-between rounded-2xl bg-[#2F5277] p-6 shadow-lg"
              >
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed">{svc.text}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => (window.location.href = '/login')}
                    className="flex items-center text-[#DB864F] font-medium hover:underline"
                  >
                    <TbArrowRightCircle className="mr-2 text-[#DB864F]" size={20} />
                    {svc.cta}
                  </button>
                  {/* Icono en blanco sin fondo */}
                  <div>
                    {svc.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
