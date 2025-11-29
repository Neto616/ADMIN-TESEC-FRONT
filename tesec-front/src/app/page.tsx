'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de validación 
    // Validación básica
    if (!formData.usuario.trim() || !formData.password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor ingrese usuario y contraseña.',
        confirmButtonColor: '#000000'
      });
      setIsLoading(false);
      return;
    }

    // Simulación de espera de red (1 segundo)
    setTimeout(() => {
      // ÉXITO 
      if (formData.password.length > 0) { // Cualquier contraseña funciona 
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });

        Toast.fire({
          icon: 'success',
          title: 'Bienvenido a TESEC'
        });

        // Redirección
        router.push('/estado-negocio');
      } else {
        // ERROR 
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      
      {/* Branding y Visual  */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative flex-col justify-between p-12 overflow-hidden">
        {/* Fondo abstracto decorativo */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF7A00] rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gray-800 rounded-full blur-[100px] opacity-30 translate-y-1/3 -translate-x-1/4"></div>
        
        {/* Contenido branding */}
        <div className="relative z-10 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
               <div className="w-full h-full relative overflow-hidden rounded">
                 <Image src="/logoT.jpg" alt="Logo" fill className="object-cover" /> 
               </div>
            </div>
            <span className="text-white text-xl font-bold tracking-wide">TESEC</span>
          </div>
          
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Gestión Empresarial <br />
            <span className="text-[#FF7A00]">Inteligente y Segura.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md">
            Plataforma administrativa exclusiva para personal autorizado. 
            Control total de pedidos, usuarios y métricas en tiempo real.
          </p>
        </div>

        <div className="relative z-10 text-xs text-gray-500">
          &copy; {new Date().getFullYear()} TESEC Enterprise. Todos los derechos reservados.
        </div>
      </div>

      {/* Formulario de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Header del Formulario */}
          <div className="text-center">
            <div className="lg:hidden mx-auto w-16 h-16 relative mb-4 rounded-full border border-gray-100 overflow-hidden">
               <Image src="/logoT.jpg" alt="Logo TESEC" fill className="object-cover" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
            <p className="mt-2 text-sm text-gray-500">
              Acceso restringido al sistema administrativo
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div className="space-y-5">
              
              {/* Input Usuario */}
              <div>
                <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="usuario"
                    name="usuario"
                    type="text"
                    required
                    autoComplete="username"
                    value={formData.usuario}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all sm:text-sm bg-gray-50 focus:bg-white"
                    placeholder="Ingrese su usuario"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:border-transparent transition-all sm:text-sm bg-gray-50 focus:bg-white"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Aviso de seguridad */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-orange-50 p-3 rounded-md border border-orange-100">
               <ShieldCheck size={16} className="text-[#FF7A00]" />
               <span>Sitio seguro. Sus acciones están siendo monitoreadas.</span>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-[#FF7A00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7A00] transition-all duration-300 ${
                isLoading ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
                )}
              </span>
              {isLoading ? 'Accediendo...' : 'Ingresar al Sistema'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}