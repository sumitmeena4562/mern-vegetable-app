import React from 'react';

const SecurityForm = ({ securityData, handleSecurityChange, themeColor = 'green' }) => {
    const themes = {
        green: { iconBg: 'bg-red-50', iconColor: 'text-red-600', focusRing: 'focus:border-green-500' },
        indigo: { iconBg: 'bg-red-50', iconColor: 'text-red-600', focusRing: 'focus:border-indigo-500' }
    };
    const theme = themes[themeColor] || themes.green;
    const inputClass = `w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-50 ${theme.focusRing} focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all`;

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 ${theme.iconBg} rounded-2xl flex items-center justify-center ${theme.iconColor}`}>
                    <span className="material-symbols-outlined text-3xl">security</span>
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Security Settings</h3>
                    <p className="text-xs text-slate-400 font-medium">Update your password to keep your account secure</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Current Password</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={securityData.currentPassword || ''}
                        onChange={handleSecurityChange}
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">New Password</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={securityData.newPassword || ''}
                        onChange={handleSecurityChange}
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Confirm New Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={securityData.confirmPassword || ''}
                        onChange={handleSecurityChange}
                        className={inputClass}
                    />
                </div>
            </div>
        </div>
    );
};

export default SecurityForm;
