import React from 'react';
import Select from '../../ui/Select';
import Input from '../../ui/Input';

const FarmDetailsSection = ({
    formData,
    errors,
    isTouched,
    handleChange,
    handleBlur
}) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 relative z-[20]">
            <div className="bg-[#FEFCE8] rounded-3xl p-6 border border-yellow-100/50">
                <h3 className="text-[16px] font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">agriculture</span>
                    Farm Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Farm Size */}
                    <div className="md:col-span-1">
                        <Input
                            label={<>Farm Size (Acres) <span className="text-red-500">*</span></>}
                            name="farmSize"
                            type="number"
                            value={formData.farmSize}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            min="0.1"
                            step="0.1"
                            icon="landscape"
                            suffix="Acres"
                            placeholder="e.g. 2.5"
                            error={isTouched.farmSize && errors.farmSize ? errors.farmSize : null}
                            className={`rounded-full ${isTouched.farmSize && errors.farmSize ? '' : 'focus:border-amber-500 focus:ring-amber-50'}`}
                        />
                    </div>

                    {/* Preferred Pickup Time */}
                    <Select
                        label="Preferred Pickup Time"
                        name="pickup"
                        value={formData.pickup}
                        options={[
                            { value: "", label: "Select a time" },
                            { value: 'Morning (6 AM - 10 AM)', label: 'Morning (6 AM - 10 AM)' },
                            { value: 'Afternoon (12 PM - 4 PM)', label: 'Afternoon (12 PM - 4 PM)' },
                            { value: 'Evening (4 PM - 8 PM)', label: 'Evening (4 PM - 8 PM)' }
                        ]}
                        onChange={handleChange}
                        icon="schedule"
                        className="rounded-full"
                    />

                </div>
            </div>
        </div>
    );
};

export default FarmDetailsSection;
