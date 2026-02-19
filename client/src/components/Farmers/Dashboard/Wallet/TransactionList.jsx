import React from 'react';

const TransactionList = ({ transactions }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-3 opacity-20">history</span>
                <p className="text-sm font-bold uppercase tracking-widest opacity-50">No transactions yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map((txn, idx) => (
                <div
                    key={txn._id || idx}
                    className="flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-2xl border border-transparent hover:border-slate-100 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${txn.type === 'credit'
                                ? 'bg-green-50 text-green-600'
                                : txn.type === 'payout'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'bg-slate-50 text-slate-500'
                            }`}>
                            <span className="material-symbols-outlined">
                                {txn.type === 'credit' ? 'add' : txn.type === 'payout' ? 'outbox' : 'payments'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-800 tracking-tight">
                                {txn.description || (txn.type === 'credit' ? 'Payment Received' : 'Withdrawal Request')}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(txn.createdAt).toLocaleDateString()}</p>
                                <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{txn.status}</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className={`text-sm font-black tracking-tight ${txn.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                            {txn.type === 'credit' ? '+' : '-'} ₹{txn.amount.toLocaleString()}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">ID: {txn.transactionId}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TransactionList;
