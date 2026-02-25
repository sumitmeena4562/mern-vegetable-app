import React from 'react';

const PersonalInfoSection = ({
    formData,
    errors,
    isTouched,
    handleChange,
    handleBlur,
    isVerified,
    passwordStrength,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleSendOtp,
    loading
}) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-[40]">
            <div className="bg-[#EEF2FF] rounded-3xl p-6 border border-indigo-100/50">
                <h3 className="text-[16px] font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-indigo-600">person</span>
                    Personal Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="relative group md:col-span-2">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-full transition-all duration-300 ${isTouched.fullName && errors.fullName ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-indigo-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.fullName && errors.fullName ? 'text-red-500' : formData.fullName ? 'text-indigo-600' : 'text-slate-400'}`}>badge</span>
                            </div>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full pl-12 pr-4 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] font-medium text-slate-700
                  ${isTouched.fullName && errors.fullName ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'}
                `}
                                placeholder="Ramesh Kumar"
                                maxLength="50"
                            />
                        </div>
                        {isTouched.fullName && errors.fullName && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div className="relative group md:col-span-1">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-full transition-all duration-300 ${isTouched.email && errors.email ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-indigo-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.email && errors.email ? 'text-red-500' : formData.email ? 'text-indigo-600' : 'text-slate-400'}`}>mail</span>
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full pl-12 pr-4 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] font-medium text-slate-700
                  ${isTouched.email && errors.email ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'}
                `}
                                placeholder="ramesh@example.com"
                            />
                        </div>
                        {isTouched.email && errors.email && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {errors.email}</p>}
                    </div>

                    {/* Mobile Number */}
                    <div className="relative group md:col-span-1">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3">
                            <div className={`relative flex-1 rounded-full transition-all duration-300 ${isTouched.mobile && errors.mobile ? 'ring-2 ring-red-200' : isVerified ? 'ring-2 ring-emerald-100' : 'group-hover:ring-2 group-hover:ring-indigo-100'}`}>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.mobile && errors.mobile ? 'text-red-500' : isVerified ? 'text-emerald-500' : formData.mobile ? 'text-indigo-600' : 'text-slate-400'}`}>smartphone</span>
                                </div>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full pl-12 pr-4 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] font-medium text-slate-700
                    ${isTouched.mobile && errors.mobile ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : isVerified ? 'border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'}
                  `}
                                    placeholder="9876543210"
                                    maxLength="10"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading || isVerified}
                                className={`px-4 rounded-full font-bold text-xs transition-all duration-300 flex items-center gap-2
                  ${isVerified ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default' : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-200'}
                `}
                            >
                                {isVerified ? (<><span className="material-symbols-outlined text-sm">verified_user</span> Verified</>) : loading ? 'Sending...' : 'Verify'}
                            </button>
                        </div>
                        {isTouched.mobile && errors.mobile && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {errors.mobile}</p>}
                    </div>

                    {/* Password */}
                    <div className="relative group md:col-span-1">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-full transition-all duration-300 ${isTouched.password && errors.password ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-indigo-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.password && errors.password ? 'text-red-500' : formData.password ? 'text-indigo-600' : 'text-slate-400'}`}>lock</span>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full pl-12 pr-12 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] font-medium text-slate-700
                  ${isTouched.password && errors.password ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'}
                `}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="mt-3">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password Strength</span>
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${passwordStrength <= 1 ? 'text-red-500' :
                                            passwordStrength <= 2 ? 'text-orange-500' :
                                                passwordStrength === 3 ? 'text-yellow-600' :
                                                    passwordStrength === 4 ? 'text-indigo-500' :
                                                        'text-indigo-600'
                                        }`}>
                                        {passwordStrength === 0 ? 'Very Weak' :
                                            passwordStrength === 1 ? 'Weak' :
                                                passwordStrength === 2 ? 'Fair' :
                                                    passwordStrength === 3 ? 'Good' :
                                                        passwordStrength === 4 ? 'Strong' :
                                                            'Excellent'}
                                    </span>
                                </div>
                                <div className="flex gap-1.5 h-1.5">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={`flex-1 rounded-full transition-all duration-500 ${passwordStrength >= level
                                                ? passwordStrength <= 1 ? 'bg-red-400' :
                                                    passwordStrength <= 2 ? 'bg-orange-400' :
                                                        passwordStrength === 3 ? 'bg-yellow-400' :
                                                            passwordStrength === 4 ? 'bg-indigo-400' :
                                                                'bg-indigo-500'
                                                : 'bg-slate-100'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {isTouched.password && errors.password && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative group md:col-span-1">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-full transition-all duration-300 ${isTouched.confirmPassword && errors.confirmPassword ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-indigo-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.confirmPassword && errors.confirmPassword ? 'text-red-500' : formData.confirmPassword && !errors.confirmPassword ? 'text-indigo-600' : 'text-slate-400'}`}>lock_reset</span>
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full pl-12 pr-12 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] font-medium text-slate-700
                  ${isTouched.confirmPassword && errors.confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'}
                `}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                        {isTouched.confirmPassword && errors.confirmPassword && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {errors.confirmPassword}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoSection;
