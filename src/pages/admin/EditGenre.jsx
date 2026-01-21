import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaTrash, FaSave, FaFilm, FaStar, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { getGenreById, updateGenre, deleteGenre, addMovieToGenre, removeMovieFromGenre } from '../../services/genreService';
import { getMovies } from '../../services/movieService';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import { useToast } from '../../contexts/ToastContext';
import Modal from '../../components/common/Modal';
import ConfirmModal from '../../components/common/ConfirmModal';

function EditGenre() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [genre, setGenre] = useState(null);
    const [genreName, setGenreName] = useState('');
    const [isSidebarOpen] = useState(true);

    // Add Movie State
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchMovieTerm, setSearchMovieTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDestructive: false
    });

    useEffect(() => {
        fetchGenre();
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (showAddModal) {
            searchMovies();
        }
    }, [showAddModal, searchMovieTerm]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchGenre = async () => {
        try {
            setLoading(true);
            const data = await getGenreById(id);
            setGenre(data);
            setGenreName(data.genre_name);
        } catch (error) {
            console.error('Error fetching genre:', error);
            showToast('Error fetching genre details', 'error');
            navigate('/admin/dashboard?tab=genres');
        } finally {
            setLoading(false);
        }
    };

    const searchMovies = async () => {
        try {
            setSearching(true);
            const response = await getMovies({
                search: searchMovieTerm,
                per_page: 50 // Fetch enough to show
            });

            // Filter out movies already in the genre
            const currentMovieIds = new Set(genre?.movies?.map(m => m.movie_id) || []);
            const available = response.data.filter(m => !currentMovieIds.has(m.movie_id));

            setSearchResults(available);
        } catch (error) {
            console.error('Error searching movies:', error);
        } finally {
            setSearching(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateGenre(id, { genre_name: genreName });
            showToast(t('admin.genreUpdated'), 'success');
            navigate('/admin/dashboard?tab=genres');
        } catch (error) {
            console.error('Error updating genre:', error);
            showToast('Failed to update: ' + (error.response?.data?.message || 'Unknown error'), 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        setConfirmModal({
            isOpen: true,
            title: t('admin.deleteGenre') || 'Delete Genre',
            message: t('admin.deleteGenreConfirm') || 'Are you sure you want to delete this genre?',
            isDestructive: true,
            onConfirm: async () => {
                try {
                    await deleteGenre(id);
                    showToast(t('admin.genreDeleted') || 'Genre deleted successfully', 'success');
                    navigate('/admin/dashboard?tab=genres');
                } catch (error) {
                    console.error('Error deleting genre:', error);
                    showToast('Failed to delete: ' + (error.response?.data?.message || 'Unknown error'), 'error');
                }
            }
        });
    };

    const handleAddMovie = async (movieId) => {
        try {
            await addMovieToGenre(id, movieId);
            // Refresh genre data
            const data = await getGenreById(id);
            setGenre(data);

            // Update search results to remove the added movie
            setSearchResults(prev => prev.filter(m => m.movie_id !== movieId));

            showToast(t('admin.movieAddedToGenre'), 'success');
        } catch (error) {
            console.error('Error adding movie:', error);
            showToast('Failed to add movie', 'error');
        }
    };

    const handleRemoveMovie = (movieId) => {
        setConfirmModal({
            isOpen: true,
            title: t('admin.removeMovieFromGenre') || 'Remove Movie',
            message: t('admin.removeMovieFromGenreConfirm') || 'Are you sure you want to remove this movie from the genre?',
            isDestructive: true,
            onConfirm: async () => {
                try {
                    await removeMovieFromGenre(id, movieId);
                    // Refresh genre data
                    const data = await getGenreById(id);
                    setGenre(data);
                    showToast(t('admin.movieRemovedFromGenre'), 'success');
                } catch (error) {
                    console.error('Error removing movie:', error);
                    showToast('Failed to remove movie', 'error');
                }
            }
        });
    };

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">{t('dashboard.loading')}</div>;
    }

    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row font-sans text-white">
            <AdminSidebar
                activeTab="genres"
                isSidebarOpen={isSidebarOpen}
                onNavigate={(tab) => {
                    navigate(`/admin/dashboard?tab=${tab}`);
                }}
            />

            <main className="flex-1 md:ml-64 p-6 md:p-8">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate('/admin/dashboard?tab=genres')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                    >
                        <FaArrowLeft /> {t('common.back')}
                    </button>
                    <LanguageSwitcher />
                </div>

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">{t('admin.editGenre')}</h1>

                    {/* Edit Form */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg mb-8">
                        <form onSubmit={handleUpdate} className="flex flex-col gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">{t('admin.genreName')}</label>
                                <input
                                    type="text"
                                    value={genreName}
                                    onChange={(e) => setGenreName(e.target.value)}
                                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-900/30 text-red-500 border border-red-900 rounded hover:bg-red-900/50 transition flex items-center gap-2"
                                >
                                    <FaTrash /> {t('admin.deleteGenre')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-netflix-red text-white font-bold rounded hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    <FaSave /> {saving ? 'Saving...' : t('admin.saveChanges')}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Related Movies List */}
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <FaFilm className="text-netflix-red" />
                                {t('admin.moviesInGenre')}
                                <span className="text-sm font-normal text-gray-500 px-3 py-1 bg-gray-900 rounded-full">
                                    {genre?.movies?.length || 0}
                                </span>
                            </h2>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded border border-gray-700 transition flex items-center gap-2 text-sm"
                            >
                                <FaPlus /> {t('admin.addMovieToGenre')}
                            </button>
                        </div>

                        {genre?.movies && genre.movies.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {genre.movies.map(movie => (
                                    <div key={movie.movie_id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition group relative">
                                        <div className="aspect-[2/3] relative bg-black">
                                            {movie.movie_poster ? (
                                                <img
                                                    src={movie.movie_poster}
                                                    alt={movie.movie_title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Poster</div>
                                            )}
                                            <div className="absolute top-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-xs font-bold text-yellow-400 flex items-center gap-1">
                                                <FaStar size={10} />
                                                {movie.average_rating || 'N/A'}
                                            </div>

                                            {/* Remove Button Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                <button
                                                    onClick={() => handleRemoveMovie(movie.movie_id)}
                                                    className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition transform hover:scale-110"
                                                    title={t('admin.removeMovieFromGenre')}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-medium text-sm truncate" title={movie.movie_title}>
                                                {movie.movie_title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1">{movie.production_year} • {movie.movie_duration}m</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-900/50 border border-gray-800 border-dashed rounded-lg p-12 text-center text-gray-500">
                                {t('admin.noMoviesInGenre')}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Add Movie Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={t('admin.addMovieToGenre')}
                maxWidth="max-w-2xl"
            >
                <div>
                    <div className="mb-4">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('admin.searchMoviesToAdd')}
                                value={searchMovieTerm}
                                onChange={(e) => setSearchMovieTerm(e.target.value)}
                                className="w-full bg-black border border-gray-700 rounded pl-10 pr-4 py-2 text-white focus:outline-none focus:border-netflix-red"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto">
                        {searching ? (
                            <div className="text-center text-gray-500 py-8">Searching...</div>
                        ) : searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {searchResults.map(movie => (
                                    <div key={movie.movie_id} className="flex gap-3 bg-black border border-gray-800 p-2 rounded hover:border-gray-600 transition">
                                        <div className="w-12 h-16 bg-gray-800 flex-shrink-0">
                                            {movie.movie_poster && (
                                                <img src={movie.movie_poster} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm truncate">{movie.movie_title}</h4>
                                            <p className="text-xs text-gray-500">{movie.production_year}</p>
                                        </div>
                                        <button
                                            onClick={() => handleAddMovie(movie.movie_id)}
                                            className="self-center px-3 py-1 bg-netflix-red text-white text-xs font-bold rounded hover:bg-red-700 transition"
                                        >
                                            Add
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                {searchMovieTerm ? 'No movies found' : 'Type to search movies...'}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

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
}

export default EditGenre;
