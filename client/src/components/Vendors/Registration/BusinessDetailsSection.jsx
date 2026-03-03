import React from 'react';
import Input from '../../ui/Input';
import { RegistrationCard } from '../../common/Registration/SharedUI';

const BusinessDetailsSection = ({ formData, errors, isTouched, handleChange, handleBlur, businessTypes }) => {
    return (
        <RegistrationCard
            title="Business Details"
            icon="store"
            iconColor="text-violet-600"
            bgColor="bg-[#F5F3FF]"
            borderColor="border-violet-100/50"
            delayClass="delay-200"
        >

            {/* Business Type Selector */}
            <div className="mb-8">
                <label className="block text-[13px] font-bold text-slate-700 mb-4">
                    Business Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {businessTypes.map((type) => (
                        <label key={type.id} className="cursor-pointer group relative">
                            <input
                                type="radio"
                                name="businessType"
                                value={type.id}
                                className="peer sr-only"
                                checked={formData.businessType === type.id}
                                onChange={handleChange}
                            />
                            <div className={`rounded-2xl p-4 flex flex-col items-center justify-center text-center border-2 transition-all duration-300 active:scale-95
                                    ${formData.businessType === type.id
                                    ? 'bg-violet-50 border-violet-500 shadow-sm'
                                    : 'bg-white border-transparent shadow-sm hover:border-violet-200'}
                                `}>
                                <span className="text-2xl mb-2 drop-shadow-sm">{type.emoji}</span>
                                <span className={`text-[13px] font-bold transition-colors ${formData.businessType === type.id ? 'text-violet-900' : 'text-slate-700 group-hover:text-violet-600'}`}>
                                    {type.label}
                                </span>
                                {formData.businessType === type.id && (
                                    <div className="absolute top-2 right-2">
                                        <span className="material-symbols-outlined text-violet-600 text-[18px] font-bold">check_circle</span>
                                    </div>
                                )}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shop Name */}
                <div className="md:col-span-2">
                    <Input
                        label={<>Shop/Business Name <span className="text-red-500">*</span></>}
                        name="shopName"
                        type="text"
                        value={formData.shopName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        icon="storefront"
                        placeholder="e.g. Fresh Mart, The Grand Hotel"
                        error={isTouched.shopName && errors.shopName ? errors.shopName : null}
                        className="rounded-full focus:ring-violet-500/30 focus:border-violet-500"
                    />
                </div>

                {/* Daily Capacity */}
                <div className="md:col-span-1">
                    <Input
                        label={<>Daily Capacity (kg) <span className="text-red-500">*</span></>}
                        name="dailyCapacity"
                        type="number"
                        value={formData.dailyCapacity}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="1"
                        icon="inventory_2"
                        suffix="kg"
                        placeholder="e.g. 50"
                        error={isTouched.dailyCapacity && errors.dailyCapacity ? errors.dailyCapacity : null}
                        className="rounded-full focus:ring-violet-500/30 focus:border-violet-500"
                    />
                </div>

                {/* FSSAI Number */}
                <div className="md:col-span-1">
                    <Input
                        label={<>FSSAI Number <span className="text-slate-400 font-normal ml-1 lowercase">(Optional)</span></>}
                        name="fssaiNumber"
                        type="text"
                        value={formData.fssaiNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        icon="verified"
                        placeholder="14-digit FSSAI No."
                        error={isTouched.fssaiNumber && errors.fssaiNumber ? errors.fssaiNumber : null}
                        className="rounded-full focus:ring-violet-500/30 focus:border-violet-500"
                    />
                </div>
            </div>
        </RegistrationCard>
    );
};

export default BusinessDetailsSection;
