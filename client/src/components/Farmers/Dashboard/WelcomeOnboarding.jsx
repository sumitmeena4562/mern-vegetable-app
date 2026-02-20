import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeOnboarding = ({ userName, stats }) => {
    const navigate = useNavigate();

    const steps = [
        {
            id: 1,
            title: "Add Farm Details",
            desc: "Complete your farm profile to build trust with vendors.",
            icon: "home_work",
            action: () => navigate('/farmer-dashboard/settings'),
            completed: stats.profileComplete,
            btnText: "Update Profile"
        },
        {
            id: 2,
            title: "List First Sabji",
            desc: "Add your fresh harvest to the marketplace now.",
            icon: "add_shopping_cart",
            action: () => navigate('/farmer-dashboard/add-sabji'),
            completed: stats.productsCount > 0,
            btnText: "Add Product"
        },
        {
            id: 3,
            title: "Identity Verification",
            desc: "Verify your account to get the 'Verified Farmer' badge.",
            icon: "verified_user",
            action: () => navigate('/farmer-dashboard/settings'),
            completed: stats.isVerified,
            btnText: "Verify Now"
        }
    ];

    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-glass border border-white/50 mb-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full translate-x-20 -translate-y-20 opacity-60"></div>

            <div className="relative z-10">
                <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 italic">Namaste, {userName}! 🙏</h2>
                    <p className="text-slate-500 mt-2 text-lg">AgriConnect par aapka swagat hai. Apna kaam shuru karne ke liye niche diye gaye steps follow karein.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={`p-6 rounded-2xl border ${step.completed ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-100 hover:border-green-200'} transition-all group`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${step.completed ? 'bg-green-100 text-green-600' : 'bg-white text-slate-400 group-hover:text-green-500'} shadow-sm`}>
                                    <span className="material-symbols-outlined">{step.icon}</span>
                                </div>
                                {step.completed && (
                                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                                )}
                            </div>
                            <h4 className="font-bold text-slate-800 mb-1">{step.title}</h4>
                            <p className="text-xs text-slate-500 mb-4">{step.desc}</p>

                            {!step.completed && (
                                <button
                                    onClick={step.action}
                                    className="w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all"
                                >
                                    {step.btnText}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WelcomeOnboarding;
