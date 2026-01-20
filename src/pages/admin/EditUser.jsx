import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaSave, FaUser, FaHistory, FaStar, FaFilm, FaCalendarAlt, FaTrash } from 'react-icons/fa';
import AdminSidebar from '../../components/layout/AdminSidebar';
import authService from '../../services/authService';
import reviewService from '../../services/reviewService';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import { useToast } from '../../contexts/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';

function EditUser() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('history'); // 'history' or 'reviews'

    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        user_nickname: '',
        user_email: '',
    });

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDestructive: false
    });

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            const data = await authService.getUserById(id);
            setUser(data);
            setFormData({
                user_nickname: data.user_nickname,
                user_email: data.user_email,
                plan: data.plan || ''
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            showToast('Error fetching user details', 'error');
            navigate('/admin/dashboard?tab=users');
        } finally {
            setLoading(false);
        }
    }, [id, navigate, showToast]);

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id, fetchUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await authService.updateUser(id, formData);
            showToast(t('admin.saveSuccess') || 'User profile updated successfully', 'success');
        } catch (error) {
            console.error('Error updating user:', error);
            showToast('Failed to update user profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteReview = (reviewId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Review',
            message: t('admin.deleteReviewConfirm') || 'Are you sure you want to delete this review?',
            isDestructive: true,
            onConfirm: async () => {
                try {
                    await reviewService.deleteReview(reviewId);
                    showToast(t('admin.deleteReviewSuccess') || 'Review deleted successfully', 'success');
                    // Refresh user data to update the reviews list
                    fetchUser();
                } catch (error) {
                    console.error('Error deleting review:', error);
                    showToast('Failed to delete review', 'error');
                }
            }
        });
    };

    const handleDeleteUser = () => {
        setConfirmModal({
            isOpen: true,
            title: t('admin.deleteUser'),
            message: t('admin.deleteUserConfirm') || 'Are you sure you want to delete this user?',
            isDestructive: true,
            onConfirm: async () => {
                try {
                    await authService.deleteUser(id);
                    showToast('User deleted successfully', 'success');
                    navigate('/admin/dashboard?tab=users');
                } catch (error) {
                    console.error('Error deleting user:', error);
                    showToast('Failed to delete user', 'error');
                }
            }
        });
    };

    const handleSidebarNavigate = (tabId) => {
        navigate(`/admin/dashboard?tab=${tabId}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">{t('dashboard.loading')}</div>;
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row font-sans text-white">
            <AdminSidebar
                activeTab="users"
                isSidebarOpen={isSidebarOpen}
                onNavigate={handleSidebarNavigate}
            />

            <main className="flex-1 md:ml-64 p-6 md:p-8">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate('/admin/dashboard?tab=users')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                    >
                        <FaArrowLeft /> {t('common.back')}
                    </button>
                    <LanguageSwitcher />
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-16 w-16 rounded-full bg-netflix-red flex items-center justify-center text-3xl font-bold text-white">
                            <FaUser />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{user.user_nickname}</h1>
                            <p className="text-gray-400 text-sm mt-1 capitalize">{user.role}</p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column: User Profile Form */}
                        <div className="w-full lg:w-1/3 space-y-6">
                            <div className="bg-netflix-darkGray border border-gray-800 rounded-lg p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-400">{t('auth.nickname')}</label>
                                        <input
                                            type="text"
                                            name="user_nickname"
                                            value={formData.user_nickname}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-400">{t('common.email')}</label>
                                        <input
                                            type="email"
                                            name="user_email"
                                            value={formData.user_email}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-400">{t('common.plan')}</label>
                                        <select
                                            name="plan"
                                            value={formData.plan}
                                            onChange={handleChange}
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition capitalize"
                                        >
                                            <option value="">Select Plan</option>
                                            <option value="mobile">Ponsel (Mobile)</option>
                                            <option value="basic">Dasar (Basic)</option>
                                            <option value="standard">Standar (Standard)</option>
                                            <option value="premium">Premium</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full mt-4 px-4 py-2 bg-netflix-red text-white font-bold rounded hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <FaSave /> {saving ? 'Saving...' : t('admin.saveChanges')}
                                    </button>

                                    <div className="pt-4 border-t border-gray-800 mt-6">
                                        <button
                                            type="button"
                                            onClick={handleDeleteUser}
                                            className="w-full px-4 py-2 bg-black border border-red-800 text-red-500 font-bold rounded hover:bg-red-900/20 transition flex items-center justify-center gap-2"
                                        >
                                            <FaTrash /> {t('admin.deleteUser')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Column: Activity Tabs (History & Reviews) */}
                        <div className="w-full lg:w-2/3 space-y-6">
                            <div className="bg-netflix-darkGray border border-gray-800 rounded-lg overflow-hidden">
                                {/* Tab Headers */}
                                <div className="flex border-b border-gray-800">
                                    <button
                                        onClick={() => setActiveTab('history')}
                                        className={`flex-1 py-4 text-center font-medium transition ${activeTab === 'history' ? 'bg-gray-800 text-white border-b-2 border-netflix-red' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <FaHistory /> {t('admin.watchHistory')} ({user.watch_history?.length || 0})
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('reviews')}
                                        className={`flex-1 py-4 text-center font-medium transition ${activeTab === 'reviews' ? 'bg-gray-800 text-white border-b-2 border-netflix-red' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <FaStar /> {t('admin.reviews')} ({user.reviews?.length || 0})
                                        </div>
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <div className="p-6">
                                    {activeTab === 'history' && (
                                        <div className="space-y-4">
                                            {user.watch_history && user.watch_history.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {user.watch_history.map((history, idx) => (
                                                        <div key={idx} className="flex gap-4 p-3 rounded bg-black border border-gray-800 hover:border-gray-600 transition">
                                                            <div className="w-16 h-24 flex-shrink-0 bg-gray-900 rounded overflow-hidden">
                                                                {history.movie?.movie_poster ? (
                                                                    <img src={history.movie.movie_poster} alt={history.movie.movie_title} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-700"><FaFilm /></div>
                                                                )}
                                                            </div>
                                                            <div className="py-1">
                                                                <h4 className="font-bold text-white line-clamp-1">{history.movie?.movie_title || 'Unknown Title'}</h4>
                                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                                    <FaCalendarAlt size={10} /> {t('admin.watchedOn')}: {formatDate(history.watch_date)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-center py-8">No watch history available.</p>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'reviews' && (
                                        <div className="space-y-4">
                                            {user.reviews && user.reviews.length > 0 ? (
                                                user.reviews.map((review, idx) => (
                                                    <div key={idx} className="p-4 rounded bg-black border border-gray-800 flex justify-between items-center group">
                                                        <div>
                                                            <h4 className="font-bold text-white mb-1">{review.movie?.movie_title || 'Unknown Movie'}</h4>
                                                            <p className="text-xs text-gray-500">{t('admin.reviewedOn')}: {formatDate(review.review_date)}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center text-yellow-500 text-lg font-bold gap-1 bg-gray-900 px-3 py-1 rounded-full">
                                                                <FaStar /> {review.rating}
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteReview(review.review_id)}
                                                                className="text-gray-500 hover:text-red-500 transition p-2"
                                                                title="Delete Review"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 text-center py-8">No reviews written yet.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirm Modal */}
                <ConfirmModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                    title={confirmModal.title}
                    message={confirmModal.message}
                    onConfirm={confirmModal.onConfirm}
                    isDestructive={confirmModal.isDestructive}
                />
            </main>
        </div>
    );
}

export default EditUser;
