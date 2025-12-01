'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Save, UploadCloud } from 'lucide-react';
import Swal from 'sweetalert2';

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  const handleUpdate = () => {
    Swal.fire({
      icon: 'success',
      title: 'Producto Actualizado',
      text: `Los cambios en el producto #${id} se han guardado.`,
      confirmButtonColor: '#000000',
    }).then(() => {
      router.push('/productos');
    });
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7A00]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 py-4">
        <button 
          onClick={() => router.back()} 
          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 text-gray-500 transition-colors flex-shrink-0"
          aria-label="Volver atrás"
          title="Volver a la lista de productos"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Editar Producto</h1>
          <p className="text-gray-500 text-xs sm:text-sm truncate mt-0.5">
            Editando SKU: <span className="font-mono text-black font-medium">TEC-001</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        
        {/*Información */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 pb-2 border-b">
              Información General
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre del Producto
                </label>
                <input 
                  id="product-name"
                  name="name"
                  type="text" 
                  defaultValue="Laptop Gamer Xtreme" 
                  placeholder="Ej: Laptop Gamer Xtreme"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  required
                  aria-required="true"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="product-sku" className="block text-sm font-medium text-gray-700 mb-1.5">
                    SKU (Código)
                  </label>
                  <input 
                    id="product-sku"
                    name="sku"
                    type="text" 
                    defaultValue="TEC-001" 
                    className="w-full p-2.5 sm:p-3 border border-gray-300 bg-gray-100 rounded-lg outline-none text-gray-500 cursor-not-allowed text-sm sm:text-base" 
                    readOnly 
                    aria-readonly="true"
                    title="El SKU no puede ser modificado"
                    placeholder="TEC-001"
                  />
                </div>
                <div>
                  <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Categoría
                  </label>
                  <select 
                    id="product-category"
                    name="category"
                    className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none bg-white transition-all text-sm sm:text-base"
                    required
                    aria-required="true"
                    title="Seleccione la categoría del producto"
                  >
                    <option value="electronica">Electrónica</option>
                    <option value="mobiliario">Mobiliario</option>
                    <option value="ropa">Ropa</option>
                    <option value="alimentos">Alimentos</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Descripción
                </label>
                <textarea 
                  id="product-description"
                  name="description"
                  rows={4} 
                  defaultValue="Laptop de alto rendimiento con RTX 4060..." 
                  placeholder="Describe las características principales del producto..."
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none resize-none transition-all text-sm sm:text-base"
                  aria-label="Descripción detallada del producto"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Precios e Inventario */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 pb-2 border-b">
              Precios e Inventario
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="price-sale" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Precio Venta ($)
                </label>
                <input 
                  id="price-sale"
                  name="priceSale"
                  type="number" 
                  defaultValue={25000}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  required
                  aria-required="true"
                  title="Precio de venta al público"
                />
              </div>
              <div>
                <label htmlFor="price-cost" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Precio Costo ($)
                </label>
                <input 
                  id="price-cost"
                  name="priceCost"
                  type="number" 
                  defaultValue={18000}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  required
                  aria-required="true"
                  title="Precio de costo del producto"
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Stock Actual
                </label>
                <input 
                  id="stock"
                  name="stock"
                  type="number" 
                  defaultValue={12}
                  min="0"
                  step="1"
                  placeholder="0"
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  required
                  aria-required="true"
                  title="Cantidad disponible en inventario"
                />
              </div>
            </div>
          </div>
        </div>

        {/*  Imagen y Acciones */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Imagen del Producto</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="text-xs text-green-600 font-bold mb-2 flex items-center gap-1">
                <span className="text-base">✓</span> Imagen Actual Cargada
              </div>
              <div className="w-full h-32 sm:h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3 flex items-center justify-center text-gray-500 text-sm font-medium shadow-inner">
                Vista Previa
              </div>
              <button 
                type="button" 
                onClick={() => alert('Abrir selector de archivos')}
                className="flex items-center gap-2 text-sm text-[#FF7A00] hover:text-orange-600 hover:underline transition-colors font-medium active:text-orange-700"
                aria-label="Cambiar imagen del producto"
                title="Subir una nueva imagen"
              >
                <UploadCloud size={16} />
                Cambiar imagen
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              JPG, PNG, WEBP · Máx 5MB
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm sticky top-4">
            <button 
              type="button"
              onClick={handleUpdate}
              className="w-full flex items-center justify-center gap-2 bg-[#FF7A00] text-white py-3 sm:py-3.5 rounded-lg hover:bg-orange-600 active:bg-orange-700 transition-all font-medium shadow-md hover:shadow-lg text-sm sm:text-base"
              aria-label="Guardar cambios realizados en el producto"
              title="Guardar cambios"
            >
              <Save size={18} /> 
              <span>Guardar Cambios</span>
            </button>
            <button 
              type="button"
              onClick={() => router.back()}
              className="w-full mt-3 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-black active:bg-gray-100 transition-colors text-sm sm:text-base font-medium"
              aria-label="Cancelar edición y volver"
              title="Cancelar sin guardar"
            >
              Cancelar
            </button>
          </div>

          {/* Información adicional visible en móvil */}
          <div className="lg:hidden bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-800 leading-relaxed">
              <span className="text-base">💡</span> <strong>Consejo:</strong> Asegúrate de completar todos los campos antes de guardar los cambios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}