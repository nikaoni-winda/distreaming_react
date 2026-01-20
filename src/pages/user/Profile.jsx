import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import UserNavbar from '../../components/layout/UserNavbar';
import Footer from '../../components/layout/Footer';
import api from '../../config/api';

function Profile() {
    const { t } = useTranslation();
    const { user, updateUser } = useAuth();

    // Profile Form state
    const [formData, setFormData] = useState({
        user_email: user?.user_email || '',
        user_nickname: user?.user_nickname || '',
        password: '',
        password_confirmation: ''
    });

    // Plan state
    const [selectedPlan, setSelectedPlan] = useState(user?.plan || '');

    // Loading states
    const [profileLoading, setProfileLoading] = useState(false);
    const [planLoading, setPlanLoading] = useState(false);

    // Messages
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [planMessage, setPlanMessage] = useState({ type: '', text: '' });

    // Plan definitions
    const plans = [
        {
            id: 'mobile',
            name: t('pricing.mobile') || 'Mobile',
            price: 'Rp54.000',
            quality: t('pricing.good') || 'Good',
            resolution: '480p',
            devices: t('pricing.phoneTablet') || 'Phone, Tablet',
            gradient: 'from-blue-600 to-blue-800'
        },
        {
            id: 'basic',
            name: t('pricing.basic') || 'Basic',
            price: 'Rp65.000',
            quality: t('pricing.good') || 'Good',
            resolution: '720p',
            devices: t('pricing.allDevices') || 'Phone, Tablet, Computer, TV',
            gradient: 'from-indigo-600 to-purple-800'
        },
        {
            id: 'standard',
            name: t('pricing.standard') || 'Standard',
            price: 'Rp120.000',
            quality: t('pricing.better') || 'Better',
            resolution: '1080p',
            devices: t('pricing.allDevices') || 'Phone, Tablet, Computer, TV',
            gradient: 'from-purple-600 to-pink-600'
        },
        {
            id: 'premium',
            name: t('pricing.premium') || 'Premium',
            price: 'Rp186.000',
            quality: t('pricing.best') || 'Best',
            resolution: '4K + HDR',
            devices: t('pricing.allDevices') || 'Phone, Tablet, Computer, TV',
            gradient: 'from-netflix-red to-red-900',
            popular: true
        }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage({ type: '', text: '' });

        // Validate passwords if provided
        if (formData.password || formData.password_confirmation) {
            if (formData.password !== formData.password_confirmation) {
                setProfileMessage({ type: 'error', text: 'Passwords do not match!' });
                setProfileLoading(false);
                return;
            }
            if (formData.password.length < 8) {
                setProfileMessage({ type: 'error', text: 'Password must be at least 8 characters!' });
                setProfileLoading(false);
                return;
            }
        }

        try {
            const updateData = {
                user_email: formData.user_email,
                user_nickname: formData.user_nickname,
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            const response = await api.put(`/users/${user.user_id}`, updateData);

            if (response.data.success) {
                updateUser({
                    ...user,
                    user_email: formData.user_email,
                    user_nickname: formData.user_nickname
                });

                setProfileMessage({ type: 'success', text: 'Profile details updated successfully!' });
                setFormData({
                    ...formData,
                    password: '',
                    password_confirmation: ''
                });
            }
        } catch (error) {
            setProfileMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setProfileLoading(false);
        }
    };

    const handleUpdatePlan = async () => {
        if (!selectedPlan) return;
        if (selectedPlan === user.plan) {
            setPlanMessage({ type: 'info', text: 'You are already subscribed to this plan.' });
            return;
        }

        setPlanLoading(true);
        setPlanMessage({ type: '', text: '' });

        try {
            const updateData = {
                plan: selectedPlan
            };

            const response = await api.put(`/users/${user.user_id}`, updateData);

            if (response.data.success) {
                updateUser({
                    ...user,
                    plan: selectedPlan
                });
                setPlanMessage({ type: 'success', text: 'Subscription plan updated successfully!' });
            }
        } catch (error) {
            setPlanMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update plan'
            });
        } finally {
            setPlanLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <UserNavbar />

            <div className="flex-grow flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-7xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            {t('admin.profileDetails')}
                        </h1>
                        <p className="text-gray-400">
                            Manage your account and subscription
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* LEFT COLUMN: User Details */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-netflix-darkGray rounded-lg border border-gray-800 overflow-hidden h-full flex flex-col">
                                <div className="bg-gradient-to-b from-gray-900 to-netflix-darkGray p-6 text-center border-b border-gray-800">
                                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-netflix-red to-red-700 text-white mb-3 shadow-lg">
                                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold">{user?.user_nickname}</h2>
                                    <p className="text-gray-400 text-sm mt-1">{user?.user_email}</p>
                                    <div className="mt-3 inline-block px-3 py-1 bg-gray-800 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-300">
                                        Current Plan: <span className="text-white">{user?.plan || 'None'}</span>
                                    </div>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="p-6 space-y-4 flex-grow flex flex-col justify-center">
                                    {profileMessage.text && (
                                        <div className={`p-3 rounded-lg text-sm ${profileMessage.type === 'success' ? 'bg-green-900/50 text-green-200' : profileMessage.type === 'info' ? 'bg-blue-900/50 text-blue-200' : 'bg-red-900/50 text-red-200'}`}>
                                            {profileMessage.text}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('common.email')}</label>
                                        <input
                                            type="email"
                                            name="user_email"
                                            value={formData.user_email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-netflix-red transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">{t('auth.nickname')}</label>
                                        <input
                                            type="text"
                                            name="user_nickname"
                                            value={formData.user_nickname}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-netflix-red transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">New Password (optional)</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Leave blank to keep current"
                                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-netflix-red transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="password_confirmation"
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                            placeholder="Confirm new password"
                                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-netflix-red transition"
                                        />
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={profileLoading}
                                            className="w-full px-6 py-3 bg-netflix-red hover:bg-netflix-darkRed disabled:opacity-50 text-white font-bold rounded-lg transition duration-200 shadow-md"
                                        >
                                            {profileLoading ? 'Saving...' : 'Update Profile'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Plan Selection */}
                        <div className="w-full lg:w-2/3">
                            <div className="bg-netflix-darkGray rounded-lg border border-gray-800 p-6 h-full flex flex-col justify-between">
                                <div className="flex-grow flex flex-col">
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <span className="text-netflix-red">★</span> Change Subscription Plan
                                    </h2>

                                    {planMessage.text && (
                                        <div className={`mb-6 p-4 rounded-lg text-sm ${planMessage.type === 'success' ? 'bg-green-900/50 border border-green-800 text-green-200' : planMessage.type === 'info' ? 'bg-blue-900/50 border border-blue-800 text-blue-200' : 'bg-red-900/50 border border-red-800 text-red-200'}`}>
                                            {planMessage.text}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow content-stretch">
                                        {plans.map((plan) => {
                                            const isSelected = selectedPlan === plan.id;
                                            const isCurrent = user?.plan === plan.id;
                                            return (
                                                <div
                                                    key={plan.id}
                                                    onClick={() => setSelectedPlan(plan.id)}
                                                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 transform h-full
                                                ${isSelected
                                                            ? 'border-netflix-red scale-[1.02] shadow-lg z-10'
                                                            : 'border-gray-800 hover:border-gray-600 hover:scale-[1.01]'
                                                        } 
                                                bg-black flex flex-col group`}
                                                >
                                                    {/* Gradient Header */}
                                                    <div className={`p-4 bg-gradient-to-r ${plan.gradient} bg-opacity-90`}>
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="text-lg font-bold text-white shadow-sm">{plan.name}</h3>
                                                                <p className="text-sm text-white/90 font-medium">{plan.resolution}</p>
                                                            </div>
                                                            {isCurrent && (
                                                                <span className="bg-white text-netflix-red text-xs font-bold px-2 py-1 rounded-full uppercase">Current</span>
                                                            )}
                                                            {isSelected && !isCurrent && (
                                                                <div className="bg-white text-netflix-red rounded-full p-1 shadow-sm">
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Details */}
                                                    <div className="p-4 flex-1 flex flex-col justify-between text-sm text-gray-400">
                                                        <div className="flex justify-between border-b border-gray-800 pb-2">
                                                            <span>Price</span>
                                                            <span className="text-white font-semibold">{plan.price}</span>
                                                        </div>
                                                        <div className="flex justify-between border-b border-gray-800 pb-2">
                                                            <span>Quality</span>
                                                            <span className="text-white">{plan.quality}</span>
                                                        </div>
                                                        <div className="flex justify-between pt-1">
                                                            <span>Devices</span>
                                                            <span className="text-white text-right max-w-[60%] leading-tight">{plan.devices}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mt-8 pt-4">
                                    <button
                                        onClick={handleUpdatePlan}
                                        disabled={planLoading || !selectedPlan || selectedPlan === user?.plan}
                                        className="w-full py-3 bg-white hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed text-black font-bold rounded-lg text-lg transition duration-200 shadow-md"
                                    >
                                        {planLoading ? 'Processing...' : 'Update Plan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Profile;
