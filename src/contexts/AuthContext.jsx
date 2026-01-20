import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = () => {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
            setLoading(false);
        };

        initAuth();

        // Listen for unauthorized events (from axios interceptor)
        const handleUnauthorized = () => {
            setUser(null);
        };

        window.addEventListener('unauthorized', handleUnauthorized);

        return () => {
            window.removeEventListener('unauthorized', handleUnauthorized);
        };
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            const userData = response.data.user;
            setUser(userData);
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            const newUser = response.data.user;
            setUser(newUser);
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local state even if API call fails
            setUser(null);
        }
    };

    // Update user profile
    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
        // Update localStorage as well
        localStorage.setItem('user', JSON.stringify(updatedUserData));
    };

    // Check if user is admin
    const isAdmin = () => {
        return user?.role === 'admin';
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!user;
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAdmin,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
