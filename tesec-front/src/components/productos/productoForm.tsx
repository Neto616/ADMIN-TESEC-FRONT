'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { 
  Save, X, Tag, Briefcase, Link as LinkIcon, 
  DollarSign, Package, UploadCloud, ChevronLeft 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { catalogoService } from '@/services/catalogoService';

// Definición de Props similar a UserForm
type ProductoFormProps = | {
      isEditing: true;
      initialData: any; 
      onBack?: () => void;
      onSubmit: (data: FormData, id: number) => void;
      loading?: boolean;
    }
  | {
      isEditing?: false;
      initialData?: any;
      onBack?: () => void;
      onSubmit: (data: FormData) => void;
      loading?: boolean;
    };

interface ProveedorData {
  value: number;
  label: string;
}

export default function ProductoForm({ initialData, isEditing, onBack, onSubmit, loading }: ProductoFormProps) {
  const [proveedores, setProveedores] = useState<ProveedorData[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    marca: '',
    sku: '',
    link: '',
    id_proveedor: '',
    precio: '0.00',
    precio_publico: '0.00',
    cantidad: '',
    imagen: null as File | null,
    estatus: 1
  });

  // Carga de proveedores
  const fetchProveedores = useCallback(async () => {
    try {
      const data = await catalogoService.getProveedores();
      setProveedores(data.response);
    } catch (error: any) {
      Swal.fire('Error', 'No se pudieron cargar los proveedores', 'error');
    }
  }, []);

  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

  // Sincronizar initialData cuando es edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        marca: initialData.marca || '',
        sku: initialData.sku || '',
        link: initialData.link || '',
        id_proveedor: initialData.id_proveedor || '',
        precio: initialData.precio || '0.00',
        precio_publico: initialData.precio_publico || '0.00',
        cantidad: initialData.cantidad || '',
        imagen: null, // La imagen no se precarga en el input file por seguridad
        estatus: initialData.estatus ?? 1,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? ((e.target as HTMLInputElement).checked ? 1 : 0) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, imagen: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.id_proveedor || !formData.marca) {
      return Swal.fire('Atención', 'Nombre, Marca y Proveedor son obligatorios', 'warning');
    }

    // Convertimos a FormData para manejar la imagen
    const dataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'precio' || key === 'precio_publico') {
          dataToSend.append(key, parseFloat(value as string).toFixed(2));
        } else {
          dataToSend.append(key, value as any);
        }
      }
    });

    if (isEditing) {
      onSubmit(dataToSend, initialData.id);
    } else {
      onSubmit(dataToSend);
    }
  };

  return (
    <div className="p-4 md:p-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Botón Volver Móvil */}
      <button
        type="button"
        onClick={onBack}
        className="md:hidden flex items-center gap-2 text-gray-600 mb-4 hover:text-[#FF7A00] transition-colors"
      >
        <ChevronLeft size={20} />
        <span className="font-medium">Volver</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 md:px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">
            {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h2>
          <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">
            {isEditing ? `ID: ${initialData?.id}` : 'Nuevo Registro'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Sección: Información General */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#FF7A00] mb-2 border-b border-orange-100 pb-2">
                <Tag size={18} />
                <h3 className="font-semibold text-gray-800 text-sm md:text-base">Información del Producto</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del Producto *</label>
                  <input name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] outline-none" placeholder="Ej. Monitor 4K" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Marca *</label>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="marca" value={formData.marca} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] outline-none" placeholder="Samsung" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU / Código</label>
                    <input name="sku" value={formData.sku} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] outline-none" placeholder="SKU-001" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Enlace Externo (URL)</label>
                  <div className="relative">
                    <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="link" type="url" value={formData.link} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] outline-none" placeholder="https://..." />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Proveedor *</label>
                    <select name="id_proveedor" value={formData.id_proveedor} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] outline-none bg-white">
                      <option value="">Seleccionar...</option>
                      {proveedores.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Inicial</label>
                    <div className="relative">
                      <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="cantidad" type="number" value={formData.cantidad} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] outline-none" placeholder="0" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                  <textarea name="descripcion" rows={3} value={formData.descripcion} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] outline-none resize-none" placeholder="Detalles técnicos..." />
                </div>
              </div>
            </div>

            {/* Sección: Precios */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 text-green-600 mb-2 border-b border-green-100 pb-2">
                <DollarSign size={18} />
                <h3 className="font-semibold text-gray-800 text-sm md:text-base">Control de Precios</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50/50 p-3 rounded-xl border border-green-100">
                  <label className="block text-xs font-bold text-green-700 mb-1 uppercase">Precio Venta (Público) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 font-bold">$</span>
                    <input name="precio_publico" type="number" step="0.01" value={formData.precio_publico} onChange={handleChange} required className="w-full pl-7 pr-3 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Precio Costo</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input name="precio" type="number" step="0.01" value={formData.precio} onChange={handleChange} className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7A00] outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lateral: Imagen y Estado */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <UploadCloud size={16} /> Multimedia
              </h3>
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 block cursor-pointer hover:bg-white hover:border-[#FF7A00] transition-all text-center group">
                <UploadCloud size={24} className="mx-auto text-gray-400 group-hover:text-[#FF7A00] mb-2" />
                <span className="text-xs font-medium text-gray-500 group-hover:text-[#FF7A00] block truncate">
                  {formData.imagen ? formData.imagen.name : "Subir imagen"}
                </span>
                <input type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>

            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-bold text-blue-800">Producto Activo</span>
                <input 
                  type="checkbox" 
                  name="estatus" 
                  checked={formData.estatus === 1} 
                  onChange={handleChange} 
                  className="w-5 h-5 accent-[#FF7A00] cursor-pointer" 
                />
              </label>
            </div>
          </div>

          {/* Botones de acción Footer */}
          <div className="lg:col-span-3 px-4 md:px-0 py-4 mt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-black text-white font-medium hover:bg-[#FF7A00] transition-colors shadow-sm disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Guardando...' : isEditing ? 'Actualizar Producto' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}