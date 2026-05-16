import axios from 'axios';
import { BASE_URL, TIMEOUT, API_ENDPOINTS } from '../config/apiConfig';

// Extrair apenas endpoints utilizados no service
const { AUTH } = API_ENDPOINTS;

// Criar instância do Axios com configuração base
const api = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Um interceptador é uma função que é executada antes de uma requisição ser enviada ou antes de uma resposta ser processada.
// Ele pode ser usado para modificar a requisição ou resposta, adicionar headers, lidar com erros, etc.

// Interceptor de request para adicionar token nas requisições
// Executado antes de cada requisição ser enviada
api.interceptors.request.use(
    (config) => {
        // Capturar o token da sessão
        const token = sessionStorage.getItem('access_token');
        if (token) {
            // Adiciona o token ao cabeçalho da requisição
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de response para refresh automático de token
// Executado após cada requisição
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Capturar a requisição original
        const originalRequest = error.config;
        
        // Se o erro for 401 e não for uma tentativa de refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Capturar o refresh token da sessão
                const refreshToken = sessionStorage.getItem('refresh_token');
                
                if (refreshToken) {
                    // Fazer requisição na api para refresh token
                    const response = await api.post(AUTH.REFRESH, {
                        refresh_token: refreshToken,
                    });
                    
                    // Extrair os dados da resposta
                    const { access_token, refresh_token, token_type, expires_in, refresh_expires_in } = response.data;
                    
                    // Atualizar os dados do token na sessão
                    sessionStorage.setItem('access_token', access_token);
                    sessionStorage.setItem('refresh_token', refresh_token);
                    sessionStorage.setItem('token_type', token_type);
                    sessionStorage.setItem('expires_in', expires_in);
                    sessionStorage.setItem('refresh_expires_in', refresh_expires_in);
                    sessionStorage.setItem('loginRealizado', 'true');
                    
                    // Calcular novo tempo de expiração
                    const now = new Date().getTime();
                    const expiresAt = now + (expires_in * 1000);
                    const refreshExpiresAt = now + (refresh_expires_in * 1000);
                    
                    sessionStorage.setItem('expires_at', expiresAt);
                    sessionStorage.setItem('refresh_expires_at', refreshExpiresAt);
                    
                    // Refazer a requisição original com novo token
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Se o refresh falhar, limpar sessão e redirecionar para login
                sessionStorage.clear();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        } else {
            // Códigos de erro da API, diferente de 401: 400, 403, 404, 500 - // Capturar mensagem de erro da API (detail)
            const errorMessage = error.response?.data?.detail || error.message || 'Erro desconhecido';
            //console.log("Erro da API:", errorMessage); //console.log("Status:", error.response?.status); //console.log("Data:", error.response?.data);
            
            // Adicionar a mensagem de erro ao objeto error para uso posterior
            error.apiMessage = errorMessage;
        }
        
        return Promise.reject(error);
    }
);

// Serviços genéricos da API
export const apiService = {
    // Get request
    get: async (URL, config = {}) => {
        return api.get(URL, config);
    },
    
    // Post request
    post: async (URL, data, config = {}) => {
        return api.post(URL, data, config);
    },

    // Put request
    put: async (URL, data, config = {}) => {
        return api.put(URL, data, config);
    },

    // Delete request
    delete: async (URL, config = {}) => {
        return api.delete(URL, config);
    },
};

export default api;