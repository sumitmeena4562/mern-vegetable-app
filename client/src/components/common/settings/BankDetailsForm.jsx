import React from 'react';
import Input from '../../ui/Input';

const BankDetailsForm = ({ formData, handleInputChange, themeColor = 'green' }) => {
    const themes = {
        green: { iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
        indigo: { iconBg: 'bg-emerald-50', iconColor: 'text-indigo-600' }
    };
    const theme = themes[themeColor] || themes.green;

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
                <div className="md:col-span-2">
                    <Input
                        label="Account Holder Name"
                        name="bank_accountHolderName"
                        value={formData.bankDetails?.accountHolderName || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <Input
                        label="Account Number"
                        name="bank_accountNumber"
                        value={formData.bankDetails?.accountNumber || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <Input
                        label="IFSC Code"
                        name="bank_ifscCode"
                        value={formData.bankDetails?.ifscCode || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <Input
                        label="Bank Name"
                        name="bank_bankName"
                        value={formData.bankDetails?.bankName || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <Input
                        label="Branch Name"
                        name="bank_branch"
                        value={formData.bankDetails?.branch || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default BankDetailsForm;
