import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from '../common/LanguageSwitcher';

function UserNavbar() {
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
                    <Link to="/dashboard" className="flex items-center">
                        <span className="text-netflix-red text-2xl font-black">diStreaming</span>
                    </Link>

                    {/* Right Side - Language Toggle + Profile */}
                    <div className="flex items-center gap-8">
                        {/* Language Switcher */}
                        <LanguageSwitcher />

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="flex items-center gap-2 hover:opacity-80 transition focus:outline-none"
                                aria-label="Profile menu"
                            >
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-netflix-red to-red-700 text-white shadow-md">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
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
                                    <div className="absolute right-0 mt-2 w-56 bg-black border border-gray-700 rounded-md shadow-lg py-1 z-20">
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-gray-700">
                                            <p className="text-sm text-white font-semibold truncate">{user?.user_nickname}</p>
                                            <p className="text-xs text-gray-400 truncate">{user?.user_email}</p>
                                        </div>

                                        {/* Profile Link */}
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gray-800 transition"
                                            onClick={() => setShowProfileDropdown(false)}
                                        >
                                            <FaUser className="text-gray-400" />
                                            <span>Profile Details</span>
                                        </Link>

                                        {/* Sign Out */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-gray-800 transition"
                                        >
                                            <FaSignOutAlt className="text-gray-400" />
                                            <span>Sign Out</span>
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

export default UserNavbar;
