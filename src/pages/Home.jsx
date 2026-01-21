import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TrendingMovieCard from '../components/movie/TrendingMovieCard';
import MovieModal from '../components/movie/MovieModal';
import { getTrendingMovies } from '../services/movieService';

function Home() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [openFaq, setOpenFaq] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Redirect logged-in users to dashboard
    useEffect(() => {
        if (user) {
            // If user is logged in, redirect to appropriate dashboard
            if (user.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [user, navigate]);

    // Fetch trending movies on mount
    useEffect(() => {
        const fetchTrendingMovies = async () => {
            try {
                const data = await getTrendingMovies();
                // Check if API returns data property or direct array
                setTrendingMovies(data.data || data || []);
            } catch (error) {
                console.error('Failed to fetch trending movies:', error);
                setTrendingMovies([]);
            } finally {
                setLoadingMovies(false);
            }
        };

        fetchTrendingMovies();
    }, []);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        // Redirect to register with email pre-filled
        navigate(`/register?email=${encodeURIComponent(email)}`);
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section with Background */}
            <div className="relative min-h-[600px] md:min-h-[700px]">
                {/* Navbar - Absolute positioned over hero */}
                <div className="absolute top-0 left-0 right-0 z-50">
                    <Navbar />
                </div>

                {/* Background Image with Gradient Overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/797df41b-1129-4496-beb3-6fc2f29c59d3/web/ID-id-20260112-TRIFECTA-perspective_02d91330-652c-4e1f-b363-82ae5449cbe3_large.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/50 to-black/90"></div>
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 flex items-center justify-center min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[750px]">
                    <div className="text-center px-4 sm:px-6 max-w-4xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 leading-tight">
                            {t('home.title')}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-white mb-4 sm:mb-6">
                            {t('home.subtitle')}
                        </p>
                        <p className="text-sm sm:text-base md:text-lg text-white mb-4 sm:mb-6">
                            {t('home.emailPrompt')}
                        </p>

                        {/* Email Form */}
                        {!user && (
                            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center max-w-2xl mx-auto">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('home.emailPlaceholder')}
                                    required
                                    className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-black/50 border border-gray-400 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
                                />
                                <button
                                    type="submit"
                                    className="px-6 sm:px-8 py-3 sm:py-4 bg-netflix-red hover:bg-netflix-darkRed text-white text-base sm:text-lg font-bold rounded transition flex items-center justify-center gap-2"
                                >
                                    {t('home.getStarted')}
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Gradient Divider - Netflix Style */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-netflix-red to-transparent"></div>

            {/* Trending Movies Section */}
            <div className="bg-black py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                        {t('trending.title')}
                    </h2>

                    {loadingMovies ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
                        </div>
                    ) : trendingMovies.length > 0 ? (
                        <div className="relative">
                            {/* Horizontal Scroll Container */}
                            <div className="flex gap-8 overflow-x-auto pb-4 px-6 scrollbar-hide scroll-smooth">
                                {trendingMovies.map((movie, index) => (
                                    <TrendingMovieCard
                                        key={movie.movie_id}
                                        movie={movie}
                                        index={index}
                                        onClick={() => {
                                            console.log('Movie card clicked:', movie);
                                            setSelectedMovie(movie);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-400">No trending movies available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Gradient Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-netflix-red to-transparent"></div>

            {/* Reasons to Join Section */}
            <div className="bg-black py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                        {t('reasons.title')}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {/* Card 1 - Enjoy on TV */}
                        <div className="bg-gradient-to-br from-gray-800/20 to-purple-900/30 rounded-2xl p-6 relative overflow-hidden border border-gray-700/20 min-h-[320px]">
                            <h3 className="text-white font-bold text-lg mb-3">
                                {t('reasons.enjoyTV.title')}
                            </h3>
                            <p className="text-gray-300 text-sm mb-12">
                                {t('reasons.enjoyTV.desc')}
                            </p>
                            <div className="absolute bottom-4 right-4">
                                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21 3H3c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 14H3V5h18v12z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 - Download */}
                        <div className="bg-gradient-to-br from-gray-800/20 to-pink-900/30 rounded-2xl p-6 relative overflow-hidden border border-gray-700/20 min-h-[280px]">
                            <h3 className="text-white font-bold text-lg mb-3">
                                {t('reasons.download.title')}
                            </h3>
                            <p className="text-gray-300 text-sm mb-12">
                                {t('reasons.download.desc')}
                            </p>
                            <div className="absolute bottom-4 right-4">
                                <div className="bg-gradient-to-br from-pink-500 to-red-500 p-3 rounded-xl">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 - Watch Anywhere */}
                        <div className="bg-gradient-to-br from-gray-800/20 to-red-900/30 rounded-2xl p-6 relative overflow-hidden border border-gray-700/20 min-h-[280px]">
                            <h3 className="text-white font-bold text-lg mb-3">
                                {t('reasons.watchAnywhere.title')}
                            </h3>
                            <p className="text-gray-300 text-sm mb-12">
                                {t('reasons.watchAnywhere.desc')}
                            </p>
                            <div className="absolute bottom-4 right-4">
                                <div className="bg-gradient-to-br from-red-500 to-orange-500 p-3 rounded-xl">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Card 4 - Kids Profile */}
                        <div className="bg-gradient-to-br from-gray-800/20 to-pink-800/30 rounded-2xl p-6 relative overflow-hidden border border-gray-700/20 min-h-[280px]">
                            <h3 className="text-white font-bold text-lg mb-3">
                                {t('reasons.kids.title')}
                            </h3>
                            <p className="text-gray-300 text-sm mb-12">
                                {t('reasons.kids.desc')}
                            </p>
                            <div className="absolute bottom-4 right-4">
                                <div className="bg-gradient-to-br from-pink-400 to-red-400 p-3 rounded-xl">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-black py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                        {t('faq.title')}
                    </h2>

                    <div className="space-y-2">
                        {/* FAQ Items mapped */}
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <div key={num} className="bg-gray-800 rounded-sm overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === num ? null : num)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-700/50 transition"
                                >
                                    <span className="text-white text-lg md:text-xl font-medium pr-4">
                                        {t(`faq.q${num}`)}
                                    </span>
                                    <svg
                                        className={`w-8 h-8 text-white flex-shrink-0 transition-transform ${openFaq === num ? 'rotate-45' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                {openFaq === num && (
                                    <div className="px-6 pb-6 text-white text-base md:text-lg border-t border-black">
                                        <p className="mt-4">{t(`faq.a${num}`)}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Movie Detail Modal */}
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

export default Home;
