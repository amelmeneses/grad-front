import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-8">
        {/* About */}
        <div>
          <h4 className="font-semibold mb-2">About Us</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/about-as" className="hover:underline">
                Sobre Nosotros
              </Link>
            </li>
          </ul>
        </div>

        {/* Recursos */}
        <div>
          <h4 className="font-semibold mb-2">Recursos</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/terminos" className="hover:underline">
                Términos &amp; Condiciones
              </Link>
            </li>
            <li>
              <Link to="/politica" className="hover:underline">
                Política de Privacidad
              </Link>
            </li>
          </ul>
        </div>

        {/* Servicios */}
        <div>
          <h4 className="font-semibold mb-2">Servicios</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/reservas" className="hover:underline">
                Reservas de canchas
              </Link>
            </li>
            <li>
              <Link to="/admin/empresas" className="hover:underline">
                Gestión para Empresas
              </Link>
            </li>
          </ul>
        </div>

        {/* Quicklinks */}
        <div>
          <h4 className="font-semibold mb-2">Quicklinks</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/perfil" className="hover:underline">
                Mi perfil
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="hover:underline">
                Contáctanos
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center mt-8 text-xs">
        Copyright © 2024. Amel Meneses. All Rights Reserved
      </div>
    </footer>
  );
}
