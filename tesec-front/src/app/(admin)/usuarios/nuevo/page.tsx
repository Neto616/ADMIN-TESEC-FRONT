import React from 'react';
import UserForm from '@/components/users/UserForm';

export default function NuevoUsuarioPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alta de Personal</h1>
        <p className="text-gray-500">Complete el formulario para registrar un nuevo colaborador en TESEC.</p>
      </div>
      
      <UserForm />
    </div>
  );
}