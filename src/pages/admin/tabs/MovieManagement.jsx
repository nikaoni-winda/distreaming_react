import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch, FaFilm, FaStar, FaPen } from 'react-icons/fa';
import { getMovies } from '../../../services/movieService';
import Pagination from '../../../components/common/Pagination';

const MovieManagement = ({ t }) => {
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Reset page when search changes (handled by handleSearch, but robust here too)
    // Actually handleSearch sets page to 1. 

    // Fetch movies when page or debouncedSearch changes
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const response = await getMovies({
                    page,
                    per_page: 8,
                    search: debouncedSearch || undefined
                });
                setMovies(response.data || []);
                setPagination(response.pagination);
            } catch (error) {
                console.error("Error fetching movies", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [page, debouncedSearch]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleEdit = (movieId) => {
        navigate(`/admin/movies/edit/${movieId}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white">{t('admin.movieManagement')}</h2>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Add Movie Button */}
                    <button
                        onClick={() => navigate('/admin/movies/create')}
                        className="flex items-center gap-2 px-4 py-2 bg-netflix-red text-white font-bold text-sm rounded hover:bg-red-700 transition"
                    >
                        <FaPlus /> {t('admin.addMovie')}
                    </button>

                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder={t('admin.searchMovies')}
                            value={search}
                            onChange={handleSearch}
                            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:border-netflix-red placeholder-gray-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
                </div>
            ) : (
                <>
                    {movies.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {movies.map(movie => (
                                <div key={movie.movie_id} className="bg-netflix-darkGray rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition flex flex-col group">
                                    <div className="relative aspect-[2/3] w-full bg-gray-900">
                                        {movie.movie_poster ? (
                                            <img
                                                src={movie.movie_poster}
                                                alt={movie.movie_title}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                <FaFilm size={40} />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-yellow-500 flex items-center gap-1 text-xs font-bold shadow-lg">
                                            <FaStar /> {movie.average_rating}
                                        </div>
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-white font-bold text-sm mb-1 line-clamp-1" title={movie.movie_title}>
                                            {movie.movie_title}
                                        </h3>
                                        <p className="text-gray-400 text-xs mb-4">
                                            {movie.production_year} • {movie.movie_duration}m
                                        </p>

                                        <div className="mt-auto pt-2">
                                            <button
                                                onClick={() => handleEdit(movie.movie_id)}
                                                className="w-full py-2 bg-transparent border border-gray-600 hover:border-white hover:bg-white hover:text-black text-gray-300 text-sm font-medium rounded flex items-center justify-center gap-2 transition duration-200"
                                            >
                                                <FaPen size={12} /> {t('admin.editMovie')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-netflix-darkGray rounded-lg border border-gray-800">
                            <FaFilm className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                            <p className="text-gray-400">No movies found matching your search.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.total_pages > 1 && (
                        <div className="mt-8">
                            <Pagination
                                pagination={pagination}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MovieManagement;
