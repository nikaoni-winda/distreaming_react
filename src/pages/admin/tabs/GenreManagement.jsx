import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaPen } from 'react-icons/fa';
import { getGenres, createGenre } from '../../../services/genreService';
import Pagination from '../../../components/common/Pagination';
import Modal from '../../../components/common/Modal';
import { useToast } from '../../../contexts/ToastContext';

const GenreManagement = ({ t }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGenreName, setNewGenreName] = useState('');
    const [creating, setCreating] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchGenres = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await getGenres({
                page,
                per_page: 10,
                search: debouncedSearch || undefined
            });
            setGenres(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Error fetching genres:', error);
            showToast('Error fetching genres', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, showToast]);

    useEffect(() => {
        fetchGenres();
    }, [fetchGenres]);

    const handleCreateGenre = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await createGenre({ genre_name: newGenreName });
            setNewGenreName('');
            setShowCreateModal(false);
            showToast(t('admin.genreCreated'), 'success');
            fetchGenres();
        } catch (error) {
            console.error('Error creating genre:', error);
            showToast('Failed to create genre: ' + (error.response?.data?.message || 'Unknown error'), 'error');
        } finally {
            setCreating(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">{t('admin.manageGenres')}</h2>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-netflix-red text-white font-bold text-sm rounded hover:bg-red-700 transition"
                    >
                        <FaPlus /> {t('admin.addGenre')}
                    </button>

                    <div className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder={t('admin.searchMovies').replace('film', 'genre')}
                            value={search}
                            onChange={handleSearch}
                            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:border-netflix-red placeholder-gray-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-500" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
                </div>
            ) : (
                <>
                    <div className="bg-netflix-darkGray overflow-hidden rounded-lg border border-gray-800">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-800">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('admin.genreName')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {genres.map((genre) => (
                                        <tr key={genre.genre_id} className="hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{genre.genre_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => navigate(`/admin/genres/edit/${genre.genre_id}`)}
                                                    className="text-gray-400 hover:text-white transition"
                                                    title={t('admin.editGenre')}
                                                >
                                                    <FaPen />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {genres.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No genres found.
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

            {/* Create Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title={t('admin.addGenre')}
            >
                <form onSubmit={handleCreateGenre}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('admin.genreName')}</label>
                        <input
                            type="text"
                            value={newGenreName}
                            onChange={(e) => setNewGenreName(e.target.value)}
                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(false)}
                            className="px-4 py-2 text-gray-400 hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={creating}
                            className="px-6 py-2 bg-netflix-red text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {creating ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default GenreManagement;
