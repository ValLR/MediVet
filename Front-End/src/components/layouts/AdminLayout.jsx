import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, FileText, LogOut, Menu, X } from 'lucide-react';
import medivetLogo from '../../assets/medivetlogobig.png';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí iría la lógica de cerrar sesión, limpiar localStorage, etc.
    navigate('/');
  };

  const navLinks = [
    { name: 'Inicio', path: '/dashboard-admin', icon: LayoutDashboard },
    { name: 'Agenda', path: '/dashboard-admin/agenda', icon: Calendar },
    { name: 'Pacientes', path: '/dashboard-admin/pacientes', icon: Users },
    { name: 'Historial', path: '/dashboard-admin/historial', icon: FileText },
  ];

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex h-screen bg-[#f3f4f6]">
      
      {/* Sidebar (Desktop) & Mobile Drawer */}
      <aside 
        className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:relative md:translate-x-0 z-20 w-64 h-full bg-white shadow-lg transition-transform duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          <img src={medivetLogo} alt="MediVet" className="h-10 object-contain" />
          <button className="md:hidden text-gray-500" onClick={toggleMenu}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === '/dashboard-admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-[#9cd2c3] bg-opacity-30 text-[#0c3a6f] font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header (Mobile mainly, or useful for generic top info) */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4 justify-between md:hidden">
          <div className="flex items-center gap-3">
            <button className="text-gray-500" onClick={toggleMenu}>
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-[#0c3a6f]">MediVet</span>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
