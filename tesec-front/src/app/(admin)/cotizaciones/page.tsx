'use client';

import React, { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  ScanEye,
  CheckCircle, 
  XCircle,
  Download
} from 'lucide-react';
import { Pagination } from '@/components/layout/Paginador';
import { cotizacionService } from '@/services/cotizacionService';
import CotizacionModal from '@/components/modals/CotizacionModal';
import SearchBar from '../../../components/layout/SearchBar';

interface Cotizacion {
  id:        number,
  uuid:      string,
  titulo:    string,
  clientes:  {user: { nombre: string, apellidos: string }},
  estatus:   number,
  created_at: Date
};

export default function CotizacionesPage() {
  const [cotizaciones, setCotizacion] = useState<Cotizacion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCotizacion, setCurrentCotizacion] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [downloadCotizacionId, setDownloadCotizacionId] = useState<number | null>(null);
  const itemsPerPage = 10;

  const cotizacionFetch = useCallback(async (page: number, searchTerm: string) => {
    try {
      const response = await cotizacionService.obtener({page, per_page: itemsPerPage, busqueda: searchTerm});
      setCotizacion(response.response.data);
      setCurrentPage(response.response.current_page);
      setLastPage(response.response.last_page);
      setTotalRecords(response.response.total);
    } catch (error) {}
  }, []);

  useEffect(() => {
    cotizacionFetch(currentPage, '');
  }, [cotizacionFetch, currentPage]);


  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Cotizaciones</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Gestion de cotizaciones.</p>
        </div>
        <Link 
          href="/cotizaciones/nuevo"
          className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3 md:py-2.5 rounded-lg hover:bg-[#FF7A00] transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full md:w-auto"
        >
          <Plus size={20} />
          <span>Cotizaciones</span>
        </Link>
      </div>

      <SearchBar
        label_txt='Buscar por cliente o uuid'
        title_txt='Buscar por cliente o uuid'
        fnSearch={cotizacionFetch}
      />

      {/* VISTA DESKTOP - Tabla */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Uuid</th>
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Estatus</th>
                <th className="px-6 py-4">Fecha creación</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cotizaciones.map((cotizacion) => (
                <tr key={cotizacion.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    {cotizacion.uuid}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {cotizacion.titulo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {''.concat(cotizacion.clientes.user.nombre, ' ', cotizacion.clientes.user.apellidos)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      {cotizacion.estatus === 1 ? (
                        <>
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-green-700 font-medium">Activo</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} className="text-gray-400" />
                          <span className="text-gray-500">Inactivo</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(cotizacion.created_at).toLocaleDateString('es-MX', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setDownloadCotizacionId(cotizacion.id);
                          setShowDownloadModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Descargar cotización"
                      >
                        <Download size={18} />
                      </button>

                      <button 
                        onClick={() => {
                            setShowModal(true);
                            setCurrentCotizacion(cotizacion.id);
                          }
                        }
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar Usuario"
                      >
                        <ScanEye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          totalRecords={totalRecords}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* VISTA MÓVIL - Cards */}
      {/* <div className="md:hidden space-y-3">
        {cotizaciones.length > 0 ? (
          cotizaciones.map((cotizacion) => (
            <div 
              key={cotizacion.id} 
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-[#FF7A00] font-bold text-lg border-2 border-orange-200 flex-shrink-0">
                    {user.nombre.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base truncate">{user.nombre}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <Mail size={12} />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>

                {/* Menú de tres puntos
                <div className="relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Menú de opciones"
                    title="Más opciones"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {/* Dropdown Menu 
                  {openMenuId === cotizacion.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        <Link
                          href={`/cotizaciones/editar/${cotizacion.id}`}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                          onClick={() => setOpenMenuId(null)}
                        >
                          <Edit3 size={16} className="text-blue-600" />
                          <span>Editar Usuario</span>
                        </Link>
                        <button
                          // onClick={() => handleDelete(user.nombre, user.id)}
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

              {/* Botones de acción rápida 
              <div className="border-t border-gray-100 px-4 py-3 flex gap-2">
                <Link 
                  href={`/cotizaciones/editar/${cotizacion.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-sm"
                >
                  <Edit3 size={16} />
                  Editar
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Search size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No se encontraron usuarios</p>
          </div>
        )}
      </div> */}

      <CotizacionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        id={currentCotizacion}
      />
      <CotizacionModal
        isOpen={showDownloadModal}
        onClose={() => { setShowDownloadModal(false); setDownloadCotizacionId(null); }}
        id={downloadCotizacionId}
        autoDownload
      />
    </div>
  );
}