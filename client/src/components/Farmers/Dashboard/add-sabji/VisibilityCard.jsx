import React from 'react';

const VisibilityCard = () => {
  return (
    <div className="glass-panel p-6 rounded-2xl soft-shadow">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Visibility</h3>
      
      <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full shadow-sm text-green-600">
            <span className="material-symbols-outlined">visibility</span>
          </div>
          <div>
            <p className="font-bold text-slate-800">Available Now</p>
            <p className="text-xs text-slate-500">Visible to all vendors</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <div className="flex gap-2 text-blue-800 mb-1">
          <span className="material-symbols-outlined text-lg">monetization_on</span>
          <span className="font-bold text-sm">Potential Income</span>
        </div>
        <p className="text-xs text-blue-600/80 mb-2">Based on your qty & price:</p>
        <p className="text-2xl font-bold text-blue-900">₹0.00</p>
      </div>
    </div>
  );
};

export default VisibilityCard;