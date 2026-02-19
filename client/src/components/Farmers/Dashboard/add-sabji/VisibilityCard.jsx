import React from 'react';

const VisibilityCard = ({ data, onChange, income }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl soft-shadow space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-200/40">
          <span className="material-symbols-outlined text-white text-lg">visibility</span>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 leading-none">Listing Status</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Real-time Visibility</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${data.isVisible ? 'bg-green-50/40 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${data.isVisible ? 'bg-white text-green-600' : 'bg-slate-100 text-slate-400'}`}>
              <span className="material-symbols-outlined text-base font-black">{data.isVisible ? 'verified' : 'visibility_off'}</span>
            </div>
            <div>
              <p className={`font-black text-sm ${data.isVisible ? 'text-green-900' : 'text-slate-600'}`}>
                {data.isVisible ? 'Active Now' : 'Draft Mode'}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer active:scale-[0.9] transition-transform">
            <input
              type="checkbox"
              checked={data.isVisible}
              onChange={(e) => onChange('isVisible', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5.5 bg-slate-200 rounded-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:after:translate-x-full shadow-inner"></div>
          </label>
        </div>

        {/* Income Card - Synced with Dashboard Stats Style */}
        <div className="p-5 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl shadow-xl shadow-indigo-100 border border-indigo-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-base">💰</span>
              <span className="font-bold text-[9px] uppercase tracking-widest text-indigo-100">Estimated Income</span>
            </div>
            <span className="text-[10px] font-bold text-white/60 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10 uppercase tracking-tighter">Net</span>
          </div>

          <div className="relative z-10 flex items-baseline gap-1">
            <span className="text-white/50 font-black text-xl">₹</span>
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
              {Number(income).toLocaleString('en-IN')}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisibilityCard;