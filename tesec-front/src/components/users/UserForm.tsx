'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, User, Mail, Phone, Shield } from 'lucide-react';
import Swal from 'sweetalert2';

interface UserFormProps {
  initialData?: any; 
  isEditing?: boolean;
}

export default function UserForm({ initialData, isEditing = false }: UserFormProps) {
  const router = useRouter();
  
  // Estado inicial basado en si estamos editando o creando
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
    
    // Simulación de guardado
    Swal.fire({
      icon: 'success',
      title: isEditing ? 'Usuario Actualizado' : 'Usuario Creado',
      text: isEditing ? 'Los datos se han guardado correctamente.' : 'Se ha enviado un correo con la contraseña.',
      confirmButtonColor: '#000000',
      timer: 2000
    }).then(() => {
      router.push('/usuarios');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header del Formulario */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800">
          {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </h2>
        <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">
          {isEditing ? 'ID: ' + initialData?.id : 'Nuevo Registro'}
        </span>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Datos Personales */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[#FF7A00] mb-2 border-b border-orange-100 pb-2">
            <User size={20} />
            <h3 className="font-semibold text-gray-800">Datos Personales</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none transition-all"
                placeholder="Ej. Juan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
              <input 
                name="apellidos" 
                value={formData.apellidos} 
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none transition-all"
                placeholder="Ej. Pérez"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                name="whatsapp" 
                value={formData.whatsapp} 
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none transition-all"
                placeholder="55 1234 5678"
              />
            </div>
          </div>
        </div>

        {/* Acceso y Permisos */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[#FF7A00] mb-2 border-b border-orange-100 pb-2">
            <Shield size={20} />
            <h3 className="font-semibold text-gray-800">Acceso y Permisos</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico (Usuario)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="email"
                name="email" 
                value={formData.email} 
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none transition-all"
                placeholder="usuario@tesec.com"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 bg-blue-50 text-blue-700 p-2 rounded border border-blue-100">
              ℹ️ Nota: La contraseña será generada automáticamente y enviada a este correo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
                Rol del Sistema
              </label>
              
              <select 
                id="rol"           
                name="rol" 
                value={formData.rol} 
                onChange={handleChange}
                aria-label="Seleccionar rol del sistema" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent outline-none bg-white">
                <option value="Admin">Administrador</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Almacén">Almacén</option>
                <option value="Contador">Contador</option>
              </select>
            </div>

            {/* Switch de Activo/Inactivo */}
            <div 
              onClick={handleToggleStatus}
              className={`cursor-pointer border rounded-lg p-2 flex items-center justify-between transition-all ${
                formData.activo ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <span className={`text-sm font-medium ${formData.activo ? 'text-green-700' : 'text-gray-500'}`}>
                {formData.activo ? 'Usuario Activo' : 'Usuario Inactivo'}
              </span>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${formData.activo ? 'bg-green-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${formData.activo ? 'left-6' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-black text-white font-medium hover:bg-[#FF7A00] transition-colors shadow-sm"
        >
          <Save size={18} />
          {isEditing ? 'Actualizar Datos' : 'Guardar Usuario'}
        </button>
      </div>
    </form>
  );
}