'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Briefcase, 
  Truck, 
  Package, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Función auxiliar para combinar clases tailwind
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuItems = [
  { name: 'Estado del negocio', path: '/estado-negocio', icon: LayoutDashboard },
  { name: 'Pedidos', path: '/pedidos', icon: ShoppingCart },
  { name: 'Usuarios', path: '/usuarios', icon: Users },
  { name: 'Clientes', path: '/clientes', icon: Briefcase },
  { name: 'Proveedores', path: '/proveedores', icon: Truck },
  { name: 'Productos', path: '/productos', icon: Package },
];

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay para móvil (se cierra al hacer clic fuera) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : '-100%',
          width: '16rem' 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-16 left-0 bottom-0 bg-white border-r border-gray-200 z-40 overflow-y-auto",
          "md:translate-x-0", 
          !isOpen && "md:hidden" 
        )}
        style={{ x: isOpen ? '0%' : '-100%' }} 
      >
        <div className="p-4 flex flex-col h-full justify-between">
          
          {/* Navegación Principal */}
          <nav className="space-y-1 mt-4">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Menu Principal
            </p>
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => window.innerWidth < 768 && toggleSidebar()}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
                    isActive 
                      ? "bg-orange-50 text-[#FF7A00] font-medium" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-black"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF7A00]"
                    />
                  )}
                  <Icon size={20} className={cn(isActive ? "text-[#FF7A00]" : "text-gray-400 group-hover:text-black")} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && <ChevronRight size={16} className="text-[#FF7A00]" />}
                </Link>
              );
            })}
          </nav>

          {/* Botón Cerrar Sesión (Bottom) */}
          <div className="border-t border-gray-100 pt-4 mt-auto">
            <button
              onClick={() => console.log('Cerrar sesión...')} 
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}