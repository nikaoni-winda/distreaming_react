import api from '../config/api';

const reviewService = {
    // Get all reviews with pagination
    getAllReviews: async (params) => {
        const response = await api.get('/reviews', { params });
        return response.data;
    },

    // Delete a review
    deleteReview: async (reviewId) => {
        const response = await api.delete(`/reviews/${reviewId}`);
        return response.data;
    }
};

export default reviewService;
