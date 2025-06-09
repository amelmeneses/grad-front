import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiUser } from 'react-icons/fi';
import { MdSportsBasketball } from 'react-icons/md';
import logo from '../assets/logop.svg';

export default function AdminNav() {
  const location = useLocation();

  const menuItems = [
    { to: '/dashboard-admin', label: 'Dashboard', icon: <FiGrid size={20} /> },
    { to: '/admin/users',    label: 'Usuario',   icon: <FiUser size={20} /> },
    { to: '/admin/empresas', label: 'Empresas',  icon: <MdSportsBasketball size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r h-screen p-6 flex flex-col">
      {/* Logo y título */}
      <div className="mb-8 flex items-center space-x-2">
        <img src={logo} alt="Playbooker" className="h-8 w-auto" />
        <span className="text-xl font-bold">Playbooker</span>
      </div>

      {/* Menú */}
      <nav className="flex-1">
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
    </aside>
  );
}
