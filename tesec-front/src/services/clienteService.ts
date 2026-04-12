import { apiFetch } from "./api";

const endpoint = '/clientes';

interface createClientData {
  nombre:    string,
  apellidos: string,
  email:     string,
  telefono:  string,
  estatus:   boolean, 
};

interface updateClientData{
  nombre?:    string,
  apellidos?: string,
  email?:     string,
  telefono?:  string,
  estatus?:   boolean|number, 
};


export const clienteService = {
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
    async crear(formData: createClientData){
        const data = await apiFetch(`${endpoint}`, {method: 'POST', body: JSON.stringify(formData)});
        return data;
    },
    async editar(id: number, formData: updateClientData){
        const data = await apiFetch(`${endpoint}/${id}`, {method: 'PUT', body: JSON.stringify(formData)});
        return data;
    },
    async eliminar(id: number){
        const data = await apiFetch(`${endpoint}/${id}`, {method: 'DELETE'});
        return data;
    }
};