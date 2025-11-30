'use client';

import React, { useState } from 'react';
import { Save, X, User, Mail, Phone, Shield, ArrowLeft } from 'lucide-react';

interface UserFormProps {
  initialData?: any; 
  isEditing?: boolean;
  onBack?: () => void;
  onSubmit?: (data: any) => void;
}

export default function UserForm({ initialData, isEditing = false, onBack, onSubmit }: UserFormProps) {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    apellidos: initialData?.apellidos || '',
    whatsapp: initialData?.whatsapp || '',
    email: initialData?.email || '',
    rol: initialData?.rol || 'Vendedor',
    activo: initialData?.activo ?? true, 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleStatus = () => {
    setFormData(prev => ({ ...prev, activo: !prev.activo }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      alert(isEditing ? 'Usuario Actualizado' : 'Usuario Creado');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="p-4 md:p-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumb/Back button móvil */}
      <a href="/usuarios"><button
        type="button"
        onClick={handleBack}
        className="md:hidden flex items-center gap-2 text-gray-600 mb-4 hover:text-[#FF7A00] transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Volver</span>
      </button></a>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header del Formulario */}
        <div className="px-4 md:px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </h2>
          <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">
            {isEditing ? 'ID: ' + initialData?.id : 'Nuevo Registro'}
          </span>
        </div>

        <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          
          {/* Datos Personales */}
          <div className="space-y-5 md:space-y-6">
            <div className="flex items-center gap-2 text-[#FF7A00] mb-2 border-b border-orange-100 pb-2">
              <User size={18} className="md:w-5 md:h-5" />
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Datos Personales</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                <input 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none transition-all text-base"
                  placeholder="Ej. Juan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Apellidos</label>
                <input 
                  name="apellidos" 
                  value={formData.apellidos} 
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none transition-all text-base"
                  placeholder="Ej. Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp / Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 md:top-2.5 text-gray-400" size={18} />
                  <input 
                    name="whatsapp" 
                    value={formData.whatsapp} 
                    onChange={handleChange}
                    type="tel"
                    className="w-full pl-10 pr-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none transition-all text-base"
                    placeholder="55 1234 5678"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Acceso y Permisos */}
          <div className="space-y-5 md:space-y-6">
            <div className="flex items-center gap-2 text-[#FF7A00] mb-2 border-b border-orange-100 pb-2">
              <Shield size={18} className="md:w-5 md:h-5" />
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Acceso y Permisos</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo Electrónico (Usuario)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 md:top-2.5 text-gray-400" size={18} />
                <input 
                  type="email"
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none transition-all text-base"
                  placeholder="usuario@tesec.com"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 bg-blue-50 text-blue-700 p-2.5 rounded border border-blue-100">
                ℹ️ {isEditing ? 'El correo es usado para iniciar sesión.' : 'La contraseña será generada automáticamente y enviada a este correo.'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Rol del Sistema
                </label>
                
                <select 
                  id="rol"           
                  name="rol" 
                  value={formData.rol} 
                  onChange={handleChange}
                  aria-label="Seleccionar rol del sistema" 
                  className="w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none bg-white text-base"
                >
                  <option value="Admin">Administrador</option>
                  <option value="Vendedor">Vendedor</option>
                  <option value="Almacén">Almacén</option>
                  <option value="Contador">Contador</option>
                </select>
              </div>

              {/* Switch de Activo/Inactivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estado del Usuario</label>
                <div 
                  onClick={handleToggleStatus}
                  className={`cursor-pointer border rounded-lg p-3 md:p-2.5 flex items-center justify-between transition-all ${
                    formData.activo ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <span className={`text-sm font-medium ${formData.activo ? 'text-green-700' : 'text-gray-500'}`}>
                    {formData.activo ? 'Usuario Activo' : 'Usuario Inactivo'}
                  </span>
                  <div className={`w-11 h-6 md:w-10 md:h-5 rounded-full relative transition-colors ${formData.activo ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 md:w-3 md:h-3 bg-white rounded-full transition-all shadow-sm ${formData.activo ? 'left-6 md:left-6' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="px-4 md:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <a href="/usuarios"><button
            type="button"
            onClick={handleBack}
            className="flex items-center justify-center gap-2 px-5 py-3 md:py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
            Cancelar
          </button></a>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 px-6 py-3 md:py-2.5 rounded-lg bg-black text-white font-medium hover:bg-[#FF7A00] transition-colors shadow-sm"
          >
            <Save size={18} />
            {isEditing ? 'Actualizar Datos' : 'Guardar Usuario'}
          </button>
        </div>
      </div>
    </div>
  );
}