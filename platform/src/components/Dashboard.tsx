import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Trophy, User as UserIcon, Shield } from 'lucide-react';

export const Dashboard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  const tabs = [
    { id: 'teams', label: 'Мои команды', icon: Users, path: '/teams' },
    { id: 'competitions', label: 'Соревнования', icon: Trophy, path: '/competitions' },
    { id: 'profile', label: 'Профиль', icon: UserIcon, path: '/profile' },
    ...(isAdmin ? [{ id: 'admin', label: 'Админ-панель', icon: Shield, path: '/admin' }] : [])
  ];
  
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
      <aside className="lg:col-span-3 xl:col-span-2">
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive(tab.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="mt-6 lg:mt-0 lg:col-span-9 xl:col-span-10">
        {children}
      </div>
    </div>
  );
};