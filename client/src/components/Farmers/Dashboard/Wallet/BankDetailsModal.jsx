import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { updateBankDetails } from '@/api/userApi';
import { toast } from 'react-hot-toast';

const BankDetailsModal = ({ onClose, existingDetails, onSuccess }) => {
    const [form, setForm] = useState({
        accountHolderName: existingDetails?.accountHolderName || '',
        accountNumber: existingDetails?.accountNumber || '',
        confirmAccountNumber: existingDetails?.accountNumber || '',
        ifscCode: existingDetails?.ifscCode || '',
        bankName: existingDetails?.bankName || '',
        branch: existingDetails?.branch || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.accountNumber !== form.confirmAccountNumber) {
            toast.error('Account numbers do not match');
            return;
        }
        if (!form.accountHolderName || !form.accountNumber || !form.ifscCode || !form.bankName) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            setSaving(true);
            // eslint-disable-next-line no-unused-vars
            const { confirmAccountNumber, ...bankData } = form;
            const res = await updateBankDetails(bankData);
            if (res.success) {
                toast.success('Bank details updated successfully!');
                onSuccess?.();
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update bank details');
        } finally {
            setSaving(false);
        }
    };

    const fields = [
        { key: 'accountHolderName', label: 'Account Holder Name', icon: 'person', required: true },
        { key: 'bankName', label: 'Bank Name', icon: 'account_balance', required: true },
        { key: 'accountNumber', label: 'Account Number', icon: 'pin', type: 'password', required: true },
        { key: 'confirmAccountNumber', label: 'Confirm Account Number', icon: 'pin', required: true },
        { key: 'ifscCode', label: 'IFSC Code', icon: 'tag', required: true, uppercase: true },
        { key: 'branch', label: 'Branch Name', icon: 'location_on' },
    ];

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
            <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                            <span className="material-symbols-outlined text-2xl">account_balance</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">
                                {existingDetails ? 'Update Bank Details' : 'Add Bank Account'}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">For withdrawal payouts</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {fields.map(({ key, label, icon, type, required, uppercase }) => (
                        <div key={key} className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                                {label} {required && <span className="text-red-400">*</span>}
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined text-lg text-slate-300 absolute left-4 top-1/2 -translate-y-1/2">{icon}</span>
                                <input
                                    type={type || 'text'}
                                    value={form[key]}
                                    onChange={(e) => setForm({ ...form, [key]: uppercase ? e.target.value.toUpperCase() : e.target.value })}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-50 focus:border-green-500 focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all"
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                    required={required}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Security Notice */}
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                        <span className="material-symbols-outlined text-blue-500 mt-0.5">shield</span>
                        <p className="text-[11px] font-bold text-blue-700 leading-relaxed">
                            Your bank details are encrypted and stored securely. We only use these for withdrawal payouts.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-green-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">save</span>
                                    {existingDetails ? 'Update' : 'Save'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default BankDetailsModal;
