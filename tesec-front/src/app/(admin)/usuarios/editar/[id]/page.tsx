'use client';
import React, { useEffect, useCallback, useState, use } from 'react';
import UserForm from '@/components/users/UserForm';
import { userService } from '@/services/userService';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { clienteService } from '@/services/clienteService';

interface UserData {
  nombre:    string,
  apellidos: string,
  email:     string,
  password?: string,
  perfil_id: number,
  estatus:   boolean|number
}

// Definir params como una Promesa
interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface updateUserData{
  nombre?:    string,
  apellidos?: string,
  email?:     string,
  perfil_id?: number,
  estatus?:   boolean|number, 
}

export default function EditarUsuarioPage({ params }: EditPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id
  const [initialData, setInitialData] = useState<UserData | null>();

  const getData = useCallback(async (id: number) => {
    try {
      const userData = await userService.obtenerPorId(id);
      console.log(userData)
      setInitialData(userData.response);
    } catch (error: any) {
      console.error('Error al obtener los datos del usuario:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo obtener la información del usuario. Intente de nuevo.',
        icon: 'error',
        confirmButtonColor: '#000000'
      });
    }
  }, []);

  const onSubmit = useCallback(async (formData: updateUserData, id: number) => {
    try {
      await userService.editar(id, formData);
      router.push('/usuarios');
    } catch (error: any) {
      console.error('Error al actualizar el proveedor:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo actualizar la información del usuario. Intente de nuevo.',
        icon: 'error',
        confirmButtonColor: '#000000'
      });
    }
  }, []);

  useEffect(()=>{
    getData(Number(id));
  }, [getData])
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Actualizar Usuario</h1>
        <p className="text-gray-500">
          Edición de permisos y datos para el ID: <span className="font-mono font-bold text-black">{id}</span>
        </p>
      </div>
      
      {/* Pasamos los datos iniciales y el flag de edición */}
      <UserForm initialData={initialData} isEditing={true} onSubmit={onSubmit}/>
    </div>
  );
}