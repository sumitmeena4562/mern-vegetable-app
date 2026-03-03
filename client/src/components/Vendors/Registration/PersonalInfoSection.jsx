import React from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

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
                    <div className="md:col-span-2">
                        <Input
                            label={<>Full Name <span className="text-red-500">*</span></>}
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            icon="badge"
                            placeholder="Ramesh Kumar"
                            maxLength="50"
                            error={isTouched.fullName && errors.fullName ? errors.fullName : null}
                            className="rounded-full focus:ring-indigo-500/30 focus:border-indigo-500"
                        />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-1">
                        <Input
                            label={<>Email Address <span className="text-red-500">*</span></>}
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            icon="mail"
                            placeholder="ramesh@example.com"
                            error={isTouched.email && errors.email ? errors.email : null}
                            className="rounded-full focus:ring-indigo-500/30 focus:border-indigo-500"
                        />
                    </div>

                    {/* Mobile Number */}
                    <div className="md:col-span-1">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3 items-start">
                            <Input
                                name="mobile"
                                type="text"
                                value={formData.mobile}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                icon="smartphone"
                                placeholder="9876543210"
                                maxLength="10"
                                disabled={isVerified}
                                error={isTouched.mobile && errors.mobile ? errors.mobile : null}
                                className={`rounded-full ${isVerified ? 'bg-slate-50 border-emerald-300 text-slate-600' : 'focus:ring-indigo-500/30 focus:border-indigo-500'}`}
                                wrapperClassName="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading || isVerified || formData.mobile.length !== 10}
                                isLoading={loading}
                                icon={isVerified ? "verified_user" : null}
                                variant={isVerified ? "soft" : "primary"}
                                className={`rounded-full min-w-[100px] h-[46px] ${isVerified ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default' : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-200'}`}
                            >
                                {isVerified ? 'Verified' : 'Verify'}
                            </Button>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="relative group md:col-span-1 flex flex-col pt-1">
                        <Input
                            label={<>Password <span className="text-red-500">*</span></>}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            icon="lock"
                            placeholder="••••••••"
                            error={isTouched.password && errors.password ? errors.password : null}
                            className="rounded-full pr-12 focus:ring-indigo-500/30 focus:border-indigo-500"
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center justify-center p-1"
                                >
                                    <span className="material-symbols-outlined text-[20px] leading-none">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            }
                        />

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
                    </div>

                    {/* Confirm Password */}
                    <div className="relative group md:col-span-1 flex flex-col pt-1">
                        <Input
                            label={<>Confirm Password <span className="text-red-500">*</span></>}
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            icon="lock_reset"
                            placeholder="••••••••"
                            error={isTouched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : null}
                            className="rounded-full pr-12 focus:ring-indigo-500/30 focus:border-indigo-500"
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="text-slate-400 hover:text-indigo-600 transition-colors flex items-center justify-center p-1"
                                >
                                    <span className="material-symbols-outlined text-[20px] leading-none">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoSection;
