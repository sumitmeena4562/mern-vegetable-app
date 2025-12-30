// components/MainContent.jsx
import React from 'react';

const MainContent = () => {
  return (
    <>
      {/* Revenue Analytics */}
      <div className="glass-panel p-6 rounded-3xl shadow-glass">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
            <p className="text-sm text-gray-500">Income vs Expenses (Last 30 Days)</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button className="px-3 py-1.5 bg-white text-xs font-bold rounded-md shadow-sm text-gray-800">Daily</button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 hover:text-gray-900">Weekly</button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 hover:text-gray-900">Monthly</button>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="material-symbols-outlined">download</span>
          </button>
        </div>
        <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 relative border-b border-gray-100">
          <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-300 pointer-events-none -z-0">
            <div className="border-b border-dashed border-gray-200 h-full w-full"></div>
            <div className="border-b border-dashed border-gray-200 h-full w-full"></div>
            <div className="border-b border-dashed border-gray-200 h-full w-full"></div>
            <div className="border-b border-dashed border-gray-200 h-full w-full"></div>
          </div>
          <div className="w-full bg-green-100/50 rounded-t-lg h-[40%] relative group cursor-pointer hover:bg-green-200 transition-all">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹4k</div>
          </div>
          <div className="w-full bg-green-100/50 rounded-t-lg h-[60%] relative group cursor-pointer hover:bg-green-200 transition-all"></div>
          <div className="w-full bg-green-100/50 rounded-t-lg h-[30%] relative group cursor-pointer hover:bg-green-200 transition-all"></div>
          <div className="w-full bg-green-100/50 rounded-t-lg h-[75%] relative group cursor-pointer hover:bg-green-200 transition-all"></div>
          <div className="w-full bg-green-100/50 rounded-t-lg h-[50%] relative group cursor-pointer hover:bg-green-200 transition-all"></div>
          <div className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg h-[85%] relative group cursor-pointer shadow-lg shadow-green-200">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded">Today</div>
          </div>
          <div className="w-full bg-green-100/50 rounded-t-lg h-[45%] relative group cursor-pointer hover:bg-green-200 transition-all"></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>

      {/* Today's Timeline */}
      <div className="glass-panel p-6 rounded-3xl shadow-glass">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Today's Timeline</h3>
          <a className="text-sm text-green-600 font-semibold hover:underline" href="#">View All</a>
        </div>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[19px] w-[2px] bg-gray-100"></div>
          
          {/* Timeline Item 1 */}
          <div className="flex gap-4 mb-6 relative">
            <div className="z-10 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center border-4 border-white shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-green-600 text-sm">check</span>
            </div>
            <div className="flex-1 bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900">Order #8821 - Delivered</h4>
                  <p className="text-sm text-gray-500">Delivered to <span className="text-gray-700 font-medium">BigBasket Hub</span></p>
                </div>
                <span className="text-xs font-mono text-gray-400">10:30 AM</span>
              </div>
            </div>
          </div>

          {/* Timeline Item 2 */}
          <div className="flex gap-4 mb-6 relative">
            <div className="z-10 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center border-4 border-white shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-amber-600 text-sm">local_shipping</span>
            </div>
            <div className="flex-1 bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900">Order #8824 - Ready for Pickup</h4>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-full">Action Req</span>
                  </div>
                  <p className="text-sm text-gray-500">Vendor: <span className="text-gray-700 font-medium">Local Mandi Trader</span> • 250kg Onion</p>
                </div>
                <span className="text-xs font-mono text-gray-400">02:00 PM</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors">Mark Handed Over</button>
                <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">Print Invoice</button>
              </div>
            </div>
          </div>

          {/* Timeline Item 3 */}
          <div className="flex gap-4 relative">
            <div className="z-10 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-blue-600 text-sm">inventory</span>
            </div>
            <div className="flex-1 bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow opacity-60">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900">Order #8825 - Packing Pending</h4>
                  <p className="text-sm text-gray-500">Vendor: <span className="text-gray-700 font-medium">FreshToHome</span> • 50kg Spinach</p>
                </div>
                <span className="text-xs font-mono text-gray-400">04:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Rates */}
      <div className="glass-panel p-6 rounded-3xl shadow-glass overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Live Market Rates</h3>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Updated 5m ago
          </span>
        </div>
        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="py-2 pl-2 font-medium">Crop</th>
                <th className="py-2 font-medium">Market Avg</th>
                <th className="py-2 font-medium">Your Price</th>
                <th className="py-2 font-medium text-right pr-2">Trend</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Tomato Row */}
              <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 pl-2 flex items-center gap-2">
                  <span className="text-xl">🍅</span>
                  <span className="font-semibold text-gray-700">Tomato</span>
                </td>
                <td className="py-3 text-gray-500">₹22/kg</td>
                <td className="py-3 font-bold text-green-700">₹20/kg</td>
                <td className="py-3 text-right pr-2">
                  <span className="inline-flex items-center text-red-500 bg-red-50 px-2 py-0.5 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-[12px] mr-1">trending_down</span> -2%
                  </span>
                </td>
              </tr>
              
              {/* Potato Row */}
              <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 pl-2 flex items-center gap-2">
                  <span className="text-xl">🥔</span>
                  <span className="font-semibold text-gray-700">Potato</span>
                </td>
                <td className="py-3 text-gray-500">₹18/kg</td>
                <td className="py-3 font-bold text-gray-400">--</td>
                <td className="py-3 text-right pr-2">
                  <span className="inline-flex items-center text-green-500 bg-green-50 px-2 py-0.5 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-[12px] mr-1">trending_up</span> +5%
                  </span>
                </td>
              </tr>
              
              {/* Onion Row */}
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3 pl-2 flex items-center gap-2">
                  <span className="text-xl">🧅</span>
                  <span className="font-semibold text-gray-700">Onion</span>
                </td>
                <td className="py-3 text-gray-500">₹32/kg</td>
                <td className="py-3 font-bold text-green-700">₹30/kg</td>
                <td className="py-3 text-right pr-2">
                  <span className="inline-flex items-center text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full text-xs font-bold">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MainContent;