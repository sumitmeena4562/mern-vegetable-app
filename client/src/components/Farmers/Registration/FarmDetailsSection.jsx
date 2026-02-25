import React from 'react';
import CustomSelect from '../../common/CustomSelect';

const FarmDetailsSection = ({
    formData,
    errors,
    isTouched,
    handleChange,
    handleBlur
}) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="bg-[#FEFCE8] rounded-3xl p-6 border border-yellow-100/50">
                <h3 className="text-[16px] font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">agriculture</span>
                    Farm Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Farm Size */}
                    <div className="relative group md:col-span-1">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Farm Size (Acres) <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-full transition-all duration-300 ${isTouched.farmSize && errors.farmSize ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-amber-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined transition-colors duration-300 ${isTouched.farmSize && errors.farmSize ? 'text-red-400' : formData.farmSize ? 'text-amber-500' : 'text-slate-400'}`}>landscape</span>
                            </div>
                            <input
                                type="number"
                                name="farmSize"
                                value={formData.farmSize}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min="0.1"
                                step="0.1"
                                className={`w-full pl-11 pr-12 py-2.5 bg-white border outline-none rounded-full transition-all duration-300 text-sm
                  ${isTouched.farmSize && errors.farmSize ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-50'}
                `}
                                placeholder="e.g. 2.5"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 font-medium text-sm">Acres</span>
                            </div>
                        </div>
                        {isTouched.farmSize && errors.farmSize && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {errors.farmSize}</p>}
                    </div>

                    {/* Preferred Pickup Time */}
                    <CustomSelect
                        label="Preferred Pickup Time"
                        name="pickup"
                        value={formData.pickup}
                        options={[
                            { value: 'Morning (6 AM - 10 AM)', label: 'Morning (6 AM - 10 AM)' },
                            { value: 'Afternoon (12 PM - 4 PM)', label: 'Afternoon (12 PM - 4 PM)' },
                            { value: 'Evening (4 PM - 8 PM)', label: 'Evening (4 PM - 8 PM)' }
                        ]}
                        onChange={handleChange}
                        placeholder="Select a time"
                        icon="schedule"
                    />

                </div>
            </div>
        </div>
    );
};

export default FarmDetailsSection;
