import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiHome,
  HiChartBar,
  HiUsers,
  HiLockClosed,
  HiUserGroup,
  HiChartSquareBar,
  HiStar,
  HiCalculator
} from 'react-icons/hi';
import { MdSpeed } from 'react-icons/md';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/', icon: <HiHome /> },
  { name: '🧮 Calculadoras', path: '/helpers', icon: <HiCalculator /> },
  { name: 'M/M/1', path: '/mm1', icon: <HiChartBar /> },
  { name: 'M/M/s>1', path: '/mms', icon: <HiUsers /> },
  { name: 'M/M/1/K', path: '/mm1k', icon: <HiLockClosed /> },
  { name: 'M/M/s>1/K', path: '/mmsk', icon: <HiUserGroup /> },
  { name: 'M/M/1/N', path: '/mm1n', icon: <HiChartSquareBar /> },
  { name: 'M/M/s>1/N', path: '/mmsn', icon: <HiChartSquareBar /> },
  { name: 'M/G/1', path: '/mg1', icon: <MdSpeed /> },
  {
    name: 'Prioridades',
    path: '/priority',
    icon: <HiStar />,
    children: [
      { name: 'Modelo 1', path: '/priority/1', icon: <HiStar /> },
      { name: 'Modelo 2', path: '/priority/2', icon: <HiStar /> },
      { name: 'Modelo 3', path: '/priority/3', icon: <HiStar /> },
      { name: 'Modelo 4', path: '/priority/4', icon: <HiStar /> },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-dark-950 text-white min-h-screen p-4 border-r border-dark-800">
      <nav>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 py-2.5 px-4 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-wine-700 text-white shadow-lg'
                    : 'hover:bg-dark-900 text-gray-300 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
              {item.children && (
                <ul className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <li key={child.path}>
                      <Link
                        to={child.path}
                        className={`flex items-center gap-3 py-2 px-4 rounded-lg text-sm transition-all ${
                          isActive(child.path)
                            ? 'bg-wine-700 text-white'
                            : 'hover:bg-dark-900 text-gray-400 hover:text-white'
                        }`}
                      >
                        <span>{child.icon}</span>
                        <span>{child.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
