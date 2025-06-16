// src/components/HelpSection.tsx
import AdminNav from '../components/Navbar';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import Footer from '../components/Footer';

export default function HelpSection() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navegación */}
      <AdminNav />

      {/* Hero degradado */}
      <section
        className="h-64 bg-cover bg-center"
        style={{ backgroundImage: 'linear-gradient(90deg, #075F92 0%, #0B91C1 50%, #EB752B 100%)' }}
      >
        <div className="h-full flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Ayuda</h1>
        </div>
      </section>

      {/* Contenido principal */}
      <main className="flex-1 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Texto explicativo */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-900">
              Ponte en contacto con nosotros para personalizar tu experiencia en{' '}
              <span className="text-[#DB864F]">Playbooker</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              ¿Quieres un alquiler personalizado o tienes alguna pregunta? Estamos aquí para
              ayudarte. Déjanos un mensaje y te responderemos lo antes posible.
            </p>
          </div>

          {/* Tarjetas de contacto */}
          <div className="space-y-6">
            <ContactCard
              icon={<FiPhone size={24} className="text-white" />}
              label="+593 123-456-7890"
            />
            <ContactCard
              icon={<FiMail size={24} className="text-white" />}
              label="playbooker@email.com"
            />
            <ContactCard
              icon={<FiMapPin size={24} className="text-white" />}
              label="Quito, Ecuador – 560016"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Tarjeta individual de contacto
function ContactCard({ icon, label }: { icon: JSX.Element; label: string }) {
  return (
    <div className="flex items-center bg-white rounded-lg shadow-lg p-4 space-x-4">
      {/* <-- Updated gradient here --> */}
      <div className="p-3 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] rounded-xl">
        {icon}
      </div>
      <span className="text-gray-800 font-medium">{label}</span>
    </div>
  );
}
