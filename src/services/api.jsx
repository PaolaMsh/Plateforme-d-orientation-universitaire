// src/services/api.js
import axios from 'axios';

// ✅ Correction pour Vite - utiliser import.meta.env au lieu de process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

console.log('🔗 API URL:', API_URL); // Pour déboguer

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
    (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        console.log('📦 Données:', config.data);

        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
    (response) => {
        console.log('✅ Réponse reçue:', response.status);
        return response;
    },
    async (error) => {
        console.error('❌ Erreur API:', error.message);

        if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
            console.error("⚠️ Le serveur backend n'est pas accessible.");
            console.error('🔗 URL utilisée:', API_URL);
        }

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            (error.response?.data?.message?.includes('expired') ||
                error.response?.data?.message?.includes('Invalid token'))
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const newToken = response.data.accessToken;
                const newRefreshToken = response.data.refreshToken;
                localStorage.setItem('token', newToken);
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
