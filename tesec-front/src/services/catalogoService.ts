import { apiFetch } from "./api"

const endpoint = '/catalogos';

export const catalogoService = {
    async getPerfiles () {
        const data = await apiFetch(`${endpoint}/perfiles`, {method: 'GET'});
        return data;
    },
    async getProveedores () {
        const data = await apiFetch(`${endpoint}/proveedores`, {method: 'GET'});
        return data;
    },
    async getClientes () {
        const data = await apiFetch(`${endpoint}/clientes`, {method: 'GET'});
        return data;
    }
};