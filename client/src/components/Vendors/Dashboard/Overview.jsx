import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../api/axios';
import Loader from '../../ui/Loader';
import { getGreeting } from '@/utils/dateUtils';
import DashboardWelcome from '../../common/Dashboard/DashboardWelcome';
import StatsGrid, { VENDOR_STATS_THEME } from '../../common/Dashboard/StatsGrid';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

const Overview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalSpent: 0,
        activeOrders: 0,
        pendingDeliveries: 0,
        creditUsed: 0,
        weeklySourcing: []
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/vendors/stats');
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (error) {
                console.error('Vendor stats fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);


    const greeting = getGreeting();

    const cards = [
        { label: 'Total Spent', value: `₹${stats.totalSpent}`, sub: 'This Month', icon: 'payments', emoji: '💸', iconContainerBg: 'bg-indigo-600 text-white shadow-indigo-100', textColor: 'text-slate-400 group-hover:text-indigo-600' },
        { label: 'Active Orders', value: stats.activeOrders, sub: 'In Transit', icon: 'local_shipping', emoji: '🚚', iconContainerBg: 'bg-violet-600 text-white shadow-violet-100', textColor: 'text-slate-400 group-hover:text-violet-600' },
        { label: 'Pending Pickups', value: stats.pendingDeliveries, sub: 'To Collect', icon: 'inventory_2', emoji: '📦', iconContainerBg: 'bg-cyan-600 text-white shadow-cyan-100', textColor: 'text-slate-400 group-hover:text-cyan-600' },
        { label: 'Credit Used', value: `₹${stats.creditUsed}`, sub: 'Of Limit', icon: 'credit_score', emoji: '💳', iconContainerBg: 'bg-blue-600 text-white shadow-blue-100', textColor: 'text-slate-400 group-hover:text-blue-600' },
    ];

    if (loading) {
        return <Loader variant="section" color="indigo" size="lg" text="Loading Intelligence..." className="h-96" />;
    }

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 relative z-10 pb-20 xl:pb-8 animate-in fade-in duration-700">

            {/* Header Section */}
            <DashboardWelcome
                greeting={greeting}
                userName={user?.fullName || 'Vendor'}
                portalName="Vendor Portal"
                tagline="Operational Intelligence & Performance Hub"
                badgeText="Elite Tier"
                badgeIcon="verified_user"
                themeColor="indigo"
            />

            {/* Stats Cards Grid */}
            <StatsGrid cards={cards} theme={VENDOR_STATS_THEME} />

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

                    {/* Weekly Sourcing Trends (Replaced Placeholder) */}
                    <div className="bg-white/60 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] border border-white shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined">trending_up</span>
                                </div>
                                Weekly Sourcing Insights
                            </h3>
                        </div>
                        {stats.weeklySourcing && stats.weeklySourcing.length > 0 ? (
                            <div className="h-72 w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.weeklySourcing} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 700 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 700 }} tickFormatter={(val) => `₹${val}`} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                                            formatter={(value) => [`₹${value.toLocaleString()}`, 'Spent']}
                                        />
                                        <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="4 4" />
                                        <Area type="monotone" dataKey="spent" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorSpent)" activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-100 rounded-3xl group cursor-default hover:border-indigo-100 transition-colors">
                                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-300 transition-all duration-500 transform group-hover:rotate-6">
                                    <span className="material-symbols-outlined text-4xl">inventory_2</span>
                                </div>
                                <h4 className="font-black text-slate-800 mb-2">Build Your Inventory</h4>
                                <p className="text-slate-400 text-[13px] font-bold uppercase tracking-wide max-w-xs leading-relaxed">
                                    Start sourcing from the market to see real-time logistics and inventory tracking here.
                                </p>
                            </div>
                        )}
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

                    {/* Orders Volume Chart (Replaced Placeholder) */}
                    <div className="bg-gradient-to-br from-indigo-50/50 to-violet-50/50 p-6 rounded-[2.5rem] border border-white shadow-inner relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="font-black text-slate-800 text-sm mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                    <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                                </div>
                                Volume Last 7 Days
                            </h3>
                            {stats.weeklySourcing && stats.weeklySourcing.length > 0 ? (
                                <div className="h-40 w-full mt-2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.weeklySourcing} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                                formatter={(value) => [value, 'Orders']}
                                                cursor={{ fill: '#e0e7ff', opacity: 0.4 }}
                                            />
                                            <Bar dataKey="orders" fill="#4f46e5" radius={[4, 4, 4, 4]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide opacity-80 leading-relaxed">
                                        Data will populate when orders are placed.
                                    </p>
                                </div>
                            )}
                        </div>
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
