const BASE_URL: string = 'http://127.0.0.1:8000/api';

export const apiFetch = async (endpoint: string, options:RequestInit = {}) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        'Accept': 'application/json',
        ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    } as Record<string, string>;

    if(token)
        headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers
    })

    if(!response.ok){
        const errData = await response.json().catch(() => ({}));
        console.log(errData);
        throw { status: response, ...errData};
    }

    return response.json();
};