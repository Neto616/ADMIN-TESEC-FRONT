import { apiFetch } from "./api";

const endpoint = '/productos';

export const productoService = {
    async obtener(params: {page: number, per_page:number, device_name?: string, buscar?:string}){
        const data = await apiFetch(`${endpoint}?page=${params.page}&per_page=${params.per_page}${params.buscar ? '&busqueda='+params.buscar : ''}`,
            {method: 'GET'}
        );
        console.log(data)
        return data;
    },
    async obtenerId(id: number){
        const data = await apiFetch(`${endpoint}/${id}`, {method: 'GET'});
        return data;
    },
    async crear(formData: FormData){
        const data = await apiFetch(`${endpoint}`, {method: 'POST', body: formData});
        return data;
    },
    async editar(id: number, formData: FormData){
        const data = await apiFetch(`${endpoint}/${id}`, {method: 'POST', body: formData});
        return data;
    },
    async eliminar(id: number){
        const data = await apiFetch(`${endpoint}/${id}`, {method: 'DELETE'});
        return data;
    }
};