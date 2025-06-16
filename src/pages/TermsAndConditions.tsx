// src/pages/TermsAndConditions.tsx
import AdminNav from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect, useRef } from 'react';

export default function TermsAndConditions() {
  const contentRef = useRef<HTMLDivElement>(null);

  // opcional: hacer que el contenido interior sea scrollable
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = '60vh';
      contentRef.current.style.overflowY = 'auto';
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <AdminNav />

      {/* Hero degradado */}
      <section
        className="h-48 flex items-center justify-center"
        style={{
          background: 'linear-gradient(90deg, #075F92 0%, #0B91C1 50%, #EB752B 100%)'
        }}
      >
        <h1 className="text-4xl font-bold text-white">Términos y Condiciones</h1>
      </section>

      {/* Contenido */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-2 text-gray-800">
          <div className="flex justify-between text-sm">
            <span>PlayBooker términos y condiciones</span>
            <span>Efectivo en Diciembre, 2024</span>
          </div>
          <div
            ref={contentRef}
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed"
          >
            {/* Columna izquierda */}
            <div className="space-y-6">
              <section>
                <h2 className="font-semibold mb-2">1. Introducción</h2>
                <p>
                  Bienvenido a PlayBooker, la plataforma líder para la reserva de canchas deportivas.
                  Al utilizar nuestros servicios, aceptas los siguientes términos y condiciones, que
                  están diseñados para garantizar una experiencia segura, eficiente y agradable
                  para todos los usuarios.
                </p>
              </section>

              <section>
                <h2 className="font-semibold mb-2">2. Uso de la Plataforma</h2>
                <p>
                  Los usuarios se comprometen a proporcionar información veraz y actualizada al
                  registrarse y al hacer reservas. PlayBooker no se hace responsable de
                  inexactitudes provistas por los propietarios de las canchas.
                </p>
              </section>

              {/* ... más secciones según tu contenido ... */}
            </div>

            {/* Columna derecha */}
            <div className="space-y-6">
              <section>
                <h2 className="font-semibold mb-2">3. Contenido en los Servicios</h2>
                <p>
                  Toda la información proporcionada en PlayBooker, como horarios, precios y
                  servicios adicionales, es gestionada por los propietarios de las canchas y
                  actualizada en tiempo real. No garantizamos la exactitud de todos los datos.
                </p>
              </section>

              <section>
                <h2 className="font-semibold mb-2">4. Responsabilidad de los Usuarios</h2>
                <p>
                  Como usuario, confirmas haber revisado los detalles antes de reservar, y asumes
                  la responsabilidad sobre el uso adecuado de las instalaciones.
                </p>
              </section>

              <section>
                <h2 className="font-semibold mb-2">5. Modificaciones</h2>
                <p>
                  PlayBooker se reserva el derecho a modificar estos términos en cualquier
                  momento. Las actualizaciones serán efectivas a partir de su publicación.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
