import React, { useState, useEffect } from 'react';
import api from '../../../../api/axios';

const Wallet = () => {
    const [loading, setLoading] = useState(true);
    const [wallet, setWallet] = useState({
        balance: 0,
        creditLimit: 0,
        creditUsed: 0
    });

    const transactions = [
        { id: 'TXN-001', date: '2023-10-27', type: 'Payment', amount: -2700, status: 'Success', details: 'Order #ORD-9012' },
        { id: 'TXN-002', date: '2023-10-26', type: 'Topup', amount: 5000, status: 'Success', details: 'Added via UPI' },
        { id: 'TXN-003', date: '2023-10-20', type: 'Credit Use', amount: -1500, status: 'Success', details: 'Order #ORD-8711' },
    ];

    useEffect(() => {
        setTimeout(() => {
            setWallet({ balance: 4500, creditLimit: 20000, creditUsed: 1500 });
            setLoading(false);
        }, 800);
    }, []);

    const availableCredit = wallet.creditLimit - wallet.creditUsed;
    const creditUsagePercentage = (wallet.creditUsed / wallet.creditLimit) * 100;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Finance</h1>
                <p className="text-slate-500 font-medium mt-1">Manage wallet balance, credit limits, and transactions.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Wallet Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">

                            {/* Wallet Balance Card */}
                            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/20 flex flex-col justify-between min-h-[220px]">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <h3 className="text-slate-400 font-semibold text-sm tracking-wider uppercase mb-1">Available Balance</h3>
                                        <div className="text-4xl sm:text-5xl font-black tracking-tight">₹{wallet.balance}</div>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                                        <span className="material-symbols-outlined text-white text-2xl">account_balance_wallet</span>
                                    </div>
                                </div>
                                <div className="relative z-10 mt-8 flex flex-wrap gap-3">
                                    <button className="flex-1 min-w-[120px] bg-white text-slate-900 px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shadow-lg shadow-white/10 active:scale-95">
                                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                                        Topup Wallet
                                    </button>
                                    <button className="flex-1 min-w-[120px] bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors active:scale-95">
                                        <span className="material-symbols-outlined text-[20px]">account_balance</span>
                                        Withdraw
                                    </button>
                                </div>
                            </div>

                            {/* Credit Line Card */}
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-500/20 flex flex-col justify-between min-h-[220px]">
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/4"></div>
                                <div className="relative z-10 flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-emerald-100 font-semibold text-sm tracking-wider uppercase mb-1 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px]">verified</span>
                                            Udhaar Limit
                                        </h3>
                                        <div className="text-3xl sm:text-4xl font-black tracking-tight">₹{availableCredit}</div>
                                        <p className="text-sm text-emerald-100 mt-1 font-medium">Available to spend</p>
                                    </div>
                                </div>
                                <div className="relative z-10 w-full space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-emerald-50">
                                        <span>Used: ₹{wallet.creditUsed}</span>
                                        <span>Max: ₹{wallet.creditLimit}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-1000"
                                            style={{ width: `${creditUsagePercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Transaction History */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">history</span>
                                Recent Transactions
                            </h3>

                            <div className="space-y-4">
                                {transactions.map((txn, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border 
                        ${txn.amount > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                <span className="material-symbols-outlined">
                                                    {txn.amount > 0 ? 'call_received' : 'call_made'}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{txn.type}</h4>
                                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-0.5">
                                                    <span>{txn.date}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                    <span>{txn.details}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-black text-lg ${txn.amount > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                                                {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount)}
                                            </p>
                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-0.5">{txn.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 py-3 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                                View All Transactions
                            </button>
                        </div>
                    </div>

                    {/* Right Sidebar - Actions & Tips */}
                    <div className="space-y-6">

                        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <span className="material-symbols-outlined text-9xl text-blue-500">trending_up</span>
                            </div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm text-blue-600 flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-800 mb-2">Increase Udhaar Limit</h3>
                                <p className="text-slate-600 text-sm font-medium mb-6">Pay your pending credit dues on time for 3 consecutive months to unlock limits up to ₹1,00,000.</p>
                                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-600/20 transition-all active:scale-95">
                                    Check Eligibility
                                </button>
                            </div>
                        </div>

                        <div className="bg-white border text-center border-slate-100 rounded-3xl p-6 shadow-sm">
                            <div className="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                                <span className="material-symbols-outlined text-3xl text-slate-400">account_balance</span>
                            </div>
                            <h3 className="font-bold text-slate-800 mb-1">Bank Account</h3>
                            <p className="text-sm text-slate-500 mb-4">Required for withdrawals</p>
                            <button className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors w-full">
                                + Add Bank Details
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;
