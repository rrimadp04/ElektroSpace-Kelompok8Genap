import axios from 'axios';

const api = axios.create({
    // Pastikan URL ini sesuai dengan port Laravel Anda
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Accept': 'application/json',
    }
});

// Interceptor: Setiap request keluar, otomatis tempelkan Token jika ada
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;