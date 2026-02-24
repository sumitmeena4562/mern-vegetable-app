import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
// import api from '../../../api/axios';

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
        // In future, fetch stats from vendor analytics API
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    // Time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return { text: 'Good Morning', emoji: '☀️' };
        if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
        return { text: 'Good Evening', emoji: '🌙' };
    };

    const greeting = getGreeting();

    const cards = [
        { label: 'Total Spent', value: `₹${stats.totalSpent}`, sub: 'This Month', icon: 'account_balance_wallet', emoji: '💸', gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', textColor: 'text-blue-700' },
        { label: 'Active Orders', value: stats.activeOrders, sub: 'In Transit', icon: 'local_shipping', emoji: '🚚', gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', textColor: 'text-amber-700' },
        { label: 'Pending Pickups', value: stats.pendingDeliveries, sub: 'To Collect', icon: 'inventory_2', emoji: '📦', gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', textColor: 'text-emerald-700' },
        { label: 'Credit Used', value: `₹${stats.creditUsed}`, sub: 'Of Limit', icon: 'credit_card', emoji: '💳', gradient: 'from-purple-500 to-violet-600', bg: 'bg-purple-50', textColor: 'text-purple-700' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 h-64">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-4 md:gap-6 relative z-10 pb-20 xl:pb-8">
            {/* Background Glow */}
            <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-blue-50/20 pointer-events-none -z-10" />

            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-800">
                        {greeting.text}, {user?.fullName?.split(' ')[0] || 'Vendor'}! {greeting.emoji}
                    </h2>
                    <p className="text-slate-400 font-medium text-sm mt-1">
                        Here's your business performance summary for today.
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-none px-3 py-2 bg-white rounded-xl text-xs font-bold text-slate-600 border border-slate-100 flex items-center justify-center gap-1.5 shadow-sm">
                        <span className="material-symbols-outlined text-indigo-500 text-base">check_circle</span>
                        Tasks: 2/5
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                <span className="text-xl">{card.emoji}</span>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-wider ${card.textColor} ${card.bg} px-3 py-1.5 rounded-xl border border-${card.textColor.replace('text-', '')}/20`}>
                                {card.sub}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{card.label}</p>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{card.value}</h3>
                    </div>
                ))}
            </div>

            {/* Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">

                {/* Left Panel */}
                <div className="lg:col-span-8 flex flex-col gap-4 md:gap-6">
                    {/* Welcome Banner / Call to action */}
                    <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-3xl p-8 shadow-xl relative overflow-hidden border border-white/10">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[80px] translate-x-1/3 -translate-y-1/3 mix-blend-screen"></div>
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/20 rounded-full blur-[60px] -translate-x-1/3 translate-y-1/3 mix-blend-screen"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                            <div className="max-w-xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold mb-4 backdrop-blur-md">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Market is Open
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                                    Fresh Produce, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Directly to You.</span> 🛒
                                </h2>
                                <p className="text-blue-100/80 mt-2 text-sm md:text-base leading-relaxed font-medium">
                                    Browse hundreds of verified farmers, compare daily market prices, and order top-quality vegetables directly to your shop.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/vendor-dashboard/market')}
                                className="group relative px-6 py-3 bg-white text-indigo-900 rounded-2xl font-black tracking-wide shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 shrink-0 overflow-hidden"
                            >
                                <span className="material-symbols-outlined relative z-10 group-hover:rotate-12 transition-transform">storefront</span>
                                <span className="relative z-10">Explore Market</span>
                            </button>
                        </div>
                    </div>

                    {/* Pending Actions or Recent Orders Placeholder */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <span className="material-symbols-outlined text-indigo-500">pending_actions</span>
                                Recent Orders
                            </h3>
                            <button onClick={() => navigate('/vendor-dashboard/orders')} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                                View All
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-4xl text-slate-300">receipt_long</span>
                            </div>
                            <p className="text-slate-500 font-medium">No recent orders found.</p>
                            <button onClick={() => navigate('/vendor-dashboard/market')} className="mt-4 text-indigo-600 font-bold hover:underline text-sm">
                                Start Buying
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-500">bolt</span>
                                Quick Actions
                            </h3>
                        </div>

                        <div className="space-y-3 flex-1">
                            <button onClick={() => navigate('/vendor-dashboard/wallet')} className="w-full p-4 bg-slate-50/50 hover:bg-slate-100/50 rounded-2xl flex items-center gap-4 transition-all duration-300 border border-slate-100 group">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                                </div>
                                <div className="text-left flex-1">
                                    <span className="block font-bold text-slate-700 text-sm">Add Funds</span>
                                    <span className="block text-xs font-medium text-slate-400 mt-0.5">Recharge your wallet</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 group-hover:text-blue-500 transition-all">chevron_right</span>
                            </button>

                            <button onClick={() => navigate('/vendor-dashboard/settings')} className="w-full p-4 bg-slate-50/50 hover:bg-slate-100/50 rounded-2xl flex items-center gap-4 transition-all duration-300 border border-slate-100 group">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-lg">store</span>
                                </div>
                                <div className="text-left flex-1">
                                    <span className="block font-bold text-slate-700 text-sm">Shop Details</span>
                                    <span className="block text-xs font-medium text-slate-400 mt-0.5">Update business info</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-500 transition-all">chevron_right</span>
                            </button>
                        </div>
                    </div>

                    {/* Mini Analytics / Info Card */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="w-12 h-12 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center mb-3 text-indigo-500">
                                <span className="material-symbols-outlined text-2xl">monitoring</span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-800 mb-1">Weekly Summary</h3>
                            <p className="text-xs text-slate-500 font-medium">Your spending and order analytics will appear here after your first purchase.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-4 md:mt-8 pt-6 border-t border-slate-100 text-center text-slate-400 text-xs pb-4">
                <p>© 2025 AgriConnect. Vendor Dashboard.</p>
            </footer>
        </div>
    );
};

export default Overview;
