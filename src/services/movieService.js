import api from '../config/api';

/**
 * Movie Service - API calls for movies
 */

// Update existing movie
export const updateMovie = async (id, movieData) => {
    try {
        const response = await api.put(`/movies/${id}`, movieData);
        return response.data;
    } catch (error) {
        console.error('Error updating movie:', error);
        throw error;
    }
};

// Create new movie
export const createMovie = async (movieData) => {
    try {
        const response = await api.post('/movies', movieData);
        return response.data;
    } catch (error) {
        console.error('Error creating movie:', error);
        throw error;
    }
};

// Delete movie
export const deleteMovie = async (id) => {
    try {
        const response = await api.delete(`/movies/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting movie:', error);
        throw error;
    }
};

// Get all movies with optional filters
export const getMovies = async (params = {}) => {
    try {
        const response = await api.get('/movies', { params });
        // API returns: { success: true, data: [...], pagination: {...} }
        // Return full response so we can access both data and pagination
        return {
            data: response.data.data,
            pagination: response.data.pagination
        };
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

// Get trending movies (latest 10 by movie_id)
export const getTrendingMovies = async () => {
    try {
        const response = await api.get('/movies', {
            params: {
                sort: 'movie_id',
                order: 'desc',
                limit: 10
            }
        });
        // API returns: { success: true, data: [...], pagination: {...} }
        return response.data.data;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        throw error;
    }
};

// Get single movie by ID
export const getMovieById = async (id) => {
    try {
        const response = await api.get(`/movies/${id}`);
        // API returns: { success: true, data: {...} }
        return response.data.data;
    } catch (error) {
        console.error('Error fetching movie:', error);
        throw error;
    }
};



