import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  User, 
  Target, 
  TrendingUp, 
  Brain, 
  Menu, 
  X, 
  LayoutDashboard,
  ChevronRight
} from 'lucide-react';

const navigationItems = [
  { 
    path: '/dashboard', 
    icon: LayoutDashboard, 
    label: 'Tableau de bord',
    description: 'Vue d\'ensemble de vos finances' 
  },
  { 
    path: '/account', 
    icon: User, 
    label: 'Mon compte',
    description: 'Gérez vos informations personnelles' 
  },
  { 
    path: '/goals', 
    icon: Target, 
    label: 'Mes objectifs',
    description: 'Suivez vos objectifs financiers' 
  },
  { 
    path: '/investments', 
    icon: TrendingUp, 
    label: 'Mes investissements',
    description: 'Gérez votre portefeuille' 
  },
  { 
    path: '/finai', 
    icon: Brain, 
    label: 'Mon FinAI',
    description: 'Votre coach financier personnel' 
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out z-30`}
      >
        <div className="h-full flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-900">SmartFinAI</span>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <div className={`font-medium ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                  {isActive && <ChevronRight className="w-5 h-5 text-blue-600" />}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-200 ${isDrawerOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Toggle Button */}
        {!isDrawerOpen && (
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="fixed top-4 left-4 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors z-20"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        )}
        
        {/* Content */}
        <div className="min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}