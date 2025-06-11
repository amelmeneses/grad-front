export default function Hero() {
  return (
    <section
      className="relative bg-cover bg-center h-[600px]"
      style={{ backgroundImage: "url('/assets/hero.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 max-w-4xl mx-auto text-center text-white pt-32">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Reserva tu cancha favorita en minutos
        </h1>
        <p className="text-lg mb-8">
          Baloncesto, pádel, fútbol y tenis en un solo lugar.
        </p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Ingresa tu email"
            className="px-4 py-2 rounded-l-lg text-gray-800 w-64"
          />
          <button className="px-6 py-2 bg-blue-500 rounded-r-lg hover:bg-blue-600">
            Reserva ahora
          </button>
        </div>
      </div>
    </section>
  );
}
