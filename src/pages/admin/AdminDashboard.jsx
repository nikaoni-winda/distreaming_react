import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import AdminSidebar from '../../components/layout/AdminSidebar';

// Components
import ProfileDropdown from './components/ProfileDropdown';

// Tabs
import DashboardOverview from './tabs/DashboardOverview';
import MovieManagement from './tabs/MovieManagement';
import GenreManagement from './tabs/GenreManagement';
import ActorManagement from './tabs/ActorManagement';
import UserManagement from './tabs/UserManagement';
import ReviewManagement from './tabs/ReviewManagement';

function AdminDashboard() {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize activeTab from URL or default to 'dashboard'
    const initialTab = searchParams.get('tab') || 'dashboard';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Sync state when URL params change
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        } else if (!tab && activeTab !== 'dashboard') {
            setActiveTab('dashboard');
        }
    }, [searchParams, activeTab]);

    // Handle tab change by updating URL
    const handleTabChange = (tabId) => {
        setSearchParams({ tab: tabId });
        setActiveTab(tabId);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardOverview t={t} />;
            case 'movies': return <MovieManagement t={t} />;
            case 'genres': return <GenreManagement t={t} />;
            case 'actors': return <ActorManagement t={t} />;
            case 'users': return <UserManagement t={t} />;
            case 'reviews': return <ReviewManagement t={t} />;
            default: return <DashboardOverview t={t} />;
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <AdminSidebar
                activeTab={activeTab}
                onNavigate={handleTabChange}
                isSidebarOpen={isSidebarOpen}
            />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 bg-black min-h-screen flex flex-col">
                {/* Topbar */}
                <header className="h-16 bg-netflix-darkGray/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 sticky top-0 z-40">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white p-2"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <FaBars size={24} />
                    </button>

                    {/* Right Side Info */}
                    <div className="ml-auto flex items-center space-x-6">
                        {/* Language Switcher */}
                        <LanguageSwitcher />

                        <div className="h-6 w-px bg-gray-700"></div>

                        {/* Profile Dropdown */}
                        <ProfileDropdown user={user} logout={logout} />
                    </div>
                </header>

                {/* Content */}
                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                    {renderContent()}
                </div>
            </main>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}

export default AdminDashboard;
