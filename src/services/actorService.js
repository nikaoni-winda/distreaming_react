import api from '../config/api';

// Get all actors (paginated)
export const getActors = async (params) => {
    try {
        const response = await api.get('/actors', { params });
        return {
            data: response.data.data || [],
            pagination: response.data.pagination
        };
    } catch (error) {
        console.error('getActors error:', error);
        throw error;
    }
};

// Get single actor by ID (includes movies)
export const getActorById = async (id) => {
    try {
        const response = await api.get(`/actors/${id}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Create new actor
export const createActor = async (actorData) => {
    try {
        const response = await api.post('/actors', actorData);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Update actor
export const updateActor = async (id, actorData) => {
    try {
        const response = await api.put(`/actors/${id}`, actorData);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

// Delete actor
export const deleteActor = async (id) => {
    try {
        const response = await api.delete(`/actors/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add movie to actor (Relation)
export const addMovieToActor = async (actorId, movieId) => {
    try {
        // API expects: POST /movies/{movieId}/actors, body: { actor_ids: [actorId] }
        const response = await api.post(`/movies/${movieId}/actors`, {
            actor_ids: [parseInt(actorId)]
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Remove movie from actor (Relation)
export const removeMovieFromActor = async (actorId, movieId) => {
    try {
        // API expects: DELETE /movies/{movieId}/actors, body: { actor_ids: [actorId] }
        const response = await api.delete(`/movies/${movieId}/actors`, {
            data: { actor_ids: [parseInt(actorId)] }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
