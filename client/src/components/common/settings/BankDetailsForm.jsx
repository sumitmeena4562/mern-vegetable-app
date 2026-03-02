import React from 'react';

const BankDetailsForm = ({ formData, handleInputChange, themeColor = 'green' }) => {
    const themes = {
        green: { iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', focusRing: 'focus:border-green-500' },
        indigo: { iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', focusRing: 'focus:border-indigo-500' }
    };
    const theme = themes[themeColor] || themes.green;
    const inputClass = `w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-50 ${theme.focusRing} focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all`;

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 ${theme.iconBg} rounded-2xl flex items-center justify-center ${theme.iconColor}`}>
                    <span className="material-symbols-outlined text-3xl">account_balance</span>
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Bank Details</h3>
                    <p className="text-xs text-slate-400 font-medium">Manage your payout account information securely</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Account Holder Name</label>
                    <input
                        type="text"
                        name="bank_accountHolderName"
                        value={formData.bankDetails?.accountHolderName || ''}
                        onChange={handleInputChange}
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Account Number</label>
                    <input
                        type="text"
                        name="bank_accountNumber"
                        value={formData.bankDetails?.accountNumber || ''}
                        onChange={handleInputChange}
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">IFSC Code</label>
                    <input
                        type="text"
                        name="bank_ifscCode"
                        value={formData.bankDetails?.ifscCode || ''}
                        onChange={handleInputChange}
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Bank Name</label>
                    <input
                        type="text"
                        name="bank_bankName"
                        value={formData.bankDetails?.bankName || ''}
                        onChange={handleInputChange}
                        className={inputClass}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Branch Name</label>
                    <input
                        type="text"
                        name="bank_branch"
                        value={formData.bankDetails?.branch || ''}
                        onChange={handleInputChange}
                        className={inputClass}
                    />
                </div>
            </div>
        </div>
    );
};

export default BankDetailsForm;
