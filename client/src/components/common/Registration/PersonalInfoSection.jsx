import React from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

/**
 * Shared PersonalInfoSection — used by both FarmerRegistration and VendorRegistration.
 *
 * @param {object} theme - Visual theme config:
 *   { bg, iconColor, focusRing, hoverColor, strengthHigh, strengthBar, emailRequired, fullNameSpan, mobileIcon, verifyBtnClass }
 */

// Pre-built theme configs
export const FARMER_THEME = {
    bg: 'bg-[#F0FDF4]',
    border: 'border-green-100/50',
    iconColor: 'text-green-600',
    focusRing: '',
    hoverColor: 'hover:text-green-600',
    strengthHigh: 'text-green-600',
    strengthBar: 'bg-green-500',
    strengthMid: 'text-emerald-500',
    strengthMidBar: 'bg-emerald-400',
    emailRequired: false,
    fullNameSpan: '',
    mobileIcon: 'phone_iphone',
    mobileFocusClass: '',
    verifiedBorderClass: 'border-green-200',
    verifyBtnClass: '',
    passwordPlaceholder: 'Secure@123',
    confirmPlaceholder: 'Re-enter password',
};

export const VENDOR_THEME = {
    bg: 'bg-[#EEF2FF]',
    border: 'border-indigo-100/50',
    iconColor: 'text-indigo-600',
    focusRing: 'focus:ring-indigo-500/30 focus:border-indigo-500',
    hoverColor: 'hover:text-indigo-600',
    strengthHigh: 'text-indigo-600',
    strengthBar: 'bg-indigo-500',
    strengthMid: 'text-indigo-500',
    strengthMidBar: 'bg-indigo-400',
    emailRequired: true,
    fullNameSpan: 'md:col-span-2',
    mobileIcon: 'smartphone',
    mobileFocusClass: 'focus:ring-indigo-500/30 focus:border-indigo-500',
    verifiedBorderClass: 'border-emerald-300',
    verifyBtnClass: 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-200',
    passwordPlaceholder: '••••••••',
    confirmPlaceholder: '••••••••',
};

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
    loading,
    theme = FARMER_THEME,
}) => {
    const t = theme;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-[40]">
            <div className={`${t.bg} rounded-3xl p-6 border ${t.border}`}>
                <h3 className="text-[16px] font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <span className={`material-symbols-outlined ${t.iconColor}`}>person</span>
                    Personal Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className={t.fullNameSpan}>
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
                            className={`rounded-xl ${t.focusRing}`}
                        />
                    </div>

                    {/* Email */}
                    <div className={t.emailRequired ? 'md:col-span-1' : ''}>
                        <Input
                            label={<>Email Address {t.emailRequired
                                ? <span className="text-red-500">*</span>
                                : <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                            }</>}
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            icon="mail"
                            placeholder="ramesh@example.com"
                            error={isTouched.email && errors.email ? errors.email : null}
                            className={`rounded-xl ${t.focusRing}`}
                        />
                    </div>

                    {/* Mobile Number & OTP */}
                    <div className={t.emailRequired ? 'md:col-span-1' : 'md:col-span-2'}>
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
                                icon={t.mobileIcon}
                                placeholder="9876543210"
                                maxLength="10"
                                error={isTouched.mobile && errors.mobile ? errors.mobile : null}
                                className={`rounded-xl ${isVerified ? `bg-slate-50 ${t.verifiedBorderClass} text-slate-600` : t.mobileFocusClass}`}
                                wrapperClassName="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={formData.mobile.length !== 10 || !!errors.mobile || isVerified || loading}
                                isLoading={loading}
                                icon={isVerified ? "verified_user" : null}
                                variant={isVerified ? "soft" : (formData.mobile.length === 10 && !errors.mobile ? "primary" : "outline")}
                                className={`rounded-xl min-w-[100px] h-[46px] ${isVerified
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
                                    : (formData.mobile.length === 10 && !errors.mobile ? t.verifyBtnClass : '')
                                    }`}
                            >
                                {isVerified ? (
                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Verified</span>
                                ) : 'Verify'}
                            </Button>
                        </div>
                    </div>

                    {/* Password */}
                    <div className={`relative group flex flex-col pt-1 ${t.emailRequired ? 'md:col-span-1' : ''}`}>
                        <Input
                            label={<>Password <span className="text-red-500">*</span></>}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            icon="lock"
                            placeholder={t.passwordPlaceholder}
                            error={isTouched.password && errors.password ? errors.password : null}
                            className={`rounded-xl pr-11 ${t.focusRing}`}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`text-slate-400 ${t.hoverColor} transition-colors flex items-center justify-center p-1`}
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
                                                passwordStrength === 4 ? t.strengthMid :
                                                    t.strengthHigh
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
                                                            passwordStrength === 4 ? t.strengthMidBar :
                                                                t.strengthBar
                                                : 'bg-slate-100'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className={`relative group flex flex-col pt-1 ${t.emailRequired ? 'md:col-span-1' : ''}`}>
                        <Input
                            label={<>Confirm Password <span className="text-red-500">*</span></>}
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            icon="lock_reset"
                            placeholder={t.confirmPlaceholder}
                            error={isTouched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : null}
                            className={`rounded-xl pr-11 ${t.focusRing}`}
                            rightElement={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className={`text-slate-400 ${t.hoverColor} transition-colors flex items-center justify-center p-1`}
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
