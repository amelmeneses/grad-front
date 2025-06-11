// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo_menu.svg';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/reservas', label: 'Reservas' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/gift-cards', label: 'Gift Cards' },
  { to: '/ayuda', label: 'Ayuda' },
];

const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="relative z-60 flex-shrink-0">
          <img src={logo} alt="PlayBooker Logo" className="h-12 w-auto" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex flex-1 items-center justify-between">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-base font-medium transition-colors duration-200 flex-1 text-center
                ${pathname === link.to
                  ? 'text-[#DB864F]'
                  : 'text-black hover:text-[#DB864F]'
                }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="ml-4 py-2 px-8 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white font-medium rounded-full shadow-xl hover:opacity-90 transition-opacity duration-200"
          >
            Iniciar
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
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

      {/* Mobile Fullscreen Menu */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`text-2xl font-medium transition-colors duration-200
                ${pathname === link.to
                  ? 'text-[#DB864F]'
                  : 'text-black hover:text-[#DB864F]'
                }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="mt-4 py-3 px-12 bg-gradient-to-r from-[#0B91C1] to-[#EB752B] text-white font-medium rounded-full shadow-xl hover:opacity-90 transition-opacity duration-200"
          >
            Iniciar
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
