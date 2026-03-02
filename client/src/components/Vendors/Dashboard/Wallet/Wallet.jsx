import React, { useState, useEffect } from 'react';
import api from '../../../../api/axios';
import SharedWallet from '../../../common/Wallet/SharedWallet';

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

    const primaryActions = (
        <>
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
        </>
    );

    const statsCards = [
        {
            title: "Available Credit",
            amount: availableCredit,
            icon: "verified",
            bgClass: "bg-emerald-50",
            textClass: "text-emerald-600",
            extraContent: (
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
            )
        },
        {
            title: "Pending Dues",
            amount: wallet.creditUsed,
            icon: "receipt_long",
            bgClass: "bg-indigo-50",
            textClass: "text-indigo-600",
            extraContent: (
                <button className="mt-2 text-[10px] font-black text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors uppercase tracking-widest">
                    Pay Now
                </button>
            )
        }
    ];

    const rightPanelComponent = (
        <>
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
        </>
    );

    return (
        <SharedWallet
            title="Finance & Wallet"
            subtitle="Manage your wallet balance and credit limits"
            themeColor="indigo"
            balanceTitle="Available Balance"
            balanceAmount={wallet.balance}
            balanceBadge="Active Wallet"
            primaryActions={primaryActions}
            statsCards={statsCards}
            transactions={transactions}
            onExportCSV={exportCSV}
            rightPanelComponent={rightPanelComponent}
            loading={loading}
        />
    );
};

export default Wallet;
