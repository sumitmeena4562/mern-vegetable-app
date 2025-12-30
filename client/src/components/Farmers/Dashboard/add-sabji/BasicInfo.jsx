import React from 'react';

const BasicInfo = () => {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl soft-shadow space-y-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="bg-green-100 p-2 rounded-lg text-green-700">
          <span className="material-symbols-outlined text-2xl">eco</span>
        </div>
        <h3 class="text-xl font-bold text-slate-800">Basic Information</h3>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Sabji Name <span className="text-red-500">*</span></label>
          <div className="relative">
            <input className="w-full text-lg p-4 pl-12 rounded-xl border-slate-200 bg-white/50 focus:border-green-500 focus:ring-green-500 transition-all placeholder:text-slate-400" placeholder="Enter Sabji Name (e.g., Tomato, Potato)" type="text" />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          </div>
        </div>

        {/* Category Radio Grid */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-3">Select Category <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <CategoryOption icon="🥕" label="Root Veggies" />
            <CategoryOption icon="🥬" label="Leafy Greens" />
            <CategoryOption icon="🍅" label="Vegetables" />
            <CategoryOption icon="🍎" label="Fruits" />
          </div>
        </div>

        {/* Qty & Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Available Quantity <span className="text-red-500">*</span></label>
            <div className="flex rounded-xl shadow-sm">
              <input className="flex-1 text-lg p-4 rounded-l-xl border-slate-200 border-r-0 bg-white/50 focus:border-green-500 focus:ring-green-500 placeholder:text-slate-400" placeholder="0" type="number" />
              <select className="w-32 text-center font-bold text-slate-700 bg-slate-50 border-slate-200 border-l-0 rounded-r-xl focus:border-green-500 focus:ring-green-500 cursor-pointer">
                <option>Kg</option>
                <option>Quintal</option>
                <option>Ton</option>
                <option>Pieces</option>
                <option>Bunches</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Price per Unit (₹) <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">₹</span>
              <input className="w-full text-lg p-4 pl-10 rounded-xl border-slate-200 bg-white/50 focus:border-green-500 focus:ring-green-500 placeholder:text-slate-400" placeholder="0.00" type="number" />
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">info</span> Market Avg: ₹18-22/kg
            </p>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Harvest Date (Freshness) <span className="text-red-500">*</span></label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input className="w-full text-lg p-4 pl-12 rounded-xl border-slate-200 bg-white/50 focus:border-green-500 focus:ring-green-500 cursor-pointer" type="date" />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">calendar_month</span>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-3 bg-green-50 text-green-700 border border-green-200 rounded-xl font-semibold hover:bg-green-100 transition-colors whitespace-nowrap">Today</button>
              <button className="px-4 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors whitespace-nowrap">Yesterday</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryOption = ({ icon, label }) => (
  <label className="cursor-pointer relative group">
    <input type="radio" name="category" className="form-radio sr-only peer" />
    <div className="p-4 rounded-xl border-2 border-slate-100 bg-white hover:border-green-300 transition-all flex flex-col items-center gap-2 text-center h-full">
      <span className="text-3xl">{icon}</span>
      <span className="font-bold text-slate-600">{label}</span>
    </div>
    <div className="check-icon absolute top-2 right-2 opacity-0 text-green-600 transition-opacity">
      <span className="material-symbols-outlined text-sm bg-white rounded-full">check_circle</span>
    </div>
  </label>
);

export default BasicInfo;