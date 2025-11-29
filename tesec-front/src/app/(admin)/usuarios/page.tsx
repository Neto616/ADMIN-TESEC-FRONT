'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Key, 
  MoreVertical, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import Swal from 'sweetalert2';

// ejem
const usersData = [
  { id: 1, nombre: 'Carlos Gomez', email: 'carlos@tesec.com', rol: 'Admin', status: 'Activo', fecha: '20/11/2025' },
  { id: 2, nombre: 'Ana Martinez', email: 'ana@tesec.com', rol: 'Vendedor', status: 'Activo', fecha: '18/11/2025' },
  { id: 3, nombre: 'Roberto Diaz', email: 'roberto@tesec.com', rol: 'Almacén', status: 'Inactivo', fecha: '10/11/2025' },
];

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSendPassword = (nombre: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
    Toast.fire({
      icon: 'success',
      title: `Contraseña enviada a ${nombre}`
    });
  };

  const handleDelete = (nombre: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará al usuario "${nombre}" permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminado',
          text: 'El usuario ha sido dado de baja.',
          icon: 'success',
          confirmButtonColor: '#FF7A00'
        });
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios del Sistema</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona accesos, roles y permisos del personal.</p>
        </div>
        <Link 
          href="/usuarios/nuevo"
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-[#FF7A00] transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span>Nuevo Usuario</span>
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] transition-colors"
          />
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol / Permisos</th>
                <th className="px-6 py-4">Estatus</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usersData.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#FF7A00] font-bold border border-gray-200">
                        {user.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.nombre}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium border border-gray-200">
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      {user.status === 'Activo' ? (
                        <>
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-green-700 font-medium">Activo</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} className="text-gray-400" />
                          <span className="text-gray-500">Inactivo</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleSendPassword(user.nombre)}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Enviar Contraseña por Correo"
                      >
                        <Key size={18} />
                      </button>
                      
                      <Link 
                        href={`/usuarios/editar/${user.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar Usuario"
                      >
                        <Edit3 size={18} />
                      </Link>

                      <button 
                        onClick={() => handleDelete(user.nombre)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar Usuario"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}