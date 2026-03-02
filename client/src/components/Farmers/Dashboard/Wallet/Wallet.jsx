import React, { useState, useEffect } from 'react';
import { getWalletStats, getTransactionHistory } from '@/api/userApi';
import api from '@/api/axios';
import WithdrawalModal from './WithdrawalModal';
import BankDetailsModal from './BankDetailsModal';
import SharedWallet from '../../../common/Wallet/SharedWallet';

const Wallet = () => {
    const [stats, setStats] = useState({ balance: 0, totalEarned: 0, pendingPayouts: 0 });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showBankModal, setShowBankModal] = useState(false);
    const [bankDetails, setBankDetails] = useState(null);

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

            // Fetch farmer profile for bank details
            try {
                const profileRes = await api.get('/farmers/profile');
                if (profileRes.data?.success && profileRes.data?.data?.bankDetails) {
                    setBankDetails(profileRes.data.data.bankDetails);
                }
            } catch { /* Bank details not available yet */ }
        } catch (error) {
            console.error("Wallet loading error:", error);
        } finally {
            setLoading(false);
        }
    };

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
        <button
            onClick={() => setShowWithdrawModal(true)}
            className="w-full md:w-auto px-10 py-4 bg-white text-green-700 rounded-2xl font-black shadow-xl shadow-green-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn"
        >
            <span className="material-symbols-outlined font-black group-hover/btn:translate-x-1 transition-transform">payments</span>
            Withdraw Money
        </button>
    );

    const statsCards = [
        {
            title: "Lifetime Earnings",
            amount: stats.totalEarned,
            icon: "trending_up",
            bgClass: "bg-green-50",
            textClass: "text-green-600",
        },
        {
            title: "Pending Payouts",
            amount: stats.pendingPayouts,
            icon: "hourglass_empty",
            bgClass: "bg-blue-50",
            textClass: "text-blue-600",
        }
    ];

    const rightPanelComponent = (
        <>
            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl"></div>
                <h3 className="text-xl font-black mb-4 relative z-10 tracking-tight">Bank Details</h3>
                <div className="space-y-4 relative z-10">
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1">Active Account</p>
                        {bankDetails ? (
                            <>
                                <p className="text-sm font-bold">{bankDetails.bankName || 'Bank Name'}</p>
                                <p className="text-xs text-white/60">*** {(bankDetails.accountNumber || '').slice(-4)} ({bankDetails.accountHolderName || 'Account Holder'})</p>
                            </>
                        ) : (
                            <p className="text-xs text-white/60">No bank account linked yet</p>
                        )}
                    </div>
                    <button
                        onClick={() => setShowBankModal(true)}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        {bankDetails ? 'Change Bank Account' : 'Add Bank Account'}
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
        </>
    );

    return (
        <>
            <SharedWallet
                title="Finance & Wallet"
                subtitle="Manage your earnings and payout requests"
                themeColor="green"
                balanceTitle="Available for Withdrawal"
                balanceAmount={stats.balance}
                balanceBadge={stats.pendingPayouts > 0 ? `Payout Pending: ₹${stats.pendingPayouts.toLocaleString()}` : 'Wallet Secured'}
                primaryActions={primaryActions}
                statsCards={statsCards}
                transactions={transactions}
                onExportCSV={exportCSV}
                rightPanelComponent={rightPanelComponent}
                loading={loading}
            />

            {showWithdrawModal && (
                <WithdrawalModal
                    onClose={() => setShowWithdrawModal(false)}
                    availableBalance={stats.balance}
                    onSuccess={fetchWalletData}
                />
            )}

            {showBankModal && (
                <BankDetailsModal
                    onClose={() => setShowBankModal(false)}
                    existingDetails={bankDetails}
                    onSuccess={fetchWalletData}
                />
            )}
        </>
    );
};

export default Wallet;
