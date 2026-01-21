import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaTrash, FaSave, FaPlus, FaTimes, FaTags, FaUserAstronaut } from 'react-icons/fa';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { getMovieById, updateMovie, deleteMovie } from '../../services/movieService';
import { getGenres, addMovieToGenre, removeMovieFromGenre } from '../../services/genreService';
import { getActors, addMovieToActor, removeMovieFromActor } from '../../services/actorService';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import { useToast } from '../../contexts/ToastContext';
import ConfirmModal from '../../components/common/ConfirmModal';

function EditMovie() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isSidebarOpen] = useState(true);

    const [formData, setFormData] = useState({
        movie_title: '',
        movie_duration: '',
        average_rating: '',
        production_year: '',
        movie_poster: '',
        trailer_url: '',
        movie_description_en: '',
        movie_description_id: ''
    });

    // Genres State
    const [movieGenres, setMovieGenres] = useState([]);
    const [allGenres, setAllGenres] = useState([]);
    const [showGenreSelect, setShowGenreSelect] = useState(false);

    // Actors State
    const [movieActors, setMovieActors] = useState([]);
    const [allActors, setAllActors] = useState([]);
    const [showActorSelect, setShowActorSelect] = useState(false);

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDestructive: false
    });

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const movie = await getMovieById(id);
                setFormData({
                    movie_title: movie.movie_title,
                    movie_duration: movie.movie_duration,
                    average_rating: movie.average_rating,
                    production_year: movie.production_year,
                    movie_poster: movie.movie_poster,
                    trailer_url: movie.trailer_url || '',
                    movie_description_en: movie.movie_description_en,
                    movie_description_id: movie.movie_description_id
                });
                setMovieGenres(movie.genres || []);
                setMovieActors(movie.actors || []);
            } catch (error) {
                console.error('Error fetching movie:', error);
                showToast('Error fetching movie details', 'error');
            } finally {
                setLoading(false);
            }
        };

        const fetchGenres = async () => {
            try {
                const response = await getGenres({ per_page: 100 });
                // Handle new response structure { data: [], pagination: {} }
                const genresList = Array.isArray(response) ? response : (response.data || []);
                setAllGenres(genresList);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        const fetchActorsList = async () => {
            try {
                const response = await getActors({ per_page: 100 });
                // Handle new response structure { data: [], pagination: {} }
                const actorsList = Array.isArray(response) ? response : (response.data || []);
                setAllActors(actorsList);
            } catch (error) {
                console.error('Error fetching actors:', error);
            }
        };

        if (id) {
            fetchMovie();
            fetchGenres();
            fetchActorsList();
        }
    }, [id, showToast]);

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
            await updateMovie(id, formData);
            showToast(t('admin.movieUpdated') || 'Movie updated successfully', 'success');
            navigate('/admin/dashboard?tab=movies');
        } catch (error) {
            console.error('Error updating movie:', error);
            showToast('Failed to update movie', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        setConfirmModal({
            isOpen: true,
            title: t('admin.deleteMovie'),
            message: t('admin.deleteConfirm') || 'Are you sure you want to delete this movie?',
            isDestructive: true,
            onConfirm: async () => {
                try {
                    await deleteMovie(id);
                    showToast('Movie deleted successfully', 'success');
                    navigate('/admin/dashboard?tab=movies');
                } catch (error) {
                    console.error('Error deleting movie:', error);
                    showToast('Failed to delete movie', 'error');
                }
            }
        });
    };

    // Genre Handlers
    const handleAddGenre = async (genreId) => {
        if (!genreId) return;
        try {
            await addMovieToGenre(genreId, id);
            const genreToAdd = allGenres.find(g => g.genre_id === parseInt(genreId));
            if (genreToAdd && !movieGenres.find(mg => mg.genre_id === genreToAdd.genre_id)) {
                setMovieGenres([...movieGenres, genreToAdd]);
                showToast('Genre added successfully', 'success');
            }
            setShowGenreSelect(false);
        } catch (error) {
            console.error('Error adding genre:', error);
            showToast('Failed to add genre', 'error');
        }
    };

    const handleRemoveGenre = (genreId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Remove Genre',
            message: t('admin.removeMovieFromGenreConfirm') || 'Are you sure you want to remove this genre?',
            isDestructive: true,
            onConfirm: async () => {
                try {
                    await removeMovieFromGenre(genreId, id);
                    setMovieGenres(movieGenres.filter(g => g.genre_id !== genreId));
                    showToast('Genre removed successfully', 'success');
                } catch (error) {
                    console.error('Error removing genre:', error);
                    showToast('Failed to remove genre', 'error');
                }
            }
        });
    };

    // Actor Handlers
    const handleAddActor = async (actorId) => {
        if (!actorId) return;
        try {
            // Note: API expects to add movie to actor, effectively linking them
            await addMovieToActor(actorId, id);
            const actorToAdd = allActors.find(a => a.actor_id === parseInt(actorId));
            if (actorToAdd && !movieActors.find(ma => ma.actor_id === actorToAdd.actor_id)) {
                setMovieActors([...movieActors, actorToAdd]);
                showToast('Actor added successfully', 'success');
            }
            setShowActorSelect(false);
        } catch (error) {
            console.error('Error adding actor:', error);
            showToast('Failed to add actor', 'error');
        }
    };

    const handleRemoveActor = (actorId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Remove Actor',
            message: t('admin.removeMovieFromActorConfirm') || 'Are you sure you want to remove this actor?',
            isDestructive: true,
            onConfirm: async () => {
                try {
                    await removeMovieFromActor(actorId, id);
                    setMovieActors(movieActors.filter(a => a.actor_id !== actorId));
                    showToast('Actor removed successfully', 'success');
                } catch (error) {
                    console.error('Error removing actor:', error);
                    showToast('Failed to remove actor', 'error');
                }
            }
        });
    };

    const handleSidebarNavigate = (tabId) => {
        navigate(`/admin/dashboard?tab=${tabId}`);
    };

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">{t('dashboard.loading')}</div>;
    }

    // Filter available genres (exclude ones already added)
    const availableGenresToAdd = allGenres.filter(
        g => !movieGenres.some(mg => mg.genre_id === g.genre_id)
    );

    // Filter available actors (exclude ones already added)
    const availableActorsToAdd = allActors.filter(
        a => !movieActors.some(ma => ma.actor_id === a.actor_id)
    );

    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row font-sans text-white">
            <AdminSidebar
                activeTab="movies"
                isSidebarOpen={isSidebarOpen}
                onNavigate={handleSidebarNavigate}
            />

            <main className="flex-1 md:ml-64 p-6 md:p-8">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate('/admin/dashboard?tab=movies')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                    >
                        <FaArrowLeft /> {t('common.back')}
                    </button>
                    <LanguageSwitcher />
                </div>

                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">{t('admin.editMovie')}</h1>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column: Poster & Genres - Moved Genres here for better layout balance */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-8">
                            {/* Poster */}
                            <div className="flex flex-col gap-4">
                                <div className="aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden border border-gray-800 relative">
                                    {formData.movie_poster ? (
                                        <img
                                            src={formData.movie_poster}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.style.display = 'none' }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-400">{t('admin.posterUrl')}</label>
                                    <input
                                        type="text"
                                        name="movie_poster"
                                        value={formData.movie_poster}
                                        onChange={handleChange}
                                        className="w-full bg-netflix-darkGray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-400">{t('admin.trailerUrl') || 'Trailer URL'}</label>
                                    <input
                                        type="text"
                                        name="trailer_url"
                                        value={formData.trailer_url}
                                        onChange={handleChange}
                                        className="w-full bg-netflix-darkGray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition"
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Right Column: Details */}
                        <div className="w-full lg:w-2/3 space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-400">{t('admin.movieTitle')}</label>
                                    <input
                                        type="text"
                                        name="movie_title"
                                        value={formData.movie_title}
                                        onChange={handleChange}
                                        className="w-full bg-netflix-darkGray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-400">{t('admin.duration')}</label>
                                        <input
                                            type="number"
                                            name="movie_duration"
                                            value={formData.movie_duration}
                                            onChange={handleChange}
                                            className="w-full bg-netflix-darkGray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-400">{t('admin.productionYear')}</label>
                                        <input
                                            type="number"
                                            name="production_year"
                                            value={formData.production_year}
                                            onChange={handleChange}
                                            className="w-full bg-netflix-darkGray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-400">{t('admin.rating')}</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            name="average_rating"
                                            value={formData.average_rating || ''}
                                            disabled
                                            className="w-full bg-netflix-darkGray border border-gray-700 rounded px-3 py-2 text-white opacity-50 cursor-not-allowed focus:outline-none"
                                            title="Rating generated automatically based on user reviews"
                                        />
                                    </div>
                                </div>

                                {/* Genres Section - Moved to Main Column */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-400">{t('admin.genres')}</label>
                                        {!showGenreSelect && (
                                            <button
                                                type="button"
                                                onClick={() => setShowGenreSelect(true)}
                                                className="text-xs text-netflix-red hover:text-white font-bold flex items-center gap-1 transition"
                                            >
                                                <FaPlus size={10} /> Add Genre
                                            </button>
                                        )}
                                    </div>

                                    <div className="bg-netflix-darkGray border border-gray-700 rounded p-3 min-h-[50px] flex flex-wrap gap-2 items-center">
                                        {movieGenres.length > 0 ? (
                                            movieGenres.map(genre => (
                                                <div key={genre.genre_id} className="bg-gray-800 border border-gray-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-2 group hover:border-netflix-red transition">
                                                    {genre.genre_name}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveGenre(genre.genre_id)}
                                                        className="text-gray-400 hover:text-red-500 transition"
                                                    >
                                                        <FaTimes size={10} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-gray-600 text-sm italic">No genres assigned yet</span>
                                        )}

                                        {showGenreSelect && (
                                            <div className="flex items-center gap-2 animate-fadeIn">
                                                <select
                                                    className="bg-black border border-gray-600 text-sm rounded px-2 py-1 text-white focus:outline-none focus:border-netflix-red"
                                                    onChange={(e) => handleAddGenre(e.target.value)}
                                                    defaultValue=""
                                                    autoFocus
                                                >
                                                    <option value="" disabled>Select Genre...</option>
                                                    {availableGenresToAdd.map(g => (
                                                        <option key={g.genre_id} value={g.genre_id}>{g.genre_name}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowGenreSelect(false)}
                                                    className="text-gray-400 hover:text-white"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actors Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-400">{t('admin.actors')}</label>
                                        {!showActorSelect && (
                                            <button
                                                type="button"
                                                onClick={() => setShowActorSelect(true)}
                                                className="text-xs text-netflix-red hover:text-white font-bold flex items-center gap-1 transition"
                                            >
                                                <FaPlus size={10} /> Add Actor
                                            </button>
                                        )}
                                    </div>

                                    <div className="bg-netflix-darkGray border border-gray-700 rounded p-3 min-h-[50px] flex flex-wrap gap-2 items-center">
                                        {movieActors.length > 0 ? (
                                            movieActors.map(actor => (
                                                <div key={actor.actor_id} className="bg-gray-800 border border-gray-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-2 group hover:border-netflix-red transition">
                                                    <FaUserAstronaut size={10} className="text-gray-400" />
                                                    {actor.actor_name}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveActor(actor.actor_id)}
                                                        className="text-gray-400 hover:text-red-500 transition"
                                                    >
                                                        <FaTimes size={10} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-gray-600 text-sm italic">No actors assigned yet</span>
                                        )}

                                        {showActorSelect && (
                                            <div className="flex items-center gap-2 animate-fadeIn">
                                                <select
                                                    className="bg-black border border-gray-600 text-sm rounded px-2 py-1 text-white focus:outline-none focus:border-netflix-red max-w-[200px]"
                                                    onChange={(e) => handleAddActor(e.target.value)}
                                                    defaultValue=""
                                                    autoFocus
                                                >
                                                    <option value="" disabled>Select Actor...</option>
                                                    {availableActorsToAdd.sort((a, b) => a.actor_name.localeCompare(b.actor_name)).map(a => (
                                                        <option key={a.actor_id} value={a.actor_id}>{a.actor_name}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowActorSelect(false)}
                                                    className="text-gray-400 hover:text-white"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-400">{t('admin.descriptionEn')}</label>
                                    <textarea
                                        name="movie_description_en"
                                        value={formData.movie_description_en}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full bg-netflix-darkGray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-400">{t('admin.descriptionId')}</label>
                                    <textarea
                                        name="movie_description_id"
                                        value={formData.movie_description_id}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full bg-netflix-darkGray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-6 flex items-center justify-between border-t border-gray-800">
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="px-6 py-2 bg-red-900/30 text-red-500 border border-red-900 rounded hover:bg-red-900/50 transition flex items-center gap-2"
                                    >
                                        <FaTrash /> {t('admin.deleteMovie')}
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-8 py-2 bg-netflix-red text-white font-bold rounded hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <FaSave /> {saving ? 'Saving...' : t('admin.saveChanges')}
                                    </button>
                                </div>
                            </form>
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
export default EditMovie;
