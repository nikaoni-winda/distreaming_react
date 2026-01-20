import api from '../config/api';

/**
 * Watch History Service
 * Handles fetching user's watch history
 */

// Get user's watch history
export const getWatchHistory = async () => {
    try {
        const response = await api.get('/watch-history');
        // API returns: { success: true, data: [...] }
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching watch history:', error);
        return []; // Return empty array on error
    }
};

// Add movie to watch history
export const addToWatchHistory = async (userId, movieId) => {
    try {
        const response = await api.post('/watch-history', {
            user_id: userId,
            movie_id: movieId
        });
        return response.data;
    } catch (error) {
        console.error('Error adding to watch history:', error);
        throw error;
    }
};

export default {
    getWatchHistory,
    addToWatchHistory,
};
