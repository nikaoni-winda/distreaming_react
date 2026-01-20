import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded text-sm font-semibold transition ${i18n.language === 'en'
                        ? 'bg-netflix-red text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => changeLanguage('id')}
                className={`px-3 py-1 rounded text-sm font-semibold transition ${i18n.language === 'id'
                        ? 'bg-netflix-red text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
            >
                ID
            </button>
        </div>
    );
}

export default LanguageSwitcher;
