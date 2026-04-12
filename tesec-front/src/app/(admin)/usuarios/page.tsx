'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Key, 
  MoreVertical, 
  CheckCircle, 
  XCircle,
  Mail,
  User
} from 'lucide-react';
import Swal from 'sweetalert2';
import { userService } from '@/services/userService';
import { Pagination } from '@/components/layout/Paginador';

interface Usuario {
  id:        number,
  nombre:    string,
  apellidos: string,
  email:     string,
  perfil_id: number,
  estatus:   number
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const itemsPerPage = 10;

  const userFetch = useCallback(async (page: number) => {
    try {
      const response = await userService.obtener({page, per_page: itemsPerPage});
      setUsuarios(response.response.data);
      setCurrentPage(response.response.current_page);
      setLastPage(response.response.last_page);
      setTotalRecords(response.response.total);
    } catch (error) {}
  }, []);

  useEffect(() => {
    userFetch(currentPage)
  }, [userFetch, currentPage]);

  const getPassword = useCallback(async (id: number) => {
    try {
      const response = await userService.obtenerContrasena(id);
      console.log(response);
      return response.response.new_password; 
    } catch (error) {
      throw new Error('No se pudo recuperar la contraseña');
    }
    },
   []);

  const handleSendPassword = async (nombre: string, id: number) => {
    try {
      const userData = await getPassword(id);
      const Toast = Swal.mixin({
        toast: true,
        position: 'center',
        showConfirmButton: true,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#000000',
        customClass: {
          actions: 'flex justify-center w-full', 
          confirmButton: 'px-8' 
        }
      });
      Toast.fire({
        icon: 'success',
        title: `Contraseña de ${nombre}: ${userData}`
      });
      setOpenMenuId(null); 
    } catch (error: any) {
      console.error('Error al crear proveedor:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudo obtener la contraseña del usuario. Intente de nuevo.',
        icon: 'error',
        confirmButtonColor: '#000000'
      });
    }
  };

  const handleDelete = (nombre: string, id: number) => {
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Se eliminará a "${nombre}" y no podrás revertir esta acción.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#000000',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      preConfirm: async () => {
        try{
          await userService.eliminar(id);
          return await userFetch(currentPage);
        }catch(error: any){
          Swal.showValidationMessage(`Error: ${error.message || 'No se pudo eliminar'}`);
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminado',
          text: 'El usuario ha sido eliminado correctamente.',
          icon: 'success',
          confirmButtonColor: '#000000'
        });
      }
    });
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Usuarios del Sistema</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Gestiona accesos, roles y permisos del personal.</p>
        </div>
        <Link 
          href="/usuarios/nuevo"
          className="flex items-center justify-center gap-2 bg-black text-white px-5 py-3 md:py-2.5 rounded-lg hover:bg-[#FF7A00] transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full md:w-auto"
        >
          <Plus size={20} />
          <span>Nuevo Usuario</span>
        </Link>
      </div>

      {/* SEARCH BAR */}
      {/* <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 md:py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-[#FF7A00] transition-colors text-sm"
          />
        </div>
      </div> */}

      {/* VISTA DESKTOP - Tabla */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
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
              {usuarios.map((user) => (
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
                      {user.perfil_id == 1 ? 'Administrador' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      {user.estatus === 1 ? (
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
                        onClick={() => handleSendPassword(user.nombre, user.id)}
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
                        onClick={() => handleDelete(user.nombre, user.id)}
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
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          totalRecords={totalRecords}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* VISTA MÓVIL - Cards */}
      <div className="md:hidden space-y-3">
        {usuarios.length > 0 ? (
          usuarios.map((user) => (
            <div 
              key={user.id} 
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-[#FF7A00] font-bold text-lg border-2 border-orange-200 flex-shrink-0">
                    {user.nombre.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base truncate">{user.nombre}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <Mail size={12} />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>

                {/* Menú de tres puntos */}
                <div className="relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Menú de opciones"
                    title="Más opciones"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === user.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        <button
                          onClick={() => handleSendPassword(user.nombre, user.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 transition-colors text-left"
                        >
                          <Key size={16} className="text-yellow-600" />
                          <span>Enviar Contraseña</span>
                        </button>
                        <Link
                          href={`/usuarios/editar/${user.id}`}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                          onClick={() => setOpenMenuId(null)}
                        >
                          <Edit3 size={16} className="text-blue-600" />
                          <span>Editar Usuario</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(user.nombre, user.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
                        >
                          <Trash2 size={16} />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Info del usuario */}
              <div className="px-4 pb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium text-gray-700 border border-gray-200">
                    {user.perfil_id == 1 ? 'Administrador' : ''}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-1.5">
                  {user.estatus === 1 ? (
                    <>
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-sm text-green-700 font-medium">Activo</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-500 font-medium">Inactivo</span>
                    </>
                  )}
                </div>
              </div>

              {/* Botones de acción rápida */}
              <div className="border-t border-gray-100 px-4 py-3 flex gap-2">
                <Link 
                  href={`/usuarios/editar/${user.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-sm shadow-sm"
                >
                  <Edit3 size={16} />
                  Editar
                </Link>
                <button 
                  onClick={() => handleSendPassword(user.nombre, user.id)}
                  className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-yellow-50 text-gray-700 hover:text-yellow-700 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm border border-gray-200"
                  aria-label="Enviar contraseña"
                  title="Enviar contraseña por correo"
                >
                  <Key size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <Search size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No se encontraron usuarios</p>
          </div>
        )}
      </div>
    </div>
  );
}