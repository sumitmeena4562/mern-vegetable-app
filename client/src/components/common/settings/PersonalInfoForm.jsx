import React from 'react';
import Input from '@/components/ui/Input';

const PersonalInfoForm = ({ profileData, handleInputChange, themeColor = 'green', showAddress = false }) => {
    const themes = {
        green: { iconBg: 'bg-green-50', iconColor: 'text-green-600' },
        indigo: { iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' }
    };
    const theme = themes[themeColor] || themes.green;

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 ${theme.iconBg} rounded-2xl flex items-center justify-center ${theme.iconColor}`}>
                    <span className="material-symbols-outlined text-3xl">person</span>
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Personal Information</h3>
                    <p className="text-xs text-slate-400 font-medium">Update your basic profile details</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                    label="Full Name"
                    name="fullName"
                    value={profileData.fullName || ''}
                    onChange={handleInputChange}
                />
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={profileData.email || ''}
                    onChange={handleInputChange}
                />
                <div className="flex flex-col justify-center">
                    <Input
                        label="Mobile (Read Only)"
                        name="mobile"
                        value={profileData.mobile || ''}
                        disabled
                        className="cursor-not-allowed opacity-80"
                    />
                    <p className="text-[10px] text-slate-400 mt-2 px-1 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">lock</span> Mobile number is verified and cannot be changed.
                    </p>
                </div>
            </div>

            {/* Optional Address Section */}
            {showAddress && (
                <div className="pt-4 border-t border-slate-50 mt-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-4">Address</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {['village', 'city', 'district', 'state', 'pincode'].map((field) => (
                            <Input
                                key={field}
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                name={`address_${field}`}
                                value={profileData.address?.[field] || ''}
                                onChange={handleInputChange}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalInfoForm;
