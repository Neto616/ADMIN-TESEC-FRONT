'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Save, UploadCloud, Building, Mail, MapPin, Hash, Phone, X } from 'lucide-react';

interface NuevoProveedorFormProps {
  onSubmit?: (data: any) => void;
}

export default function NuevoProveedorForm({ onSubmit }: NuevoProveedorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    rfc: '',
    correo: '',
    telefono: '',
    direccion: '',
    logo: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (onSubmit) {
        onSubmit(formData);
      }
      setIsSubmitting(false);
    }, 1500);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({...formData, logo: file});
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData({...formData, logo: null});
    setLogoPreview(null);
  };

  return (
    <div className="p-4 md:p-0 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <Link 
        href="/proveedores"
        className="flex items-center gap-1 text-gray-500 hover:text-[#FF7A00] mb-4 md:mb-6 transition-colors text-sm font-medium w-fit"
      >
        <ChevronLeft size={16} />
        Volver al listado
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/50">
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Registrar Nuevo Proveedor</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Complete la información fiscal y de contacto.</p>
        </div>
        
        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            
            {/* Datos Generales */}
            <div className="space-y-5 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre Comercial *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    required 
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] outline-none transition-all text-base" 
                    placeholder="Ej. Tech Solutions S.A." 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  RFC / ID Fiscal
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={formData.rfc}
                    onChange={(e) => setFormData({...formData, rfc: e.target.value.toUpperCase()})}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] outline-none transition-all text-base uppercase" 
                    placeholder="ABC123456XYZ"
                    maxLength={13}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Correo de Contacto *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    required 
                    value={formData.correo}
                    onChange={(e) => setFormData({...formData, correo: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] outline-none transition-all text-base" 
                    placeholder="contacto@empresa.com" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="tel" 
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] outline-none transition-all text-base" 
                    placeholder="55 1234 5678" 
                  />
                </div>
              </div>
            </div>

            {/* Logo y Dirección */}
            <div className="space-y-5 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo de la Empresa</label>
                
                {logoPreview ? (
                  <div className="relative border-2 border-gray-200 rounded-xl p-4 bg-white">
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md z-10"
                      title="Eliminar logo"
                      aria-label="Eliminar logo"
                    >
                      <X size={16} />
                    </button>
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-full h-40 object-contain"
                    />
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors group">
                      <div className="w-12 h-12 bg-orange-50 text-[#FF7A00] rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <UploadCloud size={24} />
                      </div>
                      <p className="text-sm font-medium text-gray-700">Haz clic para subir imagen</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 2MB</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      aria-label="Subir logo"
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Dirección Física
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea 
                    rows={4}
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] outline-none transition-all resize-none text-base" 
                    placeholder="Calle, Número, Colonia, Ciudad..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Link href="/proveedores">
              <button 
                type="button" 
                className="w-full sm:w-auto px-6 py-3 md:py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancelar
              </button>
            </Link>
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 md:py-2.5 bg-black text-white rounded-lg hover:bg-[#FF7A00] font-medium transition-colors shadow-lg shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} /> Guardar Proveedor
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}