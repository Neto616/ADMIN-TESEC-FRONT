'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  FileText, 
  ShoppingCart, 
  Save, 
  XCircle,
  Package,
  Tag
} from 'lucide-react';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);


import { productoService } from '../../../services/productoService';
import { catalogoService } from '@/services/catalogoService';
import { Pagination } from '../../../components/layout/Paginador';
import SearchBar from '@/components/layout/SearchBar';
import { cotizacionService } from '@/services/cotizacionService';
interface Producto {
  id: string;
  nombre: string;
  sku: string;
  marca: string;
  link: string;
  precio: number;
  precio_publico: number;
  proveedores?: { nombre: string };
  inventario?: { cantidad: number };
  imagen?: { url: string }; 
  estatus: number;
};

interface Cliente {
  value: number,
  label: string
}

interface ItemCotizacion extends Producto {
  cantidad: number;
}

const ITEMS_POR_PAGINA = 6;

export default function CotizarPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes]   = useState<Cliente[]>([]);
  const [items, setItems] = useState<ItemCotizacion[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [tituloCotizacion, setTituloCotizacion] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const productosFetch = useCallback(async (page: number, searchTerm: string) => {
    try {
      const response = await productoService.obtener({page, per_page: ITEMS_POR_PAGINA, buscar: searchTerm});
      setProductos(response.response.data);
      setCurrentPage(response.response.current_page);
      setLastPage(response.response.last_page);
      setTotalRecords(response.response.total);
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  const clientesFetch = useCallback(async () => {
    try {
      const resultado = await catalogoService.getClientes();
      setClientes(resultado.response);
    } catch (error: any) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    clientesFetch();
  }, [clientesFetch]);

  useEffect(() => {
    productosFetch(currentPage, '');
  }, [currentPage, '', productosFetch]);

  const agregarProducto = (producto: Producto) => {
    setItems(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item => 
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const quitarUno = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, cantidad: Math.max(1, item.cantidad - 1) };
      }
      return item;
    }));
  };

  const eliminarItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const calcularTotal = () => {
    const subtotal = items.reduce((acc, item) => acc + (item.precio_publico * item.cantidad), 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    const costoTotal = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    const ganancia = subtotal - costoTotal;

    return { subtotal, iva, total, ganancia };
  };

  const { subtotal, iva, total, ganancia } = calcularTotal();

  const handleGuardarCotizacion = () => {
    if (items.length === 0) {
      MySwal.fire({ icon: 'error', title: 'Cotización vacía', text: 'Agrega productos.', confirmButtonColor: '#000' });
      return;
    }
    if (!clienteSeleccionado) {
      MySwal.fire({ icon: 'warning', title: 'Falta Cliente', text: 'Selecciona un cliente.', confirmButtonColor: '#FF7A00' });
      return;
    }
    const body = {
      'titulo': tituloCotizacion.trim(),
      'id_cliente': parseInt(clienteSeleccionado),
      'productos': items
    };

    cotizacionService.crear(body);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-full">
        
        {/*Catálogo */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package size={18} className="text-[#FF7A00]" />
                </div>
                <span>Catálogo de Productos</span>
              </h2>
              <SearchBar 
                label_txt='Buscar producto, marca' 
                title_txt='Buscar por nombre, marca o categoría' 
                fnSearch={productosFetch}/>
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {productos.map((producto) => (
                <div 
                  key={producto.id}
                  onClick={() => agregarProducto(producto)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && agregarProducto(producto)}
                  className="group bg-white border-2 border-gray-100 rounded-xl p-3 sm:p-4 hover:shadow-lg hover:border-[#FF7A00] cursor-pointer transition-all flex flex-col relative overflow-hidden"
                  title={`Agregar ${producto.nombre} a la cotización`}
                  aria-label={`Agregar ${producto.nombre} al carrito, precio ${Number(producto.precio_publico).toLocaleString('es-MX', 
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pesos`}
                >
                  {/* Badges Superiores */}
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold bg-black text-white px-2 py-1 rounded-md flex items-center gap-1">
                      <Tag size={10} /> {producto.marca}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${producto.inventario?.cantidad ?? 0 > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      Stock: {producto.inventario?.cantidad ?? 0}
                    </span>
                  </div>

                  {/* Imagen */}
                  <div className="h-24 sm:h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 flex items-center justify-center group-hover:from-orange-50 group-hover:to-orange-100 transition-all">
                    {producto.imagen ? <img 
                           className="w-full h-full object-contain"
                           src={producto.imagen?.url} alt={producto.nombre} /> 
                           : <Package size={32} className="text-gray-300 group-hover:text-[#FF7A00] group-hover:scale-110 transition-all" />}
                  </div>

                  {/* Info Producto */}
                  <div className="mt-auto">
                    <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">{producto.marca}</p>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-tight mb-3 line-clamp-2 min-h-[2.5rem]">
                      {producto.nombre}
                    </h3>
                    
                    {/* Precios */}
                    <div className="flex justify-between items-end border-t-2 border-dashed border-gray-100 pt-3">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base sm:text-lg font-bold text-gray-900">${Number(producto.precio_publico).toLocaleString('es-MX', 
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span className="text-[9px] text-gray-400 font-medium">MXN</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-xs font-medium text-gray-400">${producto.precio.toLocaleString()}</span>
                          <span className="text-[8px] text-gray-300">Costo</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          agregarProducto(producto);
                        }}
                        className="bg-gray-900 text-white p-2 rounded-lg group-hover:bg-[#FF7A00] transition-all shadow-md hover:shadow-lg active:scale-95"
                        aria-label={`Agregar ${producto.nombre} al carrito`}
                        title="Agregar al carrito"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {productos.length === 0 && (
                <div className="col-span-full py-16 text-center">
                  <Package size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400 text-sm">No se encontraron productos con esa búsqueda.</p>
                </div>
              )}
            </div>
          </div>

          {/* Paginación */}
          <Pagination 
            currentPage={currentPage}
            lastPage={lastPage}
            totalRecords={totalRecords}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        {/* Cotización */}
        <div className="w-full lg:w-96 xl:w-[420px] flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200 lg:sticky lg:top-4 lg:self-start max-h-[calc(100vh-120px)]">
          
          {/* Selector de Cliente */}
          <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-br from-gray-900 to-black text-white">
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 mb-3">
              <FileText size={20} />
              Nueva Cotización
            </h2>
            <div className="mb-3">
              <label htmlFor="titulo-cotizacion" className="block text-xs font-semibold mb-2 text-gray-300">
                Título
              </label>
              <input
                id="titulo-cotizacion"
                type="text"
                value={tituloCotizacion}
                onChange={(e) => setTituloCotizacion(e.target.value)}
                placeholder="Ej. Cotización oficinas norte"
                className="w-full p-3 bg-white/10 backdrop-blur border-2 border-white/20 rounded-xl text-sm focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none text-white placeholder-gray-400"
                title="Título de la cotización"
              />
            </div>
            <label htmlFor="cliente-select" className="block text-xs font-semibold mb-2 text-gray-300">
              Seleccionar Cliente *
            </label>
            <select 
              id="cliente-select"
              name="cliente"
              value={clienteSeleccionado}
              onChange={(e) => setClienteSeleccionado(e.target.value)}
              className="w-full p-3 bg-white/10 backdrop-blur border-2 border-white/20 rounded-xl text-sm focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none text-white"
              required
              aria-required="true"
              title="Seleccione el cliente para esta cotización"
            >
              <option value="" className="text-gray-900">Indefinido</option>
              {
              clientes.map((cliente) => 
                  <option key={cliente.value} value={cliente.value} className="text-gray-900">{cliente.label}</option>)
                  }
              <option value="2" className="text-gray-900">Empresa ABC S.A.</option>
              <option value="3" className="text-gray-900">Néstor López</option>
            </select>
          </div>

          {/* Lista de Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-3 border-2 border-gray-100 rounded-xl p-3 hover:border-orange-200 transition-all group">
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md inline-block mb-1">
                      {item.marca}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-800 font-semibold line-clamp-1">{item.nombre}</p>
                    <p className="text-xs text-gray-400 mt-1">${Number(item.precio_publico).toLocaleString('es-MX', 
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })} c/u</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-1.5 py-1">
                      <button 
                        onClick={() => quitarUno(item.id)} 
                        className="p-1 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                        aria-label={`Disminuir cantidad de ${item.nombre}`}
                        title="Quitar uno"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.cantidad}</span>
                      <button 
                        onClick={() => agregarProducto(item)} 
                        className="p-1 hover:text-green-600 hover:bg-green-50 rounded transition-all"
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
                        title="Agregar uno"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <p className="text-sm font-bold text-gray-900">
                      ${(item.precio_publico * item.cantidad).toLocaleString()}
                    </p>
                    <button 
                      onClick={() => eliminarItem(item.id)}
                      className="text-[10px] text-red-400 hover:text-red-600 underline opacity-0 group-hover:opacity-100 transition-all font-medium"
                      aria-label={`Eliminar ${item.nombre} del carrito`}
                      title="Eliminar producto"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-gray-400 space-y-3">
                <ShoppingCart size={56} strokeWidth={1.5} className="opacity-30" />
                <p className="text-sm text-center px-6 font-medium">
                  Carrito vacío
                </p>
                <p className="text-xs text-center px-6 text-gray-400">
                  Haz clic en los productos para agregarlos
                </p>
              </div>
            )}
          </div>

          {/* Totales y Botones */}
          <div className="p-4 sm:p-5 bg-black text-white rounded-b-2xl">
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal:</span>
                <span className="font-semibold">${subtotal.toLocaleString('es-MX', 
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>IVA (16%):</span>
                <span className="font-semibold">${iva.toLocaleString('es-MX', 
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              
              {items.length > 0 && (
                <div className="flex justify-between text-[10px] text-gray-600 pt-2 border-t border-gray-800/50">
                  <span>Ganancia estimada:</span>
                  <span className="font-semibold">${ganancia.toLocaleString('es-MX', 
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between text-lg sm:text-xl font-bold text-[#FF7A00] pt-3 border-t-2 border-gray-800 mt-2">
                <span>Total:</span>
                <span>${total.toLocaleString('es-MX', 
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setItems([])}
                className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-red-900/50 hover:text-red-200 transition-all text-xs font-bold border-2 border-transparent hover:border-red-900"
                aria-label="Limpiar carrito"
                title="Vaciar carrito"
              >
                <XCircle size={16} />
                Limpiar
              </button>
              <button 
                onClick={handleGuardarCotizacion}
                className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-[#FF7A00] text-white hover:bg-orange-600 active:scale-95 transition-all text-xs font-bold shadow-lg shadow-orange-900/30"
                aria-label="Generar cotización"
                title="Crear cotización PDF"
              >
                <Save size={16} />
                Cotizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}