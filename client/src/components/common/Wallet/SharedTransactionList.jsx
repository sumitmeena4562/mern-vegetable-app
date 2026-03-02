import React from 'react';

const SharedTransactionList = ({ transactions, themeColor = "green" }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-3 opacity-20">history</span>
                <p className="text-sm font-bold uppercase tracking-widest opacity-50">No transactions yet</p>
            </div>
        );
    }

    const getColorClass = (type, amount) => {
        // Vendor uses amount > 0 for credit
        if (type === 'credit' || amount > 0) {
            return themeColor === 'indigo' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-green-50 text-green-600 border-green-100';
        }
        if (type === 'payout' || amount < 0) {
            return themeColor === 'indigo' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100';
        }
        return 'bg-slate-50 text-slate-500 border-slate-100';
    };

    const getIcon = (type, amount) => {
        if (themeColor === 'indigo') {
            return amount > 0 ? 'arrow_downward' : 'arrow_upward';
        }
        return type === 'credit' ? 'add' : type === 'payout' ? 'outbox' : 'payments';
    };

    return (
        <div className="space-y-4">
            {transactions.map((txn, idx) => {
                const isCredit = txn.type === 'credit' || txn.amount > 0;
                return (
                    <div
                        key={txn._id || idx}
                        className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer hover:-translate-y-0.5"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner group-hover:scale-110 transition-transform duration-300 ${getColorClass(txn.type, txn.amount)}`}>
                                <span className="material-symbols-outlined text-[28px]">
                                    {getIcon(txn.type, txn.amount)}
                                </span>
                            </div>
                            <div>
                                <h4 className={`font-black text-slate-800 text-lg group-hover:text-${themeColor}-600 transition-colors`}>
                                    {txn.description || (isCredit ? 'Payment Received' : 'Withdrawal Request')}
                                </h4>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                                    <span>{new Date(txn.createdAt).toLocaleDateString()}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                    <span>{txn.status || txn.type}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className={`font-black text-xl ${isCredit ? (themeColor === 'indigo' ? 'text-emerald-500' : 'text-green-600') : 'text-slate-800'}`}>
                                {isCredit ? '+' : (txn.type === 'payout' ? '-' : '')}₹{Math.abs(txn.amount).toLocaleString()}
                            </p>
                            <div className={`inline-flex items-center px-2 py-0.5 rounded-lg ${isCredit ? (themeColor === 'indigo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-green-50 text-green-600 border-green-100') : 'bg-slate-50 text-slate-600 border-slate-100'} text-[10px] font-black uppercase tracking-widest mt-1 border`}>
                                {txn.status || 'COMPLETED'}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SharedTransactionList;
