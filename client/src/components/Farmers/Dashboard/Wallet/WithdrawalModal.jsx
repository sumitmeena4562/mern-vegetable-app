import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { requestWithdrawal } from '@/api/userApi';

const WithdrawalModal = ({ onClose, availableBalance, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!amount || isNaN(amount) || amount <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (amount > availableBalance) {
            setError('Amount exceeds available balance');
            return;
        }

        try {
            setLoading(true);
            const res = await requestWithdrawal({
                amount: Number(amount),
                paymentMethod: 'bank_transfer'
            });

            if (res.success) {
                onSuccess();
                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit withdrawal request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Withdraw Money"
            subtitle={`Available: ₹${availableBalance.toLocaleString()}`}
            maxWidth="max-w-md"
        >
            <div className="space-y-6">
                <div className="mb-6 -mt-4">
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                        <span className="material-symbols-outlined text-4xl font-black">payments</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Input
                            label="Amount (₹)"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            icon="currency_rupee"
                            disabled={loading}
                        />
                        {error && <p className="text-xs font-black text-red-500 pl-1">{error}</p>}
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100">
                            <span className="material-symbols-outlined text-slate-400 text-lg">account_balanced_wallet</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Withdraw to</p>
                            <p className="text-xs font-bold text-slate-700">Bank Account</p>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full flex items-center justify-center gap-2 py-4 shadow-xl shadow-green-200"
                        icon="arrow_forward"
                        iconPosition="right"
                    >
                        Confirm Withdrawal
                    </Button>

                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                        Transaction fees may apply per payout
                    </p>
                </form>
            </div>
        </Modal>
    );
};

export default WithdrawalModal;
