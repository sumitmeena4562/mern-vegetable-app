import React from 'react';
import SharedTransactionList from './SharedTransactionList';

const SharedWallet = ({
    title = "Finance & Wallet",
    subtitle = "Manage your earnings and balance",
    themeColor = "green",
    balanceTitle = "Available Balance",
    balanceAmount = 0,
    balanceBadge = "Wallet Secured",
    primaryActions = null, // e.g <button>Withdraw</button>
    statsCards = [], // Array of { title, amount, icon, bgClass, textClass, extraContent }
    transactions = [],
    onExportCSV,
    rightPanelComponent = null,
    loading = false
}) => {

    if (loading) {
        return (
            <div className="p-6 animate-pulse">
                <div className={`h-48 bg-slate-100 rounded-[32px] mb-6 shadow-sm`}></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-32 bg-slate-100 rounded-2xl"></div>
                    <div className="h-32 bg-slate-100 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    const gradients = {
        green: "from-green-600 via-green-700 to-emerald-800 shadow-green-500/20",
        indigo: "from-indigo-600 via-indigo-700 to-blue-800 shadow-indigo-500/20"
    };

    const gradientClass = gradients[themeColor] || gradients.green;

    const blurColors = {
        green: ["bg-white/10", "bg-emerald-400/10"],
        indigo: ["bg-white/10", "bg-blue-400/10"]
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-8 relative z-10 animate-in fade-in duration-500">
            {/* Page Header */}
            <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                <p className="text-slate-500 font-medium text-sm mt-1">{subtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Stats & Main Wallet Card */}
                <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6">

                    {/* Main Wallet Balance Card */}
                    <div className={`relative overflow-hidden bg-gradient-to-br ${gradientClass} rounded-[32px] p-8 text-white shadow-2xl group`}>
                        <div className={`absolute -right-16 -top-16 w-64 h-64 ${blurColors[themeColor][0]} rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000`}></div>
                        <div className={`absolute -left-16 -bottom-16 w-64 h-64 ${blurColors[themeColor][1]} rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000`}></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <p className={`text-${themeColor}-100/80 text-xs font-black uppercase tracking-widest mb-1`}>{balanceTitle}</p>
                                <h3 className="text-[3.5rem] font-black leading-none tracking-tighter mb-4">₹{balanceAmount.toLocaleString()}</h3>
                                <div className="flex items-center gap-3">
                                    {balanceBadge && (
                                        <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-wider">
                                            {balanceBadge}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 w-full md:w-auto">
                                {primaryActions}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {statsCards.map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-5">
                                <div className={`w-14 h-14 ${stat.bgClass} rounded-2xl flex items-center justify-center ${stat.textClass}`}>
                                    <span className="material-symbols-outlined text-3xl font-bold">{stat.icon}</span>
                                </div>
                                <div className="w-full">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                                    <h4 className="text-2xl font-black text-slate-800 tracking-tight">₹{stat.amount.toLocaleString()}</h4>
                                    {stat.extraContent}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Transaction Section */}
                    <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[32px] p-6 shadow-xl shadow-slate-200/20">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Transactions</h3>
                            <button onClick={onExportCSV} className={`text-[10px] font-black text-${themeColor}-600 bg-${themeColor}-50 px-3 py-1.5 rounded-full border border-${themeColor}-100 hover:bg-${themeColor}-100 transition-colors uppercase tracking-widest flex items-center gap-1`}>
                                <span className="material-symbols-outlined text-sm">download</span>
                                Export CSV
                            </button>
                        </div>
                        <SharedTransactionList transactions={transactions} themeColor={themeColor} />
                    </div>

                </div>

                {/* Right Side */}
                <div className="lg:col-span-12 xl:col-span-4 flex flex-col gap-6">
                    {rightPanelComponent}
                </div>
            </div>
        </div>
    );
};

export default SharedWallet;
