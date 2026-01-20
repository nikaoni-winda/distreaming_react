import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import UserNavbar from '../../components/layout/UserNavbar';
import Footer from '../../components/layout/Footer';
import MovieGrid from '../../components/movie/MovieGrid';
import MovieModal from '../../components/movie/MovieModal';
import Pagination from '../../components/common/Pagination';
import { getMovies } from '../../services/movieService';
import { getGenres } from '../../services/genreService';
import { getWatchHistory } from '../../services/watchHistoryService';

function UserDashboard() {
    const { t } = useTranslation();
    const { user } = useAuth();

    // State for movies
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [watchHistory, setWatchHistory] = useState([]);

    // State for filters
    const [genres, setGenres] = useState([]);
    const [selectedGenreId, setSelectedGenreId] = useState('');

    // Fetch movies
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const response = await getMovies({
                    page: currentPage,
                    per_page: 12,
                    search: searchQuery || undefined,
                    genre_id: selectedGenreId || undefined,
                });

                setMovies(response.data);
                setPagination(response.pagination);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [currentPage, searchQuery, selectedGenreId]);

    // Fetch watch history
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getWatchHistory();
                setWatchHistory(history);
            } catch (error) {
                console.error('Error fetching watch history:', error);
            }
        };

        fetchHistory();
    }, []);

    // Fetch genres for filter
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await getGenres();
                setGenres(response.data || []);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handleGenreChange = (genreId) => {
        setSelectedGenreId(genreId);
        setCurrentPage(1); // Reset to first page on filter change
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navbar */}
            <UserNavbar />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {t('dashboard.welcomeBack')}, {user?.user_nickname}!
                    </h1>
                    <p className="text-gray-400">
                        {t('dashboard.enjoyWatching')}
                    </p>
                </div>

                {/* Continue Watching Section - Only show if user has watch history */}
                {watchHistory && watchHistory.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-4">{t('dashboard.continueWatching')}</h2>

                        {/* Horizontal Scroll Container */}
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
                            {watchHistory.map((item) => (
                                <div
                                    key={item.watch_history_id}
                                    onClick={() => setSelectedMovie(item.movie)}
                                    className="flex-shrink-0 w-48 cursor-pointer group transition-transform duration-300 hover:scale-105"
                                >
                                    {/* Movie Card */}
                                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 shadow-lg">
                                        {item.movie?.movie_poster ? (
                                            <img
                                                src={item.movie.movie_poster}
                                                alt={item.movie.movie_title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                                <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                                </svg>
                                            </div>
                                        )}

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Progress Bar */}
                                        {item.progress_percentage && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                                                <div
                                                    className="h-full bg-netflix-red"
                                                    style={{ width: `${item.progress_percentage}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Movie Info */}
                                    <div className="mt-2">
                                        <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-netflix-red transition-colors">
                                            {item.movie?.movie_title}
                                        </h3>
                                        {item.progress_percentage && (
                                            <p className="text-gray-400 text-xs mt-1">
                                                {item.progress_percentage}% {t('dashboard.watched')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Movies Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">{t('dashboard.allMovies')}</h2>

                    {/* Filters - Search Bar + Genre Filter */}
                    <div className="mb-6 flex gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            {/* Search Icon */}
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* Search Input */}
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder={t('dashboard.search')}
                                className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red transition"
                            />

                            {/* Clear Button */}
                            {searchQuery && (
                                <button
                                    onClick={handleClearSearch}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Genre Filter Dropdown */}
                        <div className="relative">
                            <select
                                value={selectedGenreId}
                                onChange={(e) => handleGenreChange(e.target.value)}
                                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-netflix-red transition cursor-pointer appearance-none pr-10"
                            >
                                <option value="">{t('dashboard.allGenres')}</option>
                                {genres.map((genre) => (
                                    <option key={genre.genre_id} value={genre.genre_id}>
                                        {genre.genre_name}
                                    </option>
                                ))}
                            </select>

                            {/* Custom dropdown icon */}
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Movie Grid */}
                    <MovieGrid
                        movies={movies}
                        onMovieClick={handleMovieClick}
                        loading={loading}
                    />

                    {/* Pagination */}
                    {pagination && (
                        <Pagination
                            pagination={pagination}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>

            {/* Movie Modal */}
            {selectedMovie && (
                <MovieModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default UserDashboard;
