import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaEdit, FaPlus, FaSearch } from 'react-icons/fa';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { getGenres, createGenre } from '../../services/genreService';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import Modal from '../../components/common/Modal';
import { useToast } from '../../contexts/ToastContext';

function ManageGenres() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGenreName, setNewGenreName] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchGenres();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchGenres = async () => {
        try {
            setLoading(true);
            const data = await getGenres();
            setGenres(data);
        } catch (error) {
            console.error('Error fetching genres:', error);
            showToast('Error fetching genres', 'error');
        } finally {
            setLoading(false);
        }
    };

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

    const filteredGenres = genres.filter(genre =>
        genre.genre_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row font-sans text-white">
            <AdminSidebar
                activeTab="genres"
                isSidebarOpen={isSidebarOpen}
                onNavigate={(tab) => {
                    if (tab !== 'genres') navigate('/admin/dashboard');
                }}
            />

            <main className="flex-1 md:ml-64 p-6 md:p-8">
                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">{t('admin.manageGenres')}</h1>
                        <p className="text-gray-400 mt-1">{t('admin.genresDesc')}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <LanguageSwitcher />
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-netflix-red hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 transition"
                        >
                            <FaPlus /> {t('admin.addGenre')}
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-8 relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('admin.searchMovies').replace('film', 'genre')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-96 bg-gray-900 border border-gray-800 rounded pl-10 pr-4 py-2 text-white focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition"
                    />
                </div>

                {/* Genres Grid */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">{t('dashboard.loading')}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredGenres.map(genre => (
                            <div key={genre.genre_id} className="bg-gray-900 border border-gray-800 rounded-lg p-5 flex flex-col justify-between hover:bg-gray-800 transition group">
                                <h3 className="text-xl font-bold mb-4">{genre.genre_name}</h3>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => navigate(`/admin/genres/edit/${genre.genre_id}`)}
                                        className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded border border-gray-700 transition flex items-center gap-2 group-hover:bg-netflix-red group-hover:border-netflix-red"
                                    >
                                        <FaEdit /> {t('admin.editGenre')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

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
}

export default ManageGenres;
