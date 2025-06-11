export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
        <div>
          <h4 className="font-semibold mb-2">About Us</h4>
          <ul className="space-y-1 text-sm">
            <li>Términos y Condiciones</li>
            <li>Política de Privacidad</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Servicios</h4>
          <ul className="space-y-1 text-sm">
            <li>Reservas de canchas</li>
            <li>Gestión para Empresas</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Quicklinks</h4>
          <ul className="space-y-1 text-sm">
            <li>Mi perfil</li>
            <li>Contáctanos</li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-8 text-xs">Copyright © 2024.</div>
    </footer>
  );
}
