import { apiFetch } from "./api";

export const authService = {
    async login(credencial: { email: string; password: string; device_name?: string }){
        const data = await apiFetch('/iniciar_sesion', { 
            method: 'POST',
            body: JSON.stringify({
                ...credencial,
                device_name: credencial.device_name || 'web_front'
            })
         });
         if(data.response.token){
            localStorage.setItem('token', data.response.token);
            localStorage.setItem('user_name', data.response.nombre);
        }
        return data;
    },
    async logout(){
        await apiFetch('/cerrar_sesion', { method: 'POST' });
        localStorage.removeItem('token');
    }
};