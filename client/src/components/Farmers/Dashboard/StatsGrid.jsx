import React from 'react';

const StatsGrid = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1 */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-5 relative overflow-hidden soft-shadow group hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 flex items-center bg-white rounded-lg text-green-600 shadow-sm">
            <span className="material-symbols-outlined">currency_rupee</span>
          </div>
          <span className="flex items-center text-xs font-bold text-green-700 bg-green-200/50 px-2 py-1 rounded">
            <span className="material-symbols-outlined text-sm mr-0.5">trending_up</span> 12%
          </span>
        </div>
        <div>
          <p className="text-green-800/70 text-sm font-semibold mb-1">Total Earnings (Month)</p>
          <h3 className="text-3xl font-bold text-green-900">₹42,500</h3>
        </div>
        <svg className="absolute bottom-0 right-0 w-32 h-16 opacity-20 text-green-600 fill-current" preserveAspectRatio="none" viewBox="0 0 100 50">
          <path d="M0,50 L0,30 L20,40 L40,20 L60,35 L80,10 L100,25 L100,50 Z"></path>
        </svg>
      </div>

      {/* Card 2 */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5 relative overflow-hidden soft-shadow group hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 flex items-center bg-white rounded-lg text-blue-600 shadow-sm">
            <span className="material-symbols-outlined">inventory</span>
          </div>
          <span className="flex items-center text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">2 Expiring Soon</span>
        </div>
        <div>
          <p className="text-blue-800/70 text-sm font-semibold mb-1">Active Products</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-blue-900">12</h3>
            <span className="text-sm font-semibold text-blue-700 mb-1">/ 850kg Stock</span>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-5 relative overflow-hidden soft-shadow group hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 flex items-center bg-white rounded-lg text-amber-600 shadow-sm">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
          <span className="flex items-center text-xs font-bold text-amber-700 bg-amber-200/50 px-2 py-1 rounded">1 Awaiting Pickup</span>
        </div>
        <div>
          <p className="text-amber-800/70 text-sm font-semibold mb-1">Pending Orders</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-amber-900">5</h3>
            <span className="text-sm font-semibold text-amber-700 mb-1">Value: ₹3,200</span>
          </div>
        </div>
      </div>

      {/* Card 4 */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-5 relative overflow-hidden soft-shadow group hover:-translate-y-1 transition-transform duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 flex items-center bg-white rounded-lg text-purple-600 shadow-sm">
            <span className="material-symbols-outlined">star</span>
          </div>
          <span className="flex items-center text-xs font-bold text-purple-700 bg-purple-200/50 px-2 py-1 rounded">Improving</span>
        </div>
        <div>
          <p className="text-purple-800/70 text-sm font-semibold mb-1">Customer Rating</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-bold text-purple-900">4.8</h3>
            <span className="text-sm font-semibold text-purple-700 mb-1 flex items-center">
              <span className="material-symbols-outlined text-[16px] text-yellow-500">star</span>
              (124 reviews)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsGrid;