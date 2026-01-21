import api from '../config/api';

const authService = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/register', userData);

        if (response.data.success) {
            const { access_token, user } = response.data.data;

            // Save token and user data to localStorage
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            return response.data;
        }

        throw new Error(response.data.message || 'Registration failed');
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/login', credentials);

        if (response.data.success) {
            const { access_token, user } = response.data.data;

            // Save token and user data to localStorage
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            return response.data;
        }

        throw new Error(response.data.message || 'Login failed');
    },

    // Logout user
    logout: async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
        }
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    },

    // Get token from localStorage
    getToken: () => {
        return localStorage.getItem('access_token');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },

    // Check if user is admin
    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user?.role === 'admin';
    },

    // Get all users (Admin only)
    getAllUsers: async (params) => {
        try {
            const response = await api.get('/users', { params });
            return {
                data: response.data.data || [],
                pagination: response.data.pagination
            };
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },
    // Get user by ID (Admin only or own profile)
    getUserById: async (id) => {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },

    // Update user
    updateUser: async (id, userData) => {
        try {
            const response = await api.put(`/users/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    // Delete user
    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },
};

export default authService;
