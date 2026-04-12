import { apiFetch } from "./api";

const endpoint = '/usuarios';

interface createUserData {
  nombre: string,
  apellidos: string,
  email: string,
  perfil_id: number,
  estatus: boolean, 
};

interface updateUserData{
  nombre?:    string,
  apellidos?: string,
  email?:     string,
  perfil_id?: number,
  estatus?:   boolean|number, 
};

export const userService = {
    async obtener(params: { page?: number; per_page?: number } = { page: 1, per_page: 10 }) {
        const data = await apiFetch(`${endpoint}?page=${params.page}&per_page=${params.per_page}`, {
            method: 'GET'
        });
        return data;
    },
    async obtenerPorId(id: number){
        const data  = await apiFetch(`${endpoint}/${id}`, {method: 'GET'});
        return data;
    },
    async crear(formData: createUserData){
        const data = await apiFetch(`${endpoint}`, {method: 'POST', body: JSON.stringify(formData)});
        return data;
    },
    async obtenerContrasena(id: number) {
        const data = await apiFetch(`${endpoint}/${id}`, {method: 'PATCH'});
        return data;    
    },
    async editar(id: number, formData: updateUserData){
        const data = await apiFetch(`${endpoint}/${id}`, {method: 'PUT', body: JSON.stringify(formData)});
        return data;
    },
    async eliminar(id: number){
        const data = await apiFetch(`${endpoint}/${id}`, {method: 'DELETE'});
        return data;
    }
};