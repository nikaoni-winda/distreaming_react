import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaUserAstronaut, FaPen } from 'react-icons/fa';
import { getActors, createActor } from '../../../services/actorService';
import Pagination from '../../../components/common/Pagination';
import Modal from '../../../components/common/Modal';
import { useToast } from '../../../contexts/ToastContext';

const ActorManagement = ({ t }) => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [actors, setActors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newActorName, setNewActorName] = useState('');
    const [creating, setCreating] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchActors = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await getActors({
                page,
                per_page: 10,
                search: debouncedSearch || undefined
            });
            setActors(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Error fetching actors:', error);
            showToast('Error fetching actors', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, showToast]);

    useEffect(() => {
        fetchActors();
    }, [fetchActors]);

    const handleCreateActor = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await createActor({ actor_name: newActorName });
            setNewActorName('');
            setShowCreateModal(false);
            showToast(t('admin.actorCreated'), 'success');
            fetchActors();
        } catch (error) {
            console.error('Error creating actor:', error);
            showToast('Failed to create actor: ' + (error.response?.data?.message || 'Unknown error'), 'error');
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
                    <h2 className="text-2xl font-bold text-white">{t('admin.manageActors')}</h2>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-netflix-red text-white font-bold text-sm rounded hover:bg-red-700 transition"
                    >
                        <FaPlus /> {t('admin.addActor')}
                    </button>

                    <div className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder={t('admin.searchMovies').replace('film', 'actor')}
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('admin.actorName')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {actors.map((actor) => (
                                        <tr key={actor.actor_id} className="hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white flex items-center gap-3">
                                                <div className="p-2 bg-gray-800 rounded-full">
                                                    <FaUserAstronaut className="text-gray-400" size={16} />
                                                </div>
                                                {actor.actor_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => navigate(`/admin/actors/edit/${actor.actor_id}`)}
                                                    className="text-gray-400 hover:text-white transition"
                                                    title={t('admin.editActor')}
                                                >
                                                    <FaPen />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {actors.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No actors found.
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

            {/* Create Actor Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title={t('admin.addActor')}
            >
                <form onSubmit={handleCreateActor}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('admin.actorName')}</label>
                        <input
                            type="text"
                            value={newActorName}
                            onChange={(e) => setNewActorName(e.target.value)}
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

export default ActorManagement;
