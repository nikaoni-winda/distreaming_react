import { useTranslation } from 'react-i18next';

function Footer() {
    const { t } = useTranslation();

    const footerLinks = {
        col1: [
            { key: 'faq', label: t('footer.faq'), href: '#' },
            { key: 'investor', label: t('footer.investorRelations'), href: '#' },
            { key: 'watch', label: t('footer.wayToWatch'), href: '#' },
            { key: 'corporate', label: t('footer.corporateInfo'), href: '#' },
            { key: 'only', label: t('footer.onlyOndiStreaming'), href: '#' },
        ],
        col2: [
            { key: 'help', label: t('footer.helpCenter'), href: '#' },
            { key: 'jobs', label: t('footer.jobs'), href: '#' },
            { key: 'terms', label: t('footer.terms'), href: '#' },
            { key: 'contact', label: t('footer.contactUs'), href: '#' },
        ],
        col3: [
            { key: 'account', label: t('footer.account'), href: '#' },
            { key: 'redeem', label: t('footer.redeemGiftCard'), href: '#' },
            { key: 'privacy', label: t('footer.privacy'), href: '#' },
            { key: 'speed', label: t('footer.speedTest'), href: '#' },
        ],
        col4: [
            { key: 'media', label: t('footer.mediaCenter'), href: '#' },
            { key: 'buy', label: t('footer.buyGiftCard'), href: '#' },
            { key: 'cookie', label: t('footer.cookiePreferences'), href: '#' },
            { key: 'legal', label: t('footer.legalNotices'), href: '#' },
        ],
    };

    return (
        <footer className="bg-black border-t border-gray-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="text-gray-400 text-sm">
                        {t('footer.question')}{' '}
                        <a href="tel:007-803-321-8275" className="underline hover:text-gray-300 transition">
                            007-803-321-8275
                        </a>
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="space-y-3">
                        {footerLinks.col1.map((link) => (
                            <a
                                key={link.key}
                                href={link.href}
                                className="block text-gray-400 text-sm hover:underline transition"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {footerLinks.col2.map((link) => (
                            <a
                                key={link.key}
                                href={link.href}
                                className="block text-gray-400 text-sm hover:underline transition"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {footerLinks.col3.map((link) => (
                            <a
                                key={link.key}
                                href={link.href}
                                className="block text-gray-400 text-sm hover:underline transition"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {footerLinks.col4.map((link) => (
                            <a
                                key={link.key}
                                href={link.href}
                                className="block text-gray-400 text-sm hover:underline transition"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="text-gray-500 text-xs">
                    <p>© 2026 diStreaming</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
