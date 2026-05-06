import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Home, Calendar, FileText, Menu } from 'lucide-react';
import Sidebar from '../Sidebar';

const UserLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      setUserName(userObj.nombre_completo || 'Usuario');
    }
  }, []);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const userLinks = [
    { name: 'Inicio', path: '/dashboard-user', exact: true, icon: Home },
    { name: 'Agendar Cita', path: '/dashboard-user/agendar', exact: false, icon: Calendar },
    { name: 'Mis Recetas', path: '/dashboard-user/recetas', exact: false, icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-white">
      
      <Sidebar 
        userName={userName} 
        links={userLinks} 
        isMobileOpen={isMobileMenuOpen} 
        toggleMobile={toggleMenu} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header (Mobile mainly) */}
        <header className="bg-white shadow-sm h-16 flex items-center px-4 justify-between md:hidden">
          <div className="flex items-center gap-3">
            <button className="text-gray-500" onClick={toggleMenu}>
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-[#0c3a6f]">MediVet</span>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6 md:p-12">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default UserLayout;
