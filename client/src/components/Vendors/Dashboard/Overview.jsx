import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';

const Overview = () => {
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

    const cards = [
        { label: 'Total Spent', value: `₹${stats.totalSpent}`, sub: 'This Month', icon: 'account_balance_wallet', emoji: '💸', gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', textColor: 'text-blue-700' },
        { label: 'Active Orders', value: stats.activeOrders, sub: 'In Transit', icon: 'local_shipping', emoji: '🚚', gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', textColor: 'text-amber-700' },
        { label: 'Pending Pickups', value: stats.pendingDeliveries, sub: 'To Collect', icon: 'inventory_2', emoji: '📦', gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', textColor: 'text-emerald-700' },
        { label: 'Credit Used', value: `₹${stats.creditUsed}`, sub: 'Of Limit', icon: 'credit_card', emoji: '💳', gradient: 'from-purple-500 to-violet-600', bg: 'bg-purple-50', textColor: 'text-purple-700' },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

            {/* Welcome Banner */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-glass border border-white/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full translate-x-20 -translate-y-20 opacity-60"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 italic">Welcome to Market! 🛒</h2>
                        <p className="text-slate-500 mt-2 text-sm md:text-base max-w-xl">Browse hundreds of verified farmers, compare prices, and order fresh produce directly to your shop.</p>
                    </div>
                    <button
                        onClick={() => navigate('/vendor-dashboard/market')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">storefront</span>
                        Go to Market
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-4 md:p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-slate-200/40 transition-all group">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                <span className="text-lg">{card.emoji}</span>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${card.textColor} ${card.bg} px-2 py-1 rounded-lg`}>
                                {card.sub}
                            </span>
                        </div>
                        <p className="text-xs font-medium text-slate-400 mb-1">{card.label}</p>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{card.value}</h3>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Area (Orders list preview or chart) */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl soft-shadow min-h-[300px] flex flex-col justify-center items-center text-center">
                    <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">analytics</span>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">No Spending Data Yet</h3>
                    <p className="text-sm text-slate-500">Your purchase trends will appear here once you start placing orders.</p>
                </div>

                {/* Right Area (Quick Actions or Notifications) */}
                <div className="glass-panel p-6 rounded-2xl soft-shadow min-h-[300px]">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button onClick={() => navigate('/vendor-dashboard/wallet')} className="w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between transition-colors border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><span className="material-symbols-outlined text-sm">payments</span></div>
                                <span className="font-bold text-slate-700 text-sm">Add Money to Wallet</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                        </button>

                        <button onClick={() => navigate('/vendor-dashboard/settings')} className="w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-between transition-colors border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><span className="material-symbols-outlined text-sm">store</span></div>
                                <span className="font-bold text-slate-700 text-sm">Update Shop Details</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Overview;
