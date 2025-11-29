'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  CreditCard, 
  Banknote, 
  ArrowRightLeft,
  FileText,
  MoreHorizontal
} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// TIPOS DE DATO
type EstatusPedido = 'Pendiente' | 'Aprobado' | 'Finalizado' | 'Cancelado';
type MetodoPago = 'Efectivo' | 'Tarjeta' | 'Transferencia';

interface Pedido {
  id: string; 
  cliente: string;
  metodoPago: MetodoPago;
  estatus: EstatusPedido;
  total: number;
  fecha: string;
}

// ejemplo
const pedidosData: Pedido[] = [
  { id: 'ORD-001', cliente: 'Juan Pérez', metodoPago: 'Efectivo', estatus: 'Pendiente', total: 1500.00, fecha: '29/11/2025' },
  { id: 'ORD-002', cliente: 'Empresa ABC', metodoPago: 'Transferencia', estatus: 'Aprobado', total: 12450.50, fecha: '28/11/2025' },
  { id: 'ORD-003', cliente: 'Maria López', metodoPago: 'Tarjeta', estatus: 'Finalizado', total: 890.00, fecha: '28/11/2025' },
  { id: 'ORD-004', cliente: 'Carlos Ruiz', metodoPago: 'Efectivo', estatus: 'Pendiente', total: 320.00, fecha: '27/11/2025' },
  { id: 'ORD-005', cliente: 'Tech Solutions', metodoPago: 'Transferencia', estatus: 'Finalizado', total: 5600.00, fecha: '26/11/2025' },
  { id: 'ORD-006', cliente: 'Ana García', metodoPago: 'Tarjeta', estatus: 'Cancelado', total: 1200.00, fecha: '25/11/2025' },
];

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredPedidos = pedidosData.filter(pedido => 
    pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);
  const paginatedPedidos = filteredPedidos.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handleVerDetalle = (pedido: Pedido) => {
    MySwal.fire({
      title: `<span class="text-xl font-bold">Detalle Pedido #${pedido.id}</span>`,
      html: `
        <div class="text-left text-sm space-y-2">
          <p><strong>Cliente:</strong> ${pedido.cliente}</p>
          <p><strong>Total:</strong> $${pedido.total.toFixed(2)}</p>
          <p><strong>Fecha:</strong> ${pedido.fecha}</p>
          <hr class="my-2"/>
          <p class="text-gray-500">Aquí iría el listado de productos...</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonColor: '#000000',
      confirmButtonText: 'Cerrar'
    });
  };

  const handleCambiarEstatus = (pedido: Pedido) => {
    MySwal.fire({
      title: 'Actualizar Estatus',
      text: `Cambiar estatus para el pedido ${pedido.id}`,
      input: 'select',
      inputOptions: {
        'Pendiente': 'Pendiente',
        'Aprobado': 'Aprobado',
        'Finalizado': 'Finalizado',
        'Cancelado': 'Cancelado'
      },
      inputValue: pedido.estatus,
      showCancelButton: true,
      confirmButtonColor: '#FF7A00',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Guardar Cambio',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: `El pedido ahora está: ${result.value}`,
          confirmButtonColor: '#000000'
        });

      }
    });
  };

  const getEstatusColor = (estatus: EstatusPedido) => {
    switch (estatus) {
      case 'Pendiente': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Aprobado': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Finalizado': return 'bg-green-50 text-green-700 border-green-200';
      case 'Cancelado': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getMetodoPagoIcon = (metodo: MetodoPago) => {
    switch (metodo) {
      case 'Efectivo': return <Banknote size={16} className="text-green-600" />;
      case 'Tarjeta': return <CreditCard size={16} className="text-purple-600" />;
      case 'Transferencia': return <ArrowRightLeft size={16} className="text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Título y Buscador */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
          <p className="text-gray-500 text-sm mt-1">Administra y da seguimiento a las órdenes de compra.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por ID o Cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#FF7A00] transition-colors text-sm font-medium">
            <Filter size={18} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Num. Pedido</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Método Pago</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estatus</th>
                <th className="px-6 py-4 text-right">Opciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedPedidos.length > 0 ? (
                paginatedPedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-orange-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-gray-900">{pedido.id}</span>
                      <p className="text-xs text-gray-400 mt-0.5">{pedido.fecha}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                      {pedido.cliente}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-md w-fit border border-gray-100">
                        {getMetodoPagoIcon(pedido.metodoPago)}
                        <span>{pedido.metodoPago}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ${pedido.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getEstatusColor(pedido.estatus)}`}>
                        {pedido.estatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Botón: Ver Detalle / Recibo */}
                        <button 
                          onClick={() => handleVerDetalle(pedido)}
                          className="p-2 text-gray-400 hover:text-[#FF7A00] hover:bg-orange-50 rounded-lg transition-colors tooltip-trigger relative group/btn"
                          title="Ver Detalle"
                        >
                          <Eye size={18} />
                          {/* Icono de Recibo si está finalizado */}
                          {pedido.estatus === 'Finalizado' && <FileText size={14} className="absolute -top-1 -right-1 text-gray-400" />}
                        </button>

                        {/* Botón: Editar / Cambiar Estatus */}
                        <button 
                          onClick={() => handleCambiarEstatus(pedido)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Cambiar Estatus"
                        >
                          <Edit3 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="text-gray-300 mb-2" />
                      <p>No se encontraron pedidos con ese criterio.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando <span className="font-medium text-gray-900">{paginatedPedidos.length}</span> de <span className="font-medium text-gray-900">{filteredPedidos.length}</span> resultados
          </p>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Página anterior"
              title="Página anterior"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? 'bg-[#FF7A00] text-white shadow-sm shadow-orange-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
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
    </div>
  );
}