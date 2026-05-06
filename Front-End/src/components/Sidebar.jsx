import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserCircle2 } from 'lucide-react';
import medivetLogo from '../assets/medivetlogobig.png';

const Sidebar = ({ userName, links, isMobileOpen, toggleMobile }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 z-30 w-64 h-full bg-white flex flex-col transition-transform duration-300 shadow-xl`}
      >
        {/* Logo and User Info Area */}
        <div className="bg-[#9cd2c3] pb-6 rounded-br-[40px]">
          <div className="bg-white rounded-br-[40px] rounded-tr-lg rounded-tl-lg p-4 mx-4 mt-4 mb-4 flex justify-center shadow-sm">
             <img src={medivetLogo} alt="MediVet" className="h-12 object-contain" />
          </div>
          <div className="flex flex-col items-center px-4 mt-2">
            <div className="flex items-center gap-3 w-full pl-2">
              <div className="bg-[#5A4874] rounded-full p-2 text-white">
                <UserCircle2 className="w-6 h-6" />
              </div>
              <span className="font-semibold text-gray-900">{userName}</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-8 space-y-4">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.exact}
              onClick={() => {
                if (isMobileOpen) toggleMobile();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 font-bold transition-colors ${
                  isActive 
                    ? 'text-[#0c3a6f]' 
                    : 'text-[#0c3a6f] opacity-70 hover:opacity-100'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="bg-[#9cd2c3] p-6 mt-auto">
          <button 
            onClick={handleLogout}
            className="bg-[#096A56] hover:bg-[#074f40] text-white text-sm font-bold py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-colors"
          >
            <span className="transform rotate-180">➜</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
