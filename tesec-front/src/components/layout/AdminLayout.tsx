'use client';

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-slate-800 font-sans">
      {/* Header Fijo */}
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Contenedor Flex para Sidebar y Contenido */}
      <div className="flex flex-1 pt-16 relative">
        
        {/* Sidebar (Navbar) */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Contenido Principal */}
        <main 
          className={`
            flex-1 p-6 transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'md:ml-64' : 'ml-0'} 
          `}
        >
          <div className="max-w-7xl mx-auto min-h-[85vh]">
            {children}
          </div>
          
          <Footer />
        </main>
      </div>
    </div>
  );
}