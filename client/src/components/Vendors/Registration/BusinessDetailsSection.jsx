import React from 'react';

const BusinessDetailsSection = ({
    formData,
    errors,
    isTouched,
    handleChange,
    handleBlur,
    businessTypes
}) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 relative z-[20]">
            <div className="bg-[#F5F3FF] rounded-3xl p-6 border border-violet-100/50">
                <h3 className="text-[16px] font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-violet-600">store</span>
                    Business Details
                </h3>

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
                    <div className="relative group md:col-span-2">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Shop/Business Name <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-full transition-all duration-300 ${isTouched.shopName && errors.shopName ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-violet-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.shopName && errors.shopName ? 'text-red-500' : formData.shopName ? 'text-violet-600' : 'text-slate-400'}`}>storefront</span>
                            </div>
                            <input
                                type="text"
                                name="shopName"
                                value={formData.shopName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full pl-12 pr-4 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] font-medium text-slate-700
                  ${isTouched.shopName && errors.shopName ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-50'}
                `}
                                placeholder="e.g. Fresh Mart, The Grand Hotel"
                            />
                        </div>
                        {isTouched.shopName && errors.shopName && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {errors.shopName}</p>}
                    </div>

                    {/* Daily Capacity */}
                    <div className="relative group">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Daily Capacity (kg) <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-full transition-all duration-300 ${isTouched.dailyCapacity && errors.dailyCapacity ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-violet-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.dailyCapacity && errors.dailyCapacity ? 'text-red-500' : formData.dailyCapacity ? 'text-violet-600' : 'text-slate-400'}`}>inventory_2</span>
                            </div>
                            <input
                                type="number"
                                name="dailyCapacity"
                                value={formData.dailyCapacity}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min="1"
                                className={`w-full pl-12 pr-12 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] font-medium text-slate-700
                  ${isTouched.dailyCapacity && errors.dailyCapacity ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-50'}
                `}
                                placeholder="e.g. 50"
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 font-medium text-sm">kg</span>
                            </div>
                        </div>
                        {isTouched.dailyCapacity && errors.dailyCapacity && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {errors.dailyCapacity}</p>}
                    </div>

                    {/* FSSAI Number */}
                    <div className="relative group">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            FSSAI Number <span className="text-slate-400 font-normal ml-1 lowercase">(Optional)</span>
                        </label>
                        <div className={`relative rounded-full transition-all duration-300 ${isTouched.fssaiNumber && errors.fssaiNumber ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-violet-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.fssaiNumber && errors.fssaiNumber ? 'text-red-500' : formData.fssaiNumber ? 'text-violet-600' : 'text-slate-400'}`}>verified</span>
                            </div>
                            <input
                                type="text"
                                name="fssaiNumber"
                                value={formData.fssaiNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full pl-12 pr-4 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] font-medium text-slate-700
                  ${isTouched.fssaiNumber && errors.fssaiNumber ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-50/50'}
                `}
                                placeholder="14-digit FSSAI No."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetailsSection;
