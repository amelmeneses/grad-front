// src/pages/AboutAs.tsx

import AdminNav from '../components/Navbar';

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
            <h2 className="text-3xl font-bold">Nuestra Misión</h2>
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
              src="src/assets/AboutAs1.jpg"
              alt="Nuestra Misión"
              className="w-80 h-80 rounded-full object-cover shadow-lg"
            />
          </div>
        </section>

        {/* Nuestro Enfoque */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-last md:order-first flex justify-center">
            <img
              src="src/assets/AboutAs2.jpg"
              alt="Nuestro Enfoque"
              className="w-80 h-80 rounded-full object-cover shadow-lg"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Nuestro Enfoque</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <span className="font-semibold text-[#075F92]">Facilidad para Todos:</span>{' '}
                Proveemos una plataforma intuitiva que permite a jugadores, organizadores y empresas gestionar
                sus reservas en pocos pasos y sin complicaciones.
              </p>
              <p>
                <span className="font-semibold text-[#0B91C1]">Servicios Personalizados:</span>{' '}
                Nos enfocamos en brindar servicios adicionales como alquiler de equipamiento, árbitros y grabaciones,
                diseñados para enriquecer cada experiencia deportiva.
              </p>
              <p>
                <span className="font-semibold text-[#EB752B]">Compromiso con la Excelencia:</span>{' '}
                Adaptamos un enfoque orientado a satisfacer las necesidades específicas de nuestros usuarios,
                asegurando calidad en cada interacción y adaptándonos a sus requerimientos.
              </p>
            </div>
          </div>
        </section>

        {/* Nuestro Proceso */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Nuestro Proceso</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>
                <span className="font-semibold text-[#075F92]">Encuentra tu Espacio Deportivo:</span>{' '}
                Selecciona tu deporte favorito, explora las canchas disponibles y elige la que mejor se adapte a tus necesidades.
              </li>
              <li>
                <span className="font-semibold text-[#0B91C1]">Personaliza tu Experiencia:</span>{' '}
                Agrega servicios como iluminación, chalecos o grabaciones para mejorar tu tiempo en la cancha.
              </li>
              <li>
                <span className="font-semibold text-[#EB752B]">Juega sin Preocupaciones:</span>{' '}
                Completa tu reserva y disfruta de una experiencia deportiva sin contratiempos con PlayBooker.
              </li>
            </ol>
          </div>
          <div className="flex justify-center">
            <img
              src="src/assets/AboutAs3.jpg"
              alt="Nuestro Proceso"
              className="w-80 h-80 rounded-full  object-cover shadow-lg"
            />
          </div>
        </section>
      </main>
    </div>
);
};

export default AboutAs;
