import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const Overview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalSpent: 0,
        activeOrders: 0,
        pendingDeliveries: 0,
        creditUsed: 0,
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 800);
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: 'Good Morning', emoji: '☀️' };
        if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
        return { text: 'Good Evening', emoji: '🌙' };
    };

    const greeting = getGreeting();

    const cards = [
        { label: 'Total Spent', value: `₹${stats.totalSpent}`, sub: 'This Month', icon: 'payments', emoji: '💸', color: 'indigo' },
        { label: 'Active Orders', value: stats.activeOrders, sub: 'In Transit', icon: 'local_shipping', emoji: '🚚', color: 'violet' },
        { label: 'Pending Pickups', value: stats.pendingDeliveries, sub: 'To Collect', icon: 'inventory_2', emoji: '📦', color: 'cyan' },
        { label: 'Credit Used', value: `₹${stats.creditUsed}`, sub: 'Of Limit', icon: 'credit_score', emoji: '💳', color: 'blue' },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 h-96 animate-pulse">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-2xl animate-spin mb-4"></div>
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Intelligence...</p>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 relative z-10 pb-20 xl:pb-8 animate-in fade-in duration-700">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-indigo-100/50">Vendor Portal</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider italic">System Live</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        {greeting.text}, {user?.fullName?.split(' ')[0] || 'Vendor'}!
                        <span className="inline-block animate-bounce animation-delay-500">{greeting.emoji}</span>
                    </h2>
                    <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-wide opacity-70">
                        Operational Intelligence & Performance Hub
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="px-5 py-3 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm group hover:border-indigo-200 transition-all cursor-default">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">verified_user</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Score</span>
                            <span className="text-sm font-black text-slate-800">Elite Tier</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        style={{ animationDelay: `${idx * 100}ms` }}
                        className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white/70 backdrop-blur-sm p-6 rounded-[2rem] border border-white shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(49,46,129,0.06)] hover:-translate-y-1.5 transition-all duration-500 group relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg 
                                    ${card.color === 'indigo' ? 'bg-indigo-600 text-white shadow-indigo-100' :
                                        card.color === 'violet' ? 'bg-violet-600 text-white shadow-violet-100' :
                                            card.color === 'cyan' ? 'bg-cyan-600 text-white shadow-cyan-100' :
                                                'bg-blue-600 text-white shadow-blue-100'}`}
                                >
                                    <span className="material-symbols-outlined text-[24px]">{card.icon}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600 transition-colors">{card.sub}</span>
                                    <span className="text-xs">{card.emoji}</span>
                                </div>
                            </div>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{card.label}</p>
                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{card.value}</h3>
                        </div>
                        {/* Decorative Gradient Blob */}
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    </div>
                ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Center Panel (Banners & Recent) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Premium Welcome Banner */}
                    <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-white/5 group animate-in zoom-in duration-700">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 group-hover:opacity-20 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-md">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
                                Market Live Access
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-6">
                                Fresh Harvest, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 italic">Directly to Your Doorstep.</span>
                            </h2>
                            <p className="text-indigo-100/70 max-w-lg mb-10 text-sm md:text-base font-medium leading-relaxed">
                                Experience the future of sourcing. Connect with verified farmers, access transparent pricing, and scale your business with ease.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate('/vendor-dashboard/market')}
                                    className="px-8 py-4 bg-white text-indigo-950 rounded-2xl font-black text-sm tracking-wide shadow-xl hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-3 group"
                                >
                                    <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">shopping_basket</span>
                                    Explore Mandi
                                </button>
                                <button
                                    onClick={() => navigate('/vendor-dashboard/orders')}
                                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black text-sm tracking-wide backdrop-blur-sm transition-all flex items-center gap-3"
                                >
                                    <span className="material-symbols-outlined text-[20px]">history</span>
                                    Track Orders
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Market Insights Placeholder */}
                    <div className="bg-white/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined">trending_up</span>
                                </div>
                                Recent Stock Updates
                            </h3>
                            <button className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Refresh Insights</button>
                        </div>
                        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-100 rounded-3xl group cursor-default hover:border-indigo-100 transition-colors">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-300 transition-all duration-500 transform group-hover:rotate-6">
                                <span className="material-symbols-outlined text-4xl">inventory_2</span>
                            </div>
                            <h4 className="font-black text-slate-800 mb-2">Build Your Inventory</h4>
                            <p className="text-slate-400 text-[13px] font-bold uppercase tracking-wide max-w-xs leading-relaxed">
                                Start sourcing from the market to see real-time logistics and inventory tracking here.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side Panels */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Elite Quick Actions */}
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-sm">
                        <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-500 text-[18px]">bolt</span>
                            Power Functions
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Recharge Wallet', sub: 'Add instant credit', icon: 'account_balance_wallet', path: 'wallet', color: 'indigo' },
                                { label: 'Business Profile', sub: 'Verify your shop', icon: 'badge', path: 'settings', color: 'violet' },
                                { label: 'Delivery Schedule', sub: 'Manage logistics', icon: 'schedule', path: 'orders', color: 'cyan' },
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigate(`/vendor-dashboard/${action.path}`)}
                                    className="w-full p-4 bg-slate-50/30 hover:bg-white rounded-[1.5rem] border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200 flex items-center gap-4 group"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110
                                        ${action.color === 'indigo' ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' :
                                            action.color === 'violet' ? 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white' :
                                                'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white'}`}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <span className="block text-sm font-black text-slate-800 tracking-tight">{action.label}</span>
                                        <span className="block text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{action.sub}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-600 transition-colors">arrow_forward_ios</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Analytics Card Placeholder */}
                    <div className="bg-gradient-to-br from-indigo-50/50 to-violet-50/50 p-8 rounded-[2.5rem] border border-white shadow-inner relative overflow-hidden group">
                        <div className="relative z-10 text-center">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-indigo-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">analytics</span>
                            </div>
                            <h3 className="font-black text-slate-800 text-sm mb-2">Weekly Summary</h3>
                            <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide opacity-80 leading-relaxed">
                                Sourcing intelligence will populate as you begin your business operations.
                            </p>
                        </div>
                        <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                    </div>
                </div>
            </div>

            <footer className="mt-8 pt-8 border-t border-slate-100 text-center animate-in fade-in duration-1000">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    © 2025 AgriConnect Diamond Console 💎 Alpha v0.1
                </p>
            </footer>
        </div>
    );
};

export default Overview;
