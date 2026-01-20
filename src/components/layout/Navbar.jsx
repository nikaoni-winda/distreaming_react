import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from '../common/LanguageSwitcher';

function Navbar() {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setMobileMenuOpen(false);
    };

    return (
        <nav className={`border-transparent py-2 transition-colors duration-300 ${mobileMenuOpen ? 'bg-black' : 'bg-gradient-to-b from-black to-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center">
                        <span className="text-2xl sm:text-3xl font-black text-netflix-red tracking-tight">
                            diStreaming
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-6">
                        <LanguageSwitcher />
                        {user ? (
                            <>
                                <span className="text-gray-300">
                                    <span className="font-semibold text-white">{user.user_nickname}</span>
                                    {user.user_role === 'admin' && (
                                        <span className="ml-2 px-2 py-1 bg-netflix-red/20 text-netflix-red text-xs font-bold rounded">
                                            ADMIN
                                        </span>
                                    )}
                                </span>

                                {user.user_role === 'admin' && (
                                    <Link
                                        to="/admin/dashboard"
                                        className="px-4 lg:px-5 py-2 bg-netflix-red hover:bg-netflix-darkRed text-white font-semibold rounded transition text-sm"
                                    >
                                        {t('nav.dashboard')}
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="px-4 lg:px-5 py-2 border border-gray-600 hover:border-white text-white rounded transition text-sm"
                                >
                                    {t('nav.signOut')}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 lg:px-5 py-2 text-white hover:text-gray-300 transition font-semibold text-sm"
                                >
                                    {t('nav.signIn')}
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 lg:px-5 py-2 bg-netflix-red hover:bg-netflix-darkRed text-white font-semibold rounded transition text-sm"
                                >
                                    {t('nav.signUp')}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="md:hidden flex items-center gap-3">
                        <LanguageSwitcher />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-white p-2 hover:bg-gray-800 rounded transition"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="py-4 border-t border-gray-800">
                        <div className="flex flex-col gap-3">
                            {user ? (
                                <>
                                    <div className="px-4 py-2 text-white border-b border-gray-800">
                                        <span className="font-semibold">{user.user_nickname}</span>
                                        {user.user_role === 'admin' && (
                                            <span className="ml-2 px-2 py-1 bg-netflix-red/20 text-netflix-red text-xs font-bold rounded">
                                                ADMIN
                                            </span>
                                        )}
                                    </div>
                                    {user.user_role === 'admin' && (
                                        <Link
                                            to="/admin/dashboard"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="px-4 py-2.5 bg-netflix-red hover:bg-netflix-darkRed text-white font-semibold rounded transition text-center"
                                        >
                                            {t('nav.dashboard')}
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2.5 border border-gray-600 hover:border-white text-white font-semibold rounded transition"
                                    >
                                        {t('nav.signOut')}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-2.5 text-white hover:bg-gray-800 font-semibold transition rounded text-center"
                                    >
                                        {t('nav.signIn')}
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-2.5 bg-netflix-red hover:bg-netflix-darkRed text-white font-semibold rounded transition text-center"
                                    >
                                        {t('nav.signUp')}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
