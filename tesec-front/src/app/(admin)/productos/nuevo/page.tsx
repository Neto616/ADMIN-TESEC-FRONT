'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, UploadCloud, DollarSign, Package, Tag } from 'lucide-react';
import Swal from 'sweetalert2';

export default function NuevoProductoPage() {
  const router = useRouter();

  const handleSubmit = () => {
    Swal.fire({
      icon: 'success',
      title: 'Producto Creado',
      text: 'El producto se ha agregado correctamente al inventario.',
      confirmButtonColor: '#FF7A00',
    }).then(() => {
      router.push('/productos');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-transparent">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pb-6 sm:pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="sticky top-0 z-10 bg-gray-50 lg:bg-transparent -mx-3 px-3 sm:mx-0 sm:px-0 py-3 sm:py-4 mb-4 sm:mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-white lg:hover:bg-gray-100 active:bg-gray-200 text-gray-700 transition-all shadow-sm lg:shadow-none flex-shrink-0"
              aria-label="Volver atrás"
              title="Regresar a la lista de productos"
            >
              <ChevronLeft size={22} className="sm:w-6 sm:h-6" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Nuevo Producto</h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5 hidden sm:block">
                Complete la información para registrar un producto
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          
          {/* Detalles Principales */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Tag size={16} className="text-[#FF7A00]" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Información General
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="product-name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Nombre del Producto *
                  </label>
                  <input 
                    id="product-name"
                    name="name"
                    type="text" 
                    className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none transition-all text-sm sm:text-base bg-gray-50 focus:bg-white" 
                    placeholder="Ej. Laptop Gamer RTX 4060" 
                    required 
                    aria-required="true"
                    title="Ingrese el nombre del producto"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="product-sku" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      SKU (Código)
                    </label>
                    <input 
                      id="product-sku"
                      name="sku"
                      type="text" 
                      className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none transition-all text-sm sm:text-base bg-gray-50 focus:bg-white" 
                      placeholder="TEC-001"
                      title="Código único del producto"
                    />
                  </div>
                  <div>
                    <label htmlFor="product-category" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select 
                      id="product-category"
                      name="category"
                      className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none bg-gray-50 focus:bg-white transition-all text-sm sm:text-base"
                      required
                      aria-required="true"
                      title="Seleccione la categoría del producto"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="electronica">Electrónica</option>
                      <option value="mobiliario">Mobiliario</option>
                      <option value="accesorios">Accesorios</option>
                      <option value="ropa">Ropa</option>
                      <option value="alimentos">Alimentos</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="product-description" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea 
                    id="product-description"
                    name="description"
                    rows={3}
                    className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none resize-none transition-all text-sm sm:text-base bg-gray-50 focus:bg-white" 
                    placeholder="Características y especificaciones..."
                    aria-label="Descripción detallada del producto"
                    title="Agregue una descripción completa del producto"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Inventario y Precios */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign size={16} className="text-green-600" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Precios e Inventario
                </h2>
              </div>
              
              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
                <div>
                  <label htmlFor="price-sale" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-1">
                      Precio Venta *
                      <span className="text-gray-400 text-xs">($)</span>
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                    <input 
                      id="price-sale"
                      name="priceSale"
                      type="number" 
                      step="0.01"
                      min="0"
                      className="w-full pl-8 pr-3 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm sm:text-base bg-gray-50 focus:bg-white font-medium" 
                      placeholder="0.00" 
                      required 
                      aria-required="true"
                      title="Precio de venta al público"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="price-cost" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-1">
                      Precio Costo
                      <span className="text-gray-400 text-xs">($)</span>
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
                    <input 
                      id="price-cost"
                      name="priceCost"
                      type="number" 
                      step="0.01"
                      min="0"
                      className="w-full pl-8 pr-3 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none transition-all text-sm sm:text-base bg-gray-50 focus:bg-white font-medium" 
                      placeholder="0.00"
                      title="Precio de costo del producto"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="stock-initial" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    <span className="flex items-center gap-1">
                      Stock Inicial
                      <Package size={12} className="text-gray-400" />
                    </span>
                  </label>
                  <input 
                    id="stock-initial"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    className="w-full p-3 sm:p-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF7A00] focus:border-[#FF7A00] outline-none transition-all text-sm sm:text-base bg-gray-50 focus:bg-white font-medium text-center" 
                    placeholder="0"
                    title="Cantidad inicial en inventario"
                  />
                </div>
              </div>
            </div>
          </div>

          {/*  Imagen y Publicación */}
          <div className="space-y-3 sm:space-y-6 lg:sticky lg:top-4 lg:self-start">
            
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-3 sm:mb-4">Imagen del Producto</h2>
              <label 
                htmlFor="product-image"
                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center hover:bg-orange-50 hover:border-[#FF7A00] transition-all cursor-pointer group block"
                title="Click para subir imagen"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 text-[#FF7A00] rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#FF7A00] group-hover:text-white transition-all duration-300">
                  <UploadCloud size={28} className="sm:w-8 sm:h-8" />
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-700 group-hover:text-[#FF7A00] transition-colors">
                  Click para subir
                </p>
                <p className="text-xs text-gray-400 mt-1.5">PNG, JPG, WEBP · Máx 5MB</p>
                <input 
                  id="product-image"
                  name="image"
                  type="file" 
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only" 
                  aria-label="Subir imagen del producto"
                />
              </label>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 mb-3 sm:mb-4">Publicación</h2>
              
              <div className="mb-5 p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="activo" 
                    name="active"
                    className="w-5 h-5 mt-0.5 text-[#FF7A00] border-gray-300 rounded-md focus:ring-[#FF7A00] focus:ring-2 cursor-pointer" 
                    defaultChecked 
                    title="Marque para activar el producto"
                  />
                  <div className="flex-1">
                    <label htmlFor="activo" className="text-sm font-semibold text-gray-900 cursor-pointer block">
                      Producto Activo
                    </label>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Visible en el catálogo y disponible para venta
                    </p>
                  </div>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF7A00] to-orange-600 text-white py-3.5 sm:py-4 rounded-xl hover:from-orange-600 hover:to-[#FF7A00] active:scale-[0.98] transition-all font-bold shadow-lg shadow-orange-200 hover:shadow-xl text-sm sm:text-base"
                aria-label="Guardar nuevo producto"
                title="Crear producto"
              >
                <Save size={20} /> 
                <span>Guardar Producto</span>
              </button>

              <button 
                type="button"
                onClick={() => router.back()}
                className="w-full mt-3 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-black hover:border-gray-300 active:bg-gray-100 transition-all text-sm sm:text-base font-semibold"
                aria-label="Cancelar y volver"
                title="Cancelar sin guardar"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
        <div className="h-20 sm:h-0"></div>
      </div>
    </div>
  );
}