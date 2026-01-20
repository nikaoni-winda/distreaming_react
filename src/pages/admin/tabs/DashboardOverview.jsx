import React, { useState, useEffect } from 'react';
import { FaFilm, FaTags, FaUserAstronaut, FaUsers, FaStar } from 'react-icons/fa';
import authService from '../../../services/authService';
import { getMovies } from '../../../services/movieService';
import { getGenres } from '../../../services/genreService';
import { getActors } from '../../../services/actorService';
import reviewService from '../../../services/reviewService';
import StatsCard from '../components/StatsCard';

const DashboardOverview = ({ t }) => {
    const [stats, setStats] = useState({
        movies: 0,
        genres: 0,
        actors: 0,
        users: 0,
        reviews: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch all data in parallel
                const [moviesRes, genresData, actorsData, usersData, reviewsData] = await Promise.all([
                    getMovies(),
                    getGenres(),
                    getActors(),
                    authService.getAllUsers(),
                    reviewService.getAllReviews()
                ]);

                setStats({
                    movies: moviesRes.pagination?.total_items || moviesRes.data?.length || 0,
                    genres: Array.isArray(genresData) ? genresData.length : (genresData.pagination?.total_items || genresData.data?.length || 0),
                    actors: actorsData.pagination?.total_items || actorsData.data?.length || 0,
                    users: usersData.pagination?.total_items || usersData.data?.length || 0,
                    reviews: reviewsData.pagination?.total_items || reviewsData.data?.length || 0
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">{t('admin.overview')}</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatsCard
                    icon={<FaFilm />}
                    title={t('admin.totalMovies')}
                    value={loading ? '...' : stats.movies}
                    color="text-blue-500"
                />
                <StatsCard
                    icon={<FaTags />}
                    title={t('admin.totalGenres')}
                    value={loading ? '...' : stats.genres}
                    color="text-green-500"
                />
                <StatsCard
                    icon={<FaUserAstronaut />}
                    title={t('admin.totalActors')}
                    value={loading ? '...' : stats.actors}
                    color="text-yellow-500"
                />
                <StatsCard
                    icon={<FaUsers />}
                    title={t('admin.totalUsers')}
                    value={loading ? '...' : stats.users}
                    color="text-purple-500"
                />
                <StatsCard
                    icon={<FaStar />}
                    title={t('admin.totalReviews')}
                    value={loading ? '...' : stats.reviews}
                    color="text-orange-500"
                />
            </div>

            {/* Quick Actions or Recent Activity could go here */}
            <div className="bg-netflix-darkGray p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4">{t('admin.welcome')}</h3>
                <p className="text-gray-400">{t('admin.welcomeSubtitle')}</p>
            </div>
        </div>
    );
};

export default DashboardOverview;
