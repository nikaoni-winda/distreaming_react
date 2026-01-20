import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        user_nickname: '',
        user_email: '',
        password: '',
        password_confirmation: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        // Redirect to Pricing Plan page with user data
        // Simulate a small delay for better UX
        setTimeout(() => {
            navigate('/pricing', { state: { userData: formData } });
        }, 500);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-netflix-darkGray/20 to-black"></div>

            <div className="max-w-md w-full relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-black text-netflix-red mb-3 tracking-tight">
                        diStreaming
                    </h1>
                    <p className="text-gray-400 text-lg">{t('auth.createAccount')}</p>
                </div>

                {/* Register Card */}
                <div className="bg-black/70 backdrop-blur-md rounded-md p-8 md:p-12 border border-netflix-darkGray">
                    <h2 className="text-3xl font-bold text-white mb-8">{t('auth.signUp')}</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-netflix-red/10 border border-netflix-red text-netflix-red px-4 py-3 rounded text-sm">
                                {error}
                            </div>
                        )}

                        {/* Nickname Input */}
                        <div>
                            <input
                                type="text"
                                id="user_nickname"
                                name="user_nickname"
                                value={formData.user_nickname}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-netflix-darkGray border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition"
                                placeholder={t('auth.nickname')}
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <input
                                type="email"
                                id="user_email"
                                name="user_email"
                                value={formData.user_email}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-netflix-darkGray border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition"
                                placeholder={t('auth.emailAddress')}
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                className="w-full px-5 py-4 bg-netflix-darkGray border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition"
                                placeholder={t('auth.passwordMin')}
                            />
                        </div>

                        {/* Password Confirmation */}
                        <div>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                required
                                className="w-full px-5 py-4 bg-netflix-darkGray border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition"
                                placeholder={t('auth.confirmPassword')}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-netflix-red hover:bg-netflix-darkRed text-white font-bold py-4 px-4 rounded transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-6"
                        >
                            {loading ? t('auth.creatingAccount') : t('auth.signUp')}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-8 mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-black/70 text-gray-500">{t('common.or')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="text-center">
                        <p className="text-gray-400">
                            {t('auth.alreadyHave')}{' '}
                            <Link to="/login" className="text-white hover:underline font-semibold">
                                {t('auth.signInPrompt')}
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-8 text-center">
                    <Link to="/" className="text-gray-500 hover:text-white transition text-sm">
                        ← {t('auth.backToHome')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
