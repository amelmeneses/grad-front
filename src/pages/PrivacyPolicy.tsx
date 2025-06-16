import AdminNav from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AdminNav />

      {/* Hero */}
      <section
        className="h-64 bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(90deg, #075F92 0%, #0B91C1 50%, #EB752B 100%)'
        }}
      >
        <div className="h-full flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Política de Privacidad
          </h1>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto p-8">
        <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
          <h2 className="text-sm text-gray-600 mb-4">Efectivo en Diciembre, 2024</h2>
          <hr className="border-gray-300 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <aside className="text-sm text-gray-700 space-y-4">
              <h3 className="font-semibold text-[#075F92]">Introducción</h3>
              <p>
                En PlayBooker, valoramos profundamente tu privacidad y nos esforzamos por proteger la información
                personal que compartes con nosotros. Nuestra política de privacidad establece cómo recopilamos,
                utilizamos y protegemos tus datos al interactuar con nuestra plataforma.
              </p>
            </aside>

            <article className="md:col-span-2 text-sm text-gray-600 space-y-6">
              <section>
                <h4 className="font-semibold mb-2">Información que PlayBooker recopila</h4>
                <p>
                  Cuando utilizas nuestros servicios, recopilamos información como tu nombre,
                  correo electrónico, número de teléfono, preferencias deportivas y detalles de tus reservas.
                  También recolectamos actividad en el sitio para garantizar una experiencia óptima y personalizada.
                </p>
              </section>

              <section>
                <h4 className="font-semibold mb-2">Por qué PlayBooker recopila datos</h4>
                <p>
                  Utilizamos tu información para facilitar el proceso de reserva, garantizar la
                  disponibilidad de las canchas y personalizar tu experiencia en la plataforma.
                </p>
              </section>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
