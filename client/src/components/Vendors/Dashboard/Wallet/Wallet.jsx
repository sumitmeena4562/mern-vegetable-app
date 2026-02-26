import React, { useState, useEffect } from 'react';
import api from '../../../../api/axios';

const Wallet = () => {
    const [loading, setLoading] = useState(true);
    const [wallet, setWallet] = useState({
        balance: 0,
        creditLimit: 0,
        creditUsed: 0
    });

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            const [statsRes, txnsRes] = await Promise.all([
                api.get('/vendors/wallet/stats'),
                api.get('/vendors/wallet/transactions')
            ]);

            if (statsRes.data.success) {
                setWallet(statsRes.data.data);
            }
            if (txnsRes.data.success) {
                setTransactions(txnsRes.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch wallet data:", error);
        } finally {
            setLoading(false);
        }
    };

    const availableCredit = (wallet.creditLimit || 0) - (wallet.creditUsed || 0);
    const creditUsagePercentage = wallet.creditLimit > 0 ? ((wallet.creditUsed || 0) / wallet.creditLimit) * 100 : 0;

    const exportCSV = () => {
        if (!transactions.length) return;
        const headers = ['Date', 'Type', 'Description', 'Amount', 'Status'];
        const rows = transactions.map(t => [
            new Date(t.createdAt).toLocaleDateString(),
            t.type || '',
            (t.description || '').replace(/,/g, ' '),
            t.amount || 0,
            t.status || '',
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
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
                <p className="text-slate-500 font-medium text-sm mt-1">Manage your wallet balance and credit limits</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Side: Stats & Main Wallet Card */}
                <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6">

                    {/* Main Wallet Balance Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-500/20 group">
                        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <p className="text-indigo-100/80 text-xs font-black uppercase tracking-widest mb-1">Available Balance</p>
                                <h3 className="text-[3.5rem] font-black leading-none tracking-tighter mb-4">₹{wallet.balance.toLocaleString()}</h3>
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-wider">
                                        Active Wallet
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                <button
                                    className="flex-1 md:w-auto px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black shadow-xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    <span className="material-symbols-outlined font-black group-hover/btn:scale-110 transition-transform">add_circle</span>
                                    Topup
                                </button>
                                <button
                                    className="flex-1 md:w-auto px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black hover:bg-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined font-black">payments</span>
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Credit Line Card */}
                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                <span className="material-symbols-outlined text-3xl font-bold">verified</span>
                            </div>
                            <div className="w-full">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Credit</p>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight">₹{availableCredit.toLocaleString()}</h4>
                                <div className="mt-2 w-full">
                                    <div className="flex justify-between text-[9px] font-black text-slate-500 tracking-wider mb-1">
                                        <span>USED: ₹{wallet.creditUsed}</span>
                                        <span>MAX: ₹{wallet.creditLimit}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${creditUsagePercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Usage Card */}
                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <span className="material-symbols-outlined text-3xl font-bold">receipt_long</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Dues</p>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight">₹{wallet.creditUsed.toLocaleString()}</h4>
                                <button className="mt-2 text-[10px] font-black text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors uppercase tracking-widest">
                                    Pay Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Section */}
                    <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[32px] p-6 shadow-xl shadow-slate-200/20">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Transactions</h3>
                            <button onClick={exportCSV} className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors uppercase tracking-widest flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">download</span>
                                Export CSV
                            </button>
                        </div>

                        <div className="space-y-3">
                            {transactions.map((txn, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer hover:-translate-y-0.5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner group-hover:scale-110 transition-transform duration-300
                    ${txn.amount > 0 ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                                            <span className="material-symbols-outlined text-[28px]">
                                                {txn.amount > 0 ? 'arrow_downward' : 'arrow_upward'}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{txn.type}</h4>
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                                                <span>{new Date(txn.createdAt).toLocaleDateString()}</span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                <span>{txn.description}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-black text-xl ${txn.amount > 0 ? 'text-emerald-500' : 'text-slate-800'}`}>
                                            {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount)}
                                        </p>
                                        <div className="inline-flex items-center px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mt-1 border border-emerald-100">
                                            {txn.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Side: Quick Actions & Help */}
                <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-6">
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        <h3 className="text-xl font-black mb-4 relative z-10 tracking-tight">Purchase Credit</h3>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined text-3xl">workspace_premium</span>
                            </div>
                            <p className="text-slate-300 text-sm font-medium mb-6 leading-relaxed">Increase your credit limit by maintaining a good payment history and clearing dues on time.</p>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                Check Eligibility
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20">
                        <h3 className="text-lg font-black text-slate-900 mb-4 tracking-tight">Help & Support</h3>
                        <div className="space-y-3">
                            {[
                                { icon: 'help', text: 'Credit Limits & Rules' },
                                { icon: 'info', text: 'Transaction Issues?' },
                                { icon: 'security', text: 'Secure Payments' }
                            ].map((item, idx) => (
                                <button key={idx} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-600 transition-colors">{item.icon}</span>
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{item.text}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                                </button>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                            <span className="material-symbols-outlined text-indigo-500">lightbulb</span>
                            <p className="text-[11px] font-bold text-indigo-700 leading-relaxed">
                                Tip: Keep your wallet funded to ensure smooth purchases when market prices are favorable.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
