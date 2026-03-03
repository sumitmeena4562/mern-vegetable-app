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
                        className="rounded-full"
                    />

                    {/* Email */}
                    <Input
                        label={<>Email Address <span className="text-slate-400 font-normal ml-1">(Optional)</span></>}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        icon="mail"
                        placeholder="ramesh@example.com"
                        error={isTouched.email && errors.email ? errors.email : null}
                        className="rounded-full"
                    />

                    {/* Mobile Number & OTP */}
                    <div className="md:col-span-2">
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3 items-start">
                            <Input
                                name="mobile"
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    handleChange({ target: { name: 'mobile', value: val } });
                                }}
                                onBlur={handleBlur}
                                disabled={isVerified}
                                icon="phone_iphone"
                                placeholder="9876543210"
                                maxLength="10"
                                error={isTouched.mobile && errors.mobile ? errors.mobile : null}
                                className={`rounded-full ${isVerified ? 'bg-slate-50 border-green-200 text-slate-600' : ''}`}
                                wrapperClassName="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={formData.mobile.length !== 10 || !!errors.mobile || isVerified || loading}
                                isLoading={loading}
                                variant={isVerified ? "soft" : (formData.mobile.length === 10 && !errors.mobile ? "primary" : "outline")}
                                className="rounded-full py-3 px-6 h-[46px]"
                            >
                                {isVerified ? (
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Verified</span>
                                ) : 'Verify'}
                            </Button>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="relative group flex flex-col pt-1">
                        <Input
                            label={<>Password <span className="text-red-500">*</span></>}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            icon="lock"
                            placeholder="Secure@123"
                            error={isTouched.password && errors.password ? errors.password : null}
                            className="rounded-full pr-11"
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-slate-400 hover:text-green-600 transition-colors flex items-center justify-center p-1"
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
                    <div className="relative group flex flex-col pt-1">
                        <Input
                            label={<>Confirm Password <span className="text-red-500">*</span></>}
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            icon="lock_reset"
                            placeholder="Re-enter password"
                            error={isTouched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : null}
                            className="rounded-full pr-11"
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="text-slate-400 hover:text-green-600 transition-colors flex items-center justify-center p-1"
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
