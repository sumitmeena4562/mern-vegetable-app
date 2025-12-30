// components/StatsCards.jsx
import React from 'react';

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {/* Earnings Card */}
      <div className="glass-panel p-6 rounded-2xl shadow-glass hover:shadow-lg transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-bl-[4rem] -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl text-green-600 shadow-inner">
              <span className="material-symbols-outlined filled">payments</span>
            </div>
            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
              +12.5%
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total Earnings (Nov)</p>
          <h3 className="text-3xl font-bold text-gray-900 font-mono tracking-tight">₹45,230</h3>
          <div className="h-8 mt-2 flex items-end gap-1 opacity-60">
            <div className="w-1/6 bg-green-400 h-[40%] rounded-t-sm"></div>
            <div className="w-1/6 bg-green-400 h-[60%] rounded-t-sm"></div>
            <div className="w-1/6 bg-green-400 h-[50%] rounded-t-sm"></div>
            <div className="w-1/6 bg-green-400 h-[80%] rounded-t-sm"></div>
            <div className="w-1/6 bg-green-400 h-[70%] rounded-t-sm"></div>
            <div className="w-1/6 bg-green-500 h-[90%] rounded-t-sm"></div>
          </div>
        </div>
      </div>

      {/* Products Card */}
      <div className="glass-panel p-6 rounded-2xl shadow-glass hover:shadow-lg transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-[4rem] -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl text-blue-600 shadow-inner">
              <span className="material-symbols-outlined filled">inventory_2</span>
            </div>
            <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[14px] mr-1">warning</span>
              2 Expiring
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Active Products</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900 font-mono">12</h3>
            <span className="text-sm text-gray-500">Items Listed</span>
          </div>
          <p className="text-xs text-blue-600 font-medium mt-2 bg-blue-50 inline-block px-2 py-1 rounded">Total Stock: 2,450 kg</p>
        </div>
      </div>

      {/* Orders Card */}
      <div className="glass-panel p-6 rounded-2xl shadow-glass hover:shadow-lg transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 rounded-bl-[4rem] -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl text-amber-600 shadow-inner">
              <span className="material-symbols-outlined filled">shopping_cart</span>
            </div>
            <span className="flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg">
              3 Awaiting Pickup
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Pending Orders</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900 font-mono">8</h3>
            <span className="text-sm text-gray-500">Orders</span>
          </div>
          <p className="text-xs text-amber-700 font-medium mt-2">Value: ₹12,400</p>
        </div>
      </div>

      {/* Rating Card */}
      <div className="glass-panel p-6 rounded-2xl shadow-glass hover:shadow-lg transition-all relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-[4rem] -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-purple-600 shadow-inner">
              <span className="material-symbols-outlined filled">star</span>
            </div>
            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
              Improving
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Avg. Rating</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900 font-mono">4.8</h3>
            <div className="flex text-yellow-400 text-sm">
              <span className="material-symbols-outlined text-[16px] filled">star</span>
              <span className="material-symbols-outlined text-[16px] filled">star</span>
              <span className="material-symbols-outlined text-[16px] filled">star</span>
              <span className="material-symbols-outlined text-[16px] filled">star</span>
              <span className="material-symbols-outlined text-[16px] filled">star_half</span>
            </div>
          </div>
          <p className="text-xs text-purple-600 font-medium mt-2">Based on 124 reviews</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;