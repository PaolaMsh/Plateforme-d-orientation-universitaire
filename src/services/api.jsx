import axios from 'axios';


const API_BASE_URL = 'http://10.48.73.80:3000/api/v1'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Impossible de se connecter au backend');
      console.error('   Vérifie que :');
      console.error('   1. Le backend est démarré');
      console.error('   2. Les deux PCs sont sur le même réseau');
      console.error('   3. L\'IP est correcte');
    }
    return Promise.reject(error);
  }
);

export default api;