import axios from 'axios';

const API_BASE_URL = 'https://distreamingapi-production.up.railway.app/api';
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor - Attach token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized - Token invalid/expired
        if (error.response?.status === 401) {
            // Clear local storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');

            // Redirect to login (akan di-handle di component)
            window.dispatchEvent(new Event('unauthorized'));
        }

        return Promise.reject(error);
    }
);

export default api;
export { API_BASE_URL };
