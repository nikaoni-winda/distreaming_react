import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPen, FaSearch } from 'react-icons/fa';
import authService from '../../../services/authService';
import Pagination from '../../../components/common/Pagination';

const UserManagement = ({ t }) => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [pagination, setPagination] = useState(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await authService.getAllUsers({
                    page,
                    per_page: 10,
                    search: debouncedSearch || undefined
                });
                setUsers(response.data);
                setPagination(response.pagination);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [page, debouncedSearch]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to page 1 on new search
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-white">{t('admin.userManagement')}</h2>

                {/* Search Bar */}
                <div className="relative flex-1 md:w-64 md:max-w-md ml-auto">
                    <input
                        type="text"
                        placeholder={t('admin.searchUser')}
                        value={search}
                        onChange={handleSearch}
                        className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:border-netflix-red placeholder-gray-500"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-500" />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
                </div>
            ) : (
                <>
                    <div className="bg-netflix-darkGray overflow-hidden rounded-lg border border-gray-800">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-800">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('auth.nickname')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('common.email')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('common.plan')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">{t('common.role')}</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {users.map((user) => (
                                        <tr key={user.user_id} className="hover:bg-gray-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                                                    {user.user_nickname ? user.user_nickname.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                {user.user_nickname}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.user_email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">{user.plan || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {user.role !== 'admin' && (
                                                    <button
                                                        className="text-gray-400 hover:text-white transition"
                                                        title="Edit Profile"
                                                        onClick={() => navigate(`/admin/users/edit/${user.user_id}`)}
                                                    >
                                                        <FaPen />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {users.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No users found.
                            </div>
                        )}
                    </div>

                    {pagination && pagination.total_pages > 1 && (
                        <div className="mt-4">
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

export default UserManagement;
