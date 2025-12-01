'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Filter, 
  Edit3, 
  Trash2, 
  Package, 
  Tag, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import Swal from 'sweetalert2';

interface Producto {
  id: string;
  sku: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen?: string; 
}

const productosData: Producto[] = [
  { id: '1', sku: 'TEC-001', nombre: 'Laptop Gamer Xtreme', precio: 25000.00, stock: 12, categoria: 'Electrónica' },
  { id: '2', sku: 'TEC-002', nombre: 'Monitor 4K Ultra', precio: 8500.50, stock: 5, categoria: 'Monitores' },
  { id: '3', sku: 'ACC-045', nombre: 'Teclado Mecánico RGB', precio: 1200.00, stock: 0, categoria: 'Accesorios' },
  { id: '4', sku: 'MOV-102', nombre: 'Soporte Ergonómico', precio: 850.00, stock: 30, categoria: 'Mobiliario' },
  { id: '5', sku: 'AUD-009', nombre: 'Auriculares Wireless', precio: 3400.00, stock: 8, categoria: 'Audio' },
  { id: '6', sku: 'TEC-003', nombre: 'Mouse Gaming Pro', precio: 1500.00, stock: 15, categoria: 'Accesorios' },
  { id: '7', sku: 'MON-050', nombre: 'Monitor Curvo 27"', precio: 6500.00, stock: 7, categoria: 'Monitores' },
  { id: '8', sku: 'AUD-010', nombre: 'Micrófono USB', precio: 2200.00, stock: 10, categoria: 'Audio' },
  { id: '9', sku: 'ACC-046', nombre: 'Webcam HD 1080p', precio: 1800.00, stock: 0, categoria: 'Accesorios' },
];

export default function ProductosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const itemsPerPage = 8;

  const filteredProductos = productosData.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
  const paginatedProductos = filteredProductos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: string) => {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
      }
    });
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Catálogo de Productos</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Gestiona el inventario, precios y existencias.</p>
        </div>
        
        <Link 
          href="/productos/nuevo"
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#FF7A00] text-white px-5 py-3 md:py-2 rounded-lg hover:bg-orange-600 transition-all shadow-md shadow-orange-200 font-medium"
        >
          <Plus size={20} />
          <span className="text-sm">Agregar Producto</span>
        </Link>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar producto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 md:py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] transition-all text-sm"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 md:py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm">
          <Filter size={18} />
          <span>Categoría</span>
        </button>
      </div>

      {/* Grid de Productos */}
      {paginatedProductos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {paginatedProductos.map((producto) => (
            <div 
              key={producto.id} 
              className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Imagen */}
              <div className="h-40 md:h-48 bg-gray-100 relative flex items-center justify-center overflow-hidden">
                <Package size={48} className="text-gray-300 group-hover:scale-110 transition-transform duration-500" />
                
                {/* Badge de Stock */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold ${
                  producto.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {producto.stock > 0 ? `${producto.stock} en stock` : 'Agotado'}
                </div>

                {/* Menú móvil - solo visible en móvil */}
                <div className="md:hidden absolute top-3 left-3">
                  <div className="relative">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === producto.id ? null : producto.id)}
                      className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white transition-colors shadow-sm"
                      aria-label="Menú de opciones"
                      title="Más opciones"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openMenuId === producto.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute left-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                          <Link href={`/productos/editar/${producto.id}`}>
                            <button
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors text-left"
                            >
                              <Edit3 size={16} className="text-blue-600" />
                              <span>Editar</span>
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(producto.id)}
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
              </div>

              {/* Contenido de la Card */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <span className="text-xs font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                    #{producto.sku}
                  </span>
                  <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Tag size={12} /> {producto.categoria}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 text-sm md:text-base group-hover:text-[#FF7A00] transition-colors">
                  {producto.nombre}
                </h3>
                
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-lg md:text-xl font-bold text-gray-900">
                    ${producto.precio.toLocaleString('es-MX')}
                  </span>
                </div>
              </div>

              {/* Acciones - visible solo en desktop */}
              <div className="hidden md:flex bg-gray-50 px-4 py-3 gap-2 border-t border-gray-100">
                <Link 
                  href={`/productos/editar/${producto.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-1.5 rounded-lg text-sm font-medium hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors"
                >
                  <Edit3 size={16} /> Editar
                </Link>
                <button 
                  onClick={() => handleDelete(producto.id)}
                  className="px-3 py-1.5 bg-white border border-gray-200 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
                  title="Eliminar producto"
                  aria-label="Eliminar producto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Search size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No se encontraron productos</p>
        </div>
      )}

      {/* Paginación */}
      {paginatedProductos.length > 0 && totalPages > 1 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mt-6">
          <p className="text-xs text-gray-500 text-center mb-3">
            Mostrando {paginatedProductos.length} de {filteredProductos.length} productos
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
  );
}