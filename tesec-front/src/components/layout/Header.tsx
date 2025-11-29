'use client';

import React from 'react';
import Image from 'next/image';
import { Menu, X, Bell, User } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 px-4 flex items-center justify-between shadow-sm">
      
      {/* Sección Izquierda: Botón Menú y Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-orange-50 text-gray-600 hover:text-[#FF7A00] transition-colors focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="flex items-center gap-3 select-none cursor-pointer">
           {/* Logo */}
          <div className="w-8 h-8 relative rounded-full overflow-hidden border border-gray-100">
             <Image 
               src="/logoT.jpg" 
               alt="TESEC Logo" 
               fill
               className="object-cover"
             />
          </div>
          <span className="font-bold text-xl tracking-tight text-black">
            TESEC <span className="text-[#FF7A00]">Admin</span>
          </span>
        </div>
      </div>

      {/* Sección Derecha: Utilidades (Notificaciones, Perfil) */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:text-[#FF7A00] transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

        <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
            <User size={18} />
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
        </button>
      </div>
    </header>
  );
}