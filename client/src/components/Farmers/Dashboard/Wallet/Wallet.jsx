import React, { useState, useEffect } from 'react';
import { getWalletStats, getTransactionHistory, requestWithdrawal } from '@/api/userApi';
import TransactionList from './TransactionList';
import WithdrawalModal from './WithdrawalModal';

const Wallet = () => {
    const [stats, setStats] = useState({ balance: 0, totalEarned: 0, pendingPayouts: 0 });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            setLoading(true);
            const [statsRes, transRes] = await Promise.all([
                getWalletStats(),
                getTransactionHistory()
            ]);
            if (statsRes.success) setStats(statsRes.data);
            if (transRes.success) setTransactions(transRes.data);
        } catch (error) {
            console.error("Wallet loading error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 animate-pulse">
                <div className="h-48 bg-slate-100 rounded-[32px] mb-6 shadow-sm"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-32 bg-slate-100 rounded-2xl"></div>
                    <div className="h-32 bg-slate-100 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-8 relative z-10 animate-in fade-in duration-500">

            {/* Page Header */}
            <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Finance & Wallet</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">Manage your earnings and payout requests</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Side: Stats & Main Wallet Card */}
                <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6">

                    {/* Main Wallet Balance Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 rounded-[32px] p-8 text-white shadow-2xl shadow-green-500/20 group">
                        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <p className="text-green-100/80 text-xs font-black uppercase tracking-widest mb-1">Available for Withdrawal</p>
                                <h3 className="text-[3.5rem] font-black leading-none tracking-tighter mb-4">₹{stats.balance.toLocaleString()}</h3>
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-wider">
                                        Wallet Secured
                                    </div>
                                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-wider">
                                        Next Payout: 25 Feb
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowWithdrawModal(true)}
                                className="w-full md:w-auto px-10 py-4 bg-white text-green-700 rounded-2xl font-black shadow-xl shadow-green-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn"
                            >
                                <span className="material-symbols-outlined font-black group-hover/btn:translate-x-1 transition-transform">payments</span>
                                Withdraw Money
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Total Earnings Card */}
                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                <span className="material-symbols-outlined text-3xl font-bold">trending_up</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifetime Earnings</p>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight">₹{stats.totalEarned.toLocaleString()}</h4>
                            </div>
                        </div>

                        {/* Pending Payouts Card */}
                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <span className="material-symbols-outlined text-3xl font-bold">hourglass_empty</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Payouts</p>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight">₹{stats.pendingPayouts.toLocaleString()}</h4>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Section */}
                    <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[32px] p-6 shadow-xl shadow-slate-200/20">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Transactions</h3>
                            <button className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 hover:bg-green-100 transition-colors uppercase tracking-widest">Export History</button>
                        </div>

                        <TransactionList transactions={transactions} />
                    </div>

                </div>

                {/* Right Side: Quick Actions & Help */}
                <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-6">
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl"></div>
                        <h3 className="text-xl font-black mb-4 relative z-10 tracking-tight">Bank Details</h3>
                        <div className="space-y-4 relative z-10">
                            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Active Account</p>
                                <p className="text-sm font-bold">State Bank of India</p>
                                <p className="text-xs text-white/60">末 4329 (Ramesh Kumar)</p>
                            </div>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                                Change Bank Account
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20">
                        <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Help & Support</h3>
                        <div className="space-y-3">
                            {[
                                { icon: 'help', text: 'Payout Cycle & Fees' },
                                { icon: 'info', text: 'Transaction Issues?' },
                                { icon: 'security', text: 'Wallet Security Tips' }
                            ].map((item, idx) => (
                                <button key={idx} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-green-600 transition-colors">{item.icon}</span>
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{item.text}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                            <span className="material-symbols-outlined text-blue-500">lightbulb</span>
                            <p className="text-[11px] font-bold text-blue-700 leading-relaxed">
                                Tip: Sell more during peak demand to earn higher margins. Check Buyer Demand for insights.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {showWithdrawModal && (
                <WithdrawalModal
                    onClose={() => setShowWithdrawModal(false)}
                    availableBalance={stats.balance}
                    onSuccess={fetchWalletData}
                />
            )}
        </div>
    );
};

export default Wallet;
