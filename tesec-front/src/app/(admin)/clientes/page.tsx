'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  User,
  ExternalLink,
  Building2
} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Cliente {
  id: string; 
  nombre: string;
  correo: string;
  whatsapp: string;
  empresa?: string; 
  fechaRegistro: string;
}

const clientesData: Cliente[] = [
  { id: 'CLI-001', nombre: 'Néstor López', correo: 'nestor@gmail.com', whatsapp: '8333134272', empresa: 'López Hnos', fechaRegistro: '01/12/2024' },
  { id: 'CLI-002', nombre: 'Ivan Beltrán', correo: 'ivan@beltran.com', whatsapp: '5512345678', empresa: 'Tech Solutions', fechaRegistro: '30/11/2024' },
  { id: 'CLI-003', nombre: 'Maria González', correo: 'maria.g@hotmail.com', whatsapp: '8187654321', empresa: 'Consultoría MG', fechaRegistro: '29/11/2024' },
  { id: 'CLI-004', nombre: 'Empresa ABC S.A.', correo: 'contacto@abc.mx', whatsapp: '5544332211', fechaRegistro: '28/11/2024' },
  { id: 'CLI-005', nombre: 'Roberto Diaz', correo: 'roberto@outlook.com', whatsapp: '8331112233', empresa: 'Autos Diaz', fechaRegistro: '27/11/2024' },
  { id: 'CLI-006', nombre: 'Laura Mendez', correo: 'lmendez@gmail.com', whatsapp: '7778889999', fechaRegistro: '25/11/2024' },
];

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredClientes = clientesData.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const paginatedClientes = filteredClientes.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handleOpenWhatsapp = (numero: string) => {
    const cleanNumber = numero.replace(/\D/g, ''); 
    window.open(`https://wa.me/52${cleanNumber}`, '_blank');
  };

  const handleVerDetalle = (cliente: Cliente) => {
    MySwal.fire({
      html: `
        <div class="flex flex-col items-center gap-3">
          <div class="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-[#FF7A00] text-3xl font-bold mb-2">
            ${cliente.nombre.substring(0, 2).toUpperCase()}
          </div>
          <h2 class="text-2xl font-bold text-gray-800">${cliente.nombre}</h2>
          <p class="text-sm text-gray-500">${cliente.id}</p>
          
          <div class="w-full bg-gray-50 rounded-lg p-4 mt-4 text-left space-y-3 border border-gray-100">
            <div class="flex items-center gap-3">
              <span class="p-2 bg-white rounded-md shadow-sm"><i class="text-gray-400">📧</i></span>
              <div>
                <p class="text-xs text-gray-400 font-bold uppercase">Correo</p>
                <p class="text-sm font-medium text-gray-800">${cliente.correo}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="p-2 bg-white rounded-md shadow-sm"><i class="text-green-500">💬</i></span>
              <div>
                <p class="text-xs text-gray-400 font-bold uppercase">WhatsApp</p>
                <p class="text-sm font-medium text-gray-800">${cliente.whatsapp}</p>
              </div>
            </div>
            ${cliente.empresa ? `
            <div class="flex items-center gap-3">
              <span class="p-2 bg-white rounded-md shadow-sm"><i class="text-blue-500">🏢</i></span>
              <div>
                <p class="text-xs text-gray-400 font-bold uppercase">Empresa</p>
                <p class="text-sm font-medium text-gray-800">${cliente.empresa}</p>
              </div>
            </div>
            ` : ''}
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'rounded-2xl'
      }
    });
  };


  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Cartera de Clientes</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Directorio de clientes registrados en el sistema.</p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-gray-600 hover:text-[#FF7A00] hover:border-orange-200 transition-colors text-sm font-medium">
            <Download size={18} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="flex gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar cliente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 md:py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] transition-all text-sm"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 md:py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm">
          <Filter size={18} />
          <span className="hidden sm:inline">Filtros</span>
        </button>
      </div>

      {/* VISTA DESKTOP - Tabla */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Num. Cliente</th>
                <th className="px-6 py-4">Cliente / Empresa</th>
                <th className="px-6 py-4">Contacto Digital</th>
                <th className="px-6 py-4">WhatsApp</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedClientes.length > 0 ? (
                paginatedClientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {cliente.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[#FF7A00] font-bold text-sm border border-white shadow-sm">
                          {cliente.nombre.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{cliente.nombre}</p>
                          {cliente.empresa && (
                            <p className="text-xs text-gray-400">{cliente.empresa}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 group/mail cursor-pointer hover:text-[#FF7A00] transition-colors" title="Copiar correo">
                        <Mail size={16} className="text-gray-400 group-hover/mail:text-[#FF7A00]" />
                        <span>{cliente.correo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleOpenWhatsapp(cliente.whatsapp)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200 hover:bg-green-100 transition-colors"
                      >
                        <MessageCircle size={14} />
                        {cliente.whatsapp}
                        <ExternalLink size={10} className="ml-1 opacity-50" />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <button 
                        onClick={() => handleVerDetalle(cliente)}
                        className="p-2 text-gray-400 hover:text-[#FF7A00] hover:bg-orange-50 rounded-full transition-colors"
                        title="Ver detalles"
                       >
                         <MoreHorizontal size={20} />
                       </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Search size={32} className="text-gray-300 mx-auto mb-2" />
                    <p>No se encontraron clientes.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación Desktop */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Página anterior"
              title="Página anterior"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${
                  currentPage === page 
                    ? 'bg-black text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Siguiente página"
              title="Siguiente página"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* VISTA MÓVIL - Cards */}
      <div className="md:hidden space-y-3">
        {paginatedClientes.length > 0 ? (
          paginatedClientes.map((cliente) => (
            <div 
              key={cliente.id} 
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                  {cliente.id}
                </span>
                <button 
                  onClick={() => handleVerDetalle(cliente)}
                  className="p-1.5 text-gray-400 hover:text-[#FF7A00] hover:bg-orange-50 rounded-lg transition-colors"
                  aria-label="Ver detalles"
                  title="Ver detalles"
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Contenido */}
              <div className="p-4 space-y-3">
                {/* Cliente */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-[#FF7A00] font-bold text-base border-2 border-orange-200 flex-shrink-0">
                    {cliente.nombre.substring(0,2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-base truncate">{cliente.nombre}</p>
                    {cliente.empresa && (
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                        <Building2 size={12} />
                        <span className="truncate">{cliente.empresa}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contactos */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {/* Email */}
                  <a 
                    href={`mailto:${cliente.correo}`}
                    className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#FF7A00] transition-colors p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <Mail size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{cliente.correo}</span>
                  </a>

                  {/* WhatsApp */}
                  <button 
                    onClick={() => handleOpenWhatsapp(cliente.whatsapp)}
                    className="w-full flex items-center gap-2.5 text-sm p-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                  >
                    <MessageCircle size={16} className="flex-shrink-0" />
                    <span className="font-medium">{cliente.whatsapp}</span>
                    <ExternalLink size={12} className="ml-auto opacity-50" />
                  </button>
                </div>

                {/* Fecha de registro */}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Registrado el {cliente.fechaRegistro}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Search size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No se encontraron clientes</p>
          </div>
        )}

        {/* Paginación Móvil */}
        {paginatedClientes.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mt-4">
            <p className="text-xs text-gray-500 text-center mb-3">
              Página {currentPage} de {totalPages}
            </p>
            
            <div className="flex items-center justify-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página anterior"
                title="Página anterior"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-1">
                {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page 
                        ? 'bg-black text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Siguiente página"
                title="Siguiente página"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}