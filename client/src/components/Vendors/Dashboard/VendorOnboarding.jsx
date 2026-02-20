import React from 'react';
import { useNavigate } from 'react-router-dom';

const VendorOnboarding = ({ userName, stats, onComplete }) => {
    const navigate = useNavigate();

    const steps = [
        {
            id: 1,
            title: "Add Bank Details",
            desc: "Complete your bank profile to enable limits and withdrawals.",
            icon: "account_balance",
            action: () => navigate('/vendor-dashboard/settings'),
            completed: stats?.bankComplete || false,
            btnText: "Add Bank Info"
        },
        {
            id: 2,
            title: "Explore Market",
            desc: "Browse fresh produce from verified farmers near you.",
            icon: "storefront",
            action: () => navigate('/vendor-dashboard/market'),
            completed: stats?.firstOrderPlaced || false,
            btnText: "Visit Market"
        },
        {
            id: 3,
            title: "Business Verification",
            desc: "Verify your FSSAI and business details to become a trusted buyer.",
            icon: "verified",
            action: () => navigate('/vendor-dashboard/settings'),
            completed: stats?.isVerified || false,
            btnText: "Upload Docs"
        }
    ];

    // Check if all essential steps are done to allow dismissing the onboarding
    const allCompleted = steps.every(s => s.completed);

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex flex-col justify-center min-h-[calc(100vh-80px)]">
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-blue-50 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full translate-x-20 -translate-y-20 opacity-80 blur-2xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-50 rounded-full -translate-x-20 translate-y-20 opacity-80 blur-2xl pointer-events-none"></div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg shadow-blue-200 mb-6 text-white rotate-3">
                            <span className="material-symbols-outlined text-4xl">waving_hand</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-3">Welcome to AgriConnect, {userName}!</h2>
                        <p className="text-slate-500 text-lg font-medium">Your vendor account is successfully created. Complete these quick steps to start buying fresh produce directly from farmers.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`p-6 rounded-2xl border-2 flex flex-col bg-white ${step.completed ? 'border-emerald-200 shadow-sm shadow-emerald-100' : 'border-slate-100 hover:border-blue-200 hover:shadow-md hover:-translate-y-1'} transition-all duration-300 group`}
                            >
                                <div className="flex justify-between items-start mb-5">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'} transition-colors`}>
                                        <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                                    </div>
                                    {step.completed && (
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                                            <span className="material-symbols-outlined text-[20px]">check</span>
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-bold text-slate-800 text-lg mb-2">{step.title}</h4>
                                <p className="text-sm font-medium text-slate-500 mb-6 flex-1">{step.desc}</p>

                                {!step.completed ? (
                                    <button
                                        onClick={step.action}
                                        className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95"
                                    >
                                        {step.btnText}
                                    </button>
                                ) : (
                                    <div className="w-full py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-center border border-emerald-100">
                                        Completed
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <button
                            onClick={onComplete}
                            className={`px-8 py-4 rounded-xl font-bold transition-all ${allCompleted ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-95' : 'bg-white text-slate-500 border-2 border-slate-200 hover:border-slate-300 hover:text-slate-700'}`}
                        >
                            {allCompleted ? 'Go to Dashboard' : 'Skip for now, go to Dashboard'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorOnboarding;
