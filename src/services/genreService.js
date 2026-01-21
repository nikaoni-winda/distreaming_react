import api from '../config/api';

export const getGenres = async (params) => {
    try {
        const response = await api.get('/genres', { params });
        // Return full response structure if needed for pagination, or normalize it
        // The component expects { data: [], pagination: {} } if we want to support full server-side pagination
        return {
            data: response.data.data || [],
            pagination: response.data.pagination
        };
    } catch (error) {
        console.error('getGenres error:', error);
        throw error;
    }
};

// Get single genre by ID (includes movies)
export const getGenreById = async (id) => {
    const response = await api.get(`/genres/${id}`);
    return response.data.data;
};

// Create new genre
export const createGenre = async (genreData) => {
    const response = await api.post('/genres', genreData);
    return response.data.data;
};

// Update genre
export const updateGenre = async (id, genreData) => {
    const response = await api.put(`/genres/${id}`, genreData);
    return response.data.data;
};

// Delete genre
export const deleteGenre = async (id) => {
    const response = await api.delete(`/genres/${id}`);
    return response.data;
};

// Add movie to genre
export const addMovieToGenre = async (genreId, movieId) => {
    // API expects: POST /movies/{movieId}/genres, body: { genre_ids: [genreId] }
    const response = await api.post(`/movies/${movieId}/genres`, {
        genre_ids: [parseInt(genreId)]
    });
    return response.data;
};

// Remove movie from genre
export const removeMovieFromGenre = async (genreId, movieId) => {
    // API expects: DELETE /movies/{movieId}/genres, body: { genre_ids: [genreId] }
    // For axios DELETE with body, we must use the 'data' config option
    const response = await api.delete(`/movies/${movieId}/genres`, {
        data: { genre_ids: [parseInt(genreId)] }
    });
    return response.data;
};
