import React from 'react';
import UserForm from '@/components/users/UserForm';

const mockUserData = {
  id: 1,
  nombre: 'Carlos',
  apellidos: 'Gomez',
  whatsapp: '5544332211',
  email: 'carlos@tesec.com',
  rol: 'Admin',
  activo: true
};

// Definir params como una Promesa
interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Hacer el componente 'async'
export default async function EditarUsuarioPage({ params }: EditPageProps) {
  
  // Desempaquetar el ID esperando la promesa
  const { id } = await params;
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Actualizar Usuario</h1>
        <p className="text-gray-500">
          Edición de permisos y datos para el ID: <span className="font-mono font-bold text-black">{id}</span>
        </p>
      </div>
      
      {/* Pasamos los datos iniciales y el flag de edición */}
      <UserForm initialData={mockUserData} isEditing={true} />
    </div>
  );
}