import React, { useState, useEffect, useRef } from 'react';
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
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (window.confirm('¿Está seguro de cerrar sesión?')) {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="PlayBooker Logo" className="h-12 w-auto" />
        </Link>

        {/* Desktop */}
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

          {userName && roleId ? (
            roleId === 2 ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="py-2 px-6 bg-gradient-to-r from-[#0B91C1] to-[#EB752B]
                             text-white font-medium rounded-full shadow-xl hover:opacity-90 transition-opacity duration-200"
                >
                  {userName}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg divide-y divide-gray-200 z-50">
                    <Link
                      to="/mi-cuenta"
                      onClick={() => setDropdownOpen(false)}
                      className="block py-2 px-4 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Mi cuenta
                    </Link>
                    <Link
                      to="/mis-reservas"
                      onClick={() => setDropdownOpen(false)}
                      className="block py-2 px-4 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Mis reservas
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 px-4 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to={roleId === 1 ? '/dashboard-admin' : '/dashboard-company'}
                  className="py-2 px-6 bg-gradient-to-r from-[#0B91C1] to-[#EB752B]
                             text-white font-medium rounded-full shadow-xl hover:opacity-90 transition-opacity duration-200"
                >
                  {userName}
                </Link>
                <button
                  onClick={handleLogout}
                  title="Cerrar Sesión"
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                >
                  <FaSignOutAlt className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )
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

        {/* Mobile */}
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

      {/* Mobile Menu Content */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
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

          {userName && roleId ? (
            <div className="space-y-4">
              <Link
                to={
                  roleId === 1 ? '/dashboard-admin' :
                  roleId === 2 ? '/mi-cuenta' :
                  '/dashboard-company'
                }
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center py-3 px-12 bg-gradient-to-r from-[#0B91C1] to-[#EB752B]
                           text-white font-medium rounded-full shadow-xl hover:opacity-90 transition-opacity duration-200"
              >
                {userName}
              </Link>
              {roleId === 2 && (
                <Link
                  to="/mis-reservas"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center py-3 px-12 bg-gray-100 text-gray-800 font-medium rounded-full hover:bg-gray-200 transition"
                >
                  Mis reservas
                </Link>
              )}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
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
