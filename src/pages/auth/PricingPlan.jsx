import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';

function PricingPlan() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { register, loading } = useAuth();

    // Get user data passed from Register page
    const userData = location.state?.userData;

    // State for selected plan
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Protection: Redirect back to register if no data
    useEffect(() => {
        if (!userData) {
            navigate('/register');
        }
    }, [userData, navigate]);

    // Handle Subscribe
    const handleSubscribe = async () => {
        if (!userData || !selectedPlan) return;

        try {
            // Register user using the preserved data AND the selected plan
            await register({
                ...userData,
                plan: selectedPlan
            });

            // Standard flow: register success -> auto login -> dashboard
            // Note: register in authService handles auto-login by saving token
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed during plan selection:', error);
            // Optionally show error here
        }
    };

    const plans = [
        {
            id: 'mobile',
            name: t('pricing.mobile'),
            price: 'Rp54.000',
            quality: t('pricing.good'),
            resolution: '480p',
            devices: t('pricing.phoneTablet'),
            gradient: 'from-blue-600 to-blue-800'
        },
        {
            id: 'basic',
            name: t('pricing.basic'),
            price: 'Rp65.000',
            quality: t('pricing.good'),
            resolution: '720p',
            devices: t('pricing.allDevices'),
            gradient: 'from-indigo-600 to-purple-800'
        },
        {
            id: 'standard',
            name: t('pricing.standard'),
            price: 'Rp120.000',
            quality: t('pricing.better'),
            resolution: '1080p',
            devices: t('pricing.allDevices'),
            gradient: 'from-purple-600 to-pink-600'
        },
        {
            id: 'premium',
            name: t('pricing.premium'),
            price: 'Rp186.000',
            quality: t('pricing.best'),
            resolution: '4K + HDR',
            devices: t('pricing.allDevices'),
            gradient: 'from-netflix-red to-red-900',
            popular: true
        }
    ];

    if (!userData) return null;

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col justify-center py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('pricing.title')}</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
                    {plans.map((plan) => {
                        const isSelected = selectedPlan === plan.id;

                        return (
                            <div
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id)}
                                className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 transform 
                                    ${isSelected
                                        ? 'border-netflix-red scale-105 shadow-[0_0_30px_rgba(229,9,20,0.5)] z-10'
                                        : 'border-gray-800 hover:border-gray-600 hover:scale-102'
                                    } 
                                    bg-gray-900 flex flex-col`}
                            >
                                {plan.popular && !isSelected && (
                                    <div className="bg-netflix-red text-white text-xs font-bold text-center py-1 absolute top-0 w-full z-20">
                                        {t('pricing.mostPopular')}
                                    </div>
                                )}

                                {isSelected && (
                                    <div className="bg-netflix-red text-white text-xs font-bold text-center py-1 absolute top-0 w-full z-20 flex items-center justify-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Selected
                                    </div>
                                )}

                                {/* Plan Header with Gradient */}
                                <div className={`p-6 bg-gradient-to-br ${plan.gradient} pt-10`}>
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-lg font-semibold opacity-90">{plan.resolution}</p>
                                </div>

                                {/* Plan Details */}
                                <div className="p-6 flex-1 flex flex-col gap-4 text-gray-300 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs font-semibold mb-1">{t('pricing.monthlyPrice')}</p>
                                        <p className="text-white text-lg font-bold">{plan.price}</p>
                                    </div>
                                    <div className="h-px bg-gray-800 w-full my-1"></div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-semibold mb-1">{t('pricing.videoQuality')}</p>
                                        <p className="text-white font-medium">{plan.quality}</p>
                                    </div>
                                    <div className="h-px bg-gray-800 w-full my-1"></div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-semibold mb-1">{t('pricing.resolution')}</p>
                                        <p className="text-white font-medium">{plan.resolution}</p>
                                    </div>
                                    <div className="h-px bg-gray-800 w-full my-1"></div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-semibold mb-1">{t('pricing.devices')}</p>
                                        <p className="text-white font-medium">{plan.devices}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Single Subscribe Button at Bottom */}
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleSubscribe}
                        disabled={loading || !selectedPlan}
                        className="w-full py-4 bg-netflix-red hover:bg-netflix-darkRed disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-xl font-bold rounded transition-all transform active:scale-95 shadow-lg"
                    >
                        {loading ? 'Processing...' : t('pricing.subscribe')}
                    </button>
                    {!selectedPlan && (
                        <p className="text-center text-gray-500 text-sm mt-3 animate-pulse">
                            Please select a plan to continue
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PricingPlan;
