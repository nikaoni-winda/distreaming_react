import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowLeft, FaSave, FaPlus, FaTimes, FaUserAstronaut } from 'react-icons/fa';
import AdminSidebar from '../../components/layout/AdminSidebar';
import { createMovie } from '../../services/movieService';
import { getGenres, addMovieToGenre } from '../../services/genreService';
import { getActors, addMovieToActor } from '../../services/actorService';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import { useToast } from '../../contexts/ToastContext';

function CreateMovie() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [saving, setSaving] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const [formData, setFormData] = useState({
        movie_title: '',
        movie_duration: '',
        production_year: '',
        movie_poster: '',
        trailer_url: '',
        movie_description_en: '',
        movie_description_id: ''
    });

    // Genres State
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [allGenres, setAllGenres] = useState([]);
    const [showGenreSelect, setShowGenreSelect] = useState(false);

    // Actors State
    const [selectedActors, setSelectedActors] = useState([]);
    const [allActors, setAllActors] = useState([]);
    const [showActorSelect, setShowActorSelect] = useState(false);

    // Fetch dependent data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [genresRes, actorsRes] = await Promise.all([
                    getGenres({ per_page: 100 }),
                    getActors({ per_page: 100 })
                ]);

                const genresList = Array.isArray(genresRes) ? genresRes : (genresRes.data || []);
                setAllGenres(genresList);

                const actorsList = Array.isArray(actorsRes) ? actorsRes : (actorsRes.data || []);
                setAllActors(actorsList);
            } catch (error) {
                console.error("Error fetching dependencies:", error);
                showToast('Error fetching genres or actors', 'error');
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Genre Handlers (Local State Only)
    const handleAddGenre = (genreId) => {
        if (!genreId) return;
        const genreToAdd = allGenres.find(g => g.genre_id === parseInt(genreId));
        if (genreToAdd && !selectedGenres.find(g => g.genre_id === genreToAdd.genre_id)) {
            setSelectedGenres([...selectedGenres, genreToAdd]);
        }
        setShowGenreSelect(false);
    };

    const handleRemoveGenre = (genreId) => {
        setSelectedGenres(selectedGenres.filter(g => g.genre_id !== genreId));
    };

    // Actor Handlers (Local State Only)
    const handleAddActor = (actorId) => {
        if (!actorId) return;
        const actorToAdd = allActors.find(a => a.actor_id === parseInt(actorId));
        if (actorToAdd && !selectedActors.find(a => a.actor_id === actorToAdd.actor_id)) {
            setSelectedActors([...selectedActors, actorToAdd]);
        }
        setShowActorSelect(false);
    };

    const handleRemoveActor = (actorId) => {
        setSelectedActors(selectedActors.filter(a => a.actor_id !== actorId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // 1. Create Movie
            const response = await createMovie(formData);

            // Determine movie ID from response structure
            // Assuming response.data contains the new movie object, or response itself is the data
            const newMovie = response.data || response;
            const newMovieId = newMovie.movie_id || newMovie.id;

            if (newMovieId) {
                // 2. Add Genres
                if (selectedGenres.length > 0) {
                    await Promise.all(selectedGenres.map(g =>
                        addMovieToGenre(g.genre_id, newMovieId)
                    ));
                }

                // 3. Add Actors
                if (selectedActors.length > 0) {
                    await Promise.all(selectedActors.map(a =>
                        addMovieToActor(a.actor_id, newMovieId)
                    ));
                }

                console.log('Movie created with relations successfully');
            } else {
                console.warn('Movie created but ID not found in response, skipped relations.');
                showToast('Movie created, but relational data might be missing', 'warning');
            }

            showToast(t('admin.createSuccess') || 'Movie created successfully!', 'success');
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Error creating movie:', error);
            showToast('Failed to create movie: ' + (error.response?.data?.message || error.message), 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSidebarNavigate = (tabId) => {
        navigate(`/admin/dashboard?tab=${tabId}`);
    };

    // Filter available items for dropdowns
    const availableGenresToAdd = allGenres.filter(
        g => !selectedGenres.some(sg => sg.genre_id === g.genre_id)
    );

    const availableActorsToAdd = allActors.filter(
        a => !selectedActors.some(sa => sa.actor_id === a.actor_id)
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
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                    >
                        <FaArrowLeft /> {t('admin.backToDashboard')}
                    </button>
                    <LanguageSwitcher />
                </div>

                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">{t('admin.createMovie')}</h1>

                    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column: Poster Preview */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-4">
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
                                        Poster Preview
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
                                    placeholder="https://..."
                                    className="w-full bg-netflix-darkGray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">{t('admin.trailerUrl') || 'Trailer URL (YouTube)'}</label>
                                <input
                                    type="text"
                                    name="trailer_url"
                                    value={formData.trailer_url}
                                    onChange={handleChange}
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="w-full bg-netflix-darkGray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition"
                                />
                            </div>
                        </div>

                        {/* Right Column: Form Fields */}
                        <div className="w-full lg:w-2/3 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-400">{t('admin.movieTitle')}</label>
                                <input
                                    type="text"
                                    name="movie_title"
                                    value={formData.movie_title}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-netflix-darkGray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-400">{t('admin.duration')}</label>
                                    <input
                                        type="number"
                                        name="movie_duration"
                                        value={formData.movie_duration}
                                        onChange={handleChange}
                                        required
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
                                        required
                                        className="w-full bg-netflix-darkGray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition"
                                    />
                                </div>
                            </div>

                            {/* Genres Selection */}
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
                                    {selectedGenres.length > 0 ? (
                                        selectedGenres.map(genre => (
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
                                        <span className="text-gray-600 text-sm italic">No genres selected</span>
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

                            {/* Actors Selection */}
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
                                    {selectedActors.length > 0 ? (
                                        selectedActors.map(actor => (
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
                                        <span className="text-gray-600 text-sm italic">No actors selected</span>
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
                                    required
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
                                    required
                                    className="w-full bg-netflix-darkGray border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-netflix-red transition"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-6 flex justify-end border-t border-gray-800">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-8 py-2 bg-netflix-red text-white font-bold rounded hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
                                >
                                    <FaSave /> {saving ? 'Creating...' : t('admin.addMovie')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default CreateMovie;
