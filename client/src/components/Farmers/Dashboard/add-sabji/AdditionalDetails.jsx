import React from 'react';

const AdditionalDetails = () => {
  return (
    <div className="glass-panel rounded-2xl soft-shadow overflow-hidden">
      <details className="group">
        <summary className="flex items-center justify-between p-6 sm:p-8 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors list-none">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
              <span className="material-symbols-outlined text-2xl">tune</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Additional Details</h3>
              <p className="text-sm text-slate-500">Optional: Add more info to attract buyers</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400 transition-transform group-open:rotate-180 text-2xl">expand_more</span>
        </summary>
        
        <div className="p-6 sm:p-8 pt-0 border-t border-slate-100 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Minimum Order Qty (MOQ)</label>
              <div className="relative">
                <input className="w-full text-lg p-3 rounded-xl border-slate-200 bg-white/50 focus:border-green-500 focus:ring-green-500" placeholder="e.g. 10" type="number" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">Kg</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Pickup Slot</label>
              <select className="w-full text-lg p-3 rounded-xl border-slate-200 bg-white/50 focus:border-green-500 focus:ring-green-500 text-slate-700">
                <option>Any Time (8 AM - 6 PM)</option>
                <option>Morning (8 AM - 11 AM)</option>
                <option>Afternoon (2 PM - 5 PM)</option>
                <option>Evening (5 PM - 8 PM)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description / Special Notes</label>
            <textarea className="w-full p-4 rounded-xl border-slate-200 bg-white/50 focus:border-green-500 focus:ring-green-500 placeholder:text-slate-400" placeholder="e.g., Organic, Desi variety, grown without pesticides..." rows="3"></textarea>
          </div>
        </div>
      </details>
    </div>
  );
};

export default AdditionalDetails;