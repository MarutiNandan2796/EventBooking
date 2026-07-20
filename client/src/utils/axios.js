import axios from 'axios';

const getBaseURL = () => {
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }
    // In production build or non-localhost browser, use relative path '/api'
    if (import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost')) {
        return '/api';
    }
    return 'http://localhost:5000/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
