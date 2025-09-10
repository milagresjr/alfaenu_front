import axios from 'axios';
import Cookies from 'js-cookie';

const urlBase = "http://127.0.0.1:8000/api/";
//const urlBaseProd = 'https://app.alfaenu.com/api/';

export const api = axios.create(
    {
        baseURL: urlBase,
        headers: {
            "Content-Type": "application/json"
        }
    }
);

// Interceptor para adicionar token de autenticação, se necessário
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token'); // cookies.getItem('token'); // localStorage.getItem('token'); // Substitua pela lógica de obtenção do token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

