import React from 'react';
import Input from '@/components/ui/Input';

const SecurityForm = ({ securityData, handleSecurityChange, themeColor = 'green' }) => {
    const themes = {
        green: { iconBg: 'bg-red-50', iconColor: 'text-red-600' },
        indigo: { iconBg: 'bg-red-50', iconColor: 'text-red-600' }
    };
    const theme = themes[themeColor] || themes.green;

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
                <div className="md:col-span-2">
                    <Input
                        label="Current Password"
                        type="password"
                        name="currentPassword"
                        value={securityData.currentPassword || ''}
                        onChange={handleSecurityChange}
                    />
                </div>
                <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={securityData.newPassword || ''}
                    onChange={handleSecurityChange}
                />
                <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={securityData.confirmPassword || ''}
                    onChange={handleSecurityChange}
                />
            </div>
        </div>
    );
};

export default SecurityForm;
