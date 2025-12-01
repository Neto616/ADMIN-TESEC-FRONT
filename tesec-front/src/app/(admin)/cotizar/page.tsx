'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  FileText, 
  ShoppingCart, 
  Save, 
  XCircle,
  Package,
  Tag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Producto {
  id: string;
  nombre: string;
  marca: string;          
  categoria: string;
  precioPublico: number;  
  costo: number;          
  stock: number;
}

interface ItemCotizacion extends Producto {
  cantidad: number;
}

const catalogoProductos: Producto[] = [
  { id: 'PROD-001', nombre: 'Cámara IP Domo 4MP', marca: 'Hikvision', categoria: 'Seguridad', precioPublico: 1250.00, costo: 850.00, stock: 20 },
  { id: 'PROD-002', nombre: 'DVR 8 Canales 1080p AI', marca: 'Dahua', categoria: 'Grabación', precioPublico: 2800.00, costo: 1950.00, stock: 5 },
  { id: 'PROD-003', nombre: 'Bobina Cable UTP Cat6 305m', marca: 'Saxxon', categoria: 'Cableado', precioPublico: 3200.00, costo: 2400.00, stock: 15 },
  { id: 'PROD-004', nombre: 'Disco Duro 2TB Skyhawk', marca: 'Seagate', categoria: 'Almacenamiento', precioPublico: 1850.00, costo: 1450.00, stock: 8 },
  { id: 'PROD-005', nombre: 'Fuente de Poder 12V 4.1A', marca: 'Epcom', categoria: 'Energía', precioPublico: 450.00, costo: 280.00, stock: 50 },
  { id: 'PROD-006', nombre: 'Conector RJ45 (Bolsa 100pz)', marca: 'LinkedPro', categoria: 'Accesorios', precioPublico: 250.00, costo: 120.00, stock: 30 },
  { id: 'PROD-007', nombre: 'Kit Alarma Inalámbrica WiFi', marca: 'Hikvision', categoria: 'Seguridad', precioPublico: 4500.00, costo: 3200.00, stock: 3 },
  { id: 'PROD-008', nombre: 'Sensor de Movimiento PIR', marca: 'Paamon', categoria: 'Sensores', precioPublico: 350.00, costo: 190.00, stock: 12 },
];

const ITEMS_POR_PAGINA = 6;

export default function CotizarPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<ItemCotizacion[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);

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
    const subtotal = items.reduce((acc, item) => acc + (item.precioPublico * item.cantidad), 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    const costoTotal = items.reduce((acc, item) => acc + (item.costo * item.cantidad), 0);
    const ganancia = subtotal - costoTotal;

    return { subtotal, iva, total, ganancia };
  };

  const { subtotal, iva, total, ganancia } = calcularTotal();

  const productosFiltrados = catalogoProductos.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.marca.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const indiceFin = indiceInicio + ITEMS_POR_PAGINA;
  const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  React.useEffect(() => {
    setPaginaActual(1);
  }, [searchTerm]);

  const handleGuardarCotizacion = () => {
    if (items.length === 0) {
      MySwal.fire({ icon: 'error', title: 'Cotización vacía', text: 'Agrega productos.', confirmButtonColor: '#000' });
      return;
    }
    if (!clienteSeleccionado) {
      MySwal.fire({ icon: 'warning', title: 'Falta Cliente', text: 'Selecciona un cliente.', confirmButtonColor: '#FF7A00' });
      return;
    }

    MySwal.fire({
      title: 'Generar Cotización',
      html: `
        <div class="text-left text-sm">
           <p><strong>Cliente:</strong> ${clienteSeleccionado === '1' ? 'Cliente Mostrador' : clienteSeleccionado === '2' ? 'Empresa ABC S.A.' : 'Néstor López'}</p>
           <p><strong>Total Público:</strong> $${total.toLocaleString()}</p>
           <hr class="my-2 border-dashed">
           <p class="text-gray-400 text-xs">Margen estimado (Interno): $${ganancia.toLocaleString()}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar y PDF'
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire('Creado', 'Cotización generada exitosamente.', 'success');
        setItems([]);
        setClienteSeleccionado('');
      }
    });
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
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar producto, marca..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] transition-all text-sm"
                  aria-label="Buscar productos"
                  title="Buscar por nombre, marca o categoría"
                />
              </div>
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {productosPaginados.map((producto) => (
                <div 
                  key={producto.id}
                  onClick={() => agregarProducto(producto)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && agregarProducto(producto)}
                  className="group bg-white border-2 border-gray-100 rounded-xl p-3 sm:p-4 hover:shadow-lg hover:border-[#FF7A00] cursor-pointer transition-all flex flex-col relative overflow-hidden"
                  title={`Agregar ${producto.nombre} a la cotización`}
                  aria-label={`Agregar ${producto.nombre} al carrito, precio ${producto.precioPublico} pesos`}
                >
                  {/* Badges Superiores */}
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold bg-black text-white px-2 py-1 rounded-md flex items-center gap-1">
                      <Tag size={10} /> {producto.marca}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${producto.stock > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      Stock: {producto.stock}
                    </span>
                  </div>

                  {/* Imagen */}
                  <div className="h-24 sm:h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-3 flex items-center justify-center group-hover:from-orange-50 group-hover:to-orange-100 transition-all">
                    <Package size={32} className="text-gray-300 group-hover:text-[#FF7A00] group-hover:scale-110 transition-all" />
                  </div>

                  {/* Info Producto */}
                  <div className="mt-auto">
                    <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">{producto.categoria}</p>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 leading-tight mb-3 line-clamp-2 min-h-[2.5rem]">
                      {producto.nombre}
                    </h3>
                    
                    {/* Precios */}
                    <div className="flex justify-between items-end border-t-2 border-dashed border-gray-100 pt-3">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base sm:text-lg font-bold text-gray-900">${producto.precioPublico.toLocaleString()}</span>
                          <span className="text-[9px] text-gray-400 font-medium">MXN</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-xs font-medium text-gray-400">${producto.costo.toLocaleString()}</span>
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

              {productosFiltrados.length === 0 && (
                <div className="col-span-full py-16 text-center">
                  <Package size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-400 text-sm">No se encontraron productos con esa búsqueda.</p>
                </div>
              )}
            </div>
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-gray-600">
                  Mostrando <strong>{indiceInicio + 1}</strong> - <strong>{Math.min(indiceFin, productosFiltrados.length)}</strong> de <strong>{productosFiltrados.length}</strong> productos
                </p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    disabled={paginaActual === 1}
                    className="p-2 rounded-lg border-2 border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Página anterior"
                    title="Ir a página anterior"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
                      <button
                        key={pagina}
                        onClick={() => cambiarPagina(pagina)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                          pagina === paginaActual
                            ? 'bg-[#FF7A00] text-white shadow-md'
                            : 'bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                        aria-label={`Ir a página ${pagina}`}
                        aria-current={pagina === paginaActual ? 'page' : undefined}
                        title={`Página ${pagina}`}
                      >
                        {pagina}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    disabled={paginaActual === totalPaginas}
                    className="p-2 rounded-lg border-2 border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    aria-label="Página siguiente"
                    title="Ir a página siguiente"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cotización */}
        <div className="w-full lg:w-96 xl:w-[420px] flex flex-col bg-white rounded-2xl shadow-lg border border-gray-200 lg:sticky lg:top-4 lg:self-start max-h-[calc(100vh-120px)]">
          
          {/* Selector de Cliente */}
          <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-br from-gray-900 to-black text-white">
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 mb-3">
              <FileText size={20} />
              Nueva Cotización
            </h2>
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
              <option value="" className="text-gray-900">Seleccionar Cliente...</option>
              <option value="1" className="text-gray-900">Cliente Mostrador</option>
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
                    <p className="text-xs text-gray-400 mt-1">${item.precioPublico.toLocaleString()} c/u</p>
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
                      ${(item.precioPublico * item.cantidad).toLocaleString()}
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
                <span className="font-semibold">${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>IVA (16%):</span>
                <span className="font-semibold">${iva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              
              {items.length > 0 && (
                <div className="flex justify-between text-[10px] text-gray-600 pt-2 border-t border-gray-800/50">
                  <span>Ganancia estimada:</span>
                  <span className="font-semibold">${ganancia.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              <div className="flex justify-between text-lg sm:text-xl font-bold text-[#FF7A00] pt-3 border-t-2 border-gray-800 mt-2">
                <span>Total:</span>
                <span>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
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