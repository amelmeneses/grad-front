// src/components/About.tsx


export default function About() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12 px-8">
        {/* Left image */}
        <div className="flex justify-center md:justify-start">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-lg">
            <img
              src="/src/assets/about1.png"
              alt="Quienes somos"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right text */}
        <div>
          <div className="flex items-center mb-2">
            <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
            <span className="uppercase text-xs text-gray-500 tracking-wide">¿Quiénes somos?</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            En PlayBooker, somos una plataforma innovadora que conecta a los amantes del deporte
          </h3>
          <p className="text-gray-700 leading-relaxed mb-8">
            Nuestra misión es simplificar el proceso de reserva y ofrecer una experiencia excepcional
            para jugadores, organizadores de eventos y empresas.
          </p>
        </div>

        {/* Second row reversed on mobile */}
        <div className="order-last md:order-none">
          <div className="flex items-center mb-2">
            <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
            <span className="uppercase text-xs text-gray-500 tracking-wide">Qué hacemos</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ofrecemos una solución integral para la reserva de canchas deportivas
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Brindamos herramientas avanzadas para que las empresas gestionen sus instalaciones y
            maximicen su potencial, asegurando una experiencia deportiva cómoda, accesible y
            personalizada.
          </p>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-lg">
            <img
              src="/src/assets/about2.png"
              alt="Qué hacemos"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
