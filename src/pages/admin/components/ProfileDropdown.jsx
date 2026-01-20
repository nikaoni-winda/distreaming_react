import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUserAstronaut, FaSignOutAlt } from 'react-icons/fa';

const ProfileDropdown = ({ user, logout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-netflix-red text-white hover:bg-white hover:text-black transition overflow-hidden"
            >
                <FaUserAstronaut size={18} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-netflix-darkGray border border-gray-700 rounded shadow-xl z-20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-700">
                            <p className="text-sm text-white font-bold truncate">{user?.user_nickname}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.user_email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2 transition"
                        >
                            <FaSignOutAlt />
                            {t('auth.signOut') || 'Sign Out'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfileDropdown;
