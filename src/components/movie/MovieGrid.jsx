import PropTypes from 'prop-types';

function MovieGrid({ movies, onMovieClick, loading = false }) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {[...Array(12)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="bg-gray-800 aspect-[2/3] rounded-lg"></div>
                        <div className="h-4 bg-gray-800 rounded mt-2"></div>
                        <div className="h-3 bg-gray-800 rounded mt-1 w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!movies || movies.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No movies found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
                <div
                    key={movie.movie_id}
                    onClick={() => onMovieClick(movie)}
                    className="group cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                    {/* Movie Card */}
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 shadow-lg">
                        {/* Poster Image */}
                        {movie.movie_poster ? (
                            <img
                                src={movie.movie_poster}
                                alt={movie.movie_title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                                <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                </svg>
                            </div>
                        )}

                        {movie.rating_class === 'Top Rated' && (
                            <div className="absolute top-2 left-2">
                                <span className="px-2 py-1 bg-netflix-red text-white text-xs font-bold rounded">
                                    FEATURED
                                </span>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {movie.average_rating && (
                            <div className="absolute bottom-2 right-2">
                                <div className="flex items-center gap-1 px-2 py-1 bg-black/80 rounded">
                                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-white text-xs font-semibold">{movie.average_rating}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-2">
                        <h3 className="text-white text-sm font-semibold line-clamp-2 group-hover:text-netflix-red transition-colors">
                            {movie.movie_title}
                        </h3>
                        <p className="text-gray-400 text-xs mt-0.5">
                            {movie.production_year}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

MovieGrid.propTypes = {
    movies: PropTypes.array.isRequired,
    onMovieClick: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

export default MovieGrid;
