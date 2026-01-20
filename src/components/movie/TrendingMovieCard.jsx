import { Link } from 'react-router-dom';

function TrendingMovieCard({ movie, index, onClick }) {
    const poster = movie?.movie_poster || null;
    const title = movie?.movie_title || 'Untitled';

    return (
        <div
            onClick={onClick}
            className="group relative flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] transition-transform duration-300 hover:scale-105 cursor-pointer"
        >
            {/* Ranking Number */}
            <div className="absolute -left-4 top-3/4 -translate-y-1/2 z-10">
                <span className="text-8xl font-black text-black transition-colors leading-none select-none stroke-text-white shadow-ranking">
                    {index + 1}
                </span>
            </div>

            {/* Movie Poster */}
            <div className="relative overflow-hidden rounded-md bg-netflix-darkGray">
                {poster ? (
                    <img
                        src={poster}
                        alt={title}
                        className="w-full h-[280px] object-cover group-hover:opacity-80 transition-opacity"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-[280px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-netflix-darkGray to-black border border-gray-700">
                        <span className="text-6xl mb-3">🎬</span>
                        <p className="text-gray-500 text-xs font-semibold px-4 text-center line-clamp-2">
                            {title}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TrendingMovieCard;
