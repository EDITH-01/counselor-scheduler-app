import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from '../../hooks/useRouter';
import { Calendar, Clock, User, Users, BarChart3, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { navigate, currentRoute } = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getNavItems = () => {
    switch (user?.role) {
      case 'student':
        return [
          { to: '/student', label: 'Dashboard', icon: <User className="w-4 h-4" /> }
        ];
      case 'counselor':
        return [
          { to: '/counselor', label: 'Dashboard', icon: <User className="w-4 h-4" /> }
        ];
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> }
        ];
      default:
        return [];
    }
  };

  const NavLink = ({ to, children, className = "", onClick = () => {} }) => {
    const isActive = currentRoute === to;
    return (
      <button
        onClick={() => {
          navigate(to);
          onClick();
        }}
        className={`${className} ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'}`}
      >
        {children}
      </button>
    );
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex-shrink-0 flex items-center"
            >
              <Calendar className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Counselor Scheduler
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {getNavItems().map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.name}
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {getNavItems().map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="flex items-center space-x-2 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;