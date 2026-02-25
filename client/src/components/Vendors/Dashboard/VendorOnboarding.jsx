import React from 'react';
import { useNavigate } from 'react-router-dom';

const VendorOnboarding = ({ userName, stats, onComplete }) => {
    const navigate = useNavigate();

    const steps = [
        {
            id: 1,
            title: "Bank Details",
            desc: "Add your bank account to enable daily limits and quick withdrawals.",
            icon: "account_balance",
            gradient: "from-blue-500 to-indigo-600",
            action: () => {
                onComplete();
                navigate('/vendor-dashboard/settings');
            },
            completed: stats?.bankComplete || false,
            btnText: "Update Bank Info"
        },
        {
            id: 2,
            title: "Market Access",
            desc: "Explore fresh vegetables from verified farmers in your local Mandi.",
            icon: "storefront",
            gradient: "from-violet-500 to-purple-600",
            action: () => {
                onComplete();
                navigate('/vendor-dashboard/market');
            },
            completed: stats?.firstOrderPlaced || false,
            btnText: "Visit Market"
        },
        {
            id: 3,
            title: "Verification",
            desc: "Submit your FSSAI/Business proof to gain premium buyer status.",
            icon: "verified",
            gradient: "from-cyan-500 to-teal-600",
            action: () => {
                onComplete();
                navigate('/vendor-dashboard/settings');
            },
            completed: stats?.isVerified || false,
            btnText: "Get Verified"
        }
    ];

    const completedCount = steps.filter(s => s.completed).length;
    const progress = (completedCount / steps.length) * 100;
    const allCompleted = steps.every(s => s.completed);

    return (
        <div className="p-4 sm:p-6 lg:p-12 max-w-[1200px] mx-auto flex flex-col justify-center min-h-[calc(100vh-140px)] relative z-10">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(49,46,129,0.08)] border border-white relative overflow-hidden animate-in fade-in zoom-in duration-500">
                {/* Background Aesthetics */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative z-20">
                    {/* Header Section */}
                    <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="relative inline-block mb-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl shadow-2xl shadow-indigo-200 flex items-center justify-center text-white transform rotate-6 hover:rotate-0 transition-transform duration-500 group">
                                <span className="material-symbols-outlined text-5xl group-hover:scale-110 transition-transform">waving_hand</span>
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                <span className="material-symbols-outlined text-indigo-600 text-xl">bolt</span>
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{userName}!</span> 🚀
                        </h2>
                        <p className="text-slate-500 text-lg font-bold max-w-2xl mx-auto uppercase tracking-wide opacity-80">
                            Your Vendor Journey starts here. Let's get your shop ready.
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="max-w-md mx-auto mb-16 animate-in fade-in duration-1000 delay-300">
                        <div className="flex justify-between items-end mb-3">
                            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em]">Onboarding Progress</span>
                            <span className="text-[14px] font-black text-slate-800">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner p-0.5">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 rounded-full transition-all duration-1000 cubic-bezier(0.4,0,0.2,1)"
                                style={{ width: `${progress}%` }}
                            >
                                <div className="w-full h-full bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Step Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, idx) => (
                            <div
                                key={step.id}
                                style={{ animationDelay: `${idx * 150}ms` }}
                                className={`group p-8 rounded-[2rem] border transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 
                                    ${step.completed
                                        ? 'bg-emerald-50/30 border-emerald-100/50 shadow-lg shadow-emerald-500/5'
                                        : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 hover:-rotate-1'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 
                                        ${step.completed ? 'bg-emerald-500 text-white' : `bg-white border border-slate-100 text-slate-700`}`}>
                                        <span className={`material-symbols-outlined text-3xl ${!step.completed && 'text-indigo-600'}`}>{step.icon}</span>
                                    </div>
                                    {step.completed && (
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
                                            <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-black text-slate-800 text-xl mb-3 tracking-tight">{step.title}</h4>
                                <p className="text-[14px] font-medium text-slate-500 leading-relaxed min-h-[60px]">{step.desc}</p>

                                <div className="mt-8 border-t border-slate-50 pt-8 relative z-30">
                                    {!step.completed ? (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); step.action(); }}
                                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-indigo-500/30 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                            {step.btnText}
                                        </button>
                                    ) : (
                                        <div className="w-full py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-sm text-center border border-emerald-100 flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">verified</span>
                                            Completed
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center animate-in fade-in duration-500 relative z-30">
                        <button
                            onClick={(e) => { e.stopPropagation(); onComplete(); }}
                            className={`group relative overflow-hidden px-10 py-5 rounded-[1.5rem] font-black text-[15px] tracking-[0.1em] uppercase transition-all duration-150 active:scale-95 cursor-pointer
                                ${allCompleted
                                    ? 'bg-slate-900 text-white shadow-2xl shadow-indigo-500/30 hover:bg-slate-800 hover:px-12'
                                    : 'bg-white text-slate-400 border border-slate-200 hover:text-indigo-600 hover:border-indigo-300'}`}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {allCompleted ? 'Launch Dashboard' : 'Skip for now'}
                                <span className={`material-symbols-outlined transition-transform duration-200 ${allCompleted ? 'group-hover:translate-x-2' : ''}`}>
                                    {allCompleted ? 'rocket_launch' : 'arrow_right_alt'}
                                </span>
                            </span>
                            {allCompleted && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-10 transition-opacity" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorOnboarding;
