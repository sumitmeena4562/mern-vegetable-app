import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getFarmerOrders } from '@/api/userApi';
import api from '@/api/axios';

const LeftPanel = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPanelData();
  }, []);

  const loadPanelData = async () => {
    try {
      setLoading(true);

      // Fetch recent orders for Live Order Tracking
      const ordersRes = await getFarmerOrders('all');
      if (ordersRes.success) {
        setRecentOrders(ordersRes.data?.slice(0, 3) || []);
      }

      // Fetch analytics for revenue chart
      try {
        const analyticsRes = await api.get('/farmers/analytics');
        if (analyticsRes.data.success && analyticsRes.data.data.revenueStats?.length > 0) {
          setRevenueData(analyticsRes.data.data.revenueStats);
        }
      } catch (e) {
        console.error('Analytics fetch error:', e);
      }

    } catch (error) {
      console.error('LeftPanel data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      'pending': { label: 'New', color: 'bg-orange-100 text-orange-700' },
      'confirmed': { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
      'processing': { label: 'Packing', color: 'bg-indigo-100 text-indigo-700' },
      'ready_for_pickup': { label: 'Ready', color: 'bg-green-100 text-green-700' },
      'delivered': { label: 'Done', color: 'bg-emerald-100 text-emerald-700' },
      'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
    };
    return map[status] || { label: status, color: 'bg-slate-100 text-slate-700' };
  };

  const getTimeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just Now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="lg:col-span-8 flex flex-col gap-6">

      {/* Revenue Analytics */}
      <div className="glass-panel p-6 rounded-2xl soft-shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Revenue Analytics</h3>
            <p className="text-sm text-slate-500">
              {revenueData.length > 0 ? `Income trend (Last ${revenueData.length} months)` : 'No revenue data yet'}
            </p>
          </div>
        </div>

        <div style={{ width: '100%', height: 300 }}>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                  cursor={{ stroke: '#16a34a', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl mb-2 block opacity-30">monitoring</span>
                <p className="text-sm font-medium">Revenue data will appear here once you start getting orders</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Order Tracking — Real Data */}
      <div className="glass-panel p-6 rounded-2xl soft-shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Recent Orders</h3>
          <a href="/farmer-dashboard/orders" className="text-sm text-green-600 font-semibold hover:underline">View All</a>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl"></div>)}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <span className="material-symbols-outlined text-3xl mb-2 block opacity-30">shopping_cart</span>
            <p className="text-sm font-medium">No orders yet</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200"></div>
            {recentOrders.map((order, idx) => {
              const badge = getStatusBadge(order.status);
              return (
                <div key={order._id} className="relative pl-16 py-2 mb-4">
                  <div className={`absolute left-4 top-3 w-4 h-4 rounded-full z-10 ring-4 ${order.status === 'delivered' ? 'bg-green-500 ring-green-100' :
                    order.status === 'pending' ? 'bg-orange-500 ring-orange-100' :
                      'bg-amber-500 ring-amber-100'
                    }`}></div>
                  <div className="flex justify-between items-start bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div>
                      <p className="text-xs text-slate-400 font-bold mb-1">
                        ORDER #{order.orderId} • {getTimeAgo(order.createdAt)}
                      </p>
                      <h4 className="font-bold text-slate-800">{order.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                      <p className="text-sm text-slate-600">
                        {order.products?.length || 0} item(s) • ₹{order.finalAmount?.toLocaleString() || order.totalAmount?.toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;