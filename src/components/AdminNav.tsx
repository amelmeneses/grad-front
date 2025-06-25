// src/components/AdminNav.tsx
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FiGrid, FiUser } from 'react-icons/fi';
import { MdSportsBasketball, MdOutlineStadium, MdOutlineEventAvailable } from 'react-icons/md';

interface TokenPayload {
  id: number;
  role: number;
  name: string;
  exp: number;
}

interface MenuItem {
  to: string;
  label: string;
  icon: JSX.Element;
}

export default function AdminNav() {
  const location = useLocation();
  const [role, setRole] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      setRole(decoded.role);
    } catch (e) {
      console.error('Error decodificando el token:', e);
    }
  }, []);

  const adminMenu: MenuItem[] = [
    { to: '/dashboard-admin', label: 'Dashboard', icon: <FiGrid size={20} /> },
    { to: '/admin/users', label: 'Usuarios', icon: <FiUser size={20} /> },
    { to: '/admin/empresas', label: 'Empresas', icon: <MdSportsBasketball size={20} /> },
    { to: '/admin/canchas', label: 'Canchas', icon: <MdOutlineStadium size={20} /> },
    { to: '/admin/reservas', label: 'Reservas', icon: <MdOutlineEventAvailable size={20} /> },
  ];

  const companyMenu: MenuItem[] = [
    { to: '/dashboard-company', label: 'Dashboard', icon: <FiGrid size={20} /> },
    { to: '/company/empresas', label: 'Empresas', icon: <MdSportsBasketball size={20} /> },
    { to: '/company/canchas', label: 'Canchas', icon: <MdOutlineStadium size={20} /> },
    { to: '/company/reservas', label: 'Reservas', icon: <MdOutlineEventAvailable size={20} /> },
  ];

  const menuItems = role === 1 ? adminMenu : role === 3 ? companyMenu : [];

  return (
    <aside className="w-64 bg-white border-r h-screen p-8 flex flex-col justify-between">
      <div>
        <nav>
          <ul className="space-y-4">
            {menuItems.map(item => {
              const active = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center p-2 rounded-lg transition-colors ${
                      active ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
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
    </aside>
  );
}
