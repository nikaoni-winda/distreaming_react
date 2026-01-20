import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { getMovieById } from '../../services/movieService';
import { addToWatchHistory } from '../../services/watchHistoryService';
import StarRating from './StarRating';
import api from '../../config/api';
import { useToast } from '../../contexts/ToastContext';

function MovieModal({ movie, onClose }) {
    const { i18n, t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [movieData, setMovieData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Video Player state
    const [showVideo, setShowVideo] = useState(false);

    // Rating states
    const [userRating, setUserRating] = useState(0);
    const [existingRating, setExistingRating] = useState(null);
    const [ratingLoading, setRatingLoading] = useState(false);
    const [ratingMessage, setRatingMessage] = useState({ type: '', text: '' });
    const [showRatingPopup, setShowRatingPopup] = useState(false);

    const displayedMovie = movieData || movie;

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return null;
        let videoId = '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            videoId = match[2];
        }

        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
    };

    // Format duration (minutes to hours:minutes)
    const formatDuration = (minutes) => {
        if (!minutes) return null;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    // Get description based on current language
    const getDescription = () => {
        const source = movieData || movie;

        if (!source) return 'Loading description...';

        const currentLang = i18n.language;

        if (currentLang === 'id' && source.movie_description_id) {
            return source.movie_description_id;
        } else if (currentLang === 'en' && source.movie_description_en) {
            return source.movie_description_en;
        }

        return source.movie_description_en || source.movie_description_id || 'No description available.';
    };

    const handlePlayClick = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        const trailerUrl = displayedMovie.trailer_url;
        if (trailerUrl) {
            try {
                await addToWatchHistory(user.user_id, displayedMovie.movie_id);
            } catch (error) {
                console.error('Failed to add to watch history', error);
            }
            setShowVideo(true);
        } else {
            showToast("Sorry, no trailer available for this movie yet.", 'info');
        }
    };

    // Fetch full movie details from API
    useEffect(() => {
        const fetchMovieDetails = async () => {
            if (!movie?.movie_id) return;

            try {
                setLoading(true);
                setError(null);
                const data = await getMovieById(movie.movie_id);
                setMovieData(data);
            } catch (err) {
                console.error('Failed to fetch movie details:', err);
                setError('Failed to load movie details');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movie?.movie_id]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Check if user already rated this movie
    useEffect(() => {
        const checkExistingRating = async () => {
            if (!user || !movie?.movie_id) return;

            try {
                const response = await api.get('/reviews', {
                    params: {
                        movie_id: movie.movie_id,
                        user_id: user.user_id
                    }
                });

                // Find user's review for this movie
                const userReview = response.data.data?.find(
                    review => review.user_id === user.user_id && review.movie_id === movie.movie_id
                );

                if (userReview) {
                    setExistingRating(userReview.rating);
                }
            } catch (error) {
                console.error('Failed to check existing rating:', error);
            }
        };

        checkExistingRating();
    }, [user, movie?.movie_id]);

    // Submit rating
    const handleSubmitRating = async () => {
        if (!user || userRating === 0) return;

        setRatingLoading(true);
        setRatingMessage({ type: '', text: '' });

        try {
            const response = await api.post('/reviews', {
                user_id: user.user_id,
                movie_id: movie.movie_id,
                rating: userRating
            });

            if (response.data.success) {
                setExistingRating(userRating);
                setRatingMessage({ type: 'success', text: 'Rating submitted successfully!' });
                showToast('Rating submitted successfully!', 'success');

                // Update movie average rating in local state
                if (movieData) {
                    setMovieData({
                        ...movieData,
                        average_rating: response.data.data.movie?.average_rating || movieData.average_rating
                    });
                }

                // Close popup after 1.5 seconds to show success message
                setTimeout(() => {
                    setShowRatingPopup(false);
                    setUserRating(0); // Reset user rating
                    setRatingMessage({ type: '', text: '' }); // Clear message
                }, 1500);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to submit rating';
            setRatingMessage({ type: 'error', text: errorMsg });
            showToast(errorMsg, 'error');
        } finally {
            setRatingLoading(false);
        }
    };

    if (!movie) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            {/* Modal Container - hide when video is playing to show "fullscreen" video player */}
            {!showVideo && (
                <div
                    className="relative max-w-xl bg-black rounded-lg overflow-hidden shadow-2xl animate-scaleIn"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/80 hover:bg-black rounded-full flex items-center justify-center transition group"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6 text-white group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {loading ? (
                        // Loading State
                        <div className="h-[500px] flex items-center justify-center">
                            <div className="text-white text-xl">Loading movie details...</div>
                        </div>
                    ) : error ? (
                        // Error State
                        <div className="h-[500px] flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-white text-xl mb-4">{error}</p>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-netflix-red hover:bg-netflix-darkRed text-white font-bold rounded transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Hero Section with Background */}
                            <div className="relative h-[280px]">
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: displayedMovie.movie_poster
                                            ? `url(${displayedMovie.movie_poster})`
                                            : 'linear-gradient(to bottom, #1a1a1a, #000000)'
                                    }}
                                >
                                    {/* Gradient Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30"></div>
                                </div>

                                {/* Content */}
                                <div className="relative h-full flex items-end pb-6 px-6 sm:px-8">
                                    <div className="w-full">
                                        {/* Title */}
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
                                            {displayedMovie.movie_title}
                                        </h1>

                                        {/* Metadata Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {displayedMovie.production_year && (
                                                <span className="px-2.5 py-1 bg-gray-800/90 text-white text-xs sm:text-sm rounded">
                                                    {displayedMovie.production_year}
                                                </span>
                                            )}
                                            {displayedMovie.average_rating && (
                                                <span className="px-2.5 py-1 bg-gray-800/90 text-white text-xs sm:text-sm rounded">
                                                    ⭐ {displayedMovie.average_rating}
                                                </span>
                                            )}
                                            {displayedMovie.movie_duration && (
                                                <span className="px-2.5 py-1 bg-gray-800/90 text-white text-xs sm:text-sm rounded">
                                                    {formatDuration(displayedMovie.movie_duration)}
                                                </span>
                                            )}

                                            {/* Genres from API */}
                                            {displayedMovie.genres && displayedMovie.genres.length > 0 && (
                                                displayedMovie.genres.map((genre) => (
                                                    <span key={genre.genre_id} className="px-2.5 py-1 bg-gray-800/90 text-white text-xs sm:text-sm rounded">
                                                        {genre.genre_name}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="p-4 bg-gradient-to-b from-black to-netflix-darkGray">
                                <p className="text-white text-sm sm:text-base leading-relaxed mb-4">
                                    {getDescription()}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    {/* Get Started Button */}
                                    <button
                                        onClick={handlePlayClick}
                                        className="flex-1 px-6 py-2.5 bg-netflix-red hover:bg-netflix-darkRed text-white text-base font-bold rounded transition flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                        </svg>
                                        {t('movieDetail.play')}
                                    </button>

                                    {/* Rate Movie Button - Only show if user is logged in */}
                                    {user && (
                                        <button
                                            onClick={() => setShowRatingPopup(true)}
                                            className="flex-1 px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-base font-bold rounded transition flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {existingRating ? `${t('movieDetail.yourRating')}: ${existingRating}/10` : t('movieDetail.rateMovie')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Video Player Overlay */}
            {showVideo && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 animate-fadeIn"
                    onClick={() => setShowVideo(false)}
                >
                    <div className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl rounded-lg overflow-hidden">
                        <button
                            onClick={() => setShowVideo(false)}
                            className="absolute -top-12 right-0 sm:top-4 sm:right-4 z-20 text-white/50 hover:text-white transition"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {getYoutubeEmbedUrl(displayedMovie.trailer_url) ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={getYoutubeEmbedUrl(displayedMovie.trailer_url)}
                                title={displayedMovie.movie_title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-xl">
                                Invalid Video URL
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Rating Popup Dialog */}
            {showRatingPopup && user && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setShowRatingPopup(false)}
                >
                    <div
                        className="relative bg-netflix-darkGray rounded-lg p-6 max-w-md w-full shadow-2xl border border-gray-700 animate-scaleIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowRatingPopup(false)}
                            className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black rounded-full flex items-center justify-center transition"
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {existingRating ? (
                            // Already rated - show readonly rating
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white mb-4">{t('movieDetail.yourRating')}</h3>
                                <div className="flex justify-center mb-3">
                                    <StarRating rating={existingRating} disabled={true} />
                                </div>
                                <p className="text-white text-2xl font-semibold mb-4">{existingRating}/10</p>
                                <p className="text-gray-400 text-sm">{t('movieDetail.alreadyRated')}</p>
                            </div>
                        ) : (
                            // Not rated yet - show interactive rating
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white mb-2">{t('movieDetail.rateThisMovie')}</h3>
                                <p className="text-gray-400 text-sm mb-6">{t('movieDetail.shareRating')}</p>

                                {/* Star Rating Component */}
                                <div className="flex justify-center mb-4">
                                    <StarRating
                                        rating={userRating}
                                        onRatingChange={setUserRating}
                                        disabled={ratingLoading}
                                    />
                                </div>

                                {/* Rating Value Display */}
                                {userRating > 0 && (
                                    <p className="text-white text-3xl font-bold mb-6">{userRating}/10</p>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmitRating}
                                    disabled={ratingLoading || userRating === 0}
                                    className="w-full px-6 py-3 bg-netflix-red hover:bg-netflix-darkRed disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded transition"
                                >
                                    {ratingLoading ? t('movieDetail.submittingRating') : t('movieDetail.submitRating')}
                                </button>

                                {/* Success/Error Message */}
                                {ratingMessage.text && (
                                    <p className={`mt-4 text-sm ${ratingMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                        {ratingMessage.text}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieModal;
