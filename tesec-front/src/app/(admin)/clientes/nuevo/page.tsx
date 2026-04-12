'use client';
import React, { useCallback } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import ClienteForm from '@/components/clientes/ClienteForm';
import { clienteService } from '@/services/clienteService';

interface createUserData {
  nombre: string,
  apellidos: string,
  email: string,
  perfil_id: number,
  telefono: string,
  estatus: boolean, 
}
export default function NuevoClientePage() {
  const router = useRouter();

  const onSubmit = useCallback(async (formData: createUserData) => {
    try {
      await clienteService.crear(formData);
      router.push('/clientes');
    } catch (error: any) {
      console.error('Error al crear proveedor:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo registrar el proveedor. Intente de nuevo.',
        icon: 'error',
        confirmButtonColor: '#000000'
      });
    }
  }, [router]);
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alta de clientes</h1>
        <p className="text-gray-500">Complete el formulario para registrar un nuevo cliente en TESEC.</p>
      </div>
      
      <ClienteForm onSubmit={onSubmit} isEditing={false}/>
    </div>
  );
}