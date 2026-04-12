import { apiFetch } from "./api";

const endpoint = '/cotizaciones';

enum CotizacionEstatus {
    'CANCELADO'  = 0,
    'EN_PROCESO' = 1,
    'FINALIZADO' = 2
};

interface CotizacionData {
    'titulo'?: string,
    'id_cliente': number,
    'productos': Array<any>
};

export const cotizacionService = {
    async obtener(params: { page?: number; per_page?: number; busqueda?: string } = { page: 1, per_page: 10 }) {
        const data = await apiFetch(`${endpoint}?page=${params.page}&per_page=${params.per_page}${params.busqueda ? `&busqueda=${params.busqueda}` : ''}`, {
            method: 'GET'
        });
        console.log(data)
        return data;
    },
    async obtenerId(id: number){

        const data = await apiFetch(`${endpoint}/${id}`, {
            method: 'GET'
        });

        console.log(data);
        return data;
    },
    async crear(request: CotizacionData) {
        const data = await apiFetch(`${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(request)
        });
        return data;
    },
    async editar(id: number, request: CotizacionData){
        const data = await apiFetch(`${endpoint}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(request)
        });

        return data;
    },
    async cambiarEstatus(id: number, estatus: CotizacionEstatus) {
        const data = await apiFetch(`${endpoint}/editar-estatus/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({'estatus': estatus})
        });

        return data;
    }
};