import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, CalendarPlus, LogOut, Menu, X, User } from 'lucide-react';
import medivetLogo from '../../assets/medivetlogobig.png';

const UserLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const navLinks = [
    { name: 'Mis Mascotas', path: '/dashboard-user', icon: Home },
    { name: 'Agendar Cita', path: '/dashboard-user/agendar', icon: CalendarPlus },
  ];

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <img src={medivetLogo} alt="MediVet" className="h-10 object-contain" />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/dashboard-user'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                      isActive 
                        ? 'border-[#0c3a6f] text-[#0c3a6f]' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`
                  }
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* User Profile / Logout (Desktop) */}
            <div className="hidden md:flex items-center">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/dashboard-user'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                      isActive 
                        ? 'bg-[#9cd2c3] bg-opacity-20 text-[#0c3a6f]' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </NavLink>
              ))}
              <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-red-500 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

    </div>
  );
};

export default UserLayout;
