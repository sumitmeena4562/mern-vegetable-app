import React from 'react';

const AdditionalDetails = ({ data, onChange }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl soft-shadow space-y-6 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200/40">
          <span className="material-symbols-outlined text-white text-lg">local_shipping</span>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 leading-none">Logistics & Handling</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Delivery Settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Min Order Qty</label>
          <div className="relative group/input">
            <input
              value={data.minOrder}
              onChange={(e) => onChange('minOrder', e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 font-bold text-slate-700 focus:bg-white focus:border-blue-500 transition-all outline-none shadow-sm"
              type="number"
              placeholder="1"
            />
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-600 transition-colors">shopping_basket</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Packaging Type</label>
          <div className="relative group/input">
            <select
              value={data.packaging}
              onChange={(e) => onChange('packaging', e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer shadow-sm"
            >
              <option value="Jute Bags">Jute Bags (Bori)</option>
              <option value="Plastic Crates">Plastic Crates</option>
              <option value="Cardboard Boxes">Cardboard Boxes</option>
              <option value="Net Bags">Net Bags</option>
            </select>
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-600 transition-colors">package_2</span>
            <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Shelf Life</label>
          <div className="relative group/input">
            <select
              value={data.shelfLife}
              onChange={(e) => onChange('shelfLife', e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer shadow-sm"
            >
              <option value="1-2 Days">1-2 Days</option>
              <option value="3-5 Days">3-5 Days</option>
              <option value="1 Week">1 Week</option>
            </select>
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-600 transition-colors">hourglass_top</span>
            <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Pickup Slot</label>
          <div className="relative group/input">
            <select
              value={data.pickupSlot}
              onChange={(e) => onChange('pickupSlot', e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 font-bold text-slate-700 focus:bg-white focus:border-blue-500 outline-none appearance-none cursor-pointer shadow-sm text-sm"
            >
              <option value="Morning (8 AM - 11 AM)">Morning (8 AM - 11 AM)</option>
              <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
              <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
            </select>
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-blue-600 transition-colors">schedule</span>
            <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
          </div>
        </div>
      </div>

      {/* Trust Badge - Synced with Dashboard Secondary Cards */}
      <div className="pt-2">
        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between group/washed transition-all hover:bg-white hover:shadow-lg hover:shadow-indigo-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover/washed:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">water_drop</span>
            </div>
            <div>
              <p className="font-black text-slate-800 text-sm">Washed & Clean</p>
              <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Premium Trust Badge</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer active:scale-[0.9] transition-transform">
            <input
              type="checkbox"
              checked={data.isWashed}
              onChange={(e) => onChange('isWashed', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AdditionalDetails;