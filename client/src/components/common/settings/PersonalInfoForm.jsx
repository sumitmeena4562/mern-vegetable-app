import React from 'react';

const PersonalInfoForm = ({ profileData, handleInputChange, themeColor = 'green', showAddress = false }) => {
    const themes = {
        green: { iconBg: 'bg-green-50', iconColor: 'text-green-600', focusRing: 'focus:border-green-500' },
        indigo: { iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', focusRing: 'focus:border-indigo-500' }
    };
    const theme = themes[themeColor] || themes.green;
    const inputClass = `w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-50 ${theme.focusRing} focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all`;

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
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName || ''}
                        onChange={handleInputChange}
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={profileData.email || ''}
                        onChange={handleInputChange}
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mobile (Read Only)</label>
                    <input
                        type="text"
                        name="mobile"
                        value={profileData.mobile || ''}
                        readOnly
                        className="w-full px-4 py-3.5 bg-slate-100 border-2 border-slate-100 rounded-2xl outline-none text-sm font-bold text-slate-500 cursor-not-allowed opacity-80"
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
                            <div key={field} className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 capitalize">{field}</label>
                                <input
                                    type="text"
                                    name={`address_${field}`}
                                    value={profileData.address?.[field] || ''}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalInfoForm;
