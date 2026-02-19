import React from 'react';

const BasicInfo = ({ data, onChange }) => {
  const categories = [
    { icon: "🥕", label: "Root Vegties", value: "root" },
    { icon: "🥬", label: "Leafy Greens", value: "leafy" },
    { icon: "🍅", label: "Vegetables", value: "vegetable" },
    { icon: "🍎", label: "Fruits", value: "fruit" }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl soft-shadow space-y-6 relative overflow-hidden">
      {/* Dashboard-style Section Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200/40">
            <span className="material-symbols-outlined text-white text-lg">eco</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 leading-none">Product Identity</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">Core Harvest Details</p>
          </div>
        </div>

        {/* Dashboard-style Status Toggle */}
        <label className="flex items-center gap-2 cursor-pointer group">
          <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${data.isOrganic ? 'text-green-600' : 'text-slate-400'}`}>Organic</span>
          <div className="relative">
            <input type="checkbox" checked={data.isOrganic} onChange={(e) => onChange('isOrganic', e.target.checked)} className="sr-only peer" />
            <div className="w-10 h-5.5 bg-slate-100 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-green-600 border border-slate-200"></div>
          </div>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Input Style - Synced with Dashboard Forms */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Sabji Name <span className="text-red-500">*</span></label>
          <div className="relative group/input">
            <input
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 font-bold text-slate-700 placeholder-slate-400 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/5 transition-all outline-none shadow-sm text-sm"
              placeholder="Ex: Tomato, Onion..."
              list="cropSuggestions"
            />
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-green-600 transition-colors">search</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Variety (Optional)</label>
          <input
            value={data.variety}
            onChange={(e) => onChange('variety', e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 font-bold text-slate-700 placeholder-slate-400 focus:bg-white focus:border-green-500 transition-all outline-none shadow-sm text-sm"
            placeholder="Desi, Hybrid..."
          />
        </div>
      </div>

      {/* Categories - Dashboard Grid Style */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Category Select</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <label key={cat.value} className="cursor-pointer group/cat active:scale-95 transition-transform snap-center">
              <input
                type="radio"
                name="category"
                className="peer sr-only"
                checked={data.category === cat.value}
                onChange={() => onChange('category', cat.value)}
              />
              <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-green-300 peer-checked:border-green-500 peer-checked:bg-white peer-checked:shadow-lg peer-checked:shadow-green-500/10 transition-all flex flex-col items-center gap-1.5 group-hover/cat:shadow-md">
                <span className="text-2xl filter grayscale group-hover/cat:grayscale-0 peer-checked:grayscale-0 transition-all">{cat.icon}</span>
                <span className="font-bold text-slate-600 text-[10px] peer-checked:text-green-800">{cat.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Total Quantity</label>
          <div className="flex bg-slate-50 border border-slate-100 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/5 transition-all shadow-sm">
            <input
              value={data.quantity}
              onChange={(e) => onChange('quantity', e.target.value)}
              className="flex-1 bg-transparent py-2.5 px-4 font-black text-slate-800 outline-none w-full text-sm"
              placeholder="0.00" type="number"
            />
            <select
              value={data.unit}
              onChange={(e) => onChange('unit', e.target.value)}
              className="bg-slate-100/50 border-l border-slate-200 px-3 text-[10px] font-black uppercase text-slate-600 outline-none cursor-pointer"
            >
              <option value="kg">KG</option>
              <option value="quintal">QTL</option>
              <option value="ton">TON</option>
              <option value="dozen">DZN</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Price per {data.unit}</label>
          <div className="relative group/price">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 group-focus-within/price:text-green-600 transition-colors">₹</span>
            <input
              value={data.pricePerUnit}
              onChange={(e) => onChange('pricePerUnit', e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-9 pr-4 font-black text-slate-800 placeholder-slate-400 focus:bg-white focus:border-green-500 transition-all outline-none shadow-sm text-sm"
              placeholder="0.00" type="number"
            />
          </div>
          {/* Price Advisor Hint */}
          <div className="flex items-center gap-1.5 ml-1 animate-in fade-in slide-in-from-left-2 duration-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              Market Avg: <span className="text-green-600">₹22/kg</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Harvest Date</label>
          <div className="relative group/date">
            <input
              type="date"
              value={data.harvestDate}
              onChange={(e) => onChange('harvestDate', e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 font-bold text-slate-700 focus:bg-white focus:border-green-500 transition-all outline-none shadow-sm text-sm"
            />
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/date:text-green-600 transition-colors">calendar_today</span>
          </div>
        </div>

        {/* Quality Selector - Dashboard Segment Style */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Quality Grade</label>
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
            {['A', 'B', 'C'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onChange('grade', g)}
                className={`flex-1 py-2 rounded-lg text-sm font-black transition-all ${data.grade === g ? 'bg-white text-green-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Grade {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      <datalist id="cropSuggestions">
        <option value="Tomato" />
        <option value="Potato" />
        <option value="Onion" />
        <option value="Spinach" />
        <option value="Carrot" />
        <option value="Cauliflower" />
        <option value="Cabbage" />
        <option value="Brinjal" />
        <option value="Green Chili" />
        <option value="Red Chili" />
        <option value="Okra" />
        <option value="Cucumber" />
        <option value="Radish" />
        <option value="Garlic" />
        <option value="Ginger" />
        <option value="Pumpkin" />
        <option value="Bottle Gourd" />
        <option value="Bitter Gourd" />
        <option value="Ridge Gourd" />
        <option value="Capsicum" />
        <option value="Green Peas" />
        <option value="Beetroot" />
        <option value="Sweet Potato" />
        <option value="Coriander" />
        <option value="Mint" />
        <option value="Fenugreek" />
        <option value="Broccoli" />
        <option value="Mushroom" />
        <option value="Corn" />
        <option value="Turnip" />
        <option value="Lemon" />
        <option value="Spring Onion" />
        <option value="French Beans" />
        <option value="Cluster Beans" />
        <option value="Yam" />
        <option value="Ash Gourd" />
        <option value="Drumstick" />
        <option value="Pointed Gourd" />
        <option value="Ivy Gourd" />
        <option value="Apple Gourd" />
        <option value="Jackfruit" />
        <option value="Amaranth" />
        <option value="Curry Leaves" />
      </datalist>
    </div>
  );
};

export default BasicInfo;