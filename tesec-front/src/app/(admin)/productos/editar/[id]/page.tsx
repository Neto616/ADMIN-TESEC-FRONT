'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { productoService } from '@/services/productoService';
import Swal from 'sweetalert2';
import ProductoForm from '@/components/productos/productoForm';

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [producto, setProducto] = useState<any>(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Cargar datos del producto al iniciar
  const fetchProducto = useCallback(async () => {
    try {
      setLoadingFetch(true);
      const res = await productoService.obtenerId(Number(id));
      setProducto(res.response); // Ajusta según la estructura de tu respuesta
    } catch (error: any) {
      Swal.fire('Error', 'No se pudo obtener la información del producto', 'error');
      router.push('/productos');
    } finally {
      setLoadingFetch(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) fetchProducto();
  }, [fetchProducto, id]);

  const handleActualizar = async (data: FormData, productoId: number) => {
    setLoadingSubmit(true);
    try {
      await productoService.editar(productoId, data);

      await Swal.fire({
        icon: 'success',
        title: 'Producto Actualizado',
        text: 'Los cambios han sido guardados.',
        confirmButtonColor: '#FF7A00',
      });

      router.push('/productos');
    } catch (error: any) {
      const validationErrors = error.response?.data?.errors;
      Swal.fire({
        title: 'Error',
        text: validationErrors ? Object.values(validationErrors).flat()[0] as string : 'Error al actualizar',
        icon: 'error',
        confirmButtonColor: '#000000'
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingFetch) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7A00]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-transparent py-6">
      <div className="max-w-5xl mx-auto px-4">
        <ProductoForm 
          isEditing={true}
          initialData={producto}
          onSubmit={handleActualizar} 
          onBack={() => router.push('/productos')}
          loading={loadingSubmit}
        />
      </div>
    </div>
  );
}