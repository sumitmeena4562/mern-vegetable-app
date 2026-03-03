import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import api from '@/api/axios';
import Skeleton from '@/components/ui/Skeleton';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await api.get('/farmers/analytics');
            if (res.data.success && res.data.data) {
                setData(res.data.data);
            } else {
                setData({ revenueStats: [], productPerformance: [], buyerStats: [], categoryDemand: [] });
            }
        } catch (error) {
            console.error("Analytics fetch error:", error);
            setData({ revenueStats: [], productPerformance: [], buyerStats: [], categoryDemand: [] });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40">
                            <Skeleton variant="circular" className="w-12 h-12 mb-6" />
                            <Skeleton variant="rectangular" className="h-3 w-24 mb-3" />
                            <Skeleton variant="text" className="h-8 w-32 mb-2" />
                            <Skeleton variant="rectangular" className="h-2 w-20" />
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Skeleton variant="rectangular" className="h-96 rounded-[48px] w-full" />
                    <Skeleton variant="rectangular" className="h-96 rounded-[48px] w-full" />
                </div>
            </div>
        );
    }

    const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">

            {/* Top Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                        <span className="material-symbols-outlined font-black">trending_up</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">₹{(data?.revenueStats?.reduce((a, b) => a + b.revenue, 0) || 0).toLocaleString()}</h3>
                    {(() => {
                        const stats = data?.revenueStats || [];
                        if (stats.length >= 2) {
                            const curr = stats[stats.length - 1].revenue;
                            const prev = stats[stats.length - 2].revenue;
                            const pct = prev > 0 ? (((curr - prev) / prev) * 100).toFixed(1) : 0;
                            return <p className={`text-xs font-bold mt-2 ${pct >= 0 ? 'text-green-600' : 'text-red-500'}`}>{pct >= 0 ? '+' : ''}{pct}% vs last month</p>;
                        }
                        return <p className="text-xs text-slate-400 font-bold mt-2">Not enough data</p>;
                    })()}
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                        <span className="material-symbols-outlined font-black">group</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unique Buyers</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{data?.buyerStats?.reduce((a, b) => a + b.count, 0) || 0}</h3>
                    <p className="text-xs text-blue-600 font-bold mt-2">{(data?.buyerStats?.length || 0) > 0 ? 'Growing community' : 'No buyers yet'}</p>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                        <span className="material-symbols-outlined font-black">shopping_bag</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{data?.revenueStats?.reduce((a, b) => a + (b.orders || 0), 0) || 0}</h3>
                    <p className="text-xs text-orange-600 font-bold mt-2">{(data?.productPerformance?.length || 0)} products listed</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Revenue Area Chart */}
                <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden group">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight">Revenue Timeline</h4>
                            <p className="text-xs text-slate-400 font-bold mt-0.5">Earnings growth over the last 6 months</p>
                        </div>
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                            <span className="material-symbols-outlined text-slate-400">monitoring</span>
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.revenueStats}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                                    dy={10}
                                />
                                <YAxis anchor
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Product Performance Bar Chart */}
                <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/30">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight">Top Sabji Selling</h4>
                            <p className="text-xs text-slate-400 font-bold mt-0.5">Most profitable items in your stock</p>
                        </div>
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                            <span className="material-symbols-outlined text-slate-400">bar_chart</span>
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.productPerformance}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                                    dy={10}
                                />
                                <YAxis anchor
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="revenue" radius={[12, 12, 0, 0]} barSize={40}>
                                    {data?.productPerformance?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Buyer Distribution Pie Chart */}
                <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/30">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight">Buyer Profile</h4>
                            <p className="text-xs text-slate-400 font-bold mt-0.5">Who is buying your produce</p>
                        </div>
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                            <span className="material-symbols-outlined text-slate-400">pie_chart</span>
                        </div>
                    </div>

                    <div className="h-72 w-full flex flex-col md:flex-row items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.buyerStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {data?.buyerStats?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry._id === 'vendor' ? '#3b82f6' : '#22c55e'} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="md:w-1/2 p-6 space-y-4">
                            {data?.buyerStats?.map((stat, idx) => (
                                <div key={idx} className="flex justify-between border-b border-slate-50 pb-2">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat._id}s</span>
                                    <span className="text-sm font-black text-slate-800">{stat.count} Orders</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Market Trends (Simulated Category Demand) */}
                <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/30">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h4 className="text-xl font-black text-slate-900 tracking-tight">Market Demand</h4>
                            <p className="text-xs text-slate-400 font-bold mt-0.5">Overall category popularity</p>
                        </div>
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                            <span className="material-symbols-outlined text-slate-400">trending_up</span>
                        </div>
                    </div>

                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data?.categoryDemand}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                                    dy={10}
                                />
                                <YAxis anchor
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="demand" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Analytics;
