import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { name: 'Mon', value: 15000 },
  { name: 'Tue', value: 25000 },
  { name: 'Wed', value: 18000 },
  { name: 'Thu', value: 32000 },
  { name: 'Fri', value: 28000 },
  { name: 'Sat', value: 42000 },
  { name: 'Sun', value: 38000 },
];

const LeftPanel = () => {
  return (
    <div className="lg:col-span-8 flex flex-col gap-6">

      {/* Revenue Analytics (UPGRADED WITH RECHARTS) */}
      <div className="glass-panel p-6 rounded-2xl soft-shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Revenue Analytics</h3>
            <p className="text-sm text-slate-500">Income trend (Last 7 Days)</p>
          </div>
          <div className="flex gap-2">
            <select className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-2 py-1 outline-none focus:border-green-500">
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Daily</option>
            </select>
          </div>
        </div>

        {/* Dynamic Chart */}
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
                formatter={(value) => [`₹${value}`, "Revenue"]}
                cursor={{ stroke: '#16a34a', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#16a34a"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Order Tracking (Keep as is) */}
      <div className="glass-panel p-6 rounded-2xl soft-shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Live Order Tracking</h3>
          <button className="text-sm text-green-600 font-semibold hover:underline">View All</button>
        </div>
        <div className="relative">
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200"></div>
          {/* Item 1 */}
          <div className="relative pl-16 py-2 mb-4">
            <div className="absolute left-4 top-3 w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-100 z-10"></div>
            <div className="flex justify-between items-start bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <div>
                <p className="text-xs text-slate-400 font-bold mb-1">ORDER #8832 • Just Now</p>
                <h4 className="font-bold text-slate-800">Delivered to Vendor</h4>
                <p className="text-sm text-slate-600">50kg Potatoes received by ABC Mart.</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wide">Done</span>
            </div>
          </div>
          {/* Item 2 */}
          <div className="relative pl-16 py-2">
            <div className="absolute left-4 top-3 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-amber-100 z-10"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm gap-4">
              <div>
                <p className="text-xs text-slate-400 font-bold mb-1">ORDER #8834 • 30 mins ago</p>
                <h4 className="font-bold text-slate-800">Ready for Pickup</h4>
                <p className="text-sm text-slate-600">200 Bunches of Spinach packed.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg hover:bg-slate-800 transition-all">Mark Picked</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Prices (Keep as is for now) */}
      <div className="glass-panel p-6 rounded-2xl soft-shadow hidden md:block">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">analytics</span>
            Market Prices (Live)
          </h3>
          <p className="text-xs text-slate-400">Updated: 10:00 AM</p>
        </div>
        {/* Same table code as before... */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="pb-3 pl-2">Crop</th>
                <th className="pb-3">Market Avg</th>
                <th className="pb-3">Your Price</th>
                <th className="pb-3">Trend</th>
                <th className="pb-3 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="py-3 pl-2 font-medium">Tomato (Desi)</td>
                <td className="py-3">₹18/kg</td>
                <td className="py-3 text-green-700 font-bold">₹20/kg</td>
                <td className="py-3"><span className="text-green-600 flex items-center text-xs font-bold"><span className="material-symbols-outlined text-sm">arrow_upward</span> +5%</span></td>
                <td className="py-3 pr-2 text-right"><button className="text-blue-600 font-semibold text-xs hover:underline">Update</button></td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="py-3 pl-2 font-medium">Onion (Red)</td>
                <td className="py-3">₹25/kg</td>
                <td className="py-3 text-red-600 font-bold">₹28/kg</td>
                <td className="py-3"><span className="text-red-500 flex items-center text-xs font-bold"><span className="material-symbols-outlined text-sm">arrow_downward</span> -2%</span></td>
                <td className="py-3 pr-2 text-right"><button className="text-blue-600 font-semibold text-xs hover:underline">Update</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;