import axios from 'axios';

const API = axios.create({
    baseURL: 'https://web-production-191b6.up.railway.app/api',
    
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;