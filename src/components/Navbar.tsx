// src/components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaSignOutAlt } from 'react-icons/fa';
import logo from '../assets/logo_menu.svg';

const links = [
  { to: '/',         label: 'Home' },
  { to: '/about-as', label: 'About Us' },
  { to: '/reservas', label: 'Reservas' },
  { to: '/servicios',label: 'Servicios' },
  { to: '/ayuda',    label: 'Ayuda' },
];

interface TokenPayload {
  id: number;
  role: number;
  name: string;
  exp: number;
}

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const [menuOpen,   setMenuOpen] = useState(false);
  const [userName,   setUserName] = useState<string|null>(null);
  const [roleId,     setRoleId]   = useState<number|null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { role, name } = jwtDecode<TokenPayload>(token);
        setRoleId(role);
        setUserName(name);
      } catch {
        setRoleId(null);
        setUserName(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="PlayBooker Logo" className="h-12 w-auto" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex flex-1 items-center justify-between">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-base font-medium transition-colors duration-200 flex-1 text-center ${
                pathname === l.to
                  ? 'text-[#DB864F]'
                  : 'text-black hover:text-[#DB864F]'
              }`}
            >
              {l.label}
            </Link>
          ))}

          {roleId === 2 && userName ? (
            <div className="flex items-center space-x-2">
              {/* “Mi Cuenta” button */}
              <Link
                to="/mi-cuenta"
                className="py-2 px-6 bg-gradient-to-r from-[#0B91C1] to-[#EB752B]
                           text-white font-medium rounded-full shadow-xl hover:opacity-90 transition-opacity duration-200"
              >
                {userName}
              </Link>
              {/* Separate logout icon */}
              <button
                onClick={handleLogout}
                title="Cerrar Sesión"
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              >
                <FaSignOutAlt className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-4 py-2 px-8 bg-gradient-to-r from-[#0B91C1] to-[#EB752B]
                         text-white font-medium rounded-full shadow-xl hover:opacity-90 transition-opacity duration-200"
            >
              Iniciar
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden hamburger ${menuOpen ? 'open' : ''}`}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className={`text-2xl font-medium transition-colors duration-200 ${
                pathname === l.to
                  ? 'text-[#DB864F]'
                  : 'text-black hover:text-[#DB864F]'
              }`}
            >
              {l.label}
            </Link>
          ))}

          {roleId === 2 && userName ? (
            <div className="space-y-4">
              <Link
                to="/mi-cuenta"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center py-3 px-12 bg-gradient-to-r from-[#0B91C1] to-[#EB752B]
                           text-white font-medium rounded-full shadow-xl hover:opacity-90 transition-opacity duration-200"
              >
                {userName}
              </Link>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                title="Cerrar Sesión"
                className="mx-auto p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              >
                <FaSignOutAlt className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-4 py-3 px-12 bg-gradient-to-r from-[#0B91C1] to-[#EB752B]
                         text-white font-medium rounded-full shadow-xl hover:opacity-90 transition-opacity duration-200"
            >
              Iniciar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
