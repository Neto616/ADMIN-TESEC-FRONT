'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productoService } from '@/services/productoService';
import Swal from 'sweetalert2';
import ProductoForm from '@/components/productos/productoForm';

export default function NuevoProductoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCrear = async (data: FormData) => {
    setLoading(true);
    try {
      await productoService.crear(data);
      
      await Swal.fire({
        icon: 'success',
        title: 'Producto Creado',
        text: 'El registro se guardó correctamente.',
        confirmButtonColor: '#FF7A00',
      });
      
      router.push('/productos');
    } catch (error: any) {
      const validationErrors = error.response?.data?.errors;
      Swal.fire({
        title: 'Error',
        text: validationErrors ? Object.values(validationErrors).flat()[0] as string : 'No se pudo registrar el producto',
        icon: 'error',
        confirmButtonColor: '#000000'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-transparent py-6">
      <div className="max-w-5xl mx-auto px-4">
        <ProductoForm 
          onSubmit={handleCrear} 
          onBack={() => router.push('/productos')}
          loading={loading}
        />
      </div>
    </div>
  );
}