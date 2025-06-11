// src/components/Hero.tsx
import { useNavigate } from 'react-router-dom';
export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="relative bg-cover bg-top h-[600px] flex items-center"
      style={{ backgroundImage: "url('/src/assets/HeroImage.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 max-w-4xl mx-auto text-left text-white px-16"> {/* aumenta px para mover a la izquierda */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#DB864F]"> {/* color personalizado */}
          Reserva tu cancha favorita en minutos
        </h1>
        <p className="text-lg mb-8">
          Baloncesto, pádel, fútbol y tenis en un solo lugar.
        </p>
        <div className="flex justify-start">
          <button
            onClick={() => navigate('/login')}
            className="
              px-8 py-3
              bg-gradient-to-r from-[#075F92] to-[#0B91C1]
              text-white font-semibold
              rounded-full shadow-lg
              hover:opacity-90 transition-opacity
            "
          >
            Reserva ahora
          </button>
        </div>
      </div>
    </section>
  );
}
