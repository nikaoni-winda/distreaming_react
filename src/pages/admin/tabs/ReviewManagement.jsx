import React, { useState, useEffect } from 'react';
import { FaStar, FaTrash } from 'react-icons/fa';
import reviewService from '../../../services/reviewService';
import Pagination from '../../../components/common/Pagination';
import { useToast } from '../../../contexts/ToastContext';
import ConfirmModal from '../../../components/common/ConfirmModal';

const ReviewManagement = ({ t }) => {
    const { showToast } = useToast();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDestructive: false
    });

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewService.getAllReviews({ page, per_page: 10 });
            setReviews(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error(error);
            showToast('Error fetching reviews', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDelete = (id) => {
        setConfirmModal({
            isOpen: true,
            title: t('admin.deleteReview') || 'Delete Review',
            message: t('admin.deleteReviewConfirm') || 'Are you sure you want to delete this review?',
            isDestructive: true,
            onConfirm: async () => {
                try {
                    await reviewService.deleteReview(id);
                    // Optimistic update or refresh
                    setReviews(prev => prev.filter(r => r.review_id !== id));
                    showToast(t('admin.deleteReviewSuccess') || 'Review deleted successfully', 'success');
                    // Check if we need to refetch to handle pagination properly
                    if (reviews.length === 1 && page > 1) {
                        setPage(prev => prev - 1);
                    } else {
                        // Optional: fetchReviews() if strict consistency needed
                    }
                } catch (error) {
                    console.error('Error deleting review:', error);
                    showToast('Failed to delete review', 'error');
                }
            }
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">{t('admin.reviewsManagement')}</h2>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
                </div>
            ) : (
                <>
                    <div className="bg-netflix-darkGray rounded-lg border border-gray-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-900 border-b border-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('admin.movies')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('common.user')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('admin.ratingLabel')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('admin.reviewedOn')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {reviews.map((review) => (
                                        <tr key={review.review_id} className="hover:bg-gray-800 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">{review.movie?.movie_title || 'Unknown'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{review.user?.user_nickname || 'Unknown'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center text-yellow-500 font-bold gap-1">
                                                    <FaStar /> {review.rating}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDate(review.review_date)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button
                                                    onClick={() => handleDelete(review.review_id)}
                                                    className="text-gray-500 hover:text-red-500 transition p-2"
                                                    title={t('admin.deleteReview') || 'Delete'}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {reviews.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No reviews found.
                            </div>
                        )}
                    </div>

                    {pagination && pagination.total_pages > 1 && (
                        <div className="mt-4">
                            <Pagination
                                pagination={pagination}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                isDestructive={confirmModal.isDestructive}
            />
        </div>
    );
};

export default ReviewManagement;
