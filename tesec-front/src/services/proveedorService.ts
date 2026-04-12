import { apiFetch } from "./api";

export const proveedorService = {
    async obtener(params: { page?: number; per_page?: number } = { page: 1, per_page: 10 }) {
        const data = await apiFetch(`/proveedores?page=${params.page}&per_page=${params.per_page}`, {
            method: 'GET'
        });
        return data;
    },
    async crear(formData: FormData){
        const data = await apiFetch('/proveedores', {method: 'POST', body: formData});
        return data;
    },
    async obtenerPorId(id:number){
        const data = await apiFetch(`/proveedores/${id}`, {method: 'GET'});
        return data;
    },
    async editar(id:number, formData: FormData){
        const data = await apiFetch(`/proveedores/${id}`, {method: 'POST', body: formData});
        return data;
    },
    async eliminar(id:number){
        const data = await apiFetch(`/proveedores/${id}`, {method: 'DELETE'});
        return data;
    }
};


