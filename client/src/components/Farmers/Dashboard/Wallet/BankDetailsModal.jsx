import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
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

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={existingDetails ? 'Update Bank Details' : 'Add Bank Account'}
            subtitle="For withdrawal payouts"
            maxWidth="max-w-lg"
        >
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {fields.map(({ key, label, icon, type, required, uppercase }) => (
                    <div key={key} className="space-y-1.5 flex-1">
                        <Input
                            type={type || 'text'}
                            label={label + (required ? ' *' : '')}
                            value={form[key]}
                            onChange={(e) => setForm({ ...form, [key]: uppercase ? e.target.value.toUpperCase() : e.target.value })}
                            icon={icon}
                            placeholder={`Enter ${label.toLowerCase()}`}
                            required={required}
                        />
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
                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1 text-[10px] py-4 uppercase tracking-widest rounded-2xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        isLoading={saving}
                        icon="save"
                        className="flex-1 text-[10px] py-4 uppercase tracking-widest rounded-2xl"
                    >
                        {existingDetails ? 'Update' : 'Save'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default BankDetailsModal;
