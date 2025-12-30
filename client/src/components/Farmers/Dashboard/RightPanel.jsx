import React from 'react';

const RightPanel = () => {
  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      
      {/* Quick Actions */}
      <div className="glass-panel p-6 rounded-2xl soft-shadow sticky top-24">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="col-span-2 py-4 bg-primary hover:bg-[#25d360] text-slate-900 rounded-md font-bold shadow-lg shadow-green-300/50 flex items-center justify-center gap-2 transition-all active:scale-95 group">
            <span className="bg-white/30 p-1 flex items-center rounded-full"><span className="material-symbols-outlined font-bold group-hover:rotate-90 transition-transform">add</span></span>
            Add New Sabji
          </button>
          <button className="p-3 bg-white border border-slate-200 hover:border-primary hover:text-primary-dark text-slate-600 rounded-md font-semibold text-sm flex flex-col items-center gap-2 transition-colors">
            <span className="material-symbols-outlined">inventory</span>
            Update Stock
          </button>
          <button className="p-3 bg-white border border-slate-200 hover:border-primary hover:text-primary-dark text-slate-600 rounded-md font-semibold text-sm flex flex-col items-center gap-2 transition-colors">
            <span className="material-symbols-outlined">campaign</span>
            Broadcast
          </button>
          <button className="col-span-2 p-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-semibold text-sm transition-colors">
            View All Orders
          </button>
        </div>
      </div>

      {/* Pickups */}
      <div className="glass-panel p-6 rounded-2xl soft-shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">Pickups Today</h3>
          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">2 Left</span>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-500 font-bold text-center min-w-[3.5rem]">
              <span className="block text-xs uppercase">Today</span>
              <span className="block text-lg text-slate-800">2pm</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">Fresh Mart</h4>
              <p className="text-xs text-slate-500">Order #8821 • 50kg Tomato</p>
              <div className="flex items-center gap-2 mt-2">
                <button className="text-xs font-bold text-white bg-slate-800 px-3 py-1.5 rounded hover:bg-slate-700">Call Driver</button>
                <button className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded hover:bg-green-200">Ready?</button>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-slate-100 p-2 rounded-lg text-slate-500 font-bold text-center min-w-[3.5rem]">
              <span className="block text-xs uppercase">Today</span>
              <span className="block text-lg text-slate-800">5pm</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">Big Basket Hub</h4>
              <p className="text-xs text-slate-500">Order #8825 • 20kg Okra</p>
              <div className="flex items-center gap-2 mt-2">
                <button className="text-xs font-bold text-slate-600 border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50">Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Widget */}
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-500/30">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-50"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Pune, MH</p>
              <h3 className="text-3xl font-bold">28°C</h3>
              <p className="text-sm font-medium">Sunny & Clear</p>
            </div>
            <span className="material-symbols-outlined text-5xl text-yellow-300">wb_sunny</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/10 mt-2">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-yellow-300 text-lg mt-0.5">warning</span>
              <div>
                <p className="text-xs font-bold uppercase text-blue-100 tracking-wider">Advisory</p>
                <p className="text-sm font-medium leading-tight mt-1">Light rain expected tomorrow. Cover harvested onions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Farming Tips */}
      <div className="glass-panel p-6 rounded-2xl soft-shadow">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Farming Tips</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <div className="min-w-[120px] h-32 bg-green-50 rounded-xl p-3 flex flex-col justify-between border border-green-100">
            <span className="material-symbols-outlined text-green-600">water_drop</span>
            <p className="text-xs font-bold text-slate-700">Irrigate tomatoes every 3 days</p>
          </div>
          <div className="min-w-[120px] h-32 bg-orange-50 rounded-xl p-3 flex flex-col justify-between border border-orange-100">
            <span className="material-symbols-outlined text-orange-600">bug_report</span>
            <p className="text-xs font-bold text-slate-700">Check for stem borers in Corn</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RightPanel;