"use client"

import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 border-t border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-2">
        <p>
          &copy; {currentYear} <span className="font-semibold text-gray-700">TESEC</span>. Todos los derechos reservados.
        </p>
        <div className="flex gap-4">
          <span className="hover:text-[#FF7A00] cursor-pointer transition-colors">Soporte</span>
          <span className="hover:text-[#FF7A00] cursor-pointer transition-colors">Términos</span>
        </div>
      </div>
    </footer>
  );
}