import React, { useState } from 'react';
import ReactDOM from 'react-dom';
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

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl animate-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <span className="material-symbols-outlined font-black">close</span>
                </button>

                <div className="mb-6">
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                        <span className="material-symbols-outlined text-4xl font-black">payments</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Withdraw Money</h3>
                    <p className="text-slate-500 font-bold text-sm mt-1">Available: ₹{availableBalance.toLocaleString()}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Amount (₹)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">₹</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="w-full pl-8 pr-4 py-4 bg-slate-50 border-2 border-slate-50 focus:border-green-500 focus:bg-white rounded-2xl outline-none text-lg font-black text-slate-900 transition-all"
                                disabled={loading}
                            />
                        </div>
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl font-black shadow-xl shadow-green-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        ) : (
                            <>
                                Confirm Withdrawal
                                <span className="material-symbols-outlined font-black">arrow_forward</span>
                            </>
                        )}
                    </button>

                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
                        Transaction fees may apply per payout
                    </p>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default WithdrawalModal;
