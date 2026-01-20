import {
    FaChartLine,
    FaFilm,
    FaTags,
    FaUsers,
    FaUserAstronaut,
    FaStar
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const AdminSidebar = ({ activeTab, setActiveTab, isSidebarOpen, onNavigate }) => {
    const { t } = useTranslation();

    const menuItems = [
        { id: 'dashboard', label: t('admin.dashboard'), icon: <FaChartLine /> },
        { type: 'divider', text: t('admin.content') },
        { id: 'movies', label: t('admin.movies'), icon: <FaFilm /> },
        { id: 'genres', label: t('admin.genres'), icon: <FaTags /> },
        { id: 'actors', label: t('admin.actors'), icon: <FaUserAstronaut /> },
        { type: 'divider', text: t('admin.userManagement') },
        { id: 'users', label: t('admin.users'), icon: <FaUsers /> },
        { id: 'reviews', label: t('admin.reviews'), icon: <FaStar /> },
    ];

    const handleItemClick = (itemId) => {
        if (onNavigate) {
            onNavigate(itemId);
        } else if (setActiveTab) {
            setActiveTab(itemId);
        }
    };

    return (
        <aside
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-netflix-darkGray border-r border-gray-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
            <div className="h-16 flex items-center px-6 border-b border-gray-800">
                <span className="text-netflix-red text-2xl font-black tracking-tight">diStreaming</span>
                <span className="ml-2 px-1.5 py-0.5 bg-gray-800 text-gray-400 text-[10px] font-bold rounded uppercase tracking-wider">Admin</span>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
                {menuItems.map((item, index) => (
                    item.type === 'divider' ? (
                        <div key={`div-${index}`} className="px-3 pt-4 pb-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.text}</p>
                        </div>
                    ) : (
                        <button
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md transition-colors ${activeTab === item.id
                                    ? 'bg-netflix-red text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </button>
                    )
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar;
