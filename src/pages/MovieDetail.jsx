import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../services/movieService';

function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                const data = await getMovieById(id);
                setMovie(data);
            } catch (err) {
                setError('Failed to load movie details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMovie();
        }
    }, [id]);

    const handleClose = () => {
        navigate(-1); // Go back to previous page
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                <div className="text-white text-2xl">Loading...</div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white text-2xl mb-4">{error || 'Movie not found'}</p>
                    <button
                        onClick={handleClose}
                        className="px-6 py-3 bg-netflix-red hover:bg-netflix-darkRed text-white font-bold rounded transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Get description based on language (prioritize English for now)
    const description = movie.movie_description_en || movie.movie_description_id || 'No description available.';

    // Format duration (minutes to hours:minutes)
    const formatDuration = (minutes) => {
        if (!minutes) return null;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    return (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
            {/* Close Button */}
            <button
                onClick={handleClose}
                className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-black/70 hover:bg-black rounded-full flex items-center justify-center transition group"
                aria-label="Close"
            >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Hero Section with Background */}
            <div className="relative h-screen min-h-[600px] max-h-[900px]">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: movie.movie_poster
                            ? `url(${movie.movie_poster})`
                            : 'linear-gradient(to bottom, #1a1a1a, #000000)'
                    }}
                >
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40"></div>
                    <div className="absolute inset-0 bg-black/20"></div>
                </div>

                {/* Content */}
                <div className="relative h-full flex items-end pb-12 sm:pb-16 md:pb-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="max-w-2xl">
                            {/* Title */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
                                {movie.movie_title}
                            </h1>

                            {/* Metadata Tags */}
                            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                                {movie.production_year && (
                                    <span className="px-3 py-1 bg-gray-800/80 text-white text-sm sm:text-base rounded">
                                        {movie.production_year}
                                    </span>
                                )}
                                {movie.average_rating && (
                                    <span className="px-3 py-1 bg-gray-800/80 text-white text-sm sm:text-base rounded">
                                        ⭐ {movie.average_rating}
                                    </span>
                                )}
                                {movie.movie_duration && (
                                    <span className="px-3 py-1 bg-gray-800/80 text-white text-sm sm:text-base rounded">
                                        🕒 {formatDuration(movie.movie_duration)}
                                    </span>
                                )}
                                <span className="px-3 py-1 bg-gray-800/80 text-white text-sm sm:text-base rounded">
                                    Movie
                                </span>
                            </div>

                            {/* Synopsis */}
                            <p className="text-white text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed max-w-xl line-clamp-4">
                                {description}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-netflix-red hover:bg-netflix-darkRed text-white text-base sm:text-lg font-bold rounded transition flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                    </svg>
                                    Watch Now
                                </button>
                                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-700/80 hover:bg-gray-600/80 text-white text-base sm:text-lg font-bold rounded transition flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add to Watchlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Details Section */}
            <div className="bg-black py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                        {/* Left Column - Movie Info */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">About this movie</h2>

                            {movie.production_year && (
                                <div className="mb-4">
                                    <h3 className="text-gray-400 text-sm font-semibold mb-1">Production Year</h3>
                                    <p className="text-white text-base sm:text-lg">{movie.production_year}</p>
                                </div>
                            )}

                            {movie.movie_duration && (
                                <div className="mb-4">
                                    <h3 className="text-gray-400 text-sm font-semibold mb-1">Duration</h3>
                                    <p className="text-white text-base sm:text-lg">{formatDuration(movie.movie_duration)}</p>
                                </div>
                            )}

                            {movie.average_rating && (
                                <div className="mb-4">
                                    <h3 className="text-gray-400 text-sm font-semibold mb-1">Average Rating</h3>
                                    <p className="text-white text-base sm:text-lg">⭐ {movie.average_rating} / 10</p>
                                </div>
                            )}

                            <div className="mb-4">
                                <h3 className="text-gray-400 text-sm font-semibold mb-1">Description</h3>
                                <p className="text-white text-sm sm:text-base leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        </div>

                        {/* Right Column - More Details */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">More Details</h2>
                            <p className="text-gray-400 text-sm sm:text-base">
                                Additional movie information will be displayed here (genres, cast, directors, etc.)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetail;
