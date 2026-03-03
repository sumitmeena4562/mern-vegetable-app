import React from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const FarmDetailsForm = ({ farm, handleFarmChange, toggleColdStorage }) => {
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
                <Input
                    label="Farm Name"
                    name="farmName"
                    value={farm.farmName}
                    onChange={handleFarmChange}
                />

                {/* Farm Size + Unit */}
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Farm Size"
                        type="number"
                        name="farmSize"
                        value={farm.farmSize}
                        onChange={handleFarmChange}
                    />
                    <Select
                        label="Unit"
                        name="farmSizeUnit"
                        value={farm.farmSizeUnit}
                        onChange={handleFarmChange}
                        options={[
                            { value: 'acre', label: 'Acres' },
                            { value: 'hectare', label: 'Hectares' },
                            { value: 'bigha', label: 'Bigha' }
                        ]}
                    />
                </div>

                {/* Farming Type */}
                <Select
                    label="Farming Type"
                    name="farmingType"
                    value={farm.farmingType}
                    onChange={handleFarmChange}
                    options={[
                        { value: 'organic', label: 'Organic' },
                        { value: 'natural', label: 'Natural' },
                        { value: 'regular', label: 'Regular' },
                        { value: 'hydroponic', label: 'Hydroponic' }
                    ]}
                />

                {/* Soil Type */}
                <Select
                    label="Soil Type"
                    name="soilType"
                    value={farm.soilType}
                    onChange={handleFarmChange}
                    options={[
                        { value: 'black', label: 'Black Soil' },
                        { value: 'red', label: 'Red Soil' },
                        { value: 'alluvial', label: 'Alluvial Soil' },
                        { value: 'sandy', label: 'Sandy Soil' },
                        { value: 'clay', label: 'Clay Soil' },
                        { value: 'other', label: 'Other' }
                    ]}
                />

                {/* Irrigation System */}
                <Select
                    label="Irrigation System"
                    name="irrigationSystem"
                    value={farm.irrigationSystem}
                    onChange={handleFarmChange}
                    options={[
                        { value: 'drip', label: 'Drip Irrigation' },
                        { value: 'sprinkler', label: 'Sprinkler' },
                        { value: 'tubewell', label: 'Tubewell' },
                        { value: 'canal', label: 'Canal' },
                        { value: 'manual', label: 'Manual' }
                    ]}
                />

                {/* Water Source */}
                <Select
                    label="Water Source"
                    name="waterSource"
                    value={farm.waterSource}
                    onChange={handleFarmChange}
                    options={[
                        { value: 'borewell', label: 'Borewell' },
                        { value: 'river', label: 'River' },
                        { value: 'canal', label: 'Canal' },
                        { value: 'rainwater', label: 'Rainwater' },
                        { value: 'well', label: 'Well' }
                    ]}
                />

                {/* Land Ownership */}
                <Select
                    label="Land Ownership"
                    name="landOwnership"
                    value={farm.landOwnership}
                    onChange={handleFarmChange}
                    options={[
                        { value: 'owned', label: 'Owned' },
                        { value: 'leased', label: 'Leased' }
                    ]}
                />

                {/* Primary Crop */}
                <Input
                    label="Primary Crop"
                    name="primaryCrop"
                    value={farm.primaryCrop}
                    onChange={handleFarmChange}
                    placeholder="e.g., Tomato Specialist"
                />

                {/* Experience */}
                <Input
                    label="Experience (Years)"
                    type="number"
                    name="farmingExperience"
                    value={farm.farmingExperience}
                    onChange={handleFarmChange}
                />

                {/* Preferred Pickup Time */}
                <Select
                    label="Preferred Pickup Time"
                    name="preferredPickupTime"
                    value={farm.preferredPickupTime}
                    onChange={handleFarmChange}
                    options={[
                        { value: 'morning', label: 'Morning (6 AM - 10 AM)' },
                        { value: 'afternoon', label: 'Afternoon (12 PM - 3 PM)' },
                        { value: 'evening', label: 'Evening (4 PM - 7 PM)' },
                        { value: 'any', label: 'Any Time' }
                    ]}
                />
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
