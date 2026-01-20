import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from '../common/LanguageSwitcher';

function AdminNavbar() {
    const { user, logout } = useAuth();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const handleLogout = async () => {
        await logout();
        setShowProfileDropdown(false);
    };

    return (
        <nav className="bg-black border-b border-gray-800 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/admin/dashboard" className="flex items-center gap-2">
                        <span className="text-netflix-red text-2xl font-black">diStreaming</span>
                        <span className="px-2 py-0.5 bg-netflix-red text-white text-xs font-bold rounded">ADMIN</span>
                    </Link>

                    {/* Right Side - Language Toggle + Profile */}
                    <div className="flex items-center gap-8">
                        {/* Language Switcher */}
                        <LanguageSwitcher />

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="flex items-center gap-2 hover:opacity-80 transition"
                                aria-label="Profile menu"
                            >
                                <FaUserCircle className="text-white text-3xl" />
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileDropdown && (
                                <>
                                    {/* Backdrop */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowProfileDropdown(false)}
                                    ></div>

                                    {/* Dropdown Content */}
                                    <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-700 rounded-md shadow-lg py-1 z-20">
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-gray-700">
                                            <p className="text-sm text-white font-semibold">{user?.user_nickname}</p>
                                            <p className="text-xs text-gray-400">{user?.user_email}</p>
                                            <p className="text-xs text-netflix-red mt-1">Admin Account</p>
                                        </div>

                                        {/* Profile Link */}
                                        <Link
                                            to="/admin/profile"
                                            className="block px-4 py-2 text-sm text-white hover:bg-gray-800 transition"
                                            onClick={() => setShowProfileDropdown(false)}
                                        >
                                            Profile Details
                                        </Link>

                                        {/* Sign Out */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 transition"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default AdminNavbar;
