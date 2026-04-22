"use client";
import React, { useCallback } from "react";
import UserForm from "@/components/users/UserForm";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { userService } from "@/services/userService";

interface createUserData {
  nombre: string;
  apellidos: string;
  email: string;
  perfil_id: number;
  estatus: boolean;
}
export default function NuevoUsuarioPage() {
  const router = useRouter();

  const onSubmit = useCallback(
    async (formData: createUserData) => {
      try {
        await userService.crear(formData);
        router.push("/usuarios");
      } catch (error: any) {
        console.error("Error al crear proveedor:", error);
        Swal.fire({
          title: "Error",
          text:
            error.message ||
            "No se pudo registrar el proveedor. Intente de nuevo.",
          icon: "error",
          confirmButtonColor: "#000000",
        });
      }
    },
    [router],
  );
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Alta de Personal</h1>
        <p className="text-gray-500">
          Completa el formulario para registrar un nuevo colaborador en TESEC.
        </p>
      </div>

      <UserForm onSubmit={onSubmit} isEditing={false} />
    </div>
  );
}
