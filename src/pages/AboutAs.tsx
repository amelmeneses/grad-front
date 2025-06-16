// src/pages/AboutAs.tsx

import AdminNav from '../components/Navbar';
import Footer               from '../components/Footer';

const AboutAs = () => {
  return (
    <div className="min-h-screen bg-white">
      <AdminNav />

      {/* Hero gradiente */}
      <div
        className="h-64 flex items-center justify-center"
        style={{
          background: 'linear-gradient(90deg, #075F92 0%, #0B91C1 50%, #EB752B 100%)'
        }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white">Sobre Nosotros</h1>
      </div>

      <main className="max-w-6xl mx-auto px-8 py-16 space-y-20">
        {/* Nuestra Misión */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Nuestra Misión</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <span className="font-semibold text-[#075F92]">Deportes Accesibles:</span>{' '}
                Nuestra misión es brindar acceso sencillo y rápido a las mejores canchas deportivas
                de baloncesto, pádel, fútbol y tenis, asegurando que cada jugador tenga una experiencia
                sin complicaciones y enfocada en su pasión por el deporte.
              </p>
              <p>
                <span className="font-semibold text-[#0B91C1]">Innovación en Reservas:</span>{' '}
                En PlayBooker, buscamos revolucionar la forma en que se gestionan las reservas
                deportivas al integrar tecnología avanzada que optimiza la eficiencia, simplifica
                los procesos y mejora la experiencia de los usuarios.
              </p>
              <p>
                <span className="font-semibold text-[#EB752B]">Comunidad Deportiva:</span>{' '}
                Fomentamos una comunidad activa y conectada, ofreciendo un servicio accesible y
                personalizado que permita a todos disfrutar del deporte y alcanzar su máximo potencial.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/src/assets/AboutAs.jpg"
              alt="Nuestra Misión"
              className="w-80 h-80 rounded-full object-cover shadow-lg"
            />
          </div>
        </section>

        {/* Nuestra Visión */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center md:order-last">
            <img
              src="/src/assets/AboutAs2.jpg"
              alt="Nuestra Visión"
              className="w-80 h-80 rounded-full object-cover shadow-lg"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Nuestra Visión</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                En PlayBooker visualizamos un futuro donde cualquier amante del deporte,
                sin importar su experiencia o ubicación, pueda acceder a instalaciones de
                primera, reservar con un par de clics y disfrutar de una comunidad global
                de jugadores conectados.
              </p>
              <p>
                Queremos ser la plataforma líder en innovación deportiva, integrando herramientas
                de análisis, recomendaciones personalizadas y eventos virtuales que transformen
                la forma de vivir el deporte.
              </p>
            </div>
          </div>
        </section>
      </main>
       <Footer />
    </div>
  );
};

export default AboutAs;
