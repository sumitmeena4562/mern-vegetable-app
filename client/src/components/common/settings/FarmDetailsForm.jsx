import React from 'react';

const FarmDetailsForm = ({ farm, handleFarmChange, toggleColdStorage }) => {
    const inputClass = "w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-50 focus:border-green-500 focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all text-ellipsis";
    const selectClass = "w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-50 focus:border-green-500 focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all appearance-none";

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                    <span className="material-symbols-outlined text-3xl">agriculture</span>
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Farm Details</h3>
                    <p className="text-xs text-slate-400 font-medium">Update your farm information and infrastructure</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {/* Farm Name */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Farm Name</label>
                    <input type="text" name="farmName" value={farm.farmName} onChange={handleFarmChange} className={inputClass} />
                </div>

                {/* Farm Size + Unit */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Farm Size</label>
                        <input type="number" name="farmSize" value={farm.farmSize} onChange={handleFarmChange} className={inputClass} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Unit</label>
                        <select name="farmSizeUnit" value={farm.farmSizeUnit} onChange={handleFarmChange} className={selectClass}>
                            <option value="acre">Acres</option>
                            <option value="hectare">Hectares</option>
                            <option value="bigha">Bigha</option>
                        </select>
                    </div>
                </div>

                {/* Farming Type */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Farming Type</label>
                    <select name="farmingType" value={farm.farmingType} onChange={handleFarmChange} className={selectClass}>
                        <option value="organic">Organic</option>
                        <option value="natural">Natural</option>
                        <option value="regular">Regular</option>
                        <option value="hydroponic">Hydroponic</option>
                    </select>
                </div>

                {/* Soil Type */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Soil Type</label>
                    <select name="soilType" value={farm.soilType} onChange={handleFarmChange} className={selectClass}>
                        <option value="black">Black Soil</option>
                        <option value="red">Red Soil</option>
                        <option value="alluvial">Alluvial Soil</option>
                        <option value="sandy">Sandy Soil</option>
                        <option value="clay">Clay Soil</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Irrigation System */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Irrigation System</label>
                    <select name="irrigationSystem" value={farm.irrigationSystem} onChange={handleFarmChange} className={selectClass}>
                        <option value="drip">Drip Irrigation</option>
                        <option value="sprinkler">Sprinkler</option>
                        <option value="tubewell">Tubewell</option>
                        <option value="canal">Canal</option>
                        <option value="manual">Manual</option>
                    </select>
                </div>

                {/* Water Source */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Water Source</label>
                    <select name="waterSource" value={farm.waterSource} onChange={handleFarmChange} className={selectClass}>
                        <option value="borewell">Borewell</option>
                        <option value="river">River</option>
                        <option value="canal">Canal</option>
                        <option value="rainwater">Rainwater</option>
                        <option value="well">Well</option>
                    </select>
                </div>

                {/* Land Ownership */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Land Ownership</label>
                    <select name="landOwnership" value={farm.landOwnership} onChange={handleFarmChange} className={selectClass}>
                        <option value="owned">Owned</option>
                        <option value="leased">Leased</option>
                    </select>
                </div>

                {/* Primary Crop */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Crop</label>
                    <input type="text" name="primaryCrop" value={farm.primaryCrop} onChange={handleFarmChange} placeholder="e.g., Tomato Specialist" className={inputClass + " placeholder:text-slate-300"} />
                </div>

                {/* Experience */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Experience (Years)</label>
                    <input type="number" name="farmingExperience" value={farm.farmingExperience} onChange={handleFarmChange} className={inputClass} />
                </div>

                {/* Preferred Pickup Time */}
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Preferred Pickup Time</label>
                    <select name="preferredPickupTime" value={farm.preferredPickupTime} onChange={handleFarmChange} className={selectClass}>
                        <option value="morning">Morning (6 AM - 10 AM)</option>
                        <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
                        <option value="evening">Evening (4 PM - 7 PM)</option>
                        <option value="any">Any Time</option>
                    </select>
                </div>
            </div>

            {/* Cold Storage Toggle */}
            <div className="pt-4 border-t border-slate-50">
                <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                            <span className="material-symbols-outlined text-blue-500">ac_unit</span>
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-800">Cold Storage Available</p>
                            <p className="text-xs text-slate-400 font-medium">Do you have cold storage on your farm?</p>
                        </div>
                    </div>
                    <button onClick={toggleColdStorage} className={`relative shrink-0 w-12 h-7 rounded-full transition-all ${farm.hasColdStorage ? 'bg-green-500' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${farm.hasColdStorage ? 'left-6' : 'left-1'}`}></div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FarmDetailsForm;
