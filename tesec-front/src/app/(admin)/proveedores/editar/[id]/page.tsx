'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, Save, Building, Mail, MapPin, Phone, Upload, X, FileImage } from 'lucide-react';

interface EditarProveedorFormProps {
  providerId?: string;
  onBack?: () => void;
  onSubmit?: (data: any) => void;
}

export default function EditarProveedorForm({ providerId, onBack, onSubmit }: EditarProveedorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nombre: 'Cargando...',
    correo: '',
    telefono: '',
    rfc: '',
    direccion: '',
    logo: null as File | null
  });

  useEffect(() => {
    setTimeout(() => {
      setFormData({
        nombre: 'Hikvision Mexico',
        correo: 'soporte@hikvision.com',
        telefono: '55 8765 4321',
        rfc: 'HIK890101AAA',
        direccion: 'Av. Reforma 222, CDMX',
        logo: null
      });
      setLogoPreview('https://placehold.co/200x200/e5e7eb/6b7280?text=Logo');
    }, 500);
  }, [providerId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (onSubmit) {
        onSubmit(formData);
      }
      setIsSubmitting(false);
    }, 1000);
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
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <a href="/proveedores"><button 
          className="flex items-center gap-1 text-gray-500 hover:text-[#FF7A00] transition-colors text-sm font-medium"
        >
          <ChevronLeft size={16} />
          Volver
        </button></a>
        {providerId && (
          <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
            ID: {providerId}
          </span>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 bg-orange-50/30">
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Editar Proveedor</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Modifique los datos necesarios del proveedor.</p>
        </div>
        
        <div className="p-4 md:p-8">
          {/* Sección de Logo */}
          <div className="mb-8 pb-8 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FileImage size={18} className="text-[#FF7A00]" />
              Logo de la Empresa
            </h3>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative">
                {logoPreview ? (
                  <div className="relative w-32 h-32 rounded-xl border-2 border-gray-200 overflow-hidden bg-white shadow-sm">
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-full h-full object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                      title="Eliminar logo"
                      aria-label="Eliminar logo"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-2">
                    <Building className="text-gray-300" size={32} />
                    <span className="text-xs text-gray-400">Sin logo</span>
                  </div>
                )}
              </div>

              {/* Botón de carga */}
              <div className="flex-1 w-full sm:w-auto">
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm w-full sm:w-auto justify-center">
                    <Upload size={18} />
                    <span>Cambiar Logo</span>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    aria-label="Subir logo"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG o SVG. Máximo 2MB. Recomendado: 400x400px
                </p>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-5 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nombre Comercial *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] outline-none transition-all text-base" 
                    placeholder="Ej. Hikvision Mexico"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Correo Electrónico *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    value={formData.correo}
                    onChange={(e) => setFormData({...formData, correo: e.target.value})}
                    required
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

            <div className="space-y-5 md:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  RFC
                </label>
                <input 
                  type="text" 
                  value={formData.rfc}
                  onChange={(e) => setFormData({...formData, rfc: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] outline-none transition-all text-base uppercase" 
                  placeholder="ABC123456XYZ"
                  maxLength={13}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Dirección
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea 
                    rows={5}
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] outline-none transition-all resize-none text-base"
                    placeholder="Calle, número, colonia, ciudad, estado"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 md:mt-8 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <a href="/proveedores"><button 
              type="button"
              className="px-6 py-3 md:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center justify-center gap-2"
            >
              Cancelar
            </button></a>
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 md:py-2.5 bg-[#FF7A00] text-white rounded-lg hover:bg-orange-600 font-medium transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Actualizando...
                </>
              ) : (
                <>
                  <Save size={18} /> 
                  Actualizar Datos
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}