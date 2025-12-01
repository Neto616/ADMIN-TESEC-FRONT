'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  MoreHorizontal, 
  Building2, 
  MapPin, 
  Mail,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Swal from 'sweetalert2';

const proveedoresData = [
  { id: 'PROV-001', nombre: 'Dahua Technology', contacto: 'ventas@dahua.mx', telefono: '55 1234 5678', estatus: 'Activo' },
  { id: 'PROV-002', nombre: 'Hikvision Mexico', contacto: 'soporte@hikvision.com', telefono: '55 8765 4321', estatus: 'Activo' },
  { id: 'PROV-003', nombre: 'Cisco Systems', contacto: 'latam@cisco.com', telefono: '800 123 4567', estatus: 'Inactivo' },
  { id: 'PROV-004', nombre: 'Ubiquiti Inc.', contacto: 'sales@ui.com', telefono: '1 408 999 999', estatus: 'Activo' },
  { id: 'PROV-005', nombre: 'TP-Link México', contacto: 'info@tp-link.mx', telefono: '55 9876 5432', estatus: 'Activo' },
  { id: 'PROV-006', nombre: 'D-Link Corporation', contacto: 'ventas@dlink.com.mx', telefono: '55 1122 3344', estatus: 'Activo' },
];

export default function ProveedoresPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const itemsPerPage = 5;

  const filteredProveedores = proveedoresData.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProveedores.length / itemsPerPage);
  const paginatedProveedores = filteredProveedores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (nombre: string) => {
    Swal.fire({
      title: '¿Eliminar proveedor?',
      text: `Se eliminará a "${nombre}" y no podrás revertir esta acción.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminado',
          text: 'El proveedor ha sido eliminado correctamente.',
          icon: 'success',
          confirmButtonColor: '#000000'
        });
      }
    });
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Proveedores</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Gestión de socios comerciales y suministros.</p>
        </div>
        
        <Link href="/proveedores/nuevo">
          <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-black text-white px-5 py-3 md:py-2.5 rounded-lg hover:bg-[#FF7A00] transition-all shadow-md hover:shadow-lg font-medium">
            <Plus size={18} />
            <span className="text-sm">Nuevo Proveedor</span>
          </button>
        </Link>
      </div>

      {/* BÚSQUEDA */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar proveedor..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 md:py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] transition-all text-sm"
          />
        </div>
      </div>

      {/* VISTA DESKTO */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Num. Proveedor</th>
                <th className="px-6 py-4">Logo / Empresa</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4 text-center">Opciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProveedores.length > 0 ? (
                paginatedProveedores.map((item) => (
                  <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                    
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {item.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-1 shadow-sm">
                           <Building2 className="text-gray-300" size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{item.nombre}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${item.estatus === 'Activo' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                            {item.estatus}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* CONTACTO */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          {item.contacto}
                        </div>
                        <div className="text-xs text-gray-400 pl-6">
                          {item.telefono}
                        </div>
                      </div>
                    </td>

                    {/* OPCIONES */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link href={`/proveedores/editar/${item.id}`}>
                          <button 
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                        </Link>
                        
                        <button 
                          onClick={() => handleDelete(item.nombre)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <Search size={32} className="text-gray-300 mx-auto mb-2" />
                    <p>No se encontraron proveedores.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Mostrando {paginatedProveedores.length} de {filteredProveedores.length} resultados
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
                    ? 'bg-[#FF7A00] text-white shadow-sm' 
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

      {/* VISTA MÓVIL */}
      <div className="md:hidden space-y-3">
        {paginatedProveedores.length > 0 ? (
          paginatedProveedores.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                  {item.id}
                </span>
                
                <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold ${item.estatus === 'Activo' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                  {item.estatus}
                </span>
              </div>

              {/* Contenido */}
              <div className="p-4 space-y-3">
                {/* Logo y Nombre */}
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl flex items-center justify-center p-2 shadow-sm flex-shrink-0">
                    <Building2 className="text-gray-400" size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base leading-tight">{item.nombre}</h3>
                  </div>

                  {/* Menú de 3 puntos */}
                  <div className="relative">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Menú de opciones"
                      title="Más opciones"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    {openMenuId === item.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                          <Link href={`/proveedores/editar/${item.id}`}>
                            <button
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors text-left"
                            >
                              <Edit size={16} className="text-blue-600" />
                              <span>Editar</span>
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(item.nombre)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
                          >
                            <Trash2 size={16} />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Contactos */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <a 
                    href={`mailto:${item.contacto}`}
                    className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[#FF7A00] transition-colors p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <Mail size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{item.contacto}</span>
                  </a>
                </div>

                {/* Botón de acción rápida */}
                <div className="pt-2 border-t border-gray-100">
                  <Link href={`/proveedores/editar/${item.id}`}>
                    <button className="w-full flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-sm">
                      <Edit size={16} />
                      Editar Proveedor
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Search size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No se encontraron proveedores</p>
          </div>
        )}

        {/* Paginación */}
        {paginatedProveedores.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 mt-4">
            <p className="text-xs text-gray-500 text-center mb-3">
              Mostrando {paginatedProveedores.length} de {filteredProveedores.length} resultados
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
                        ? 'bg-[#FF7A00] text-white shadow-sm' 
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