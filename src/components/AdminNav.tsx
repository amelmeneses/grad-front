// src/components/AdminNav.tsx

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiUser, FiLogOut } from 'react-icons/fi';
import { MdSportsBasketball, MdOutlineStadium } from 'react-icons/md'; // ícono para canchas
import logo from '../assets/logop.svg';

export default function AdminNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { to: '/dashboard-admin',  label: 'Dashboard', icon: <FiGrid size={20} /> },
    { to: '/admin/users',      label: 'Usuarios',  icon: <FiUser size={20} /> },
    { to: '/admin/empresas',   label: 'Empresas',  icon: <MdSportsBasketball size={20} /> },
    { to: '/admin/canchas',    label: 'Canchas',   icon: <MdOutlineStadium size={20} /> }, // Nueva sección
  ];

  const handleLogout = () => {
    if (window.confirm('¿Está seguro de cerrar sesión?')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <aside className="w-64 bg-white border-r h-screen p-6 flex flex-col justify-between">
      {/* Logo y título */}
      <div>
        <div className="mb-8 flex items-center space-x-2">
          <img src={logo} alt="Playbooker" className="h-8 w-auto" />
          <span className="text-xl font-bold">Playbooker</span>
        </div>

        {/* Menú */}
        <nav>
          <ul className="space-y-4">
            {menuItems.map(item => {
              const active = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={
                      `flex items-center p-2 rounded-lg transition-colors ` +
                      (active
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100')
                    }
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Logout */}
      <div>
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="w-full flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <FiLogOut size={20} />
          <span className="ml-3 font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
