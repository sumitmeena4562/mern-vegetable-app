import React from 'react';

const PersonalInfoSection = ({
    formData,
    errors,
    isTouched,
    handleChange,
    handleBlur,
    isVerified,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    passwordStrength,

    handleSendOtp,
    loading
}) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-[40]">
            <div className="bg-[#F0FDF4] rounded-3xl p-6 border border-green-100/50">
                <h3 className="text-[16px] font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">person</span>
                    Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="relative group">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-full transition-all duration-300 ${isTouched.fullName && errors.fullName ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-green-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.fullName && errors.fullName ? 'text-red-500' : formData.fullName ? 'text-green-600' : 'text-slate-400'}`}>badge</span>
                            </div>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full pl-12 pr-4 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] font-medium text-slate-700
                  ${isTouched.fullName && errors.fullName ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-50'}
                `}
                                placeholder="Ramesh Kumar"
                                maxLength="50"
                            />
                        </div>
                        {isTouched.fullName && errors.fullName && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div className="relative group">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Email Address <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                        </label>
                        <div className={`relative rounded-full transition-all duration-300 ${isTouched.email && errors.email ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-green-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.email && errors.email ? 'text-red-500' : formData.email ? 'text-green-600' : 'text-slate-400'}`}>mail</span>
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full pl-12 pr-4 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] font-medium text-slate-700
                  ${isTouched.email && errors.email ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-50'}
                `}
                                placeholder="ramesh@example.com"
                            />
                        </div>
                        {isTouched.email && errors.email && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {errors.email}</p>}
                    </div>

                    {/* Mobile Number & OTP */}
                    <div className="md:col-span-2">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3">
                            <div className="relative flex-1 group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.mobile && errors.mobile ? 'text-red-500' : isVerified ? 'text-green-600' : 'text-slate-400'}`}>phone_iphone</span>
                                </div>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "");
                                        handleChange({ target: { name: 'mobile', value: val } });
                                    }}
                                    onBlur={handleBlur}
                                    disabled={isVerified}
                                    className={`w-full pl-12 pr-4 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] font-medium text-slate-700
                    ${isVerified ? 'bg-slate-50 border-green-200 text-slate-600' : ''}
                    ${isTouched.mobile && errors.mobile ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-50'}
                  `}
                                    placeholder="9876543210"
                                    maxLength="10"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={formData.mobile.length !== 10 || !!errors.mobile || isVerified || loading}
                                className={`px-6 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center min-w-[100px]
                  ${isVerified
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : formData.mobile.length === 10 && !errors.mobile
                                            ? 'bg-slate-800 text-white hover:bg-slate-700 hover:shadow-lg active:scale-95'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}
                `}
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : isVerified ? (
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Verified</span>
                                ) : 'Verify'}
                            </button>
                        </div>
                        {isTouched.mobile && errors.mobile && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span> {errors.mobile}</p>}
                    </div>

                    {/* Password */}
                    <div className="relative group">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-full transition-all duration-300 ${isTouched.password && errors.password ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-green-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.password && errors.password ? 'text-red-500' : formData.password ? 'text-green-600' : 'text-slate-400'}`}>lock</span>
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full pl-12 pr-11 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] font-medium text-slate-700
                  ${isTouched.password && errors.password ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-50'}
                `}
                                placeholder="Secure@123"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-green-600 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                        {isTouched.password && errors.password && (
                            <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">error</span> {errors.password}
                            </p>
                        )}

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="mt-3">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password Strength</span>
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${passwordStrength <= 1 ? 'text-red-500' :
                                        passwordStrength <= 2 ? 'text-orange-500' :
                                            passwordStrength === 3 ? 'text-yellow-600' :
                                                passwordStrength === 4 ? 'text-emerald-500' :
                                                    'text-green-600'
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
                                                            passwordStrength === 4 ? 'bg-emerald-400' :
                                                                'bg-green-500'
                                                : 'bg-slate-100'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative group">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-full transition-all duration-300 ${isTouched.confirmPassword && errors.confirmPassword ? 'ring-2 ring-red-200' : 'group-hover:ring-2 group-hover:ring-green-100'}`}>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className={`material-symbols-outlined font-normal text-[20px] transition-colors duration-300 ${isTouched.confirmPassword && errors.confirmPassword ? 'text-red-500' : formData.confirmPassword ? (errors.confirmPassword ? 'text-red-500' : 'text-green-600') : 'text-slate-400'}`}>lock_reset</span>
                            </div>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full pl-12 pr-11 py-3 bg-white border outline-none rounded-full transition-all duration-300 text-[14px] font-medium text-slate-700
                  ${isTouched.confirmPassword && errors.confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-50'}
                `}
                                placeholder="Re-enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-green-600 transition-colors"
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
